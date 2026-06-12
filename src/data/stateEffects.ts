// src/data/stateEffects.ts
import type { StateMechanic } from '@/types/game';

/**
 * 캐릭터별 상태/스택 메커니즘 — 풀스택/풀모드 가정으로 정량 효과 등록.
 *
 * 출처: WuCalc_06_캐릭터별_딜계산_데이터.md
 * - 본 데이터는 1차 시뮬레이션(풀업타임 가정) 계산에서 항상 적용된다.
 * - `perStackEffect`의 정량 효과는 1스택 기준 — 실제 적용 시 `defaultAssumedStacks`만큼 곱해 누적한다.
 * - `fullStackEffect`는 풀스택 도달 시 추가로 활성화되는 모드/스킬 보너스.
 *
 * 단일 캐릭터가 복수 상태를 보유하는 경우(예: 갈브레나 Afterflame + Sinflame,
 * 젠니 Blaze + Heliacal Ember)는 배열에 별도 항목으로 등록한다.
 */
export const STATE_MECHANICS: Record<string, StateMechanic[]> = {
  // ── 3.3 신규 — 히유키 ──
  hiyuki: [
    {
      characterId: 'hiyuki',
      stateName: { ko: '눈의 침식', en: 'Snow Rust' },
      description: {
        ko: '팀이 「서리 효과(Glacio Chafe)」 또는 「암흑 효과(Havoc Bane)」 부여 시 1스택 (최대 3). 풀스택 시 자신 크리피해 +40% + 「냉해 효과」 총 +60%',
        en: 'Team applies Glacio Chafe or Havoc Bane → 1 stack (max 3). Full stack: self Crit DMG +40% + total Glacio Bite +60%',
      },
      maxStacks: 3,
      defaultAssumedStacks: 3,
      perStackEffect: [],
      fullStackEffect: [
        { kind: 'flatStat', stat: 'critDmg', value: 0.40 },
        { kind: 'amplify', value: 0.60, target: 'glacio', conditional: 'Glacio Bite target only' },
      ],
    },
    {
      characterId: 'hiyuki',
      stateName: { ko: '서리 단조', en: 'Snowforged Blade' },
      description: {
        ko: 'Forte 게이지 (최대 3스택). 강공격 「서리 나무 · 망각의 자아(Heavy Attack Bitterfrost: Foreclaimed Self)」 시전마다 1스택 획득. 공명해방 「끌어온 내 가능성: 검의 봉인(Foreclaiming: Blade Liberation)」 발동 시 3스택 보유 중이면 모두 소모, 그 외엔 소모 안 함. 소모된 1pt당 해당 공격 배율 증가. (스택 ≤3, Skill Scaling Bonus 카테고리)',
        en: 'Forte gauge (max 3 stacks). +1 stack per Heavy Attack - Bitterfrost: Foreclaimed Self cast. Foreclaiming: Blade Liberation consumes all 3 if held, otherwise no consume. Per consumed pt: DMG multiplier of that attack increases (Skill Scaling Bonus category)',
      },
      maxStacks: 3,
      defaultAssumedStacks: 3,
      perStackEffect: [
        { kind: 'skillScaling', skillId: 'hiyuki-liberation-2', bonus: 4.00 },
      ],
    },
  ],

  camellya: [
    {
      characterId: 'camellya',
      stateName: { ko: '붉은 동백꽃 · 꽃술', en: 'Crimson Bud' },
      description: {
        ko: 'Forte Crimson Pistil 소비 시 획득. 10 Bud 소비 시 Sweet Dream 배율 +5% (풀스택 10 = +50% Skill Scaling Bonus)',
        en: 'Gained on Forte Crimson Pistil consume. Per 10 Bud consumed: Sweet Dream scaling +5% (max 10 Bud = +50%)',
      },
      maxStacks: 10,
      defaultAssumedStacks: 10,
      perStackEffect: [
        { kind: 'skillScaling', skillId: 'camellya-skill-4', bonus: 0.05 },
      ],
    },
  ],

  cartethyia: [
    {
      characterId: 'cartethyia',
      stateName: { ko: '풍식 효과', en: 'Aero Erosion' },
      description: {
        ko: '카르티시아·Fleurdelys 변신·공명스킬로 적에게 부여. 부여 자체로 모든 피해 +30%, 3스택 초과 시 1스택당 추가 +10% (6스택 풀 +60%)',
        en: 'Applied via Cartethyia/Fleurdelys transformations. Base +30% Amplify; above 3 stacks: +10%/stack (max 6 stacks = +60% total)',
      },
      maxStacks: 6,
      defaultAssumedStacks: 6,
      perStackEffect: [],
      fullStackEffect: [
        { kind: 'amplify', value: 0.60, conditional: 'target Aero Erosion 6 stacks' },
      ],
    },
  ],

  galbrena: [
    {
      characterId: 'galbrena',
      stateName: { ko: '남은 불꽃', en: 'Afterflame' },
      description: {
        ko: 'Forte 잔염 자원 (최대 40). 1점당 Demon Hypostasis 변환 스킬 피해 +1.5% (풀스택 +60% Skill Scaling Bonus on 강공/공명스킬/공중공격)',
        en: 'Forte resource (max 40). Per point: Demon Hypostasis-converted skill scaling +1.5% (max +60%)',
      },
      maxStacks: 40,
      defaultAssumedStacks: 40,
      perStackEffect: [
        { kind: 'skillScaling', skillId: 'galbrena-skill-1', bonus: 0.015 },
      ],
    },
    {
      characterId: 'galbrena',
      stateName: { ko: '죄의 불꽃', en: 'Sinflame' },
      description: {
        ko: 'Forte 죄염 자원 (최대 100). 풀스택 시 Demon Hypostasis 모드 진입 — Afterflame과 함께 강화 모드 발동',
        en: 'Forte resource (max 100). Full stack triggers Demon Hypostasis mode (paired with Afterflame for empowerment)',
      },
      maxStacks: 100,
      defaultAssumedStacks: 100,
      perStackEffect: [],
    },
  ],

  jinhsi: [
    {
      characterId: 'jinhsi',
      stateName: { ko: '봄의 빛', en: 'Incandescence' },
      description: {
        ko: 'Forte 자원 (최대 50). 풀스택 시 강화 공명스킬 Illuminous Epiphany 발동 (스택 소모 기반). 단계: I/II/III (소모 스택 수에 따라 배율 상승, 정확 곡선 데이터 갭)',
        en: 'Forte resource (max 50). Full stack triggers Empowered Skill Illuminous Epiphany (consumes stacks across tiers I/II/III; exact scaling curve gap)',
      },
      maxStacks: 50,
      defaultAssumedStacks: 50,
      perStackEffect: [],
    },
  ],

  phoebe: [
    {
      characterId: 'phoebe',
      stateName: { ko: '기원 / 사죄 / 고해', en: 'Prayer / Absolution / Confession' },
      description: {
        ko: 'Prayer 게이지 (최대 120). 풀 시 Absolution 또는 Confession 모드 진입. 모드 진입 시 회절 피해 +12% + 크리율 +50%, 25초',
        en: 'Prayer gauge (max 120). Full triggers Absolution or Confession mode. On entry: Spectro DMG +12% + Crit Rate +50%, 25s',
      },
      maxStacks: 120,
      defaultAssumedStacks: 120,
      perStackEffect: [],
      fullStackEffect: [
        { kind: 'flatStat', stat: 'spectroDmgBonus', value: 0.12 },
        { kind: 'critRate', value: 0.50, durationSec: 25 },
      ],
    },
  ],

  carlotta: [
    {
      characterId: 'carlotta',
      stateName: { ko: '영민', en: 'Substance' },
      description: {
        ko: 'Forte 자원 (최대 120, 2단계). 풀게이지 시 Final Bow 발동 → 공명해방 3종(Era of New Wave / Death Knell / Fatal Finale) 배율 +80% Skill Scaling Bonus',
        en: 'Forte resource (max 120, 2 tiers). Full triggers Final Bow → Liberation trio scaling +80%',
      },
      maxStacks: 120,
      defaultAssumedStacks: 120,
      perStackEffect: [],
      fullStackEffect: [
        { kind: 'skillScaling', skillId: 'carlotta-liberation-2', bonus: 0.80 },
      ],
    },
  ],

  jiyan: [
    {
      characterId: 'jiyan',
      stateName: { ko: '파진치', en: 'Resolve' },
      description: {
        ko: 'Forte 자원 (최대 60). 일반공격 Lone Lance / 인트로 Tactical Strike 명중 시 획득. 30 Resolve 소비로 공명스킬 강화 (피해 +20%) 또는 공명해방에 용형 일격 추가. 60 풀 소모 시 Qingloong Wind Form(풍속 자세) 강화',
        en: 'Forte resource (max 60). Earned via Lone Lance/Tactical Strike. 30 Resolve enhances Skill (+20% DMG) or adds dragon strike to Liberation. Full 60 consume empowers Qingloong Wind Form',
      },
      maxStacks: 60,
      defaultAssumedStacks: 60,
      perStackEffect: [],
      fullStackEffect: [
        { kind: 'amplify', value: 0.20, target: 'skill', conditional: 'enhanced (Resolve-consumed) skill only' },
      ],
    },
  ],

  yinlin: [
    {
      characterId: 'yinlin',
      stateName: { ko: '죄악의 표식 / 징벌의 인장', en: "Sinner's Mark / Punishment Mark" },
      description: {
        ko: '강공격 홀드로 Sinner\'s Mark → Punishment Mark (18초). 마크된 적에게 Lightning Execution 추가 발동, 인헤런트로 추가 +10% Amplify',
        en: 'Heavy hold applies Sinner\'s Mark → Punishment Mark (18s). On marked enemies: Lightning Execution triggers, +10% Amplify via inherent',
      },
      maxStacks: 1,
      defaultAssumedStacks: 1,
      perStackEffect: [],
      fullStackEffect: [
        { kind: 'amplify', value: 0.10, target: 'skill', conditional: 'Lightning Execution (skill) vs Marked target only' },
      ],
    },
  ],

  encore: [
    {
      characterId: 'encore',
      stateName: { ko: '길 잃은 새끼양', en: 'Lost Lamb' },
      description: {
        ko: 'S6에서 활성화 — 공명해방 Cosmos: Rave 중 피해 시 1스택, 스택당 ATK +5%, 10초, 최대 6중첩 (+30% ATK at S6)',
        en: 'Active at S6 — during Cosmos: Rave hits: ATK +5%, 10s, max 6 stacks (+30% ATK at S6)',
      },
      maxStacks: 6,
      defaultAssumedStacks: 6,
      perStackEffect: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.05 },
      ],
    },
  ],

  brant: [
    {
      characterId: 'brant',
      stateName: { ko: '갈채', en: 'Bravo' },
      description: {
        ko: 'Forte 자원 (최대 100). 25/50/75/100 도달 시 팀 자동 치유. 풀스택 시 공명스킬이 Returned from Ashes로 대체 (대량 피해 + 팀 보호막)',
        en: 'Forte resource (max 100). At 25/50/75/100: team auto-heal. Full stack converts Skill to Returned from Ashes (burst DMG + team shield)',
      },
      maxStacks: 100,
      defaultAssumedStacks: 100,
      perStackEffect: [],
    },
  ],

  zani: [
    {
      characterId: 'zani',
      stateName: { ko: '불빛', en: 'Heliacal Ember' },
      description: {
        ko: '최대 60, 스택당 6초. Frazzle→Heliacal 변환으로 획득. 스택당 Blaze +5. 풀스택 도달 시 Inferno 모드 진입',
        en: 'Max 60, 6s per stack. Gained via Frazzle→Heliacal conversion. +5 Blaze per stack. Full triggers Inferno mode',
      },
      maxStacks: 60,
      defaultAssumedStacks: 60,
      perStackEffect: [],
    },
    {
      characterId: 'zani',
      stateName: { ko: '강렬한 불기운', en: 'Blaze' },
      description: {
        ko: '최대 100 / Inferno 모드 시 150. S3에서 Blaze 1점 소모마다 공명해방 The Last Stand 배율 +8% (최대 +1200%)',
        en: 'Max 100 / 150 in Inferno mode. S3: per Blaze consumed, Liberation The Last Stand scaling +8% (max +1200%)',
      },
      maxStacks: 150,
      defaultAssumedStacks: 150,
      perStackEffect: [],
    },
  ],

  lynae: [
    {
      characterId: 'lynae',
      stateName: { ko: '컬러 프리믹싱', en: 'Premixed Hue' },
      description: {
        ko: 'Lumiflow 120점 이상 + 전투 1초마다 1스택. 스택당 Additive Color 회절 피해 +55%, 최대 25스택 (이론치 +1375%)',
        en: 'Lumiflow ≥120 + 1 stack/s in combat. Per stack: Additive Color Spectro DMG +55%, max 25 (theoretical +1375%)',
      },
      maxStacks: 25,
      defaultAssumedStacks: 25,
      perStackEffect: [
        { kind: 'flatStat', stat: 'spectroDmgBonus', value: 0.55 },
      ],
    },
  ],

  mortefi: [
    {
      characterId: 'mortefi',
      stateName: { ko: '강화음', en: 'Marcato' },
      description: {
        ko: '공명해방 Burning Rhapsody 중 일반공격 명중당 Marcato 1발, 강공격 명중당 2발. 인헤런트 2: 명중당 다음 Marcato 피해 +1.5%, 0.35초 ICD, 최대 50스택 (+75%)',
        en: 'During Liberation Burning Rhapsody: Basic→1 Marcato, Heavy→2 Marcato. Inherent 2: per hit +1.5% next Marcato DMG, 0.35s ICD, max 50 (+75%)',
      },
      maxStacks: 50,
      defaultAssumedStacks: 50,
      perStackEffect: [],
      fullStackEffect: [
        { kind: 'amplify', value: 0.75, conditional: 'Marcato attacks during Burning Rhapsody' },
      ],
    },
  ],

  chixia: [
    {
      characterId: 'chixia',
      stateName: { ko: 'Numbingly Spicy (얼얼한 매운맛)', en: 'Numbingly Spicy' },
      description: {
        ko: 'DAKA DAKA! 중 Thermobaric Bullet 명중 시 1스택, 스택당 ATK +1%, 10초, 최대 30중첩 (+30%)',
        en: 'During DAKA DAKA!: per Thermobaric hit: ATK +1%, 10s, max 30 (+30%)',
      },
      maxStacks: 30,
      defaultAssumedStacks: 30,
      perStackEffect: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.01 },
      ],
    },
  ],

  cantarella: [
    {
      characterId: 'cantarella',
      stateName: { ko: '협주 에너지', en: 'Concerto Energy' },
      description: {
        ko: '팀 에코 스킬 시전마다 Concerto +6 (에코 1종당 1회, 최대 6회 = +36)',
        en: 'Per team Echo Skill: Concerto +6 (1×/echo type, max 6 = +36)',
      },
      maxStacks: 6,
      defaultAssumedStacks: 6,
      perStackEffect: [],
    },
  ],

  danjin: [
    {
      characterId: 'danjin',
      stateName: { ko: 'Incinerating Will Stack (분소 의지)', en: 'Incinerating Will Stack' },
      description: {
        ko: 'S1: Incinerating Will 적중 시 ATK +5%, 6초, 최대 6중첩 (+30%)',
        en: 'S1: per Incinerating Will hit: ATK +5%, 6s, max 6 (+30%)',
      },
      maxStacks: 6,
      defaultAssumedStacks: 6,
      perStackEffect: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.05 },
      ],
    },
  ],

  sigrika: [
    {
      characterId: 'sigrika',
      stateName: { ko: 'Encapsulated', en: 'Encapsulated' },
      description: {
        ko: '아웃트로로 2스택 부여 (S1 "밝게 빛나야 할 광휘에게" 시 3스택). 팀 에코 스킬 시 적에게 Stagnate 부여 + 1스택 소모. 직접 피해 보너스 없음 — 디버프(Stagnate) 메커니즘',
        en: 'Outro grants 2 stacks (3 with S1 "The Gleam Meant for Radiance"). On team Echo Skill: Stagnate target + consume 1 stack. No direct damage bonus — control mechanic',
      },
      maxStacks: 3,
      defaultAssumedStacks: 3,
      perStackEffect: [],
    },
  ],
};
