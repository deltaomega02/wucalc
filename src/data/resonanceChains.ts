// src/data/resonanceChains.ts
import type { ResonanceChainEffect } from '@/types/game';

/**
 * 캐릭터별 공명체인(Resonance Chain) S1~S6 정량 데이터.
 *
 * 출처: WuCalc_06_캐릭터별_딜계산_데이터.md, docs/data-gaps.md (RC-* 추적)
 * - 정확 수치가 확보된 노드만 effects 배열에 등록
 * - 순수 정성적 노드(차단 면역, 경직 면역 등)는 name/description만 기록
 * - 미확정 노드는 자료가 확보될 때까지 본 맵에서 누락 처리 (data-gaps.md 추적)
 *
 * `name` 필드 규칙:
 * - 공식 노드명이 WuCalc_06에 명시된 경우 "S{N} (Official Name)" 형식으로 그대로 인용
 *   (예: 모니에 S2 "Entropic Morning Star", 플로로 S1 "A Key to Netherworld's Secrets")
 * - 공식 노드명이 미공개인 경우 "S{N} — 효과 요약" 형식의 한글 디스크립터 사용
 *   (스킬·메커니즘 명칭은 모두 1차 출처 검증된 영어명 그대로)
 *
 * `effects[].kind`:
 * - 'flatStat': 가산 카테고리 (속성/공격타입 DMG Bonus, ATK%, CritRate 등)
 * - 'skillScaling': Skill Scaling Bonus — MV × (1 + bonus)
 * - 'amplify': Deepen (곱연산 증폭)
 * - 'defIgnore': 적 DEF 무시 (특정 스킬 한정 가능)
 * - 'resPen': 속성 저항 관통
 * - 'critRate'/'teamBuff': 조건부/지속시간 한정 효과
 * - 'coordinatedAttack': 외부 캐릭터에 추가되는 공조 공격 모션값
 */
export const RESONANCE_CHAINS: Record<string, ResonanceChainEffect[]> = {
  // ── 용융 (Fusion) ──
  aemeath: [
    {
      node: 1,
      name: { ko: 'S1 (금빛 가루로 흩뿌려진 첫 새벽)', en: 'S1 (Gilded Glimmer of the First Dawn)' },
      description: {
        ko: '즉시 응답 상태에서 강공격 크리피해 +300% — 처치 시 최고 스택 다음 적에 이월',
        en: 'In Immediate Response: Heavy Crit DMG +300%; max stack carries to next enemy on kill',
      },
      effects: [
        { kind: 'critRate', value: 0, durationSec: 0, conditional: 'immediate-response' },
      ],
    },
    {
      node: 2,
      name: { ko: 'S2 (깃털 눈꽃처럼 선율에 실린 마음)', en: 'S2 (Downy Notes of Snowfluff)' },
      description: { ko: 'Overture/Encore 피해 배율 ×2 (+100%)', en: 'Overture/Encore DMG ×2 (+100%)' },
      effects: [
        { kind: 'skillScaling', skillId: 'aemeath-skill-1', bonus: 1.0 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (끝없는 전자 바다에서 추는 춤)', en: 'S4 (Ethereal Waltz on Binary Tides)' },
      description: { ko: '인트로 또는 핵심 공명스킬 사용 시 팀 전속성 피해 +20%, 30초', en: 'Intro/Core Resonance Skill: team All-Attr DMG +20%, 30s' },
      effects: [
        { kind: 'teamBuff', stat: 'allAttributeDmgBonus', value: 0.20, durationSec: 30 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (봄바람이 그대의 여정을 축복하리)', en: 'S6 (A Zephyr-Kissed Journey to You)' },
      description: {
        ko: '에이메스 공명해방 피해 +40% Amplify. Tune Rupture / Fusion Burst 모드 시 해당 채널 피해 크리율 +80% / 크리피해 +275% 고정. Forte의 Rupturous/Fusion Trail 부여 스택 ×2, 최대 스택 30→60. Seraphic Duet이 범위 내 적에 10스택 부여',
        en: "Aemeath's Liberation DMG +40% Amplify. In Tune Rupture/Fusion Burst mode: fixed +80% Crit Rate and +275% Crit DMG for that channel. Forte trails: stacks ×2, max 30→60. Seraphic Duet inflicts 10 trail stacks",
      },
      effects: [
        { kind: 'amplify', value: 0.40, target: 'liberation' },
      ],
    },
  ],

  brant: [
    {
      node: 1,
      name: { ko: 'S1 (해류와 바람을 따라서)', en: 'S1 (By Currents and Winds)' },
      description: { ko: '아웃트로 후 다음 공명자 스킬 명중 시 ATK의 440% 용융 피해 추가 폭격', en: 'Outro: next resonator skill triggers 440% ATK Fusion strike' },
      effects: [
        { kind: 'coordinatedAttack', sourceSkillId: 'brant-intro-3', mvPercent: 4.40 },
      ],
    },
    {
      node: 2,
      name: { ko: 'S2 (환호와 미소를 위하여)', en: 'S2 (For Smiles and Cheers)' },
      description: { ko: '공중공격 및 Returned from Ashes 사용 시 크리율 +30%', en: 'Aerial/Returned from Ashes: Crit Rate +30%' },
      effects: [
        { kind: 'flatStat', stat: 'critRate', value: 0.30 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (폭풍과 파도를 헤치며)', en: 'S3 (Through Storms I Sail)' },
      description: { ko: 'Returned from Ashes 피해 배율 +42%', en: 'Returned from Ashes scaling +42%' },
      effects: [
        { kind: 'skillScaling', skillId: 'brant-liberation-2', bonus: 0.42 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (배우 왈, 「인생이 곧 무대다!」)', en: "S5 (All the World's an Actor's Stage)" },
      description: { ko: '일반공격 피해 시 일반공격 피해 보너스 +15%', en: 'On Basic Attack hit: Basic ATK DMG +15%' },
      effects: [
        { kind: 'flatStat', stat: 'normalDmgBonus', value: 0.15 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (선장 왈, 「카니발이 곧 세계다!」)', en: "S6 (All the World's a Captain's Carnevale)" },
      description: { ko: '공중공격 피해 배율 +30%', en: 'Aerial attack scaling +30%' },
      effects: [
        { kind: 'skillScaling', skillId: 'brant-normal-0', bonus: 0.30 },
      ],
    },
  ],

  changli: [
    {
      node: 2,
      name: { ko: 'S2 (바라는 소원)', en: 'S2 (Pursuit of Desires)' },
      description: { ko: 'Enflamement 스택 보유 시 크리율 +25%, 8초', en: 'With Enflamement stacks: Crit Rate +25%, 8s' },
      effects: [
        { kind: 'critRate', value: 0.25, durationSec: 8, conditional: 'enflamement>0' },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (풍문의 축적)', en: 'S3 (Learned Secrets)' },
      description: { ko: '공명해방 Radiance of Fealty 피해 +80%', en: 'Liberation Radiance of Fealty DMG +80%' },
      effects: [
        { kind: 'skillScaling', skillId: 'changli-liberation-2', bonus: 0.80 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (언어의 미학)', en: 'S4 (Polished Words)' },
      description: { ko: '인트로 사용 후 팀 ATK +20%, 30초', en: 'After intro: team ATK +20%, 30s' },
      effects: [
        { kind: 'teamBuff', stat: 'atkPercent', value: 0.20, durationSec: 30 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (해탈의 성취)', en: 'S5 (Sacrificed Gains)' },
      description: { ko: 'Flaming Sacrifice 배율 +50% + 피해량 +50%', en: 'Flaming Sacrifice scaling +50% and DMG +50%' },
      effects: [
        { kind: 'skillScaling', skillId: 'changli-skill-1', bonus: 0.50 },
        { kind: 'flatStat', stat: 'heavyDmgBonus', value: 0.50 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (치밀한 계획)', en: 'S6 (Realized Plans)' },
      description: { ko: 'Tripartite Flames/Flaming Sacrifice/Radiance of Fealty가 적 DEF 추가 40% 무시', en: 'Core 3 skills additionally ignore 40% enemy DEF' },
      effects: [
        {
          kind: 'defIgnore',
          value: 0.40,
          skillIds: ['changli-skill-1', 'changli-liberation-2'],
        },
      ],
    },
  ],

  encore: [
    {
      node: 1,
      name: { ko: 'S1 (그늘이와 구름이의 동화책)', en: "S1 (Wooly's Fairy Tale)" },
      description: { ko: '일반공격 명중 시 용융 피해 +3%, 6초, 최대 4중첩 (+12%)', en: 'On Basic hit: Fusion DMG +3%, 6s, max 4 stacks (+12%)' },
      effects: [
        { kind: 'flatStat', stat: 'fusionDmgBonus', value: 0.12 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (안개? 검은해안!)', en: 'S3 (Fog? The Black Shores!)' },
      description: { ko: '공명해방 Cloudy: Frenzy / Cosmos: Rupture 배율 +40% (Skill Scaling Bonus)', en: 'Liberation Cloudy: Frenzy / Cosmos: Rupture scaling +40%' },
      effects: [
        { kind: 'skillScaling', skillId: 'encore-liberation-2', bonus: 0.40 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (모험? 재밌어!)', en: "S4 (Adventure? Let's go!)" },
      description: { ko: '공명해방 Cosmos: Rupture가 팀 용융 피해 보너스 +20%, 30초', en: 'Cosmos: Rupture grants team Fusion DMG +20%, 30s' },
      effects: [
        { kind: 'teamBuff', stat: 'fusionDmgBonus', value: 0.20, durationSec: 30 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (주목주목, 용사 등장!)', en: 'S5 (Hero Takes the Stage!)' },
      description: { ko: '공명스킬 피해 보너스 +35%', en: 'Resonance Skill DMG Bonus +35%' },
      effects: [
        { kind: 'flatStat', stat: 'skillDmgBonus', value: 0.35 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (그늘이와 구름이가 세계를 구한다!)', en: 'S6 (Woolies Save the World!)' },
      description: { ko: '공명해방 Cosmos: Rave 중 피해 시 Lost Lamb 1스택 ATK +5%, 10초, 최대 6중첩 (+30% ATK)', en: 'During Cosmos: Rave hits: ATK +5%, 10s, max 6 stacks (+30%)' },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.30 },
      ],
    },
  ],

  galbrena: [
    {
      node: 1,
      name: { ko: 'S1 (영원히 타오르는 저항의 마음)', en: 'S1 (Heart of Defiance Ever Ablaze)' },
      description: { ko: 'Afterflame 1점당 주요 스킬 크리피해 +2% (Afterflame 40 풀스택 = +80%)', en: 'Per Afterflame point: core skill Crit DMG +2% (max +80% at 40 stacks)' },
      effects: [
        { kind: 'flatStat', stat: 'critDmg', value: 0.80 },
      ],
    },
    {
      node: 2,
      name: { ko: 'S2 (연옥과 암흑을 지나는 길)', en: 'S2 (Hellbound Dive of Fire and Abyss)' },
      description: { ko: 'Burning Drive ATK 보너스 +350%', en: 'Burning Drive ATK bonus +350%' },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 3.50 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (타오른 피로 쓴 사냥의 맹세)', en: "S3 (Hunter's Blood Oath Rekindled)" },
      description: { ko: '공명해방 배율 +130% (Skill Scaling Bonus)', en: 'Liberation scaling +130%' },
      effects: [
        { kind: 'skillScaling', skillId: 'galbrena-liberation-2', bonus: 1.30 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (홀로 짊어진 고통의 불길)', en: 'S4 (Carry Forth This Fading Spark)' },
      description: { ko: '팀원 Echo 스킬 시전 시 팀 전속성 피해 +20%, 20초', en: 'On team Echo Skill: team All-Attr DMG +20%, 20s' },
      effects: [
        { kind: 'teamBuff', stat: 'allAttributeDmgBonus', value: 0.20, durationSec: 20 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (빛이 멀어져도, 재앙에 타들어가도)', en: 'S5 (Though Light Fades, Torment Consumes)' },
      description: { ko: '공명스킬 Encroach/Ascent of Malice/Ravage 배율 +150%', en: 'Resonance Skill scaling +150%' },
      effects: [
        { kind: 'skillScaling', skillId: 'galbrena-skill-1', bonus: 1.50 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (영원히 불태워 자신을 증명해)', en: 'S6 (I Remain Who I am, Eternal My Flame)' },
      description: { ko: 'Eternal Hypostasis 강화: 일반/강공/공중/회피 카운터 배율 +60%', en: 'Eternal Hypostasis: Basic/Heavy/Aerial/Dodge Counter scaling +60%' },
      effects: [
        { kind: 'skillScaling', skillId: 'galbrena-normal-0', bonus: 0.60 },
      ],
    },
  ],

  // ── 응결 (Glacio) — 히유키 (3.3 신규) ──
  hiyuki: [
    {
      node: 1,
      name: { ko: 'S1 (오지 않는 봄이여)', en: 'S1 (Spring That Never Comes)' },
      description: {
        ko: '선견력 공격(일반·강·공중·회피반격) 피해 +120%, 일반공격 3단 끌어당김',
        en: 'Foresight attacks (basic/heavy/aerial/dodge counter) DMG +120%; Stage 3 pulls enemies',
      },
      effects: [
        { kind: 'skillScaling', skillId: 'hiyuki-normal-0', bonus: 1.20 },
      ],
    },
    {
      node: 2,
      name: { ko: 'S2 (고요히 타오르는 얼음의 불꽃)', en: 'S2 (Silently Burning Ice Flame)' },
      description: {
        ko: '일반공격 거합 피해 +125%, 변하는 세상이 3pt 서리 단조 납도 회복으로 강화, 선견력 상태에서 서리의 힘 거합 3pt 회복',
        en: 'Iai Strike DMG +125%; Changing World restores 3pt Frost Forge Sheath instead of 1pt',
      },
      effects: [],
    },
    {
      node: 3,
      name: { ko: 'S3 (공허한 몸에 깃든 무한한 가능성)', en: 'S3 (Infinite Possibilities in Empty Body)' },
      description: {
        ko: '속삭이는 눈 추가 효과: 편성 시 즉시 1스택 자동 획득. 강공격 서리 결정·서리 나무 피해 +160%. 눈의 침식 2스택 시 이상 효과 피해 +488%',
        en: 'Whispering Eye: auto 1 Snow Rust on join. Heavy Frost Crystal/Tree DMG +160%. At 2 Snow Rust: anomaly DMG +488%',
      },
      effects: [
        { kind: 'skillScaling', skillId: 'hiyuki-skill-4', bonus: 1.60 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (물결 사이에 떠다니는 갈대처럼)', en: 'S4 (Like a Reed Drifting on Waves)' },
      description: {
        ko: '공명스킬 「서리의 징벌」 발동 시 파티 전체 피해 +20%, 30초. 매 발동마다 최대 HP의 18% 회복',
        en: 'On Frostblight cast: team DMG +20%, 30s. Each cast: 18% max HP heal',
      },
      effects: [
        { kind: 'teamBuff', stat: 'allAttributeDmgBonus', value: 0.20, durationSec: 30 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (무수한 기도와 소원이 와도)', en: 'S5 (Countless Prayers and Wishes)' },
      description: {
        ko: '공명스킬 「서리의 징벌」 피해 +80%',
        en: 'Frostblight (Resonance Skill) DMG +80%',
      },
      effects: [
        { kind: 'skillScaling', skillId: 'hiyuki-skill-1', bonus: 0.80 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (설령 그 끝이 영원한 밤에 기다린다 해도)', en: 'S6 (Even If the End Awaits in Eternal Night)' },
      description: {
        ko: '독심·납도 크리티컬 피해 +500%. 눈의 침식 효과 개편: 파티원 서리 효과 시에도 이상 피해. 눈의 침식 2스택 시 크리피해 +40%, 3스택 시 냉해 효과 최종 피해 +25%',
        en: 'Mind-Reading/Sheath Crit DMG +500%. Whispering Eye triggers on team Glacio Chafe too. At 2 Snow Rust: Crit DMG +40%. At 3 Snow Rust: final Glacio Bite DMG +25%',
      },
      effects: [
        { kind: 'flatStat', stat: 'critDmg', value: 5.00 },
      ],
    },
  ],

  // ── 응결 (Glacio) ──
  carlotta: [
    {
      node: 2,
      name: { ko: 'S2 (고독과 죽음, 몰락은 곧 새로운 탄생)', en: 'S2 (Fallen Petals Give Life to New Blooms)' },
      description: { ko: '공명해방 Fatal Finale 배율 +126%', en: 'Liberation Fatal Finale scaling +126%' },
      effects: [
        { kind: 'skillScaling', skillId: 'carlotta-liberation-2', bonus: 1.26 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (과거의 비로, 찬송의 술을 위하여)', en: "S4 (Yesterday's Raindrops Make Finest Wine)" },
      description: { ko: '강공격/Containment Tactics/Imminent Oblivion 시 30초간 팀 공명스킬 피해 +25%', en: 'Heavy/Containment Tactics/Imminent Oblivion: team Skill DMG +25%, 30s' },
      effects: [
        { kind: 'teamBuff', stat: 'skillDmgBonus', value: 0.25, durationSec: 30 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (종막 앞에 선 예전 그대로의 나)', en: 'S6 (As the Curtain Falls, I Remain What I Am)' },
      description: { ko: '공명해방 Death Knell 사격 시 크리스탈 파편 ×2 + 배율 총 +186.6%', en: 'Death Knell: shards ×2, scaling +186.6%' },
      effects: [
        { kind: 'skillScaling', skillId: 'carlotta-liberation-2', bonus: 1.866 },
      ],
    },
  ],

  youhu: [
    {
      node: 3,
      name: { ko: 'S3 (화염의 악몽)', en: 'S3 (Restless Sleep)' },
      description: { ko: '본인 ATK +20%', en: 'Self ATK +20%' },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.20 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (만리의 수면)', en: 'S5 (Dreamland Meander)' },
      description: { ko: '인트로 후 14초간 크리율 +15%', en: 'After intro: Crit Rate +15%, 14s' },
      effects: [
        { kind: 'critRate', value: 0.15, durationSec: 14 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (천년의 단잠)', en: 'S6 (Slumber Evermore)' },
      description: { ko: '공명스킬 사용 시 Sky Blue 1스택 (최대 4, 7초), 스택당 크리피해 +15% (풀스택 +60%)', en: 'On Skill: Sky Blue stack (max 4, 7s), per stack Crit DMG +15% (max +60%)' },
      effects: [
        { kind: 'flatStat', stat: 'critDmg', value: 0.60 },
      ],
    },
  ],

  zhezhi: [
    {
      node: 1,
      name: { ko: 'S1 (골법용필)', en: "S1 (Brushwork's Finish)" },
      description: { ko: '공명스킬 Creation\'s Zenith 시 공명에너지 +15, 27초간 크리율 +10%', en: 'On Skill Creation\'s Zenith: Energy +15, Crit Rate +10% for 27s' },
      effects: [
        { kind: 'critRate', value: 0.10, durationSec: 27 },
      ],
    },
    {
      node: 2,
      name: { ko: 'S2 (기운생동)', en: 'S2 (Vivid Strokes)' },
      description: { ko: '공명해방 Living Canvas의 Inklit Spirits 최대 소환 수 +6', en: 'Liberation Living Canvas: max Inklit Spirits +6' },
      effects: [],
    },
    {
      node: 3,
      name: { ko: 'S3 (응물상형)', en: "S3 (Reflection's Grace)" },
      description: { ko: '공명스킬 Manifestation/Stroke of Genius/Creation\'s Zenith 시전 시 ATK +15%, 27초, 최대 3중첩 (+45%)', en: 'On Manifestation/Stroke of Genius/Creation\'s Zenith: ATK +15%, 27s, max 3 stacks (+45%)' },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.45 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (수류부채)', en: "S4 (Hue's Spectrum)" },
      description: { ko: '파티 ATK +20%, 30초', en: 'Party ATK +20%, 30s' },
      effects: [
        { kind: 'teamBuff', stat: 'atkPercent', value: 0.20, durationSec: 30 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (경영위치)', en: "S5 (Composition's Clue)" },
      description: { ko: 'Inklit Spirits 3마리당 추가 1마리가 공조 공격 — Inklit Spirit 피해의 140% (=45.92% ATK), 일반공격 피해로 간주', en: "Per 3 Inklit Spirits summoned: +1 extra performs Coordinated Attack — 140% of Inklit DMG (=45.92% ATK), counts as Basic Attack DMG" },
      effects: [
        { kind: 'coordinatedAttack', sourceSkillId: 'zhezhi-liberation-2', mvPercent: 0.4592 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (전이모사)', en: 'S6 (Infinite Legacy)' },
      description: { ko: 'Stroke of Genius 또는 Creation\'s Zenith 시전 시 Ivory Herald 추가 소환 — Stroke of Genius 피해의 120%', en: "On Stroke of Genius / Creation's Zenith: extra Ivory Herald deals 120% of Stroke of Genius DMG" },
      effects: [
        { kind: 'skillScaling', skillId: 'zhezhi-skill-1', bonus: 1.20 },
      ],
    },
  ],

  // ── 기류 (Aero) ──
  cartethyia: [
    {
      node: 1,
      name: { ko: 'S1 (운명을 짊어진 면류관)', en: 'S1 (Crown Destined by Fate)' },
      description: { ko: 'Resolve 30당 크리피해 +20%, 15초 (Resolve 90 = +60%)', en: 'Per 30 Resolve: Crit DMG +20%, 15s (max +60% at 90)' },
      effects: [
        { kind: 'critRate', value: 0, durationSec: 15, conditional: 'resolve>=30' },
        { kind: 'flatStat', stat: 'critDmg', value: 0.60 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (스스로 갇힌 높은 탑)', en: 'S3 (Prisoner Hanged in the Tower)' },
      description: { ko: '공명해방 배율 ×2', en: 'Liberation scaling ×2' },
      effects: [
        { kind: 'skillScaling', skillId: 'cartethyia-liberation-2', bonus: 1.0 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (바람에서 피어난 희망)', en: 'S4 (Sacrifice Made for Salvation)' },
      description: { ko: '피해 +20% + 치명타 회피·10% HP 회복·80% 피해 감소 (10초)', en: 'Self DMG +20% + crit dodge/10% HP heal/80% DR (10s)' },
      effects: [
        { kind: 'amplify', value: 0.20 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (구원을 위한 희생)', en: 'S5 (Hope Reshaped in Storms)' },
      description: { ko: '디버프 적 시 팀 전속성 피해 +20%, 20초', en: 'Vs debuffed enemy: team All-Attr DMG +20%, 20s' },
      effects: [
        { kind: 'teamBuff', stat: 'allAttributeDmgBonus', value: 0.20, durationSec: 20 },
      ],
    },
  ],

  jiyan: [
    {
      node: 1,
      name: { ko: 'S1 (구원)', en: 'S1 (Benevolence)' },
      description: { ko: '공명스킬 Windqueller 추가 시전 가능 + Resolve 비용 -15', en: 'Extra Skill Windqueller + Resolve cost -15' },
      effects: [],
    },
    {
      node: 2,
      name: { ko: 'S2 (변통)', en: 'S2 (Versatility)' },
      description: { ko: '인트로 후 Resolve +30 + ATK +28%, 15초', en: 'After intro: Resolve +30, ATK +28%, 15s' },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.28 },
      ],
    },
  ],

  // ── 전도 (Electro) ──
  yinlin: [
    {
      node: 1,
      name: { ko: 'S1 (양난의 선택)', en: "S1 (Morality's Crossroads)" },
      description: { ko: 'Magnetic Roar · Lightning Execution 피해 +70% (Skill Scaling Bonus)', en: 'Magnetic Roar / Lightning Execution scaling +70%' },
      effects: [
        { kind: 'skillScaling', skillId: 'yinlin-skill-1', bonus: 0.70 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (냉정한 판결)', en: 'S3 (Unyielding Verdict)' },
      description: { ko: 'Forte Judgment Strike 배율 +55%', en: 'Forte Judgment Strike scaling +55%' },
      effects: [
        { kind: 'skillScaling', skillId: 'yinlin-skill-4', bonus: 0.55 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (전진의 격려)', en: 'S4 (Steadfast Conviction)' },
      description: { ko: 'Judgment Strike 적중 시 팀 ATK +20%, 12초', en: 'On Judgment Strike hit: team ATK +20%, 12s' },
      effects: [
        { kind: 'teamBuff', stat: 'atkPercent', value: 0.20, durationSec: 12 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (결의의 울림)', en: 'S5 (Resounding Will)' },
      description: { ko: '공명해방이 Sinner\'s Mark/Punishment Mark 적에게 +100% 피해', en: 'Liberation deals +100% DMG to Marked enemies' },
      effects: [
        { kind: 'amplify', value: 1.0, target: 'liberation', conditional: 'Liberation only vs Sinner/Punishment Marked target' },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (정의의 이행)', en: 'S6 (Pursuit of Justice)' },
      description: { ko: '공명해방 후 30초간 일반공격 적중 시 ATK의 419.59% 전도 피해', en: 'After Liberation 30s: Basic Attack triggers 419.59% ATK Electro damage' },
      effects: [
        { kind: 'coordinatedAttack', sourceSkillId: 'yinlin-liberation-2', mvPercent: 4.1959 },
      ],
    },
  ],

  calcharo: [
    {
      node: 2,
      name: { ko: 'S2 (제로섬 게임)', en: 'S2 (Zero-Sum Game)' },
      description: { ko: '인트로 후 공명스킬 피해 보너스 +30%, 15초', en: 'After intro: Resonance Skill DMG +30%, 15s' },
      effects: [
        { kind: 'flatStat', stat: 'skillDmgBonus', value: 0.30 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (강권 외교)', en: 'S3 (Iron Fist Diplomacy)' },
      description: { ko: 'Deathblade Gear 상태 중 전도 피해 보너스 +25%', en: 'During Deathblade Gear: Electro DMG +25%' },
      effects: [
        { kind: 'flatStat', stat: 'electroDmgBonus', value: 0.25 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (무리의 위협)', en: 'S4 (Dark Alliance)' },
      description: { ko: '아웃트로 후 팀 전도 피해 +20%, 30초', en: 'After outro: team Electro DMG +20%, 30s' },
      effects: [
        { kind: 'teamBuff', stat: 'electroDmgBonus', value: 0.20, durationSec: 30 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (위탁 협상)', en: 'S5 (Unconventional Compact)' },
      description: { ko: '인트로 Wanted Criminal / Necessary Means 피해 +50%', en: 'Intro Wanted Criminal / Necessary Means DMG +50%' },
      effects: [
        { kind: 'skillScaling', skillId: 'calcharo-intro-3', bonus: 0.50 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (마지막 기회)', en: 'S6 (The Ultimatum)' },
      description: { ko: '공명해방 Death Messenger 시 Phantom 2기 — 각각 본인 ATK의 100% 전도 피해 (공명해방 피해로 간주)', en: 'Liberation Death Messenger: 2 Phantoms — each deals 100% of Calcharo ATK as Electro DMG (counts as Liberation)' },
      effects: [
        { kind: 'coordinatedAttack', sourceSkillId: 'calcharo-liberation-2', mvPercent: 1.00 },
      ],
    },
  ],

  'xiangli-yao': [
    {
      node: 6,
      name: { ko: 'S6 (도시의 연기)', en: 'S6 (Solace of the Ordinary)' },
      description: { ko: 'Sportskeeda 측정 213.35% 상대 파워 (정확 효과 데이터 갭)', en: 'Sportskeeda measured 213.35% relative power (exact effect gap)' },
      effects: [],
    },
  ],

  // ── 회절 (Spectro) ──
  jinhsi: [
    {
      node: 1,
      name: { ko: 'S1 (승천하는 물결)', en: 'S1 (Abyssal Ascension)' },
      description: { ko: '일반/Crescent Divinity 시 스택 (최대 4, 6초), Illuminous Epiphany 시 소모, 스택당 피해 +20% (풀스택 +80%)', en: 'Per stack: DMG +20% (max 4, +80%)' },
      effects: [
        { kind: 'amplify', value: 0.80, target: 'skill', conditional: 'Illuminous Epiphany (skill) full stack only' },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (운명적인 사도)', en: 'S3 (Celestial Incarnate)' },
      description: { ko: '인트로 후 Incandescence +12 + ATK +25% (20초, 최대 2스택 = +50%)', en: 'After intro: ATK +25%, 20s, max 2 stacks (+50%)' },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.50 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (인간 세상의 수호자)', en: 'S4 (Benevolent Grace)' },
      description: { ko: '공명해방 또는 강화 공명스킬 시 팀 속성 피해 +20%, 20초', en: 'On Liberation/Empowered Skill: team Element DMG +20%, 20s' },
      effects: [
        { kind: 'teamBuff', stat: 'allAttributeDmgBonus', value: 0.20, durationSec: 20 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (눈을 녹이는 햇살)', en: 'S5 (Frostfire Illumination)' },
      description: { ko: '공명해방 배율 ×2.2 (Skill Scaling Bonus)', en: 'Liberation scaling ×2.2' },
      effects: [
        { kind: 'skillScaling', skillId: 'jinhsi-liberation-2', bonus: 1.20 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (엄동설한 끝에 비추는 봄)', en: 'S6 (Thawing Triumph)' },
      description: { ko: '강화 공명스킬 III 배율 +45%, Incandescence 스택 소모 추가 배율 +45%', en: 'Empowered Skill III scaling +45%, additional +45% per Incandescence consumed' },
      effects: [
        { kind: 'skillScaling', skillId: 'jinhsi-skill-4', bonus: 0.45 },
      ],
    },
  ],

  'luuk-herssen': [
    {
      node: 2,
      name: { ko: 'S2 (끊이지 않고 펼쳐지는 눈사태)', en: 'S2 (Avalanche Roaring in Eyes)' },
      description: { ko: '공명해방 배율 +60%, Uncaused Diagnosis가 Interfered 적에게 추가 피해 증폭 +10% (최대 +60%)', en: 'Liberation scaling +60%; vs Interfered: Uncaused Diagnosis additional Amplify +10% (max +60%)' },
      effects: [
        { kind: 'skillScaling', skillId: 'luuk-herssen-liberation-2', bonus: 0.60 },
        { kind: 'amplify', value: 0.60, conditional: 'target Interfered' },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (그대의 의지를 일깨우는 금비)', en: 'S3 (Spine Tempered by Golden Rain)' },
      description: { ko: 'Aureate Judge 상태에서 모든 Aureole of Execution 배율 +136%', en: 'In Aureate Judge: Aureole of Execution scaling +136%' },
      effects: [
        { kind: 'skillScaling', skillId: 'luuk-herssen-skill-4', bonus: 1.36 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (얼어붙은 땅 아래에도, 새 생명은 움트니)', en: 'S4 (Pulse Thrumming Under Rime)' },
      description: { ko: '아군이 Tune Break 피해 시 팀 피해 +20%, 20초', en: 'On ally Tune Break: team DMG +20%, 20s' },
      effects: [
        { kind: 'teamBuff', stat: 'allAttributeDmgBonus', value: 0.20, durationSec: 20 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (눈보라가 만든 침묵의 장을 지나)', en: 'S5 (Through the Stillness of Snowstorm)' },
      description: { ko: '인트로/아웃트로 피해 보너스 +80%, 기본 공명스킬 배율 +50%, 쿨다운 -2초, 충전수 +1', en: 'Intro/Outro DMG +80%; base Skill scaling +50%; CD -2s; +1 charge' },
      effects: [
        { kind: 'flatStat', stat: 'introDmgBonus', value: 0.80 },
        { kind: 'flatStat', stat: 'outroDmgBonus', value: 0.80 },
        { kind: 'skillScaling', skillId: 'luuk-herssen-skill-1', bonus: 0.50 },
      ],
    },
  ],

  lynae: [
    {
      node: 2,
      name: { ko: 'S2 (빛이 엮이는 저편을 향해)', en: "S2 (Into Lights' Vanishing Point)" },
      description: { ko: '본인 전속성 피해 증폭 +25%, 아웃트로가 다음 캐릭에게 전속성 피해 증폭 +25% 추가', en: 'Self All-Attr Amplify +25%; outro grants extra +25% Amplify' },
      effects: [
        { kind: 'amplify', value: 0.25 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (찰나의 반짝임을 위하여)', en: 'S3 (For One Brilliant Moment)' },
      description: { ko: 'Visual Impact 배율 +90%, Premixed Hue가 Additive Color에도 적용', en: 'Visual Impact scaling +90%; Premixed Hue applies to Additive Color too' },
      effects: [
        { kind: 'skillScaling', skillId: 'lynae-skill-4', bonus: 0.90 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (바람결에 흐르는 어두운 그림자)', en: 'S4 (Shadows of a Wind Racer)' },
      description: { ko: 'ATK +20%', en: 'ATK +20%' },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.20 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (자유롭게 그리는 미래)', en: 'S5 (Visions of a Future Unbound)' },
      description: { ko: 'Prismatic Overblast 배율 +70%', en: 'Prismatic Overblast scaling +70%' },
      effects: [
        { kind: 'skillScaling', skillId: 'lynae-liberation-2', bonus: 0.70 },
      ],
    },
  ],

  phoebe: [
    {
      node: 4,
      name: { ko: 'S4 (다시 울려 퍼지는 날갯짓의 종소리)', en: 'S4 (Ringing Bells on Wings Aloft)' },
      description: { ko: '적 회절 저항 감소 (구체 수치 데이터 갭 — RC-21)', en: 'Enemy Spectro RES reduction (exact value gap — RC-21)' },
      effects: [],
    },
    {
      node: 5,
      name: { ko: 'S5 (머나먼 빛을 향한 기도)', en: 'S5 (Prayer to the Distant Light)' },
      description: { ko: '회절 피해 보너스 추가 (구체 수치 데이터 갭)', en: 'Additional Spectro DMG Bonus (value gap)' },
      effects: [],
    },
  ],

  'rover-spectro': [
    {
      node: 1,
      name: { ko: 'S1 (시초의 기행)', en: 'S1 (Odyssey of Beginnings)' },
      description: { ko: '공명스킬 시 크리율 +15%, 7초', en: 'On Skill: Crit Rate +15%, 7s' },
      effects: [
        { kind: 'critRate', value: 0.15, durationSec: 7 },
      ],
    },
    {
      node: 2,
      name: { ko: 'S2 (작은 속삭임)', en: 'S2 (Microcosmic Murmurs)' },
      description: { ko: '회절 피해 보너스 +20%', en: 'Spectro DMG Bonus +20%' },
      effects: [
        { kind: 'flatStat', stat: 'spectroDmgBonus', value: 0.20 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (만물의 소리)', en: 'S3 (Visages of Dust)' },
      description: { ko: '에너지 충전 +20%', en: 'Energy Regen +20%' },
      effects: [
        { kind: 'flatStat', stat: 'energyRegen', value: 0.20 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (울림의 흐름)', en: 'S5 (Temporal Virtuoso)' },
      description: { ko: '공명해방 피해 보너스 +40%', en: 'Liberation DMG Bonus +40%' },
      effects: [
        { kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.40 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (먼길의 결말)', en: 'S6 (Echoes of Wanderlust)' },
      description: { ko: '공명스킬 명중 시 적 회절 저항 -10%, 20초', en: 'On Skill hit: enemy Spectro RES -10%, 20s' },
      effects: [
        { kind: 'resPen', element: 'spectro', value: 0.10, durationSec: 20 },
      ],
    },
  ],

  shorekeeper: [
    {
      node: 2,
      name: { ko: 'S2 (야밤의 선물과 거절)', en: "S2 (Night's Gift and Refusal)" },
      description: { ko: 'Outer Stellarealm이 팀 ATK +40%', en: 'Outer Stellarealm grants team ATK +40%' },
      effects: [
        { kind: 'teamBuff', stat: 'atkPercent', value: 0.40, durationSec: 0 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (새로운 세상으로)', en: 'S6 (To the New World)' },
      description: { ko: '인트로 Discernment 배율 +42%', en: 'Intro Discernment scaling +42%' },
      effects: [
        { kind: 'skillScaling', skillId: 'shorekeeper-intro-2', bonus: 0.42 },
      ],
    },
  ],

  verina: [
    {
      node: 4,
      name: { ko: 'S4 (만발한 꽃의 포옹)', en: 'S4 (Blossoming Embrace)' },
      description: { ko: 'Forte 강공/공중공격/공명해방/아웃트로 시 팀 회절 피해 +15%, 24초', en: 'On Forte/Liberation/Outro: team Spectro DMG +15%, 24s' },
      effects: [
        { kind: 'teamBuff', stat: 'spectroDmgBonus', value: 0.15, durationSec: 24 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (수확의 희열)', en: 'S6 (Joyous Harvest)' },
      description: { ko: 'Forte 강공/공중공격 피해 +20%', en: 'Forte Heavy/Aerial DMG +20%' },
      effects: [
        { kind: 'flatStat', stat: 'heavyDmgBonus', value: 0.20 },
      ],
    },
  ],

  zani: [
    {
      node: 1,
      name: { ko: 'S1 (아침 알람이 울릴 때)', en: 'S1 (When the Alarm Clock Rings)' },
      description: { ko: 'Targeted Action/Forcible Riposte 시 회절 피해 +50%, 14초', en: 'On Targeted Action/Forcible Riposte: Spectro DMG +50%, 14s' },
      effects: [
        { kind: 'flatStat', stat: 'spectroDmgBonus', value: 0.50 },
      ],
    },
    {
      node: 2,
      name: { ko: 'S2 (차가운 빵과 음료)', en: 'S2 (Stale Bread With Energy Drink)' },
      description: { ko: '크리율 +20%, Targeted Action/Forcible Riposte 배율 +80%', en: 'Crit Rate +20%, Targeted/Riposte scaling +80%' },
      effects: [
        { kind: 'flatStat', stat: 'critRate', value: 0.20 },
        { kind: 'skillScaling', skillId: 'zani-skill-4', bonus: 0.80 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (매일 반복되는 통근)', en: 'S3 (Each Day A New Commute)' },
      description: { ko: 'Inferno 모드 중 Blaze 1점 소모마다 공명해방 The Last Stand 배율 +8% (최대 +1200%, Skill Scaling Bonus)', en: 'Per Blaze consumed: Liberation scaling +8% (max +1200%)' },
      effects: [
        { kind: 'skillScaling', skillId: 'zani-liberation-2', bonus: 12.00 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (고효율 에너지 절약 주의자)', en: 'S4 (More Efficiency, Less Drama)' },
      description: { ko: '인트로 Immediate Execution 시 팀 ATK +20%, 30초', en: 'On Intro Immediate Execution: team ATK +20%, 30s' },
      effects: [
        { kind: 'teamBuff', stat: 'atkPercent', value: 0.20, durationSec: 30 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (모든 일은 제때 처리)', en: 'S5 (Delivered In Full On Time)' },
      description: { ko: '공명해방 Rekindle 배율 +120%', en: 'Liberation Rekindle scaling +120%' },
      effects: [
        { kind: 'skillScaling', skillId: 'zani-liberation-2', bonus: 1.20 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (급한 일? 퇴근!)', en: 'S6 (First Things First? Clock Out!)' },
      description: { ko: 'Heavy Slash 4종 배율 +40%, Blaze 1점 소모마다 Heavy Slash - Nightfall 명중 시 배율 +40%', en: 'Heavy Slash 4× scaling +40%; per Blaze consumed: Nightfall +40%' },
      effects: [
        { kind: 'skillScaling', skillId: 'zani-skill-1', bonus: 0.40 },
      ],
    },
  ],

  // ── 인멸 (Havoc) ──
  camellya: [
    {
      node: 1,
      name: { ko: 'S1 (나만의 비밀스러운 오솔길에서)', en: 'S1 (Somewhere No One Travelled)' },
      description: { ko: '인트로 Everblooming 시 크리피해 +28%, 18초 (25초 1회)', en: 'On Intro Everblooming: Crit DMG +28%, 18s (1×/25s)' },
      effects: [
        { kind: 'flatStat', stat: 'critDmg', value: 0.28 },
      ],
    },
    {
      node: 2,
      name: { ko: 'S2 (침묵의 꽃 향기를 부르며)', en: 'S2 (Calling Upon the Silent Rose)' },
      description: { ko: '공명스킬 Ephemeral 배율 +120%', en: 'Resonance Skill Ephemeral scaling +120%' },
      effects: [
        { kind: 'skillScaling', skillId: 'camellya-skill-1', bonus: 1.20 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (모든 꽃씨보다 소중한 가시덤불)', en: 'S3 (A Bud Adorned by Thorns)' },
      description: { ko: '공명해방 Fervor Efflorescent 배율 +50%, Budding 시 ATK +58%', en: 'Liberation scaling +50%; on Budding: ATK +58%' },
      effects: [
        { kind: 'skillScaling', skillId: 'camellya-liberation-2', bonus: 0.50 },
        { kind: 'flatStat', stat: 'atkPercent', value: 0.58 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (영원한 생명력을 가진 뿌리)', en: 'S4 (Roots Set Deep In Eternity)' },
      description: { ko: 'Everblooming 시 팀 일반공격 피해 보너스 +25%, 30초', en: 'On Everblooming: team Basic ATK DMG +25%, 30s' },
      effects: [
        { kind: 'teamBuff', stat: 'normalDmgBonus', value: 0.25, durationSec: 30 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (그 무한함을 당신의 손에 쥐여줄 것이다)', en: 'S5 (Infinity Held in Your Palm)' },
      description: { ko: '인트로 Everblooming 배율 +303%, 아웃트로 Twining 배율 +68%', en: 'Intro Everblooming scaling +303%; Outro Twining scaling +68%' },
      effects: [
        { kind: 'skillScaling', skillId: 'camellya-intro-3', bonus: 3.03 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (그저 그대의 수많은 만개를 기다리리라)', en: 'S6 (Bloom For You Thousand Times Over)' },
      description: { ko: 'Forte Sweet Dream 배율 +150%', en: 'Forte Sweet Dream scaling +150%' },
      effects: [
        { kind: 'skillScaling', skillId: 'camellya-skill-4', bonus: 1.50 },
      ],
    },
  ],

  cantarella: [
    {
      node: 6,
      name: { ko: 'S6 (추락, 추락... 더 깊은 환상 속으로)', en: 'S6 (Fall, Fall... and Fall Deeper into the Dream)' },
      description: { ko: '일반공격 Phantom Sting 배율 +80%, 공명해방 Flowing Suffocation 시 적 DEF 30% 무시, 10초', en: 'Basic Phantom Sting scaling +80%; Liberation Flowing Suffocation: enemy DEF -30%, 10s' },
      effects: [
        { kind: 'skillScaling', skillId: 'cantarella-normal-0', bonus: 0.80 },
        { kind: 'defIgnore', value: 0.30, skillIds: ['cantarella-liberation-2'] },
      ],
    },
  ],

  danjin: [
    {
      node: 1,
      name: { ko: 'S1 (일편단심)', en: 'S1 (Crimson Heart of Justice)' },
      description: { ko: 'Incinerating Will 적중 시 ATK +5%, 6초, 최대 6중첩 (+30%)', en: 'Per Incinerating Will hit: ATK +5%, 6s, max 6 stacks (+30%)' },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.30 },
      ],
    },
    {
      node: 2,
      name: { ko: 'S2 (먼지 묻은 거울)', en: 'S2 (Dusted Mirror)' },
      description: { ko: 'Incinerating Will 적중 시 피해 +20%', en: 'On Incinerating Will hit: DMG +20%' },
      effects: [
        { kind: 'amplify', value: 0.20 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (찰나의 적화)', en: 'S3 (Fleeting Blossom)' },
      description: { ko: '공명해방 피해 보너스 +30%', en: 'Liberation DMG Bonus +30%' },
      effects: [
        { kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.30 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (고독한 붉은 칼날)', en: 'S4 (Solitary Carnation)' },
      description: { ko: 'Ruby Blossom 60 이상 시 크리율 +15%, 강공격 Scatterbloom 종료까지', en: 'Ruby Blossom ≥60: Crit Rate +15% until Scatterbloom ends' },
      effects: [
        { kind: 'critRate', value: 0.15, durationSec: 0, conditional: 'ruby-blossom>=60' },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (멈추지 않는 검객)', en: 'S5 (Reigning Blade)' },
      description: { ko: '인멸 피해 보너스 +15%, HP 60% 미만 시 추가 +15% (총 +30%)', en: 'Havoc DMG +15%; HP<60%: extra +15% (total +30%)' },
      effects: [
        { kind: 'flatStat', stat: 'havocDmgBonus', value: 0.30 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (남겨진 붉은빛 옥패)', en: 'S6 (Bloodied Jade)' },
      description: { ko: '강공격 Chaoscleave 시 팀 ATK +20%, 20초', en: 'On Heavy Chaoscleave: team ATK +20%, 20s' },
      effects: [
        { kind: 'teamBuff', stat: 'atkPercent', value: 0.20, durationSec: 20 },
      ],
    },
  ],

  phrolova: [
    {
      node: 1,
      name: { ko: 'S1 (이계의 비밀로 들어가는 열쇠)', en: "S1 (A Key to Netherworld's Secrets)" },
      description: { ko: 'Movement of Fate and Finality / Murmurs in a Haunting Dream 배율 +80%', en: 'Movement of Fate / Murmurs scaling +80%' },
      effects: [
        { kind: 'skillScaling', skillId: 'phrolova-skill-1', bonus: 0.80 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (안식과 종말을 벗어나는 심야)', en: 'S6 (A Night to Depart From Eternal Rest)' },
      description: { ko: '강화 일반공격 Hecate 배율 +24%, Hecate Apparition of Beyond — ATK의 216.42% 공조 공격, 활성 시 인멸 피해 +60%', en: 'Empowered Basic Hecate +24%; Apparition of Beyond — 216.42% ATK coordinated; +60% Havoc DMG while active' },
      effects: [
        { kind: 'skillScaling', skillId: 'phrolova-normal-0', bonus: 0.24 },
        { kind: 'coordinatedAttack', sourceSkillId: 'phrolova-skill-4', mvPercent: 2.1642 },
        { kind: 'flatStat', stat: 'havocDmgBonus', value: 0.60 },
      ],
    },
  ],

  roccia: [
    {
      node: 6,
      name: { ko: 'S6 (금빛 날개 타고 비상)', en: 'S6 (When the Golden Wings Fly)' },
      description: { ko: '공명해방 시 12초간 일반공격 Real Fantasy가 적 DEF 60% 무시', en: 'Liberation 12s: Basic Real Fantasy ignores 60% enemy DEF' },
      effects: [
        { kind: 'defIgnore', value: 0.60, skillIds: ['roccia-normal-0'] },
      ],
    },
  ],

  'rover-havoc': [
    {
      node: 2,
      name: { ko: 'S2 (낮과 밤)', en: 'S2 (Waning Crescent)' },
      description: { ko: '강공격 Devastation으로 Dark Surge 진입 시 공명스킬 쿨다운 초기화', en: 'On Devastation → Dark Surge: Skill CD reset' },
      effects: [],
    },
    {
      node: 4,
      name: { ko: 'S4 (인멸의 먼지 소리)', en: 'S4 (Annihilated Silence)' },
      description: { ko: '강공격 Devastation 및 공명해방 적중 시 적 인멸 저항 -10%, 20초', en: 'On Devastation/Liberation hit: enemy Havoc RES -10%, 20s' },
      effects: [
        { kind: 'resPen', element: 'havoc', value: 0.10, durationSec: 20 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (다크 서지 상승)', en: 'S6 (Ebbing Undercurrent)' },
      description: { ko: 'Dark Surge 상태에서 크리율 +25%', en: 'In Dark Surge: Crit Rate +25%' },
      effects: [
        { kind: 'flatStat', stat: 'critRate', value: 0.25 },
      ],
    },
  ],

  augusta: [
    {
      node: 3,
      name: { ko: 'S3 (부패한 세상 속에서 연마된 뼈)', en: 'S3 (Forged in Rot and Ruin)' },
      description: { ko: '강공격 Thunderoar(Backstep/Spinslash/Uppercut) 및 Dodge Counter Thunderoar Backstep 배율 +25%', en: 'Heavy Thunderoar variants and Dodge Counter scaling +25%' },
      effects: [
        { kind: 'skillScaling', skillId: 'augusta-skill-1', bonus: 0.25 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (찬란한 빛 속에 새긴 이름)', en: 'S6 (Engraved in Radiant Light)' },
      description: { ko: '강공격 Thunderoar: Spinslash/Uppercut 시 Thunder Rage 발동, 100% ATK 전도 피해 ×2', en: 'On Spinslash/Uppercut: Thunder Rage triggers 100% ATK Electro ×2' },
      effects: [
        { kind: 'coordinatedAttack', sourceSkillId: 'augusta-skill-1', mvPercent: 1.00 },
      ],
    },
  ],

  sigrika: [
    {
      node: 1,
      name: { ko: 'S1 (밝게 빛나야 할 광휘에게)', en: 'S1 (The Gleam Meant for Radiance)' },
      description: { ko: 'Forte Circuit 배율 +120%', en: 'Forte Circuit scaling +120%' },
      effects: [
        { kind: 'skillScaling', skillId: 'sigrika-skill-4', bonus: 1.20 },
      ],
    },
  ],

  yangyang: [
    {
      node: 1,
      name: { ko: 'S1 (다크 블루의 세례)', en: 'S1 (Sapphire Skies, Soaring Sparrows)' },
      description: { ko: '인트로 Cerulean Song 후 본인 기류 피해 보너스 +15%, 8초', en: 'After Intro Cerulean Song: self Aero DMG Bonus +15%, 8s' },
      effects: [
        { kind: 'flatStat', stat: 'aeroDmgBonus', value: 0.15 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (끊이지 않는 바람의 숨결)', en: 'S3 (Nature Sings in Symphony)' },
      description: { ko: '공명스킬 피해 보너스 +40%, Wind Field 인력 범위 +33%', en: 'Resonance Skill DMG Bonus +40%; Wind Field pulling range +33%' },
      effects: [
        { kind: 'flatStat', stat: 'skillDmgBonus', value: 0.40 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (귀를 기울이면)', en: 'S4 (Close Your Eyes and Listen in)' },
      description: { ko: '공중공격 Feather Release 피해 +95%', en: 'Mid-air Attack Feather Release DMG +95%' },
      effects: [
        { kind: 'skillScaling', skillId: 'yangyang-normal-0', bonus: 0.95 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (울려 퍼지는 바람)', en: 'S5 (Winds Whisper in Harmony)' },
      description: { ko: '공명해방 Wind Spirals 피해 +85%', en: 'Resonance Liberation Wind Spirals DMG +85%' },
      effects: [
        { kind: 'skillScaling', skillId: 'yangyang-liberation-2', bonus: 0.85 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (아름다움에게 바치는 찬가)', en: "S6 (A Tribute to Life's Sweet Hymn)" },
      description: { ko: 'Mid-Air Feather Release 후 팀 ATK +20%, 20초', en: 'After Mid-Air Feather Release: team ATK +20%, 20s' },
      effects: [
        { kind: 'teamBuff', stat: 'atkPercent', value: 0.20, durationSec: 20 },
      ],
    },
  ],

  chixia: [
    {
      node: 1,
      name: { ko: 'S1 (극장의 영웅극)', en: 'S1 (No.1 Hero Play Fan)' },
      description: { ko: '공명스킬 Boom Boom 적중이 항상 크리티컬', en: 'Resonance Skill Boom Boom hits are always Critical' },
      effects: [],
    },
    {
      node: 3,
      name: { ko: 'S3 (불멸의 횃불)', en: 'S3 (Eternal Flames)' },
      description: { ko: 'HP 50% 미만 적에게 공명해방 Blazing Flames 피해 +40%', en: 'Liberation Blazing Flames +40% DMG vs HP<50% targets' },
      effects: [
        { kind: 'amplify', value: 0.40, target: 'liberation', conditional: 'target HP < 50%' },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (영웅의 필살기)', en: 'S4 (Hero\'s Ultimate Move)' },
      description: { ko: '공명해방 시 Thermobaric Bullets 60발 + 공명스킬 쿨다운 즉시 리셋', en: 'On Liberation: +60 Thermobaric Bullets + Resonance Skill CD reset' },
      effects: [],
    },
    {
      node: 5,
      name: { ko: 'S5 (승리의 불꽃 총알)', en: 'S5 (Triumphant Explosions)' },
      description: { ko: 'Numbingly Spicy 최대 스택 시 ATK 추가 +30%', en: 'Numbingly Spicy max stack: additional ATK +30%' },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.30 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (종영의 컴백 쿠키영상)', en: 'S6 (Easter Egg Performance)' },
      description: { ko: 'Boom Boom 시전 시 팀 일반공격 피해 +25%, 15초', en: 'On Boom Boom: team Basic ATK DMG +25%, 15s' },
      effects: [
        { kind: 'teamBuff', stat: 'normalDmgBonus', value: 0.25, durationSec: 15 },
      ],
    },
  ],

  mornye: [
    {
      node: 2,
      name: { ko: 'S2 (엔트로피의 샛별)', en: 'S2 (Morning Star of Entropy)' },
      description: { ko: 'Interfered Marker 적에게 ER 100% 초과 1%당 팀 크리피해 +0.2% (ER 260% = +32%)', en: 'Vs Interfered enemies: per 1% ER above 100%, team Crit DMG +0.2% (max +32% at ER 260%)' },
      effects: [
        { kind: 'teamBuff', stat: 'critDmg', value: 0.32, durationSec: 0 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (우주의 숨은 변수)', en: 'S4 (Latent Variables of the Cosmos)' },
      description: { ko: 'High Syntony Field 회복량 +30%', en: 'High Syntony Field healing +30%' },
      effects: [],
    },
    {
      node: 5,
      name: { ko: 'S5 (느리게 흐르는 시간)', en: 'S5 (Time Dilation Effect)' },
      description: { ko: '공명해방 Critical Protocol 배율 +40%, Tune Rupture Response Particle Jetis 배율 +160%', en: 'Liberation Critical Protocol scaling +40%; Particle Jetis +160%' },
      effects: [
        { kind: 'skillScaling', skillId: 'mornye-liberation-2', bonus: 0.40 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (뭇별의 끝에 닿을 때까지)', en: 'S6 (To the Far Shores of the Stars)' },
      description: { ko: 'Critical Protocol 추가 피해 +400%', en: 'Critical Protocol additional DMG +400%' },
      effects: [
        { kind: 'skillScaling', skillId: 'mornye-liberation-2', bonus: 4.00 },
      ],
    },
  ],

  mortefi: [
    {
      node: 1,
      name: { ko: 'S1 (고독의 연주)', en: 'S1 (Solitary Etude)' },
      description: { ko: '공명해방 중 등장 캐릭터 공명스킬 시전 시 Marcato 공조 공격 (Marcato 16% ATK)', en: 'During Liberation: when active character casts Resonance Skill, Marcato Coordinated Attack triggers (16% ATK each)' },
      effects: [
        { kind: 'coordinatedAttack', sourceSkillId: 'mortefi-liberation-2', mvPercent: 0.16 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (예열된 조율)', en: 'S3 (Flaming Recitativo)' },
      description: { ko: '공명해방 중 Marcato 크리피해 +30%', en: 'During Liberation: Marcato Crit DMG +30%' },
      effects: [
        { kind: 'flatStat', stat: 'critDmg', value: 0.30 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (죽음의 사중주)', en: 'S5 (Funerary Quartet)' },
      description: { ko: '공명스킬 명중 시 Marcato 공조 공격 발사 (피해 50% 감소)', en: 'On Resonance Skill hit: trigger Marcato Coordinated Attack (50% DMG reduction)' },
      effects: [
        { kind: 'coordinatedAttack', sourceSkillId: 'mortefi-skill-1', mvPercent: 0.08 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (극노의 침묵)', en: 'S6 (Apoplectic Instrumental)' },
      description: { ko: '공명해방 Violent Finale 시 팀 ATK +20%, 20초', en: 'On Violent Finale: team ATK +20%, 20s' },
      effects: [
        { kind: 'teamBuff', stat: 'atkPercent', value: 0.20, durationSec: 20 },
      ],
    },
  ],

  qiuyuan: [
    {
      node: 6,
      name: { ko: 'S6 (들은 대로, 본 대로, 말한 대로)', en: 'S6 (Thus I Heard, Thus I Saw, Thus I Spoke)' },
      description: { ko: '3번째 강화 강공격 시 적 5초 정지', en: '3rd Empowered Heavy: enemy stasis 5s' },
      effects: [],
    },
  ],

  yuanwu: [
    {
      node: 1,
      name: { ko: 'S1 (차 한잔의 여유)', en: 'S1 (Steaming Cup of Justice)' },
      description: { ko: 'Lightning Infused 중 일반/강공격 속도 +20%', en: 'During Lightning Infused: Normal/Heavy speed +20%' },
      effects: [],
    },
    {
      node: 2,
      name: { ko: 'S2 (정직한 마음)', en: 'S2 (Fierce Heart, Serene Mind)' },
      description: { ko: '인트로 Thunder Bombardment 발동 시 공명에너지 +15 회복', en: 'Intro Thunder Bombardment: Resonance Energy +15' },
      effects: [],
    },
    {
      node: 3,
      name: { ko: 'S3 (정의의 화신)', en: 'S3 (Upholder of Integrity)' },
      description: { ko: 'Thunder Wedge 공조 공격 적중 시 본인 DEF의 20% 추가 피해', en: 'Thunder Wedge coordinated hit: +20% of self DEF damage' },
      effects: [],
    },
    {
      node: 4,
      name: { ko: 'S4 (극기의 권법)', en: 'S4 (Retributive Knuckles)' },
      description: { ko: '공명해방 발동 시 등장 캐릭터에 본인 DEF의 200% 실드, 10초', en: 'On Liberation: shield 200% of self DEF, 10s' },
      effects: [],
    },
    {
      node: 5,
      name: { ko: 'S5 (절대적인 보호)', en: 'S5 (Neighborhood Protector)' },
      description: { ko: 'Thunder Wedge 필드 존재 시 공명해방 피해 보너스 +50%', en: 'With Thunder Wedge: Liberation DMG Bonus +50%' },
      effects: [
        { kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.50 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (평화를 위하여)', en: 'S6 (Defender of All Realms)' },
      description: { ko: 'Thunder Wedge 범위 내 팀원 DEF +32%, 3초', en: 'In Thunder Wedge area: team DEF +32%, 3s' },
      effects: [
        { kind: 'teamBuff', stat: 'defPercent', value: 0.32, durationSec: 3 },
      ],
    },
  ],

  lupa: [
    {
      node: 1,
      name: { ko: 'S1 (이름 없는 자여)', en: 'S1 (Behold the Nameless One)' },
      description: { ko: '공명해방 사용 시 공명에너지 +10, 크리율 +20%', en: 'On Liberation: Energy +10, Crit Rate +20%' },
      effects: [
        { kind: 'flatStat', stat: 'critRate', value: 0.20 },
      ],
    },
    {
      node: 2,
      name: { ko: 'S2 (발 딛는 곳마다 사냥터)', en: 'S2 (Every Ground, Her Hunting Field)' },
      description: { ko: '팀 피해 +40% (조건 미상)', en: 'Team DMG +40% (condition unclear)' },
      effects: [
        { kind: 'teamBuff', stat: 'allAttributeDmgBonus', value: 0.40, durationSec: 0 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (가장 눈부신 별에게)', en: 'S6 (To the Brightest Flaming Star)' },
      description: { ko: '핵심 3 스킬이 적 DEF 30% 무시, 공명스킬 사용 시 Forte 즉시 충전', en: 'Core 3 skills ignore 30% DEF; Skill instantly fills Forte' },
      effects: [
        { kind: 'defIgnore', value: 0.30 },
      ],
    },
  ],

  sanhua: [
    {
      node: 1,
      name: { ko: 'S1 (고독한 자)', en: "S1 (Solitude's Embrace)" },
      description: { ko: '일반공격 5단 명중 시 본인 크리율 +15%, 10초', en: 'On Basic V hit: self Crit Rate +15%, 10s' },
      effects: [
        { kind: 'flatStat', stat: 'critRate', value: 0.15 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (통찰의 눈동자)', en: 'S3 (Anomalous Vision)' },
      description: { ko: 'HP 70% 미만 적에게 가하는 피해 +35%', en: '+35% DMG vs targets with HP < 70%' },
      effects: [
        { kind: 'amplify', value: 0.35, conditional: 'target HP < 70%' },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (오온의 수행)', en: 'S4 (Blade Mastery)' },
      description: { ko: '공명해방 Glacial Gaze 시 공명에너지 10 회복 + 5초 내 다음 강공격 Detonate 피해 +120%', en: 'Liberation Glacial Gaze: +10 Energy; next Heavy Detonate within 5s: DMG +120%' },
      effects: [
        { kind: 'skillScaling', skillId: 'sanhua-skill-1', bonus: 1.20 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (끊이지 않는 변화)', en: 'S5 (Unraveling Fate)' },
      description: { ko: 'Forte Circuit Ice Burst 크리피해 +100%, Ice 생성물(Thorn/Prism/Glacier)이 미점화 시에도 폭발', en: 'Forte Ice Burst Crit DMG +100%; Ice creations explode even if not detonated' },
      effects: [
        { kind: 'flatStat', stat: 'critDmg', value: 1.0 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (새벽의 햇빛)', en: 'S6 (Daybreak Radiance)' },
      description: { ko: 'Ice Prism/Glacier 점화 후 팀 ATK +10%, 20초, 최대 2중첩 (+20%)', en: 'After Ice Prism/Glacier detonation: team ATK +10%, 20s, max 2 stacks (+20%)' },
      effects: [
        { kind: 'teamBuff', stat: 'atkPercent', value: 0.20, durationSec: 20 },
      ],
    },
  ],

  aalto: [
    {
      node: 1,
      name: { ko: 'S1 (장난의 시작)', en: "S1 (Trickster's Opening Show)" },
      description: { ko: '공명스킬 Shift Trick 쿨다운 -4초', en: 'Resonance Skill Shift Trick CD -4s' },
      effects: [],
    },
    {
      node: 2,
      name: { ko: 'S2 (안개 매직 쇼타임)', en: "S2 (Mistweaver's Debut)" },
      description: { ko: 'Mist Avatar HP +100%, 도발 적 공격 시 ATK +15%', en: 'Mist Avatar HP +100%; ATK +15% vs taunted targets' },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.15 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (안개의 마법)', en: 'S3 (Hazey Transition)' },
      description: { ko: '일반/공중 공격이 「안개」 통과 시 총알 2개 추가 생성, 각 일반/공중 공격 피해 50%', en: 'Basic/Mid-air through mist: +2 bullets dealing 50% of Basic/Mid-air DMG' },
      effects: [],
    },
    {
      node: 4,
      name: { ko: 'S4 (종막의 검은 꽃)', en: 'S4 (Blake Bloom for Finale)' },
      description: { ko: 'Mist 총알 피해 +30%, Mistcloak Dash 중 받는 피해 -30%', en: 'Mist bullet DMG +30%; in Mistcloak Dash: incoming DMG -30%' },
      effects: [],
    },
    {
      node: 5,
      name: { ko: 'S5 (미로의 갈채)', en: 'S5 (Applause of the Lost)' },
      description: { ko: 'Mistcloak Dash 중 기류 피해 보너스 +25%, 6초', en: 'During Mistcloak Dash: Aero DMG Bonus +25%, 6s' },
      effects: [
        { kind: 'flatStat', stat: 'aeroDmgBonus', value: 0.25 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (엘리트 상인)', en: "S6 (Broker's Secrets)" },
      description: { ko: '공명해방 시 크리율 +8%, Gate 통과 강공격 추가 +50%', en: 'Liberation: Crit Rate +8%; Heavy through Gate: +50% DMG' },
      effects: [
        { kind: 'flatStat', stat: 'critRate', value: 0.08 },
      ],
    },
  ],

  chisa: [
    {
      node: 3,
      name: { ko: 'S3 (긴 밤의 혼돈을 넘어서)', en: 'S3 (Across the Confusion of the Long Night)' },
      description: {
        ko: 'Sawring - Blitz / Chainsaw Mode - Dodge Counter / Sawring - Eradication 배율 +120%',
        en: 'Sawring - Blitz / Chainsaw Mode - Dodge Counter / Sawring - Eradication scaling +120%',
      },
      effects: [
        { kind: 'skillScaling', skillId: 'chisa-skill-1', bonus: 1.20 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (끊임없는 반복을 잘라내)', en: 'S4 (Severing the Endless Cycle of Tragic Fate)' },
      description: {
        ko: 'Unseen Snare 발동 ICD 2초 → 1초 (Havoc Bane 부여 빈도 ×2)',
        en: 'Unseen Snare trigger ICD: 2s → 1s (Havoc Bane application frequency ×2)',
      },
      effects: [],
    },
    {
      node: 6,
      name: { ko: 'S6 (이제 잃었던 희망의 빛을 되찾으리)', en: 'S6 (Thus, Hope is Rekindled with the Rising Dawn)' },
      description: {
        ko: 'Unseen Snare - Finality 적: Negative Status 피해 +30% Amplify, 치사 본인 피해 +40%',
        en: 'Unseen Snare - Finality target: +30% Amplify from Negative Statuses; +40% increased DMG from Chisa',
      },
      effects: [
        { kind: 'amplify', value: 0.40, conditional: 'target with Unseen Snare - Finality' },
      ],
    },
  ],

  ciaccona: [
    {
      node: 1,
      name: { ko: 'S1 (옛 바람의 음유 전주곡)', en: 'S1 (Where Wind Sings)' },
      description: { ko: '공명스킬 Harmonic Allegro 시 경직 면역 3초. 일반공격 시 ATK +35%, 10초', en: 'Skill Harmonic Allegro: interrupt immunity 3s. Basic Attack: ATK +35%, 10s' },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.35 },
      ],
    },
    {
      node: 2,
      name: { ko: 'S2 (사계절의 레가토)', en: 'S2 (Song of the Four Seasons)' },
      description: { ko: '공명해방 Singer\'s Triple Cadenza 중 팀 기류 피해 보너스 +40%', en: "During Liberation Singer's Triple Cadenza: team Aero DMG Bonus +40%" },
      effects: [
        { kind: 'teamBuff', stat: 'aeroDmgBonus', value: 0.40, durationSec: 0 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (별빛이 쏟아지는 즉흥 연주)', en: 'S3 (Starlit Improv)' },
      description: { ko: '일반공격 4단 시 Musical Essence +1, 공명스킬 Harmonic Allegro 충전수 +1', en: 'Basic Stage 4: +1 Musical Essence. Skill Harmonic Allegro: +1 charge' },
      effects: [],
    },
    {
      node: 4,
      name: { ko: 'S4 (토카타와 푸가)', en: 'S4 (Toccata and Fugue)' },
      description: { ko: '강공격 Quadruple Downbeat / 공명해방 시 적 DEF 45% 무시', en: 'Heavy Quadruple Downbeat / Liberation: ignore 45% enemy DEF' },
      effects: [
        { kind: 'defIgnore', value: 0.45, skillIds: ['ciaccona-liberation-2'] },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (한여름에 바치는 시)', en: 'S5 (Eternal Idyll to Lasting Summer)' },
      description: { ko: '공명해방 피해 보너스 +40%. Singer\'s Triple Cadenza 범위 내 팀 피해 -30%', en: 'Liberation DMG Bonus +40%. In Singer\'s Triple Cadenza area: team incoming DMG -30%' },
      effects: [
        { kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.40 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (끝나지 않은 피날레)', en: 'S6 (Unending Cadence)' },
      description: { ko: 'Solo Concert 중 Ciaccona/Ensemble Sylph가 ATK 220% 기류 피해 (공명해방 피해로 간주)', en: "In Solo Concert: Ciaccona/Ensemble Sylph deals 220% ATK Aero DMG (counts as Liberation)" },
      effects: [
        { kind: 'coordinatedAttack', sourceSkillId: 'ciaccona-liberation-2', mvPercent: 2.20 },
      ],
    },
  ],

  iuno: [
    {
      node: 1,
      name: { ko: 'S1 (보름달이든 초승달이든, 그 모든 순간이 고귀한 가지를 금빛으로 물들이고)', en: 'S1 (Wax or Wane, All Gild the Bough)' },
      description: { ko: 'Lunar Cycle 중 ATK +40%. Full Moon Domain 내 공명에너지 +1/초. Arc Beyond the Edge/Absolute Fullness 경직 면역', en: 'Lunar Cycle: ATK +40%. Full Moon Domain: +1 Energy/s. Arc Beyond the Edge/Absolute Fullness: interrupt immune' },
      effects: [
        { kind: 'flatStat', stat: 'atkPercent', value: 0.40 },
      ],
    },
    {
      node: 2,
      name: { ko: 'S2 (밤이든 낮이든, 나는 그 자체로 영원히 변함없이)', en: 'S2 (Day or Night, Let This Be Eternal)' },
      description: { ko: '창백한 달빛의 축복 10스택 보유 팀 공명자 전 피해 +40% Amplify', en: 'Team Resonators with 10 Blessing of the Wan Light: +40% all DMG Amplify' },
      effects: [
        { kind: 'amplify', value: 0.40, conditional: 'Blessing of the Wan Light = 10 stacks' },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (그들의 망각을 음미해)', en: 'S3 (I Drink Deep of Their Forgetting)' },
      description: { ko: 'Lunar Cycle 중 Moonbow 피해 +65% Amplify. Moonbow 직후 Arc Beyond the Edge가 공격 사이클 리셋 안함', en: 'In Lunar Cycle: Moonbow DMG +65% Amplify. Arc after Moonbow: no attack cycle reset' },
      effects: [],
    },
    {
      node: 4,
      name: { ko: 'S4 (빗물이 내 눈동자에 깃들게 하노라)', en: 'S4 (Rainy Season Dwell in My Eyes)' },
      description: { ko: '강공격 Absolute Fullness 시전 시 팀 전원에 본인 ATK의 160% 실드, 30초', en: 'On Heavy Absolute Fullness: shield = 160% Iuno ATK to all Resonators, 30s' },
      effects: [],
    },
    {
      node: 5,
      name: { ko: 'S5 (수없이 허망한 시선을 받았지만)', en: 'S5 (A Thousand Futile Glimpses)' },
      description: { ko: '공명해방 피해 보너스 +20%', en: 'Liberation DMG Bonus +20%' },
      effects: [
        { kind: 'flatStat', stat: 'liberationDmgBonus', value: 0.20 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (내가 머무는 곳, 그곳이야말로 변치 않는 유일한 진실)', en: 'S6 (I Am the Constant in the Chaos)' },
      description: { ko: '강공격 Absolute Fullness 피해 +1600%, Lunar Cycle - New Moon 재발동, Sentience +100, Arc Beyond the Edge 쿨다운 리셋', en: 'Heavy Absolute Fullness DMG +1600%, Lunar Cycle - New Moon retrigger, +100 Sentience, Arc CD reset' },
      effects: [
        { kind: 'skillScaling', skillId: 'iuno-skill-1', bonus: 16.00 },
      ],
    },
  ],

  'rover-aero': [
    {
      node: 1,
      name: { ko: 'S1 (어둠의 경계에서 멈춘 바람)', en: 'S1 (Storm Subsides in the Void)' },
      description: { ko: 'Cloudburst Dance 사용 시 경직 저항 강화, 3초', en: 'Cloudburst Dance: enhanced interruption resistance 3s' },
      effects: [],
    },
    {
      node: 2,
      name: { ko: 'S2 (긴긴밤 속으로 사라지는 빛)', en: 'S2 (Glimmers Fade into the Dark)' },
      description: { ko: 'Unbound Flow 사용 후 등장 캐릭터 3초마다 본인 ATK의 20% HP 회복, 30초. HP 35% 미만 시 즉시 10% 잃은 HP 회복 (10초 ICD)', en: 'After Unbound Flow: heal 20% Rover ATK every 3s, 30s. HP<35%: heal 10% lost HP (10s ICD)' },
      effects: [],
    },
    {
      node: 3,
      name: { ko: 'S3 (손아귀에 떨어진 허상)', en: 'S3 (Illusions Collapse in a Grip)' },
      description: { ko: '기류 피해 보너스 +15%', en: 'Aero DMG Bonus +15%' },
      effects: [
        { kind: 'flatStat', stat: 'aeroDmgBonus', value: 0.15 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (경계가 무너지는 순간)', en: 'S4 (Boundaries Shatter in an Instant)' },
      description: { ko: 'Cloudburst Dance 사용 후 공명스킬 피해 +15%, 5초', en: 'After Cloudburst Dance: Resonance Skill DMG +15%, 5s' },
      effects: [
        { kind: 'flatStat', stat: 'skillDmgBonus', value: 0.15 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (엇갈린 생사의 길)', en: 'S5 (Life and Death Intertwine)' },
      description: { ko: 'Omega Storm 피해 배율 +20%', en: 'Omega Storm DMG Multiplier +20%' },
      effects: [
        { kind: 'skillScaling', skillId: 'rover-aero-liberation-2', bonus: 0.20 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (바람결에 무너져 내린 모든 것)', en: 'S6 (All Crumble in the Wind)' },
      description: { ko: 'Unbound Flow 피해 배율 +30%', en: 'Unbound Flow DMG Multiplier +30%' },
      effects: [
        { kind: 'skillScaling', skillId: 'rover-aero-skill-1', bonus: 0.30 },
      ],
    },
  ],

  jianxin: [
    {
      node: 1,
      name: { ko: 'S1 (숲 속의 푸른 새싹)', en: 'S1 (Verdant Branchlet)' },
      description: { ko: '인트로 Essence of Tao 시전 후 일반공격 Chi 획득량 +100%, 10초', en: 'After Intro Essence of Tao: Basic Attack Chi gain +100%, 10s' },
      effects: [],
    },
    {
      node: 2,
      name: { ko: 'S2 (득도의 수행자)', en: "S2 (Tao Seeker's Journey)" },
      description: { ko: '공명스킬 Calming Air 사용 횟수 +1', en: 'Resonance Skill Calming Air: +1 use' },
      effects: [],
    },
    {
      node: 3,
      name: { ko: 'S3 (무심무위의 추구)', en: 'S3 (Principles of Wuwei)' },
      description: { ko: 'Calming Air Parry Stance 2.5초 유지 후 Chi Counter 즉시 사용 가능', en: 'After 2.5s in Calming Air Parry Stance: Chi Counter immediately available' },
      effects: [],
    },
    {
      node: 4,
      name: { ko: 'S4 (물음에 대한 해답)', en: 'S4 (Multitide Reflection)' },
      description: { ko: 'Forte Circuit Heavy Primordial Chi Spiral 시 공명해방 Purification Force Field 피해 +80%, 14초', en: 'On Forte Heavy Primordial Chi Spiral: Liberation Purification Force Field DMG +80%, 14s' },
      effects: [
        { kind: 'skillScaling', skillId: 'jianxin-liberation-2', bonus: 0.80 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (자신에 대한 성찰)', en: 'S5 (Mirroring Introspection)' },
      description: { ko: '공명해방 Purification Force Field 범위 +33%', en: 'Liberation Purification Force Field range +33%' },
      effects: [],
    },
    {
      node: 6,
      name: { ko: 'S6 (자신을 위하여)', en: 'S6 (Truth from Within)' },
      description: { ko: '강화 Chi Counter — ATK의 556.67% 강공격 피해, Primordial Chi Spiral 중 Zhoutian Progress 4 Shield 부여 (5초 ICD)', en: 'Enhanced Chi Counter: 556.67% ATK Heavy DMG; in Primordial Chi Spiral: grants Zhoutian Progress 4 Shield (5s ICD)' },
      effects: [
        { kind: 'coordinatedAttack', sourceSkillId: 'jianxin-skill-4', mvPercent: 5.5667 },
      ],
    },
  ],

  lingyang: [
    {
      node: 1,
      name: { ko: 'S1 (늘 평안하시길)', en: 'S1 (Lion of Light, Blessings Abound)' },
      description: { ko: '공명해방 Lion\'s Vigor 중 경직 저항 강화', en: "Liberation Lion's Vigor: enhanced anti-interruption" },
      effects: [],
    },
    {
      node: 2,
      name: { ko: 'S2 (위풍당당한 걸음걸이)', en: 'S2 (Dominant and Fierce, Power Unbound)' },
      description: { ko: '인트로 Lion Awakens 시 공명에너지 +10 (20초 ICD)', en: 'On Intro Lion Awakens: +10 Resonance Energy (20s ICD)' },
      effects: [],
    },
    {
      node: 3,
      name: { ko: 'S3 (모두의 축제)', en: 'S3 (Jaw-Dropping Feats, Loud and Wide)' },
      description: { ko: '공명해방 Lion\'s Vigor 중 일반공격 피해 보너스 +20%, 공명스킬 피해 보너스 +10%', en: "Liberation Lion's Vigor: Basic DMG Bonus +20%, Skill DMG Bonus +10%" },
      effects: [
        { kind: 'flatStat', stat: 'normalDmgBonus', value: 0.20 },
        { kind: 'flatStat', stat: 'skillDmgBonus', value: 0.10 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (열정적인 춤사위)', en: 'S4 (Immortals Bow, in Reverence Flawed)' },
      description: { ko: '아웃트로 Frosty Marks 시 팀 응결 피해 보너스 +20%, 30초', en: 'Outro Frosty Marks: team Glacio DMG Bonus +20%, 30s' },
      effects: [
        { kind: 'teamBuff', stat: 'glacioDmgBonus', value: 0.20, durationSec: 30 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (울려퍼지는 칠성북)', en: 'S5 (Seven Stars Shine, Stepped upon High)' },
      description: { ko: '공명해방 Strive: Lion\'s Vigor가 본인 ATK 200% 응결 피해 추가', en: "Liberation Strive: Lion's Vigor: +200% ATK Glacio DMG" },
      effects: [],
    },
    {
      node: 6,
      name: { ko: 'S6 (사자의 위엄)', en: 'S6 (Demons Tremble, Divine Power Nigh)' },
      description: { ko: 'Forte Circuit Striding Lion 중 공명스킬 Mountain Roamer 후 3초간 다음 일반공격 피해 보너스 +100%', en: 'Striding Lion: 3s after Mountain Roamer: next Basic Attack DMG Bonus +100%' },
      effects: [
        { kind: 'flatStat', stat: 'normalDmgBonus', value: 1.00 },
      ],
    },
  ],

  buling: [
    {
      node: 1,
      name: { ko: 'S1 (만물 법보, 힘을 빌려)', en: 'S1 (Exorcist Gadgets, Lend Me Your Power)' },
      description: { ko: '공명해방 Flashing Thunder Spell: Harmony 크리율 +20%', en: 'Liberation Flashing Thunder Spell: Harmony Crit Rate +20%' },
      effects: [
        { kind: 'flatStat', stat: 'critRate', value: 0.20 },
      ],
    },
    {
      node: 2,
      name: { ko: 'S2 (차단 계정, 새로 가입)', en: 'S2 (Forum Ban? New Account!)' },
      description: { ko: 'Five Thunders Spell Array 모든 적에 Electro Flare 6스택 즉시 부여', en: 'Five Thunders Spell Array: instantly +6 Electro Flare on all targets' },
      effects: [],
    },
    {
      node: 3,
      name: { ko: 'S3 (신령 부려, 천기 보아)', en: 'S3 (Summoner of Spirits, Seeker of Fate)' },
      description: { ko: 'HP 50% 미만 팀원에 본인 ATK의 350+150% 회복 (24초 ICD)', en: 'Heal team <50% HP: 350+150% of Buling ATK (24s ICD)' },
      effects: [],
    },
    {
      node: 4,
      name: { ko: 'S4 (솔라리스, 기운 모아)', en: 'S4 (Wanderer of Solaris, Blessed by Fortune)' },
      description: { ko: '본인 회복 보너스 +20%', en: 'Self Healing Bonus +20%' },
      effects: [],
    },
    {
      node: 5,
      name: { ko: 'S5 (부적 써서, 귀신 잡고)', en: 'S5 (Talisman Burns, Spirits Turn)' },
      description: { ko: 'Yin-Yang Balance 진입 시 공명에너지 +25 회복 (24초 ICD)', en: 'On Yin-Yang Balance enter: Resonance Energy +25 (24s CD)' },
      effects: [],
    },
    {
      node: 6,
      name: { ko: 'S6 (「천지 혼원 뇌부 도배 요정 천존」)', en: 'S6 ("Almighty Forum Lord of Thunder Spell")' },
      description: { ko: 'Thunder Spell - Heaven, Earth, Mind 상태 시 등장 공명자 공명스킬 피해 보너스 +50%', en: 'Thunder Spell - Heaven, Earth, Mind: active Resonator Skill DMG Bonus +50%' },
      effects: [
        { kind: 'teamBuff', stat: 'skillDmgBonus', value: 0.50, durationSec: 0 },
      ],
    },
  ],

  lumi: [
    {
      node: 1,
      name: { ko: 'S1 (소포 픽업 대기 중)', en: 'S1 (Parcel To Be Delivered)' },
      description: { ko: 'Energized Rebound 시전 후 3초 내 스태미나 +60 회복', en: 'After Energized Rebound: +60 STA within 3s' },
      effects: [],
    },
    {
      node: 2,
      name: { ko: 'S2 (무무물류 픽업 완료)', en: 'S2 (Lollo Logistics, Ready to Help)' },
      description: { ko: 'Energized Pounce / Energized Rebound이 적 DEF 20% 무시', en: 'Energized Pounce/Rebound: ignore 20% DEF' },
      effects: [
        { kind: 'defIgnore', value: 0.20, skillIds: ['lumi-skill-4'] },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (빠른 배송 진행 중)', en: 'S3 (Priority Parcel In Transit)' },
      description: { ko: '공명해방 Squeakie Express 피해 +30%', en: 'Liberation Squeakie Express DMG +30%' },
      effects: [
        { kind: 'skillScaling', skillId: 'lumi-liberation-2', bonus: 0.30 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (루미가 배송 진행 중)', en: 'S4 (Captain Lumi, At Your Service)' },
      description: { ko: '일반공격 피해 보너스 +30%', en: 'Basic Attack DMG Bonus +30%' },
      effects: [
        { kind: 'flatStat', stat: 'normalDmgBonus', value: 0.30 },
      ],
    },
    {
      node: 5,
      name: { ko: 'S5 (무사히 배송 완료)', en: 'S5 (Parcel Collected On Time)' },
      description: { ko: 'Spark 풀회복 시 Laser 배율 +100%', en: 'Spark full: Laser DMG Multiplier +100%' },
      effects: [],
    },
    {
      node: 6,
      name: { ko: 'S6 (별점 5개 꼭이요)', en: 'S6 (Give Me A Five-star Rating)' },
      description: { ko: '공명해방 Squeakie Express 시전 시 팀 ATK +20%, 20초', en: 'On Liberation Squeakie Express: team ATK +20%, 20s' },
      effects: [
        { kind: 'teamBuff', stat: 'atkPercent', value: 0.20, durationSec: 20 },
      ],
    },
  ],

  taoqi: [
    {
      node: 1,
      name: { ko: 'S1 (여유로운 마음)', en: 'S1 (Essence of Tranquility)' },
      description: { ko: 'Forte Circuit Power Shift 실드량 +40%', en: 'Forte Circuit Power Shift Shield +40%' },
      effects: [],
    },
    {
      node: 2,
      name: { ko: 'S2 (숨겨진 실력)', en: 'S2 (Silent Strength)' },
      description: { ko: '공명해방 크리율 +20%, 크리피해 +20%', en: 'Liberation Crit Rate +20%, Crit DMG +20%' },
      effects: [
        { kind: 'critRate', value: 0.20, durationSec: 0, conditional: 'Liberation only' },
        { kind: 'flatStat', stat: 'critDmg', value: 0.20 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (만물의 통찰)', en: 'S3 (Keen-eyed Observer)' },
      description: { ko: '철벽의 실드 지속 시간 30초로 연장', en: 'Protective barrier duration → 30s' },
      effects: [],
    },
    {
      node: 4,
      name: { ko: 'S4 (막중한 책임)', en: 'S4 (Heavylifting Duty)' },
      description: { ko: '강공격 후발제인 성공 시 HP +25% 회복, 방어력 +50%, 5초 (15초 ICD)', en: 'On Heavy parry: +25% HP, DEF +50%, 5s (15s ICD)' },
      effects: [],
    },
    {
      node: 5,
      name: { ko: 'S5 (고민해결사)', en: 'S5 (Benevolent Guardian)' },
      description: { ko: '공방전환 Power Shift 피해 +50%, 명중 시 공명에너지 +20', en: 'Forte Power Shift DMG +50%, +20 Resonance Energy on hit' },
      effects: [
        { kind: 'skillScaling', skillId: 'taoqi-skill-4', bonus: 0.50 },
      ],
    },
    {
      node: 6,
      name: { ko: 'S6 (수호의 성벽)', en: 'S6 (Defender of Peace)' },
      description: { ko: '철벽의 실드 지속 중 일반/강공격 피해 +40%', en: 'During protective shield: Basic/Heavy DMG +40%' },
      effects: [
        { kind: 'flatStat', stat: 'normalDmgBonus', value: 0.40 },
        { kind: 'flatStat', stat: 'heavyDmgBonus', value: 0.40 },
      ],
    },
  ],

  baizhi: [
    {
      node: 1,
      name: { ko: 'S1 (미니멀리즘 및 맥시멀리즘)', en: 'S1 (Complex Simplicity)' },
      description: { ko: '공명스킬 Emergency Plan: 소모한 Concentration 1당 공명에너지 +2.5 추가 회복', en: 'Skill Emergency Plan: +2.5 Energy per Concentration consumed' },
      effects: [],
    },
    {
      node: 2,
      name: { ko: 'S2 (침묵의 빙원)', en: 'S2 (Silent Tundra)' },
      description: { ko: 'Concentration 4 보유 시 공명스킬 Emergency Plan 발동 시 본인 응결 피해 보너스 +15%, 회복량 +15%', en: 'With Concentration 4: Skill Emergency Plan grants self Glacio DMG Bonus +15%, Healing +15%' },
      effects: [
        { kind: 'flatStat', stat: 'glacioDmgBonus', value: 0.15 },
      ],
    },
    {
      node: 3,
      name: { ko: 'S3 (진리의 추구)', en: 'S3 (Veritas Lux Mea)' },
      description: { ko: '인트로 Overflowing Frost 시전 후 본인 최대 HP +12%, 10초', en: 'After Intro Overflowing Frost: Max HP +12%, 10s' },
      effects: [
        { kind: 'flatStat', stat: 'hpPercent', value: 0.12 },
      ],
    },
    {
      node: 4,
      name: { ko: 'S4 (근원을 찾아서)', en: 'S4 (Eternal Verity)' },
      description: { ko: '공명해방 시전 시 Remnant Entities 사용 +2회, 회복 배율 +20%, 본인 최대 HP의 1.20% 추가 응결 피해', en: 'On Liberation: Remnant Entities +2 uses, healing +20%, +1.20% of Max HP as Glacio DMG' },
      effects: [],
    },
    {
      node: 5,
      name: { ko: 'S5 (기원에서 받은 응답)', en: 'S5 (A Wish Answered)' },
      description: { ko: '본인 활성 중 팀원 사망 시 즉시 풀 HP로 부활 (10분 ICD)', en: 'Active: revive fallen team member at full HP (10min ICD)' },
      effects: [],
    },
    {
      node: 6,
      name: { ko: 'S6 (추구의 각오)', en: "S6 (Seeker's Devotion)" },
      description: { ko: 'Euphonia 획득 시 주변 모든 캐릭터 응결 피해 보너스 +12%, 20초', en: 'On Euphonia pickup: all nearby characters Glacio DMG Bonus +12%, 20s' },
      effects: [
        { kind: 'teamBuff', stat: 'glacioDmgBonus', value: 0.12, durationSec: 20 },
      ],
    },
  ],
};
