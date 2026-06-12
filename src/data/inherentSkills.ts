// src/data/inherentSkills.ts
import type { InherentSkill } from '@/types/game';

/**
 * 캐릭터별 고유 스킬(Inherent Skill) — 무조건 보유 패시브.
 * 일반적으로 캐릭터당 2개 (고유 스킬 1, 고유 스킬 2).
 *
 * 출처: WuCalc_06_캐릭터별_딜계산_데이터.md
 * 데이터 갭은 docs/data-gaps.md 추적.
 *
 * 동적 조건(스택, 모드, HP%)이 걸린 효과는 `condition` 필드로 서술,
 * 정량 효과만 `effects`에 등록한다. 풀스택/상시 가정으로 통합 계산.
 */
export const INHERENT_SKILLS: Record<string, InherentSkill[]> = {
  // ── 용융 ──
  aemeath: [
    {
      id: 'aemeath-inherent-1',
      name: { ko: '별과 별 사이', en: 'Between the Stars' },
      description: {
        ko: '팀이 Tune Rupture-Shifting 또는 Negative Status 부여 시 본인 크리피해 +20% (최대 3중첩 = +60%). Finale에 적 DEF 20% 무시',
        en: 'On team Tune Rupture-Shifting or Negative Status: Crit DMG +20% (max 3 stacks +60%). Finale ignores 20% enemy DEF',
      },
      effects: [
        { kind: 'flatStat', stat: 'critDmg', value: 0.60 },
        { kind: 'defIgnore', value: 0.20 },
      ],
      condition: { ko: '팀이 Negative Status 부여 가능 + 3스택 풀가동', en: 'Team applies Negative Status + 3 stacks active' },
    },
    {
      id: 'aemeath-inherent-2',
      name: { ko: '만물이 있기 전에', en: 'Before All Sounds' },
      description: { ko: '강공격에 피해 증폭 +200%', en: 'Heavy Attack DMG Amplify +200%' },
      effects: [
        { kind: 'amplify', value: 2.00, target: 'heavy', conditional: 'heavy attack only' },
      ],
    },
  ],

  changli: [
    {
      id: 'changli-inherent-1',
      name: { ko: '은밀한 모략', en: 'Secret Strategist' },
      description: { ko: 'True Sight 후 Enflamement 스택당 용융 피해 +5% (4스택 = +20%)', en: 'After True Sight: per Enflamement stack Fusion DMG +5% (max +20%)' },
      effects: [
        { kind: 'flatStat', stat: 'fusionDmgBonus', value: 0.20 },
      ],
    },
    {
      id: 'changli-inherent-2',
      name: { ko: '태세 분쇄', en: 'Sweeping Force' },
      description: { ko: '4 Enflamement 상태에서 공명해방 또는 Forte 강공격 후 용융 피해 +20%, 적 DEF 15% 무시', en: '4 Enflamement: Fusion DMG +20%, ignore 15% enemy DEF' },
      effects: [
        { kind: 'flatStat', stat: 'fusionDmgBonus', value: 0.20 },
        { kind: 'defIgnore', value: 0.15 },
      ],
    },
  ],

  // 치샤 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Scorching Magazine / Numbingly Spicy!
  chixia: [
    {
      id: 'chixia-inherent-1',
      name: { ko: '뜨거운 탄창', en: 'Scorching Magazine' },
      description: {
        ko: 'Thermobaric Bullets 최대치 +10, 공명스킬 Boom Boom 피해 +50%',
        en: 'Thermobaric Bullets max +10, Resonance Skill Boom Boom DMG +50%',
      },
      effects: [],
    },
    {
      id: 'chixia-inherent-2',
      name: { ko: '극도로 매운맛', en: 'Numbingly Spicy!' },
      description: {
        ko: 'DAKA DAKA! 중 Thermobaric Bullet 명중 시 ATK +1%, 10초, 최대 30중첩 (+30%)',
        en: 'During DAKA DAKA!: per Thermobaric hit ATK +1%, 10s, max 30 stacks (+30%)',
      },
      // 정량 효과는 STATE_MECHANICS.chixia[Numbingly Spicy]에서 perStackEffect로 처리 — 중복 방지
      effects: [],
    },
  ],

  // 앙코 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Angry Cosmos / Woolies Cheer Dance.
  encore: [
    {
      id: 'encore-inherent-1',
      name: { ko: '화난 그늘이', en: 'Angry Cosmos' },
      description: {
        ko: '공명해방 중 HP 70% 이상에서 피해 +10%',
        en: 'During Liberation, HP ≥70%: DMG +10%',
      },
      effects: [
        { kind: 'amplify', value: 0.10, conditional: 'liberation active, hp>=70%' },
      ],
    },
    {
      id: 'encore-inherent-2',
      name: { ko: '음메음메 응원가', en: 'Woolies Cheer Dance' },
      description: {
        ko: '공명스킬 사용 후 용융 피해 +10%, 10초',
        en: 'After Resonance Skill: Fusion DMG +10%, 10s',
      },
      effects: [
        { kind: 'flatStat', stat: 'fusionDmgBonus', value: 0.10 },
      ],
    },
  ],

  // 갈브레나 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Oathbound Hunt / Sin Feaster.
  // "Fated End"는 스택 이름이지 패시브 이름이 아님. WuCalc_06 오류 정정.
  galbrena: [
    {
      id: 'galbrena-inherent-1',
      name: { ko: '사냥의 맹세', en: 'Oathbound Hunt' },
      description: {
        ko: '인트로/일반/강공격/공명스킬/공명해방 등 다양한 스킬 적중 시 Fated End 1스택 (최대 4). 스택당 직접 피해 +5% (최대 +20%), 5.5초',
        en: 'On various skill hits: 1 stack of Fated End (max 4). Each stack: direct DMG +5% for 5.5s (max +20% at 4 stacks)',
      },
      effects: [
        { kind: 'amplify', value: 0.20 },
      ],
    },
    {
      id: 'galbrena-inherent-2',
      name: { ko: '폭식의 죄', en: 'Sin Feaster' },
      description: {
        ko: '특정 일반/강공격 단 적중 시 STA 10pt 회복',
        en: 'STA recovery (10pt) on specific Basic/Heavy Attack stages',
      },
      effects: [],
    },
  ],

  // 브렌트 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Voyager's Blaze / Trial by Fire and Tide.
  brant: [
    {
      id: 'brant-inherent-1',
      name: { ko: '인도의 불꽃', en: "Voyager's Blaze" },
      description: {
        ko: '파도의 갈채 치료량 +20%',
        en: 'Waves of Acclaims healing +20%',
      },
      effects: [],
    },
    {
      id: 'brant-inherent-2',
      name: { ko: '파도에 맞서는 결심', en: 'Trial by Fire and Tide' },
      description: {
        ko: '공중공격 경직 저항 증가, 용융 피해 보너스 +15%',
        en: 'Mid-air interruption resistance enhanced; Fusion DMG Bonus +15%',
      },
      effects: [
        { kind: 'flatStat', stat: 'fusionDmgBonus', value: 0.15 },
      ],
    },
  ],

  // 아우구스타 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Glory's Favor / Blazing Valor.
  augusta: [
    {
      id: 'augusta-inherent-1',
      name: { ko: '영예의 가호', en: "Glory's Favor" },
      description: {
        ko: '피해 발생 시 본인 최대 HP의 350+2.5% 실드, 5초 (0.5초 ICD). 정량 effect 없음 — 실드',
        en: 'On DMG dealt: shield = 350 + 2.5% Max HP, 5s (0.5s ICD). Shield mechanic — no direct stat effect',
      },
      effects: [],
    },
    {
      id: 'augusta-inherent-2',
      name: { ko: '타오르는 결의', en: 'Blazing Valor' },
      description: {
        ko: '4초 이상 전투 외 상태: Majesty 1스택 미만 시 1 회복 + Crown of Wills 풀회복 (4초 ICD). 자원 관리용 — 정량 effect 없음',
        en: 'Out of combat 4s+: restore Majesty if <1 + fully restore Crown of Wills (4s ICD). Resource utility',
      },
      effects: [],
    },
  ],

  // 양양 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Compassion / Lazuline Mercy.
  yangyang: [
    {
      id: 'yangyang-inherent-1',
      name: { ko: '바람의 해석', en: 'Compassion' },
      description: {
        ko: '공중공격 Feather Release 시전 후 스태미나 +30 회복',
        en: 'After Mid-air Attack Feather Release: STA +30',
      },
      effects: [],
    },
    {
      id: 'yangyang-inherent-2',
      name: { ko: '근심', en: 'Lazuline Mercy' },
      description: {
        ko: '인트로 Cerulean Song 후 본인 기류 피해 보너스 +8%, 8초',
        en: 'After Intro Cerulean Song: self Aero DMG Bonus +8%, 8s',
      },
      effects: [
        { kind: 'flatStat', stat: 'aeroDmgBonus', value: 0.08 },
      ],
    },
  ],

  // 모니에 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Blueprint / Boundedness.
  // 효과는 WuCalc_06 인용 값 유지 (한글 효과 표현은 출시 후 KR 페이지에서 재검증 필요).
  mornye: [
    {
      id: 'mornye-inherent-1',
      name: { ko: '청사진', en: 'Blueprint' },
      description: {
        ko: 'High Syntony Field — 팀 DEF +20%',
        en: 'High Syntony Field — Team DEF +20%',
      },
      effects: [
        { kind: 'teamBuff', stat: 'defPercent', value: 0.20, durationSec: 0 },
      ],
    },
    {
      id: 'mornye-inherent-2',
      name: { ko: '유계', en: 'Boundedness' },
      description: {
        ko: 'Proof of Boundedness 부여 — HP 30% 이상 피해 시 30% 캡 (3회), 치명타 면역 (1회), 제거 시 본인 DEF의 150% HP 회복. 정량 effect 없음 (방어/회복 메커니즘)',
        en: 'Proof of Boundedness — DMG taken >30% Max HP capped to 30% (3 charges), block fatal blow (1 charge), on removal: heal 150% of Mornye DEF. Defensive/heal mechanic, no direct stat',
      },
      effects: [],
    },
  ],

  mortefi: [
    {
      id: 'mortefi-inherent-1',
      name: { ko: '친절한 접대', en: 'Harmonic Control' },
      description: { ko: '공명스킬 Passionate Variation 후 Fury Fugue 피해 +25%, 8초', en: 'After Skill Passionate Variation: Fury Fugue DMG +25%, 8s' },
      effects: [
        { kind: 'amplify', value: 0.25, conditional: 'after Passionate Variation' },
      ],
    },
    {
      id: 'mortefi-inherent-2',
      name: { ko: '자유로운 리듬', en: 'Rhythmic Vibrato' },
      description: { ko: '공명해방 중 Marcato 명중마다 다음 Marcato 피해 +1.5%, 0.35초마다 1회, 최대 50중첩 (+75%)', en: 'During Liberation: per Marcato hit next Marcato DMG +1.5%, 0.35s ICD, max 50 (+75%)' },
      // 정량 효과는 STATE_MECHANICS.mortefi[Marcato].fullStackEffect에서 처리 — 중복 방지
      effects: [],
    },
  ],

  // ── 응결 ──
  // 카를로타 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Flawless Purity / Ars Gratia Artis.
  carlotta: [
    {
      id: 'carlotta-inherent-1',
      name: { ko: '맑은 순수함', en: 'Flawless Purity' },
      description: {
        ko: '공명스킬 Chromatic Splendor 재시전 후 공중공격 시전 가능 + 피해/경직 무적',
        en: 'After Resonance Skill Chromatic Splendor: Mid-air Attack immune to DMG/interruption until landing',
      },
      effects: [],
    },
    {
      id: 'carlotta-inherent-2',
      name: { ko: '예술지상주의', en: 'Ars Gratia Artis' },
      description: {
        ko: '인트로 Wintertime Aria, 공명스킬 Chromatic Splendor, 공명해방 Death Knell, 강공격 Imminent Oblivion이 Deconstruction 부여',
        en: 'Intro Wintertime Aria, Skill Chromatic Splendor, Liberation Death Knell, Heavy Imminent Oblivion can inflict Deconstruction',
      },
      effects: [],
    },
  ],

  // 유호 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Treasured Piece / Rare Find.
  youhu: [
    {
      id: 'youhu-inherent-1',
      name: { ko: '편옥', en: 'Treasured Piece' },
      description: {
        ko: '공명해방 시 파티 HP 회복 (효과 상세는 출처 미수집)',
        en: 'On Liberation: party HP recovery (effect details not collected)',
      },
      effects: [],
    },
    {
      id: 'youhu-inherent-2',
      name: { ko: '구슬', en: 'Rare Find' },
      description: {
        ko: '인트로 후 본인 응결 피해 +15%, 14초',
        en: 'After intro: self Glacio DMG +15%, 14s',
      },
      effects: [
        { kind: 'flatStat', stat: 'glacioDmgBonus', value: 0.15 },
      ],
    },
  ],

  // ── 기류 ──
  // 카르티시아 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: A Heart's Truest Wishes / Wind's Indelible Imprint.
  cartethyia: [
    {
      id: 'cartethyia-inherent-1',
      name: { ko: '마음으로 엮어낸 기도', en: "A Heart's Truest Wishes" },
      description: {
        ko: 'Aero Erosion 적용 적에게 카르티시아·Fleurdelys 모든 피해 +30% (스택 무관). 3스택 초과 시 1스택당 추가 +10% (6스택 풀 시 추가 +30%, 총 +60%)',
        en: 'Vs Aero Erosion enemies: Cartethyia/Fleurdelys all DMG +30% (stack-agnostic). Above 3 stacks: +10%/stack (max 6 stacks = +60%)',
      },
      // 정량 효과는 STATE_MECHANICS.cartethyia[Aero Erosion].fullStackEffect에서 처리
      effects: [],
    },
  ],

  // 감심 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Formless Release / Reflection.
  jianxin: [
    {
      id: 'jianxin-inherent-1',
      name: { ko: '형식 무극', en: 'Formless Release' },
      description: {
        ko: '공명해방 피해 +20%',
        en: 'Liberation DMG +20%',
      },
      effects: [
        { kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.20 },
      ],
    },
  ],

  // 기염 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Heavenly Balance / Tempest Taming.
  // 효과 텍스트는 wuthering.gg에서 추출하지 못해 WuCalc_06 인용 값 유지 (효과 자체는 검증된 정량).
  jiyan: [
    {
      id: 'jiyan-inherent-1',
      name: { ko: '수천평란', en: 'Heavenly Balance' },
      description: {
        ko: '인트로 후 ATK +10%, 15초',
        en: 'After intro: ATK +10%, 15s',
      },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.10 },
      ],
    },
    {
      id: 'jiyan-inherent-2',
      name: { ko: '온풍집류', en: 'Tempest Taming' },
      description: {
        ko: '적 명중 후 크리피해 +12%, 8초',
        en: 'After hit: Crit DMG +12%, 8s',
      },
      effects: [
        { kind: 'flatStat', stat: 'critDmg', value: 0.12 },
      ],
    },
  ],

  // ── 전도 ──
  // 음림 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Pain Immersion / Deadly Focus.
  // WuCalc_06의 "Sinner's Mark — Lightning Execution" / "Forte Judgment Strike +55%"는 임의 라벨.
  // 정확한 매핑: Deadly Focus = Mark+Lightning Execution 효과, Pain Immersion = Magnetic Roar crit
  // 음림 — wuthering.gg KR + EN 검증 (2026-05-20).
  // 공식: 과도한 통증 (Pain Immersion) / 명확한 목표 (Deadly Focus)
  yinlin: [
    {
      id: 'yinlin-inherent-1',
      name: { ko: '과도한 통증', en: 'Pain Immersion' },
      description: {
        ko: '공명스킬 Magnetic Roar 사용 후 크리율 +15%, 5초',
        en: 'After using Resonance Skill Magnetic Roar: Crit Rate +15%, 5s',
      },
      effects: [
        { kind: 'flatStat', stat: 'critRate', value: 0.15 },
      ],
    },
    {
      id: 'yinlin-inherent-2',
      name: { ko: '명확한 목표', en: 'Deadly Focus' },
      description: {
        ko: 'Sinner\'s Mark 표시된 적에게 Lightning Execution 피해 +10%, 발동 시 ATK +10% 4초',
        en: 'Lightning Execution DMG +10% on Sinner\'s Mark target; on trigger: ATK +10%, 4s',
      },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.10 },
        // amplify +0.10 (Lightning Execution / skill 타깃)은 STATE_MECHANICS.yinlin[Mark]에서 중복 처리되지 않도록 주의
      ],
    },
    // Forte 메커니즘 — 실제 인헤런트가 아니지만 계산엔 필요. 별도 entry로 표시.
    {
      id: 'yinlin-forte-judgment-strike',
      name: { ko: 'Forte · Forte Judgment Strike 강화', en: 'Forte · Judgment Strike Empowerment' },
      description: {
        ko: 'Forte Circuit 메커니즘 — Judgment Strike 배율 +55%, 적중 시 팀 ATK +20%, 12초',
        en: 'Forte Circuit — Judgment Strike scaling +55%; on hit: team ATK +20%, 12s',
      },
      effects: [
        { kind: 'skillScaling', skillId: 'yinlin-skill-4', bonus: 0.55 },
        { kind: 'teamBuff', stat: 'atkPercent', value: 0.20, durationSec: 12 },
      ],
    },
  ],

  // 카카루 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Bloodshed Awaken / Revenant Rush.
  calcharo: [
    {
      id: 'calcharo-inherent-1',
      name: { ko: '핏빛의 각오', en: 'Bloodshed Awaken' },
      description: {
        ko: '강공격 Mercy 시전 시 공명해방 피해 보너스 +10%, 15초',
        en: 'Casting Heavy Attack Mercy: Resonance Liberation DMG Bonus +10% for 15s',
      },
      effects: [
        { kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.10 },
      ],
    },
    {
      id: 'calcharo-inherent-2',
      name: { ko: '용감한 헌신', en: 'Revenant Rush' },
      description: {
        ko: '강공격 Death Messenger 적중 시 받는 피해 -15%, 5초',
        en: 'When Heavy Attack Death Messenger hits: damage taken -15% for 5s',
      },
      effects: [],
    },
  ],

  // 상리요 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Knowing / Focus.
  'xiangli-yao': [
    {
      id: 'xiangli-yao-inherent-1',
      name: { ko: '예지', en: 'Knowing' },
      description: {
        ko: '공명스킬 시전마다 1스택, 1스택당 전도 피해 +5%, 8초, 최대 4스택 (=+20%)',
        en: 'Per Resonance Skill cast: 1 stack, per stack Electro DMG +5%, 8s, max 4 stacks (+20%)',
      },
      effects: [
        { kind: 'flatStat', stat: 'electroDmgBonus', value: 0.20 },
      ],
    },
    {
      id: 'xiangli-yao-inherent-2',
      name: { ko: '집중', en: 'Focus' },
      description: {
        ko: '공명해방으로 진입한 Intuition 상태에서 경직 저항 증가',
        en: 'In Intuition state (from Resonance Liberation): interruption resistance enhanced',
      },
      effects: [],
    },
  ],

  // ── 회절 ──
  // 금희 — wuthering.gg KR + EN 검증 (2026-05-20).
  // 공식: 수호신의 빛 (Radiant Surge) / 정신 (Converged Flash)
  jinhsi: [
    {
      id: 'jinhsi-inherent-1',
      name: { ko: '수호신의 빛', en: 'Radiant Surge' },
      description: {
        ko: '회절 피해 보너스 +20%',
        en: 'Spectro DMG Bonus +20%',
      },
      effects: [
        { kind: 'flatStat', stat: 'spectroDmgBonus', value: 0.20 },
      ],
    },
    {
      id: 'jinhsi-inherent-2',
      name: { ko: '정신', en: 'Converged Flash' },
      description: {
        ko: '인트로 스킬 「Loong\'s Halo」 피해 배율 +50%',
        en: 'Intro Skill Loong\'s Halo DMG Multiplier +50%',
      },
      effects: [
        { kind: 'flatStat', stat: 'introDmgBonus', value: 0.50 },
      ],
    },
  ],

  // 루크·헤르센 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Pulses Under the Snow / Uncaused Diagnosis.
  'luuk-herssen': [
    {
      id: 'luuk-herssen-inherent-1',
      name: { ko: '눈속에 묻힌 맥박', en: 'Pulses Under the Snow' },
      description: {
        ko: 'Tune Strain-Interfered 스택 0.12%당 본인 총 피해 증가 (WuCalc_06 인용)',
        en: 'Per Tune Strain-Interfered stack: +0.12% total self DMG',
      },
      effects: [],
    },
    {
      id: 'luuk-herssen-inherent-2',
      name: { ko: '이유 없이 찾아온 치유의 계시', en: 'Uncaused Diagnosis' },
      description: {
        ko: 'Tune Strain-Interfered 적에게 Tune Break Boost 10점당 피해 증폭 +5% (최대 +30%). 팀이 Tune Strain - Shifting 부여 또는 Tune Break 시 본인 ATK +25%, 20초',
        en: 'Vs Tune Strain-Interfered: per 10 Tune Break Boost: +5% Amplify (max +30%). On team Tune Strain - Shifting or Tune Break: self ATK +25%, 20s',
      },
      effects: [
        { kind: 'amplify', value: 0.30, conditional: 'target Interfered + Tune Break Boost ≥60' },
        { kind: 'flatStat', stat: 'atkPercent', value: 0.25 },
      ],
    },
  ],

  // 린네 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Colors Never Fade! / Adaptive Optics: Everyday Applications.
  lynae: [
    {
      id: 'lynae-inherent-1',
      name: { ko: '영원히 빛바래지 않는 색채!', en: 'Colors Never Fade!' },
      description: {
        ko: '일반공격 Visual Impact 시전 후 Spray Paint 생성, 2초마다 Photochromic Flux 부여 (5초). 정량 effect 없음 (메커니즘)',
        en: 'After Basic Attack Visual Impact: leave Spray Paint, inflict Photochromic Flux every 2s for 5s. Mechanic — no direct stat',
      },
      effects: [],
    },
    {
      id: 'lynae-inherent-2',
      name: { ko: '『적응형 광학의 생활 속 실제 응용』', en: 'Adaptive Optics: Everyday Applications' },
      description: {
        ko: '인트로 Time to Show Some Colors! 시전 후 본인 회절 피해 보너스 +25%, 9초',
        en: 'After Intro Time to Show Some Colors!: self Spectro DMG Bonus +25%, 9s',
      },
      effects: [
        { kind: 'flatStat', stat: 'spectroDmgBonus', value: 0.25 },
      ],
    },
  ],

  // 페비 — wuthering.gg KR + EN 검증 (2026-05-20)
  // WuCalc_06의 "Absolution Enhancement"/"Confession Enhancement"는 실제 패시브 이름이 아니라
  // Forte Circuit Absolution/Confession 모드 보너스를 묶은 임의 명명이었음.
  // 공식 패시브명은 존재(Presence) / 계시(Revelation).
  phoebe: [
    {
      id: 'phoebe-inherent-1',
      name: { ko: '존재', en: 'Presence' },
      description: {
        ko: '매번 공중 강공격 발동 가능 횟수가 1회 증가',
        en: 'Mid-air Heavy Attack can be cast 1 more time',
      },
      effects: [],
    },
    {
      id: 'phoebe-inherent-2',
      name: { ko: '계시', en: 'Revelation' },
      description: {
        ko: '사죄(Absolution) 또는 고해(Confession) 상태 시 회절 피해 보너스 +12%',
        en: 'In Absolution or Confession status: Spectro DMG Bonus +12%',
      },
      effects: [
        { kind: 'flatStat', stat: 'spectroDmgBonus', value: 0.12 },
      ],
    },
    // Forte Circuit Absolution/Confession 모드 효과 — 실제로는 패시브가 아닌 Forte 메커니즘이지만
    // 데미지 계산엔 큰 영향이므로 별도 entry로 유지. 정량 효과는 추후 stateEffects.ts로 이전 검토.
    {
      id: 'phoebe-forte-absolution',
      name: { ko: 'Forte · 사죄 모드 강화', en: 'Forte · Absolution Mode Empowerment' },
      description: {
        ko: '사죄 모드 진입 시 공명해방 배율 +255% (Skill Scaling Bonus 카테고리) — Forte Circuit 메커니즘',
        en: 'Absolution mode: Liberation scaling +255% (Skill Scaling Bonus) — Forte Circuit mechanic',
      },
      effects: [
        { kind: 'skillScaling', skillId: 'phoebe-liberation-2', bonus: 2.55 },
      ],
      condition: { ko: '사죄(Absolution) 모드 진입 필요', en: 'Requires Absolution mode' },
    },
    {
      id: 'phoebe-forte-confession',
      name: { ko: 'Forte · 고해 모드 강화', en: 'Forte · Confession Mode Empowerment' },
      description: {
        ko: '고해 모드 + Spectro Frazzle 적: 회절 저항 -10% + 회절 Frazzle 피해 증폭 +100% — Forte Circuit 메커니즘',
        en: 'Confession mode + Spectro Frazzle target: enemy Spectro RES -10% + Spectro Frazzle Amplify +100% — Forte Circuit mechanic',
      },
      effects: [
        { kind: 'resPen', element: 'spectro', value: 0.10 },
        { kind: 'amplify', value: 1.00, target: 'spectro', conditional: 'Spectro Frazzle target only' },
      ],
      condition: { ko: '고해(Confession) 모드 + 적 Spectro Frazzle', en: 'Confession mode + Spectro Frazzle target' },
    },
  ],

  // 파수인 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Life Entwined / Self Gravitation.
  // WuCalc_06의 "Inner/Supernal Stellarealm"은 메커니즘 이름이지 패시브 이름이 아니었음.
  shorekeeper: [
    {
      id: 'shorekeeper-inherent-1',
      name: { ko: '흐르는 생사', en: 'Life Entwined' },
      description: {
        ko: '인헤런트 효과는 치명타 회피 (다른 공명자가 치사 시 본인 HP 50% 소모하여 회복). 별도 Forte Circuit 효과 — Stellarealm 내 아군 인트로 → Inner Stellarealm (팀 크리율 +최대 12.5%, ER 스케일링), 추가 인트로 → Supernal Stellarealm (팀 크리피해 +최대 25%, ER 스케일링) — 계산 편의상 본 entry에 합산',
        en: 'Inherent: heal on ally fatal blow (50% Shorekeeper HP). Forte Circuit (modeled here for calc): Inner Stellarealm grants team Crit Rate +12.5% / Supernal Stellarealm grants team Crit DMG +25% (both ER-scaled max)',
      },
      effects: [
        { kind: 'teamBuff', stat: 'critRate', value: 0.125, durationSec: 0 },
        { kind: 'teamBuff', stat: 'critDmg', value: 0.25, durationSec: 0 },
      ],
    },
    {
      id: 'shorekeeper-inherent-2',
      name: { ko: '자아의 이끌림', en: 'Self Gravitation' },
      description: {
        ko: 'Stellarealm 내 아군 있으면 본인 ER +10%',
        en: 'With allies in Stellarealm: self ER +10%',
      },
      effects: [
        { kind: 'flatStat', stat: 'energyRegen', value: 0.10 },
      ],
    },
  ],

  // 방랑자·회절 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Reticence / Silent Listener.
  // WuCalc_06의 "Odyssey of Beginnings"는 잘못된 패시브 이름이었음.
  'rover-spectro': [
    {
      id: 'rover-spectro-inherent-1',
      name: { ko: '과묵', en: 'Reticence' },
      description: {
        ko: '강공격 Resonance 후 ATK +15%, 5초 (WuCalc_06 인용 효과)',
        en: 'After Heavy Attack Resonance: ATK +15%, 5s',
      },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.15 },
      ],
    },
    {
      id: 'rover-spectro-inherent-2',
      name: { ko: '경청', en: 'Silent Listener' },
      description: {
        ko: '공명스킬 Resonating Slashes/Spin 시 크리율 +15%, 7초',
        en: 'On Resonance Skill Resonating Slashes/Spin: Crit Rate +15%, 7s',
      },
      effects: [
        { kind: 'critRate', value: 0.15, durationSec: 7 },
      ],
    },
  ],

  // 벨리나 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Grace of Life / Gift of Nature.
  verina: [
    {
      id: 'verina-inherent-1',
      name: { ko: '생명의 은혜', en: 'Grace of Life' },
      description: {
        ko: '효과 상세는 출처 미수집 — 출시 후 인게임 텍스트 확인 필요',
        en: 'Effect details not collected — pending in-game verification',
      },
      effects: [],
    },
    {
      id: 'verina-inherent-2',
      name: { ko: '자연의 선물', en: 'Gift of Nature' },
      description: {
        ko: 'Forte 강공/공중 강공/공명해방/아웃트로 시 팀 ATK +20%, 20초',
        en: 'On Forte Heavy/Aerial Heavy/Liberation/Outro: team ATK +20%, 20s',
      },
      effects: [
        { kind: 'teamBuff', stat: 'atkPercent', value: 0.20, durationSec: 20 },
      ],
    },
  ],

  // 젠니 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Quick Response / Fear No Pain.
  zani: [
    {
      id: 'zani-inherent-1',
      name: { ko: '빠른 응답', en: 'Quick Response' },
      description: {
        ko: '인트로 후 회절 피해 +12%, 14초',
        en: 'After intro: Spectro DMG +12%, 14s',
      },
      effects: [
        { kind: 'flatStat', stat: 'spectroDmgBonus', value: 0.12 },
      ],
    },
    {
      id: 'zani-inherent-2',
      name: { ko: '고통에 대한 저항', en: 'Fear No Pain' },
      description: {
        ko: 'Ready Stance 중 피격 시 받는 피해 -40% (WuCalc_06 인용)',
        en: 'During Ready Stance: damage taken -40% on hit',
      },
      effects: [],
    },
  ],

  // ── 인멸 ──
  // 카멜리아 — wuthering.gg KR + EN 검증 (2026-05-20)
  // WuCalc_06가 두 패시브 이름을 뒤바꿔 기록한 오류 정정:
  // - 점유(Epiphyte) = 일반공격 피해 +15% + 일반공격 차단 저항
  // - 온실(Seedbed) = 인멸 피해 +15% + 강공격을 일반공격 피해로 변환
  camellya: [
    {
      id: 'camellya-inherent-1',
      name: { ko: '점유', en: 'Epiphyte' },
      description: {
        ko: '일반공격 피해 보너스 +15%. 일반공격, 일반공격 「넝쿨의 춤(Vining Waltz)」 / 「열정의 춤(Blazing Waltz)」 시전 시 경직 저항 증가',
        en: 'Gain 15% Basic DMG Bonus. Gain increased resistance to interruption when casting Basic Attack, Vining Waltz, Blazing Waltz',
      },
      effects: [
        { kind: 'flatStat', stat: 'normalDmgBonus', value: 0.15 },
      ],
    },
    {
      id: 'camellya-inherent-2',
      name: { ko: '온실', en: 'Seedbed' },
      description: {
        ko: '인멸 피해 보너스 +15%. 강공격 「전지(Pruning)」 피해가 일반공격 피해로 취급됨',
        en: 'Gain 15% Havoc DMG Bonus. DMG dealt by Heavy Attack Pruning is now considered Basic Attack DMG',
      },
      effects: [
        { kind: 'flatStat', stat: 'havocDmgBonus', value: 0.15 },
      ],
    },
  ],

  // 치사 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Inescapable Fate / All Ends Here.
  chisa: [
    {
      id: 'chisa-inherent-1',
      name: { ko: '풀리지 않는 운명', en: 'Inescapable Fate' },
      description: {
        ko: '효과 상세는 출처 미수집 — 추후 검증',
        en: 'Effect details not collected — pending verification',
      },
      effects: [],
    },
    {
      id: 'chisa-inherent-2',
      name: { ko: '모든 것의 종점', en: 'All Ends Here' },
      description: {
        ko: '인멸 피해 +20% + 치유 보너스 +20% (로테이션 중) — WuCalc_06 인용',
        en: 'Havoc DMG +20% + Healing Bonus +20% (during rotation)',
      },
      effects: [
        { kind: 'flatStat', stat: 'havocDmgBonus', value: 0.20 },
      ],
    },
  ],

  // 플로로 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Accidental / Octet.
  phrolova: [
    {
      id: 'phrolova-inherent-1',
      name: { ko: '변음 기호', en: 'Accidental' },
      description: {
        ko: 'Suite of Quietus / Suite of Immortality / Echo Skill 시 Volatile Note - Cadenza 1 획득',
        en: 'On Suite of Quietus / Suite of Immortality / Echo Skill: gain Volatile Note - Cadenza 1',
      },
      effects: [],
    },
    {
      id: 'phrolova-inherent-2',
      name: { ko: '팔중주', en: 'Octet' },
      description: {
        ko: '효과 상세는 출처 미수집 — 추후 검증',
        en: 'Effect details not collected — pending verification',
      },
      effects: [],
    },
  ],

  // 능양 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Lion's Pride / Diligent Practice.
  lingyang: [
    {
      id: 'lingyang-inherent-1',
      name: { ko: '사자왕의 강림', en: "Lion's Pride" },
      description: {
        ko: '인트로 피해 +50%',
        en: 'Intro DMG +50%',
      },
      effects: [
        { kind: 'flatStat', stat: 'introDmgBonus', value: 0.50 },
      ],
    },
    {
      id: 'lingyang-inherent-2',
      name: { ko: '꾸준한 수행', en: 'Diligent Practice' },
      description: {
        ko: 'Striding Lion 상태 일반공격 적중 시 3초 내 다음 공명스킬 피해 +150% (WuCalc_06 인용)',
        en: 'In Striding Lion: on Basic hit, next Resonance Skill DMG +150% within 3s',
      },
      effects: [],
    },
  ],

  // ── 3.3 신규 — 히유키 ──
  // 인헤런트 한/영 명칭은 wuthering.gg KR + EN 페이지 다중 확인 (2026-05-20).
  // 한글의 의미와 영문 공식명이 직관적으로 일치하지 않으므로 영문은 공식명 그대로 사용.
  hiyuki: [
    {
      id: 'hiyuki-inherent-1',
      name: { ko: '속삭이는 눈', en: 'Fine Snow' },
      description: {
        ko: '파티 내 캐릭터가 「서리 효과(Glacio Chafe)」 또는 「암흑 효과(Havoc Bane)」 추가 시 「눈의 침식(Snow Rust)」 1스택 획득 (최대 3). 1스택 시 「냉해 효과(Glacio Bite)」 피해 +30% + 자신 크리피해 +40%. 2스택 시 추가 이상 효과 피해, 3스택 시 냉해 효과 피해 추가 +30%',
        en: 'When a Resonator in the team applies Glacio Chafe or Havoc Bane, gain 1 stack of Snow Rust (max 3). 1 stack: Glacio Bite DMG +30% + self Crit DMG +40%. 2 stacks: extra anomaly damage. 3 stacks: additional Glacio Bite DMG +30%',
      },
      // 정량 효과는 STATE_MECHANICS.hiyuki[Snow Rust]에서 처리 — 인헤런트는 description만
      effects: [],
    },
    {
      id: 'hiyuki-inherent-2',
      name: { ko: '변하는 세상', en: 'Ephemeral Realm' },
      description: {
        ko: '전투 이탈 또는 의식 회복 후 비전투 4초 지속 시 「서리 단조(Snowforged Blade)」 1pt 미만일 경우 1pt 회복',
        en: 'After leaving combat or recovering after knockout, when staying out of combat for 4s with fewer than 1pt of Snowforged Blade, restore 1pt',
      },
      effects: [],
    },
  ],

  // 산화 — wuthering.gg EN 검증 (2026-05-20). 공식 패시브명: Condensation / Avalanche.
  sanhua: [
    {
      id: 'sanhua-inherent-1',
      name: { ko: '빙결', en: 'Condensation' },
      description: {
        ko: '인트로 후 공명스킬 피해 +20%, 8초',
        en: 'After intro: Skill DMG +20%, 8s',
      },
      effects: [
        { kind: 'flatStat', stat: 'skillDmgBonus', value: 0.20 },
      ],
    },
    {
      id: 'sanhua-inherent-2',
      name: { ko: '폭설', en: 'Avalanche' },
      description: {
        ko: '5번째 일반공격 후 Ice Burst 피해 +20%, 8초',
        en: 'After 5th Basic Attack: Ice Burst DMG +20%, 8s',
      },
      effects: [
        { kind: 'amplify', value: 0.20, target: 'heavy', conditional: 'after 5th basic, Ice Burst (heavy) only' },
      ],
    },
  ],

  // 로코코 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Immersive Performance / Super Attractive Magic Box.
  roccia: [
    {
      id: 'roccia-inherent-1',
      name: { ko: '몰입형 공연', en: 'Immersive Performance' },
      description: {
        ko: '공명스킬 또는 강공격 시전 시 ATK +20%, 12초',
        en: 'On Resonance Skill / Heavy Attack: ATK +20%, 12s',
      },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.20 },
      ],
    },
    {
      id: 'roccia-inherent-2',
      name: { ko: '끌리는 진기한 상자', en: 'Super Attractive Magic Box' },
      description: {
        ko: '아웃트로 후 등장 공명자의 Utility 스킬이 Magic Box로 대체 (Echo Skill로 인멸 피해, 14초 또는 교체 시까지)',
        en: 'After Outro: incoming Resonator\'s Utility → Magic Box (Echo Skill, Havoc DMG, 14s or until switch out)',
      },
      effects: [],
    },
  ],

  // 칸타렐라 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Cure / Poison (한글 약/독은 명조 KR 표기상 반대 매핑).
  cantarella: [
    {
      id: 'cantarella-inherent-1',
      name: { ko: '약', en: 'Cure' },
      description: {
        ko: '회복 보너스 +20%',
        en: 'Healing Bonus +20%',
      },
      effects: [],
    },
    {
      id: 'cantarella-inherent-2',
      name: { ko: '독', en: 'Poison' },
      description: {
        ko: '에코 어빌리티 발동 시 인멸 피해 보너스 +6%, 10초, 최대 2중첩 (+12%)',
        en: 'On Echo Skill: Havoc DMG Bonus +6%, 10s, max 2 stacks (+12%)',
      },
      effects: [
        { kind: 'flatStat', stat: 'havocDmgBonus', value: 0.12 },
      ],
    },
  ],

  // 시그리카 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: True Names Invoked / True Names Aligned.
  sigrika: [
    {
      id: 'sigrika-inherent-1',
      name: { ko: '함의의 재현', en: 'True Names Invoked' },
      description: {
        ko: '인트로 Solsworn Etymology 시전 시 Convergent 부여, 20초. Rune 획득 시 같은 종류 Rune 추가 획득, Convergent 소모',
        en: 'Intro Solsworn Etymology grants Convergent for 20s. On Rune obtain: gain extra Rune of same type, consume Convergent',
      },
      effects: [],
    },
    {
      id: 'sigrika-inherent-2',
      name: { ko: '함의의 공명', en: 'True Names Aligned' },
      description: {
        ko: '팀 에코 어빌리티 발동 시 등장 공명자 기류 피해 +3% + 에코 스킬 피해 +3%, 최대 6스택 (+18%/+18%). 풀스택 시 시그리카 추가 +30%/+30%. ER 125% 초과 1%당 에코 스킬 피해 +2% (최대 +50%)',
        en: 'On team Echo: active Resonator Aero DMG +3% + Echo Skill DMG +3%, max 6 stacks (+18%/+18%). Full: Sigrika +30%/+30%. Per 1% ER over 125%: Echo Skill DMG +2% (max +50%)',
      },
      effects: [
        { kind: 'teamBuff', stat: 'aeroDmgBonus', value: 0.18, durationSec: 0 },
        { kind: 'teamBuff', stat: 'echoSkillDmgBonus', value: 0.18, durationSec: 0 },
      ],
    },
  ],

  // 절지 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Calligrapher's Touch / Flourish.
  zhezhi: [
    {
      id: 'zhezhi-inherent-1',
      name: { ko: '일필휘지', en: "Calligrapher's Touch" },
      description: {
        ko: '공명스킬 Stroke of Genius / Creation\'s Zenith 시전 시 ATK +6%, 27초, 최대 3중첩 (+18%)',
        en: "On Stroke of Genius / Creation's Zenith: ATK +6%, 27s, max 3 stacks (+18%)",
      },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.18 },
      ],
    },
    {
      id: 'zhezhi-inherent-2',
      name: { ko: '화룡점정', en: 'Flourish' },
      description: {
        ko: '아웃트로 시전 후 등장 공명자 공명에너지 +15 회복',
        en: 'After Outro: incoming Resonator gains +15 Resonance Energy',
      },
      effects: [],
    },
  ],

  // 단진 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Crimson Light / Overflow.
  danjin: [
    {
      id: 'danjin-inherent-1',
      name: { ko: '칼날의 빛', en: 'Crimson Light' },
      description: {
        ko: 'Dodge Counter: Ruby Shades로 발동된 공명스킬 Crimson Erosion 피해 +20%, HP 비용/Ruby Blossom 회복량 ×2',
        en: 'Dodge Counter: Ruby Shades-triggered Crimson Erosion DMG +20%, HP cost / Ruby Blossom recovery ×2',
      },
      effects: [
        { kind: 'amplify', value: 0.20, conditional: 'Crimson Erosion via Dodge Counter only' },
      ],
    },
    {
      id: 'danjin-inherent-2',
      name: { ko: '영예', en: 'Overflow' },
      description: {
        ko: '공명스킬 Sanguine Pulse 시전 후 강공격 피해 +30%, 5초',
        en: 'After Sanguine Pulse: Heavy Attack DMG +30%, 5s',
      },
      effects: [
        { kind: 'flatStat', stat: 'heavyDmgBonus', value: 0.30 },
      ],
    },
  ],

  // 구원 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Quietude Within / Drink Away Woes Age-Old.
  qiuyuan: [
    {
      id: 'qiuyuan-inherent-1',
      name: { ko: '고요한 걸음으로', en: 'Quietude Within' },
      description: {
        ko: '강공격 Thus Spoke the Blade 3종 피해 +50%. Inksplash of Mind 진입 시 활성, 10초 (22초 ICD)',
        en: 'Heavy Thus Spoke the Blade 3 variants DMG +50%. Activates in Inksplash of Mind, 10s (22s CD)',
      },
      effects: [
        { kind: 'amplify', value: 0.50, target: 'heavy', conditional: 'Thus Spoke the Blade only, Inksplash of Mind' },
      ],
    },
    {
      id: 'qiuyuan-inherent-2',
      name: { ko: '그대와 함께 달래는 만고의 고뇌', en: 'Drink Away Woes Age-Old' },
      description: {
        ko: '에코 어빌리티 시전 시 Flowing Panacea 생성. 다음 Swordster\'s Soliloquy 획득 시 소모하여 ATK +10%, 20초',
        en: "Echo Skill: create Flowing Panacea. Next Swordster's Soliloquy gain: consume for ATK +10%, 20s",
      },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.10 },
      ],
    },
  ],

  // 루파 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Remember My Name / Applause of Victory.
  lupa: [
    {
      id: 'lupa-inherent-1',
      name: { ko: '내 이름을 기억하라', en: 'Remember My Name' },
      description: {
        ko: '2.5초 대시 후 Sprint 진입, 다음 일반공격이 Basic Attack - Starfall로 대체. 특정 강공/공중공격 시 경직 저항 증가',
        en: 'After 2.5s dash: enter Sprint, next Basic → Basic Attack - Starfall. Interruption resistance enhanced on specific Heavy/Mid-air',
      },
      effects: [],
    },
    {
      id: 'lupa-inherent-2',
      name: { ko: '승리의 박수갈채', en: 'Applause of Victory' },
      description: {
        ko: '표식 적 처치 시 공명스킬 Shewolf\'s Hunt 쿨다운 리셋. 공명해방 Fire-Kissed Glory 시 Glory 부여 — 팀 공격이 적 용융 저항 -3%, 35초 (팀 용융 공명자당 +3%, 최대 -9%, 3명 시 추가 -6%)',
        en: "Defeating marked targets: reset Shewolf's Hunt CD. Liberation grants Glory: team attacks ignore 3% Fusion RES, 35s (+3% per Fusion teammate, max -9%, +extra -6% with 3 Fusion)",
      },
      effects: [
        { kind: 'resPen', element: 'fusion', value: 0.09, durationSec: 35 },
      ],
    },
  ],

  // 도기 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Steadfast Protection / Unyielding.
  taoqi: [
    {
      id: 'taoqi-inherent-1',
      name: { ko: '마음 보호', en: 'Steadfast Protection' },
      description: {
        ko: '공명스킬 Rocksteady Shield 지속 중 캐릭터 DEF +15%',
        en: 'During Resonance Skill Rocksteady Shield: DEF +15%',
      },
      effects: [
        { kind: 'flatStat', stat: 'defPercent', value: 0.15 },
      ],
    },
    {
      id: 'taoqi-inherent-2',
      name: { ko: '우뚝 솟은 산', en: 'Unyielding' },
      description: {
        ko: '강공격 Strategic Parry 발동 성공 시 스태미나 +25 회복',
        en: 'On successful Heavy Attack Strategic Parry: STA +25',
      },
      effects: [],
    },
  ],

  // 복링 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Time Arrives, Evil Declines / Earthly Immortal is Here.
  buling: [
    {
      id: 'buling-inherent-1',
      name: { ko: '시기 도래, 사악 잔파', en: 'Time Arrives, Evil Declines' },
      description: {
        ko: 'HP 50% 미만 공명자 회복 시 회복 보너스 +25%',
        en: 'Healing Bonus +25% when restoring HP for Resonators below 50% HP',
      },
      effects: [],
    },
    {
      id: 'buling-inherent-2',
      name: { ko: '지선 강림', en: 'Earthly Immortal is Here!' },
      description: {
        ko: '인트로 Summon and Smite 피해 목표에 Electro Flare 4스택 부여 (10초 ICD)',
        en: 'Targets damaged by Intro Summon and Smite: +4 Electro Flare stacks (10s ICD)',
      },
      effects: [],
    },
  ],

  // 루미 — wuthering.gg EN 검증 (2026-05-21). 공식 패시브명: Pathfinding / Expediting.
  lumi: [
    {
      id: 'lumi-inherent-1',
      name: { ko: '길찾기', en: 'Pathfinding' },
      description: {
        ko: 'Red Light Mode 중 전도 피해 보너스 +10%',
        en: 'In Red Light Mode: Electro DMG Bonus +10%',
      },
      effects: [
        { kind: 'flatStat', stat: 'electroDmgBonus', value: 0.10 },
      ],
    },
    {
      id: 'lumi-inherent-2',
      name: { ko: '신속', en: 'Expediting' },
      description: {
        ko: 'Energized Pounce 또는 Energized Rebound 시전 시 ATK +10%, 5초',
        en: 'On Energized Pounce / Rebound: ATK +10%, 5s',
      },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.10 },
      ],
    },
  ],

  // 설지 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Harmonic Range / Stimulus Feedback.
  baizhi: [
    {
      id: 'baizhi-inherent-1',
      name: { ko: '하모닉 구간', en: 'Harmonic Range' },
      description: {
        ko: '공명스킬 Emergency Plan 발동 시 You\'tan이 천뢰 필드(Euphonia) 생성, 15초 지속. 획득 캐릭터 ATK +15%, 20초',
        en: "On Skill Emergency Plan: You'tan creates Euphonia field, 15s. Collector: ATK +15%, 20s",
      },
      effects: [
        { kind: 'teamBuff', stat: 'atkPercent', value: 0.15, durationSec: 20 },
      ],
    },
    {
      id: 'baizhi-inherent-2',
      name: { ko: '격려의 피드백', en: 'Stimulus Feedback' },
      description: {
        ko: '강공격 명중 시 팀 내 최저 HP 캐릭터를 본인 최대 HP의 0.25% 회복',
        en: 'On Heavy Attack hit: heal lowest-HP team member by 0.25% of Baizhi Max HP',
      },
      effects: [],
    },
  ],

  // 샤콘 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Interlude Tune / Winds of Rinascita.
  ciaccona: [
    {
      id: 'ciaccona-inherent-1',
      name: { ko: '막간의 반주', en: 'Interlude Tune' },
      description: {
        ko: '공명해방 Singer\'s Triple Cadenza 시전 시 본인 최대 HP의 100% 실드, 4초',
        en: "Liberation Singer's Triple Cadenza: shield = 100% Max HP, 4s",
      },
      effects: [],
    },
    {
      id: 'ciaccona-inherent-2',
      name: { ko: '리나시타의 바람', en: 'Winds of Rinascita' },
      description: {
        ko: '강공격 Quadruple Downbeat 피해 +30%',
        en: 'Heavy Attack Quadruple Downbeat DMG +30%',
      },
      effects: [
        { kind: 'amplify', value: 0.30, target: 'heavy', conditional: 'Quadruple Downbeat only' },
      ],
    },
  ],

  // 유노 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Waxing Ascent / Derivation.
  iuno: [
    {
      id: 'iuno-inherent-1',
      name: { ko: '가득 차오른 달', en: 'Waxing Ascent' },
      description: {
        ko: 'Basic/Heavy/Dodge Counter/Skill/Liberation/Intro 시전 시 본인 ATK의 32% 실드 1개, 15초',
        en: 'On Basic/Heavy/Dodge Counter/Skill/Liberation/Intro: shield = 32% ATK, 15s',
      },
      effects: [],
    },
    {
      id: 'iuno-inherent-2',
      name: { ko: '새로운 탄생', en: 'Derivation' },
      description: {
        ko: '인트로 또는 공명해방 시전 시 창백한 달빛의 축복(Blessing of the Wan Light) 5스택 즉시 획득',
        en: 'On Intro or Liberation: immediately +5 stacks of Blessing of the Wan Light',
      },
      effects: [],
    },
  ],

  // 방랑자·기류 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Sand in the Storm / Boundless Winds.
  'rover-aero': [
    {
      id: 'rover-aero-inherent-1',
      name: { ko: '허공의 먼지', en: 'Sand in the Storm' },
      description: {
        ko: '인트로 Relentless Squall 시전 시 ATK +20%, 10초',
        en: 'On Intro Relentless Squall: ATK +20%, 10s',
      },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.20 },
      ],
    },
    {
      id: 'rover-aero-inherent-2',
      name: { ko: '끝없는 바람', en: 'Boundless Winds' },
      description: {
        ko: '공명해방 Omega Storm 회복량 +20%',
        en: 'Liberation Omega Storm healing +20%',
      },
      effects: [],
    },
  ],

  // 알토 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Perfect Performance / Mid-game Break.
  aalto: [
    {
      id: 'aalto-inherent-1',
      name: { ko: '퍼펙트 퍼포먼스', en: 'Perfect Performance' },
      description: {
        ko: '강공격 시 반드시 크리티컬 발동 (30초 ICD)',
        en: 'Heavy Attack always Crit (30s ICD)',
      },
      effects: [],
    },
    {
      id: 'aalto-inherent-2',
      name: { ko: '하프 타임', en: 'Mid-game Break' },
      description: {
        ko: '공명 회로 Mistcloak Dash 진입 시 스태미나 지속 회복',
        en: 'In Forte Circuit Mistcloak Dash: continuous STA recovery',
      },
      effects: [],
    },
  ],

  // 방랑자·인멸 — wuthering.gg EN 검증 (2026-05-21). 공식 패시브명: Metamorph / Bleak Crescendo.
  'rover-havoc': [
    {
      id: 'rover-havoc-inherent-1',
      name: { ko: '변격', en: 'Metamorph' },
      description: {
        ko: 'Dark Surge 상태에서 인멸 피해 보너스 +20%',
        en: 'In Dark Surge: Havoc DMG Bonus +20%',
      },
      effects: [
        { kind: 'flatStat', stat: 'havocDmgBonus', value: 0.20 },
      ],
    },
    {
      id: 'rover-havoc-inherent-2',
      name: { ko: '음향 전달 효과', en: 'Bleak Crescendo' },
      description: {
        ko: 'Dark Surge 중 일반공격 명중 시 공명에너지 +1 (1초 ICD)',
        en: 'In Dark Surge: Basic Attack hit grants +1 Resonance Energy (1s ICD)',
      },
      effects: [],
    },
  ],

  // 연무 — wuthering.gg EN/KR 검증 (2026-05-21). 공식 패시브명: Thunderous Determination / 빛의 제약 (영문 미확정 — 잔여 P2).
  yuanwu: [
    {
      id: 'yuanwu-inherent-1',
      name: { ko: '결전', en: 'Thunderous Determination' },
      description: {
        ko: '공명스킬 Thunder Uprising 피해 배율 +40%, Vibration Strength 감소 효율 강화',
        en: 'Resonance Skill Thunder Uprising DMG Multiplier +40%, enhanced Vibration Strength reduction',
      },
      effects: [
        { kind: 'skillScaling', skillId: 'yuanwu-skill-1', bonus: 0.40 },
      ],
    },
    {
      id: 'yuanwu-inherent-2',
      name: { ko: '빛의 제약', en: 'Lightning Restraint' },
      description: {
        ko: '공명스킬 뇌전의 늪/신뢰 범위 대폭 증가. 전투 중 퇴장 시 「예리한 뇌전」 미충전 상태면 자동으로 그 자리에 공명스킬 뇌전의 쐐기 1개 잔존',
        en: 'Skills range greatly increased. On exit during combat without full charge: auto-leave 1 Thunder Wedge in place',
      },
      effects: [],
    },
  ],
};
