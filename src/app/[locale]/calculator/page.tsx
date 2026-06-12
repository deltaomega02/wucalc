// src/app/[locale]/calculator/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageHeader from '@/components/ui/PageHeader';
import NextStepRibbon from '@/components/ui/NextStepRibbon';
import CalculatorClient from '@/components/calculator/CalculatorClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'calc' });
  return { title: t('title'), description: t('subtitle') };
}

export default function CalculatorPage() {
  const t = useTranslations('calc');
  const tNext = useTranslations('next');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        index="02"
        eyebrow={t('eyebrow')}
      />
      <Suspense>
        <CalculatorClient />
      </Suspense>
      <NextStepRibbon
        label={tNext('label')}
        steps={[
          {
            href: '/party',
            title: tNext('party'),
            desc: tNext('partyDesc'),
            index: '03',
          },
          {
            href: '/weapons',
            title: tNext('weapons'),
            desc: tNext('weaponsDesc'),
            index: '05',
          },
        ]}
      />
    </div>
  );
}
