// src/lib/calc/echo.ts
import type {
  Character,
  Weapon,
  Echo,
  EchoSet,
  FinalStats,
  ComparisonResult,
  ComparisonBreakdown,
  AttackType,
  ResonanceChainNode,
  StatType,
} from '@/types/game';
import type { DamageParams } from './types';
import { calcFinalStats, getAttackTypeBonus, applyFlatStatBuffs } from './stats';
import { calcExpectedDmg } from './damage';
import {
  aggregatePassiveEffects,
  sumApplicableAmplifies,
  type AggregatedPassives,
  type WeaponRefinement,
} from './passives';

/**
 * 에코 A vs B 비교
 *
 * 나머지 에코 4개는 동일하게 유지하고, 비교 대상 에코만 교체하여
 * 최종 딜량 차이를 산출한다.
 *
 * 패시브 효과 통합 (Phase 2.5+):
 * - 캐릭터의 인헤런트 + 공명체인(`resonanceChainNode` 단계까지) + 상태 메커니즘(풀스택 가정)
 *   + 장착 무기의 조건부 패시브(`WEAPON_PASSIVES`)를 풀업타임 가정으로 합산한다.
 * - 양쪽 비교에 동일하게 적용되므로 **diff에는 영향이 없지만**
 *   사용자가 보는 절대 damage 수치가 실제 게임에 더 가까워진다.
 */
export function compareEchoes(
  character: Character,
  characterLevel: string,
  weapon: Weapon,
  weaponLevel: string,
  baseEchoes: Echo[],
  echoSets: EchoSet[],
  echoA: Echo,
  echoB: Echo,
  motionValue: number,
  attackType: AttackType,
  attackerLevel: number,
  enemyResistance: number,
  enemyDef: number,
  resonanceChainNode: ResonanceChainNode | 0 = 0,
  weaponRefinement: WeaponRefinement = 1,
): ComparisonResult {
  const echoesA = [...baseEchoes, echoA];
  const echoesB = [...baseEchoes, echoB];

  const statsA = calcFinalStats(
    character, characterLevel, weapon, weaponLevel, echoesA, echoSets,
  );
  const statsB = calcFinalStats(
    character, characterLevel, weapon, weaponLevel, echoesB, echoSets,
  );

  // 패시브 합산 (양쪽 동일 — 캐릭터/체인/무기 변하지 않음)
  // 양쪽에 똑같이 적용되어 diff에 영향 없지만 절대값 수치 정확도를 높임
  const passives = aggregatePassiveEffects(
    character, resonanceChainNode, weapon.id, 'on-field', weaponRefinement,
  );

  applyFlatStatBuffs(statsA, passives.flatStats);
  applyFlatStatBuffs(statsB, passives.flatStats);

  const paramsA = buildDamageParams(
    statsA, passives, character, motionValue, attackType,
    attackerLevel, enemyResistance, enemyDef,
  );
  const paramsB = buildDamageParams(
    statsB, passives, character, motionValue, attackType,
    attackerLevel, enemyResistance, enemyDef,
  );

  const damageA = calcExpectedDmg(paramsA);
  const damageB = calcExpectedDmg(paramsB);
  const diff = damageB - damageA;
  const diffPercent = damageA !== 0 ? (diff / damageA) * 100 : 0;

  const breakdown = calcBreakdown(statsA, statsB);

  return {
    damageA,
    damageB,
    diff,
    diffPercent,
    statsA,
    statsB,
    breakdown,
  };
}

function buildDamageParams(
  stats: FinalStats,
  passives: AggregatedPassives,
  character: Character,
  motionValue: number,
  attackType: AttackType,
  attackerLevel: number,
  enemyResistance: number,
  enemyDef: number,
): DamageParams {
  const dmgAmplify = sumApplicableAmplifies(
    passives.amplifies, attackType, character.element,
  );
  const universalDefIgnore = passives.defIgnores
    .filter((di) => !di.skillIds || di.skillIds.length === 0)
    .reduce((sum, di) => sum + di.value, 0);
  const resPen = passives.resPens
    .filter((rp) => rp.element === character.element)
    .reduce((sum, rp) => sum + rp.value, 0);

  return {
    totalAtk: stats.atk,
    motionValue,
    attackType,
    element: character.element,
    critRate: stats.critRate,
    critDmg: stats.critDmg,
    attackTypeBonus: getAttackTypeBonus(stats, attackType),
    elementBonus: stats.elementDmgBonus,
    skillScalingBonus: 0,
    flatBonus: 0,
    dmgAmplify,
    enemyResistance,
    resPen,
    enemyDef,
    defIgnore: universalDefIgnore,
    attackerLevel,
  };
}

/** 어떤 스탯 차이가 딜 차이에 기여했는지 분석 */
function calcBreakdown(
  statsA: FinalStats,
  statsB: FinalStats,
): ComparisonBreakdown[] {
  const trackedStats: { key: keyof FinalStats; type: StatType }[] = [
    { key: 'atk', type: 'atk' },
    { key: 'critRate', type: 'critRate' },
    { key: 'critDmg', type: 'critDmg' },
    { key: 'elementDmgBonus', type: 'aeroDmgBonus' },
    { key: 'normalDmgBonus', type: 'normalDmgBonus' },
    { key: 'heavyDmgBonus', type: 'heavyDmgBonus' },
    { key: 'skillDmgBonus', type: 'skillDmgBonus' },
    { key: 'liberationDmgBonus', type: 'liberationDmgBonus' },
  ];

  return trackedStats
    .map(({ key, type }) => ({
      statType: type,
      valueA: statsA[key],
      valueB: statsB[key],
      dmgContribution: statsB[key] - statsA[key],
    }))
    .filter((entry) => Math.abs(entry.dmgContribution) > 0.0001);
}
