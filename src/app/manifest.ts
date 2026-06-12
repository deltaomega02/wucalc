// src/app/manifest.ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WuCalc — Wuthering Waves Build Calculator',
    short_name: 'WuCalc',
    description:
      'Echo comparison, weapon comparison, and party DPS simulation for Wuthering Waves',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F6FA',
    theme_color: '#0B1424',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
