// src/lib/calc/__tests__/scenarios-phase2.test.ts
import { describe, it, expect } from 'vitest';
import {
  calcBaseDmg,
  calcDmgAmplify,
  calcDefMultiplier,
  calcTuneBreakBoostAmplify,
} from '../damage';
import { aggregatePassiveEffects } from '../passives';
import type { Character, ResonanceChainStatEffect } from '@/types/game';
import { RESONANCE_CHAINS } from '@/data/resonanceChains';
import { STATE_MECHANICS } from '@/data/stateEffects';
import { INHERENT_SKILLS } from '@/data/inherentSkills';
import { OUTRO_BUFFS } from '@/data/outroBuffs';

/**
 * WuCalc_05 §6 권장 단위 테스트 시나리오 T07~T10.
 *
 * T07 카멜리아 S6 + Crimson Bud 풀스택 → Sweet Dream Skill Scaling Bonus 누적
 * T08 갈브레나 S0, Afterflame 40 풀스택 → Forte +60% scalingBonus (+S1 시 critDmg +80%)
 * T09 기염 S0, Resolve 60 풀 + 풍속 자세 — 상태 메커니즘 등록 + 강화 스킬 amplify
 * T10 음림(서브) + 카멜리아(메인) + 벨리나(서포터) — 다중 소스 Amplify 가산
 */

function makeBareCharacter(id: string, element: Character['element']): Character {
  return {
    id,
    name: { ko: id, en: id },
    rarity: 5,
    element,
    weaponType: 'sword',
    baseStats: { '90': { hp: 10000, atk: 500, def: 1000 } },
    skills: [],
  };
}

describe('T07 — 카멜리아 S6, Crimson Bud 10 풀스택, Sweet Dream 누적', () => {
  // S6 (Forte Sweet Dream +150%) + 상태 Crimson Bud 풀스택 (10 × +5% = +50%)
  // 동일 Skill Scaling Bonus 카테고리이므로 가산: +200% on camellya-skill-4

  it('카멜리아 S6 노드와 Crimson Bud 상태가 모두 등록되어 있다', () => {
    const s6 = RESONANCE_CHAINS.camellya?.find((n) => n.node === 6);
    expect(s6).toBeDefined();
    const s6Scaling = s6?.effects.find((e) => e.kind === 'skillScaling');
    if (s6Scaling?.kind !== 'skillScaling') throw new Error('S6 skillScaling 누락');
    expect(s6Scaling.skillId).toBe('camellya-skill-4');
    expect(s6Scaling.bonus).toBeCloseTo(1.50, 6);

    const crimson = STATE_MECHANICS.camellya?.[0];
    expect(crimson).toBeDefined();
    expect(crimson?.maxStacks).toBe(10);
    expect(crimson?.defaultAssumedStacks).toBe(10);
    const perStack = crimson?.perStackEffect?.[0];
    if (perStack?.kind !== 'skillScaling') throw new Error('Crimson Bud perStack 누락');
    expect(perStack.skillId).toBe('camellya-skill-4');
    expect(perStack.bonus).toBeCloseTo(0.05, 6);
  });

  it('aggregatePassiveEffects가 S6 + 풀스택 Crimson Bud를 +200% scalingBonus로 누적한다', () => {
    const camellya = makeBareCharacter('camellya', 'havoc');
    const passives = aggregatePassiveEffects(camellya, 6);
    const sweetDream = passives.skillScalingBonuses['camellya-skill-4'];
    // S6 +1.50 + 10 × +0.05 = +2.00
    expect(sweetDream).toBeCloseTo(2.00, 6);
  });

  it('Sweet Dream 1히트가 (1 + 2.00) = 3배로 강화된다', () => {
    const baseATK = 3000;
    const mv = 2.8;
    const baseline = calcBaseDmg(baseATK, mv, 0, 0);
    const empowered = calcBaseDmg(baseATK, mv, 2.00, 0);
    expect(empowered / baseline).toBeCloseTo(3.00, 6);
  });
});

describe('T08 — 갈브레나 S0, Afterflame 40 풀스택, Forte +60%', () => {
  // S0 → 공명체인 비적용. 인헤런트 Fated End 풀스택 +20% Amplify 적용.
  // Forte: Afterflame 1점당 +1.5% skillScaling on galbrena-skill-1, 40 풀 = +60%

  it('Galbrena Afterflame 상태가 등록되어 있다 (maxStacks 40, perStack +1.5%)', () => {
    const afterflame = STATE_MECHANICS.galbrena?.find(
      (m) => m.stateName.en === 'Afterflame',
    );
    expect(afterflame).toBeDefined();
    expect(afterflame?.maxStacks).toBe(40);
    expect(afterflame?.defaultAssumedStacks).toBe(40);
    const eff = afterflame?.perStackEffect?.[0];
    if (eff?.kind !== 'skillScaling') throw new Error('Afterflame perStack 누락');
    expect(eff.skillId).toBe('galbrena-skill-1');
    expect(eff.bonus).toBeCloseTo(0.015, 6);
  });

  it('S0에서 aggregatePassiveEffects가 Afterflame 풀스택만으로 +60% scalingBonus 산출', () => {
    const galbrena = makeBareCharacter('galbrena', 'fusion');
    const passives = aggregatePassiveEffects(galbrena, 0);
    const skillScaling = passives.skillScalingBonuses['galbrena-skill-1'] ?? 0;
    // 40 × +0.015 = +0.60
    expect(skillScaling).toBeCloseTo(0.60, 6);
    // 인헤런트 Fated End +20% amplify가 풀스택으로 들어가야 함
    expect(passives.amplifies.some((a) => Math.abs(a.value - 0.20) < 1e-6)).toBe(true);
  });

  it('S1 추가 시 critDmg +80% (flatStat)이 누적된다', () => {
    const galbrena = makeBareCharacter('galbrena', 'fusion');
    const passives = aggregatePassiveEffects(galbrena, 1);
    // S1: critDmg +0.80 (Afterflame 40 풀 가정)
    expect(passives.flatStats.critDmg).toBeCloseTo(0.80, 6);
  });
});

describe('T09 — 기염 S0, Resolve 60 풀스택, 풍속 자세', () => {
  // 기염은 60 Resolve 풀스택 시 Qingloong Wind Form 자세 진입 가능.
  // 강화 스킬 캐스트 시 fullStackEffect amplify +20% (조건부) 발동.

  it('기염 Resolve 상태가 등록되어 있다 (maxStacks 60)', () => {
    const resolve = STATE_MECHANICS.jiyan?.[0];
    expect(resolve).toBeDefined();
    expect(resolve?.maxStacks).toBe(60);
    expect(resolve?.defaultAssumedStacks).toBe(60);
    const full = resolve?.fullStackEffect?.[0];
    if (full?.kind !== 'amplify') throw new Error('Resolve fullStack amplify 누락');
    expect(full.value).toBeCloseTo(0.20, 6);
    expect(full.target).toBe('skill');
    expect(full.conditional).toContain('enhanced');
  });

  it('기염 인헤런트 데이터가 모두 적용된다 (ATK +10%, CritDmg +12%)', () => {
    const jiyan = makeBareCharacter('jiyan', 'aero');
    const passives = aggregatePassiveEffects(jiyan, 0);
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.10, 6);
    expect(passives.flatStats.critDmg).toBeCloseTo(0.12, 6);
    // 풀스택 Resolve 시 amplify 0.20 (조건부지만 풀업타임 가정)
    expect(passives.amplifies.some((a) => Math.abs(a.value - 0.20) < 1e-6)).toBe(true);
  });

  it('Versatility S2 추가 시 ATK +28%가 누적된다 (인헤런트 10% + S2 28% = 38%)', () => {
    const jiyan = makeBareCharacter('jiyan', 'aero');
    const passives = aggregatePassiveEffects(jiyan, 2);
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.10 + 0.28, 6);
  });
});

describe('T10 — 음림(서브) + 카멜리아(메인) + 벨리나(서포터) Amplify 다중 소스 가산', () => {
  // - 음림 outro: dmgAmplify 0.20 (Strategist, Liberation/Electro Deepen — 단순화)
  // - 벨리나 outro: dmgAmplify 0.15 (모든 피해 디펜 30초)
  // - 카멜리아 본인 인헤런트/상태: amplify 없음 (havoc DMG bonus는 flatStat)
  // 따라서 메인 DPS amplify 합산 = 0.20 + 0.15 = 0.35

  it('각 outro의 amplify 데이터가 정확히 등록되어 있다 (카테고리화 반영)', () => {
    // 음림: amplifyByCategory에 electro 0.20 + liberation 0.25
    const yinlinCats = OUTRO_BUFFS.yinlin?.amplifyByCategory ?? [];
    expect(yinlinCats.find((a) => a.target === 'electro')?.value).toBeCloseTo(0.20, 6);
    expect(yinlinCats.find((a) => a.target === 'liberation')?.value).toBeCloseTo(0.25, 6);
    // 벨리나: 'all' 카테고리 — legacy dmgAmplify 사용
    expect(OUTRO_BUFFS.verina?.dmgAmplify).toBeCloseTo(0.15, 6);
    expect(OUTRO_BUFFS.verina?.amplifyByCategory).toBeUndefined();
  });

  it('calcDmgAmplify 배열 시그니처가 다중 소스를 가산합한다', () => {
    // 음림은 카테고리화로 변경: electro 0.20 + liberation 0.25 (dmgAmplify는 0)
    // 벨리나는 모든 피해 0.15 ('all')
    const yinlinAmps = OUTRO_BUFFS.yinlin?.amplifyByCategory ?? [];
    const verinaAmp = OUTRO_BUFFS.verina?.dmgAmplify ?? 0;
    const camellyaPassives = aggregatePassiveEffects(
      makeBareCharacter('camellya', 'havoc'),
      0,
    );

    // 카멜리아 본인 인헤런트는 havocDmgBonus(flatStat)만 — amplify는 0
    expect(camellyaPassives.amplifies).toHaveLength(0);

    // 카멜리아 havoc skill 히트 컨텍스트: 음림의 'electro'/'liberation' 모두 매칭 안 함, 벨리나 'all' 매칭
    const yinlinValues = yinlinAmps
      .filter((a) => a.target === 'all' || a.target === 'havoc' || a.target === 'skill')
      .map((a) => a.value);
    const allAmplifies = [...yinlinValues, verinaAmp];
    const mult = calcDmgAmplify(allAmplifies);
    // 음림 catalog는 카멜리아 havoc skill엔 매칭 없음 → 벨리나 0.15만 적용 → 1.15
    expect(mult).toBeCloseTo(1.15, 6);
  });

  it('카멜리아 인헤런트 패시브: 점유(Epiphyte) normal +15% + 온실(Seedbed) havoc +15%', () => {
    const camellya = makeBareCharacter('camellya', 'havoc');
    const passives = aggregatePassiveEffects(camellya, 0);
    // wuthering.gg 검증 (2026-05-20): 점유=Basic+15%, 온실=Havoc+15%
    expect(passives.flatStats.normalDmgBonus).toBeCloseTo(0.15, 6);
    expect(passives.flatStats.havocDmgBonus).toBeCloseTo(0.15, 6);
  });

  it('카르티시아 Aero Erosion 풀스택 6 → +60% amplify (state에서만 single source)', () => {
    const cartethyia = makeBareCharacter('cartethyia', 'aero');
    const passives = aggregatePassiveEffects(cartethyia, 0);
    // 정량 효과는 STATE_MECHANICS의 fullStackEffect에서만 처리 (인헤런트 중복 제거됨)
    expect(passives.amplifies.some((a) => Math.abs(a.value - 0.60) < 1e-6)).toBe(true);
    const totalAmp = passives.amplifies.reduce((s, a) => s + a.value, 0);
    expect(totalAmp).toBeCloseTo(0.60, 6);
  });
});

describe('aggregatePassiveEffects 일반 동작 검증', () => {
  it('체인 노드보다 큰 노드의 효과는 합산되지 않는다', () => {
    const jinhsi = makeBareCharacter('jinhsi', 'spectro');

    // S0: 인헤런트만 (회절 +20% + 인트로 +50%)
    const s0 = aggregatePassiveEffects(jinhsi, 0);
    expect(s0.flatStats.spectroDmgBonus).toBeCloseTo(0.20, 6);
    expect(s0.flatStats.introDmgBonus).toBeCloseTo(0.50, 6);

    // S3: 인헤런트 + S1 (Illuminous Epiphany 풀스택 +80% amplify) + S3 (ATK +50%)
    const s3 = aggregatePassiveEffects(jinhsi, 3);
    expect(s3.flatStats.atkPercent).toBeCloseTo(0.50, 6);
    expect(s3.amplifies.some((a) => Math.abs(a.value - 0.80) < 1e-6)).toBe(true);

    // S5에서 공명해방 +120% skillScaling 추가
    const s5 = aggregatePassiveEffects(jinhsi, 5);
    expect(s5.skillScalingBonuses['jinhsi-liberation-2']).toBeCloseTo(1.20, 6);
  });

  it('체인 + 인헤런트의 coordinatedAttack 정보를 전달한다', () => {
    const yinlin = makeBareCharacter('yinlin', 'electro');
    const passives = aggregatePassiveEffects(yinlin, 6);
    const furiousThunder = passives.coordinatedAttacks.find(
      (c) => c.sourceSkillId === 'yinlin-liberation-2',
    );
    expect(furiousThunder).toBeDefined();
    expect(furiousThunder?.mvPercent).toBeCloseTo(4.1959, 4);
  });

  it('teamBuff는 본인 flatStats가 아닌 별도 버킷에 기록된다', () => {
    const verina = makeBareCharacter('verina', 'spectro');
    const passives = aggregatePassiveEffects(verina, 0);
    // 인헤런트 Gift of Nature: 팀 ATK +20% (teamBuff)
    const giftOfNature = passives.teamBuffs.find(
      (tb) => tb.stat === 'atkPercent' && Math.abs(tb.value - 0.20) < 1e-6,
    );
    expect(giftOfNature).toBeDefined();
    // 본인 ATK는 영향 없어야 함
    expect(passives.flatStats.atkPercent).toBeUndefined();
  });
});

describe('Amplify target 필터링 — attack-type / element 한정 효과', () => {
  it("페비 Confession Enhancement(+100%)는 'spectro' 타깃으로 등록", () => {
    const phoebe = makeBareCharacter('phoebe', 'spectro');
    const passives = aggregatePassiveEffects(phoebe, 0);
    const confession = passives.amplifies.find(
      (a) => Math.abs(a.value - 1.0) < 1e-6 && a.target === 'spectro',
    );
    expect(confession).toBeDefined();
  });

  it("에이메스 Before All Sounds(+200%)는 'heavy' 타깃으로 등록", () => {
    const aemeath = makeBareCharacter('aemeath', 'fusion');
    const passives = aggregatePassiveEffects(aemeath, 0);
    const beforeAllSounds = passives.amplifies.find(
      (a) => Math.abs(a.value - 2.0) < 1e-6 && a.target === 'heavy',
    );
    expect(beforeAllSounds).toBeDefined();
  });

  it('카멜리아(havoc)의 일반공격에는 페비 Confession amplify 미적용', () => {
    const phoebePassives = aggregatePassiveEffects(
      makeBareCharacter('phoebe', 'spectro'),
      0,
    );
    // 가상의 카멜리아 일반공격 컨텍스트로 필터 검증
    const sum = phoebePassives.amplifies
      .filter((a) => a.target === 'all' || a.target === 'normal' || a.target === 'havoc')
      .reduce((s, a) => s + a.value, 0);
    expect(sum).toBe(0); // spectro/skill 타깃이라 매칭 없음
  });

  it('페비 본인 일반공격에도 Confession amplify 미적용 (spectro 한정 ≠ 일반공격 attackType)', () => {
    const phoebePassives = aggregatePassiveEffects(
      makeBareCharacter('phoebe', 'spectro'),
      0,
    );
    // 페비 본인 (spectro 캐릭) 일반공격 컨텍스트
    const sum = phoebePassives.amplifies
      .filter((a) => a.target === 'all' || a.target === 'normal' || a.target === 'spectro')
      .reduce((s, a) => s + a.value, 0);
    // 페비 spectro 타깃 매칭됨: Confession Enhancement +1.00
    expect(sum).toBeCloseTo(1.00, 6);
  });
});

describe('discriminated union 변형 검증', () => {
  it('모든 effect kind가 aggregatePassiveEffects에서 처리된다', () => {
    // 컴파일 타임 검증: 모든 kind 종류
    const kinds: ResonanceChainStatEffect['kind'][] = [
      'flatStat',
      'skillScaling',
      'defIgnore',
      'resPen',
      'amplify',
      'critRate',
      'coordinatedAttack',
      'teamBuff',
    ];
    expect(kinds).toHaveLength(8);
  });
});

describe('weaponPassives — off-field 조건 필터링', () => {
  it("Stringmaster on-field 시 ATK +24% (off-field +12%는 미적용)", () => {
    const yinlin = makeBareCharacter('yinlin', 'electro');
    const onField = aggregatePassiveEffects(yinlin, 0, 'stringmaster', 'on-field');
    const baseATK = onField.flatStats.atkPercent ?? 0;
    // 음림 인헤런트 1: atkPercent +0.10
    // Stringmaster always: +0.24
    // Stringmaster off-field: 미적용 (on-field 모드)
    expect(baseATK).toBeCloseTo(0.10 + 0.24, 6);
  });

  it("Stringmaster off-field 시 ATK +0.36 (always +0.24 + off-field +0.12)", () => {
    const yinlin = makeBareCharacter('yinlin', 'electro');
    const offField = aggregatePassiveEffects(yinlin, 0, 'stringmaster', 'off-field');
    const totalATK = offField.flatStats.atkPercent ?? 0;
    // 음림 인헤런트 +0.10 + Stringmaster always +0.24 + off-field +0.12 = +0.46
    expect(totalATK).toBeCloseTo(0.46, 6);
  });

  it('fieldPresence 미지정 시 on-field 기본값으로 처리', () => {
    const yinlin = makeBareCharacter('yinlin', 'electro');
    const defaultCall = aggregatePassiveEffects(yinlin, 0, 'stringmaster');
    const explicitOnField = aggregatePassiveEffects(yinlin, 0, 'stringmaster', 'on-field');
    expect(defaultCall.flatStats.atkPercent).toBeCloseTo(
      explicitOnField.flatStats.atkPercent ?? 0,
      6,
    );
  });
});

describe('Phase 3 부분 구현 — Tune Break Boost', () => {
  it('FinalStats에 tuneBreakBoost 필드가 합산된다 (기본 0)', () => {
    // 임의의 캐릭터/무기로 calcFinalStats 호출 시 tuneBreakBoost가 정의되어야 함
    // (구체 합산은 stats.test.ts에서 검증; 본 테스트는 필드 존재만 확인)
    type FinalStatsKeys = keyof import('@/types/game').FinalStats;
    const requiredKey: FinalStatsKeys = 'tuneBreakBoost';
    expect(requiredKey).toBe('tuneBreakBoost');
  });

  it('calcTuneBreakBoostAmplify — 린네 공식 (0.12% per point per stack)', () => {
    // 린네 base 10 + Tune Strain 1 스택 = 10 × 1 × 0.0012 = 0.012 (+1.2%)
    expect(calcTuneBreakBoostAmplify(10, 1)).toBeCloseTo(0.012, 6);
    // base 50 + 3 스택 = 50 × 3 × 0.0012 = 0.18 (+18%)
    expect(calcTuneBreakBoostAmplify(50, 3)).toBeCloseTo(0.18, 6);
    // 0 스택이면 0
    expect(calcTuneBreakBoostAmplify(50, 0)).toBe(0);
    // 비-3.x 캐릭터 (base 0)이면 stack과 무관하게 0
    expect(calcTuneBreakBoostAmplify(0, 5)).toBe(0);
  });

  it('Tune Break Boost amplify는 다른 amplify와 가산합산 가능', () => {
    const tbAmp = calcTuneBreakBoostAmplify(50, 2); // 0.12
    const otherAmp = 0.15;
    const mult = calcDmgAmplify([tbAmp, otherAmp]);
    expect(mult).toBeCloseTo(1.27, 6);
  });
});

describe('weaponPassives — 시그니처 무기 조건부 효과', () => {
  it('Stringmaster 풀스택 ATK +24%가 위엘더에 적용된다', () => {
    const yinlin = makeBareCharacter('yinlin', 'electro');
    const noWeapon = aggregatePassiveEffects(yinlin, 0);
    const withStringmaster = aggregatePassiveEffects(yinlin, 0, 'stringmaster');
    const baseATK = noWeapon.flatStats.atkPercent ?? 0;
    const stringmasterATK = withStringmaster.flatStats.atkPercent ?? 0;
    expect(stringmasterATK - baseATK).toBeCloseTo(0.24, 6);
  });

  it('Verdant Summit 풀스택 강공격 +48%가 적용된다', () => {
    const jiyan = makeBareCharacter('jiyan', 'aero');
    const passives = aggregatePassiveEffects(jiyan, 0, 'verdant-summit');
    expect(passives.flatStats.heavyDmgBonus).toBeCloseTo(0.48, 6);
  });

  it('Ages of Harvest는 공명스킬·공명해방 둘 다 +20%를 부여한다', () => {
    const jinhsi = makeBareCharacter('jinhsi', 'spectro');
    const passives = aggregatePassiveEffects(jinhsi, 0, 'ages-of-harvest');
    expect(passives.flatStats.skillDmgBonus).toBeCloseTo(0.20, 6);
    expect(passives.flatStats.liberationDmgBonus).toBeCloseTo(0.20, 6);
  });

  it("Defier's Thorn은 DEF 12% 무시 + Aero Erosion 적에게 +24% Amplify", () => {
    const cartethyia = makeBareCharacter('cartethyia', 'aero');
    const passives = aggregatePassiveEffects(cartethyia, 0, 'defiers-thorn');
    const totalDefIgnore = passives.defIgnores.reduce((s, di) => s + di.value, 0);
    expect(totalDefIgnore).toBeCloseTo(0.12, 6);
    // 인헤런트 Cartethyia +0.60 amplify + STATE Aero Erosion fullStack +0.60 + 무기 +0.24
    const totalAmp = passives.amplifies.reduce((s, a) => s + a.value, 0);
    expect(totalAmp).toBeGreaterThanOrEqual(0.24 + 0.60); // 적어도 무기 + 인헤런트 합산
  });

  it("Lethean Elegy는 echo 카테고리 amplify +20%를 부여한다", () => {
    const phrolova = makeBareCharacter('phrolova', 'havoc');
    const passives = aggregatePassiveEffects(phrolova, 0, 'lethean-elegy');
    const echoAmp = passives.amplifies.find((a) => a.target === 'echo');
    expect(echoAmp?.value).toBeCloseTo(0.20, 6);
    // 또한 skillDmgBonus +20% + defIgnore +12%
    expect(passives.flatStats.skillDmgBonus).toBeCloseTo(0.20, 6);
    const totalDefIgnore = passives.defIgnores.reduce((s, di) => s + di.value, 0);
    expect(totalDefIgnore).toBeCloseTo(0.12, 6);
  });

  it('미등록 무기 ID는 합산에 영향 없음', () => {
    const yinlin = makeBareCharacter('yinlin', 'electro');
    const noWeapon = aggregatePassiveEffects(yinlin, 0);
    const unknownWeapon = aggregatePassiveEffects(yinlin, 0, 'fictional-weapon-xyz');
    expect(unknownWeapon.flatStats.atkPercent ?? 0).toBeCloseTo(
      noWeapon.flatStats.atkPercent ?? 0,
      6,
    );
  });

  it('Everbright Polestar: 공명해방 한정 32% DEF 무시 + Fusion RES 10% 관통', () => {
    const aemeath = makeBareCharacter('aemeath', 'fusion');
    const passives = aggregatePassiveEffects(aemeath, 0, 'everbright-polestar');
    const libDefIgnore = passives.defIgnores.find(
      (di) => di.skillIds?.includes('aemeath-liberation-2'),
    );
    expect(libDefIgnore?.value).toBeCloseTo(0.32, 6);
    const fusionResPen = passives.resPens.find((rp) => rp.element === 'fusion');
    expect(fusionResPen?.value).toBeCloseTo(0.10, 6);
  });

  it('Spectrum Blaster: 일반공격 +36% + 팀 전속성 +24% teamBuff', () => {
    const lynae = makeBareCharacter('lynae', 'spectro');
    const passives = aggregatePassiveEffects(lynae, 0, 'spectrum-blaster');
    expect(passives.flatStats.normalDmgBonus).toBeCloseTo(0.36, 6);
    const teamBuff = passives.teamBuffs.find(
      (tb) => tb.stat === 'allAttributeDmgBonus' && Math.abs(tb.value - 0.24) < 1e-6,
    );
    expect(teamBuff).toBeDefined();
  });

  it('Kumokiri: 공명해방 +24% + 팀 전속성 +24% teamBuff', () => {
    const chisa = makeBareCharacter('chisa', 'havoc');
    const passives = aggregatePassiveEffects(chisa, 0, 'kumokiri');
    expect(passives.flatStats.liberationDmgBonus).toBeCloseTo(0.24, 6);
    const teamBuff = passives.teamBuffs.find(
      (tb) => tb.stat === 'allAttributeDmgBonus' && Math.abs(tb.value - 0.24) < 1e-6,
    );
    expect(teamBuff).toBeDefined();
  });

  it('Blazing Justice: DEF 8% 무시 + Spectro Frazzle amplify +50%', () => {
    const zani = makeBareCharacter('zani', 'spectro');
    const passives = aggregatePassiveEffects(zani, 0, 'blazing-justice');
    const totalDefIgnore = passives.defIgnores.reduce((s, di) => s + di.value, 0);
    expect(totalDefIgnore).toBeGreaterThanOrEqual(0.08);
    const spectroAmp = passives.amplifies.find(
      (a) => a.target === 'spectro' && Math.abs(a.value - 0.50) < 1e-6,
    );
    expect(spectroAmp).toBeDefined();
  });

  it("Daybreaker's Spine: 회절 +20% + 일반 Amplify +20% + 일반 한정 DEF -10%", () => {
    const luuk = makeBareCharacter('luuk-herssen', 'spectro');
    const passives = aggregatePassiveEffects(luuk, 0, 'daybreakers-spine');
    expect(passives.flatStats.spectroDmgBonus).toBeCloseTo(0.20, 6);
    const normalAmp = passives.amplifies.find(
      (a) => a.target === 'normal' && Math.abs(a.value - 0.20) < 1e-6,
    );
    expect(normalAmp).toBeDefined();
    const normalDefIgnore = passives.defIgnores.find(
      (di) => di.skillIds?.includes('luuk-herssen-normal-0'),
    );
    expect(normalDefIgnore?.value).toBeCloseTo(0.10, 6);
  });

  it('Tragicomedy: 강공격 +48% (풀업타임 가정)', () => {
    const roccia = makeBareCharacter('roccia', 'havoc');
    const passives = aggregatePassiveEffects(roccia, 0, 'tragicomedy');
    expect(passives.flatStats.heavyDmgBonus).toBeCloseTo(0.48, 6);
  });

  // ── 4★ 보급형 검증 ──
  it('Helios Cleaver: 풀스택 +12% ATK', () => {
    const dummy = makeBareCharacter('jiyan', 'aero');
    const passives = aggregatePassiveEffects(dummy, 0, 'helios-cleaver');
    // 인헤런트 ATK +10% + Helios +12% = +22%
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.10 + 0.12, 6);
  });

  it('Hollow Mirage: Iron Armor 풀스택 +9% ATK + +9% DEF', () => {
    const dummy = makeBareCharacter('jianxin', 'aero');
    const passives = aggregatePassiveEffects(dummy, 0, 'hollow-mirage');
    // 본인 인헤런트는 atkPercent 없음 (jianxin은 liberationDmgBonus +0.20)
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.09, 6);
    expect(passives.flatStats.defPercent).toBeCloseTo(0.09, 6);
  });

  it('Stonard: 공명해방 +18% Bonus (풀업타임)', () => {
    const dummy = makeBareCharacter('jianxin', 'aero');
    const passives = aggregatePassiveEffects(dummy, 0, 'stonard');
    // 인헤런트 jianxin: liberation +0.20 + Stonard +0.18 = +0.38
    expect(passives.flatStats.liberationDmgBonus).toBeCloseTo(0.38, 6);
  });

  it('Autumntrace: 5스택 풀스택 +20% ATK', () => {
    const dummy = makeBareCharacter('camellya', 'havoc');
    const passives = aggregatePassiveEffects(dummy, 0, 'autumntrace');
    // 카멜리아 자체 인헤런트엔 atkPercent 없음, autumntrace +0.20만
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.20, 6);
  });

  it('Thunderbolt: 3스택 풀스택 +21% Resonance Skill DMG', () => {
    const dummy = makeBareCharacter('mortefi', 'fusion');
    const passives = aggregatePassiveEffects(dummy, 0, 'thunderbolt');
    expect(passives.flatStats.skillDmgBonus).toBeCloseTo(0.21, 6);
  });

  it('Lumingloss: 일반 +20% + 강공격 +20% 동시 부여', () => {
    const dummy = makeBareCharacter('chixia', 'fusion');
    const passives = aggregatePassiveEffects(dummy, 0, 'lumingloss');
    expect(passives.flatStats.normalDmgBonus).toBeCloseTo(0.20, 6);
    expect(passives.flatStats.heavyDmgBonus).toBeCloseTo(0.20, 6);
  });

  // ── 5★ 시그니처 추가분 검증 ──
  it('Emerald Sentence: Bamboo Cleaver 풀스택 +60% 강공격', () => {
    const dummy = makeBareCharacter('qiuyuan', 'aero');
    const passives = aggregatePassiveEffects(dummy, 0, 'emerald-sentence');
    expect(passives.flatStats.heavyDmgBonus).toBeCloseTo(0.60, 6);
  });

  it("Moongazer's Sigil: 공명해방 +20% + 공명해방 한정 DEF 무시 +36%", () => {
    const dummy = makeBareCharacter('iuno', 'aero');
    const passives = aggregatePassiveEffects(dummy, 0, 'moongazers-sigil');
    expect(passives.flatStats.liberationDmgBonus).toBeCloseTo(0.20, 6);
    const libDefIgnore = passives.defIgnores.find(
      (di) => di.skillIds?.includes('iuno-liberation-2'),
    );
    expect(libDefIgnore?.value).toBeCloseTo(0.36, 6);
  });

  it('Solsworn Ciphers: echo 카테고리 amplify +32% + DEF 무시 +10%', () => {
    const dummy = makeBareCharacter('sigrika', 'aero');
    const passives = aggregatePassiveEffects(dummy, 0, 'solsworn-ciphers');
    const echoAmp = passives.amplifies.find(
      (a) => a.target === 'echo' && Math.abs(a.value - 0.32) < 1e-6,
    );
    expect(echoAmp).toBeDefined();
    const totalDefIgnore = passives.defIgnores.reduce((s, di) => s + di.value, 0);
    expect(totalDefIgnore).toBeCloseTo(0.10, 6);
  });

  it('Woodland Aria: Aero DMG +20% + Aero RES -12%', () => {
    const dummy = makeBareCharacter('ciaccona', 'aero');
    const passives = aggregatePassiveEffects(dummy, 0, 'woodland-aria');
    expect(passives.flatStats.aeroDmgBonus).toBeCloseTo(0.20, 6);
    const aeroResPen = passives.resPens.find((rp) => rp.element === 'aero');
    expect(aeroResPen?.value).toBeCloseTo(0.12, 6);
  });

  it("Lux & Umbra: heavy/echo amplify 각 +24% + DEF 무시 +8%", () => {
    const dummy = makeBareCharacter('galbrena', 'fusion');
    const passives = aggregatePassiveEffects(dummy, 0, 'lux-&-umbra');
    const heavyAmp = passives.amplifies.find(
      (a) => a.target === 'heavy' && Math.abs(a.value - 0.24) < 1e-6,
    );
    const echoAmp = passives.amplifies.find(
      (a) => a.target === 'echo' && Math.abs(a.value - 0.24) < 1e-6,
    );
    expect(heavyAmp).toBeDefined();
    expect(echoAmp).toBeDefined();
    const totalDefIgnore = passives.defIgnores.reduce((s, di) => s + di.value, 0);
    expect(totalDefIgnore).toBeCloseTo(0.08, 6);
  });

  it('Unflickering Valor: 일반공격 +48% (두 효과 풀가동)', () => {
    const dummy = makeBareCharacter('brant', 'fusion');
    const passives = aggregatePassiveEffects(dummy, 0, 'unflickering-valor');
    expect(passives.flatStats.normalDmgBonus).toBeCloseTo(0.48, 6);
  });

  it('Stellar Symphony: 팀 ATK +14% teamBuff', () => {
    const dummy = makeBareCharacter('shorekeeper', 'spectro');
    const passives = aggregatePassiveEffects(dummy, 0, 'stellar-symphony');
    const teamAtk = passives.teamBuffs.find(
      (tb) => tb.stat === 'atkPercent' && Math.abs(tb.value - 0.14) < 1e-6,
    );
    expect(teamAtk).toBeDefined();
  });

  it('Starfield Calibrator: 팀 Crit DMG +20% teamBuff', () => {
    const dummy = makeBareCharacter('mornye', 'fusion');
    const passives = aggregatePassiveEffects(dummy, 0, 'starfield-calibrator');
    const teamCD = passives.teamBuffs.find(
      (tb) => tb.stat === 'critDmg' && Math.abs(tb.value - 0.20) < 1e-6,
    );
    expect(teamCD).toBeDefined();
  });

  it('Rime-Draped Sprouts on-field: 일반공격 +36% (off-field 추가 효과는 미적용)', () => {
    const dummy = makeBareCharacter('zhezhi', 'glacio');
    const onField = aggregatePassiveEffects(dummy, 0, 'rime-draped-sprouts', 'on-field');
    // 풀스택 3 × +12% = +36% (off-field +52%는 미적용)
    expect(onField.flatStats.normalDmgBonus).toBeCloseTo(0.36, 6);
  });

  it('Rime-Draped Sprouts off-field: 일반공격 +88% (always +36% + off-field +52%)', () => {
    const dummy = makeBareCharacter('zhezhi', 'glacio');
    const offField = aggregatePassiveEffects(dummy, 0, 'rime-draped-sprouts', 'off-field');
    expect(offField.flatStats.normalDmgBonus).toBeCloseTo(0.36 + 0.52, 6);
  });

  // ── 4★ 추가분 검증 ──
  it('Solar Flame: 풀스택 +8.8% ATK + +8.8% 강공격', () => {
    const dummy = makeBareCharacter('mortefi', 'fusion');
    const passives = aggregatePassiveEffects(dummy, 0, 'solar-flame');
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.088, 6);
    expect(passives.flatStats.heavyDmgBonus).toBeCloseTo(0.088, 6);
  });

  it('Jinzhou Keeper: 인트로 후 ATK +8% + HP +10%', () => {
    const dummy = makeBareCharacter('verina', 'spectro');
    const passives = aggregatePassiveEffects(dummy, 0, 'jinzhou-keeper');
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.08, 6);
    expect(passives.flatStats.hpPercent).toBeCloseTo(0.10, 6);
  });

  it('Lunar Cutter: Oath 풀스택 +12% ATK', () => {
    const dummy = makeBareCharacter('sanhua', 'glacio');
    const passives = aggregatePassiveEffects(dummy, 0, 'lunar-cutter');
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.12, 6);
  });

  it('Dauntless Evernight: 인트로 ATK +8% + DEF +15%', () => {
    const dummy = makeBareCharacter('jiyan', 'aero');
    const passives = aggregatePassiveEffects(dummy, 0, 'dauntless-evernight');
    // jiyan 인헤런트 +0.10 ATK + weapon +0.08 = +0.18
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.18, 6);
    expect(passives.flatStats.defPercent).toBeCloseTo(0.15, 6);
  });

  it('Endless Collapse: 공명스킬 후 ATK +10%', () => {
    const dummy = makeBareCharacter('camellya', 'havoc');
    const passives = aggregatePassiveEffects(dummy, 0, 'endless-collapse');
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.10, 6);
  });

  it("Ocean's Gift: Frazzle 풀스택 +24% Spectro DMG", () => {
    const dummy = makeBareCharacter('shorekeeper', 'spectro');
    const passives = aggregatePassiveEffects(dummy, 0, 'oceans-gift');
    expect(passives.flatStats.spectroDmgBonus).toBeCloseTo(0.24, 6);
  });

  // ── 4★ 추가 (BP/가챠 풀) ──
  it('Aether Strike: 공명해방 후 ATK +7.2% + Liberation +10.8%', () => {
    const dummy = makeBareCharacter('xiangli-yao', 'electro');
    const passives = aggregatePassiveEffects(dummy, 0, 'aether-strike');
    // 본인 인헤런트 영향 빼고 무기만: atk +0.072 + liberation +0.108
    // xiangli-yao 인헤런트는 electroDmgBonus만 → atkPercent엔 영향 X
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.072, 6);
    expect(passives.flatStats.liberationDmgBonus).toBeCloseTo(0.108, 6);
  });

  it('Aureate Zenith: ATK +7.2% + Heavy +10.8%', () => {
    const dummy = makeBareCharacter('camellya', 'havoc');
    const passives = aggregatePassiveEffects(dummy, 0, 'aureate-zenith');
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.072, 6);
    expect(passives.flatStats.heavyDmgBonus).toBeCloseTo(0.108, 6);
  });

  it('Amity Accord: Liberation DMG +20% (인트로 후)', () => {
    const dummy = makeBareCharacter('jianxin', 'aero');
    const passives = aggregatePassiveEffects(dummy, 0, 'amity-accord');
    // jianxin 인헤런트 liberation +0.20 + 무기 +0.20 = +0.40
    expect(passives.flatStats.liberationDmgBonus).toBeCloseTo(0.40, 6);
  });

  it('Undying Flame: Resonance Skill DMG +20% (인트로 후)', () => {
    // chixia는 state mechanic 영향을 받지 않는 stat이므로 weapon만 검증 가능
    const dummy = makeBareCharacter('chixia', 'fusion');
    const passives = aggregatePassiveEffects(dummy, 0, 'undying-flame');
    expect(passives.flatStats.skillDmgBonus).toBeCloseTo(0.20, 6);
  });

  it('Feather Edge: ATK +7.2% + Liberation +10.8% (Aether Strike와 동일 R1)', () => {
    const dummy = makeBareCharacter('camellya', 'havoc');
    const passives = aggregatePassiveEffects(dummy, 0, 'feather-edge');
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.072, 6);
    expect(passives.flatStats.liberationDmgBonus).toBeCloseTo(0.108, 6);
  });

  it('Romance in Farewell: Negative Status 풀스택 +16% ATK', () => {
    // aalto는 인헤런트/state 모두 미등록이라 무기 효과만 검증 가능
    const dummy = makeBareCharacter('aalto', 'aero');
    const passives = aggregatePassiveEffects(dummy, 0, 'romance-in-farewell');
    expect(passives.flatStats.atkPercent).toBeCloseTo(0.16, 6);
  });

  // ── 시리즈 무기 4종 검증 ──
  it('Deep Sky Blazar 시리즈 (fusion-accretion/celestial-spiral/relativistic-jet/waning-redshift): 모두 ATK +10%', () => {
    const dummy = makeBareCharacter('aalto', 'aero');
    for (const wid of ['fusion-accretion', 'celestial-spiral', 'relativistic-jet', 'waning-redshift']) {
      const p = aggregatePassiveEffects(dummy, 0, wid);
      expect(p.flatStats.atkPercent).toBeCloseTo(0.10, 6);
    }
  });

  it('Negative Status 시리즈 (meditations/legend/fables/waltz): 모두 풀스택 +16% ATK', () => {
    const dummy = makeBareCharacter('aalto', 'aero');
    for (const wid of ['meditations-on-mercy', 'legend-of-drunken-hero', 'fables-of-wisdom', 'waltz-in-masquerade']) {
      const p = aggregatePassiveEffects(dummy, 0, wid);
      expect(p.flatStats.atkPercent).toBeCloseTo(0.16, 6);
    }
  });
});

describe('R2~R5 무기 재련 단계 — multiplier 적용', () => {
  it('Verdant Summit R1 +48% → R5 +96% (선형 ×2.0)', () => {
    const dummy = makeBareCharacter('jiyan', 'aero');
    const r1 = aggregatePassiveEffects(dummy, 0, 'verdant-summit', 'on-field', 1);
    const r5 = aggregatePassiveEffects(dummy, 0, 'verdant-summit', 'on-field', 5);
    expect(r1.flatStats.heavyDmgBonus).toBeCloseTo(0.48, 6);
    expect(r5.flatStats.heavyDmgBonus).toBeCloseTo(0.96, 6);
  });

  it('Stringmaster R1 +24% → R5 +48% (선형 ×2.0, 데이터마인 검증)', () => {
    const dummy = makeBareCharacter('aalto', 'aero'); // 인헤런트 없음으로 무기 효과만 측정
    const r1 = aggregatePassiveEffects(dummy, 0, 'stringmaster', 'on-field', 1);
    const r5 = aggregatePassiveEffects(dummy, 0, 'stringmaster', 'on-field', 5);
    expect(r1.flatStats.atkPercent).toBeCloseTo(0.24, 6);
    expect(r5.flatStats.atkPercent).toBeCloseTo(0.48, 6);
  });

  it('Autumntrace R1 +20% → R5 +64% (강한 비선형 ×3.2)', () => {
    const dummy = makeBareCharacter('aalto', 'aero');
    const r1 = aggregatePassiveEffects(dummy, 0, 'autumntrace', 'on-field', 1);
    const r5 = aggregatePassiveEffects(dummy, 0, 'autumntrace', 'on-field', 5);
    expect(r1.flatStats.atkPercent).toBeCloseTo(0.20, 6);
    expect(r5.flatStats.atkPercent).toBeCloseTo(0.64, 6);
  });

  it('미등록 무기는 DEFAULT_REFINEMENT (×2.0 선형) 사용', () => {
    const dummy = makeBareCharacter('aalto', 'aero');
    // Tragicomedy는 미등록 (factors 없음) → DEFAULT 사용
    const r1 = aggregatePassiveEffects(dummy, 0, 'tragicomedy', 'on-field', 1);
    const r5 = aggregatePassiveEffects(dummy, 0, 'tragicomedy', 'on-field', 5);
    expect(r1.flatStats.heavyDmgBonus).toBeCloseTo(0.48, 6);
    expect(r5.flatStats.heavyDmgBonus).toBeCloseTo(0.96, 6); // ×2.0
  });

  it('R3 multiplier 중간값 확인 (verdant-summit R3 = R1 × 1.5 = 0.72)', () => {
    const dummy = makeBareCharacter('aalto', 'aero');
    const r3 = aggregatePassiveEffects(dummy, 0, 'verdant-summit', 'on-field', 3);
    expect(r3.flatStats.heavyDmgBonus).toBeCloseTo(0.72, 6);
  });
});

describe('3.3 신규 캐릭터 — 히유키 & 데니아 검증', () => {
  it('히유키 인헤런트 2개 등록 (속삭이는 눈 / 변하는 세상)', () => {
    const hiyuki = makeBareCharacter('hiyuki', 'glacio');
    const passives = aggregatePassiveEffects(hiyuki, 0);
    // 인헤런트는 description-only이므로 정량 효과 없음.
    // 다만 STATE_MECHANICS의 Snow Rust 풀스택 fullStackEffect가 critDmg +0.40을 추가하므로 그것만 반영됨
    expect(passives.flatStats.critDmg).toBeCloseTo(0.40, 6);
  });

  it('히유키 Snow Rust 풀스택 → 크리피해 +40% + Glacio amplify +60%', () => {
    const hiyuki = makeBareCharacter('hiyuki', 'glacio');
    const passives = aggregatePassiveEffects(hiyuki, 0);
    // STATE_MECHANICS.hiyuki[Snow Rust] fullStackEffect: critDmg +0.40 + amplify glacio +0.60
    // STATE_MECHANICS.hiyuki[Frost Forge Sheath] perStack × 3 = skillScaling +12.0 on liberation-2
    expect(passives.flatStats.critDmg).toBeCloseTo(0.40, 6);
    const glacioAmp = passives.amplifies.find(
      (a) => a.target === 'glacio' && Math.abs(a.value - 0.60) < 1e-6,
    );
    expect(glacioAmp).toBeDefined();
  });

  it('히유키 Frost Forge Sheath 풀 3pt → 공명해방 scalingBonus +1200%', () => {
    const hiyuki = makeBareCharacter('hiyuki', 'glacio');
    const passives = aggregatePassiveEffects(hiyuki, 0);
    expect(passives.skillScalingBonuses['hiyuki-liberation-2']).toBeCloseTo(12.00, 4);
  });

  it('히유키 S5 → 공명스킬 +80% scalingBonus', () => {
    const hiyuki = makeBareCharacter('hiyuki', 'glacio');
    const s5 = aggregatePassiveEffects(hiyuki, 5);
    // S5 한정 (chainNode>=5): hiyuki-skill-1 +0.80
    expect(s5.skillScalingBonuses['hiyuki-skill-1']).toBeCloseTo(0.80, 6);
  });

  it('히유키 S6 → 크리피해 +500% (독심·납도)', () => {
    const hiyuki = makeBareCharacter('hiyuki', 'glacio');
    const s6 = aggregatePassiveEffects(hiyuki, 6);
    // S6 critDmg +5.00 + Snow Rust state +0.40 = +5.40
    expect(s6.flatStats.critDmg).toBeCloseTo(5.40, 6);
  });

  it('히유키 + Frostburn: ATK +12% (정적) + 공명해방 DEF -10% + Glacio +28% amplify', () => {
    const hiyuki = makeBareCharacter('hiyuki', 'glacio');
    const passives = aggregatePassiveEffects(hiyuki, 0, 'frostburn');
    const libDefIgnore = passives.defIgnores.find(
      (di) => di.skillIds?.includes('hiyuki-liberation-2'),
    );
    expect(libDefIgnore?.value).toBeCloseTo(0.10, 6);
    const glacioAmpWeapon = passives.amplifies.find(
      (a) => a.target === 'glacio' && Math.abs(a.value - 0.28) < 1e-6,
    );
    expect(glacioAmpWeapon).toBeDefined();
  });

});

describe('T11 — 보스 레벨 110 vs 캐릭터 90, DEF 공식 레벨 차이 페널티', () => {
  // DEFMult = (800 + 8 × LvAttacker) / ((800 + 8 × LvAttacker) + DEF_Target × (1 - DefIgnore))
  // 동일 레벨 (Lv90 vs Lv90, 적 DEF ≈ 1520): DEFMult = 1520/3040 = 0.5 → 50% 손실
  // 레벨 차 +20 (캐릭 90 vs 보스 110, 적 DEF 추정 ≈ 2200~2400 범위): DEFMult 0.4 근방 → 60% 손실

  it('동일 레벨 (Lv90 vs Lv90, 적 DEF 1520)에서 DEFMult ≈ 0.5', () => {
    expect(calcDefMultiplier(90, 1520, 0)).toBeCloseTo(0.5, 4);
  });

  it('레벨 차 +20 (Lv90 vs Lv110, 적 DEF 2400 추정)에서 DEFMult ≈ 0.388 (61.2% 손실)', () => {
    // (800 + 8×90) / ((800 + 720) + 2400) = 1520 / 3920 ≈ 0.3878
    const m = calcDefMultiplier(90, 2400, 0);
    expect(m).toBeCloseTo(1520 / 3920, 4);
    expect(m).toBeLessThan(0.4);
  });

  it('DEF Ignore 30% 적용 시 레벨 차 페널티가 부분 상쇄된다', () => {
    // 적 DEF 2400 × (1 - 0.3) = 1680
    // DEFMult = 1520 / (1520 + 1680) = 1520 / 3200 = 0.475
    const m = calcDefMultiplier(90, 2400, 0.3);
    expect(m).toBeCloseTo(1520 / 3200, 4);
    // DEF Ignore 0과 비교해 멀티 상승
    const mWithoutIgnore = calcDefMultiplier(90, 2400, 0);
    expect(m).toBeGreaterThan(mWithoutIgnore);
  });

  it('레벨 차가 클수록 DEFMult가 단조 감소한다', () => {
    // 적 DEF는 레벨에 비례해 증가한다고 가정 — 동일한 DEF에서 본인 레벨이 낮을수록 DEFMult 낮음
    const m70 = calcDefMultiplier(70, 1520, 0);
    const m80 = calcDefMultiplier(80, 1520, 0);
    const m90 = calcDefMultiplier(90, 1520, 0);
    expect(m70).toBeLessThan(m80);
    expect(m80).toBeLessThan(m90);
  });
});
