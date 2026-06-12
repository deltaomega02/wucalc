// src/lib/calc/__tests__/stats.test.ts
import { describe, it, expect } from 'vitest';
import {
  calcBaseAtk,
  sumStatFromSources,
  calcTotalAtk,
  calcTotalHp,
  calcTotalDef,
  calcFinalStats,
  getAttackTypeBonus,
} from '../stats';
import type {
  Character,
  Weapon,
  Echo,
  EchoSet,
  StatType,
} from '@/types/game';

const dummyCharacter: Character = {
  id: 'dummy',
  name: { ko: '더미', en: 'Dummy' },
  rarity: 5,
  element: 'aero',
  weaponType: 'broadblade',
  baseStats: { '90': { hp: 11000, atk: 400, def: 1100 } },
  ascensionStat: { type: 'critRate', value: 0.08 },
  skills: [],
};

const dummyWeapon: Weapon = {
  id: 'dummyw',
  name: { ko: '더미무기', en: 'DummyW' },
  rarity: 5,
  type: 'broadblade',
  baseAtk: { '90': 500 },
  subStat: { type: 'critDmg', value: 0.36 },
  passive: {
    name: { ko: 'p', en: 'p' },
    description: { ko: '', en: '' },
    stats: [{ type: 'atkPercent', value: 0.12 }],
  },
};

const emptyEchoSets: EchoSet[] = [];

const makeEcho = (
  mainType: StatType,
  mainValue: number,
  subStats: { type: StatType; value: number }[] = [],
): Echo => ({
  cost: 4,
  mainStat: { type: mainType, value: mainValue },
  subStats,
});

describe('calcBaseAtk', () => {
  it('캐릭터 + 무기 기초 ATK 단순 합', () => {
    expect(calcBaseAtk(dummyCharacter, '90', dummyWeapon, '90')).toBe(900);
  });
});

describe('sumStatFromSources — 스탯 합산', () => {
  it('에코 메인스탯 + 무기 패시브 스탯이 합산된다', () => {
    const echo = makeEcho('atkPercent', 0.33);
    const total = sumStatFromSources('atkPercent', [echo], dummyWeapon, [], dummyCharacter);
    // 에코 +33% + 무기 패시브 +12% = 45%
    expect(total).toBeCloseTo(0.45, 6);
  });

  it('에코 부각도 합산된다', () => {
    const echo = makeEcho('hp', 0, [
      { type: 'atkPercent', value: 0.06 },
      { type: 'atkPercent', value: 0.04 },
    ]);
    const total = sumStatFromSources('atkPercent', [echo], dummyWeapon, [], dummyCharacter);
    // 부각 6+4 = 10% + 무기 패시브 12% = 22%
    expect(total).toBeCloseTo(0.22, 6);
  });

  it('무기 subStat이 일치하면 합산', () => {
    const total = sumStatFromSources('critDmg', [], dummyWeapon, [], dummyCharacter);
    expect(total).toBeCloseTo(0.36, 6);
  });

  it('캐릭터 승급 보너스도 합산', () => {
    const total = sumStatFromSources('critRate', [], dummyWeapon, [], dummyCharacter);
    expect(total).toBeCloseTo(0.08, 6);
  });
});

describe('calcTotalAtk — TotalATK = BaseATK × (1 + ATK%) + FlatATK', () => {
  it('표준 케이스', () => {
    expect(calcTotalAtk(900, 0.5, 100)).toBeCloseTo(900 * 1.5 + 100, 6);
  });

  it('Flat은 % 영향 받지 않음', () => {
    expect(calcTotalAtk(1000, 0, 200)).toBe(1200);
    expect(calcTotalAtk(1000, 0.5, 0)).toBe(1500);
  });
});

describe('calcTotalHp / calcTotalDef', () => {
  it('HP 동일 식', () => {
    expect(calcTotalHp(10000, 0.3, 500)).toBe(10000 * 1.3 + 500);
  });
  it('DEF 동일 식', () => {
    expect(calcTotalDef(1000, 0.2, 50)).toBe(1000 * 1.2 + 50);
  });
});

describe('calcFinalStats — 통합 스탯 계산', () => {
  it('빈 에코 + 표준 무기에서 일관성', () => {
    const stats = calcFinalStats(dummyCharacter, '90', dummyWeapon, '90', [], emptyEchoSets);
    // BaseATK 900, ATK% 12% (무기 패시브) → 1008
    expect(stats.atk).toBeCloseTo(1008, 4);
    // CritRate = 5% + 8% (승급) = 13%
    expect(stats.critRate).toBeCloseTo(0.13, 6);
    // CritDmg = 150% + 36% (무기 subStat) = 186%
    expect(stats.critDmg).toBeCloseTo(1.86, 6);
  });

  it('에코로 속성 피해 보너스 추가 시 elementDmgBonus 반영', () => {
    const echo = makeEcho('aeroDmgBonus', 0.3);
    const stats = calcFinalStats(dummyCharacter, '90', dummyWeapon, '90', [echo], emptyEchoSets);
    expect(stats.elementDmgBonus).toBeCloseTo(0.3, 6);
  });

  it('CR이 100% 초과 시 1로 클램프', () => {
    const echo = makeEcho('critRate', 2.0);
    const stats = calcFinalStats(dummyCharacter, '90', dummyWeapon, '90', [echo], emptyEchoSets);
    expect(stats.critRate).toBe(1);
  });
});

describe('getAttackTypeBonus — 공격 타입별 보너스 추출', () => {
  it('skill 타입 → skillDmgBonus 추출', () => {
    const stats = calcFinalStats(
      dummyCharacter,
      '90',
      dummyWeapon,
      '90',
      [makeEcho('skillDmgBonus', 0.25)],
      emptyEchoSets,
    );
    expect(getAttackTypeBonus(stats, 'skill')).toBeCloseTo(0.25, 6);
  });

  it('liberation 타입 → liberationDmgBonus', () => {
    const stats = calcFinalStats(
      dummyCharacter,
      '90',
      dummyWeapon,
      '90',
      [makeEcho('liberationDmgBonus', 0.4)],
      emptyEchoSets,
    );
    expect(getAttackTypeBonus(stats, 'liberation')).toBeCloseTo(0.4, 6);
  });

  it('normal 타입 → normalDmgBonus', () => {
    const stats = calcFinalStats(
      dummyCharacter,
      '90',
      dummyWeapon,
      '90',
      [makeEcho('normalDmgBonus', 0.15)],
      emptyEchoSets,
    );
    expect(getAttackTypeBonus(stats, 'normal')).toBeCloseTo(0.15, 6);
  });
});
