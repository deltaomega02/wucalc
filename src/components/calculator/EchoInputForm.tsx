// src/components/calculator/EchoInputForm.tsx
'use client';

import { useCallback, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { EchoCost, StatType } from '@/types/game';
import type { EchoSlot } from '@/stores/buildStore';
import { mainStatOptions, getSubStatTiers } from '@/data';

interface EchoInputFormProps {
  label: string;
  echo: EchoSlot;
  onChange: (echo: Partial<EchoSlot>) => void;
  onSubStatChange: (index: number, type: StatType | '', value: number) => void;
  accent: string;
  borderClass: string;
  bgClass: string;
  /** 비교 대상 에코 (인라인 차이 표시용) */
  compareWith?: EchoSlot;
  /** 현재 에코 복사 버튼 */
  onCopyFrom?: () => void;
  copyLabel?: string;
}

const COSTS: EchoCost[] = [4, 3, 1];
const SUB_STAT_TYPES: StatType[] = [
  'critRate', 'critDmg', 'atkPercent', 'atk',
  'hpPercent', 'hp', 'defPercent', 'def',
  'energyRegen', 'normalDmgBonus', 'heavyDmgBonus',
  'skillDmgBonus', 'liberationDmgBonus',
];

export default function EchoInputForm({
  label, echo, onChange, onSubStatChange, accent, borderClass, bgClass,
  compareWith, onCopyFrom, copyLabel,
}: EchoInputFormProps) {
  const t = useTranslations();
  const available = mainStatOptions[String(echo.cost)] ?? [];

  /** 서브옵 각 행의 value 드롭다운 ref (자동 포커스용) */
  const valueRefs = useRef<(HTMLSelectElement | null)[]>([]);
  /** 서브옵 각 행의 type 드롭다운 ref */
  const typeRefs = useRef<(HTMLSelectElement | null)[]>([]);

  const handleCostChange = useCallback(
    (cost: EchoCost) => {
      const newMains = mainStatOptions[String(cost)] ?? [];
      const first = newMains[0];
      onChange({ cost, mainStatType: first?.type ?? 'atkPercent', mainStatValue: first?.maxValue ?? 0 });
    },
    [onChange],
  );

  const handleMainTypeChange = useCallback(
    (type: StatType) => {
      const opt = available.find((o) => o.type === type);
      onChange({ mainStatType: type, mainStatValue: opt?.maxValue ?? 0 });
    },
    [onChange, available],
  );

  /** 서브옵 타입 선택 → 값 드롭다운 자동 포커스 */
  const handleSubTypeChange = useCallback(
    (idx: number, newType: StatType | '') => {
      const tiers = newType ? getSubStatTiers(newType) : [];
      const defaultVal = tiers.length > 0 ? tiers[Math.floor(tiers.length / 2)] : 0;
      onSubStatChange(idx, newType, defaultVal);
      // 타입 선택 후 → 값 드롭다운 포커스
      setTimeout(() => valueRefs.current[idx]?.focus(), 30);
    },
    [onSubStatChange],
  );

  /** 서브옵 값 선택 → 다음 행 타입 드롭다운 자동 포커스 */
  const handleSubValueChange = useCallback(
    (idx: number, type: StatType | '', value: number) => {
      onSubStatChange(idx, type, value);
      // 마지막 행이 아니면 다음 행 타입으로 포커스
      if (idx < 4) {
        setTimeout(() => typeRefs.current[idx + 1]?.focus(), 30);
      }
    },
    [onSubStatChange],
  );

  return (
    <div className={`rounded-xl border-2 ${borderClass} overflow-hidden`}>
      {/* Header */}
      <div className={`${bgClass} px-4 py-3 flex items-center justify-between`}>
        <h3 className={`text-sm font-bold ${accent}`}>{label}</h3>
        <div className="flex items-center gap-2">
          {onCopyFrom && (
            <button
              type="button"
              onClick={onCopyFrom}
              className="rounded-md bg-bg/50 px-2 py-1 text-[12px] font-medium text-text-muted hover:text-text transition-colors"
              title={copyLabel}
            >
              {copyLabel}
            </button>
          )}
          <div className="flex gap-1">
            {COSTS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleCostChange(c)}
                className={`h-7 w-9 rounded-md text-xs font-bold transition-all ${
                  echo.cost === c
                    ? `${accent} ring-1 ring-current bg-bg/50`
                    : 'text-text-muted bg-bg/30 hover:text-text'
                }`}
              >
                {c}C
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Main Stat */}
        <div>
          <label className="mb-1 block text-[12px] font-medium text-text-muted uppercase tracking-wider">
            {t('calc.mainStat')}
          </label>
          <div className="flex gap-2">
            <select
              value={echo.mainStatType}
              onChange={(e) => handleMainTypeChange(e.target.value as StatType)}
              className="flex-1 rounded-lg border border-border bg-bg px-2.5 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
            >
              {available.map((opt) => (
                <option key={opt.type} value={opt.type}>
                  {t(`stat.${opt.type}`)} ({isFlat(opt.type) ? opt.maxValue : `${(opt.maxValue * 100).toFixed(1)}%`})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub Stats — 자동 포커스 체인 */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-text-muted uppercase tracking-wider">
            {t('calc.subStats')}
          </label>
          <div className="space-y-1">
            {echo.subStats.map((sub: { type: StatType | ''; value: number }, idx: number) => {
              const tiers = sub.type ? getSubStatTiers(sub.type) : [];
              const flat = isFlat(sub.type as StatType);

              // 비교 대상과의 차이 계산
              const compareVal = compareWith?.subStats[idx];
              const hasDiff = compareWith && sub.type && compareVal?.type === sub.type &&
                Math.abs(sub.value - (compareVal?.value ?? 0)) > 0.0001;
              const diffPositive = hasDiff && sub.value > (compareVal?.value ?? 0);

              return (
                <div key={idx} className="flex items-center gap-1">
                  <span className="w-4 text-center text-[12px] text-text-muted">{idx + 1}</span>
                  {/* Type */}
                  <select
                    ref={(el) => { typeRefs.current[idx] = el; }}
                    value={sub.type}
                    onChange={(e) => handleSubTypeChange(idx, e.target.value as StatType | '')}
                    className="flex-1 rounded-md border border-border bg-bg px-1.5 py-1.5 text-xs text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                  >
                    <option value="">—</option>
                    {SUB_STAT_TYPES.map((st) => (
                      <option key={st} value={st}>{t(`stat.${st}`)}</option>
                    ))}
                  </select>
                  {/* Value */}
                  {sub.type && tiers.length > 0 ? (
                    <select
                      ref={(el) => { valueRefs.current[idx] = el; }}
                      value={sub.value}
                      onChange={(e) => handleSubValueChange(idx, sub.type as StatType, parseFloat(e.target.value))}
                      className={`w-24 rounded-md border border-border bg-bg px-1.5 py-1.5 text-right text-xs font-mono outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 ${
                        sub.value >= tiers[tiers.length - 1] - 0.0001
                          ? accent
                          : 'text-text'
                      }`}
                    >
                      {tiers.map((tier: number, i: number) => (
                        <option key={i} value={tier}>
                          {flat ? tier : `${(tier * 100).toFixed(1)}%`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-24" />
                  )}
                  {/* 인라인 차이 표시 */}
                  {hasDiff && (
                    <span className={`w-5 text-center text-[12px] font-bold ${diffPositive ? 'text-positive' : 'text-negative'}`}>
                      {diffPositive ? '▲' : '▼'}
                    </span>
                  )}
                  {!hasDiff && compareWith && <span className="w-5" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function isFlat(type: StatType | string): boolean {
  return type === 'hp' || type === 'atk' || type === 'def';
}
