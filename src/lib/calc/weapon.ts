// src/lib/calc/weapon.ts
import type {
  Character,
  Weapon,
  Echo,
  EchoSet,
  ComparisonResult,
  AttackType,
  ResonanceChainNode,
  FinalStats,
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
 * 무기 A vs B 비교
 *
 * 동일한 캐릭터/에코 세팅에서 무기만 교체하여 딜량 차이를 산출한다.
 *
 * 각 무기의 패시브 조건부 효과(`WEAPON_PASSIVES`)는 풀업타임 가정으로 적용된다:
 * - `flatStats` (atkPercent/heavyDmgBonus 등)는 finalStats에 합산
 * - `amplifies`는 hit 컨텍스트(attackType + element)에 매칭되는 것만 가산합산
 * - `defIgnores` 중 스킬 비특정(universal)은 적용; 스킬 특정은 motionValue만으로 매칭 불가하므로 스킵
 * - `resPens`은 캐릭터 원소에 매칭되는 것만 가산
 *
 * 인헤런트/공명체인/상태 메커니즘 효과는 양쪽 무기에 동일하게 적용되므로
 * 비교 diff에 영향이 없지만, 절대값 damage 계산엔 포함된다.
 */
export function compareWeapons(
  character: Character,
  characterLevel: string,
  weaponA: Weapon,
  weaponB: Weapon,
  weaponLevel: string,
  echoes: Echo[],
  echoSets: EchoSet[],
  motionValue: number,
  attackType: AttackType,
  attackerLevel: number,
  enemyResistance: number,
  enemyDef: number,
  resonanceChainNode: ResonanceChainNode | 0 = 0,
  refinementA: WeaponRefinement = 1,
  refinementB: WeaponRefinement = 1,
): ComparisonResult {
  const statsA = calcFinalStats(
    character, characterLevel, weaponA, weaponLevel, echoes, echoSets,
  );
  const statsB = calcFinalStats(
    character, characterLevel, weaponB, weaponLevel, echoes, echoSets,
  );

  // 무기별 패시브 합산 (인헤런트/체인/상태 + 해당 무기 조건부 효과)
  const passivesA = aggregatePassiveEffects(
    character, resonanceChainNode, weaponA.id, 'on-field', refinementA,
  );
  const passivesB = aggregatePassiveEffects(
    character, resonanceChainNode, weaponB.id, 'on-field', refinementB,
  );

  applyFlatStatBuffs(statsA, passivesA.flatStats);
  applyFlatStatBuffs(statsB, passivesB.flatStats);

  const paramsA = buildParams(
    statsA, passivesA, character, motionValue, attackType,
    attackerLevel, enemyResistance, enemyDef,
  );
  const paramsB = buildParams(
    statsB, passivesB, character, motionValue, attackType,
    attackerLevel, enemyResistance, enemyDef,
  );

  const damageA = calcExpectedDmg(paramsA);
  const damageB = calcExpectedDmg(paramsB);
  const diff = damageB - damageA;
  const diffPercent = damageA !== 0 ? (diff / damageA) * 100 : 0;

  return {
    damageA,
    damageB,
    diff,
    diffPercent,
    statsA,
    statsB,
    breakdown: [],
  };
}

function buildParams(
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
