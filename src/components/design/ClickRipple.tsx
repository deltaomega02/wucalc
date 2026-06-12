'use client';

import { useEffect, useRef, useState } from 'react';

interface Ring {
  id: number;
  x: number;
  y: number;
}

/**
 * 사이트 전역 클릭 파문 — 어디를 클릭하든 그 지점에서
 * 골드 링 + 잉크 링이 동심원으로 퍼져나간다 (공명 파동 모티프).
 */
export function ClickRipple() {
  const [rings, setRings] = useState<Ring[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onDown = (e: PointerEvent) => {
      const id = idRef.current++;
      setRings((rs) => [...rs.slice(-6), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRings((rs) => rs.filter((r) => r.id !== id));
      }, 1000);
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9990]" aria-hidden>
      {rings.map((r) => (
        <span key={r.id}>
          {/* 골드 선두 링 */}
          <span
            className="absolute rounded-full border-2"
            style={{
              left: r.x,
              top: r.y,
              width: 150,
              height: 150,
              borderColor: 'rgba(201, 162, 39, 0.55)',
              animation: 'click-ring 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          />
          {/* 잉크 잔파 링 */}
          <span
            className="absolute rounded-full border"
            style={{
              left: r.x,
              top: r.y,
              width: 84,
              height: 84,
              borderColor: 'rgba(22, 21, 15, 0.30)',
              animation: 'click-ring 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.08s forwards',
              opacity: 0,
            }}
          />
        </span>
      ))}
    </div>
  );
}
