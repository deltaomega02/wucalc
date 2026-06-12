// src/lib/calc/__tests__/weapon-passive.test.ts
import { describe, it, expect } from 'vitest';
import charactersData from '@/data/characters.json';
import weaponsData from '@/data/weapons.json';
import { compareWeapons } from '../weapon';
import type { Character, Echo, EchoSet, Weapon } from '@/types/game';

/**
 * weapon.ts compareWeapons에 WEAPON_PASSIVES 조건부 효과가 통합된 후의 동작 검증.
 *
 * 핵심 시나리오:
 * - 카멜리아(인멸/검) 빌드에서 Red Spring(시그니처) vs Lumingloss(보급형) 비교 시,
 *   Red Spring의 +24% Basic DMG가 압도적이므로 양수 diff 확인
 * - 무기 A == 무기 B면 diff = 0 (자기 자신 비교)
 */

function findCharacter(id: string): Character {
  const c = (charactersData as unknown as Character[]).find((x) => x.id === id);
  if (!c) throw new Error(`Character ${id} not found`);
  return c;
}

function findWeapon(id: string): Weapon {
  const w = (weaponsData as unknown as Weapon[]).find((x) => x.id === id);
  if (!w) throw new Error(`Weapon ${id} not found`);
  return w;
}

const noEchoes: Echo[] = [];
const noEchoSets: EchoSet[] = [];

describe('compareWeapons — passive 통합', () => {
  it('동일 무기 비교 시 diff = 0', () => {
    const camellya = findCharacter('camellya');
    const redSpring = findWeapon('red-spring');
    const result = compareWeapons(
      camellya, '90', redSpring, redSpring, '90',
      noEchoes, noEchoSets, 2.5, 'normal', 90, 0.1, 1520,
    );
    expect(result.diff).toBeCloseTo(0, 4);
  });

  it('Red Spring vs Lumingloss (sword) 비교 — 일반공격 hit', () => {
    const camellya = findCharacter('camellya');
    const redSpring = findWeapon('red-spring');         // passive: +24% Basic DMG
    const lumingloss = findWeapon('lumingloss');         // passive: +20% Basic + +20% Heavy
    const result = compareWeapons(
      camellya, '90', redSpring, lumingloss, '90',
      noEchoes, noEchoSets, 2.5, 'normal', 90, 0.1, 1520,
    );
    // 일반공격 hit 기준 Red Spring +24% vs Lumingloss +20% — Red Spring이 더 강함
    // (diff = B - A이므로 음수: lumingloss < redSpring)
    // 단 lumingloss는 Heavy +20%도 가지지만 normal 컨텍스트엔 미반영
    expect(result.damageA).toBeGreaterThan(0);
    expect(result.damageB).toBeGreaterThan(0);
    expect(result.diff).toBeLessThan(0); // B (lumingloss) < A (redSpring) for normal hit
  });

  it('Verdant Summit(broadblade) heavy hit — +48% 강공격 보너스 반영', () => {
    const jiyan = findCharacter('jiyan');
    const verdantSummit = findWeapon('verdant-summit');
    const lustrousRazor = findWeapon('lustrous-razor'); // +24% Liberation
    // 강공격 hit이므로 Verdant Summit의 +48% Heavy가 적용, Lustrous Razor는 Heavy 보너스 없음
    const result = compareWeapons(
      jiyan, '90', verdantSummit, lustrousRazor, '90',
      noEchoes, noEchoSets, 3.0, 'heavy', 90, 0.1, 1520,
    );
    expect(result.damageA).toBeGreaterThan(result.damageB);
    expect(result.diff).toBeLessThan(0);
  });

  it('Stringmaster vs Cosmic Ripples (rectifier) — skill hit, both apply ATK +24% via passive', () => {
    const yinlin = findCharacter('yinlin');
    const stringmaster = findWeapon('stringmaster');     // +24% ATK (always)
    const cosmicRipples = findWeapon('cosmic-ripples');  // +24% Basic DMG (skill hit엔 무효)
    const result = compareWeapons(
      yinlin, '90', stringmaster, cosmicRipples, '90',
      noEchoes, noEchoSets, 2.5, 'skill', 90, 0.1, 1520,
    );
    // skill hit엔 Stringmaster의 +24% ATK가 적용, Cosmic Ripples의 +24% Basic은 skill에 무효
    expect(result.damageA).toBeGreaterThan(result.damageB);
    expect(result.diff).toBeLessThan(0);
  });

  it('Solsworn Ciphers vs cosmic-ripples — echo amplify +32% 차이', () => {
    const sigrika = findCharacter('sigrika');
    const solsworn = findWeapon('solsworn-ciphers');     // echo amplify +32% + DEF -10%
    const cosmicRipples = findWeapon('cosmic-ripples');  // +24% Basic
    const result = compareWeapons(
      sigrika, '90', solsworn, cosmicRipples, '90',
      noEchoes, noEchoSets, 4.0, 'echo', 90, 0.1, 1520,
    );
    // echo hit에 solsworn의 amplify와 defIgnore 모두 적용 → A가 훨씬 더 강함
    expect(result.damageA).toBeGreaterThan(result.damageB);
  });

  it("Defier's Thorn vs verdant-summit (sword vs broadblade) — Cartethyia heavy hit", () => {
    const cartethyia = findCharacter('cartethyia');
    const defiersThorn = findWeapon('defiers-thorn');    // defIgnore 12% + amplify 24% (Aero Erosion 조건부)
    const lumingloss = findWeapon('lumingloss');          // +20% Basic + +20% Heavy
    const result = compareWeapons(
      cartethyia, '90', defiersThorn, lumingloss, '90',
      noEchoes, noEchoSets, 3.0, 'heavy', 90, 0.1, 1520,
    );
    // 두 무기 모두 양수 damage 산출
    expect(result.damageA).toBeGreaterThan(0);
    expect(result.damageB).toBeGreaterThan(0);
  });

  it('비교 diff에는 인헤런트/체인/상태 효과가 영향 없음 (양쪽 동일 적용)', () => {
    // Yinlin 인헤런트는 chainNode 0/6 모두 동일하게 양쪽 무기에 적용 → diff에 영향 없음
    const yinlin = findCharacter('yinlin');
    const stringmaster = findWeapon('stringmaster');
    const cosmicRipples = findWeapon('cosmic-ripples');

    const diffS0 = compareWeapons(
      yinlin, '90', stringmaster, cosmicRipples, '90',
      noEchoes, noEchoSets, 2.5, 'skill', 90, 0.1, 1520, 0,
    ).diff;
    const diffS6 = compareWeapons(
      yinlin, '90', stringmaster, cosmicRipples, '90',
      noEchoes, noEchoSets, 2.5, 'skill', 90, 0.1, 1520, 6,
    ).diff;

    // 절대값 damage는 S6에서 더 크지만, A와 B 모두 동일 비율로 커지므로
    // diff/diffPercent의 부호와 대략적 ratio는 보존됨
    expect(Math.sign(diffS0)).toBe(Math.sign(diffS6));
  });
});
