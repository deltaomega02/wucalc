// src/components/characters/CharacterGrid.tsx
'use client';

import { useState, useMemo, useRef, type CSSProperties, type MouseEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import type { Character, Element, WeaponType } from '@/types/game';
import {
  ELEMENT_TEXT_COLOR,
  ELEMENT_VAR,
  ELEMENT_VAR_BRIGHT,
  RARITY_COLOR,
  RARITY_TILE,
} from '@/lib/utils/element';

const ELEMENTS: Element[] = [
  'fusion',
  'glacio',
  'aero',
  'electro',
  'havoc',
  'spectro',
];

const WEAPON_TYPES: WeaponType[] = [
  'broadblade',
  'sword',
  'pistols',
  'gauntlets',
  'rectifier',
];

interface CharacterGridProps {
  characters: Character[];
}

export default function CharacterGrid({ characters }: CharacterGridProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);
  const scattering = useRef(false);

  const [search, setSearch] = useState('');
  const [elementFilter, setElementFilter] = useState<Element | null>(null);
  const [weaponFilter, setWeaponFilter] = useState<WeaponType | null>(null);
  const [rarityFilter, setRarityFilter] = useState<number | null>(null);

  /* 카드를 고르면 그 지점에서 파면이 퍼지며 나머지 카드가 물결에 흩어진 뒤 이동 */
  const scatterNavigate = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const grid = gridRef.current;
    if (!grid || scattering.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    scattering.current = true;

    const target = e.currentTarget as HTMLElement;
    const tr = target.getBoundingClientRect();
    const cx = tr.left + tr.width / 2;
    const cy = tr.top + tr.height / 2;

    for (const card of grid.querySelectorAll<HTMLElement>('a[data-card]')) {
      if (card === target) {
        card.style.animation = 'scatter-stay 0.45s cubic-bezier(0.4, 0, 0.6, 1) forwards';
        continue;
      }
      const r = card.getBoundingClientRect();
      const dx = r.left + r.width / 2 - cx;
      const dy = r.top + r.height / 2 - cy;
      const dist = Math.hypot(dx, dy) || 1;
      // 파면이 닿는 순서대로(거리 비례 딜레이) 바깥 방향으로 흩어진다
      card.style.setProperty('--sx', `${(dx / dist) * 38}px`);
      card.style.setProperty('--sy', `${(dy / dist) * 38}px`);
      card.style.animation = `scatter-out 0.4s cubic-bezier(0.45, 0, 0.7, 0.4) ${Math.min(dist * 0.28, 240)}ms forwards`;
    }
    setTimeout(() => router.push(href), 470);
  };

  const filterKey = `${search}|${elementFilter}|${weaponFilter}|${rarityFilter}`;

  const filtered = useMemo(() => {
    return characters.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        const matchName =
          c.name.ko.toLowerCase().includes(q) ||
          c.name.en.toLowerCase().includes(q);
        if (!matchName) return false;
      }
      if (elementFilter && c.element !== elementFilter) return false;
      if (weaponFilter && c.weaponType !== weaponFilter) return false;
      if (rarityFilter && c.rarity !== rarityFilter) return false;
      return true;
    });
  }, [characters, search, elementFilter, weaponFilter, rarityFilter]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder={t('characters.searchPlaceholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-primary sm:max-w-xs"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Element filter */}
        <FilterButton
          active={elementFilter === null}
          onClick={() => setElementFilter(null)}
        >
          {t('characters.filterAll')}
        </FilterButton>
        {ELEMENTS.map((el) => (
          <FilterButton
            key={el}
            active={elementFilter === el}
            onClick={() =>
              setElementFilter(elementFilter === el ? null : el)
            }
            className={elementFilter === el ? ELEMENT_TEXT_COLOR[el] : ''}
          >
            {t(`element.${el}`)}
          </FilterButton>
        ))}

        <span className="mx-1 self-center text-border">|</span>

        {/* Weapon filter */}
        {WEAPON_TYPES.map((wt) => (
          <FilterButton
            key={wt}
            active={weaponFilter === wt}
            onClick={() =>
              setWeaponFilter(weaponFilter === wt ? null : wt)
            }
          >
            {t(`weaponType.${wt}`)}
          </FilterButton>
        ))}

        <span className="mx-1 self-center text-border">|</span>

        {/* Rarity filter */}
        <FilterButton
          active={rarityFilter === 5}
          onClick={() => setRarityFilter(rarityFilter === 5 ? null : 5)}
          className={rarityFilter === 5 ? 'text-accent' : ''}
        >
          5★
        </FilterButton>
        <FilterButton
          active={rarityFilter === 4}
          onClick={() => setRarityFilter(rarityFilter === 4 ? null : 4)}
          className={rarityFilter === 4 ? 'text-electro' : ''}
        >
          4★
        </FilterButton>
      </div>

      {/* Count */}
      <p className="text-xs text-text-muted">
        {t('characters.total', { count: filtered.length })}
      </p>

      {/* Grid — filterKey 변경 시 카드들이 파도처럼 다시 떠오른다 */}
      <div
        ref={gridRef}
        key={filterKey}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      >
        {filtered.map((c, i) => (
          <CharacterCard
            key={c.id}
            character={c}
            locale={locale}
            waveDelay={Math.min(i * 16, 320)}
            onScatterNav={scatterNavigate}
          />
        ))}
      </div>
    </div>
  );
}

function CharacterCard({
  character: c,
  locale,
  waveDelay = 0,
  onScatterNav,
}: {
  character: Character;
  locale: string;
  waveDelay?: number;
  onScatterNav?: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const t = useTranslations();
  const stats = c.baseStats['90'];
  const name = (c.name[locale] ?? c.name.en) as string;
  const href = `/characters/${c.id}`;

  return (
    <Link
      href={href}
      data-cursor="interactive"
      data-card
      onClick={(e) => onScatterNav?.(e, href)}
      className="tile group flex flex-col"
      style={
        {
          '--el': ELEMENT_VAR_BRIGHT[c.element],
          /* backwards: 종료 후 transform을 스타일시트(부력 변수)로 되돌린다 */
          animation: `wave-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${waveDelay}ms backwards`,
        } as CSSProperties
      }
    >
      {/* 초상 — 희귀도 그라디언트 + 속성 백드롭 위 컷아웃 */}
      <div className={`relative aspect-square overflow-hidden ${RARITY_TILE[c.rarity]}`}>
        <div className="el-backdrop absolute inset-0" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/characters/head/${c.id}.webp`}
          alt={name}
          width={256}
          height={256}
          loading="lazy"
          className="tile-img relative h-full w-full object-cover"
        />
        {/* 속성 헥스 배지 */}
        <span
          className="clip-hex absolute left-2 top-2 flex h-7 w-7 items-center justify-center text-[10px] font-bold uppercase"
          style={{
            color: '#fff',
            background: ELEMENT_VAR[c.element],
          }}
        >
          {c.element.slice(0, 2)}
        </span>
        {/* 희귀도 */}
        <span
          className={`absolute right-2 top-2 font-mono text-xs font-bold ${RARITY_COLOR[c.rarity]} drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]`}
        >
          {c.rarity}★
        </span>
      </div>

      {/* 정보 */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="truncate text-sm font-bold leading-tight text-text transition-colors group-hover:text-primary">
          {name}
        </p>
        <p className="truncate font-mono text-[11px] uppercase tracking-wide text-text-muted">
          {c.name.en}
        </p>
        <div className="mt-auto flex items-center justify-between pt-1 text-[12px]">
          <span className={ELEMENT_TEXT_COLOR[c.element]}>{t(`element.${c.element}`)}</span>
          <span className="text-text-muted">{t(`weaponType.${c.weaponType}`)}</span>
          {stats && <span className="font-mono text-text-muted">ATK {stats.atk}</span>}
        </div>
      </div>
    </Link>
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
        active
          ? 'bg-primary/20 text-primary'
          : 'bg-surface text-text-muted hover:text-text'
      } ${className}`}
    >
      {children}
    </button>
  );
}
