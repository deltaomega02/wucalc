// src/app/[locale]/characters/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { characters } from '@/data';
import CharacterDetail from '@/components/characters/CharacterDetail';

export async function generateStaticParams() {
  return characters.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const character = characters.find((c) => c.id === id);
  if (!character) return {};

  const t = await getTranslations({ locale, namespace: 'meta' });
  const name = character.name[locale] ?? character.name.en;

  return {
    title: `${name} — WuCalc`,
    description: t('description'),
  };
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const character = characters.find((c) => c.id === id);

  if (!character) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <CharacterDetail character={character} />
    </div>
  );
}
