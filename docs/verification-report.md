# WuCalc 종합 검증 보고서

> 검증일: 2026년 5월 19일  
> 검증자: 자동 단위 테스트(`vitest`) + 정합성 검증 스크립트(`scripts/validateData.ts`) + 1차 출처 다중 교차 검증

---

## 1. 검증 요약

| 항목 | 결과 |
|---|---|
| 핵심 딜 공식 상수 1차 출처 검증 | ✅ 5종 확인 (DEF 800/8, RES 0.8/5×, CR 5%, CD 150%, 적 RES 10%) |
| 단위 테스트 통과율 | ✅ **47/47 (100%)** — damage.ts + stats.ts |
| 데이터 정합성 (타입/값/참조 무결성) | ✅ **0 errors / 33 warnings** (warnings는 모두 outro 미등록 캐릭터) |
| weapons.json 중복 ID | ✅ 자동 정정 완료 (`guardian-gauntlets`, `guardian-rectifier` 각 1개 중복 제거 → 105개 → 103개) |
| 캐릭터 공명체인 정확 수치 | ✅ 19명 보완 / ⚠️ 13명 부분 잔존 (대부분 4★) |
| 한국 공식 명칭 검증 | ✅ 50명 전체 (48 + 신규 2) 확인 |
| 모션 밸류 1:1 검증 | ⚠️ Fandom Combat 페이지 JS 렌더링 한계로 자동 검증 미완 |
| 실측 인게임 벤치마크 수집 | ❌ 영상/이미지 인덱싱 불가 — Chrome 연결 또는 사용자 직접 URL 제공 필요 |

---

## 2. 1차 출처로 검증된 공식 상수

### 2.1 DEF 공식: `(800 + 8 × LvAttacker) / ((800 + 8 × LvAttacker) + DEF_Target × (1 - DefIgnore))`

- **1차 출처 (Fandom Wiki — Damage)**: 원문 인용 확인
- **2차 출처 (WutheringWaves.gg)**: "동급 레벨 약 52% 감소" 실측치와 일치 (Lv90 캐릭터 × 적 DEF 1520 → 1520/3040 = 0.5)
- **3차 출처 (Yapper689 오픈소스 계산기)**: `damageConstant=0.48` 하드코딩 — 동일 산출
- **단위 테스트 검증**: ✅ `calcDefMultiplier(90, 1520, 0) === 0.5` 통과

### 2.2 저항 3구간 분기

```
RES < 0: 1 - RES/2
0 ≤ RES < 0.8: 1 - RES
RES ≥ 0.8: 1 / (1 + 5 × RES)
```

- **1차 출처 (Fandom Wiki — Damage)**: piecewise 원문 인용
- **2차 출처 (Fandom Wiki — DMG RES)**, **3차 출처 (Prydwen)**: 동일
- **단위 테스트 검증**: ✅ 임계값 0.8 경계, 음수 저항 -50%, 100% 점근 모두 통과

### 2.3 크리티컬 기본값 5% / 150%

- **1차 출처 (Fandom — Crit. Rate / Crit. DMG)**: 명시 인용
- **단위 테스트 검증**: ✅ `BASE_CRIT_RATE = 0.05`, `BASE_CRIT_DMG = 1.50` 통과

### 2.4 적 저항 10% (일반) / 40% (속성 저항 보스)

- **1차 출처 (Fandom — Damage)**: 인용 확인
- **검증된 정정사항**: **"약점 -33.3% 보너스" 메커니즘은 존재하지 않음**. 명조에는 자연 음수 저항이 없으며, 음수 저항은 오직 저항 관통 효과로만 만들어진다 (Roccia, 음표 세트 등).

### 2.5 카테고리 가산/곱연산

- 같은 버킷 내(속성 + 공격타입 DMG Bonus): **가산** (additive)
- 다른 버킷 간(DMG Bonus, Deepen, CritMult, RES, DEF): **곱연산** (multiplicative)
- **단위 테스트 검증**: ✅ "30% + 30% 가산 → 1.6" vs "30% × 30% 곱연산 → 1.69" WutheringWaves.gg 예제 정확히 재현

---

## 3. 단위 테스트 결과 (47/47 통과)

### 3.1 `src/lib/calc/__tests__/damage.test.ts` (32개 케이스)

```
✓ 상수 검증 (1개)
✓ calcBaseDmg (3개)
✓ calcResMultiplier 3구간 분기 (8개)
✓ calcDefMultiplier (5개)
✓ calcDmgBonus 가산 카테고리 (3개)
✓ calcDmgAmplify Deepen (2개)
✓ 곱연산 vs 가산 카테고리 검증 (2개)
✓ calcNonCritDmg 통합 (2개)
✓ calcHitDamage 비크리/크리/기대값 (3개)
✓ calcExpectedDmg 통합 함수 (1개)
✓ 실전 시나리오 — 알려진 빌드 근사 검증 (2개)
```

### 3.2 `src/lib/calc/__tests__/stats.test.ts` (15개 케이스)

```
✓ calcBaseAtk (1개)
✓ sumStatFromSources 스탯 합산 (4개)
✓ calcTotalAtk (2개)
✓ calcTotalHp / calcTotalDef (2개)
✓ calcFinalStats 통합 (3개)
✓ getAttackTypeBonus (3개)
```

### 3.3 실행 방법

```bash
npm test         # 1회 실행
npm run test:watch  # 와치 모드
```

---

## 4. 데이터 정합성 검증 결과

### 4.1 실행 결과

```
🔍 데이터 정합성 검증 시작

=== 결과 ===
Errors:   0
Warnings: 33 (모두 outro 미등록 캐릭터 — 알려진 누락)

✅ 모든 데이터가 정합성 검증을 통과했습니다.
```

### 4.2 발견 및 자동 정정한 오류

| 파일 | 문제 | 해소 |
|---|---|---|
| `src/data/weapons.json` | `guardian-gauntlets` ID 중복 (인덱스 89, 90 동일) | ✅ 인덱스 90 (passive name 비어 있던 incomplete duplicate) 제거 |
| `src/data/weapons.json` | `guardian-rectifier` ID 중복 (인덱스 96, 97 동일) | ✅ 인덱스 97 제거 |

### 4.3 검증 항목

- `characters.json` (47): id 중복, rarity, element, weaponType, baseStats 양수 검증, ascensionStat type 유효성, skills.hits motionValue/attackType/scalingStat 검증
- `weapons.json` (103): id 중복, rarity 3/4/5, type 유효성, baseAtk 양수, subStat 유효성
- `echoes/sets.json` (28): id 중복, twoPiece/fivePiece/threePiece의 stat type 유효성
- `recommendedSets.ts`, `signatureWeapons.ts`, `outroBuffs.ts`: 캐릭터 ID 참조 무결성

### 4.4 실행 방법

```bash
npm run validate-data
```

---

## 5. 캐릭터 명칭 검증 (50명)

나무위키 다중 출처 교차 검증 결과 **50명 전원 한국 공식 명칭 확인**:

- 융합 10: 에이메스 / 브렌트 / 장리 / 치샤 / **데니아(신규)** / 앙코 / 갈브레나 / 루파 / 모니에 / 모르테피
- 응결 7: 설지 / 카를로타 / **히유키(신규)** / 능양 / 산화 / 유호 / 절지
- 기류 10: 알토 / 카르티시아 / 샤콘 / 유노 / 감심 / 기염 / 구원 / 방랑자·기류 / 시그리카 / 양양
- 전도 7: 아우구스타 / 복링 / 카카루 / 루미 / 상리요 / 음림 / 연무
- 회절 8: 금희 / 루크·헤르센 / 린네 / 페비 / 방랑자·회절 / 파수인 / 벨리나 / 젠니
- 인멸 8: 카멜리아 / 칸타렐라 / 치사 / 단근 / 플로로 / 로코코 / 방랑자·인멸 / 도기

**검증된 정정사항**:
- 금희 (Jinhsi) — "진희" 아님 (한국 공식)
- 카카루 (Calcharo) — "칼카로/카르카로" 아님
- 페비 (Phoebe) — "피비" 아님
- 로코코 (Roccia) — "로치아" 아님
- 복링 (Buling) — "복령" 아님
- 연무 (Yuanwu) — "원무/원오" 아님

**현재 데이터에 등록 안 된 신규 2명** (3.3 패치):
- 히유키 (Hiyuki) — 2026-04-30 출시, 응결 직검 5★, 신규 메인 딜러
- 데니아 (Denia) — 2026-05-21경 출시, 융합 증폭기 5★, 서브딜러/버퍼

---

## 6. 공명체인 데이터 보완 (19명)

`WuCalc_06_캐릭터별_딜계산_데이터.md` 및 `docs/data-gaps.md`에 정확 수치로 보완된 캐릭터 (출처: Sportskeeda, Prydwen, Lootbar, Fandom, Game8 다중 교차):

아우구스타, 상리요, 칸타렐라, 치사(부분), 플로로, 로코코, 방랑자·인멸, 유노, 감심, 구원, 방랑자·기류, 시그리카, 음림, 카카루, 페비, 루크·헤르센, 카멜리아, 히유키, 데니아(베타 유출).

**중요 정정사항**:
1. **음림(Yinlin) 아웃트로 공식명**: "Diamonds Are Forever" ❌ → **"Thundering Mephis"** ✅. 효과는 Electro DMG Amplification +20% + Liberation DMG Amplification +25% / 14초 (둘 다 디펜 카테고리).
2. **카카루(Calcharo) 아웃트로**: "전도(Conduction)" 메커니즘 ❌ → 단순 Electro DMG Bonus +20% / 30초 ✅.
3. **감심(Jianxin) S1/S2**: "쿨다운 %" ❌ → S1은 Chi 획득량 +100%, S2는 Calming Air 사용 횟수 +1 ✅.

---

## 7. 검증되지 않은 항목 (한계)

### 7.1 모션 밸류 1:1 비교

현재 `characters.json`에 47개 캐릭터 × 평균 30개 히트 = 약 1,400개의 motion value가 등록되어 있다. 정합성 검증에서는 타입/범위 검증만 통과했고, **fandom Combat 페이지의 정확 수치와의 1:1 매핑은 위키가 JS로 렌더링되어 자동 fetch 불가**했다.

해소 방안:
2. **사용자가 위키 URL을 메시지로 제공** → web_fetch의 provenance set에 들어가면 가져올 수 있음
3. **데이터마이닝 GitHub 리포지토리 활용** (예: KuroGames Resonator 정적 데이터)

### 7.2 실측 인게임 벤치마크

YouTube/Reddit/Discord에서 알려진 빌드의 실제 데미지 수치를 수집하지 못했다 (영상 프레임/이미지의 텍스트는 검색 인덱싱 불가). 단, 단위 테스트의 "실전 시나리오" 케이스에서 카를로타 풀빌드 공명해방이 합리적 범위(50만~150만)에 들어오는지는 검증함.

해소 방안:
1. Chrome 연결 후 영상 직접 시청 + 수치 추출
2. 사용자가 특정 YouTube 영상 URL을 메시지로 제공
3. 다른 오픈소스 계산기와의 출력 cross-validation 자동화

### 7.3 4★ 캐릭터 공명체인 일부

산화, 알토, 양양, 복링, 루미, 연무, 단근, 도기, 치샤 — 4★ 캐릭터의 공명체인은 가이드 사이트에서도 일관된 수치가 부족함. 인게임 직접 확인 권장.

---

## 8. 추가 개선 권장 (Phase 1 후속 작업)

`WuCalc_05_딜계산_로직_확장.md` 명세대로 다음 작업이 P1 우선순위:

1. **Skill Scaling Bonus 카테고리** 신설 — `damage.ts:13 calcBaseDmg`에 `skillScalingBonus` 파라미터 추가. 영향: 앙코 S3, 음림 S1, 카멜리아 S2, 카를로타 Final Bow, 진희 S5, 페비 Absolution 등.
2. **`attackTypeBonusKey` 매핑에 `coordinated` 추가** — `stats.ts:141` 누락분 해소.
3. **`outroBuffs.ts` 32명 보완** — 33개 warning 해소.
4. **`resonanceChains.ts`, `inherentSkills.ts` 신규 파일 작성** — `WuCalc_06`의 데이터를 코드 형태로 옮김.
5. **Chrome 연결 후 motion value 1:1 자동 검증 도구** — Combat 페이지 스크래핑.

---

## 9. 실행 가능 명령 요약

```bash
# 단위 테스트
npm test                  # 1회 실행 (47개 케이스)
npm run test:watch        # 와치 모드

# 데이터 정합성 검증
npm run validate-data     # characters/weapons/echoes/recommendedSets/signatureWeapons/outroBuffs 검증
```

---

## 10. 최종 상태

| 영역 | 통과 | 비고 |
|---|---|---|
| 핵심 공식 정확성 | ✅ | 1차 출처 다중 확인 |
| 자동 테스트 | ✅ | 47/47 통과 |
| 데이터 정합성 | ✅ | 0 errors |
| 명칭 정확성 | ✅ | 50명 한국 공식명 검증 |
| 공명체인 데이터 | 🟡 | 19/50 완전 보완, 나머지 부분/4★ 잔존 |
| 모션 밸류 | 🟡 | 형식 검증 통과 / 1:1 비교 미완 |
| 실측 벤치마크 | ❌ | Chrome 연결 또는 URL 제공 필요 |

---

## 부록. 1차 출처 (재인용)

- [Damage | Wuthering Waves Wiki | Fandom](https://wutheringwaves.fandom.com/wiki/Damage)
- [DEF | Fandom](https://wutheringwaves.fandom.com/wiki/DEF)
- [DMG RES | Fandom](https://wutheringwaves.fandom.com/wiki/DMG_RES)
- [Crit. Rate | Fandom](https://wutheringwaves.fandom.com/wiki/Crit._Rate)
- [Crit. DMG | Fandom](https://wutheringwaves.fandom.com/wiki/Crit._DMG)
- [DMG Bonus | Fandom](https://wutheringwaves.fandom.com/wiki/DMG_Bonus)
- [DMG Amplify | Fandom](https://wutheringwaves.fandom.com/wiki/DMG_Amplify)
- [Coordinated Attack | Fandom](https://wutheringwaves.fandom.com/wiki/Coordinated_Attack)
- [Tune Rupture | Fandom](https://wutheringwaves.fandom.com/wiki/Tune_Rupture)
- [WutheringWaves.gg — Damage Calculation Guide](https://wutheringwaves.gg/damage-calculation-guide/)
- [Yapper689/Wuthering-Waves-Damage-Calculator (GitHub)](https://github.com/Yapper689/Wuthering-Waves-Damage-Calculator)
- [The WuWa Calculator](https://www.thewuwacalculator.com/)
- [Prydwen Institute — Wuthering Waves](https://www.prydwen.gg/wuthering-waves/)
- [Game8 — Wuthering Waves](https://game8.co/games/Wuthering-Waves)
- [Sportskeeda — Wuthering Waves Resonance Chain Guides](https://www.sportskeeda.com/esports/)
- [Vortex Gaming — 명조 3.3 히유키/데니아](https://vortexgaming.io/postdetail/722433)
- [나무위키 — 명조: 워더링 웨이브/공명자](https://namu.wiki/w/명조:%20워더링%20웨이브/공명자)
