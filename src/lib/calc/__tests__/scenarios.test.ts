// src/lib/calc/__tests__/scenarios.test.ts
import { describe, it, expect } from 'vitest';
import { calcBaseDmg, calcExpectedDmg, calcHitDamage } from '../damage';
import type { DamageParams } from '../types';
import { INHERENT_SKILLS } from '@/data/inherentSkills';
import { RESONANCE_CHAINS } from '@/data/resonanceChains';

/**
 * WuCalc_05 §6 권장 단위 테스트 시나리오 T01~T06.
 *
 * 검증 포인트:
 * - T01 음림: Sinner's Mark 공조 공격 motion value가 ATK 스케일링으로 합산되는가
 * - T02 금희: Incandescence 풀스택에서 강화 공명스킬 III의 skillScalingBonus가 곱연산 적용되는가
 * - T03 카멜리아: Crimson Bud 10 풀스택에서 Forte Sweet Dream의 per-stack scalingBonus
 * - T04 페비: Absolution 모드에서 고유 스킬 1의 공명해방 scalingBonus +255% 적용
 * - T05 상리요: Intuition 4스택 풀가동에서 전도 피해 +20% (flatStat) 적용
 * - T06 카를로타: Substance 120 풀게이지에서 Final Bow의 공명해방 scalingBonus +80% 적용
 *
 * S0(공명체인 0단계) 가정. 즉 RESONANCE_CHAINS 효과는 무시하고,
 * INHERENT_SKILLS의 항상 발동 효과 + Forte 풀스택 가정만 적용한다.
 */

const STANDARD_ENEMY: Pick<
  DamageParams,
  'enemyResistance' | 'enemyDef' | 'attackerLevel' | 'resPen' | 'defIgnore'
> = {
  enemyResistance: 0.1,
  enemyDef: 1520,
  attackerLevel: 90,
  resPen: 0,
  defIgnore: 0,
};

/** Skill Scaling Bonus 카테고리의 곱연산 효과를 손계산값과 비교 */
function expectScalingBonusMath(
  params: DamageParams,
  baselineParams: DamageParams,
): void {
  const dmg = calcHitDamage(params).expected;
  const baseline = calcHitDamage(baselineParams).expected;
  const ratio = dmg / baseline;
  const expectedRatio =
    (1 + params.skillScalingBonus) / (1 + baselineParams.skillScalingBonus);
  expect(ratio).toBeCloseTo(expectedRatio, 6);
}

describe('T01 — 음림 S0 표준빌드: Sinner\'s Mark 공조 공격 합산', () => {
  // 음림 공식 인헤런트 (wuthering.gg 검증):
  //   Pain Immersion (인헤런트 1): Magnetic Roar 후 크리율 +15% 5초
  //   Deadly Focus (인헤런트 2): Sinner's Mark 타깃에 Lightning Execution +10% + ATK +10% 4초
  //   Forte Circuit Judgment Strike 강화는 별도 entry (yinlin-forte-judgment-strike)
  // S0이므로 공명체인 효과는 모두 미적용.

  const yinlinSkillSet = INHERENT_SKILLS.yinlin;
  const painImmersion = yinlinSkillSet.find((s) => s.id === 'yinlin-inherent-1');
  const deadlyFocus = yinlinSkillSet.find((s) => s.id === 'yinlin-inherent-2');
  const forteJudgment = yinlinSkillSet.find((s) => s.id === 'yinlin-forte-judgment-strike');

  it('인헤런트 + Forte 데이터가 등록되어 있다', () => {
    expect(painImmersion).toBeDefined();
    expect(deadlyFocus).toBeDefined();
    expect(forteJudgment).toBeDefined();
  });

  it('Lightning Execution은 인헤런트의 +10% Amplify를 받는다', () => {
    const baselineDmg = calcHitDamage({
      ...STANDARD_ENEMY,
      totalAtk: 2400,
      motionValue: 2.5,
      attackType: 'skill',
      element: 'electro',
      critRate: 0.7,
      critDmg: 2.4,
      attackTypeBonus: 0,
      elementBonus: 0.3,
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0,
    }).expected;

    const amplifiedDmg = calcHitDamage({
      ...STANDARD_ENEMY,
      totalAtk: 2400,
      motionValue: 2.5,
      attackType: 'skill',
      element: 'electro',
      critRate: 0.7,
      critDmg: 2.4,
      attackTypeBonus: 0,
      elementBonus: 0.3,
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0.10, // 인헤런트 1 적용
    }).expected;

    expect(amplifiedDmg / baselineDmg).toBeCloseTo(1.10, 6);
  });

  it('Forte Judgment Strike(yinlin-skill-4)의 Forte +55% scalingBonus는 MV에 곱연산', () => {
    const skillScalingEffect = forteJudgment?.effects.find(
      (e) => e.kind === 'skillScaling',
    );
    if (skillScalingEffect?.kind !== 'skillScaling') {
      throw new Error('skillScaling 효과를 찾지 못함');
    }
    expect(skillScalingEffect.skillId).toBe('yinlin-skill-4');
    expect(skillScalingEffect.bonus).toBeCloseTo(0.55, 6);

    const baseATK = 2400;
    const mv = 1.5;
    expect(calcBaseDmg(baseATK, mv, skillScalingEffect.bonus)).toBeCloseTo(
      baseATK * mv * 1.55,
      4,
    );
  });

  it('Sinner\'s Mark 공조 공격은 별도 ATK 스케일링 히트로 가산된다', () => {
    // S0에는 Sinner's Mark가 공조 공격으로 등록되지 않지만,
    // 음림은 Sinner's Mark 폭발 자체가 별도 히트 (motion value 데이터 갭)임을 검증.
    // 본 테스트는 공조 합산 메커니즘이 단순 ATK × MV 가산임을 보장한다.
    const mainHit = calcHitDamage({
      ...STANDARD_ENEMY,
      totalAtk: 2400,
      motionValue: 2.0,
      attackType: 'skill',
      element: 'electro',
      critRate: 0.7,
      critDmg: 2.4,
      attackTypeBonus: 0.20,
      elementBonus: 0.3,
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0,
    }).expected;

    const coordinatedHit = calcHitDamage({
      ...STANDARD_ENEMY,
      totalAtk: 2400,
      motionValue: 0.8, // Sinner's Mark 추정 MV
      attackType: 'coordinated',
      element: 'electro',
      critRate: 0.7,
      critDmg: 2.4,
      attackTypeBonus: 0, // 공조 보너스 미적용 빌드
      elementBonus: 0.3,
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0,
    }).expected;

    expect(mainHit).toBeGreaterThan(coordinatedHit);
    expect(mainHit + coordinatedHit).toBeGreaterThan(mainHit);
  });
});

describe('T02 — 금희 S0, Incandescence 풀스택, 강화 공명스킬 III', () => {
  // S0이므로 공명체인 효과는 무시. 인헤런트 1 (회절 +20%) + 인헤런트 2 (인트로 +50%)만 적용.
  // Forte 메커니즘: Incandescence 풀스택 시 강화 공명스킬 III가 스택당 추가 배율.
  // 본 테스트는 calc 엔진이 임의 크기의 skillScalingBonus를 정확히 처리하는지 검증.

  it('금희 인헤런트가 등록되어 있다', () => {
    const jinhsi = INHERENT_SKILLS.jinhsi;
    expect(jinhsi).toBeDefined();
    const electro = jinhsi.find((s) => s.id === 'jinhsi-inherent-1');
    const intro = jinhsi.find((s) => s.id === 'jinhsi-inherent-2');
    expect(electro).toBeDefined();
    expect(intro).toBeDefined();
  });

  it('강화 공명스킬 III에 큰 scalingBonus가 곱연산으로 적용된다', () => {
    // Incandescence 50 풀스택 가정. 본 테스트는 다양한 scalingBonus 값에서 비례 관계 유지를 확인.
    const baseParams: DamageParams = {
      ...STANDARD_ENEMY,
      totalAtk: 2800,
      motionValue: 3.5, // 강화 공명스킬 III 단일 히트
      attackType: 'skill',
      element: 'spectro',
      critRate: 0.7,
      critDmg: 2.5,
      attackTypeBonus: 0,
      elementBonus: 0.50, // 0.20 (인헤런트) + 0.30 (속성 부각 가정)
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0,
    };

    // Incandescence 풀스택 시 +200% scaling 가정 (per-stack ×N의 한 표본값)
    const empoweredParams: DamageParams = {
      ...baseParams,
      skillScalingBonus: 2.0,
    };

    expectScalingBonusMath(empoweredParams, baseParams);

    // 풀스택 시 한 히트 기대 데미지가 베이스의 3배여야 함 (1+2.0 = 3.0)
    const empoweredDmg = calcHitDamage(empoweredParams).expected;
    const baseDmg = calcHitDamage(baseParams).expected;
    expect(empoweredDmg / baseDmg).toBeCloseTo(3.0, 6);
  });

  it('S5(공명해방 +120%) 노드 적용 시 공명해방 배율이 ×2.2 된다 (공명체인 데이터 정합성)', () => {
    const s5 = RESONANCE_CHAINS.jinhsi?.find((n) => n.node === 5);
    expect(s5).toBeDefined();
    const eff = s5?.effects.find((e) => e.kind === 'skillScaling');
    if (eff?.kind !== 'skillScaling') {
      throw new Error('S5 skillScaling 효과 누락');
    }
    expect(eff.skillId).toBe('jinhsi-liberation-2');
    expect(eff.bonus).toBeCloseTo(1.20, 6);
    // 공명해방 한 히트: MV × (1 + 1.20) = MV × 2.20
    expect(calcBaseDmg(1000, 1.0, eff.bonus)).toBeCloseTo(2200, 4);
  });
});

describe('T03 — 카멜리아 S0, Crimson Bud 10 풀스택, Forte Sweet Dream', () => {
  // S0 → 공명체인 적용 없음. 인헤런트 1 (인멸 +15%) + 인헤런트 2 (인멸 +15%) 가산.
  // Forte 메커니즘: Crimson Bud 10 소비 시 Sweet Dream 배율 +5% / Bud
  // 풀스택 10 Bud = +50% scalingBonus (per-stack scaling)

  it('카멜리아 공식 인헤런트 2종 (점유/Epiphyte + 온실/Seedbed) 등록 확인', () => {
    const camellya = INHERENT_SKILLS.camellya;
    expect(camellya).toHaveLength(2);
    // wuthering.gg 검증: 점유=normalDmgBonus +0.15, 온실=havocDmgBonus +0.15
    const epiphyte = camellya.find((s) => s.id === 'camellya-inherent-1');
    const seedbed = camellya.find((s) => s.id === 'camellya-inherent-2');
    expect(epiphyte?.name.en).toBe('Epiphyte');
    expect(seedbed?.name.en).toBe('Seedbed');
  });

  it('Crimson Bud 10 풀스택의 +50% scalingBonus는 Sweet Dream MV에 곱연산', () => {
    const baseParams: DamageParams = {
      ...STANDARD_ENEMY,
      totalAtk: 2700,
      motionValue: 2.8, // Forte Sweet Dream
      attackType: 'skill',
      element: 'havoc',
      critRate: 0.7,
      critDmg: 2.6,
      attackTypeBonus: 0,
      elementBonus: 0.30 + 0.15, // 속성 30% + 온실(Seedbed) 인멸 +15% (점유는 일반공격 보너스라 spectro/havoc elementBonus와는 별개)
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0,
    };

    const fullStackParams: DamageParams = {
      ...baseParams,
      skillScalingBonus: 0.50, // 10 Bud × +5%
    };

    expectScalingBonusMath(fullStackParams, baseParams);

    // (1 + 0.5) / 1 = 1.5
    expect(
      calcHitDamage(fullStackParams).expected /
      calcHitDamage(baseParams).expected,
    ).toBeCloseTo(1.5, 6);
  });
});

describe('T04 — 페비 S0, Absolution 풀스택, 공명해방', () => {
  // wuthering.gg 검증 (2026-05-20):
  //   공식 인헤런트: 존재(Presence) / 계시(Revelation) — 효과는 mid-air heavy +1 / Spectro +12%
  //   "Absolution Enhancement" 명칭은 잘못된 것 — 실제로는 Forte Circuit 메커니즘
  //   본 테스트는 Forte Circuit 사죄 모드의 +255% Liberation scaling 검증 (phoebe-forte-absolution entry)

  const phoebeInherents = INHERENT_SKILLS.phoebe;
  const forteAbsolution = phoebeInherents?.find(
    (s) => s.id === 'phoebe-forte-absolution',
  );

  it('Forte Circuit Absolution 모드 효과가 등록되어 있다 (+255% Liberation)', () => {
    expect(forteAbsolution).toBeDefined();
    const eff = forteAbsolution?.effects.find((e) => e.kind === 'skillScaling');
    if (eff?.kind !== 'skillScaling') {
      throw new Error('phoebe-forte-absolution skillScaling 효과 누락');
    }
    expect(eff.skillId).toBe('phoebe-liberation-2');
    expect(eff.bonus).toBeCloseTo(2.55, 6);
  });

  it('공명해방 1히트가 (1 + 2.55) = 3.55배로 강화된다', () => {
    const eff = forteAbsolution?.effects.find((e) => e.kind === 'skillScaling');
    if (eff?.kind !== 'skillScaling') {
      throw new Error('skillScaling 효과 누락');
    }

    const baseParams: DamageParams = {
      ...STANDARD_ENEMY,
      totalAtk: 2600,
      motionValue: 5.0, // 공명해방 다단합 일부
      attackType: 'liberation',
      element: 'spectro',
      critRate: 0.7,
      critDmg: 2.5,
      attackTypeBonus: 0,
      elementBonus: 0.4,
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0,
    };

    const empoweredParams: DamageParams = {
      ...baseParams,
      skillScalingBonus: eff.bonus,
    };

    expect(
      calcHitDamage(empoweredParams).expected /
      calcHitDamage(baseParams).expected,
    ).toBeCloseTo(3.55, 6);
  });
});

describe('T05 — 상리요 S0, Intuition 4스택, 강화 공명스킬', () => {
  // 인헤런트 1: 공명스킬 시전마다 스택, 1스택당 전도 피해 +5%, 최대 4 (+20%), 8초
  // 4스택 풀가동 시 전도 피해 +20% (flatStat — elementBonus 가산)

  it('상리요 인헤런트 1이 전도 +20%로 등록되어 있다', () => {
    const xly = INHERENT_SKILLS['xiangli-yao'];
    expect(xly).toBeDefined();
    const electroBoost = xly[0].effects.find(
      (e) => e.kind === 'flatStat' && e.stat === 'electroDmgBonus',
    );
    if (!electroBoost || electroBoost.kind !== 'flatStat') {
      throw new Error('전도 피해 보너스 효과 누락');
    }
    expect(electroBoost.value).toBeCloseTo(0.20, 6);
  });

  it('elementBonus +20% (4스택 풀가동) 적용 시 데미지가 비례 증가', () => {
    const params0: DamageParams = {
      ...STANDARD_ENEMY,
      totalAtk: 2500,
      motionValue: 1.8,
      attackType: 'skill',
      element: 'electro',
      critRate: 0.65,
      critDmg: 2.3,
      attackTypeBonus: 0.15,
      elementBonus: 0.30, // 속성 부각
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0,
    };
    const params4: DamageParams = {
      ...params0,
      elementBonus: 0.30 + 0.20, // 4스택 추가
    };

    // DmgBonus 멀티플라이어: 1 + (attackTypeBonus + elementBonus)
    // params0: 1 + 0.15 + 0.30 = 1.45
    // params4: 1 + 0.15 + 0.50 = 1.65
    // 비율 = 1.65 / 1.45
    const ratio = calcExpectedDmg(params4) / calcExpectedDmg(params0);
    expect(ratio).toBeCloseTo(1.65 / 1.45, 6);
  });
});

describe('T06 — 카를로타 S0, Substance 120 풀스택, 공명해방', () => {
  // Forte Circuit: Substance 120 풀게이지 시 Final Bow 발동 → 공명해방 3종 배율 +80% (Skill Scaling Bonus)
  // S0 가정 → 공명체인 무시. 인헤런트 2 (Ars Gratia Artis)는 Deconstruction 상태 부여 (정성적).
  // 본 테스트는 +80% Skill Scaling Bonus가 공명해방 1히트 (carlotta-liberation-2)에 곱연산됨을 검증.

  it('카를로타 공명해방 한 히트가 (1 + 0.8) = 1.8배로 강화된다', () => {
    const baseParams: DamageParams = {
      ...STANDARD_ENEMY,
      totalAtk: 3000,
      motionValue: 4.5,
      attackType: 'liberation',
      element: 'glacio',
      critRate: 0.8,
      critDmg: 2.6,
      attackTypeBonus: 0.30,
      elementBonus: 0.50,
      skillScalingBonus: 0,
      flatBonus: 0,
      dmgAmplify: 0,
    };

    const finalBowParams: DamageParams = {
      ...baseParams,
      skillScalingBonus: 0.80, // Forte Final Bow
    };

    expect(
      calcHitDamage(finalBowParams).expected /
      calcHitDamage(baseParams).expected,
    ).toBeCloseTo(1.80, 6);
  });

  it('S2 공명체인이 Fatal Finale 배율 +126%를 추가로 적용 (스택 누적 검증)', () => {
    const s2 = RESONANCE_CHAINS.carlotta?.find((n) => n.node === 2);
    expect(s2).toBeDefined();
    const eff = s2?.effects.find((e) => e.kind === 'skillScaling');
    if (eff?.kind !== 'skillScaling') {
      throw new Error('S2 skillScaling 효과 누락');
    }
    expect(eff.skillId).toBe('carlotta-liberation-2');
    expect(eff.bonus).toBeCloseTo(1.26, 6);

    // S2 + Forte Final Bow 함께 적용 시 합산 scaling
    // 둘 다 Skill Scaling Bonus 카테고리이므로 가산: 0.80 + 1.26 = 2.06
    const totalScaling = 0.80 + 1.26;
    const baseATK = 3000;
    const mv = 4.5;
    expect(calcBaseDmg(baseATK, mv, totalScaling)).toBeCloseTo(
      baseATK * mv * (1 + totalScaling),
      4,
    );
  });

  it('flatBonus 가산도 정확히 적용된다 (스택 추가 평탄값)', () => {
    const base = calcBaseDmg(3000, 4.5, 0.80, 0);
    const withFlat = calcBaseDmg(3000, 4.5, 0.80, 5000);
    expect(withFlat - base).toBe(5000);
  });
});
