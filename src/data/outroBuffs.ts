// src/data/outroBuffs.ts
import type { AmplifyTarget, StatType } from '@/types/game';

/**
 * 캐릭터별 아웃트로 스킬 버프 데이터
 *
 * 아웃트로 → 다음 등장 공명자에게 적용되는 버프
 * - statBuffs: 가산 카테고리 (ATK%, 속성/공격타입 DMG Bonus)
 * - dmgAmplify: 곱연산 증폭 (Deepen — "디펜" 또는 "피해 증폭"). 'all' 카테고리 가정.
 * - amplifyByCategory: attack-type/element 한정 Deepen (산화 기본공격 디펜, 음림 공명해방+전도 디펜 등).
 *   설정 시 dmgAmplify는 사용되지 않고 본 배열만 합산된다.
 * - duration === 0 이면 지속 시간 불명 또는 즉발 피해형. 계산에 적용되지 않는다.
 *
 * 데이터 갭 항목은 `docs/data-gaps.md`에 추적 ID로 매핑된다.
 */
export interface OutroBuff {
  characterId: string;
  /** 스탯 보너스 (가산 — ATK%, DMG Bonus 등) */
  statBuffs: { type: StatType; value: number }[];
  /** Deepen 증폭 — 'all' 카테고리 가정 (모든 피해에 적용) */
  dmgAmplify: number;
  /** 카테고리별 Deepen (attack-type/element 한정). 설정 시 dmgAmplify를 대체한다. */
  amplifyByCategory?: { target: AmplifyTarget; value: number }[];
  /** 지속 시간 (초). 0이면 즉발 피해형 또는 지속시간 미확정 */
  duration: number;
  description: Record<string, string>;
}

export const OUTRO_BUFFS: Record<string, OutroBuff> = {
  // ── 용융 (Fusion) ──
  aemeath: {
    characterId: 'aemeath',
    statBuffs: [],
    dmgAmplify: 0.10,
    duration: 20,
    description: {
      ko: '"보이지 않는 기다림" Harmony 모드: 파티(에이메스 제외) 피해 +10%, 20초 (조화 분기 부여 시 +20%). Flame 모드: 동일 +10%, Flame Effect 부여 시 +20%',
      en: 'Outro: Harmony mode — party (excl. Aemeath) DMG +10%, 20s (+20% on Harmony Disruption). Flame mode — DMG +10% (+20% on Flame Effect)',
    },
  },
  brant: {
    characterId: 'brant',
    statBuffs: [
      { type: 'fusionDmgBonus', value: 0.20 },
      { type: 'skillDmgBonus', value: 0.25 },
    ],
    dmgAmplify: 0,
    duration: 14,
    description: {
      ko: '"항로 확정!" 다음 공명자 용융 피해 +20% + 공명스킬 피해 +25%, 14초',
      en: '"The Course is Set!" next resonator Fusion DMG +20% + Resonance Skill DMG +25%, 14s',
    },
  },
  changli: {
    characterId: 'changli',
    statBuffs: [
      { type: 'fusionDmgBonus', value: 0.20 },
      { type: 'liberationDmgBonus', value: 0.25 },
    ],
    dmgAmplify: 0,
    duration: 10,
    description: {
      ko: '"끊이지 않는 전법" 다음 공명자 용융 피해 +20% + 공명해방 피해 +25%, 10초 또는 교체 전까지',
      en: 'Next resonator Fusion DMG +20% + Liberation DMG +25%, 10s or until swap',
    },
  },
  chixia: {
    characterId: 'chixia',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: {
      ko: '데이터 갭 — docs/data-gaps.md RC-02 참조',
      en: 'Data gap — see docs/data-gaps.md RC-02',
    },
  },
  encore: {
    characterId: 'encore',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 6,
    description: {
      ko: '아웃트로 6초간 광역 용융 피해 (피해형). ※ 영문 공식명은 출처에 명시 미확인 — "Cosmos Rave"는 정정 가능성',
      en: 'Outro: 6s AoE Fusion DMG (damage-type). Official English name pending verification',
    },
  },
  galbrena: {
    characterId: 'galbrena',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: {
      ko: '"섬멸의 추격" ATK의 79.5%×3 + 556.5% 용융 피해 (피해형)',
      en: 'Outro: 79.5%×3 + 556.5% ATK Fusion damage (damage-type)',
    },
  },
  lupa: {
    characterId: 'lupa',
    statBuffs: [
      { type: 'fusionDmgBonus', value: 0.20 },
      { type: 'normalDmgBonus', value: 0.25 },
    ],
    dmgAmplify: 0,
    duration: 14,
    description: {
      ko: '"함께 싸우자 파트너!" 다음 공명자 용융 피해 +20% + 일반공격 피해 +25%, 14초',
      en: 'Outro: next resonator Fusion DMG +20% + Basic Attack DMG +25%, 14s (English official name pending)',
    },
  },
  mornye: {
    characterId: 'mornye',
    statBuffs: [],
    dmgAmplify: 0.25,
    duration: 30,
    description: {
      ko: '"리커젼" 파티 전체 전속성 피해 증폭 +25%, 30초',
      en: '"Recursion" all team Resonators gain 25% All DMG Amplification, 30s',
    },
  },

  // ── 응결 (Glacio) ──
  carlotta: {
    characterId: 'carlotta',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: {
      ko: '"연설" 아웃트로 종료 시 Kaleidoscope Sparks 추가 타격 ATK의 1032.18% 응결 피해 (피해형). 다음 공명자 응결/공명스킬 피해 강화 (수치·지속시간 데이터 갭)',
      en: '"Closing Remark" outro: Kaleidoscope Sparks bonus strike (1032.18% ATK Glacio, damage-type). Next resonator Glacio/Skill DMG enhanced (values/duration unconfirmed)',
    },
  },
  lingyang: {
    characterId: 'lingyang',
    statBuffs: [{ type: 'glacioDmgBonus', value: 0.20 }],
    dmgAmplify: 0,
    duration: 30,
    description: {
      ko: '다음 공명자 응결 피해 +20%, 30초 (공명해방 피해 +50%는 14초 윈도우 — 본 데이터에는 미반영)',
      en: 'Next resonator Glacio DMG +20%, 30s (additional Liberation DMG +50% for 14s window — not modeled here)',
    },
  },
  youhu: {
    characterId: 'youhu',
    statBuffs: [{ type: 'coordinatedDmgBonus', value: 1.00 }],
    dmgAmplify: 0,
    duration: 28,
    description: {
      ko: '"Heart of Antiquity" 다음 공명자 공조 공격 피해 +100%, 28초',
      en: '"Heart of Antiquity" next resonator Coordinated Attack DMG +100%, 28s',
    },
  },

  // ── 기류 (Aero) ──
  cartethyia: {
    characterId: 'cartethyia',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: {
      ko: '"폭풍에 실린 축복" 파티 내 카르티시아/플뢰르 드 리스 외 다른 등장 캐릭터가 「이상 효과」 보유 적에게 입히는 기류 피해 +17.5%',
      en: 'Outro: other team Resonators (excl. Cartethyia/Fleurdelys) deal +17.5% Aero DMG vs targets with anomaly status',
    },
  },
  iuno: {
    characterId: 'iuno',
    statBuffs: [{ type: 'heavyDmgBonus', value: 0.50 }],
    dmgAmplify: 0,
    duration: 14,
    description: {
      ko: '다음 공명자 강공격 피해 강화 +50%, 14초',
      en: 'Next resonator Heavy Attack DMG +50%, 14s',
    },
  },
  jiyan: {
    characterId: 'jiyan',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 8,
    description: {
      ko: '"극기의 각오" 다음 공명자 강공격 시 기염이 협동 공격, ATK의 313.40% 기류 피해, 8초 (매초 1회, 최대 2회)',
      en: '"Windborne" next resonator Heavy Attacks trigger Jiyan coordinated dragon strike, 313.40% ATK Aero DMG, 8s (1×/s, max 2)',
    },
  },
  qiuyuan: {
    characterId: 'qiuyuan',
    statBuffs: [{ type: 'echoSkillDmgBonus', value: 0.50 }],
    dmgAmplify: 0,
    duration: 14,
    description: {
      ko: '다음 공명자 에코 스킬 피해 +50% (지속시간 추정 14초 — 출처 미확정)',
      en: 'Next resonator Echo Skill DMG +50% (duration ~14s estimated — source unconfirmed)',
    },
  },
  'rover-aero': {
    characterId: 'rover-aero',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: {
      ko: '"Eroding Form" 다음 공명자 공격이 적 명중 시 Aero Erosion 스택 +3 (상태 부여 — 직접 피해 버프 아님)',
      en: '"Eroding Form" next resonator inflicts +3 Aero Erosion stacks on hit (status — not a direct DMG buff)',
    },
  },
  sigrika: {
    characterId: 'sigrika',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: {
      ko: '"지금 이 순간" ATK의 795% 기류 피해 (피해형) + 파티 Encapsulated 2스택 부여, 30초',
      en: '"In This Very Moment" 795% ATK Aero damage + party gains 2 stacks of Encapsulated, 30s',
    },
  },

  // ── 전도 (Electro) ──
  augusta: {
    characterId: 'augusta',
    statBuffs: [{ type: 'atkPercent', value: 0.20 }],
    dmgAmplify: 0,
    duration: 30,
    description: {
      ko: '"불굴의 군가" 다음 등장 공명자 전속성 피해 +15%, 14초 + 아우구스타에게 위협/만민의 염원/영광의 왕관 1스택씩 부여 (※ 영문 공식명은 Battlesong of the Unyielding — WuCalc_06의 "Stride of Goldenflare"는 정정됨)',
      en: '"Battlesong of the Unyielding" next resonator gains 15% All-Attr DMG Amplification, 14s + Augusta gains 1 stack each of Majesty / Crown of Wills',
    },
  },
  buling: {
    characterId: 'buling',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: {
      ko: 'Five Thunders Spell Array 활성 중 팀원이 인트로 시 활성 공명자에게 DMG 버프 (수치 데이터 갭 — RC-14)',
      en: 'During Five Thunders Spell Array, team intros grant DMG buff to active resonator (values unconfirmed — RC-14)',
    },
  },
  calcharo: {
    characterId: 'calcharo',
    statBuffs: [{ type: 'electroDmgBonus', value: 0.20 }],
    dmgAmplify: 0,
    duration: 30,
    description: {
      ko: '"그림자의 기습" 다음 공명자 전도 피해 +20%, 30초',
      en: '"Shadowy Raid" next resonator Electro DMG +20%, 30s',
    },
  },
  lumi: {
    characterId: 'lumi',
    statBuffs: [],
    dmgAmplify: 0,
    amplifyByCategory: [{ target: 'skill', value: 0.38 }],
    duration: 10,
    description: {
      ko: '"호송" 다음 공명자 공명스킬 피해 +38%, 10초 (※ WuCalc_06의 ATK +22.5% 표기는 영문 출처 미확인 — 정정 후 위키 확인 시 추가)',
      en: '"Escort" next resonator Resonance Skill DMG +38%, 10s (English official name pending verification)',
    },
  },
  'xiangli-yao': {
    characterId: 'xiangli-yao',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 8,
    description: {
      ko: '"연쇄 법칙" 다음 공명자가 일반공격으로 명중한 첫 적에게 ATK의 237.63% 전도 피해 (광역), 8초 지속, 2초당 1회, 최대 3회 (공조 공격형)',
      en: '"Chain Rule" laser strike on first basic-attack target: 237.63% ATK Electro AoE × up to 3 over 8s (coordinated-type)',
    },
  },
  yuanwu: {
    characterId: 'yuanwu',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: {
      ko: '적 Vibration Strength 약화 → 진동 게이지 브레이크 가속 (수치 데이터 갭 — RC-19)',
      en: 'Reduces enemy Vibration Strength → break gauge acceleration (values unconfirmed — RC-19)',
    },
  },

  // ── 회절 (Spectro) ──
  jinhsi: {
    characterId: 'jinhsi',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 20,
    description: {
      ko: '"시간의 통제(Temporal Bender)" 20초간 팀원이 Incandescence 생성하는 원소당 주기 3초→1초로 단축 (자원 가속 — 직접 피해 버프 아님)',
      en: '"Temporal Bender" 20s: team Incandescence generation cycle 3s→1s per element (resource acceleration — not a direct DMG buff)',
    },
  },
  'luuk-herssen': {
    characterId: 'luuk-herssen',
    statBuffs: [],
    dmgAmplify: 0.10,
    duration: 15,
    description: {
      ko: '"죽음으로 내린 답" 루크·헤르센 ATK의 500% 회절 피해 (피해형). 다음 공명자 전속성 피해 증폭 +10%, 15초',
      en: '"Bow to the Last Light" 500% ATK Spectro damage. Next resonator All-Attr DMG Amplify +10%, 15s',
    },
  },
  lynae: {
    characterId: 'lynae',
    statBuffs: [{ type: 'liberationDmgBonus', value: 0.25 }],
    dmgAmplify: 0.15,
    duration: 0,
    description: {
      ko: '다음 공명자 전속성 피해 증폭 +15% + 공명해방 피해 +25% (지속시간 데이터 갭)',
      en: 'Next resonator All-Attr DMG Amplify +15% + Liberation DMG +25% (duration unconfirmed)',
    },
  },
  phoebe: {
    characterId: 'phoebe',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: {
      ko: '"경청하는 마음" 주변 목표에 ATK의 528.41% 회절 피해. 사죄 상태 시 피해 +255%, 고해 상태 시 파티 「묵념」 효과 (회절 RES 감소 + 광학 효과 피해 증폭)',
      en: 'Outro 528.41% ATK Spectro damage to nearby targets. Absolution: DMG +255%. Confession: party gains Silent Prayer (Spectro RES -, Optical Effect amplify)',
    },
  },
  'rover-spectro': {
    characterId: 'rover-spectro',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 3,
    description: {
      ko: '온필드 캐릭 주위 3초 시간 정지 필드 (CC형 — 직접 피해 버프 아님)',
      en: '3s time-stop field around active char (CC-type — not a direct DMG buff)',
    },
  },
  zani: {
    characterId: 'zani',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: {
      ko: '다음 공명자 적 회절 저항 -10% + 회절 Frazzle 피해 증폭 +100% (Frazzle 적 한정 — 상태 의존, Phase 2에서 모델링)',
      en: 'Next resonator: enemy Spectro RES -10% + Spectro Frazzle DMG Amplify +100% (Frazzle-conditional — modeled in Phase 2)',
    },
  },

  // ── 인멸 (Havoc) ──
  camellya: {
    characterId: 'camellya',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: {
      ko: '"뒤엉킨 넝쿨" 강화 시 ATK의 459.02% 추가 인멸 피해 (피해형)',
      en: '"Twining" enhanced: 459.02% ATK additional Havoc damage (damage-type)',
    },
  },
  chisa: {
    characterId: 'chisa',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: {
      ko: '데이터 갭 — docs/data-gaps.md RC-26 참조',
      en: 'Data gap — see docs/data-gaps.md RC-26',
    },
  },
  phrolova: {
    characterId: 'phrolova',
    statBuffs: [
      { type: 'havocDmgBonus', value: 0.20 },
      { type: 'heavyDmgBonus', value: 0.25 },
    ],
    dmgAmplify: 0,
    duration: 14,
    description: {
      ko: '"미완의 멜로디" 다음 공명자 인멸 피해 +20% + 강공격 피해 +25%, 14초',
      en: 'Outro: next resonator Havoc DMG +20% + Heavy Attack DMG +25%, 14s',
    },
  },
  roccia: {
    characterId: 'roccia',
    statBuffs: [
      { type: 'normalDmgBonus', value: 0.25 },
      { type: 'havocDmgBonus', value: 0.20 },
    ],
    dmgAmplify: 0,
    duration: 14,
    description: {
      ko: '"뜨거운 박수" 다음 공명자 인멸 피해 +20% + 일반공격 피해 +25%, 14초 (※ ATK +20%/22초 표기는 wuthering.gg KR 확인 결과 미일치 — 정정)',
      en: '"Heated Applause" next resonator Havoc DMG +20% + Basic ATK DMG +25%, 14s',
    },
  },
  'rover-havoc': {
    characterId: 'rover-havoc',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 6,
    description: {
      ko: '아웃트로 종료 시 ATK의 143.3% × 2초 간격, 6초 (피해형)',
      en: 'Outro end: 143.3% ATK every 2s for 6s (damage-type)',
    },
  },

  // ── 기존 등록분 (서포터/서브 딜러) ──
  sanhua: {
    characterId: 'sanhua',
    statBuffs: [],
    dmgAmplify: 0,
    amplifyByCategory: [{ target: 'normal', value: 0.38 }],
    duration: 14,
    description: { ko: '기본공격 디펜 38% 14초 (basic attack only)', en: 'Basic ATK Deepen 38% 14s (basic only)' },
  },
  verina: {
    characterId: 'verina',
    statBuffs: [],
    dmgAmplify: 0.15,
    duration: 30,
    description: { ko: '모든 피해 디펜 15% 30초', en: 'All DMG Deepen 15% 30s' },
  },
  yinlin: {
    characterId: 'yinlin',
    statBuffs: [],
    dmgAmplify: 0,
    amplifyByCategory: [
      { target: 'electro', value: 0.20 },
      { target: 'liberation', value: 0.25 },
    ],
    duration: 14,
    description: {
      ko: '"전기의 편달" 다음 공명자 전도 피해 증폭 +20%, 공명해방 피해 증폭 +25%, 14초',
      en: '"Strategist" next resonator Electro DMG Amplify +20%, Liberation DMG Amplify +25%, 14s',
    },
  },
  shorekeeper: {
    characterId: 'shorekeeper',
    statBuffs: [],
    dmgAmplify: 0.15,
    duration: 30,
    description: { ko: '모든 피해 디펜 15% 30초 (에너지충전 기반 크리 버프 별도)', en: 'All DMG Deepen 15% 30s (ER-based crit buff separate)' },
  },
  baizhi: {
    characterId: 'baizhi',
    statBuffs: [],
    dmgAmplify: 0.15,
    duration: 30,
    description: { ko: '모든 피해 디펜 15% 30초', en: 'All DMG Deepen 15% 30s' },
  },
  jianxin: {
    characterId: 'jianxin',
    statBuffs: [{ type: 'liberationDmgBonus', value: 0.38 }],
    dmgAmplify: 0,
    duration: 14,
    description: {
      ko: '다음 공명자 공명해방 피해 강화 +38%, 14초 (기존 ATK +15% 표기 정정 — Game8/Prydwen)',
      en: 'Next resonator Liberation DMG +38%, 14s (corrected from ATK +15% — Game8/Prydwen)',
    },
  },
  mortefi: {
    characterId: 'mortefi',
    statBuffs: [{ type: 'heavyDmgBonus', value: 0.38 }],
    dmgAmplify: 0,
    duration: 14,
    description: { ko: '강공격 피해 +38% 14초 + 협동공격', en: 'Heavy ATK DMG +38% 14s + coordinated attacks' },
  },
  danjin: {
    characterId: 'danjin',
    statBuffs: [],
    dmgAmplify: 0,
    amplifyByCategory: [{ target: 'havoc', value: 0.23 }],
    duration: 14,
    description: { ko: '인멸 디펜 23% 14초 (수치 추정 — docs/data-gaps.md RC-27)', en: 'Havoc Deepen 23% 14s (estimated — RC-27)' },
  },
  zhezhi: {
    characterId: 'zhezhi',
    statBuffs: [
      { type: 'glacioDmgBonus', value: 0.20 },
      { type: 'skillDmgBonus', value: 0.25 },
    ],
    dmgAmplify: 0,
    duration: 14,
    description: {
      ko: '"글레이징 기법" 다음 공명자 응결 피해 +20% + 공명스킬 피해 +25%, 14초 (※ 영문 공식명은 출처 미공개 — "Sketch of Renown"은 정정 가능성)',
      en: 'Outro next resonator Glacio DMG +20% + Skill DMG +25%, 14s (English official name unconfirmed — "Sketch of Renown" pending verification)',
    },
  },
  cantarella: {
    characterId: 'cantarella',
    statBuffs: [
      { type: 'havocDmgBonus', value: 0.20 },
      { type: 'skillDmgBonus', value: 0.25 },
    ],
    dmgAmplify: 0,
    duration: 14,
    description: {
      ko: '"부드러운 촉수" 다음 공명자 인멸 피해 +20% + 공명스킬 피해 +25%, 14초',
      en: '"Gentle Tentacles" next resonator Havoc DMG +20% + Skill DMG +25%, 14s',
    },
  },
  ciaccona: {
    characterId: 'ciaccona',
    statBuffs: [{ type: 'atkPercent', value: 0.25 }],
    dmgAmplify: 0.12,
    duration: 30,
    description: { ko: '공격력 +25%, 모든 피해 디펜 12% 30초', en: 'ATK +25%, All DMG Deepen 12% 30s' },
  },
  aalto: {
    characterId: 'aalto',
    statBuffs: [{ type: 'aeroDmgBonus', value: 0.23 }],
    dmgAmplify: 0,
    duration: 14,
    description: { ko: '기류 피해 +23% 14초', en: 'Aero DMG +23% 14s' },
  },
  yangyang: {
    characterId: 'yangyang',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: { ko: '공명 에너지 4 회복 (자원형 — 직접 피해 버프 아님)', en: 'Restore 4 Resonance Energy (resource-type — not a DMG buff)' },
  },
  taoqi: {
    characterId: 'taoqi',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: { ko: '방어 강화 + 반격 (실드/탱커형 — 데이터 갭 RC-31)', en: 'Fortified Defense + counter (shield/tank-type — gap RC-31)' },
  },

  // ── 3.3 신규 캐릭터 (히유키) ──
  hiyuki: {
    characterId: 'hiyuki',
    statBuffs: [],
    dmgAmplify: 0,
    duration: 0,
    description: {
      ko: '아웃트로 효과 데이터 갭 — 출시 후 인게임 직접 확인 또는 1차 출처 등장 시 갱신',
      en: 'Outro effect — data gap, pending in-game verification or primary source confirmation',
    },
  },

};
