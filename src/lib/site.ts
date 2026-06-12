// src/lib/site.ts — 사이트 전역 상수 (배포 시 NEXT_PUBLIC_SITE_URL 환경변수로 덮어쓴다)
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wucalc.app';
