// src/lib/calc/damage.ts
import {
  DEF_LEVEL_MULTIPLIER,
  DEF_BASE_CONSTANT,
} from './constants';
import type { DamageParams, HitDamageResult } from './types';

/**
 * 기초 피해량 = ScalingStat × (MotionValue × (1 + SkillScalingBonus)) + FlatBonus
 *
 * SkillScalingBonus는 MV 자체를 곱연산으로 강화하는 별도 카테고리.
 * (앙코 S3 "스킬 배율 +60%", 음림 S1, 카멜리아 S2 등이 이 버킷에 속하며
 *  속성/공격타입 DMG Bonus와는 다른 곱연산 채널로 적용된다.)
 *
 * AbilityAttribute는 대부분 ATK이지만, 일부 캐릭터는 DEF 또는 HP
 */
export function calcBaseDmg(
  scalingStat: number,
  motionValue: number,
  skillScalingBonus: number = 0,
  flatBonus: number = 0,
): number {
  return scalingStat * motionValue * (1 + skillScalingBonus) + flatBonus;
}

/**
 * 속성 저항 계수 (3구간 분기)
 *
 * RES_total = BaseRES - ResPEN
 * RES < 0:       1 - (RES / 2)        ← 저항 관통 시 보너스 감소
 * 0 ≤ RES < 0.8: 1 - RES              ← 일반 구간
 * RES ≥ 0.8:     1 / (1 + 5 × RES)    ← 높은 저항 구간
 */
export function calcResMultiplier(
  baseResistance: number,
  resPen: number,
): number {
  const resTotal = baseResistance - resPen;

  if (resTotal < 0) {
    return 1 - resTotal / 2;
  }
  if (resTotal < 0.8) {
    return 1 - resTotal;
  }
  return 1 / (1 + 5 * resTotal);
}

/**
 * 방어 계수
 *
 * DEFMultiplier = AttackerComponent / (AttackerComponent + DEF_Effective)
 * AttackerComponent = 800 + AttackerLevel × 8
 * DEF_Effective = EnemyDEF × (1 - DEFIgnore)
 */
export function calcDefMultiplier(
  attackerLevel: number,
  enemyDef: number,
  defIgnore: number,
): number {
  const attackerComponent =
    DEF_BASE_CONSTANT + attackerLevel * DEF_LEVEL_MULTIPLIER;
  const effectiveDef = enemyDef * (1 - defIgnore);
  return attackerComponent / (attackerComponent + effectiveDef);
}

/**
 * 피해 보너스 계수
 *
 * 공격 타입 보너스와 속성 보너스는 동일 버킷에서 가산
 * DMGBonus = 1 + (AttackTypeBonus + ElementBonus)
 */
export function calcDmgBonus(
  attackTypeBonus: number,
  elementBonus: number,
): number {
  return 1 + attackTypeBonus + elementBonus;
}

/**
 * 피해 증폭 계수 (Deepen — 아웃트로 / 인헤런트 / 공명체인 / 상태 메커니즘 / 무기 패시브)
 *
 * DMGAmplify = 1 + Σ Deepen (모든 소스의 가산합)
 *
 * 단일 값 또는 배열 모두 허용. 배열 입력 시 가산합산 후 +1.
 */
export function calcDmgAmplify(amplify: number | readonly number[]): number {
  if (typeof amplify === 'number') return 1 + amplify;
  return 1 + amplify.reduce((sum, v) => sum + v, 0);
}

/**
 * 크리티컬 미적용 대미지
 */
export function calcNonCritDmg(params: DamageParams): number {
  const baseDmg = calcBaseDmg(
    params.totalAtk,
    params.motionValue,
    params.skillScalingBonus,
    params.flatBonus,
  );
  const resMultiplier = calcResMultiplier(
    params.enemyResistance,
    params.resPen,
  );
  const defMultiplier = calcDefMultiplier(
    params.attackerLevel,
    params.enemyDef,
    params.defIgnore,
  );
  const dmgBonus = calcDmgBonus(
    params.attackTypeBonus,
    params.elementBonus,
  );
  const amplify = calcDmgAmplify(params.dmgAmplify);

  return baseDmg * resMultiplier * defMultiplier * dmgBonus * amplify;
}

/**
 * 단일 히트의 논크리/크리/기대 대미지
 */
export function calcHitDamage(params: DamageParams): HitDamageResult {
  const nonCrit = calcNonCritDmg(params);
  const crit = nonCrit * (1 + params.critDmg);
  const clampedCritRate = Math.min(1, Math.max(0, params.critRate));
  const expected = nonCrit * (1 + clampedCritRate * params.critDmg);

  return { nonCrit, crit, expected };
}

/**
 * 최종 기대 대미지 (통합 함수)
 */
export function calcExpectedDmg(params: DamageParams): number {
  return calcHitDamage(params).expected;
}

/**
 * Tune Break Boost 기반 피해 증폭 (Phase 3 부분 구현).
 *
 * 1차 출처(Spectral Analysis — 린네 패시브):
 *   "For each stack of Tune Strain - Interfered on the target, each point of
 *    Tune Break Boost increases total damage against that target by 0.12%."
 *
 * 즉 위엘더의 Tune Break Boost × Tune Strain 스택 × 0.12% = 추가 amplify.
 * 이 amplify는 일반 Deepen과 같은 곱연산 채널로 적용된다.
 *
 * 자체 Tune Break 공격 자체의 데미지 공식은 1차 출처가 미공개 — 별도 작업.
 *
 * @param tuneBreakBoost 위엘더 누적 Tune Break Boost 포인트
 * @param tuneStrainStacks 타깃에게 적용된 Tune Strain - Interfered 스택 수
 * @returns amplify 값 (0 ~ 1). DamageParams.dmgAmplify에 가산하거나 별도 사용.
 */
export function calcTuneBreakBoostAmplify(
  tuneBreakBoost: number,
  tuneStrainStacks: number,
): number {
  return tuneBreakBoost * tuneStrainStacks * 0.0012;
}
