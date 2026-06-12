// src/app/[locale]/tower/page.tsx
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageHeader from '@/components/ui/PageHeader';
import NextStepRibbon from '@/components/ui/NextStepRibbon';
import TowerClient from '@/components/tower/TowerClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tower' });
  return { title: t('title'), description: t('subtitle') };
}

export default function TowerPage() {
  const t = useTranslations('tower');
  const tNext = useTranslations('next');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        accent="accent"
        index="04"
        eyebrow={t('eyebrow')}
      />
      <TowerClient />
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
            href: '/characters',
            title: tNext('characters'),
            desc: tNext('charactersDesc'),
            index: '01',
          },
        ]}
      />
    </div>
  );
}
