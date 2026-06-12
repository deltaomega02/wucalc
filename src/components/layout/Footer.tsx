// src/components/layout/Footer.tsx
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const TOOL_LINKS = [
  { href: '/characters', labelKey: 'characters' },
  { href: '/weapons', labelKey: 'weapons' },
  { href: '/calculator', labelKey: 'calculator' },
  { href: '/party', labelKey: 'party' },
  { href: '/tower', labelKey: 'tower' },
] as const;

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-border bg-surface">
      {/* 잔잔한 파도 라인 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-coast-mid)]/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <p className="text-lg font-black tracking-tight text-text">
              Wu<span className="text-primary">Calc</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {t('tagline')}
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {t('tools')}
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-1">
              {TOOL_LINKS.map(({ href, labelKey }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-text-muted transition-colors hover:text-primary"
                  >
                    {tNav(labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-text-muted">
          <p>{t('disclaimer')}</p>
          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p>{t('builtBy')}</p>
            <p>© {new Date().getFullYear()} WuCalc</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
