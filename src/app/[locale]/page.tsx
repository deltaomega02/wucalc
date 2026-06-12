// src/app/[locale]/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { characters, weapons, sets } from '@/data';
import { MagneticButton } from '@/components/design/MagneticButton';
import { GlitchText } from '@/components/design/GlitchText';
import { TiltCard } from '@/components/design/TiltCard';
import { RevealSection } from '@/components/design/RevealSection';

const CausticsField = dynamic(
  () => import('@/components/design/CausticsField').then((m) => m.CausticsField),
  { ssr: false },
);

const TITLE = ['W', 'u', 'C', 'a', 'l', 'c'] as const;

const ELEMENTS = [
  { id: 'glacio', color: 'var(--color-glacio)' },
  { id: 'fusion', color: 'var(--color-fusion)' },
  { id: 'electro', color: 'var(--color-electro)' },
  { id: 'aero', color: 'var(--color-aero)' },
  { id: 'spectro', color: 'var(--color-spectro)' },
  { id: 'havoc', color: 'var(--color-havoc)' },
] as const;

/* 벤토 그리드 도구 카드 — 실제 게임 일러스트 사용 */
const TOOLS = [
  {
    href: '/characters',
    titleKey: 'charactersTitle',
    descKey: 'charactersDesc',
    index: '01',
    span: 'md:col-span-2 md:row-span-2',
    visual: 'characters',
  },
  { href: '/calculator', titleKey: 'calculatorTitle', descKey: 'calculatorDesc', index: '02', span: '', visual: 'calculator' },
  { href: '/party', titleKey: 'partyTitle', descKey: 'partyDesc', index: '03', span: '', visual: 'party' },
  { href: '/weapons', titleKey: 'weaponsTitle', descKey: 'weaponsDesc', index: '05', span: '', visual: 'weapons' },
  { href: '/tower', titleKey: 'towerTitle', descKey: 'towerDesc', index: '04', span: '', visual: 'tower' },
] as const;

const FEATURED_PILES = ['hiyuki', 'cartethyia', 'jinhsi'];
const FEATURED_HEADS = ['shorekeeper', 'changli', 'camellya'];
const FEATURED_WEAPONS = ['ages-of-harvest', 'red-spring', 'the-last-dance', 'stringmaster'];

function ToolVisual({ kind }: { kind: string }) {
  if (kind === 'characters') {
    return (
      <div className="pointer-events-none absolute bottom-0 right-0 flex h-[88%] w-[80%] items-end justify-end overflow-hidden">
        {FEATURED_PILES.map((slug, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slug}
            src={`/images/characters/pile/${slug}.webp`}
            alt=""
            loading="lazy"
            className="tile-img -mx-7 h-full w-auto object-contain object-bottom"
            style={{ zIndex: 3 - i, transform: `translateY(${i * 5}%)` }}
          />
        ))}
      </div>
    );
  }
  if (kind === 'party') {
    return (
      <div className="pointer-events-none absolute bottom-5 right-6 flex">
        {FEATURED_HEADS.map((slug, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slug}
            src={`/images/characters/head/${slug}.webp`}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            className="-ml-3 h-11 w-11 rounded-full border-2 border-surface bg-[color:var(--color-card-deep)] object-cover first:ml-0"
            style={{ zIndex: 3 - i }}
          />
        ))}
      </div>
    );
  }
  if (kind === 'weapons') {
    return (
      <div className="pointer-events-none absolute bottom-5 right-6 flex gap-1.5">
        {FEATURED_WEAPONS.map((slug) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slug}
            src={`/images/weapons/${slug}.webp`}
            alt=""
            width={36}
            height={36}
            loading="lazy"
            className="bg-r5 h-9 w-9 rounded-lg object-contain p-0.5"
          />
        ))}
      </div>
    );
  }
  if (kind === 'calculator') {
    return (
      <div className="pointer-events-none absolute bottom-5 right-6 font-mono text-3xl font-bold text-primary/25">
        +37.4%
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute bottom-5 right-6 font-mono text-3xl font-bold text-primary/25">
      30/30
    </div>
  );
}

export default function HomePage() {
  const t = useTranslations('home');
  const tElement = useTranslations('element');
  const router = useRouter();

  return (
    <>
      <div className="relative">
        {/* ════════ HERO — 수면(caustics)은 여기에서만. 클릭하면 빛그물이 일렁인다 ════════ */}
        <section className="relative h-[calc(100svh-4rem)] w-full overflow-hidden">
          <CausticsField className="absolute inset-0 z-0" />
          {/* 하단 페이드 — 수면이 종이로 가라앉는다 */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40"
            style={{ background: 'linear-gradient(180deg, transparent 0%, var(--color-bg) 100%)' }}
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            {/* Eyebrow */}
            <div
              className="mb-8 flex items-center gap-3 opacity-0"
              style={{ animation: 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards' }}
            >
              <div className="h-px w-12 bg-[color:var(--color-ink-faint)]" />
              <span className="tag-bracket font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
                {t('heroEyebrow')}
              </span>
              <div className="h-px w-12 bg-[color:var(--color-ink-faint)]" />
            </div>

            {/* Title — 클립 리빌, 블러 없음. Wu=잉크 / Calc=골드 */}
            <h1
              className="mb-8 flex justify-center"
              aria-label="WuCalc"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
            >
              {TITLE.map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.06em]" aria-hidden>
                  <span
                    className={`inline-block text-[15vw] font-bold leading-[1.02] sm:text-[12vw] lg:text-[150px] ${
                      i >= 2 ? 'text-primary' : 'text-text'
                    }`}
                    style={{
                      animation: `letter-reveal 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + i * 0.07}s both`,
                    }}
                  >
                    {ch}
                  </span>
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p
              className="mb-4 max-w-2xl text-xl text-text opacity-0 md:text-2xl"
              style={{
                fontFamily: 'var(--font-display)',
                animation: 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.95s forwards',
              }}
            >
              {t.rich('heroLine', {
                glitch: (chunks) => (
                  <GlitchText text={chunks?.toString() ?? ''} className="font-bold text-primary" />
                ),
              })}
            </p>
            <p
              className="mb-10 text-base tracking-wide text-text-muted opacity-0"
              style={{ animation: 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s forwards' }}
            >
              {t('heroSub')}
            </p>

            {/* Stats — 글래스 스트립 */}
            <div
              className="glass-card mb-10 flex items-center gap-6 rounded-full px-7 py-3 font-mono text-xs uppercase tracking-widest text-text-muted opacity-0"
              style={{ animation: 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.25s forwards' }}
            >
              <span>
                <strong className="text-text">{characters.length}</strong> {t('statResonators')}
              </span>
              <span className="h-3 w-px bg-border-hover" />
              <span>
                <strong className="text-text">{weapons.length}</strong> {t('statWeapons')}
              </span>
              <span className="h-3 w-px bg-border-hover" />
              <span>
                <strong className="text-primary">{sets.length}</strong> {t('statSets')}
              </span>
            </div>

            {/* Magnetic CTAs */}
            <div
              className="flex flex-wrap justify-center gap-4 opacity-0"
              style={{ animation: 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.4s forwards' }}
            >
              <MagneticButton variant="primary" onClick={() => router.push('/calculator')}>
                {t('ctaCalculator')}
              </MagneticButton>
              <MagneticButton variant="outline" onClick={() => router.push('/characters')}>
                {t('ctaCharacters')}
              </MagneticButton>
            </div>

            {/* Scroll indicator */}
            <div
              className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0"
              style={{ animation: 'fade-up 0.8s ease-out 2.2s forwards' }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-muted">
                {t('scroll')}
              </span>
              <div className="relative h-12 w-px overflow-hidden bg-[rgba(22,21,15,0.15)]">
                <div
                  className="absolute left-0 top-0 h-3 w-full bg-[color:var(--color-coast-deep)]"
                  style={{ animation: 'scroll-indicator 2s ease-in-out infinite' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ════════ / 01 — Tools ════════ */}
        <RevealSection className="relative px-6 py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
              / 01 — {t('sectionTools')}
            </div>
            <h2
              className="mb-12 text-4xl font-bold leading-tight text-text md:text-5xl"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
            >
              {t('sectionToolsTitle')}
            </h2>

            {/* 벤토 그리드 — 캐릭터 카드가 2×2를 차지하고 일러스트가 채운다 */}
            <div className="grid gap-5 md:grid-cols-3 md:[grid-auto-rows:200px]">
              {TOOLS.map(({ href, titleKey, descKey, index, span, visual }) => (
                <TiltCard key={href} intensity={5} className={`rounded-2xl ${span}`}>
                  <Link
                    href={href}
                    data-cursor="interactive"
                    className="tile group relative flex h-full min-h-[180px] flex-col rounded-2xl p-7"
                  >
                    <ToolVisual kind={visual} />
                    <div className="relative z-10 flex items-start justify-between">
                      <span className="font-mono text-xs tracking-widest text-primary">
                        / {index}
                      </span>
                      <span className="text-text-muted/70 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 17 17 7" />
                          <path d="M7 7h10v10" />
                        </svg>
                      </span>
                    </div>
                    <div className="relative z-10 mt-auto max-w-[75%]">
                      <h3 className="text-xl font-bold text-text transition-colors group-hover:text-primary">
                        {t(titleKey)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-text-muted">{t(descKey)}</p>
                    </div>
                  </Link>
                </TiltCard>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ════════ / 02 — Resonance Attributes ════════ */}
        <RevealSection className="relative px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
              / 02 — {t('sectionElements')}
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {ELEMENTS.map((el) => (
                <div
                  key={el.id}
                  className="coast-card group flex flex-col items-center gap-3 rounded-2xl py-6"
                >
                  <div
                    className="clip-hex flex h-11 w-11 items-center justify-center text-[13px] font-bold uppercase tracking-wider transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${el.color}26 0%, ${el.color}0D 100%)`,
                      color: el.color,
                      border: `1px solid ${el.color}40`,
                    }}
                  >
                    {el.id.slice(0, 2)}
                  </div>
                  <span className="text-sm font-semibold text-text">{tElement(el.id)}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ════════ / 03 — CTA ════════ */}
        <RevealSection className="relative px-6 py-28">
          <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
              / 03 — {t('sectionCta')}
            </div>
            <h2
              className="mb-10 text-4xl font-bold leading-tight text-text md:text-6xl"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
            >
              {t('sectionCtaTitle')}
            </h2>
            <MagneticButton variant="primary" onClick={() => router.push('/calculator')}>
              {t('ctaCalculator')}
            </MagneticButton>
          </div>
        </RevealSection>
      </div>
    </>
  );
}
