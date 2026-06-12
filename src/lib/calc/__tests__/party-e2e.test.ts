// src/lib/calc/__tests__/party-e2e.test.ts
import { describe, it, expect } from 'vitest';
import charactersData from '@/data/characters.json';
import weaponsData from '@/data/weapons.json';
import { calcPartyDps, type PartySlot } from '../party';
import type { Character, Echo, EchoSet, Weapon } from '@/types/game';

/**
 * party.ts 통합(E2E) 테스트.
 *
 * 실제 `characters.json` / `weapons.json` 데이터로 3슬롯 파티를 구성하고
 * `calcPartyDps`가 정상 산출되는지, 다중 outro amplify가 카테고리별로
 * 정확히 필터링되는지를 검증한다.
 */

function findCharacter(id: string): Character {
  const c = (charactersData as unknown as Character[]).find((x) => x.id === id);
  if (!c) throw new Error(`Character ${id} not found in fixture`);
  return c;
}

function findWeapon(id: string): Weapon {
  const w = (weaponsData as unknown as Weapon[]).find((x) => x.id === id);
  if (!w) throw new Error(`Weapon ${id} not found in fixture`);
  return w;
}

/** 단일 4-cost 에코 — 풀스택 가정용 메인 스탯 + 5개 부각 */
function makeEcho(
  mainType: Echo['mainStat']['type'],
  mainValue: number,
  subs: Echo['subStats'] = [],
): Echo {
  return {
    cost: 4,
    mainStat: { type: mainType, value: mainValue },
    subStats: subs,
  };
}

const baseSubStats: Echo['subStats'] = [
  { type: 'atkPercent', value: 0.10 },
  { type: 'critRate', value: 0.08 },
  { type: 'critDmg', value: 0.16 },
  { type: 'atkPercent', value: 0.10 },
  { type: 'critDmg', value: 0.16 },
];

const standardEchoes: Echo[] = [
  makeEcho('havocDmgBonus', 0.30, baseSubStats),
  makeEcho('atkPercent', 0.33, baseSubStats),
  makeEcho('atkPercent', 0.33, baseSubStats),
  makeEcho('atkPercent', 0.18, baseSubStats),
  makeEcho('atkPercent', 0.18, baseSubStats),
];

const emptyEchoSets: EchoSet[] = [];

describe('calcPartyDps — 3슬롯 표준 빌드 산출', () => {
  // 메인: 카멜리아 (인멸 직검 5★) - havoc skill 위주
  // 서브: 음림 (전도 증폭기 5★) - amplifyByCategory: electro 0.20 + liberation 0.25
  // 서포터: 벨리나 (회절 증폭기 5★) - dmgAmplify 0.15 'all'

  const camellya = findCharacter('camellya');
  const yinlin = findCharacter('yinlin');
  const verina = findCharacter('verina');

  const swordWeapon = findWeapon('blazing-brilliance');
  const rectifier = findWeapon('boson-astrolabe');

  const slots: PartySlot[] = [
    {
      character: camellya, weapon: swordWeapon,
      echoes: standardEchoes, echoSets: emptyEchoSets,
      role: 'main-dps', fieldTimeRatio: 0.70,
    },
    {
      character: yinlin, weapon: rectifier,
      echoes: standardEchoes, echoSets: emptyEchoSets,
      role: 'sub-dps', fieldTimeRatio: 0.20,
    },
    {
      character: verina, weapon: rectifier,
      echoes: standardEchoes, echoSets: emptyEchoSets,
      role: 'support', fieldTimeRatio: 0.10,
    },
  ];

  it('파티 DPS가 양수로 산출되고 슬롯 수만큼 perCharacter 항목이 있다', () => {
    const result = calcPartyDps(slots, 0.1, 1520, 90, 20);
    expect(result.totalDps).toBeGreaterThan(0);
    expect(result.perCharacter).toHaveLength(3);
    expect(result.rotationTime).toBe(20);
  });

  it('메인 딜러가 가장 큰 DPS 비중을 차지한다 (fieldTime 70%)', () => {
    const result = calcPartyDps(slots, 0.1, 1520, 90, 20);
    const main = result.perCharacter.find((c) => c.role === 'main-dps');
    const sub = result.perCharacter.find((c) => c.role === 'sub-dps');
    expect(main).toBeDefined();
    expect(main?.dpsRatio).toBeGreaterThan(0.5);
    expect(main?.dpsRatio).toBeGreaterThan(sub?.dpsRatio ?? 0);
  });

  it('각 슬롯의 dpsRatio 합산이 1.0 (rounding 허용)', () => {
    const result = calcPartyDps(slots, 0.1, 1520, 90, 20);
    const sum = result.perCharacter.reduce((s, c) => s + c.dpsRatio, 0);
    expect(sum).toBeCloseTo(1.0, 4);
  });

  it('빈 파티 → totalDps 0 + perCharacter 빈 배열', () => {
    const result = calcPartyDps([], 0.1, 1520, 90, 20);
    expect(result.totalDps).toBe(0);
    expect(result.perCharacter).toHaveLength(0);
  });
});

describe('calcPartyDps — Amplify 카테고리 필터링 검증', () => {
  // 시나리오: 카멜리아 메인 + 음림 서브 + 벨리나 서포터
  // - 음림 outro: electro 0.20 + liberation 0.25 → 카멜리아(havoc) 일반/스킬 히트에 매칭 안 됨
  //   단, 카멜리아의 'liberation' attackType 히트엔 음림의 liberation 0.25가 매칭
  // - 벨리나 outro: 'all' 0.15 → 모든 히트에 매칭
  // - 메인-only 파티(서브/서포터 없음)와 비교해 vermilion buff 차이 검증

  const camellya = findCharacter('camellya');
  const yinlin = findCharacter('yinlin');
  const verina = findCharacter('verina');
  const sword = findWeapon('blazing-brilliance');
  const rect = findWeapon('boson-astrolabe');

  function makeSlots(includeYinlin: boolean, includeVerina: boolean): PartySlot[] {
    const slots: PartySlot[] = [
      {
        character: camellya, weapon: sword,
        echoes: standardEchoes, echoSets: emptyEchoSets,
        role: 'main-dps', fieldTimeRatio: 1.0,
      },
    ];
    if (includeYinlin) slots.push({
      character: yinlin, weapon: rect,
      echoes: standardEchoes, echoSets: emptyEchoSets,
      role: 'sub-dps', fieldTimeRatio: 0.0,
    });
    if (includeVerina) slots.push({
      character: verina, weapon: rect,
      echoes: standardEchoes, echoSets: emptyEchoSets,
      role: 'support', fieldTimeRatio: 0.0,
    });
    return slots;
  }

  // 주의: Yinlin 인헤런트 2는 teamBuff atkPercent +0.20을, Verina 인헤런트 1도
  // teamBuff atkPercent +0.20을 메인 DPS에 적용한다. 따라서 단순히 outro amplify만
  // 비교할 수 없고, ATK 부스트가 함께 반영된다. 본 테스트는 방향성과 카테고리
  // 필터 동작만 검증한다.

  it('벨리나 추가 → 메인 DPS 상승 (Deepen +15% + 팀버프 ATK +20%)', () => {
    const soloMain = calcPartyDps(makeSlots(false, false), 0.1, 1520, 90, 20)
      .perCharacter[0].dps;
    const withVerina = calcPartyDps(makeSlots(false, true), 0.1, 1520, 90, 20)
      .perCharacter[0].dps;
    expect(withVerina).toBeGreaterThan(soloMain);
    // 1.15 (amplify) × ATK 부스트 (teamBuff) → 기대치 1.3 이상, 1.6 미만
    const ratio = withVerina / soloMain;
    expect(ratio).toBeGreaterThan(1.20);
    expect(ratio).toBeLessThan(1.60);
  });

  it('음림 추가 → 카멜리아(havoc) 일반/스킬 히트엔 amplify 매칭 없으나, liberation 히트엔 +25% 적용', () => {
    const soloMain = calcPartyDps(makeSlots(false, false), 0.1, 1520, 90, 20)
      .perCharacter[0].dps;
    const withYinlin = calcPartyDps(makeSlots(true, false), 0.1, 1520, 90, 20)
      .perCharacter[0].dps;
    // teamBuff ATK +20% + liberation 히트 +25% amplify → DPS 상승
    expect(withYinlin).toBeGreaterThan(soloMain);
    const ratio = withYinlin / soloMain;
    expect(ratio).toBeGreaterThan(1.0);
    expect(ratio).toBeLessThan(1.60);
  });

  it('음림 + 벨리나 → 두 outro 효과 모두 적용 시 더 큰 DPS', () => {
    const withBoth = calcPartyDps(makeSlots(true, true), 0.1, 1520, 90, 20)
      .perCharacter[0].dps;
    const onlyVerina = calcPartyDps(makeSlots(false, true), 0.1, 1520, 90, 20)
      .perCharacter[0].dps;
    const onlyYinlin = calcPartyDps(makeSlots(true, false), 0.1, 1520, 90, 20)
      .perCharacter[0].dps;
    expect(withBoth).toBeGreaterThan(onlyVerina);
    expect(withBoth).toBeGreaterThan(onlyYinlin);
  });
});

describe('calcPartyDps — 다양한 역할 분배 검증', () => {
  it('field time 0.70/0.20/0.10 비율이 perCharacter dps에 가중 반영된다', () => {
    const camellya = findCharacter('camellya');
    const yinlin = findCharacter('yinlin');
    const verina = findCharacter('verina');
    const sword = findWeapon('blazing-brilliance');
    const rect = findWeapon('boson-astrolabe');

    const slots: PartySlot[] = [
      { character: camellya, weapon: sword, echoes: standardEchoes, echoSets: [],
        role: 'main-dps', fieldTimeRatio: 0.70 },
      { character: yinlin, weapon: rect, echoes: standardEchoes, echoSets: [],
        role: 'sub-dps', fieldTimeRatio: 0.20 },
      { character: verina, weapon: rect, echoes: standardEchoes, echoSets: [],
        role: 'support', fieldTimeRatio: 0.10 },
    ];

    const result = calcPartyDps(slots, 0.1, 1520, 90, 20);
    const main = result.perCharacter.find((c) => c.role === 'main-dps')!;
    const support = result.perCharacter.find((c) => c.role === 'support')!;

    // 동일 빌드일 때 field time이 더 큰 슬롯이 더 큰 DPS 기여
    expect(main.dps).toBeGreaterThan(support.dps * 5); // 0.70 / 0.10 = 7 (대략)
  });
});
