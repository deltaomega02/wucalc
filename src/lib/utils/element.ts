// src/lib/utils/element.ts
import type { Element } from '@/types/game';

/* 속성 색은 globals.css @theme의 --color-{element} 토큰을 그대로 사용한다.
   (라이트 베이스에 맞춰 깊은 채도로 정의되어 있음) */

/** 속성별 Tailwind 텍스트 색상 클래스 */
export const ELEMENT_TEXT_COLOR: Record<Element, string> = {
  fusion: 'text-fusion',
  glacio: 'text-glacio',
  aero: 'text-aero',
  electro: 'text-electro',
  havoc: 'text-havoc',
  spectro: 'text-spectro',
};

/** 속성별 Tailwind 배경 색상 클래스 */
export const ELEMENT_BG_COLOR: Record<Element, string> = {
  fusion: 'bg-fusion/10',
  glacio: 'bg-glacio/10',
  aero: 'bg-aero/10',
  electro: 'bg-electro/10',
  havoc: 'bg-havoc/10',
  spectro: 'bg-spectro/10',
};

/** 속성별 Tailwind 보더 색상 클래스 */
export const ELEMENT_BORDER_COLOR: Record<Element, string> = {
  fusion: 'border-fusion/30',
  glacio: 'border-glacio/30',
  aero: 'border-aero/30',
  electro: 'border-electro/30',
  havoc: 'border-havoc/30',
  spectro: 'border-spectro/30',
};

/** 등급별 Tailwind 텍스트 색상 (5★ 골드 / 4★ 퍼플 / 3★ 청록) */
export const RARITY_COLOR: Record<number, string> = {
  5: 'text-primary',
  4: 'text-electro',
  3: 'text-accent',
};

/** 속성별 CSS 변수 — 텍스트 안전 (인라인 style용) */
export const ELEMENT_VAR: Record<Element, string> = {
  glacio: 'var(--color-glacio)',
  fusion: 'var(--color-fusion)',
  electro: 'var(--color-electro)',
  aero: 'var(--color-aero)',
  spectro: 'var(--color-spectro)',
  havoc: 'var(--color-havoc)',
};

/** 속성별 브라이트 CSS 변수 — 이미지 백드롭/글로우 전용 (텍스트 금지) */
export const ELEMENT_VAR_BRIGHT: Record<Element, string> = {
  glacio: 'var(--color-el-glacio)',
  fusion: 'var(--color-el-fusion)',
  electro: 'var(--color-el-electro)',
  aero: 'var(--color-el-aero)',
  spectro: 'var(--color-el-spectro)',
  havoc: 'var(--color-el-havoc)',
};

/** 희귀도별 타일 배경/글로우 클래스 */
export const RARITY_TILE: Record<number, string> = {
  5: 'bg-r5 glow-r5',
  4: 'bg-r4 glow-r4',
  3: 'bg-r3 glow-r3',
};
