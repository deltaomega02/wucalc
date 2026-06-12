// src/app/[locale]/party/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageHeader from '@/components/ui/PageHeader';
import NextStepRibbon from '@/components/ui/NextStepRibbon';
import PartyClient from '@/components/party/PartyClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'party' });
  return { title: t('title'), description: t('subtitle') };
}

export default function PartyPage() {
  const t = useTranslations('party');
  const tNext = useTranslations('next');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        accent="accent"
        index="03"
        eyebrow={t('eyebrow')}
      />
      <Suspense>
        <PartyClient />
      </Suspense>
      <NextStepRibbon
        label={tNext('label')}
        steps={[
          {
            href: '/tower',
            title: tNext('tower'),
            desc: tNext('towerDesc'),
            index: '04',
          },
          {
            href: '/calculator',
            title: tNext('calculator'),
            desc: tNext('calculatorDesc'),
            index: '02',
          },
        ]}
      />
    </div>
  );
}
