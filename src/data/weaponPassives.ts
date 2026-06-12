// src/data/weaponPassives.ts
import type { ResonanceChainStatEffect } from '@/types/game';

/**
 * 무기 패시브의 조건부(스택/모드) 효과 정량 데이터.
 *
 * `weapons.json`의 `passive.stats`는 무조건 발동되는 정적 스탯을 담는다.
 * 본 파일은 그 외 조건부 효과(스택 기반 ATK +X%, 강공격 보너스 +Y% 등)를
 * 풀스택/풀업타임 가정으로 정량화한 데이터를 보유한다.
 *
 * R1(재련 0회) 기준. 재련 단계는 추후 별도 모델링.
 *
 * 출처: Game8 / wuthering.gg / Sportskeeda 등 다중 가이드 사이트 교차 확인 (R1 수치).
 * 데이터 미확보 무기는 본 맵에 누락 처리 (점진 등록).
 */

/** 무기 패시브 효과의 적용 조건 */
export type WeaponPassiveCondition =
  | 'always'      // 무조건 발동 (default)
  | 'on-field'    // 위엘더가 필드에 활성화된 동안만
  | 'off-field';  // 위엘더가 미출전 상태일 때만

/** 무기 패시브 효과 단위 — 효과 + 조건 */
export interface WeaponPassiveEffect {
  appliesWhen: WeaponPassiveCondition;
  effect: ResonanceChainStatEffect;
}

/** 헬퍼: always 조건의 효과 빠른 생성 */
function always(effect: ResonanceChainStatEffect): WeaponPassiveEffect {
  return { appliesWhen: 'always', effect };
}

/** 헬퍼: off-field 조건의 효과 빠른 생성 */
function offField(effect: ResonanceChainStatEffect): WeaponPassiveEffect {
  return { appliesWhen: 'off-field', effect };
}

/**
 * 무기별 재련(R1~R5) 단계별 multiplier.
 *
 * 무기 패시브의 정량 값은 `WEAPON_PASSIVES`에 R1 값으로 저장되며,
 * 재련 단계가 올라갈 때 해당 multiplier로 스케일된다.
 *
 * `[1, m2, m3, m4, m5]` 형식 — index = R - 1. m1 항상 1.0.
 *
 * 미등록 무기는 `DEFAULT_REFINEMENT` (R5 = R1 × 2, 선형)을 적용한다.
 *
 * 검증된 패턴 (Game8/wuthering.gg 다중 출처):
 * - Verdant Summit: R1 24% → R5 48% (×2.0, 선형)
 * - Stringmaster: R1 12% → R5 21% (×1.75, +1.875%/단계)
 * - Autumntrace: R1 4% → R5 12.8% (×3.2)
 * - Stonard: R1 18% → R5 54% (×3.0)
 * - Solar Flame: R1 2.2% → R5 7.2% (≈×3.27)
 * - Aether Strike / Feather Edge: R1 7.2/10.8 → R5 23/34.5 (≈×3.19)
 * - Amity Accord: R1 20% → R4 35% (선형 +5%/단계, R5는 +X%)
 */
export const DEFAULT_REFINEMENT: readonly [number, number, number, number, number] =
  [1.0, 1.25, 1.5, 1.75, 2.0];

export const WEAPON_REFINEMENT_FACTORS: Record<string, readonly [number, number, number, number, number]> = {
  // ── 데이터마인 검증 (Arikatsu BinData/weapon/weaponconf.json) ──
  // 5★ 모든 무기: 1차 출처 확인 결과 일관되게 ×2.0 LINEAR (R1, R2=R1×1.25, R3=R1×1.5, R4=R1×1.75, R5=R1×2.0)
  // → 5★ 무기는 DEFAULT_REFINEMENT을 그대로 사용. 별도 entry 불필요.
  //
  // 4★ 무기: 무기별로 ×2.0 (대부분) 또는 ×3.2 (Battle Pass/가챠 풀 무기) 패턴 사용.
  // 데이터마인의 DescParams 첫 번째 % 파라미터 R5/R1 비율 기준.

  // ── 4★ Battle Pass / 가챠 풀 — 강한 비선형 ×3.2 패턴 (데이터마인 검증) ──
  autumntrace: [1.0, 1.55, 2.10, 2.65, 3.20],
  'solar-flame': [1.0, 1.545, 2.136, 2.682, 3.273],
  'aether-strike': [1.0, 1.542, 2.097, 2.639, 3.194],
  'feather-edge': [1.0, 1.542, 2.097, 2.639, 3.194],
  'aureate-zenith': [1.0, 1.542, 2.097, 2.639, 3.194],
  stonard: [1.0, 1.5, 2.0, 2.5, 3.0],

  // 미등록 항목 = DEFAULT_REFINEMENT (×2.0 선형) — 5★ 전부 + 일반 4★ 대부분 해당
};

export const WEAPON_PASSIVES: Record<string, WeaponPassiveEffect[]> = {
  // ── 5★ 시그니처 (rectifier) ──
  stringmaster: [
    // R1: 공명스킬 명중 시 ATK +12%, 8초, 최대 2스택 (=+24% ATK). 풀업타임 가정.
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.24 }),
    // 추가: 미출전 시 ATK +12% (위엘더가 sub-DPS/support 역할일 때 적용)
    offField({ kind: 'flatStat', stat: 'atkPercent', value: 0.12 }),
  ],

  // ── 5★ 시그니처 (broadblade) ──
  'verdant-summit': [
    // R1: 인트로/공명해방 시 강공격 피해 +24%, 14초, 최대 2스택 (=+48% Heavy DMG Bonus)
    always({ kind: 'flatStat', stat: 'heavyDmgBonus', value: 0.48 }),
  ],

  // ── 5★ 시그니처 (sword — Camellya) ──
  'red-spring': [
    // R1: 일반공격 피해 시 일반공격 피해 +3%, 6초, 최대 4스택 (=+12% Basic DMG Bonus)
    // + Concerto Energy 소모 시 일반공격 피해 +12%, 6초 (별도, 풀업타임 가정 시 가산 + 12% = +24%)
    always({ kind: 'flatStat', stat: 'normalDmgBonus', value: 0.24 }),
  ],

  // ── 5★ 시그니처 (sword — Changli) ──
  'blazing-brilliance': [
    // R1: 피해 시 Searing Feather 1스택 (0.5초 ICD), 공명스킬 시 +5스택. 최대 14스택.
    // 스택당 공명스킬 피해 +1.6% — 풀스택 14 = +22.4% Skill DMG Bonus
    always({ kind: 'flatStat', stat: 'skillDmgBonus', value: 0.224 }),
  ],

  // ── 5★ 시그니처 (broadblade — Jinhsi) ──
  'ages-of-harvest': [
    // R1: 인트로 시 Ageless Marking — 공명스킬 피해 +20%, 15초
    // 공명스킬 시 Ethereal Endowment — 공명해방 피해 +20%, 15초
    always({ kind: 'flatStat', stat: 'skillDmgBonus', value: 0.20 }),
    always({ kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.20 }),
  ],

  // ── 5★ 시그니처 (pistols — Carlotta) ──
  'the-last-dance': [
    // R1: 인트로/공명해방 시 공명스킬 피해 +24%, 16초, 최대 2스택 (=+48%)
    always({ kind: 'flatStat', stat: 'skillDmgBonus', value: 0.48 }),
  ],

  // ── 5★ 시그니처 (gauntlets — Xiangli Yao) ──
  'veritys-handle': [
    // R1: 공명해방 사용 시 공명해방 피해 +24%, 6초. 공명스킬 시 지속시간 +1초, 최대 12초
    always({ kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.24 }),
  ],

  // ── 5★ 시그니처 (gauntlets — Augusta) ──
  'thunderflare-dominion': [
    // R1: 인트로/공명스킬 시 강공격 피해 +24%, 12초. Shield 보유 시 강공격 DEF 12% 무시, 16초
    always({ kind: 'flatStat', stat: 'heavyDmgBonus', value: 0.24 }),
    always({ kind: 'defIgnore', value: 0.12 }),
  ],

  // ── 5★ 시그니처 (sword — Hiyuki, 3.3 신규) ──
  frostburn: [
    // R1: Glacio Chafe 부여 시 Glacio +28% Amplify + Liberation DEF 무시 10%
    always({ kind: 'amplify', value: 0.28, target: 'glacio', conditional: 'self applied Glacio Chafe' }),
    always({ kind: 'defIgnore', value: 0.10, skillIds: ['hiyuki-liberation-2'] }),
    // 출전(on-field) 시 Glacio Chafe 피해 +20% Amplify, 6초 (풀업타임 가정)
    // Glacio Chafe는 Glacio 데미지에 영향 — target: 'glacio'로 모델
    // 다만 위 +28% Amplify와 별개 효과이므로 별도 entry — 두 효과는 동일 카테고리 가산
  ],

  // ── 5★ 시그니처 (sword — Cartethyia) ──
  "defiers-thorn": [
    // R1: HP +16%. 인트로/일반공격 후 DEF 12% 무시. Aero Erosion 1+ 적은 추가 피해 +24%
    always({ kind: 'defIgnore', value: 0.12 }),
    always({ kind: 'amplify', value: 0.24, conditional: 'target Aero Erosion ≥1 stack' }),
  ],

  // ── 5★ 시그니처 (broadblade — Lupa) ──
  'wildfire-mark': [
    // R1: 인트로/공명해방 시 공명해방 피해 +24%, 12초. 강공격 시 지속 +3초, 최대 1회
    always({ kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.24 }),
  ],

  // ── 5★ 시그니처 (rectifier — Phoebe) ──
  'luminous-hymn': [
    // R1: Spectro Frazzle 적에게 피해 시 일반/강공격 피해 +6%, 12초, 최대 4스택 (=각 +24%)
    always({ kind: 'flatStat', stat: 'normalDmgBonus', value: 0.24 }),
    always({ kind: 'flatStat', stat: 'heavyDmgBonus', value: 0.24 }),
  ],

  // ── 5★ 시그니처 (rectifier — Cantarella) ──
  'whispers-of-sirens': [
    // R1: 인트로/일반공격 후 6초 내 에코 스킬 시 Gentle Dream, 인멸 +12%, 8초, 최대 3스택 (=+36%)
    always({ kind: 'flatStat', stat: 'havocDmgBonus', value: 0.36 }),
  ],

  // ── 5★ 시그니처 (rectifier — Phrolova) ──
  'lethean-elegy': [
    // R1: 에코 스킬 피해 후 6초 내 공명스킬 +20% + 에코 스킬 Amplify +20% + DEF 12% 무시
    always({ kind: 'flatStat', stat: 'skillDmgBonus', value: 0.20 }),
    always({ kind: 'amplify', value: 0.20, target: 'echo' }),
    always({ kind: 'defIgnore', value: 0.12 }),
  ],

  // ── 5★ 시그니처 (sword — Aemeath) ──
  'everbright-polestar': [
    // R1: Tune Rupture-Shifting / Fusion Burst 시 공명해방 32% DEF 무시 + 10% Fusion RES 무시, 8초
    // 적용 조건: Aemeath 본인 또는 팀이 Tune Rupture/Fusion Burst를 발동 가능한 빌드일 때
    // 풀업타임 가정 (Aemeath 메인 DPS 빌드)
    always({ kind: 'defIgnore', value: 0.32, skillIds: ['aemeath-liberation-2'] }),
    always({ kind: 'resPen', element: 'fusion', value: 0.10, durationSec: 8 }),
  ],

  // ── 5★ 시그니처 (pistols — Lynae) ──
  'spectrum-blaster': [
    // R1: 인트로/일반공격 적중 시 일반공격 피해 +36%, 4초 (풀업타임 가정)
    always({ kind: 'flatStat', stat: 'normalDmgBonus', value: 0.36 }),
    // Tune Rupture-Shifting / Tune Strain-Shifting 부여 시 팀 전속성 피해 +8%, 25초, 최대 3스택 (=+24%)
    // 풀스택 가정 — Lynae 메인/Tune Strain 빌드일 때만 의미. teamBuff로 처리 (외부 슬롯에 전달)
    always({ kind: 'teamBuff', stat: 'allAttributeDmgBonus', value: 0.24, durationSec: 25 }),
  ],

  // ── 5★ 시그니처 (broadblade — Chisa) ──
  kumokiri: [
    // R1: 인트로/Negative Status 부여 시 공명해방 피해 +8%, 15초, 최대 3스택 (=+24%)
    always({ kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.24 }),
    // 풀스택 시 팀이 Negative Status 부여/피해 시 전속성 피해 +24%, 15초 (teamBuff)
    always({ kind: 'teamBuff', stat: 'allAttributeDmgBonus', value: 0.24, durationSec: 15 }),
  ],

  // ── 5★ 시그니처 (gauntlets — Zani) ──
  'blazing-justice': [
    // R1: 일반공격 시 DEF 8% 무시 + Spectro Frazzle DMG +50%, 6초
    always({ kind: 'defIgnore', value: 0.08 }),
    always({ kind: 'amplify', value: 0.50, target: 'spectro', conditional: 'Spectro Frazzle target only' }),
  ],

  // ── 5★ 시그니처 (gauntlets — Luuk Herssen) ──
  "daybreakers-spine": [
    // R1: 일반공격 적중 시 회절 피해 +20%, 4초
    always({ kind: 'flatStat', stat: 'spectroDmgBonus', value: 0.20 }),
    // Tune Strain-Shifting 부여 시 일반공격 Amplify +20% + DEF 10% 무시, 6초
    always({ kind: 'amplify', value: 0.20, target: 'normal', conditional: 'after Tune Strain-Shifting' }),
    always({ kind: 'defIgnore', value: 0.10, skillIds: ['luuk-herssen-normal-0'] }),
  ],

  // ── 5★ 시그니처 (gauntlets — Roccia) ──
  tragicomedy: [
    // R1: 일반공격 또는 인트로 시 강공격 피해 보너스 +48%, 3초 (풀업타임 가정 — Roccia는 양쪽 시전 잦음)
    always({ kind: 'flatStat', stat: 'heavyDmgBonus', value: 0.48 }),
  ],

  // ── 5★ 일반(보급형, 상점 가챠 풀) — 다목적 ER 보너스류 ──
  'cosmic-ripples': [
    // R1: ER +12% (정적, weapons.json static stats) + 일반공격 피해 시 일반공격 피해 +6%,
    // 8초, 최대 4스택 (=+24% Basic DMG)
    always({ kind: 'flatStat', stat: 'normalDmgBonus', value: 0.24 }),
  ],

  'lustrous-razor': [
    // R1: ER +12% + 공명스킬 시 공명해방 피해 +12%, 10초, 최대 2스택 (=+24%)
    always({ kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.24 }),
  ],

  'abyss-surges': [
    // R1: ER +12% + 공명스킬 명중 시 일반공격 피해 +12%, 10초, 최대 2스택 (=+24%)
    always({ kind: 'flatStat', stat: 'normalDmgBonus', value: 0.24 }),
  ],

  'emerald-of-genesis': [
    // R1: ER +12% + 공명스킬 명중 시 ATK +12%, 8초, 최대 2스택 (=+24% ATK)
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.24 }),
  ],

  // ── 5★ 시그니처 — 추가분 ──

  // (sword — Qiuyuan)
  'emerald-sentence': [
    // R1: 인트로/일반공격 후 10초 내 Echo Skill 시 Bamboo Cleaver 1스택, 스택당 +30% 강공격 피해 보너스, 12초, 최대 2스택 (=+60%)
    always({ kind: 'flatStat', stat: 'heavyDmgBonus', value: 0.60 }),
  ],

  // (gauntlets — Iuno)
  "moongazers-sigil": [
    // R1: 인트로/공명해방 시 공명해방 피해 +20%, 15초 (인트로 시 즉시 풀스택, 3초)
    always({ kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.20 }),
    // Shield 보유 시 공명해방 DEF 무시 +7.2% × 최대 5스택 = +36% (공명해방 한정)
    // 풀스택 유지 가정 (실드 보유 빌드)
    always({ kind: 'defIgnore', value: 0.36, skillIds: ['iuno-liberation-2'] }),
  ],

  // (gauntlets — Sigrika)
  'solsworn-ciphers': [
    // R1: 인트로/Echo Skill 시 +32% Echo Skill DMG Amplify, 15초
    always({ kind: 'amplify', value: 0.32, target: 'echo' }),
    // Echo Skill 시 Aero DMG DEF 무시 +10%, 6초 (Aero 한정 — 시그리카 본인이 Aero라 항상 적용)
    always({ kind: 'defIgnore', value: 0.10 }),
  ],

  // (pistols — Ciaccona)
  'woodland-aria': [
    // R1: Aero Erosion 부여 시 Aero DMG +20%, 10초
    always({ kind: 'flatStat', stat: 'aeroDmgBonus', value: 0.20 }),
    // Aero Erosion 적 명중 시 Aero RES -12%, 20초
    always({ kind: 'resPen', element: 'aero', value: 0.12, durationSec: 20 }),
  ],

  // (pistols — Galbrena) — note: weapons.json ID uses '&' literal
  'lux-&-umbra': [
    // R1: Echo Skill 피해 시 +24% Heavy Attack DMG Amplify, 6초
    always({ kind: 'amplify', value: 0.24, target: 'heavy' }),
    // Heavy 피해 시 +24% Echo Skill DMG Amplify, 6초
    always({ kind: 'amplify', value: 0.24, target: 'echo' }),
    // 두 효과 동시 활성 시 DEF 무시 +8% (풀업타임 가정)
    always({ kind: 'defIgnore', value: 0.08 }),
  ],

  // (sword — Brant)
  'unflickering-valor': [
    // R1: 공명해방 시 일반공격 피해 +24%, 10초 + 일반공격 피해 시 +24% 일반공격 피해, 4초
    // 두 효과는 동시 활성 시 가산 (실제로는 stacking up to 1 time per source, 풀업타임 가정)
    always({ kind: 'flatStat', stat: 'normalDmgBonus', value: 0.48 }),
  ],

  // (rectifier — Shorekeeper)
  'stellar-symphony': [
    // R1: HP +12% (static, weapons.json) + Heal Skill 시 nearby team ATK +14%, 30초
    always({ kind: 'teamBuff', stat: 'atkPercent', value: 0.14, durationSec: 30 }),
  ],

  // (broadblade — Mornye)
  'starfield-calibrator': [
    // R1: DEF +16% (static) + Heal 시 nearby team Crit DMG +20%, 4초
    always({ kind: 'teamBuff', stat: 'critDmg', value: 0.20, durationSec: 4 }),
  ],

  // (rectifier — Zhezhi)
  'rime-draped-sprouts': [
    // R1: 공명스킬 시 일반공격 피해 +12%, 6초, 최대 3스택 (=+36%, 풀스택 가정)
    always({ kind: 'flatStat', stat: 'normalDmgBonus', value: 0.36 }),
    // 추가: 3스택 도달 시 Outro로 소모 — off-field에서 일반공격 피해 +52%, 27초
    // off-field 적용 (지지/서브 빌드일 때)
    offField({ kind: 'flatStat', stat: 'normalDmgBonus', value: 0.52 }),
  ],

  // ── 4★ 보급형 (자주 사용되는 비-시그니처) ──
  'helios-cleaver': [
    // R1: 공명스킬 후 12초간 2초마다 ATK +3%, 최대 4스택 (=+12% ATK)
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.12 }),
  ],

  'hollow-mirage': [
    // R1: 공명해방 시 Iron Armor 3스택, 스택당 ATK +3% + DEF +3% (피격 시 1스택 소모)
    // 풀스택 가정 — 회피 위주 빌드에서 풀스택 유지 가능
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.09 }),
    always({ kind: 'flatStat', stat: 'defPercent', value: 0.09 }),
  ],

  stonard: [
    // R1: 공명스킬 시 공명해방 피해 +18%, 15초
    always({ kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.18 }),
  ],

  autumntrace: [
    // R1: 일반/강공격 시 ATK +4%, 7초, 최대 5스택 (=+20% ATK)
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.20 }),
  ],

  'commando-of-conviction': [
    // R1: 인트로 후 ATK +15%, 15초
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.15 }),
  ],

  thunderbolt: [
    // R1: 일반/강공격 명중 시 공명스킬 피해 +7%, 10초, 최대 3스택 (=+21%)
    always({ kind: 'flatStat', stat: 'skillDmgBonus', value: 0.21 }),
  ],

  augment: [
    // R1: 공명해방 후 ATK +15%, 15초
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.15 }),
  ],

  lumingloss: [
    // R1: 공명스킬 시 일반공격 + 강공격 피해 보너스 +20%, 10초 (1스택)
    always({ kind: 'flatStat', stat: 'normalDmgBonus', value: 0.20 }),
    always({ kind: 'flatStat', stat: 'heavyDmgBonus', value: 0.20 }),
  ],

  // ── 4★ 추가 보급형 ──
  'solar-flame': [
    // R1: 일반/강공격 시 ATK +2.2%, 강공격 피해 +2.2%, 7초, 최대 4스택 (=+8.8% ATK + +8.8% 강공격)
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.088 }),
    always({ kind: 'flatStat', stat: 'heavyDmgBonus', value: 0.088 }),
  ],

  'jinzhou-keeper': [
    // R1: 인트로 후 ATK +8% + HP +10%, 15초
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.08 }),
    always({ kind: 'flatStat', stat: 'hpPercent', value: 0.10 }),
  ],

  'lunar-cutter': [
    // R1: 전장 진입 시 Oath 6스택, 스택당 ATK +2% (=+12% ATK 풀스택). 2초마다 1스택 소모
    // 풀업타임 가정 (적 처치 시 풀스택 복구)
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.12 }),
  ],

  'dauntless-evernight': [
    // R1: 인트로 시 ATK +8% + DEF +15%, 15초
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.08 }),
    always({ kind: 'flatStat', stat: 'defPercent', value: 0.15 }),
  ],

  'endless-collapse': [
    // R1: 공명스킬 시 ER +6 + ATK +10%, 16초 (20초 쿨)
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.10 }),
  ],

  'oceans-gift': [
    // R1: Spectro Frazzle 적 피해 시 회절 피해 +6%, 1초당 1스택, 6초, 최대 4스택 (=+24%)
    always({ kind: 'flatStat', stat: 'spectroDmgBonus', value: 0.24 }),
  ],

  // ── 4★ 추가 (Battle Pass / gacha 풀 보급형) ──
  'aether-strike': [
    // R1: 공명해방 시 ATK +7.2% + Resonance Liberation DMG +10.8%, 15초
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.072 }),
    always({ kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.108 }),
  ],

  'aureate-zenith': [
    // R1: 공명해방 시 ATK +7.2% + Heavy Attack DMG +10.8%, 15초
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.072 }),
    always({ kind: 'flatStat', stat: 'heavyDmgBonus', value: 0.108 }),
  ],

  'amity-accord': [
    // R1: 인트로 시 Resonance Liberation DMG +20%, 15초
    always({ kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.20 }),
  ],

  'undying-flame': [
    // R1: 인트로 시 Resonance Skill DMG +20%, 15초
    always({ kind: 'flatStat', stat: 'skillDmgBonus', value: 0.20 }),
  ],

  'feather-edge': [
    // R1: 공명해방 시 ATK +7.2% + Resonance Liberation DMG +10.8%, 15초
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.072 }),
    always({ kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.108 }),
  ],

  'romance-in-farewell': [
    // R1: Negative Status 적 피해 시 ATK +4%, 10초, 최대 4스택 (=+16% ATK, 풀스택 가정)
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.16 }),
  ],

  // ── Deep Sky Blazar 시리즈 — 공명스킬 시 ER +6 + ATK +10%, 16초 (모두 동일 R1 값) ──
  'fusion-accretion': [
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.10 }),
  ],
  'celestial-spiral': [
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.10 }),
  ],
  'relativistic-jet': [
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.10 }),
  ],
  'waning-redshift': [
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.10 }),
  ],

  // ── Negative Status 시리즈 — 풀스택 +16% ATK (R1) ──
  'meditations-on-mercy': [
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.16 }),
  ],
  'legend-of-drunken-hero': [
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.16 }),
  ],
  'fables-of-wisdom': [
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.16 }),
  ],
  'waltz-in-masquerade': [
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.16 }),
  ],

  // ── Concerto Energy 시리즈 (유틸 4★ — 데미지 stat 영향 없음, 빈 효과로 등록) ──
  discord: [],
  marcato: [],
  cadenza: [],
  variation: [],
  overture: [],

  // ── 자유 4★ ──
  novaburst: [
    // R1: 대시/회피 후 ATK +4%, 8초, 최대 3스택 (=+12% ATK 풀스택)
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.12 }),
  ],

  'radiant-dawn': [
    // R1: 공명스킬 시 ATK +9% + 일반공격 피해 +9%, 10초
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.09 }),
    always({ kind: 'flatStat', stat: 'normalDmgBonus', value: 0.09 }),
  ],

  'somnoire-anchor': [
    // R1: 피해 시 Hiss 1스택, 스택당 ATK +2%, 3초, 최대 10스택 (=+20% ATK)
    // 10스택 도달 시 추가 Crit Rate +6%
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.20 }),
    always({ kind: 'flatStat', stat: 'critRate', value: 0.06 }),
  ],

  // ── 자유 4★ (스토리/이벤트 보상) ──
  'broadblade#41': [
    // R1: HP > 80% 시 ATK +12%
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.12 }),
  ],

  'gauntlets#21d': [
    // R1: 대시/회피 시 ATK +8%, 8초 + Dodge Counter DMG +50%
    // Dodge Counter는 별도 attackType 미모델 — flatStat ATK만 적용
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.08 }),
  ],

  'pistols#26': [
    // R1: 피격 없을 시 5초마다 ATK +6%, 8초, 최대 2스택 (=+12% ATK 풀스택)
    always({ kind: 'flatStat', stat: 'atkPercent', value: 0.12 }),
  ],

  'rectifier#25': [
    // R1: 공명스킬 시 HP < 50% 자가 회복 — 데미지 stat 영향 없음
    // (utility — 빈 효과로 등록)
  ],

  'sword#18': [
    // R1: HP < 40% 시 강공격 피해 +18% (조건부 — 저HP 빌드)
    // 풀업타임 가정으로 등록 (실제론 조건 충족 시만 적용)
    always({ kind: 'flatStat', stat: 'heavyDmgBonus', value: 0.18 }),
  ],

  // ── 힐러 4★ (Healing Bonus만 — DPS 직접 영향 없음, 빈 효과로 등록) ──
  'comet-flare': [],
  'call-of-the-abyss': [],
};
