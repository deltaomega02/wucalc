'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/* ════════════════════════════════════════════════════════════
   Caustics Field — 페이지 전체가 빛이 굴절되는 수면이 된다.
   - 아이보리 수면 위에 금빛 caustic 빛그물이 천천히 일렁인다
     (클래식 water caustic 패턴 + 골드/청록 색분산 프린지)
   - 클릭/탭: 그 지점에서 파문이 빛그물을 일그러뜨리며 광휘가 퍼진다
   - 호버 트레일: 미세한 굴절 일렁임
   - 불투명 출력 — 이 캔버스 자체가 페이지의 "물 바닥"이고,
     위에 뜬 유리 카드(backdrop-blur)로 빛이 비쳐 보인다
   - prefers-reduced-motion 이면 미마운트 ─────────────────────── */

const MAX_RIPPLES = 16;
const RIPPLE_LIFE = 5.0;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform float uIntensity;
  uniform float uLightMode; // 1 = 투영광 모드(검정 위 빛만 — screen 블렌드용)
  uniform vec4 uRipples[${MAX_RIPPLES}]; // xy=uv origin, z=startTime(-1=off), w=amp

  /* 클래식 tileable water caustic — 도메인 왜곡 반복 */
  float caustic(vec2 p, float t) {
    vec2 i = p;
    float c = 0.0;
    const float inten = 0.005;
    for (int n = 0; n < 4; n++) {
      float tt = t * (1.0 - 3.5 / float(n + 1));
      i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
      c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
    }
    c /= 4.0;
    c = 1.17 - pow(c, 1.4);
    return pow(abs(c), 8.0);
  }

  void main() {
    vec2 uv = vec2(vUv.x * uAspect, vUv.y);
    float t = uTime * 0.32; // 느린 일렁임

    // ── 파문: 빛그물 도메인을 굴절시키고 크레스트에 광휘 ──
    vec2 disp = vec2(0.0);
    float boost = 0.0;
    for (int k = 0; k < ${MAX_RIPPLES}; k++) {
      float t0 = uRipples[k].z;
      if (t0 < 0.0) continue;
      float age = uTime - t0;
      if (age <= 0.0 || age > ${RIPPLE_LIFE.toFixed(1)}) continue;
      float amp = uRipples[k].w;
      vec2 o = vec2(uRipples[k].x * uAspect, uRipples[k].y);
      float d = distance(uv, o);
      vec2 dir = d > 1e-4 ? (uv - o) / d : vec2(0.0);
      float R = (0.55 + 0.45 * amp) * (1.0 - exp(-age * 0.85));
      float env = exp(-age * (0.65 + (1.0 - amp) * 1.3)) * amp;
      float front = exp(-pow((d - R) * 55.0, 2.0));
      float train = (d < R) ? sin((R - d) * 42.0 - age * 2.2) * exp(-(R - d) * 4.5) : 0.0;
      disp += dir * (front * 0.16 + train * 0.07) * env;
      boost += front * env;
    }

    // ── caustic 빛그물 + 색분산 (골드/청록 프린지) ──
    vec2 p = (uv + disp) * 5.6;
    float cw = caustic(p, t);                       // 중심광 (웜 화이트)
    float cg = caustic(p * 0.986 - 0.035, t * 0.97); // 골드 프린지
    float cc = caustic(p * 1.014 + 0.035, t * 1.03); // 청록 프린지

    float light = cw + cg * 0.5 + cc * 0.4;

    if (uLightMode > 0.5) {
      // ── 투영광 모드 (multiply 블렌드): 1.0 = 무효과.
      //    물그늘이 콘텐츠 위에 일렁이고, 빛그물은 그늘이 걷힌 밝은 길.
      //    흰 배경에서도 빛/그늘 대비가 보이는 물리적으로 옳은 방식 ──
      float lit = clamp(light * 1.7, 0.0, 1.0);
      vec3 shadeTint = mix(vec3(1.0), vec3(0.930, 0.941, 0.952), uIntensity); /* 청회 그늘 */
      vec3 col = mix(shadeTint, vec3(1.0), lit);
      /* 색분산 프린지 — 빛 가장자리에 골드/시안 미세 틴트 */
      col *= mix(vec3(1.0), vec3(1.000, 0.972, 0.905), clamp(cg * 0.9, 0.0, 1.0) * uIntensity);
      col *= mix(vec3(1.0), vec3(0.945, 0.995, 1.000), clamp(cc * 0.7, 0.0, 1.0) * uIntensity);
      /* 클릭 광휘 — 파면이 지나는 곳의 그늘이 걷힌다 */
      col = mix(col, vec3(1.0), clamp(boost * 1.2, 0.0, 1.0));
      gl_FragColor = vec4(col, 1.0);
      return;
    }

    // ── 수면 모드: 종이 위 물그늘 + 빛그물 (불투명 배경) ──
    vec3 paper = vec3(0.969, 0.965, 0.953);  /* #F7F6F3 */
    vec3 shadeCol = vec3(0.908, 0.912, 0.922); /* 옅은 청회 물그늘 */
    float shade = 1.0 - clamp(light * 1.8, 0.0, 1.0);
    vec3 col = mix(paper, shadeCol, shade * 0.75 * uIntensity);

    col += vec3(0.985, 0.905, 0.640) * cw * 0.34 * uIntensity; /* 골드빛 web */
    col += vec3(0.930, 0.780, 0.360) * cg * 0.15 * uIntensity;
    col += vec3(0.430, 0.800, 0.930) * cc * 0.11 * uIntensity;
    col += vec3(1.0, 0.95, 0.78) * boost * 0.30;               /* 클릭 광휘 */

    gl_FragColor = vec4(col, 1.0);
  }
`;

interface RippleRequest {
  x: number;
  y: number;
  amp: number;
}

function CausticsPlane({
  queueRef,
  intensity,
  light,
}: {
  queueRef: React.RefObject<RippleRequest[]>;
  intensity: number;
  light: boolean;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const slotRef = useRef(0);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uIntensity: { value: intensity },
      uLightMode: { value: light ? 1 : 0 },
      uRipples: {
        value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, -1, 0)),
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame(({ clock }) => {
    const mat = matRef.current;
    if (!mat) return;
    const t = clock.getElapsedTime();
    mat.uniforms.uTime.value = t;
    mat.uniforms.uAspect.value = size.width / Math.max(size.height, 1);

    const queue = queueRef.current;
    while (queue && queue.length > 0) {
      const req = queue.shift()!;
      const slot = slotRef.current % MAX_RIPPLES;
      (mat.uniforms.uRipples.value[slot] as THREE.Vector4).set(req.x, req.y, t, req.amp);
      slotRef.current++;
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export function CausticsField({
  className = '',
  intensity = 1,
  light = false,
}: {
  className?: string;
  intensity?: number;
  /** true: 콘텐츠 위에 얹는 투영광 레이어 (mix-blend-screen과 함께 사용) */
  light?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const queueRef = useRef<RippleRequest[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);

    const toUv = (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      // 컨테이너(히어로) 영역 밖의 입력은 무시
      if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom)
        return null;
      return {
        x: (clientX - r.left) / r.width,
        y: 1 - (clientY - r.top) / r.height,
      };
    };

    const onDown = (e: PointerEvent) => {
      const uv = toUv(e.clientX, e.clientY);
      if (uv) queueRef.current.push({ ...uv, amp: 1 });
    };

    let lastTrail = 0;
    let lastX = -1;
    let lastY = -1;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastTrail < 90) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (dx * dx + dy * dy < 45 * 45) return;
      const uv = toUv(e.clientX, e.clientY);
      if (!uv) return;
      lastTrail = now;
      lastX = e.clientX;
      lastY = e.clientY;
      queueRef.current.push({ ...uv, amp: 0.3 });
    };

    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div ref={containerRef} className={`pointer-events-none ${className}`} aria-hidden>
      {enabled && (
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        >
          <CausticsPlane queueRef={queueRef} intensity={intensity} light={light} />
        </Canvas>
      )}
    </div>
  );
}
