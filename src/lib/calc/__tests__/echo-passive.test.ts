// src/lib/calc/__tests__/echo-passive.test.ts
import { describe, it, expect } from 'vitest';
import charactersData from '@/data/characters.json';
import weaponsData from '@/data/weapons.json';
import { compareEchoes } from '../echo';
import type { Character, Echo, EchoSet, Weapon } from '@/types/game';

/**
 * echo.ts compareEchoes에 WEAPON_PASSIVES + 인헤런트/체인/상태 효과가
 * 통합된 후의 동작 검증.
 *
 * - diff는 변하지 않음 (양쪽 동일 캐릭터/무기 → 패시브 동일 적용)
 * - damageA / damageB 절대값은 패시브 반영으로 증가
 */

function findCharacter(id: string): Character {
  const c = (charactersData as unknown as Character[]).find((x) => x.id === id);
  if (!c) throw new Error(`Character ${id} not found`);
  return c;
}

function findWeapon(id: string): Weapon {
  const w = (weaponsData as unknown as Weapon[]).find((x) => x.id === id);
  if (!w) throw new Error(`Weapon ${id} not found`);
  return w;
}

const emptyBaseEchoes: Echo[] = [];
const noEchoSets: EchoSet[] = [];

const echoATK33: Echo = {
  cost: 4,
  mainStat: { type: 'atkPercent', value: 0.33 },
  subStats: [],
};
const echoElem30: Echo = {
  cost: 4,
  mainStat: { type: 'aeroDmgBonus', value: 0.30 },
  subStats: [],
};
const echoCritRate22: Echo = {
  cost: 4,
  mainStat: { type: 'critRate', value: 0.22 },
  subStats: [],
};

describe('compareEchoes — passive 통합', () => {
  it('동일 에코 비교 시 diff = 0', () => {
    const jiyan = findCharacter('jiyan');
    const verdantSummit = findWeapon('verdant-summit');
    const result = compareEchoes(
      jiyan, '90', verdantSummit, '90',
      emptyBaseEchoes, noEchoSets,
      echoATK33, echoATK33, // 동일 echo
      2.5, 'heavy', 90, 0.1, 1520,
    );
    expect(result.diff).toBeCloseTo(0, 4);
  });

  it('ATK 에코 vs 속성 에코 — 양수 damage + 의미 있는 diff', () => {
    const jiyan = findCharacter('jiyan');
    const verdantSummit = findWeapon('verdant-summit');
    const result = compareEchoes(
      jiyan, '90', verdantSummit, '90',
      emptyBaseEchoes, noEchoSets,
      echoATK33, echoElem30,
      2.5, 'heavy', 90, 0.1, 1520,
    );
    expect(result.damageA).toBeGreaterThan(0);
    expect(result.damageB).toBeGreaterThan(0);
    expect(Math.abs(result.diff)).toBeGreaterThan(0);
  });

  it('패시브 통합으로 절대값 damage가 더 커진다 (Verdant Summit +48% Heavy + 인헤런트 적용)', () => {
    const jiyan = findCharacter('jiyan');
    const verdantSummit = findWeapon('verdant-summit');
    // chainNode = 0 (인헤런트만)
    const s0 = compareEchoes(
      jiyan, '90', verdantSummit, '90',
      emptyBaseEchoes, noEchoSets,
      echoATK33, echoElem30,
      2.5, 'heavy', 90, 0.1, 1520, 0,
    );
    // chainNode = 6 (S1~S6 모두 적용 — Jiyan S1 Benevolence + S2 Versatility ATK +28%)
    const s6 = compareEchoes(
      jiyan, '90', verdantSummit, '90',
      emptyBaseEchoes, noEchoSets,
      echoATK33, echoElem30,
      2.5, 'heavy', 90, 0.1, 1520, 6,
    );
    // S6 빌드는 ATK +28% (S2) 등 더 강한 패시브 → damage 절대값이 큼
    expect(s6.damageA).toBeGreaterThan(s0.damageA);
    expect(s6.damageB).toBeGreaterThan(s0.damageB);
  });

  it('인헤런트 적용 절대값 verification — Camellya Forte Sweet Dream (skill-4) hit', () => {
    // Camellya 인헤런트는 havocDmgBonus +30% (Epiphyte +0.15 + Seedbed +0.15)
    // 무기 Red Spring는 +24% normalDmgBonus (always)
    // skill hit에선 normalDmgBonus가 적용 안 됨 (attackType skill).
    // 양쪽 동일 에코로 비교하면 diff 0이지만 damage는 양수
    const camellya = findCharacter('camellya');
    const redSpring = findWeapon('red-spring');
    const result = compareEchoes(
      camellya, '90', redSpring, '90',
      emptyBaseEchoes, noEchoSets,
      echoATK33, echoATK33,
      2.0, 'skill', 90, 0.1, 1520, 0,
    );
    expect(result.diff).toBeCloseTo(0, 4);
    expect(result.damageA).toBeGreaterThan(0);
  });

  it('breakdown은 에코별 스탯 차이만 포함 — 패시브는 양쪽 동일이라 누락', () => {
    const yinlin = findCharacter('yinlin');
    const stringmaster = findWeapon('stringmaster');
    const result = compareEchoes(
      yinlin, '90', stringmaster, '90',
      emptyBaseEchoes, noEchoSets,
      echoATK33, echoCritRate22,
      2.0, 'skill', 90, 0.1, 1520,
    );
    // ATK 에코 vs CritRate 에코 → atk와 critRate가 breakdown에 등장
    const types = result.breakdown.map((b) => b.statType);
    expect(types).toContain('atk');
    expect(types).toContain('critRate');
  });
});
