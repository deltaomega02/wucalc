// src/app/[locale]/not-found.tsx
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function LocaleNotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p
        className="text-[96px] font-bold leading-none text-text/10 sm:text-[140px]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        404
      </p>
      <h1
        className="mt-2 text-2xl font-bold text-text sm:text-3xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {t('title')}
      </h1>
      <p className="mt-3 max-w-md text-sm text-text-muted">{t('description')}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[color:var(--color-coast-deep)] px-6 py-3 text-sm font-medium text-white transition-shadow hover:shadow-[0_8px_24px_-4px_rgba(11,22,38,0.4)]"
      >
        {t('home')}
      </Link>
    </div>
  );
}
