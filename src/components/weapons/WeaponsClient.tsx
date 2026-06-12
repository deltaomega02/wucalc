// src/components/weapons/WeaponsClient.tsx
'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { characters, weapons } from '@/data';
import { SIGNATURE_WEAPONS } from '@/data/signatureWeapons';
import { useBuildStore } from '@/stores/buildStore';
import { ELEMENT_TEXT_COLOR, RARITY_COLOR, RARITY_TILE } from '@/lib/utils/element';
import type { Weapon, WeaponType } from '@/types/game';

const WEAPON_TYPES: WeaponType[] = [
  'broadblade',
  'sword',
  'pistols',
  'gauntlets',
  'rectifier',
];

/** 무기 영문명 → 전용무기 주인 캐릭터 (역매핑) */
const SIGNATURE_OWNER: Record<string, string> = Object.fromEntries(
  Object.entries(SIGNATURE_WEAPONS).map(([charId, weaponEn]) => [weaponEn, charId]),
);

export default function WeaponsClient() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [typeFilter, setTypeFilter] = useState<WeaponType | null>(null);
  const [rarityFilter, setRarityFilter] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return [...weapons]
      .filter((w) => {
        if (search) {
          const q = search.toLowerCase();
          if (
            !w.name.ko.toLowerCase().includes(q) &&
            !w.name.en.toLowerCase().includes(q)
          )
            return false;
        }
        if (typeFilter && w.type !== typeFilter) return false;
        if (rarityFilter && w.rarity !== rarityFilter) return false;
        return true;
      })
      .sort(
        (a, b) =>
          b.rarity - a.rarity ||
          (b.baseAtk['90'] ?? 0) - (a.baseAtk['90'] ?? 0) ||
          a.name.en.localeCompare(b.name.en),
      );
  }, [search, typeFilter, rarityFilter]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder={t('weapons.searchPlaceholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-primary sm:max-w-xs"
        data-cursor="text"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <FilterButton active={typeFilter === null} onClick={() => setTypeFilter(null)}>
          {t('weapons.filterAll')}
        </FilterButton>
        {WEAPON_TYPES.map((wt) => (
          <FilterButton
            key={wt}
            active={typeFilter === wt}
            onClick={() => setTypeFilter(typeFilter === wt ? null : wt)}
          >
            {t(`weaponType.${wt}`)}
          </FilterButton>
        ))}

        <span className="mx-1 self-center text-border">|</span>

        {[5, 4, 3].map((r) => (
          <FilterButton
            key={r}
            active={rarityFilter === r}
            onClick={() => setRarityFilter(rarityFilter === r ? null : r)}
            className={rarityFilter === r ? RARITY_COLOR[r] : ''}
          >
            {r}★
          </FilterButton>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-text-muted">
        {t('weapons.total', { count: filtered.length })}
      </p>

      {/* Grid — 필터 변경 시 파도 스태거로 재진입 */}
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-text-muted">
          {t('weapons.noResults')}
        </p>
      ) : (
        <div
          key={`${search}|${typeFilter}|${rarityFilter}`}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((w, i) => (
            <WeaponCard key={w.id} weapon={w} locale={locale} waveDelay={Math.min(i * 14, 300)} />
          ))}
        </div>
      )}
    </div>
  );
}

function WeaponCard({
  weapon: w,
  locale,
  waveDelay = 0,
}: {
  weapon: Weapon;
  locale: string;
  waveDelay?: number;
}) {
  const t = useTranslations();
  const router = useRouter();
  const setWeapon = useBuildStore((s) => s.setWeapon);
  const setCharacter = useBuildStore((s) => s.setCharacter);
  const buildCharId = useBuildStore((s) => s.characterId);

  const ownerId = SIGNATURE_OWNER[w.name.en];
  const owner = ownerId ? characters.find((c) => c.id === ownerId) : undefined;

  // 계산기로 보내기 — 현재 빌드 캐릭터의 무기 타입이 맞으면 무기만,
  // 아니면 전용무기 주인 캐릭터까지 함께 세팅한다.
  const sendToCalculator = () => {
    const buildChar = characters.find((c) => c.id === buildCharId);
    if (buildChar && buildChar.weaponType === w.type) {
      setWeapon(w.id);
    } else if (owner) {
      setCharacter(owner.id);
      setWeapon(w.id);
    } else {
      setCharacter('');
      setWeapon(w.id);
    }
    router.push('/calculator');
  };

  return (
    <div
      className="tile group flex flex-col gap-3 p-5"
      style={{ animation: `wave-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${waveDelay}ms backwards` }}
    >
      {/* 아이콘 + 이름 + 등급 */}
      <div className="flex items-start gap-4">
        <div
          className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ${RARITY_TILE[w.rarity]}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/weapons/${w.id}.webp`}
            alt={(w.name[locale] ?? w.name.en) as string}
            width={64}
            height={64}
            loading="lazy"
            className="tile-img relative h-full w-full object-contain p-1"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-text transition-colors group-hover:text-primary">
            {w.name[locale] ?? w.name.en}
          </p>
          {locale !== 'en' && (
            <p className="truncate font-mono text-[12px] text-text-muted">{w.name.en}</p>
          )}
        </div>
        <span className={`shrink-0 text-sm font-bold ${RARITY_COLOR[w.rarity]}`}>
          {w.rarity}★
        </span>
      </div>

      {/* 타입 + 전용무기 주인 */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-bg px-2 py-0.5 text-[12px] text-text-muted">
          {t(`weaponType.${w.type}`)}
        </span>
        {owner && (
          <Link
            href={`/characters/${owner.id}`}
            className={`rounded-md px-2 py-0.5 text-[12px] font-medium transition-opacity hover:opacity-75 ${ELEMENT_TEXT_COLOR[owner.element]} bg-bg`}
          >
            ⚔ {t('weapons.signatureOf', { name: owner.name[locale] ?? owner.name.en })}
          </Link>
        )}
      </div>

      {/* 스탯 */}
      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-[13px]">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-text-muted">
            {t('weapons.baseAtk')} · Lv.90
          </p>
          <p className="font-mono font-semibold text-text">{w.baseAtk['90'] ?? '—'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-text-muted">
            {t('weapons.subStat')}
          </p>
          <p className="truncate font-mono font-semibold text-text">
            {t(`stat.${w.subStat.type}`)}{' '}
            {w.subStat.type === 'atk'
              ? w.subStat.value
              : `${(w.subStat.value * 100).toFixed(1)}%`}
          </p>
        </div>
      </div>

      {/* 패시브 이름 */}
      {w.passive?.name && (
        <p className="text-[12px] text-text-muted">
          <span className="font-medium text-text">{t('weapons.passive')}</span> ·{' '}
          {w.passive.name[locale] ?? w.passive.name.en}
        </p>
      )}

      {/* 계산기 연동 */}
      <button
        type="button"
        onClick={sendToCalculator}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
      >
        {t('weapons.useInCalc')}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

function FilterButton({
  children,
  active,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
        active ? 'bg-primary/20 text-primary' : 'bg-surface text-text-muted hover:text-text'
      } ${className}`}
    >
      {children}
    </button>
  );
}
