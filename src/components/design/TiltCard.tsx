'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number; // 기울기 강도 (default 12)
  glare?: boolean;
}

/**
 * TiltCard — 마우스 위치에 따라 카드가 3D로 기울어진다.
 * Optional glare 반사 효과 — 검은 해안 유리벽 같은 느낌.
 */
export function TiltCard({ children, className = '', intensity = 12, glare = true }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * -intensity;
    const tiltY = (x - 0.5) * intensity;

    card.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;

    if (glareRef.current) {
      glareRef.current.style.opacity = '0.4';
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.5) 0%, transparent 50%)`;
    }
  };

  const handleLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{ opacity: 0 }}
        />
      )}
    </div>
  );
}
