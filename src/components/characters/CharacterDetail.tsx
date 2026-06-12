// src/components/characters/CharacterDetail.tsx
'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import type { Character } from '@/types/game';
import { characters, weapons, sets } from '@/data';
import { SIGNATURE_WEAPONS } from '@/data/signatureWeapons';
import { RECOMMENDED_SETS } from '@/data/recommendedSets';
import { useBuildStore } from '@/stores/buildStore';
import {
  ELEMENT_TEXT_COLOR,
  ELEMENT_VAR,
  ELEMENT_VAR_BRIGHT,
  RARITY_COLOR,
} from '@/lib/utils/element';
import { formatPercent } from '@/lib/utils/format';

interface CharacterDetailProps {
  character: Character;
}

export default function CharacterDetail({ character: c }: CharacterDetailProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const setCharacter = useBuildStore((s) => s.setCharacter);
  const setWeapon = useBuildStore((s) => s.setWeapon);

  const stats = c.baseStats['90'];
  const name = c.name[locale] ?? c.name.en;
  const elColor = ELEMENT_VAR[c.element];
  const elBright = ELEMENT_VAR_BRIGHT[c.element];

  // 전용무기 — 영문명 매핑으로 weapons.json에서 조회
  const signature = useMemo(() => {
    const sigEn = SIGNATURE_WEAPONS[c.id];
    return sigEn ? weapons.find((w) => w.name.en === sigEn) : undefined;
  }, [c.id]);

  // 추천 에코 세트
  const recommendation = RECOMMENDED_SETS[c.id];
  const setName = (id: string) => {
    const s = sets.find((es) => es.id === id);
    return s ? ((s.name[locale] ?? s.name.en) as string) : id;
  };

  // 이전/다음 공명자
  const idx = characters.findIndex((ch) => ch.id === c.id);
  const prev = characters[(idx - 1 + characters.length) % characters.length];
  const next = characters[(idx + 1) % characters.length];

  // 계산기로 — 캐릭터(+전용무기) 프리셋 후 이동
  const calcWith = () => {
    setCharacter(c.id);
    setWeapon(signature?.id ?? '');
    router.push('/calculator');
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/characters"
        className="inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-primary"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        {t('characters.backToList')}
      </Link>

      {/* ── Hero — 풀바디 일러스트 + 고스트 타이포 + 속성 글로우 ── */}
      <div className="cross-marks noise-grain relative overflow-hidden rounded-3xl border border-border bg-surface">
        {/* 거대 고스트 영문명 (공식 사이트 문법) */}
        <span
          aria-hidden
          className="ghost-text right-[-2%] top-[4%] text-[22vw] leading-none sm:text-[11rem]"
        >
          {c.name.en.split(' ')[0].split(':')[0].toUpperCase()}
        </span>

        {/* 속성 글로우 */}
        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-[85%] w-[55%] opacity-30 blur-3xl"
          style={{ background: `radial-gradient(60% 70% at 60% 80%, ${elBright} 0%, transparent 70%)` }}
        />

        {/* 풀바디 일러스트 — 우측 하단 정렬 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/characters/pile/${c.id}.webp`}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 hidden h-[115%] w-auto object-contain object-bottom sm:block"
          style={{
            filter: `drop-shadow(0 12px 40px color-mix(in srgb, ${elBright} 45%, transparent))`,
            animation: 'letter-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        />

        <div className="relative px-6 py-8 sm:min-h-[380px] sm:px-9 sm:py-10 sm:pr-[42%]">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.3em] text-primary">/ 01</span>
            <span className="tag-bracket font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
              {t('characters.eyebrow')}
            </span>
            <div className="h-px w-16 bg-gradient-to-r from-[color:var(--color-coast-mid)]/40 to-transparent" />
          </div>

          {/* 모바일 초상 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/characters/head/${c.id}.webp`}
            alt={name}
            width={112}
            height={112}
            className="mb-4 h-28 w-28 rounded-2xl object-cover sm:hidden"
            style={{ background: `color-mix(in srgb, ${elBright} 18%, var(--color-surface))` }}
          />

          <h1
            className="text-4xl font-bold leading-none text-text sm:text-6xl animate-fade-up"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
          >
            {name}
          </h1>
          {locale !== 'en' && (
            <p className="mt-2 font-mono text-sm uppercase tracking-[0.2em] text-text-muted animate-fade-up-delay-1">
              {c.name.en}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2 animate-fade-up-delay-2">
            <span className={`text-base font-bold ${RARITY_COLOR[c.rarity]}`}>
              {'★'.repeat(c.rarity)}
            </span>
            <span
              className="rounded-full px-3 py-1 text-sm font-semibold"
              style={{
                color: elColor,
                background: `color-mix(in srgb, ${elColor} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${elColor} 35%, transparent)`,
              }}
            >
              {t(`element.${c.element}`)}
            </span>
            <span className="rounded-full border border-border bg-bg px-3 py-1 text-sm text-text-muted">
              {t(`weaponType.${c.weaponType}`)}
            </span>
          </div>

          {/* 액션 — 계산기 / 파티 연결 */}
          <div className="mt-7 flex flex-wrap gap-3 animate-fade-up-delay-3">
            <button
              type="button"
              onClick={calcWith}
              data-cursor="interactive"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-coast-deep)] px-6 py-3 text-sm font-medium uppercase tracking-wider text-white shadow-[0_4px_24px_-4px_rgba(11,22,38,0.4)] transition-shadow hover:shadow-[0_8px_40px_-4px_rgba(11,22,38,0.6)]"
            >
              {t('characters.calcWith')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <Link
              href={`/party?char=${c.id}`}
              data-cursor="interactive"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-coast-deep)] px-6 py-3 text-sm font-medium uppercase tracking-wider text-text transition-colors hover:bg-[var(--color-coast-deep)] hover:text-white"
            >
              {t('characters.addToParty')}
            </Link>
          </div>
        </div>
      </div>

      {/* ── 빌드 연결 — 전용무기 + 추천 세트 ── */}
      {(signature || recommendation) && (
        <section>
          <SectionTitle>{t('characters.buildLinks')}</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {signature && (
              <Link
                href={`/weapons?q=${encodeURIComponent(signature.name.en)}`}
                data-cursor="interactive"
                className="coast-card group rounded-2xl p-5"
              >
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                  {t('characters.signatureWeapon')}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/weapons/${signature.id}.webp`}
                    alt=""
                    width={52}
                    height={52}
                    loading="lazy"
                    className="bg-r5 h-13 w-13 shrink-0 rounded-xl object-contain p-1"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold text-text transition-colors group-hover:text-primary">
                      {signature.name[locale] ?? signature.name.en}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-text-muted">
                      {t('weapons.baseAtk')} {signature.baseAtk['90']} ·{' '}
                      {t(`stat.${signature.subStat.type}`)}{' '}
                      {signature.subStat.type === 'atk'
                        ? signature.subStat.value
                        : `${(signature.subStat.value * 100).toFixed(1)}%`}
                    </p>
                  </div>
                </div>
                <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  {t('characters.viewWeapon')}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17 17 7" /><path d="M7 7h10v10" />
                  </svg>
                </p>
              </Link>
            )}
            {recommendation && (
              <div className="coast-card rounded-2xl p-5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                  {t('characters.recommendedSets')}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {recommendation.primary.map((id, i) => (
                    <span
                      key={id}
                      className={`rounded-md px-2.5 py-1 text-sm font-medium ${
                        i === 0 ? 'bg-primary/10 text-primary' : 'bg-bg text-text-muted'
                      }`}
                    >
                      {setName(id)}
                      <span className="ml-1 font-mono text-[11px] opacity-70">
                        {recommendation.primary.length > 1 ? (i === 0 ? '3pc' : '2pc') : '5pc'}
                      </span>
                    </span>
                  ))}
                </div>
                {recommendation.alternatives && recommendation.alternatives.length > 0 && (
                  <p className="mt-2.5 text-xs text-text-muted">
                    {t('characters.alternativeSets')}:{' '}
                    {recommendation.alternatives
                      .map((combo) => combo.map(setName).join(' + '))
                      .join(' / ')}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Base Stats ── */}
      {stats && (
        <section>
          <SectionTitle>{t('characters.baseStats')}</SectionTitle>
          <div className="grid grid-cols-3 gap-3">
            <StatBox label="HP" value={stats.hp.toLocaleString()} />
            <StatBox label={t('stat.atk')} value={stats.atk.toLocaleString()} />
            <StatBox label={t('stat.def')} value={stats.def.toLocaleString()} />
          </div>
        </section>
      )}

      {/* ── Ascension Stat ── */}
      {c.ascensionStat && (
        <section>
          <SectionTitle>{t('characters.ascensionStat')}</SectionTitle>
          <div className="coast-card inline-flex items-center gap-3 rounded-xl px-4 py-3">
            <span className="text-sm text-text-muted">
              {t(`stat.${c.ascensionStat.type}`)}
            </span>
            <span className="font-mono text-lg font-bold text-primary">
              {formatPercent(c.ascensionStat.value)}
            </span>
          </div>
        </section>
      )}

      {/* ── Skills ── */}
      <section>
        <SectionTitle>{t('characters.skills')}</SectionTitle>
        {c.skills.length === 0 ? (
          <p className="text-sm text-text-muted">{t('characters.noSkillData')}</p>
        ) : (
          <div className="space-y-4">
            {c.skills.map((skill) => (
              <div key={skill.id} className="coast-card rounded-2xl p-5">
                <h3 className="mb-3 text-sm font-bold text-text">
                  {skill.name[locale] ?? skill.name.en}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-text-muted">
                        <th className="pb-2 pr-4 font-medium">{t('characters.hits')}</th>
                        <th className="pb-2 pr-4 font-medium">{t('characters.motionValue')}</th>
                        <th className="pb-2 pr-4 font-medium">{t('characters.attackType')}</th>
                        <th className="pb-2 font-medium">{t('characters.scalingStat')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skill.hits.map((hit, hitIdx) => (
                        <tr key={hitIdx} className="border-b border-border/50 last:border-0">
                          <td className="py-2 pr-4 text-text">
                            {hit.name[locale] ?? hit.name.en}
                          </td>
                          <td className="py-2 pr-4 font-mono text-primary">
                            {formatPercent(hit.motionValue)}
                          </td>
                          <td className="py-2 pr-4 text-text-muted">
                            {t(`attackTypeLabel.${hit.attackType}`)}
                          </td>
                          <td className="py-2 uppercase text-text-muted">{hit.scalingStat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 이전/다음 공명자 ── */}
      <nav className="grid gap-3 border-t border-border pt-6 sm:grid-cols-2" aria-label="Resonator navigation">
        <Link
          href={`/characters/${prev.id}`}
          data-cursor="interactive"
          className="coast-card group flex items-center gap-3 rounded-2xl p-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-text-muted transition-all group-hover:-translate-x-1 group-hover:text-primary">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/characters/head/${prev.id}.webp`}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            className="h-10 w-10 shrink-0 rounded-xl object-cover"
            style={{ background: `color-mix(in srgb, ${ELEMENT_VAR_BRIGHT[prev.element]} 18%, var(--color-bg))` }}
          />
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-text-muted">
              {t('characters.prevChar')}
            </p>
            <p className={`truncate text-sm font-bold ${ELEMENT_TEXT_COLOR[prev.element]}`}>
              {prev.name[locale] ?? prev.name.en}
            </p>
          </div>
        </Link>
        <Link
          href={`/characters/${next.id}`}
          data-cursor="interactive"
          className="coast-card group flex items-center justify-end gap-3 rounded-2xl p-4 text-right"
        >
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-text-muted">
              {t('characters.nextChar')}
            </p>
            <p className={`truncate text-sm font-bold ${ELEMENT_TEXT_COLOR[next.element]}`}>
              {next.name[locale] ?? next.name.en}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/characters/head/${next.id}.webp`}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            className="h-10 w-10 shrink-0 rounded-xl object-cover"
            style={{ background: `color-mix(in srgb, ${ELEMENT_VAR_BRIGHT[next.element]} 18%, var(--color-bg))` }}
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-text-muted transition-all group-hover:translate-x-1 group-hover:text-primary">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </nav>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <h2 className="diamond text-lg font-semibold text-text">{children}</h2>
      <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="coast-card rounded-xl p-3 text-center">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 font-mono text-xl font-bold text-text">{value}</p>
    </div>
  );
}
