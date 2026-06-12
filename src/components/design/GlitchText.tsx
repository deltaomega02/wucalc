'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  triggerOnce?: boolean;
}

/**
 * GlitchText — RGB split + 미세 위치 jitter로 짧은 글리치 효과.
 * 폰트 자체는 그대로, before/after pseudo로 두 레이어가 살짝 어긋남.
 */
export function GlitchText({ text, className = '', triggerOnHover = false, triggerOnce = false }: Props) {
  const [active, setActive] = useState(!triggerOnHover);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (triggerOnHover) return;
    if (triggerOnce) {
      const t = setTimeout(() => setActive(false), 1200);
      return () => clearTimeout(t);
    }
    // Random subtle glitches every few seconds
    const interval = setInterval(() => {
      setActive(true);
      setTimeout(() => setActive(false), 200);
    }, 4000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [triggerOnHover, triggerOnce]);

  return (
    <span
      ref={ref}
      className={`relative inline-block ${className}`}
      data-text={text}
      onMouseEnter={() => triggerOnHover && setActive(true)}
      onMouseLeave={() => triggerOnHover && setActive(false)}
    >
      <span className="relative z-10">{text}</span>
      {active && (
        <>
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              color: '#FF0033',
              clipPath: 'inset(20% 0 60% 0)',
              transform: 'translate(-2px, 1px)',
              opacity: 0.7,
              animation: 'glitch-1 0.3s steps(2) infinite',
            }}
          >
            {text}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              color: '#00FFFF',
              clipPath: 'inset(60% 0 20% 0)',
              transform: 'translate(2px, -1px)',
              opacity: 0.7,
              animation: 'glitch-2 0.3s steps(2) infinite',
            }}
          >
            {text}
          </span>
        </>
      )}
      <style jsx>{`
        @keyframes glitch-1 {
          0%, 100% { transform: translate(-2px, 1px); clip-path: inset(20% 0 60% 0); }
          25% { transform: translate(-3px, -1px); clip-path: inset(40% 0 30% 0); }
          50% { transform: translate(2px, 2px); clip-path: inset(70% 0 10% 0); }
          75% { transform: translate(-1px, -2px); clip-path: inset(10% 0 80% 0); }
        }
        @keyframes glitch-2 {
          0%, 100% { transform: translate(2px, -1px); clip-path: inset(60% 0 20% 0); }
          25% { transform: translate(3px, 1px); clip-path: inset(30% 0 50% 0); }
          50% { transform: translate(-2px, -2px); clip-path: inset(10% 0 70% 0); }
          75% { transform: translate(1px, 2px); clip-path: inset(80% 0 5% 0); }
        }
      `}</style>
    </span>
  );
}
