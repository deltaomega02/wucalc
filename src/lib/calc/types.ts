// src/lib/calc/types.ts
import type {
  AttackType,
  Element,
  StatType,
  FinalStats,
} from '@/types/game';

/** 대미지 계산에 필요한 파라미터 */
export interface DamageParams {
  totalAtk: number;
  motionValue: number;
  attackType: AttackType;
  element: Element;
  critRate: number;
  critDmg: number;
  attackTypeBonus: number;
  elementBonus: number;
  /**
   * MV 자체를 곱연산으로 강화하는 별도 카테고리 합산값.
   * 앙코 S3, 음림 S1, 카멜리아 S2, 카를로타 Final Bow,
   * 금희 S5, 페비 Absolution 등이 이 버킷에 속한다.
   */
  skillScalingBonus: number;
  /** BaseDMG에 더해지는 평탄 가산값 (스택 추가 데미지 등) */
  flatBonus: number;
  dmgAmplify: number;
  enemyResistance: number;
  resPen: number;
  enemyDef: number;
  defIgnore: number;
  attackerLevel: number;
  /**
   * 데미지 채널 (Phase 3 신규).
   * - 'standard' (기본): ATK 스케일링 기반 통상 피해
   * - 'tuneBreak': ATK 스케일링 미적용, motionValue × tuneBreakBoost 평탄값
   * - 'tuneRupture': Tune Break의 후속 폭발 이펙트
   *
   * 미지정 시 'standard'로 간주 (calcNonCritDmg에서 기본값 처리).
   */
  damageChannel?: 'standard' | 'tuneBreak' | 'tuneRupture';
}

/** 단일 히트 대미지 결과 */
export interface HitDamageResult {
  nonCrit: number;
  crit: number;
  expected: number;
}

/** 에코 비교 입력 */
export interface EchoCompareInput {
  finalStatsA: FinalStats;
  finalStatsB: FinalStats;
  element: Element;
  attackType: AttackType;
  motionValue: number;
  attackerLevel: number;
  enemyResistance: number;
  enemyDef: number;
}

/** 스탯 소스 (어디서 온 스탯인지 추적) */
export interface StatSource {
  type: StatType;
  value: number;
  source: 'character' | 'weapon' | 'weaponPassive' | 'echo' | 'echoSet' | 'ascension';
}
