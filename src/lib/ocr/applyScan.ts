// src/lib/ocr/applyScan.ts
// OCR 스캔 결과를 에코 입력 폼에 적용 — UI 드롭다운 체계에 맞게 값 스냅.
// EchoInputForm(비교 패널)과 ExpandedSlotEditor(내 에코 빌드)가 공유한다.

import type { StatType } from '@/types/game';
import type { EchoSlot } from '@/stores/buildStore';
import { mainStatOptions, getSubStatTiers } from '@/data';

export function applyScannedEcho(
  result: Partial<EchoSlot>,
  currentCost: EchoSlot['cost'],
  onChange: (partial: Partial<EchoSlot>) => void,
  onSubStatChange: (index: number, type: StatType | '', value: number) => void,
) {
  const cost = result.cost ?? currentCost;
  const payload: Partial<EchoSlot> = {};
  if (result.cost) payload.cost = result.cost;

  // 메인옵: 해당 코스트에서 유효한 타입이면 옵션 값(만렙 기준)으로 스냅,
  // 유효하지 않으면 기존 메인옵 유지 (잘못 덮어쓰지 않는다)
  if (result.mainStatType) {
    const opts = mainStatOptions[String(cost)] ?? [];
    const opt = opts.find((o) => o.type === result.mainStatType);
    if (opt) {
      payload.mainStatType = opt.type;
      payload.mainStatValue = opt.maxValue;
    }
  }
  if (Object.keys(payload).length > 0) onChange(payload);

  // 서브옵: 최근접 티어로 스냅
  result.subStats?.slice(0, 5).forEach((s, i) => {
    if (!s.type) {
      onSubStatChange(i, '', 0);
      return;
    }
    const tiers = getSubStatTiers(s.type);
    const snapped =
      tiers.length > 0
        ? tiers.reduce((best, tier) =>
            Math.abs(tier - s.value) < Math.abs(best - s.value) ? tier : best,
          )
        : s.value;
    onSubStatChange(i, s.type, snapped);
  });
}
