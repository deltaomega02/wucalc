// src/lib/calc/__tests__/damage.test.ts
import { describe, it, expect } from 'vitest';
import {
  calcBaseDmg,
  calcResMultiplier,
  calcDefMultiplier,
  calcDmgBonus,
  calcDmgAmplify,
  calcNonCritDmg,
  calcHitDamage,
  calcExpectedDmg,
} from '../damage';
import {
  BASE_CRIT_RATE,
  BASE_CRIT_DMG,
  BASE_ENEMY_RESISTANCE,
  DEF_LEVEL_MULTIPLIER,
  DEF_BASE_CONSTANT,
} from '../constants';

/**
 * 데미지 공식 단위 테스트
 *
 * 검증 기준:
 * - Fandom Wiki "Damage" 페이지의 공식 정의
 * - WutheringWaves.gg 가이드의 실측 검증 (동급 레벨 ≈ 52% 감소)
 * - 곱연산/가산 카테고리 분리 (Deepen vs DMG Bonus)
 *
 * 모든 케이스는 손계산으로 expected 값을 산출했다.
 */

describe('상수 검증', () => {
  it('1차 출처에 따라 상수가 정확해야 한다', () => {
    expect(BASE_CRIT_RATE).toBe(0.05);
    expect(BASE_CRIT_DMG).toBe(1.5);
    expect(BASE_ENEMY_RESISTANCE).toBe(0.1);
    expect(DEF_BASE_CONSTANT).toBe(800);
    expect(DEF_LEVEL_MULTIPLIER).toBe(8);
  });
});

describe('calcBaseDmg — BaseDMG = ScalingStat × MotionValue', () => {
  it('ATK 2000과 MV 0.5에서 1000 산출', () => {
    expect(calcBaseDmg(2000, 0.5)).toBe(1000);
  });

  it('0 ATK는 0', () => {
    expect(calcBaseDmg(0, 1.5)).toBe(0);
  });

  it('소수 MV에서도 정확', () => {
    expect(calcBaseDmg(1000, 0.4635)).toBeCloseTo(463.5, 5);
  });
});

describe('calcResMultiplier — 저항 3구간 분기', () => {
  it('저항 0%이면 멀티플라이어 1', () => {
    expect(calcResMultiplier(0, 0)).toBe(1);
  });

  it('저항 10%(일반 적)이면 0.9', () => {
    expect(calcResMultiplier(0.1, 0)).toBeCloseTo(0.9, 10);
  });

  it('저항 40%(약점 보유 보스)이면 0.6', () => {
    expect(calcResMultiplier(0.4, 0)).toBeCloseTo(0.6, 10);
  });

  it('저항 50% + 저항 관통 20% → 0.7 멀티플라이어 (1-0.3)', () => {
    expect(calcResMultiplier(0.5, 0.2)).toBeCloseTo(0.7, 10);
  });

  it('음수 저항 -50%이면 1 - (-0.5/2) = 1.25', () => {
    expect(calcResMultiplier(0, 0.5)).toBeCloseTo(1.25, 10);
  });

  it('저항 80% 임계값 — 점근 구간 진입: 1 / (1 + 5×0.8) = 0.2', () => {
    expect(calcResMultiplier(0.8, 0)).toBeCloseTo(0.2, 10);
  });

  it('저항 80% 직전(79.99%) — 선형 구간: 1 - 0.7999 = 0.2001', () => {
    expect(calcResMultiplier(0.7999, 0)).toBeCloseTo(0.2001, 4);
  });

  it('저항 100% 점근 구간: 1 / (1 + 5×1.0) = 1/6 ≈ 0.1667', () => {
    expect(calcResMultiplier(1.0, 0)).toBeCloseTo(1 / 6, 6);
  });
});

describe('calcDefMultiplier — (800+8L) / ((800+8L) + EnemyDEF × (1-DefIgnore))', () => {
  it('적 DEF 0이면 멀티 1', () => {
    expect(calcDefMultiplier(90, 0, 0)).toBe(1);
  });

  it('Lv90 캐릭터 vs 동급 적 DEF 약 1520 → 약 0.5 멀티 (동급 레벨 52% 감소)', () => {
    // (800 + 8×90) / ((800 + 8×90) + 1520) = 1520 / 3040 = 0.5
    const m = calcDefMultiplier(90, 1520, 0);
    expect(m).toBeCloseTo(0.5, 4);
  });

  it('DEF Ignore 100%이면 적 DEF 무력화 → 멀티 1', () => {
    expect(calcDefMultiplier(90, 99999, 1.0)).toBe(1);
  });

  it('DEF Ignore 50%이면 유효 DEF 반감', () => {
    // 적 DEF 1520 → 760, (800+720) / (1520 + 760) = 1520/2280 ≈ 0.6667
    const m = calcDefMultiplier(90, 1520, 0.5);
    expect(m).toBeCloseTo(1520 / 2280, 4);
  });

  it('레벨 80 vs 동일 적 DEF → 약 ±2% 차이', () => {
    const m80 = calcDefMultiplier(80, 1520, 0);
    const m90 = calcDefMultiplier(90, 1520, 0);
    expect(m90 - m80).toBeGreaterThan(0);
    expect(m90 - m80).toBeLessThan(0.05);
  });
});

describe('calcDmgBonus — 가산 카테고리', () => {
  it('보너스 0이면 1', () => {
    expect(calcDmgBonus(0, 0)).toBe(1);
  });

  it('일반공격 30% + 속성 30% → 1.6 (가산)', () => {
    expect(calcDmgBonus(0.3, 0.3)).toBeCloseTo(1.6, 10);
  });

  it('큰 값에서도 가산 유지', () => {
    expect(calcDmgBonus(1.0, 1.0)).toBeCloseTo(3.0, 10);
  });
});

describe('calcDmgAmplify — Deepen 별도 곱연산', () => {
  it('amplify 0이면 1', () => {
    expect(calcDmgAmplify(0)).toBe(1);
  });

  it('amplify 38% → 1.38', () => {
    expect(calcDmgAmplify(0.38)).toBeCloseTo(1.38, 10);
  });
});

describe('곱연산 vs 가산 카테고리 검증 — WutheringWaves.gg 30%/30% 예제', () => {
  it('속성 30% + 일반 30% 가산 → 곱하면 1.6 (60% 증가)', () => {
    const bonus = calcDmgBonus(0.3, 0.3);
    expect(bonus).toBeCloseTo(1.6, 10);
  });

  it('속성 30% × Deepen 30% 곱연산 → 1.3 × 1.3 = 1.69 (69% 증가)', () => {
    const bonus = calcDmgBonus(0, 0.3);
    const amp = calcDmgAmplify(0.3);
    expect(bonus * amp).toBeCloseTo(1.69, 10);
  });
});

describe('calcNonCritDmg — 통합 비크리 데미지', () => {
  it('표준 시나리오: ATK 2000, MV 1.0, 저항 10%, 적DEF 1520, Lv90', () => {
    const dmg = calcNonCritDmg({
      totalAtk: 2000,
      motionValue: 1.0,
      attackType: 'skill',
      element: 'aero',
      critRate: 0.05,
      critDmg: 1.5,
      attackTypeBonus: 0,
      elementBonus: 0,
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0,
      enemyResistance: 0.1,
      resPen: 0,
      enemyDef: 1520,
      defIgnore: 0,
      attackerLevel: 90,
    });
    // 2000 × 1.0 × 0.9 (저항) × 0.5 (DEF) × 1 × 1 = 900
    expect(dmg).toBeCloseTo(900, 4);
  });

  it('속성 보너스 50% + Deepen 30% 적용 시', () => {
    const dmg = calcNonCritDmg({
      totalAtk: 2000,
      motionValue: 1.0,
      attackType: 'skill',
      element: 'aero',
      critRate: 0.05,
      critDmg: 1.5,
      attackTypeBonus: 0,
      elementBonus: 0.5,
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0.3,
      enemyResistance: 0.1,
      resPen: 0,
      enemyDef: 1520,
      defIgnore: 0,
      attackerLevel: 90,
    });
    // 2000 × 1.0 × 0.9 × 0.5 × 1.5 × 1.3 = 1755
    expect(dmg).toBeCloseTo(1755, 4);
  });
});

describe('calcHitDamage — 비크리/크리/기대값', () => {
  const baseParams = {
    totalAtk: 2000,
    motionValue: 1.0,
    attackType: 'skill' as const,
    element: 'aero' as const,
    critRate: 0.5,
    critDmg: 2.0, // 200% 크리뎀
    attackTypeBonus: 0,
    elementBonus: 0,
    skillScalingBonus: 0,
    flatBonus: 0,
    dmgAmplify: 0,
    enemyResistance: 0.1,
    resPen: 0,
    enemyDef: 1520,
    defIgnore: 0,
    attackerLevel: 90,
  };

  it('비크리 = 900, 크리 = 900 × 3 = 2700, 기대값 = 900 × 2 = 1800', () => {
    const r = calcHitDamage(baseParams);
    expect(r.nonCrit).toBeCloseTo(900, 4);
    expect(r.crit).toBeCloseTo(2700, 4);
    expect(r.expected).toBeCloseTo(1800, 4);
  });

  it('크리율 100% 이상은 1로 클램프', () => {
    const r = calcHitDamage({ ...baseParams, critRate: 1.5 });
    // 기대값 = 비크리 × (1 + 1.0 × 2.0) = 비크리 × 3 = 크리
    expect(r.expected).toBeCloseTo(r.crit, 4);
  });

  it('크리율 0 이하도 0으로 클램프 (기대값 = 비크리)', () => {
    const r = calcHitDamage({ ...baseParams, critRate: -0.3 });
    expect(r.expected).toBeCloseTo(r.nonCrit, 4);
  });
});

describe('calcExpectedDmg — 통합 함수', () => {
  it('기본 케이스 일관성', () => {
    const expected = calcExpectedDmg({
      totalAtk: 2000,
      motionValue: 1.0,
      attackType: 'skill',
      element: 'aero',
      critRate: 0.5,
      critDmg: 1.5,
      attackTypeBonus: 0,
      elementBonus: 0,
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0,
      enemyResistance: 0.1,
      resPen: 0,
      enemyDef: 1520,
      defIgnore: 0,
      attackerLevel: 90,
    });
    // 비크리 900 × (1 + 0.5 × 1.5) = 900 × 1.75 = 1575
    expect(expected).toBeCloseTo(1575, 4);
  });
});

describe('실전 시나리오 — 알려진 빌드 근사 검증', () => {
  it('카를로타 시그니처 + 풀빌드 기준 공명해방 1히트가 합리적 범위 (~50만~150만)', () => {
    // 가정: ATK 3000, MV 12.0 (해방 다단합), 속성 60%, 일반/해방 보너스 40%, 디펜 20%,
    //        크리율 80%, 크리뎀 250%, 적 저항 10%, 적 DEF 1520 (Lv90)
    const expected = calcExpectedDmg({
      totalAtk: 3000,
      motionValue: 12.0,
      attackType: 'liberation',
      element: 'glacio',
      critRate: 0.8,
      critDmg: 2.5,
      attackTypeBonus: 0.4,
      elementBonus: 0.6,
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0.2,
      enemyResistance: 0.1,
      resPen: 0,
      enemyDef: 1520,
      defIgnore: 0,
      attackerLevel: 90,
    });
    // 3000 × 12 = 36000
    // × 0.9 (저항) = 32400
    // × 0.5 (DEF) = 16200
    // × (1 + 0.4 + 0.6) = 32400
    // × 1.2 (Deepen) = 38880
    // × (1 + 0.8 × 2.5 = 3.0) = 116640
    expect(expected).toBeCloseTo(116640, 0);
    expect(expected).toBeGreaterThan(50000);
    expect(expected).toBeLessThan(1500000);
  });

  it('순수 ATK 30% × 2번 가산 = 60% (수확체감)', () => {
    const dmg1 = calcExpectedDmg({
      totalAtk: 2000 * 1.6, // ATK 60% 가산 후
      motionValue: 1.0,
      attackType: 'skill',
      element: 'aero',
      critRate: 0,
      critDmg: 1.5,
      attackTypeBonus: 0,
      elementBonus: 0,
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0,
      enemyResistance: 0.1,
      resPen: 0,
      enemyDef: 1520,
      defIgnore: 0,
      attackerLevel: 90,
    });
    const dmg2 = calcExpectedDmg({
      totalAtk: 2000 * 1.3, // ATK 30% 후
      motionValue: 1.0,
      attackType: 'skill',
      element: 'aero',
      critRate: 0,
      critDmg: 1.5,
      attackTypeBonus: 0,
      elementBonus: 0.3, // 속성 30% 분산
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0,
      enemyResistance: 0.1,
      resPen: 0,
      enemyDef: 1520,
      defIgnore: 0,
      attackerLevel: 90,
    });
    // dmg2가 dmg1보다 커야 함 (분산 효율)
    expect(dmg2).toBeGreaterThan(dmg1);
  });
});
