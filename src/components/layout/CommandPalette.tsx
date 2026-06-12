// src/components/layout/CommandPalette.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { characters, weapons } from '@/data';
import type { Element } from '@/types/game';

const ELEMENT_VAR: Record<Element, string> = {
  glacio: 'var(--color-glacio)',
  fusion: 'var(--color-fusion)',
  electro: 'var(--color-electro)',
  aero: 'var(--color-aero)',
  spectro: 'var(--color-spectro)',
  havoc: 'var(--color-havoc)',
};

interface PaletteItem {
  key: string;
  kind: 'page' | 'character' | 'weapon';
  label: string;
  sublabel: string;
  href: string;
  color?: string;
  icon?: string;
}

const PAGE_ITEMS = [
  { href: '/', labelKey: 'home', index: '00' },
  { href: '/characters', labelKey: 'characters', index: '01' },
  { href: '/calculator', labelKey: 'calculator', index: '02' },
  { href: '/party', labelKey: 'party', index: '03' },
  { href: '/tower', labelKey: 'tower', index: '04' },
  { href: '/weapons', labelKey: 'weapons', index: '05' },
] as const;

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

/**
 * ⌘K 커맨드 팔레트 — 페이지·캐릭터·무기를 한 입력창에서 검색해 즉시 이동.
 * 모든 페이지를 잇는 사이트의 점프 게이트.
 */
export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  const items = useMemo<PaletteItem[]>(() => {
    const q = query.trim().toLowerCase();

    const pages: PaletteItem[] = PAGE_ITEMS.filter(
      (p) => !q || t(`nav.${p.labelKey}`).toLowerCase().includes(q),
    ).map((p) => ({
      key: `page:${p.href}`,
      kind: 'page',
      label: t(`nav.${p.labelKey}`),
      sublabel: `/ ${p.index}`,
      href: p.href,
    }));

    if (!q) return pages;

    const chars: PaletteItem[] = characters
      .filter(
        (c) =>
          c.name.ko.toLowerCase().includes(q) || c.name.en.toLowerCase().includes(q),
      )
      .slice(0, 8)
      .map((c) => ({
        key: `char:${c.id}`,
        kind: 'character',
        label: (c.name[locale] ?? c.name.en) as string,
        sublabel: `${c.rarity}★ ${t(`element.${c.element}`)} · ${t(`weaponType.${c.weaponType}`)}`,
        href: `/characters/${c.id}`,
        color: ELEMENT_VAR[c.element],
        icon: `/images/characters/head/${c.id}.webp`,
      }));

    const weaps: PaletteItem[] = weapons
      .filter(
        (w) =>
          w.name.ko.toLowerCase().includes(q) || w.name.en.toLowerCase().includes(q),
      )
      .slice(0, 8)
      .map((w) => ({
        key: `weapon:${w.id}`,
        kind: 'weapon',
        label: (w.name[locale] ?? w.name.en) as string,
        sublabel: `${w.rarity}★ ${t(`weaponType.${w.type}`)}`,
        href: `/weapons?q=${encodeURIComponent(w.name.en)}`,
        icon: `/images/weapons/${w.id}.webp`,
      }));

    return [...pages, ...chars, ...weaps];
  }, [query, locale, t]);

  // 열릴 때 초기화 + 포커스 + 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setCursor(0);
    document.body.style.overflow = 'hidden';
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = '';
      cancelAnimationFrame(id);
    };
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  const select = useCallback(
    (item: PaletteItem) => {
      onClose();
      router.push(item.href);
    },
    [onClose, router],
  );

  // 키보드 내비게이션
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      } else if (e.key === 'Enter' && items[cursor]) {
        e.preventDefault();
        select(items[cursor]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, items, cursor, onClose, select]);

  // 커서가 리스트 밖으로 나가면 따라 스크롤
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${cursor}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  if (!open) return null;

  const sections: { label: string; items: PaletteItem[] }[] = [
    { label: t('palette.pages'), items: items.filter((i) => i.kind === 'page') },
    { label: t('palette.characters'), items: items.filter((i) => i.kind === 'character') },
    { label: t('palette.weapons'), items: items.filter((i) => i.kind === 'weapon') },
  ].filter((s) => s.items.length > 0);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label={t('palette.open')}
    >
      {/* 백드롭 — 검은 해안 잉크 */}
      <button
        type="button"
        aria-label={t('palette.close')}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[rgba(11,22,38,0.45)] backdrop-blur-sm"
        style={{ animation: 'fade-up 0.2s ease-out both' }}
      />

      {/* 패널 */}
      <div
        className="glass-card relative w-full max-w-xl overflow-hidden rounded-2xl shadow-[0_24px_80px_-16px_rgba(11,22,38,0.45)]"
        style={{ animation: 'letter-rise 0.35s cubic-bezier(0.16, 1, 0.3, 1) both' }}
      >
        {/* 입력 */}
        <div className="flex items-center gap-3 border-b border-border/70 px-5 py-4">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="shrink-0 text-text-muted"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('palette.placeholder')}
            className="w-full bg-transparent text-base text-text placeholder-text-muted outline-none"
            data-cursor="text"
          />
          <kbd className="hidden shrink-0 rounded-md border border-border bg-bg px-1.5 py-0.5 font-mono text-[11px] text-text-muted sm:block">
            ESC
          </kbd>
        </div>

        {/* 결과 */}
        <div ref={listRef} data-lenis-prevent className="max-h-[50vh] overflow-y-auto p-2">
          {items.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-text-muted">
              {t('palette.noResults')}
            </p>
          ) : (
            sections.map((section) => (
              <div key={section.label} className="mb-1">
                <p className="px-3 pb-1 pt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-text-muted">
                  {section.label}
                </p>
                {section.items.map((item) => {
                  const idx = items.indexOf(item);
                  const active = idx === cursor;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      data-idx={idx}
                      onClick={() => select(item)}
                      onMouseMove={() => setCursor(idx)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        active ? 'bg-primary/10' : ''
                      }`}
                    >
                      {item.kind === 'character' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.icon}
                          alt=""
                          width={28}
                          height={28}
                          loading="lazy"
                          className="h-7 w-7 shrink-0 rounded-lg object-cover"
                          style={{ background: `color-mix(in srgb, ${item.color} 18%, var(--color-bg))` }}
                        />
                      ) : item.kind === 'weapon' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.icon}
                          alt=""
                          width={28}
                          height={28}
                          loading="lazy"
                          className="h-7 w-7 shrink-0 rounded-lg bg-[color:var(--color-card-deep)] object-cover"
                        />
                      ) : (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-coast-mid)]/10 text-[color:var(--color-coast-mid)]">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </span>
                      )}
                      <span className={`flex-1 truncate text-sm font-medium ${active ? 'text-primary' : 'text-text'}`}>
                        {item.label}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-text-muted">
                        {item.sublabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* 푸터 힌트 */}
        <div className="flex items-center gap-4 border-t border-border/70 px-5 py-2.5 font-mono text-[11px] text-text-muted">
          <span>↑↓ {t('palette.navigate')}</span>
          <span>↵ {t('palette.select')}</span>
          <span>esc {t('palette.close')}</span>
        </div>
      </div>
    </div>
  );
}
