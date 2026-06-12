// src/lib/calc/__tests__/echoScore.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import {
  scoreEcho,
  buildDistributions,
  echoTopPercent,
  buildTopPercent,
  topPercentTone,
} from '../echoScore';
import { getSubStatTiers } from '@/data';
import type { StatType } from '@/types/game';

/** 시드 고정 LCG — 테스트 결정성 */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

const maxOf = (t: StatType) => {
  const tiers = getSubStatTiers(t);
  return tiers[tiers.length - 1];
};

const subs = (entries: [StatType, number][]) => ({
  subStats: [
    ...entries.map(([type, value]) => ({ type, value })),
    ...Array(5 - entries.length).fill({ type: '' as const, value: 0 }),
  ],
});

beforeAll(() => {
  buildDistributions(lcg(20260612));
});

describe('echoScore — 에코 점수 & 상위 % 추정', () => {
  it('빈 에코는 0점', () => {
    expect(scoreEcho(subs([]))).toBe(0);
  });

  it('이론상 최강 에코(크리확/크리피/공%/스킬/해방 최대 티어)는 100점', () => {
    const god = subs([
      ['critRate', maxOf('critRate')],
      ['critDmg', maxOf('critDmg')],
      ['atkPercent', maxOf('atkPercent')],
      ['skillDmgBonus', maxOf('skillDmgBonus')],
      ['liberationDmgBonus', maxOf('liberationDmgBonus')],
    ]);
    expect(scoreEcho(god)).toBeCloseTo(100, 5);
    expect(echoTopPercent(100)).toBeLessThanOrEqual(1);
  });

  it('방어계 옵션만 있으면 0점 — 분포 하위권', () => {
    const tank = subs([
      ['hpPercent', maxOf('hpPercent')],
      ['defPercent', maxOf('defPercent')],
      ['hp', maxOf('hp')],
    ]);
    expect(scoreEcho(tank)).toBe(0);
    expect(echoTopPercent(0)).toBeGreaterThan(90);
  });

  it('점수 단조성: 좋은 에코일수록 상위 %가 작거나 같다', () => {
    const mid = scoreEcho(subs([['critRate', maxOf('critRate')]]));
    const high = scoreEcho(
      subs([
        ['critRate', maxOf('critRate')],
        ['critDmg', maxOf('critDmg')],
      ]),
    );
    expect(high).toBeGreaterThan(mid);
    expect(echoTopPercent(high)).toBeLessThanOrEqual(echoTopPercent(mid));
  });

  it('5에코 종합: 최강 ×5는 상위 1% 이내, 0점은 하위권', () => {
    expect(buildTopPercent(500)).toBeLessThanOrEqual(1);
    expect(buildTopPercent(0)).toBeGreaterThan(90);
  });

  it('등급 톤 경계', () => {
    expect(topPercentTone(3)).toBe('gold');
    expect(topPercentTone(15)).toBe('purple');
    expect(topPercentTone(40)).toBe('cyan');
    expect(topPercentTone(80)).toBe('muted');
  });
});
