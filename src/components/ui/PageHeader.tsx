// src/components/ui/PageHeader.tsx

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  accent?: 'primary' | 'accent';
  /** 콘솔 인덱스 — 홈의 "/ 01" 섹션 넘버링과 이어지는 전 페이지 공통 코드 */
  index?: string;
  /** 콘솔 라벨 (영문 모노) — e.g. Archive, Echo Lab, Simulation */
  eyebrow?: string;
}

/**
 * 타일링 가능한 파도 SVG path
 * viewBox 0~1440에서 0~720 구간과 720~1440 구간이 동일한 파형
 * → translateX(-50%)로 무한 루프 시 이음새 없이 연결
 */
const WAVE_PATH_1 = 'M0,50 C120,80 240,20 360,50 C480,80 600,20 720,50 C840,80 960,20 1080,50 C1200,80 1320,20 1440,50 L1440,120 L0,120Z';
const WAVE_PATH_2 = 'M0,65 C180,30 360,90 540,55 C720,20 900,90 1080,55 C1200,30 1320,80 1440,65 L1440,120 L0,120Z';

export default function PageHeader({ title, subtitle, accent = 'primary', index, eyebrow }: PageHeaderProps) {
  const fillColor = accent === 'accent' ? 'rgba(168,120,0,1)' : 'rgba(18,17,13,1)';

  return (
    <div className="glass-float cross-marks relative mb-10 overflow-hidden rounded-2xl">
      {/* 파도 배경 */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute -bottom-px left-0 h-20 w-[200%] animate-wave"
          style={{ animationDuration: '10s' }}
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path d={WAVE_PATH_1} fill={fillColor} opacity="0.06" />
        </svg>
        <svg
          className="absolute -bottom-px left-0 h-24 w-[200%] animate-wave-slow"
          style={{ animationDuration: '15s' }}
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path d={WAVE_PATH_2} fill={fillColor} opacity="0.04" />
        </svg>
        <div className={`absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl ${accent === 'accent' ? 'bg-accent/5' : 'bg-primary/5'}`} />
      </div>

      <div className="relative px-6 py-8 sm:px-8 sm:py-10">
        {(index || eyebrow) && (
          <div className="mb-3 flex items-center gap-3 animate-fade-up">
            {index && (
              <span className="font-mono text-xs tracking-[0.3em] text-primary">
                / {index}
              </span>
            )}
            {eyebrow && (
              <span className="tag-bracket font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                {eyebrow}
              </span>
            )}
            <div className="h-px w-16 bg-gradient-to-r from-[color:var(--color-coast-mid)]/40 to-transparent" />
          </div>
        )}
        <h1
          className="text-3xl font-bold tracking-tight text-text sm:text-5xl animate-fade-up"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2.5 text-base text-text-muted animate-fade-up-delay-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
