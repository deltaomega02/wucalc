// src/app/[locale]/error.tsx
'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-text-muted">Error</p>
      <h1
        className="mt-4 text-3xl font-bold text-text sm:text-4xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {t('title')}
      </h1>
      <p className="mt-3 max-w-md text-sm text-text-muted">{t('description')}</p>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-[color:var(--color-coast-deep)] px-6 py-3 text-sm font-medium text-white transition-shadow hover:shadow-[0_8px_24px_-4px_rgba(11,22,38,0.4)]"
        >
          {t('retry')}
        </button>
        <Link
          href="/"
          className="rounded-full border border-border-hover px-6 py-3 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
        >
          {t('home')}
        </Link>
      </div>
    </div>
  );
}
