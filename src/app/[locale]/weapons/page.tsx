// src/app/[locale]/weapons/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { weapons } from '@/data';
import PageHeader from '@/components/ui/PageHeader';
import NextStepRibbon from '@/components/ui/NextStepRibbon';
import WeaponsClient from '@/components/weapons/WeaponsClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'weapons' });
  return {
    title: t('title'),
    description: t('subtitle', { count: weapons.length }),
  };
}

export default function WeaponsPage() {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        title={t('weapons.title')}
        subtitle={t('weapons.subtitle', { count: weapons.length })}
        index="05"
        eyebrow={t('weapons.eyebrow')}
      />
      <Suspense>
        <WeaponsClient />
      </Suspense>
      <NextStepRibbon
        label={t('next.label')}
        steps={[
          {
            href: '/calculator',
            title: t('next.calculator'),
            desc: t('next.calculatorDesc'),
            index: '02',
          },
          {
            href: '/characters',
            title: t('next.characters'),
            desc: t('next.charactersDesc'),
            index: '01',
          },
        ]}
      />
    </div>
  );
}
