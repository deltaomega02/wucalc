// src/lib/calc/boss.ts
import type { Element } from '@/types/game';
import levelCurveData from '@/data/enemies/levelCurve.json';

const CURVE = levelCurveData.curve as Record<string, { hpRatio: number; atkRatio: number; defRatio: number }>;

export interface Boss {
  id: string;
  name: Record<string, string>;
  category: 'overlord' | 'calamity';
  element: Element;
  baseHp: number;
  baseDef: number;
  baseResistance: number;
  elementResistance: Partial<Record<Element, number>>;
}

export interface BossAtLevel {
  hp: number;
  def: number;
  resistance: Record<Element, number>;
}

/**
 * 보스의 특정 레벨 스탯 계산
 *
 * Actual_HP = baseHp × (hpRatio / 10000)
 * Actual_DEF = baseDef × (defRatio / 10000)
 */
export function calcBossStatsAtLevel(boss: Boss, level: number): BossAtLevel {
  const levelKey = String(Math.min(120, Math.max(1, Math.round(level / 10) * 10)));
  const curve = CURVE[levelKey] ?? CURVE['90'];

  const hp = Math.round(boss.baseHp * (curve.hpRatio / 10000));
  const def = Math.round(boss.baseDef * (curve.defRatio / 10000));

  const elements: Element[] = ['fusion', 'glacio', 'aero', 'electro', 'havoc', 'spectro'];
  const resistance: Record<Element, number> = {} as Record<Element, number>;
  for (const elem of elements) {
    resistance[elem] = boss.elementResistance[elem] ?? boss.baseResistance;
  }

  return { hp, def, resistance };
}

/**
 * 보스 클리어 가능성 추정
 *
 * 예상 파티 DPS × 제한시간 vs 보스 HP → 클리어 배율(%)
 * > 100% = 클리어 가능, < 100% = 부족
 */
export function estimateClearRate(
  partyDps: number,
  bossHp: number,
  timeLimit: number,
  effectiveUptime: number = 0.85,
): number {
  const totalDamage = partyDps * timeLimit * effectiveUptime;
  return totalDamage / bossHp;
}

/**
 * 클리어 배율에 따른 등급
 */
export function getClearGrade(clearRate: number): {
  grade: string;
  color: string;
  description: Record<string, string>;
} {
  if (clearRate >= 2.0) {
    return {
      grade: 'SSS',
      color: 'text-accent',
      description: { ko: '여유롭게 클리어', en: 'Comfortable clear' },
    };
  }
  if (clearRate >= 1.5) {
    return {
      grade: 'SS',
      color: 'text-positive',
      description: { ko: '안정적 클리어', en: 'Stable clear' },
    };
  }
  if (clearRate >= 1.2) {
    return {
      grade: 'S',
      color: 'text-positive',
      description: { ko: '클리어 가능', en: 'Clearable' },
    };
  }
  if (clearRate >= 1.0) {
    return {
      grade: 'A',
      color: 'text-primary',
      description: { ko: '빡세게 클리어', en: 'Tight clear' },
    };
  }
  if (clearRate >= 0.8) {
    return {
      grade: 'B',
      color: 'text-accent',
      description: { ko: '거의 가능 — 약간 부족', en: 'Almost — slightly short' },
    };
  }
  if (clearRate >= 0.5) {
    return {
      grade: 'C',
      color: 'text-negative',
      description: { ko: '부족 — 육성 필요', en: 'Not enough — need upgrades' },
    };
  }
  return {
    grade: 'D',
    color: 'text-negative',
    description: { ko: '많이 부족', en: 'Far from clearing' },
  };
}
