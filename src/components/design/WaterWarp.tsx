'use client';

import { useEffect, useRef } from 'react';

/* ════════════════════════════════════════════════════════════
   Water Warp — 본문 전체가 수면에 투영된 영상처럼 일렁인다.
   - 노이즈(feTurbulence)는 정적 캐시 — baseFrequency를 애니메이션하면
     매 프레임 페이지 전체 노이즈를 재생성해 치명적으로 느려진다
   - 대신 변위 강도(scale)만 12fps로 사인 호흡 → 필터 재적용 비용 최소
   - 성능 가드: 평균 프레임이 42ms를 넘으면 워프를 스스로 해제(우아한 강등)
   - prefers-reduced-motion 이면 부착하지 않음 ───────────────── */

const UPDATE_INTERVAL = 1000 / 12;
const SCALE_BASE = 7.5;
const SCALE_SWING = 3.0;
const SPEED = 0.35;

export default function WaterWarp() {
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const main = document.getElementById('main-content');
    main?.classList.add('water-warp');

    let rafId = 0;
    let lastUpdate = 0;
    let lastFrame = performance.now();
    let slowFrames = 0;
    let degraded = false;

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);

      // 성능 가드 — 지속적 프레임 저하 시 워프 해제
      const dt = now - lastFrame;
      lastFrame = now;
      if (dt > 42) {
        if (++slowFrames > 90 && !degraded) {
          degraded = true;
          main?.classList.remove('water-warp');
          cancelAnimationFrame(rafId);
        }
      } else if (slowFrames > 0) {
        slowFrames--;
      }

      if (now - lastUpdate < UPDATE_INTERVAL) return;
      lastUpdate = now;
      const t = now / 1000;
      const scale = SCALE_BASE + Math.sin(t * SPEED) * SCALE_SWING;
      dispRef.current?.setAttribute('scale', scale.toFixed(2));
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      main?.classList.remove('water-warp');
    };
  }, []);

  return (
    <svg aria-hidden className="absolute h-0 w-0 overflow-hidden">
      <defs>
        <filter id="water-warp-filter" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0032 0.0058"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="noise"
            scale={SCALE_BASE}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
