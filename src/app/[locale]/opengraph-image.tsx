// src/app/[locale]/opengraph-image.tsx — 소셜 공유 카드 (1200×630)
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'WuCalc — Wuthering Waves Build Calculator';

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline =
    locale === 'ko'
      ? '명조 올인원 빌드 계산기'
      : 'The all-in-one Wuthering Waves build calculator';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #F4F6FA 0%, #E4E9F2 70%, #0B1424 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 28,
            letterSpacing: 12,
            textTransform: 'uppercase',
            color: '#4A5876',
          }}
        >
          Black Shores · Resonance Lab
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 180,
            fontWeight: 800,
            letterSpacing: -8,
            color: '#0B1626',
            marginTop: 8,
          }}
        >
          WuCalc
        </div>
        <div style={{ display: 'flex', fontSize: 36, color: '#1A3D6E', marginTop: 8 }}>
          {tagline}
        </div>
      </div>
    ),
    size,
  );
}
