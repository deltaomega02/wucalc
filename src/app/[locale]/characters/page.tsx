// src/app/[locale]/characters/page.tsx
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { characters } from '@/data';
import PageHeader from '@/components/ui/PageHeader';
import NextStepRibbon from '@/components/ui/NextStepRibbon';
import CharacterGrid from '@/components/characters/CharacterGrid';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'characters' });
  return {
    title: t('title'),
    description: t('total', { count: characters.length }),
  };
}

export default function CharactersPage() {
  const t = useTranslations('characters');
  const tNext = useTranslations('next');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        title={t('title')}
        subtitle={t('total', { count: characters.length })}
        index="01"
        eyebrow={t('eyebrow')}
      />
      <CharacterGrid characters={characters} />
      <NextStepRibbon
        label={tNext('label')}
        steps={[
          {
            href: '/calculator',
            title: tNext('calculator'),
            desc: tNext('calculatorDesc'),
            index: '02',
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
