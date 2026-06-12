'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';
import { waveEngine } from '@/lib/waveEngine';

/* ════════════════════════════════════════════════════════════
   Buoyancy Manager — 컴포넌트가 수면 위에 떠 있게 만든다.
   게임 엔진의 부력 기법: 파동 필드의 높이를 각 요소 중심에서
   샘플링 → 수직 변위(떠오름) + 기울기(기울임·밀려남)를 CSS 변수로 주입.
   - 대상: .tile / .coast-card / [data-buoy]
   - 클릭 → 강한 파문이 지나가며 주변 카드가 들리고 밀려난다
   - 호버 트레일 → 미세 파문
   - 항상 잔잔한 idle swell로 모든 카드가 미세하게 호흡한다
   - GPU 합성 transform만 사용(레이아웃 리플로 없음), reduced-motion 시 비활성 ── */

interface BuoyState {
  tx: number;
  ty: number;
  rx: number;
  ry: number;
  phase: number;
}

const LIFT_PX = 9; // 크레스트 통과 시 최대 떠오름
const PUSH_PX = 95; // 기울기 → 수평 밀림 계수
const TILT_DEG = 55; // 기울기 → 회전 계수
const SAMPLE_EPS = 16; // 기울기 수치미분 간격(px)
const SMOOTH = 0.12; // 스프링 추종 계수

export default function BuoyancyManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const states = new Map<HTMLElement, BuoyState>();

    const collect = () => {
      const els = document.querySelectorAll<HTMLElement>('.tile, .coast-card, [data-buoy]');
      els.forEach((el) => {
        if (!states.has(el)) {
          states.set(el, { tx: 0, ty: 0, rx: 0, ry: 0, phase: Math.random() * Math.PI * 2 });
        }
      });
    };
    collect();
    // 라우트 전환 직후 + 필터로 인한 재마운트 대비 주기 재수집
    const rescan = setInterval(collect, 1200);

    // 파문 입력 — CausticsField(투영광 셰이더)와 같은 이벤트를 같은 좌표로 받는다
    const onDown = (e: PointerEvent) => waveEngine.add(e.clientX, e.clientY, 1);
    let lastTrail = 0;
    let lastX = -1;
    let lastY = -1;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastTrail < 90) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (dx * dx + dy * dy < 45 * 45) return;
      lastTrail = now;
      lastX = e.clientX;
      lastY = e.clientY;
      waveEngine.add(e.clientX, e.clientY, 0.3);
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });

    let rafId = 0;
    const frame = () => {
      rafId = requestAnimationFrame(frame);
      if (document.hidden) return;
      const t = performance.now() / 1000;
      waveEngine.prune(t);
      const vh = window.innerHeight;

      states.forEach((s, el) => {
        if (!el.isConnected) {
          states.delete(el);
          return;
        }
        const r = el.getBoundingClientRect();
        // 화면 밖 요소는 원위치로 이완만
        if (r.bottom < -160 || r.top > vh + 160) {
          if (Math.abs(s.ty) > 0.05 || Math.abs(s.tx) > 0.05) {
            s.tx *= 0.85;
            s.ty *= 0.85;
            s.rx *= 0.85;
            s.ry *= 0.85;
            write(el, s);
          }
          return;
        }

        // 기준점 = 현재 중심 - 이미 적용된 변위 (피드백 루프 방지)
        const cx = r.left + r.width / 2 - s.tx;
        const cy = r.top + r.height / 2 - s.ty;

        const h0 = waveEngine.heightAt(cx, cy, t, vh);
        const hx = waveEngine.heightAt(cx + SAMPLE_EPS, cy, t, vh);
        const hy = waveEngine.heightAt(cx, cy + SAMPLE_EPS, t, vh);
        const gx = hx - h0;
        const gy = hy - h0;

        // 잔잔한 idle swell — 요소 위치·고유 위상으로 모두 다르게 호흡
        const idle =
          Math.sin(t * 0.8 + cx * 0.012 + cy * 0.009 + s.phase) * 0.1 +
          Math.sin(t * 0.5 + cx * 0.005 - cy * 0.007 + s.phase * 1.7) * 0.06;

        const targetTy = -(h0 + idle) * LIFT_PX;
        const targetTx = clamp(gx * PUSH_PX, -10, 10);
        const targetRx = clamp(gy * TILT_DEG + idle * 0.5, -1.1, 1.1);
        const targetRy = clamp(-gx * TILT_DEG, -1.1, 1.1);

        s.tx += (targetTx - s.tx) * SMOOTH;
        s.ty += (targetTy - s.ty) * SMOOTH;
        s.rx += (targetRx - s.rx) * SMOOTH;
        s.ry += (targetRy - s.ry) * SMOOTH;
        write(el, s);
      });
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(rescan);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      // 변수 정리
      states.forEach((_, el) => {
        el.style.removeProperty('--bx');
        el.style.removeProperty('--by');
        el.style.removeProperty('--brx');
        el.style.removeProperty('--bry');
      });
    };
  }, [pathname]);

  return null;
}

function write(el: HTMLElement, s: BuoyState) {
  el.style.setProperty('--bx', `${s.tx.toFixed(2)}px`);
  el.style.setProperty('--by', `${s.ty.toFixed(2)}px`);
  el.style.setProperty('--brx', `${s.rx.toFixed(3)}deg`);
  el.style.setProperty('--bry', `${s.ry.toFixed(3)}deg`);
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}
