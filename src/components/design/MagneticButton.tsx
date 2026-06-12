'use client';

import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

interface Props {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  strength?: number; // 자석 끌어당김 강도 (0~1, default 0.35)
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Magnetic Button — 커서가 가까이 가면 버튼이 끌려온다.
 * 동시에 내부 텍스트가 더 강하게 끌려와 마이크로 패럴랙스.
 */
export function MagneticButton({
  children,
  variant = 'primary',
  strength = 0.35,
  onClick,
}: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const handleMove = (e: MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    const inner = innerRef.current;
    if (!btn || !inner) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    inner.style.transform = `translate(${x * strength * 1.5}px, ${y * strength * 1.5}px)`;
  };

  const handleLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = '';
    if (innerRef.current) innerRef.current.style.transform = '';
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const id = Date.now();
    setRipples((r) => [
      ...r,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top, size },
    ]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 1500);
    onClick?.(e);
  };

  const variantClasses = {
    primary:
      'bg-[var(--color-coast-deep)] text-white shadow-[0_4px_24px_-4px_rgba(11,22,38,0.4)] hover:shadow-[0_8px_40px_-4px_rgba(11,22,38,0.6)]',
    outline:
      'bg-transparent border-2 border-[var(--color-coast-deep)] text-[var(--color-ink)] hover:bg-[var(--color-coast-deep)] hover:text-white',
    ghost:
      'bg-transparent text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]',
  };

  return (
    <button
      ref={btnRef}
      data-cursor="interactive"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      className={`
        relative overflow-hidden
        px-8 py-4 rounded-full font-medium text-sm tracking-wider uppercase
        transition-[background-color,color,box-shadow,transform] duration-500 ease-out
        will-change-transform
        ${variantClasses[variant]}
      `}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <span ref={innerRef} className="relative z-10 inline-block transition-transform duration-500 ease-out will-change-transform">
        {children}
      </span>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: r.x - r.size / 2,
            top: r.y - r.size / 2,
            width: r.size,
            height: r.size,
            background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)',
            animation: 'mag-ripple 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes mag-ripple {
          from { transform: scale(0); opacity: 1; }
          to { transform: scale(1); opacity: 0; }
        }
      `}</style>
    </button>
  );
}
