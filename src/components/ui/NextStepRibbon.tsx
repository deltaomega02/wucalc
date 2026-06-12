// src/components/ui/NextStepRibbon.tsx
import { Link } from '@/i18n/navigation';

export interface NextStep {
  href: string;
  title: string;
  desc: string;
  /** 콘솔 인덱스 — 해당 페이지의 "/ 0N" 코드 */
  index?: string;
}

interface NextStepRibbonProps {
  label: string;
  steps: NextStep[];
}

/**
 * 페이지 하단 연결 리본 — 모든 도구 페이지를 작업 흐름으로 잇는 공통 내비게이션.
 * 도감 → 계산기 → 파티 → 탑으로 이어지는 "다음 단계"를 제안한다.
 */
export default function NextStepRibbon({ label, steps }: NextStepRibbonProps) {
  return (
    <section className="mt-16">
      <div className="mb-5 flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
          {label}
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-[color:var(--color-coast-mid)]/30 to-transparent" />
      </div>

      <div className={`grid gap-4 ${steps.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {steps.map((step) => (
          <Link
            key={step.href}
            href={step.href}
            data-cursor="interactive"
            className="coast-card group flex items-center justify-between gap-6 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              {step.index && (
                <span className="mt-1 font-mono text-xs tracking-widest text-text-muted">
                  {step.index}
                </span>
              )}
              <div>
                <p className="text-base font-bold text-text transition-colors group-hover:text-primary">
                  {step.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{step.desc}</p>
              </div>
            </div>
            <span className="shrink-0 text-text-muted/70 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-primary">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
