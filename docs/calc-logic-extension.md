# WuCalc 딜 계산 로직 확장 명세

> 작성 기준: 2026년 5월 / 게임 버전 3.x  
> 본 문서는 `WuCalc_03_대미지공식.md` 의 보완·확장 명세이며, `src/lib/calc/`와 `src/data/`에 반영해야 할 누락 메커니즘을 정리한다.  
> 출처: wutheringwaves.gg, wutheringwaves.fandom.com, prydwen.gg, game8.co, sportskeeda.com, lootbar.gg, theriagames.com, namu.wiki 등 (자세한 출처는 부록 참조)

---

## 0. 요약 — 현재 코드에서 누락된 것

| # | 항목 | 영향 캐릭터 | 우선순위 | 적용 위치 |
|---|---|---|---|---|
| 1 | Skill Scaling Bonus 카테고리 | 앙코, 음림, 카를로타, 갈브레나, 모니에, 모르테피, 시그리카 등 다수 | **P1** | `damage.ts`, `types.ts`, `stats.ts` |
| 2 | 공명체인(Resonance Chain) S1~S6 데이터 | 전 캐릭터 | **P1** | `src/data/resonanceChains.ts` (신규) |
| 3 | 고유 스킬(Inherent Skill) 패시브 데이터 | 전 캐릭터 | **P1** | `src/data/inherentSkills.ts` (신규) |
| 4 | DEF Ignore / RES PEN 입력 채널 | 음림 S2, 모니에 인헤런트, 카를로타 S6 등 | **P1** | `damage.ts` (이미 변수 존재, 데이터만 채우면 됨) |
| 5 | 공조 공격(Coordinated Attack) 처리 | 음림, 모니에, 절지, 진희, 플로로, 상리요 등 | **P2** | `party.ts`, 새로운 attackType 'coordinated' |
| 6 | 상태/스택 기반 메커니즘 (Stance, Stack, Mode) | 카멜리아 Crimson Bud, 진희 Incandescence, 페비 Absolution/Confession, 카르티시아 Aero Erosion 등 | **P2** | `src/data/stateEffects.ts` (신규) |
| 7 | Tune Break / Tune Rupture 별도 채널 | 3.0+ 신규 캐릭터 (에이메스, 모니에, 루크 헤르센 등) | **P2** | `damage.ts` 새 채널 분기 |
| 8 | Outro Buff 캐릭터 확장 (16/48 → 48/48) | 미등록 32명 | **P1** | `src/data/outroBuffs.ts` |
| 9 | DMG Amplify의 다중 소스 가산 | 협동 플레이/스택 디펜 | **P3** | `damage.ts` `calcDmgAmplify` |
| 10 | 무기 패시브의 조건부 효과 모델링 | 전무 다수 (Stringmaster, Verdant Summit 등) | **P3** | `src/data/weaponPassives.ts` (신규) |

---

## 1. 정확한 최종 딜 공식 (최종 버전)

명조의 딜은 **여러 곱연산 버킷**과 그 안의 **가산 합산**으로 구성된다. 카테고리간 곱연산이 핵심.

```
FinalDMG = BaseDMG × DMGBonusMult × AmplifyMult × CritMult × DEFMult × RESMult

여기서

BaseDMG          = ScalingStat × (MV × (1 + SkillScalingBonus)) + FlatBonus
DMGBonusMult     = 1 + (속성 피해 % + 공격타입 피해 % + 모든속성 피해 %)
AmplifyMult      = 1 + (Σ Deepen_Attacker + Σ Deepen_Target)
CritMult         = 1 + clamp(CR, 0, 1) × CDmg          (기대값식)
                 = 1 + CDmg                            (단일 히트 크리)
DEFMult          = (800 + 8 × LvAttacker) /
                   (800 + 8 × LvAttacker + DefTarget × (1 − DefIgnore))
RESMult          = 1 − RESt         if 0 ≤ RESt < 0.8
                 = 1 − RESt / 2     if RESt < 0
                 = 1 / (1 + 5 × RESt) if RESt ≥ 0.8
                 (RESt = RES_base + RES_bonus − RES_PEN)
```

`SkillScalingBonus`는 기존 `calcBaseDmg(scalingStat, motionValue)`에 미포함이므로 **이번에 추가**해야 한다. (앙코 3공명, 음림 S3 등이 MV 자체를 곱연산으로 강화하는 카테고리이며, 다른 DMG Bonus와는 다른 버킷이다.)

---

## 2. 추가/변경할 타입 정의 (src/types/game.ts)

### 2.1 AttackType 확장

```ts
export type AttackType =
  | 'normal'
  | 'heavy'
  | 'skill'
  | 'liberation'
  | 'intro'
  | 'outro'
  | 'echo'
  | 'coordinated'    // 추가: 공조 공격
  | 'tuneBreak'      // 추가: 진동 절단 채널
  | 'tuneRupture';   // 추가: 진동 폭발 채널
```

### 2.2 StatType 확장

```ts
// 기존에 없는 항목 추가
| 'defIgnore'
| 'resPen'
| 'tuneBreakBoost'    // 3.0+ 신규 스탯
| 'allDmgAmplify'     // 모든 피해 디펜
| 'basicDmgAmplify'   // 기본공격 디펜
| 'heavyDmgAmplify'   // 강공격 디펜
| 'skillDmgAmplify'
| 'liberationDmgAmplify'
| 'elementDmgAmplify' // 속성 디펜 (음림 전도디펜 등)
```

### 2.3 신규 인터페이스 — 공명체인

```ts
export type ResonanceChainNode = 1 | 2 | 3 | 4 | 5 | 6;

export interface ResonanceChainEffect {
  node: ResonanceChainNode;
  name: Record<string, string>;
  description: Record<string, string>;
  /** 패시브 효과의 정량적 컴포넌트 (자동 합산 가능) */
  effects: ResonanceChainStatEffect[];
}

export type ResonanceChainStatEffect =
  | { kind: 'flatStat'; stat: StatType; value: number }
  | { kind: 'skillScaling'; skillId: string; bonus: number }   // MV ×(1+bonus)
  | { kind: 'defIgnore'; value: number; skillIds?: string[] }
  | { kind: 'resPen'; element: Element; value: number; durationSec?: number }
  | { kind: 'amplify'; value: number; conditional?: string }
  | { kind: 'critRate'; value: number; durationSec?: number; conditional?: string }
  | { kind: 'coordinatedAttack'; sourceSkillId: string; mvPercent: number }
  | { kind: 'teamBuff'; stat: StatType; value: number; durationSec: number };
```

### 2.4 신규 인터페이스 — 고유 스킬 (Inherent)

```ts
export interface InherentSkill {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  effects: ResonanceChainStatEffect[]; // 동일 효과 타입 재사용
  /** 발동 조건 (서술용. 자동 적용 시 항상 true 가정) */
  condition?: Record<string, string>;
}

export interface Character {
  // 기존 필드 + 추가
  inherentSkills?: InherentSkill[];
  resonanceChain?: ResonanceChainEffect[];
}
```

### 2.5 신규 인터페이스 — 상태/스택 메커니즘

```ts
export interface StateMechanic {
  characterId: string;
  /** 상태 이름 (Crimson Bud, Incandescence, Aero Erosion 등) */
  stateName: Record<string, string>;
  /** 최대 스택 수 */
  maxStacks: number;
  /** 스택 1당 적용되는 효과 */
  perStackEffect: ResonanceChainStatEffect[];
  /** 풀스택 도달 시 추가 효과 */
  fullStackEffect?: ResonanceChainStatEffect[];
  /** "풀업타임" 가정 시 적용할 스택 수 (보통 = maxStacks) */
  defaultAssumedStacks: number;
}
```

### 2.6 DamageParams 확장

```ts
export interface DamageParams {
  // 기존 필드 +
  skillScalingBonus: number;       // (1 + sum) — 카테고리 곱
  flatBonus: number;               // BaseAbilityDMG에 추가되는 평탄 가산값
  damageChannel: 'standard' | 'tuneBreak' | 'tuneRupture';
  defIgnore: number;               // 이미 존재 — 데이터 채우기만 필요
  resPen: number;                  // 이미 존재
}
```

---

## 3. 변경할 함수 명세 (src/lib/calc/)

### 3.1 `damage.ts` — `calcBaseDmg` 수정

```ts
/**
 * 기초 피해량 = ScalingStat × (MV × (1 + SkillScalingBonus)) + FlatBonus
 *
 * Skill Scaling Bonus는 MV 자체를 곱연산으로 강화하는 별도 카테고리.
 * 앙코 3공명("스킬 배율 +60%"), 음림 S3, 카멜리아 S2 등이 해당된다.
 */
export function calcBaseDmg(
  scalingStat: number,
  motionValue: number,
  skillScalingBonus = 0,
  flatBonus = 0,
): number {
  return scalingStat * motionValue * (1 + skillScalingBonus) + flatBonus;
}
```

### 3.2 `damage.ts` — `calcNonCritDmg` 수정

`DamageParams`에서 `skillScalingBonus`, `flatBonus`를 받아 `calcBaseDmg`에 전달.  
`tuneBreak` 채널일 경우 ATK 스케일링 제외하고 `motionValue`를 그대로 `tuneBreakBoost` 기반 평탄값으로 처리.

### 3.3 `stats.ts` — Inherent / Resonance Chain 합산

신규 함수:

```ts
/**
 * 공명체인 + 고유 스킬에서 발생하는 모든 정적(stat 기반) 효과를 합산.
 *
 * 동적 효과(공조 공격 추가 모션값 등)는 별도 처리.
 */
export function aggregatePassiveEffects(
  character: Character,
  resonanceLevel: ResonanceChainNode | 0,
): {
  flatStats: Partial<Record<StatType, number>>;
  skillScalingBonuses: Record<string, number>;
  defIgnores: { value: number; skillIds?: string[] }[];
  resPens: { element: Element; value: number }[];
  amplifies: number;
  coordinatedHits: { sourceSkillId: string; mvPercent: number }[];
}
```

### 3.4 `stats.ts` — `attackTypeBonusKey` 매핑 보강

현재 누락: `coordinated` → `'coordinatedDmgBonus'`.  
추가: `tuneBreak` → null (별도 채널), `tuneRupture` → null.

### 3.5 `damage.ts` — `calcDmgAmplify` 다중 소스 가산

```ts
export function calcDmgAmplify(amplifies: number[]): number {
  return 1 + amplifies.reduce((a, b) => a + b, 0);
}
```

호출부에서 메인 딜러에게 적용되는 모든 Deepen(아웃트로 + 인헤런트 + 공명체인 + 무기 패시브)을 배열로 합산.

---

## 4. 신규 데이터 파일 명세

### 4.1 `src/data/resonanceChains.ts`

캐릭터 ID 키 → `ResonanceChainEffect[]` (길이 6) 매핑.  
**현재 조사로 수집된 내용**은 `WuCalc_06_캐릭터별_딜계산_데이터.md` 에 정리. 본 파일은 코드용 정량 데이터로 변환되어 들어간다.

### 4.2 `src/data/inherentSkills.ts`

캐릭터 ID 키 → `InherentSkill[]` (보통 길이 2). 각 캐릭터는 보통 "고유 스킬 1", "고유 스킬 2" 두 패시브를 보유한다.

### 4.3 `src/data/stateEffects.ts`

캐릭터 ID 키 → `StateMechanic[]`. 풀스택 가정으로 계산 (Phase 1 한정).

### 4.4 `src/data/forteCircuit.ts`

캐릭터의 잠재력 트리 노드 합산 보너스. 일반적으로:
- 메인 노드 1개: 속성 피해 +12% (예: 진희 회절 피해 +20%처럼 변형 있음)
- 보조 노드 4개: ATK +3% × 2, 크리율 +0.04 × 2 등 (캐릭터마다 차이)
- 합산 형태로만 저장하고 노드별 분리는 후순위.

```ts
export interface ForteCircuitBonus {
  characterId: string;
  totalStats: { type: StatType; value: number }[];
  /** 조건부 노드(예: "공명스킬 명중 시 X초간 Y") */
  conditionals?: ResonanceChainStatEffect[];
}
```

### 4.5 `src/data/outroBuffs.ts` 확장

현재 16/48 등록 → 48/48로 확장. (캐릭터별 데이터는 `WuCalc_06`에 정리)

---

## 5. 계산 흐름 (수정안)

```
입력: Build { character, weapon, echoes, echoSets, characterLevel, weaponLevel,
              skillLevels, resonanceChainNode (0~6), partyContext? }

1) calcFinalStats(character, weapon, echoes, echoSets)
   → 에코/무기/세트의 기본 합산 (기존 그대로)

2) NEW: aggregatePassiveEffects(character, resonanceChainNode)
   → 공명체인 + 인헤런트 + 상태스택의 정적 보너스 합산
   → 결과를 step 1의 FinalStats에 머지 (flatStats는 더하고,
     skillScalingBonuses는 별도 맵에 저장)

3) calcPartyContext()
   → 아웃트로 버프 모든 캐릭터 적용
   → 메인 딜러 외 캐릭터의 공조 공격 motion value 수집
   → Amplify(Deepen) 다중 소스 가산

4) For each skill.hit in active character:
   buildDamageParams(
     totalAtk/def/hp,
     hit.motionValue,
     hit.attackType,
     skillScalingBonus = passiveBonuses.skillScalingBonuses[hit.skillId] ?? 0,
     flatBonus = 0,
     attackTypeBonus,
     elementBonus,
     dmgAmplify = sum(amplifies),
     critRate, critDmg,
     enemyDef, defIgnore (passive + amplification),
     enemyResistance, resPen (passive),
     attackerLevel,
     damageChannel = 'standard',
   )
   → calcHitDamage()

5) For each coordinated hit (sub-DPS가 메인에게 들어가는 추가 타격):
   같은 방식으로 계산, source 캐릭터의 stats 사용 (Yinlin Sinner's Mark 등)
```

---

## 6. 단위 테스트 권장 케이스 (계산 정합성 검증용)

다음 11개 케이스는 커뮤니티에서 검증된 시나리오. 구현 후 expected 결과와 ±5% 이내인지 확인.

| ID | 시나리오 | 검증 포인트 |
|---|---|---|
| T01 | 음림 S0, 표준빌드, 일반 보스 | Sinner's Mark 공조 합산 정합성 |
| T02 | 진희 S0, Incandescence 50 풀스택, 강화 공명스킬 III | skillScalingBonus + state stack |
| T03 | 카멜리아 S0, Crimson Bud 10 풀스택, Forte Sweet Dream | per-stack scaling bonus |
| T04 | 페비 S0, Absolution 풀스택, 공명해방 | inherent +255% scaling bonus |
| T05 | 상리요 S0, Intuition 4스택, 강화 공명스킬 | inherent 전도 DMG +20% |
| T06 | 카를로타 S0, Substance 120 풀스택, 공명해방 | Final Bow +80% scaling |
| T07 | 카멜리아 S6 + 카르티시아 outro | S6 +150% + 아웃트로 가산 |
| T08 | 갈브레나 S0, Demon Hypostasis 진입 후 | Afterflame 40 → crit dmg +80% |
| T09 | 기염 S0, 풍속 자세 + 60 Resolve 소모 해방 | 자세 전환 메커닉 |
| T10 | 음림 + 카멜리아 + 베리나, 풀 로테이션 | Amplify 다중 소스 가산 |
| T11 | 보스 레벨 110 vs 캐릭터 90 | DEF 공식 레벨 차이 페널티 |

각 케이스의 정확한 expected DPS는 `src/lib/calc/__tests__/` 에 `*.test.ts`로 작성 권장. 게임 내 클립/벤치마크 영상의 실제 수치를 5% tolerance로 검증.

---

## 7. 구현 우선순위

### Phase 1 (현재 MVP 확장 — 1~2주)
1. `damage.ts`에 `skillScalingBonus`, `flatBonus` 파라미터 추가
2. `attackTypeBonusKey`에 `coordinated` 추가
3. `outroBuffs.ts` 미등록 캐릭터 32명 추가
4. `resonanceChains.ts`, `inherentSkills.ts` 신규 파일 (WuCalc_06 데이터 기반)
5. 단위 테스트 T01~T06 작성

### Phase 2 (파티 시뮬레이션 정밀도 — 2~4주)
1. 공조 공격 처리 (`party.ts` 확장)
2. 상태/스택 메커니즘 데이터 (`stateEffects.ts`)
3. Amplify 다중 소스 가산
4. 무기 패시브 조건부 효과 모델링
5. 단위 테스트 T07~T10

### Phase 3 (3.x 신규 메커닉 — 4~6주)
1. Tune Break / Tune Rupture 별도 채널 (`tuneBreakBoost` 스탯)
2. 보스별 약점/저항 시나리오 데이터
3. 단위 테스트 T11

---

## 부록 A. 출처 (Sources)

### 1차 자료 (영문 위키)
- [Wuthering Waves Fandom Wiki — Damage](https://wutheringwaves.fandom.com/wiki/Damage)
- [Fandom — DMG Bonus](https://wutheringwaves.fandom.com/wiki/DMG_Bonus)
- [Fandom — DMG Amplify](https://wutheringwaves.fandom.com/wiki/DMG_Amplify)
- [Fandom — Crit. DMG](https://wutheringwaves.fandom.com/wiki/Crit._DMG)
- [Fandom — DMG RES](https://wutheringwaves.fandom.com/wiki/DMG_RES)
- [Fandom — Coordinated Attack](https://wutheringwaves.fandom.com/wiki/Coordinated_Attack)
- [Fandom — Tune Rupture](https://wutheringwaves.fandom.com/wiki/Tune_Rupture)

### 2차 자료 (가이드/공략)
- [WutheringWaves.gg — Damage Calculation Guide](https://wutheringwaves.gg/damage-calculation-guide/)
- [Prydwen.gg — Character Database](https://www.prydwen.gg/wuthering-waves/characters/)
- [Game8 — Wuthering Waves](https://game8.co/games/Wuthering-Waves)
- [Game8 — Coordinated Attack](https://game8.co/games/Wuthering-Waves/archives/494574)
- [Game8 — Tune Break](https://game8.co/games/Wuthering-Waves/archives/568979)
- [Wuthering.gg — Damage Calculations](https://wuthering.gg/guide/fighting/damage-calculations)
- [The WuWa Calculator](https://www.thewuwacalculator.com/)

### 캐릭터별 가이드 (Sportskeeda 시퀀스 가이드)
- [Aemeath Resonance Chain](https://www.sportskeeda.com/esports/wuthering-waves-aemeath-resonance-chain-guide)
- [Roccia Resonance Chain](https://www.sportskeeda.com/esports/wuthering-waves-roccia-resonance-chain-guide)
- [Mornye Resonance Chain](https://www.sportskeeda.com/esports/wuthering-waves-wuwa-mornye-resonance-chain-guide)
- [Lynae Resonance Chain](https://www.sportskeeda.com/esports/wuthering-waves-lynae-resonance-chain-guide)
- [Luuk Herssen Resonance Chain](https://www.sportskeeda.com/esports/wuthering-waves-luuk-herssen-resonance-chain-guide)

### 오픈소스 참고 구현 (라이센스 무관, 알고리즘 참고용)
- [Yapper689/Wuthering-Waves-Damage-Calculator](https://github.com/Yapper689/Wuthering-Waves-Damage-Calculator)
- [flysand7/wuwa-dmg-calc](https://github.com/flysand7/wuwa-dmg-calc)
- [ZetsuBouKyo/WutheringWaves](https://github.com/ZetsuBouKyo/WutheringWaves)

### 한국어 명칭 검증
- [나무위키 — 명조: 워더링 웨이브](https://namu.wiki/w/명조:%20워더링%20웨이브)

---

## 부록 B. 검증 못 한 항목 (인게임 직접 확인 필요)

다음 항목은 영문 위키 / 가이드에서도 일관된 수치가 없거나 누락되어 **인게임 텍스트 또는 데이터마이닝 데이터스트림**으로 직접 검증해야 한다:

1. 모든 캐릭터의 Forte 회로 노드별 정확한 합산 보너스 수치
2. 공조 공격(Coordinated Attack)의 motion value (위키 표 직접 파싱 필요)
3. 시그리카·유노·방랑자·기류·알토·구원·양양의 S4~S6 일부 노드
4. 페비/치샤/방랑자·회절/루크 헤르센의 아웃트로 효과 정확 수치
5. DEF 공식 상수 `800, 8`의 데이터마이닝 1차 출처 — 커뮤니티 표준이지만 공식 발표 없음
6. 저항 3구간 임계값 `0.8, 5×` — 동일 사유

위 항목들은 `// TODO: 인게임 확인 필요` 주석을 달지 말 것 (지침 위반). 대신 별도 `docs/data-gaps.md` 파일에 기록하여 추적할 것.
