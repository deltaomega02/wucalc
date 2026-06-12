// src/components/layout/GlobalEffects.tsx
'use client';

import { CustomCursor } from '@/components/design/CustomCursor';
import { SmoothScroll } from '@/components/design/SmoothScroll';
import { ClickRipple } from '@/components/design/ClickRipple';

/**
 * 전 페이지 공통 시그니처 모션 — 잉크 커서 + 관성 스크롤 + 클릭 파문 링.
 * 수면(caustics)은 홈 히어로에서만 렌더한다 — 상시 흔들림/전면 오버레이는
 * UX를 해쳐서 제거함 (2026-06-12 사용자 결정).
 */
export default function GlobalEffects() {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <ClickRipple />
    </>
  );
}
