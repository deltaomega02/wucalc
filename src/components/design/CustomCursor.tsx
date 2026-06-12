'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Black Shores Cursor — 잉크 한 방울이 화면 위를 따라다닌다.
 * - 작은 dot (내부) + 큰 ring (외부) 두 레이어
 * - 인터랙티브 요소 hover 시 ring이 확장 + 색상 변경
 * - 모바일 / touch device 자동 숨김
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState<'default' | 'interactive' | 'text'>('default');

  useEffect(() => {
    // Touch device detection
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let rafId = 0;
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);

      // Check what we're hovering
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor="interactive"]') || target.closest('button, a, [role="button"]')) {
        setHovering('interactive');
      } else if (target.closest('[data-cursor="text"]') || ['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        setHovering('text');
      } else {
        setHovering('default');
      }
    };

    const onLeave = () => setVisible(false);

    const animate = () => {
      // Lag the ring behind the dot for organic feel
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const ringSize = hovering === 'interactive' ? 56 : hovering === 'text' ? 4 : 32;
  const dotSize = hovering === 'interactive' ? 6 : hovering === 'text' ? 18 : 4;

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full transition-[width,height,background-color,border-color,opacity] duration-300 ease-out mix-blend-difference"
        style={{
          width: ringSize,
          height: ringSize,
          border: `1.5px solid ${hovering === 'interactive' ? 'var(--color-shorekeeper-sky)' : 'rgba(255, 255, 255, 0.9)'}`,
          background: hovering === 'interactive' ? 'rgba(74, 159, 224, 0.15)' : 'transparent',
          opacity: visible ? 1 : 0,
          willChange: 'transform',
        }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full transition-[width,height,opacity] duration-200 mix-blend-difference"
        style={{
          width: dotSize,
          height: dotSize,
          background: 'white',
          opacity: visible ? 1 : 0,
          willChange: 'transform',
        }}
      />
      <style jsx global>{`
        @media (pointer: fine) {
          html, body, * { cursor: none !important; }
        }
      `}</style>
    </>
  );
}
