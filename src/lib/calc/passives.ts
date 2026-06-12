// src/lib/calc/passives.ts
import type {
  AmplifyTarget,
  AttackType,
  Character,
  Element,
  ResonanceChainNode,
  ResonanceChainStatEffect,
  StatType,
} from '@/types/game';
import { INHERENT_SKILLS } from '@/data/inherentSkills';
import { RESONANCE_CHAINS } from '@/data/resonanceChains';
import { STATE_MECHANICS } from '@/data/stateEffects';
import {
  WEAPON_PASSIVES,
  WEAPON_REFINEMENT_FACTORS,
  DEFAULT_REFINEMENT,
  type WeaponPassiveCondition,
} from '@/data/weaponPassives';

/** 무기 재련 단계 (1=R1, ..., 5=R5). 미지정 시 R1. */
export type WeaponRefinement = 1 | 2 | 3 | 4 | 5;

/** Amplify(Deepen) 효과 — 카테고리 정보 포함 */
export interface AmplifyEntry {
  value: number;
  /** 'all' 이면 모든 피해 적용, AttackType / Element면 한정 적용 */
  target: AmplifyTarget;
}

/** 패시브 효과 집계 결과 — 캐릭터 단위 */
export interface AggregatedPassives {
  flatStats: Partial<Record<StatType, number>>;
  skillScalingBonuses: Record<string, number>;
  defIgnores: { value: number; skillIds?: string[] }[];
  resPens: { element: Element; value: number }[];
  /** 카테고리 정보를 포함한 Deepen 효과 모음 */
  amplifies: AmplifyEntry[];
  /** 외부에서 추가 발동되는 공조 공격 */
  coordinatedAttacks: { sourceSkillId: string; mvPercent: number }[];
  /** 팀 단위 버프 (다른 슬롯에 적용 — 본 슬롯의 stats에는 미반영) */
  teamBuffs: {
    stat: StatType;
    value: number;
    durationSec: number;
  }[];
}

/**
 * AmplifyEntry가 특정 hit 컨텍스트(attackType + element)에 적용되는지 판정.
 */
export function isAmplifyApplicable(
  entry: AmplifyEntry,
  hitAttackType: AttackType,
  hitElement: Element,
): boolean {
  return (
    entry.target === 'all'
    || entry.target === hitAttackType
    || entry.target === hitElement
  );
}

function emptyResult(): AggregatedPassives {
  return {
    flatStats: {},
    skillScalingBonuses: {},
    defIgnores: [],
    resPens: [],
    amplifies: [],
    coordinatedAttacks: [],
    teamBuffs: [],
  };
}

function addFlatStat(
  bucket: Partial<Record<StatType, number>>,
  stat: StatType,
  value: number,
): void {
  bucket[stat] = (bucket[stat] ?? 0) + value;
}

function applyEffect(
  result: AggregatedPassives,
  effect: ResonanceChainStatEffect,
  stackMultiplier = 1,
): void {
  switch (effect.kind) {
    case 'flatStat':
      addFlatStat(result.flatStats, effect.stat, effect.value * stackMultiplier);
      break;
    case 'skillScaling':
      result.skillScalingBonuses[effect.skillId] =
        (result.skillScalingBonuses[effect.skillId] ?? 0)
        + effect.bonus * stackMultiplier;
      break;
    case 'defIgnore':
      result.defIgnores.push({
        value: effect.value * stackMultiplier,
        skillIds: effect.skillIds,
      });
      break;
    case 'resPen':
      result.resPens.push({
        element: effect.element,
        value: effect.value * stackMultiplier,
      });
      break;
    case 'amplify':
      result.amplifies.push({
        value: effect.value * stackMultiplier,
        target: effect.target ?? 'all',
      });
      break;
    case 'critRate':
      addFlatStat(result.flatStats, 'critRate', effect.value * stackMultiplier);
      break;
    case 'coordinatedAttack':
      result.coordinatedAttacks.push({
        sourceSkillId: effect.sourceSkillId,
        mvPercent: effect.mvPercent * stackMultiplier,
      });
      break;
    case 'teamBuff':
      result.teamBuffs.push({
        stat: effect.stat,
        value: effect.value * stackMultiplier,
        durationSec: effect.durationSec,
      });
      break;
  }
}

/**
 * 무기 ID와 재련 단계로부터 multiplier 추출.
 * 등록된 비선형 무기는 해당 값, 미등록은 DEFAULT_REFINEMENT(선형 R5×2.0) 사용.
 */
export function getWeaponRefinementFactor(
  weaponId: string,
  refinement: WeaponRefinement,
): number {
  const factors = WEAPON_REFINEMENT_FACTORS[weaponId] ?? DEFAULT_REFINEMENT;
  return factors[refinement - 1];
}

/**
 * ResonanceChainStatEffect의 정량 값에 multiplier를 곱한 새 효과 반환.
 * skillScaling/flatStat/defIgnore/resPen/amplify/critRate/coordinatedAttack/teamBuff 모두 지원.
 */
function scaleEffect(
  effect: ResonanceChainStatEffect,
  factor: number,
): ResonanceChainStatEffect {
  if (factor === 1) return effect;
  switch (effect.kind) {
    case 'flatStat':
      return { ...effect, value: effect.value * factor };
    case 'skillScaling':
      return { ...effect, bonus: effect.bonus * factor };
    case 'defIgnore':
      return { ...effect, value: effect.value * factor };
    case 'resPen':
      return { ...effect, value: effect.value * factor };
    case 'amplify':
      return { ...effect, value: effect.value * factor };
    case 'critRate':
      return { ...effect, value: effect.value * factor };
    case 'coordinatedAttack':
      return { ...effect, mvPercent: effect.mvPercent * factor };
    case 'teamBuff':
      return { ...effect, value: effect.value * factor };
  }
}

/**
 * 캐릭터 + 공명체인 단계 + 상태/스택 메커니즘 + 무기 패시브 조건부 효과 합산.
 *
 * - 인헤런트(고유 스킬): 무조건 발동 가정
 * - 공명체인: `chainNode`까지의 모든 노드 효과 합산 (S{N} ≤ chainNode)
 * - 상태 메커니즘: 풀스택 가정 (perStackEffect × defaultAssumedStacks + fullStackEffect)
 * - 무기 패시브 조건부 효과: 풀업타임 가정 (`weaponPassives.ts` 등록 무기만 적용).
 *   `fieldPresence` 인자에 따라 `appliesWhen: 'on-field'/'off-field'` 효과를 필터.
 *   `weaponRefinement` (1~5) 단계에 따라 `WEAPON_REFINEMENT_FACTORS` multiplier 적용.
 *
 * @param character 대상 캐릭터
 * @param chainNode 보유한 공명체인 단계 (0 ~ 6). 0이면 체인 효과 없음.
 * @param weaponId 장착 무기 ID. weaponPassives.ts에 조건부 효과가 등록된 경우 합산.
 * @param fieldPresence 'on-field' (메인 DPS) | 'off-field' (서브/서포터). 미지정 시 'on-field'.
 * @param weaponRefinement 무기 재련 단계 (1~5). 미지정 시 R1.
 */
export function aggregatePassiveEffects(
  character: Character,
  chainNode: ResonanceChainNode | 0,
  weaponId?: string,
  fieldPresence: 'on-field' | 'off-field' = 'on-field',
  weaponRefinement: WeaponRefinement = 1,
): AggregatedPassives {
  const result = emptyResult();

  for (const skill of INHERENT_SKILLS[character.id] ?? []) {
    for (const effect of skill.effects) {
      applyEffect(result, effect);
    }
  }

  if (chainNode > 0) {
    for (const node of RESONANCE_CHAINS[character.id] ?? []) {
      if (node.node <= chainNode) {
        for (const effect of node.effects) {
          applyEffect(result, effect);
        }
      }
    }
  }

  for (const mechanic of STATE_MECHANICS[character.id] ?? []) {
    for (const effect of mechanic.perStackEffect) {
      applyEffect(result, effect, mechanic.defaultAssumedStacks);
    }
    if (mechanic.fullStackEffect) {
      for (const effect of mechanic.fullStackEffect) {
        applyEffect(result, effect);
      }
    }
  }

  if (weaponId) {
    const refinementFactor = getWeaponRefinementFactor(weaponId, weaponRefinement);
    for (const wp of WEAPON_PASSIVES[weaponId] ?? []) {
      if (isWeaponEffectApplicable(wp.appliesWhen, fieldPresence)) {
        applyEffect(result, scaleEffect(wp.effect, refinementFactor));
      }
    }
  }

  return result;
}

function isWeaponEffectApplicable(
  condition: WeaponPassiveCondition,
  fieldPresence: 'on-field' | 'off-field',
): boolean {
  if (condition === 'always') return true;
  return condition === fieldPresence;
}

/**
 * 특정 hit 컨텍스트에 적용 가능한 amplify 값만 추출해 가산합산.
 * 'all' 타깃 + 매칭되는 attackType/element 타깃만 합산된다.
 */
export function sumApplicableAmplifies(
  amplifies: readonly AmplifyEntry[],
  hitAttackType: AttackType,
  hitElement: Element,
): number {
  let total = 0;
  for (const entry of amplifies) {
    if (isAmplifyApplicable(entry, hitAttackType, hitElement)) {
      total += entry.value;
    }
  }
  return total;
}
