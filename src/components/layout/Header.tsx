// src/components/layout/Header.tsx
'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import CommandPalette from './CommandPalette';

const NAV_ITEMS = [
  { href: '/characters', labelKey: 'characters' },
  { href: '/weapons', labelKey: 'weapons' },
  { href: '/calculator', labelKey: 'calculator' },
  { href: '/party', labelKey: 'party' },
  { href: '/tower', labelKey: 'tower' },
] as const;

function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <path
        d="M3.5 14.5C5.5 12 7 16.5 9 14.5C11 12.5 12.5 17 14.5 14.5C16.5 12 18.5 16 20.5 13.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5 10.5C7 8.5 8.5 12 10.5 10C12.5 8 14 11.5 16 9.5C17.5 8 19 10.5 20 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations('nav');
  const tPalette = useTranslations('palette');
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 라우트 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // ⌘K / Ctrl+K — 어디서든 커맨드 팔레트
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-[box-shadow,background-color] duration-300 ${
        scrolled
          ? 'bg-surface/80 shadow-[0_1px_0_var(--color-border),0_8px_24px_-12px_rgba(11,22,38,0.12)]'
          : 'bg-bg/70'
      } backdrop-blur-xl backdrop-saturate-150`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-black tracking-tight text-text transition-colors hover:text-primary"
        >
          <span className="text-[color:var(--color-coast-mid)]">
            <LogoMark />
          </span>
          <span>
            Wu<span className="text-primary">Calc</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
          {NAV_ITEMS.map(({ href, labelKey }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'text-text'
                    : 'text-text-muted hover:bg-surface-hover hover:text-text'
                }`}
              >
                {t(labelKey)}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[13px] h-[2px] rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
          {/* 커맨드 팔레트 트리거 */}
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="ml-2 flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-border-hover hover:text-text"
            aria-label={tPalette('open')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <kbd className="font-mono text-[11px] tracking-wide">⌘K</kbd>
          </button>
          <div className="ml-3 border-l border-border pl-4">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile: 검색 + 메뉴 버튼 */}
        <div className="flex items-center gap-1 sm:hidden">
        <button
          type="button"
          className="rounded-lg p-2 text-text-muted hover:bg-surface-hover hover:text-text"
          onClick={() => setPaletteOpen(true)}
          aria-label={tPalette('open')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-text-muted hover:bg-surface-hover hover:text-text"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12h16" />
              <path d="M4 6h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav
          className="border-t border-border bg-surface px-4 pb-4 sm:hidden"
          aria-label="Mobile"
        >
          {NAV_ITEMS.map(({ href, labelKey }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`block rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  active ? 'bg-primary/8 text-primary' : 'text-text-muted hover:text-text'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(labelKey)}
              </Link>
            );
          })}
          <div className="mt-3 border-t border-border pt-3">
            <LanguageSwitcher />
          </div>
        </nav>
      )}

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}
