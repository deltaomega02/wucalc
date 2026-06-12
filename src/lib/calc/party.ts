// src/lib/calc/party.ts
import type {
  Character,
  Weapon,
  Echo,
  EchoSet,
  FinalStats,
  Element,
  ResonanceChainNode,
  StatType,
} from '@/types/game';
import { calcFinalStats, getAttackTypeBonus } from './stats';
import { calcHitDamage } from './damage';
import type { DamageParams } from './types';
import { OUTRO_BUFFS, type OutroBuff } from '@/data/outroBuffs';
import {
  aggregatePassiveEffects,
  sumApplicableAmplifies,
  type AggregatedPassives,
  type AmplifyEntry,
  type WeaponRefinement,
} from './passives';

/** 파티 슬롯 (캐릭터 1명분 빌드) */
export interface PartySlot {
  character: Character;
  weapon: Weapon;
  echoes: Echo[];
  echoSets: EchoSet[];
  role: 'main-dps' | 'sub-dps' | 'support';
  /** 로테이션에서 필드에 있는 시간 비율 (0~1) */
  fieldTimeRatio: number;
  /** 공명체인 단계 (0 ~ 6). 미지정 시 0(S0). */
  resonanceChainNode?: ResonanceChainNode | 0;
  /** 무기 재련 단계 (1~5). 미지정 시 1(R1). */
  weaponRefinement?: WeaponRefinement;
}

/** 파티 DPS 계산 결과 */
export interface PartyDpsResult {
  /** 파티 전체 기대 DPS */
  totalDps: number;
  /** 캐릭터별 기여 DPS */
  perCharacter: {
    characterId: string;
    characterName: Record<string, string>;
    dps: number;
    dpsRatio: number;
    role: string;
    stats: FinalStats;
  }[];
  /** 로테이션 1사이클 소요 시간 (초) */
  rotationTime: number;
  /** 1사이클 총 대미지 */
  rotationDamage: number;
}

/** 기본 로테이션 프리셋: 메인 딜러 70%, 서브 20%, 서포터 10% */
const DEFAULT_FIELD_TIME: Record<string, number> = {
  'main-dps': 0.70,
  'sub-dps': 0.20,
  'support': 0.10,
};

const DEFAULT_ROTATION_TIME = 20;

/**
 * 파티 DPS 계산
 *
 * 1. 각 캐릭터의 FinalStats 계산
 * 2. 아웃트로 버프 적용 (서포터 → 메인 딜러)
 * 3. 각 캐릭터의 스킬별 기대 딜량 산출
 * 4. 필드 타임 비율에 따라 가중 DPS 합산
 */
export function calcPartyDps(
  slots: PartySlot[],
  enemyResistance: number,
  enemyDef: number,
  attackerLevel: number,
  rotationTime: number = DEFAULT_ROTATION_TIME,
): PartyDpsResult {
  if (slots.length === 0) {
    return { totalDps: 0, perCharacter: [], rotationTime, rotationDamage: 0 };
  }

  // 1. 각 캐릭터 기본 스탯 계산
  const baseStats = slots.map((slot) =>
    calcFinalStats(
      slot.character, '90', slot.weapon, '90',
      slot.echoes, slot.echoSets,
    ),
  );

  // 2. 슬롯별 패시브(인헤런트 + 공명체인 + 상태 메커니즘 + 무기 조건부 효과) 합산
  // main-dps는 'on-field', 그 외는 'off-field' 효과를 받도록 분기.
  const passives = slots.map((slot) =>
    aggregatePassiveEffects(
      slot.character,
      slot.resonanceChainNode ?? 0,
      slot.weapon.id,
      slot.role === 'main-dps' ? 'on-field' : 'off-field',
      slot.weaponRefinement ?? 1,
    ),
  );

  // 3. 아웃트로 버프 수집 (메인 딜러 외 슬롯 → 메인 딜러)
  const outroBuffs: OutroBuff[] = [];
  for (const slot of slots) {
    if (slot.role !== 'main-dps') {
      const buff = OUTRO_BUFFS[slot.character.id];
      if (buff) outroBuffs.push(buff);
    }
  }

  // 4. 다른 슬롯의 인헤런트/체인 teamBuff 수집 (메인 DPS의 stats에 가산)
  const teamBuffsForMainDps: { stat: StatType; value: number }[] = [];
  slots.forEach((slot, idx) => {
    if (slot.role !== 'main-dps') {
      for (const tb of passives[idx].teamBuffs) {
        teamBuffsForMainDps.push({ stat: tb.stat, value: tb.value });
      }
    }
  });

  // 5. 각 캐릭터별 DPS 계산
  const perCharacter = slots.map((slot, idx) => {
    const stats = { ...baseStats[idx] };
    const slotPassive = passives[idx];
    const amplifiesForHit: AmplifyEntry[] = [...slotPassive.amplifies];

    // 본인 인헤런트/상태/체인 flatStat 적용
    for (const [stat, value] of Object.entries(slotPassive.flatStats)) {
      if (value !== undefined) {
        applyStatBuff(stats, stat, value);
      }
    }

    // 메인 딜러에게 외부 버프 적용
    if (slot.role === 'main-dps') {
      for (const buff of outroBuffs) {
        for (const statBuff of buff.statBuffs) {
          applyStatBuff(stats, statBuff.type, statBuff.value);
        }
        amplifiesForHit.push(...outroBuffAmplifies(buff));
      }
      for (const tb of teamBuffsForMainDps) {
        applyStatBuff(stats, tb.stat, tb.value);
      }
    }

    // 슬롯 공통 스킬 + 패시브 합산 결과
    const char = slot.character;
    let totalExpectedDmg = 0;
    let hitCount = 0;

    // 기본 스킬 히트
    for (const skill of char.skills) {
      for (const hit of skill.hits) {
        const scalingStat =
          hit.scalingStat === 'hp' ? stats.hp
          : hit.scalingStat === 'def' ? stats.def
          : stats.atk;

        const elemRes = getElementResistance(enemyResistance, char.element, slot);
        const skillScalingBonus = slotPassive.skillScalingBonuses[skill.id] ?? 0;
        const defIgnore = collectDefIgnoreForSkill(slotPassive, skill.id);
        const resPen = collectResPenForElement(slotPassive, char.element);
        const hitAmplify = sumApplicableAmplifies(
          amplifiesForHit, hit.attackType, char.element,
        );

        const params: DamageParams = {
          totalAtk: scalingStat,
          motionValue: hit.motionValue,
          attackType: hit.attackType,
          element: char.element,
          critRate: stats.critRate,
          critDmg: stats.critDmg,
          attackTypeBonus: getAttackTypeBonus(stats, hit.attackType),
          elementBonus: stats.elementDmgBonus,
          skillScalingBonus,
          flatBonus: 0,
          dmgAmplify: hitAmplify,
          enemyResistance: elemRes,
          resPen,
          enemyDef,
          defIgnore,
          attackerLevel,
        };

        totalExpectedDmg += calcHitDamage(params).expected;
        hitCount++;
      }
    }

    // 공조 공격 — 본인 슬롯의 인헤런트/체인에서 발생 → 본인 스탯 + 공조 attackType
    for (const coord of slotPassive.coordinatedAttacks) {
      const elemRes = getElementResistance(enemyResistance, char.element, slot);
      const coordAmplify = sumApplicableAmplifies(
        amplifiesForHit, 'coordinated', char.element,
      );
      const params: DamageParams = {
        totalAtk: stats.atk,
        motionValue: coord.mvPercent,
        attackType: 'coordinated',
        element: char.element,
        critRate: stats.critRate,
        critDmg: stats.critDmg,
        attackTypeBonus: getAttackTypeBonus(stats, 'coordinated'),
        elementBonus: stats.elementDmgBonus,
        skillScalingBonus: 0,
        flatBonus: 0,
        dmgAmplify: coordAmplify,
        enemyResistance: elemRes,
        resPen: collectResPenForElement(slotPassive, char.element),
        enemyDef,
        defIgnore: 0,
        attackerLevel,
      };
      totalExpectedDmg += calcHitDamage(params).expected;
      hitCount++;
    }

    const avgDmgPerHit = hitCount > 0 ? totalExpectedDmg / hitCount : 0;
    const hitsPerSecond = 1.5;
    const characterDps = avgDmgPerHit * hitsPerSecond * slot.fieldTimeRatio;

    return {
      characterId: char.id,
      characterName: char.name,
      dps: characterDps,
      dpsRatio: 0,
      role: slot.role,
      stats,
    };
  });

  const totalDps = perCharacter.reduce((sum, c) => sum + c.dps, 0);

  for (const c of perCharacter) {
    c.dpsRatio = totalDps > 0 ? c.dps / totalDps : 0;
  }

  return {
    totalDps,
    perCharacter,
    rotationTime,
    rotationDamage: totalDps * rotationTime,
  };
}

function applyStatBuff(stats: FinalStats, type: string, value: number): void {
  if (type === 'atkPercent') {
    stats.atk *= (1 + value);
  } else if (type === 'defPercent') {
    stats.def *= (1 + value);
  } else if (type === 'hpPercent') {
    stats.hp *= (1 + value);
  } else if (type in stats) {
    (stats as unknown as Record<string, number>)[type] =
      ((stats as unknown as Record<string, number>)[type] ?? 0) + value;
  }
}

function getElementResistance(
  baseRes: number,
  _attackElement: Element,
  _slot: PartySlot,
): number {
  return baseRes;
}

/**
 * OutroBuff에서 amplify 항목을 AmplifyEntry 형식으로 추출.
 * amplifyByCategory 우선, 미지정 시 legacy dmgAmplify를 'all' 타깃으로 변환.
 *
 * UI 컴포넌트(PartyClient)에서도 동일하게 사용하기 위해 export.
 */
export function outroBuffAmplifies(buff: OutroBuff): AmplifyEntry[] {
  if (buff.amplifyByCategory && buff.amplifyByCategory.length > 0) {
    return buff.amplifyByCategory.map((a) => ({
      value: a.value,
      target: a.target,
    }));
  }
  if (buff.dmgAmplify > 0) {
    return [{ value: buff.dmgAmplify, target: 'all' }];
  }
  return [];
}

/**
 * 특정 스킬에 적용되는 defIgnore 효과 합산.
 * skillIds 미지정 효과는 전체 적용, 지정 효과는 매칭 시만 합산.
 */
function collectDefIgnoreForSkill(
  passives: AggregatedPassives,
  skillId: string,
): number {
  let total = 0;
  for (const di of passives.defIgnores) {
    if (!di.skillIds || di.skillIds.includes(skillId)) {
      total += di.value;
    }
  }
  return total;
}

/** 특정 속성에 적용되는 resPen 효과 합산 (캐릭터 본인 속성 한정) */
function collectResPenForElement(
  passives: AggregatedPassives,
  element: Element,
): number {
  let total = 0;
  for (const rp of passives.resPens) {
    if (rp.element === element) {
      total += rp.value;
    }
  }
  return total;
}
