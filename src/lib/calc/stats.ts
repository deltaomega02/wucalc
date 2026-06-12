// src/lib/calc/stats.ts
import type {
  Character,
  Weapon,
  Echo,
  EchoSet,
  StatEntry,
  FinalStats,
  Element,
  AttackType,
} from '@/types/game';
import {
  BASE_CRIT_RATE,
  BASE_CRIT_DMG,
  BASE_ENERGY_REGEN,
  MAX_CRIT_RATE,
  MIN_CRIT_RATE,
} from './constants';

/**
 * 캐릭터 + 무기의 기초 공격력 합산
 */
export function calcBaseAtk(
  character: Character,
  characterLevel: string,
  weapon: Weapon,
  weaponLevel: string,
): number {
  const charAtk = character.baseStats[characterLevel]?.atk ?? 0;
  const weapAtk = weapon.baseAtk[weaponLevel] ?? 0;
  return charAtk + weapAtk;
}

/**
 * 에코 + 무기 서브스탯 + 세트효과 + 무기 패시브에서 특정 스탯의 합산값 추출
 */
export function sumStatFromSources(
  statType: string,
  echoes: Echo[],
  weapon: Weapon,
  echoSets: EchoSet[],
  character: Character,
): number {
  let total = 0;

  // 에코 메인 스탯
  for (const echo of echoes) {
    if (echo.mainStat.type === statType) {
      total += echo.mainStat.value;
    }
    // 에코 서브 스탯
    for (const sub of echo.subStats) {
      if (sub.type === statType) {
        total += sub.value;
      }
    }
  }

  // 무기 서브 스탯
  if (weapon.subStat.type === statType) {
    total += weapon.subStat.value;
  }

  // 무기 패시브 스탯
  for (const stat of weapon.passive.stats) {
    if (stat.type === statType) {
      total += stat.value;
    }
  }

  // 에코 세트 효과
  for (const set of echoSets) {
    // 2피스 효과 (일반 세트)
    for (const stat of set.twoPiece) {
      if (stat.type === statType) {
        total += stat.value;
      }
    }
    // 5피스 효과 (풀업타임 가정)
    for (const stat of set.fivePiece) {
      if (stat.type === statType) {
        total += stat.value;
      }
    }
    // 3피스 효과 (3피스 전용 세트, 풀업타임 가정)
    if (set.threePiece) {
      for (const stat of set.threePiece) {
        if (stat.type === statType) {
          total += stat.value;
        }
      }
    }
  }

  // 캐릭터 승급 보너스
  if (character.ascensionStat && character.ascensionStat.type === statType) {
    total += character.ascensionStat.value;
  }

  return total;
}

/**
 * 최종 공격력 계산
 * TotalATK = BaseATK × (1 + ATKPercent) + FlatATK
 */
export function calcTotalAtk(
  baseAtk: number,
  atkPercent: number,
  flatAtk: number,
): number {
  return baseAtk * (1 + atkPercent) + flatAtk;
}

/**
 * 최종 HP 계산
 */
export function calcTotalHp(
  baseHp: number,
  hpPercent: number,
  flatHp: number,
): number {
  return baseHp * (1 + hpPercent) + flatHp;
}

/**
 * 최종 DEF 계산
 */
export function calcTotalDef(
  baseDef: number,
  defPercent: number,
  flatDef: number,
): number {
  return baseDef * (1 + defPercent) + flatDef;
}

/**
 * 공격 타입에 해당하는 피해 보너스 스탯 키 반환
 */
function attackTypeBonusKey(attackType: AttackType): string | null {
  const map: Record<AttackType, string | null> = {
    normal: 'normalDmgBonus',
    heavy: 'heavyDmgBonus',
    skill: 'skillDmgBonus',
    liberation: 'liberationDmgBonus',
    intro: 'introDmgBonus',
    outro: 'outroDmgBonus',
    echo: 'echoSkillDmgBonus',
    coordinated: 'coordinatedDmgBonus',
    // Tune Break / Tune Rupture는 별도 채널 — DMG Bonus 가산 버킷 미적용 (Phase 3)
    tuneBreak: null,
    tuneRupture: null,
  };
  return map[attackType] ?? null;
}

/**
 * 원소에 해당하는 피해 보너스 스탯 키 반환
 */
function elementBonusKey(element: Element): string {
  const map: Record<Element, string> = {
    aero: 'aeroDmgBonus',
    glacio: 'glacioDmgBonus',
    fusion: 'fusionDmgBonus',
    electro: 'electroDmgBonus',
    havoc: 'havocDmgBonus',
    spectro: 'spectroDmgBonus',
  };
  return map[element];
}

/**
 * 빌드에서 최종 스탯 합산
 */
export function calcFinalStats(
  character: Character,
  characterLevel: string,
  weapon: Weapon,
  weaponLevel: string,
  echoes: Echo[],
  echoSets: EchoSet[],
): FinalStats {
  const baseAtk = calcBaseAtk(character, characterLevel, weapon, weaponLevel);
  const baseHp = character.baseStats[characterLevel]?.hp ?? 0;
  const baseDef = character.baseStats[characterLevel]?.def ?? 0;

  const sum = (stat: string) =>
    sumStatFromSources(stat, echoes, weapon, echoSets, character);

  const totalAtk = calcTotalAtk(baseAtk, sum('atkPercent'), sum('atk'));
  const totalHp = calcTotalHp(baseHp, sum('hpPercent'), sum('hp'));
  const totalDef = calcTotalDef(baseDef, sum('defPercent'), sum('def'));

  const critRate = Math.min(
    MAX_CRIT_RATE,
    Math.max(MIN_CRIT_RATE, BASE_CRIT_RATE + sum('critRate')),
  );
  const critDmg = BASE_CRIT_DMG + sum('critDmg');
  const energyRegen = BASE_ENERGY_REGEN + sum('energyRegen');

  const elemKey = elementBonusKey(character.element);
  const elementDmgBonus = sum(elemKey);

  // allAttributeDmgBonus는 모든 속성 피해에 가산 (파도에 맞선 용기 등)
  const allAttrBonus = sum('allAttributeDmgBonus');

  return {
    hp: totalHp,
    atk: totalAtk,
    def: totalDef,
    critRate,
    critDmg,
    energyRegen,
    normalDmgBonus: sum('normalDmgBonus'),
    heavyDmgBonus: sum('heavyDmgBonus'),
    skillDmgBonus: sum('skillDmgBonus'),
    liberationDmgBonus: sum('liberationDmgBonus'),
    introDmgBonus: sum('introDmgBonus'),
    outroDmgBonus: sum('outroDmgBonus'),
    coordinatedDmgBonus: sum('coordinatedDmgBonus'),
    echoSkillDmgBonus: sum('echoSkillDmgBonus'),
    allAttributeDmgBonus: allAttrBonus,
    elementDmgBonus: sum(elemKey) + allAttrBonus,
    tuneBreakBoost: sum('tuneBreakBoost'),
  };
}

/**
 * FinalStats에서 공격 타입에 해당하는 DMG Bonus 추출
 */
export function getAttackTypeBonus(
  stats: FinalStats,
  attackType: AttackType,
): number {
  const key = attackTypeBonusKey(attackType);
  if (!key) return 0;
  return (stats as unknown as Record<string, number>)[key] ?? 0;
}

/**
 * 패시브 합산에서 추출한 flatStats를 FinalStats에 in-place 적용.
 *
 * - atkPercent/defPercent/hpPercent: 곱연산 (× (1 + value))
 * - 기타: 가산 합산
 *
 * elementDmgBonus는 elementDmgBonus + 매칭되는 속성 DMG Bonus로 자동 재계산되어야 하지만,
 * 본 함수는 단순 가산만 수행. 호출부에서 element 합산 재계산 필요 시 별도 처리.
 */
export function applyFlatStatBuffs(
  stats: FinalStats,
  flatStats: Partial<Record<string, number>>,
): void {
  for (const [type, value] of Object.entries(flatStats)) {
    if (value === undefined) continue;
    if (type === 'atkPercent') {
      stats.atk *= 1 + value;
    } else if (type === 'defPercent') {
      stats.def *= 1 + value;
    } else if (type === 'hpPercent') {
      stats.hp *= 1 + value;
    } else if (type in stats) {
      (stats as unknown as Record<string, number>)[type] =
        ((stats as unknown as Record<string, number>)[type] ?? 0) + value;
    }
  }
}
