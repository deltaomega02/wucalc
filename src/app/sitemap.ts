// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { characters } from '@/data';
import { SITE_URL } from '@/lib/site';

const STATIC_PATHS = ['', '/characters', '/weapons', '/calculator', '/party', '/tower'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.8,
      });
    }
    for (const char of characters) {
      entries.push({
        url: `${SITE_URL}/${locale}/characters/${char.id}`,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
