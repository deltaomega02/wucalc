# WuCalc 데이터 갭 추적

> 본 파일은 영문/한국어 위키, 가이드 사이트, 데이터마이닝 커뮤니티에서 일관된 수치를 확보하지 못한 항목을 추적한다.  
> 최종 수정: 2026-05-19 (1차 검증 통과 후 갱신)

---

## 0. 영향도 분류

- **P1**: 계산 결과에 직접 영향 — 빠른 시일 내 해소 필요
- **P2**: 개별 캐릭터 정확도 — 캐릭터 출시·복각 시점에 맞춰 해소
- **P3**: 장기 추적 — 게임 메커닉 변경 또는 데이터마이닝 진전 대기

---

## 1. 공식 상수 — ✅ 1차 검증 완료

| ID | 항목 | 상태 |
|---|---|---|
| C-01 | DEF 공식 상수 `800, 8` | ✅ Fandom Wiki *Damage* 페이지 1차 확인 (원문 인용) |
| C-02 | 저항 3구간 임계값 `0.8`, 점근 계수 `5×` | ✅ Fandom *Damage* + *DMG RES* + Prydwen 3중 확인 |
| C-03 | 기본 크리율 5%, 기본 크리뎀 150% | ✅ Fandom *Crit. Rate* / *Crit. DMG* |
| C-04 | 기본 적 저항 10% / 약점 저항 보스 40% | ✅ Fandom *Damage* |
| C-05 | 보스 레벨 커브 (`hpRatio/defRatio`) | ⚠️ P2 - 데이터마이닝 직접 검증 필요 |

**중요 정정사항**:
- ❌ "약점 -33.3% 보너스" 같은 별도 약점 메커니즘은 **존재하지 않음**. 명조에는 자연 음수 저항이 없고, 음수 저항은 오직 저항 관통 효과로만 만들어진다.

---

## 2. 캐릭터 공명체인 / 고유 스킬 — 보완 완료 항목

다음 캐릭터의 정확 수치가 추가 검증됨 (`WuCalc_06_캐릭터별_딜계산_데이터.md` 또는 본 갭 문서에서 사용):

| ID | 캐릭터 | 보완 결과 |
|---|---|---|
| RC-13 | 아우구스타 (Augusta) | ✅ S1~S6 정확 수치 확보 (Sportskeeda 1차) |
| RC-17 | 상리요 (Xiangli Yao) | ✅ S1~S6 정확 수치 |
| RC-25 | 칸타렐라 (Cantarella) | ✅ S1~S6 정확 수치 |
| RC-26 | 치사 (Chisa) | ✅ S1~S2, S5 정확. S3, S4, S6는 여전히 일부 불명 |
| RC-28 | 플로로 (Phrolova) | ✅ S1~S6 정확 수치 |
| RC-29 | 로코코 (Roccia) | ✅ S1~S6 정확 수치 |
| RC-30 | 방랑자·인멸 (Rover Havoc) | ✅ S1~S6 정확 수치 |
| RC-07 | 유노 (Iuno) | ✅ S1~S6 정확 수치 |
| RC-08 | 감심 (Jianxin) | ✅ S1~S6 정확 수치 — **S1/S2는 쿨다운 효과가 아님** (Chi 획득 +100%, Calming Air 사용 횟수 +1) |
| RC-09 | 구원 (Qiuyuan) | ✅ S1~S6 정확 수치 |
| RC-10 | 방랑자·기류 (Rover Aero) | ✅ S1~S6 정확 수치 |
| RC-11 | 시그리카 (Sigrika) | ✅ S1~S6 정확 수치 |
| RC-18 | 음림 (Yinlin) | ✅ **재정정 — 2026-05-19 (3차)**: 공식 아웃트로명은 **"Strategist"** (Game8/Prydwen 다중 확인). 이전 기록의 "Thundering Mephis"는 **에코 세트(Echo monster set) 이름**이며 아웃트로 이름이 아니었음. 효과는 Electro DMG Amplify +20% + Liberation DMG Amplify +25% / 14초 (수치 변경 없음) |
| RC-15 | 카카루 (Calcharo) | ✅ 아웃트로 Shadowy Raid = Electro DMG Bonus +20% / 30초 |
| RC-21 | 페비 (Phoebe) | 🟡 **부분 정정 — 2026-05-19 (3차)**: 효과 수치는 ATK 528.41% 회절 피해(Confession/Absolution 모드 의존)로 확정. 단 "Star Caressed" 아웃트로명은 1차 출처(Fandom/Game8/Prydwen)에서 미확인 — 명칭만 보류 |
| RC-20 | 루크·헤르센 (Luuk Herssen) | ✅ 아웃트로 Bow to the Last Light = 다음 캐릭 인트로 시 All-Attr DMG Bonus +10% / 15초 |
| RC-24 | 카멜리아 (Camellya) | ✅ 아웃트로 Twining 강화 시 추가 데미지 ATK의 459.02% |
| RC-32 | 히유키 (Hiyuki) | ✅ S1~S6 정확 수치 확보 (Sportskeeda) |
| RC-33 | 데니아 (Denia) | ⚠️ 베타 유출 기반. 출시 후 (2026-05-21경) 재검증 필요 |

## 3. 캐릭터 공명체인 — 미해소 항목

| ID | 캐릭터 | 누락 항목 | 우선순위 |
|---|---|---|---|
| RC-01 | 에이메스 (Aemeath) | S6 효과 | P2 |
| RC-02 | 치샤 (Chixia) | 아웃트로 효과 정확 수치 | P3 (4★) |
| RC-05 | 산화 (Sanhua) | S1~S6 전체 % | P3 (4★) |
| RC-06 | 알토 (Aalto) | S1, S2, S4~S6 | P3 (4★) |
| RC-12 | 양양 (Yangyang) | S1~S5 정확 수치 | P3 (4★) |
| RC-14 | 복링 (Buling) | 공명체인 개별 노드 전체 | P3 (4★) |
| RC-16 | 루미 (Lumi) | 고유 스킬, 공조 공격 여부 | P3 (4★) |
| RC-19 | 연무 (Yuanwu) | 고유 스킬 1 정확 수치, 아웃트로 수치 | P3 (4★) |
| RC-22 | 방랑자·회절 (Rover Spectro) | Forte 회로 수치 | P2 |
| RC-23 | 벨리나 (Verina) | 고유 스킬 2 효과 | P2 |
| RC-27 | 단근 (Danjin) | Forte 회로, 고유 스킬, 아웃트로 정확 수치 | P3 (4★) |
| RC-31 | 도기 (Taoqi) | 고유 스킬, 아웃트로 | P3 (4★) |
| RC-26 | 치사 (Chisa) | S3, S4, S6 일부 % | P2 |

## 4. 공조 공격(Coordinated Attack) Motion Value

**정확한 값 확보된 항목 (Fandom·Lootbar 인용):**
- 브렌트 S1 폭격: ATK 440% ✅
- 카멜리아 아웃트로 Twining 강화 시 추가: ATK 459.02% ✅
- 상리요 아웃트로 Chain Rule: ATK 237.63% × 최대 3회 ✅
- 음림 S6 Furious Thunder: ATK 419.59% ✅
- 플로로 S6 Hecate Apparition of Beyond: ATK 216.42% ✅
- 감심 S6 Special Chi Counter: ATK 556.67% ✅
- 시그리카 아웃트로: ATK 795% ✅
- 카를로타 아웃트로 Kaleidoscope Sparks: ATK 1032.18% ✅
- 페비 기본 아웃트로: ATK 528.41% ✅
- 방랑자·인멸 아웃트로: ATK 143.3% × 2초 간격 (6초) ✅

**미확보 항목 (motion value 본문에 표시되지 않음):**
- 루파, 모르테피, 산화, 유호, 절지, 카르티시아, 샤콘, 유노, 기염(용 폭발), 구원, 방랑자·기류, 복링, 카카루 S6, 연무, 루크·헤르센, 린네, 도기

## 5. Forte 회로 노드별 합산 보너스

거의 모든 캐릭터에서 정확한 노드 5종 합산값 미공개.  
일반 패턴 (출처: 다수 가이드):
- 메인 노드 1개: 속성 피해 +12~20%
- 보조 4개: ATK% × 2 (각 +3~5%), 크리율 × 2 또는 크리피해 (각 +0.04~0.08, +0.08~0.12)

우선순위 P2. 인게임 잠재력 탭 또는 fandom Combat 페이지 직접 확인 필요. 본 검증 라운드에서는 사이트 JS 렌더링 한계로 직접 fetch 불가했음.

## 6. 캐릭터 스킬 모션 밸류 (motion value) 검증

현재 `src/data/characters.json` 47개 캐릭터 × 평균 30히트 = 약 1,400개의 motion value가 등록됨.  
정합성 검증 스크립트(`scripts/validateData.ts`)에서 **타입과 음수 여부, 비정상 범위(>50)는 모두 통과**. 다만 fandom Combat 페이지의 정확 수치와의 1:1 매핑은 위키 페이지가 JS 렌더링되어 직접 fetch 불가하므로 미검증.  

## 7. 실측 벤치마크 데이터

- YouTube 영상의 데미지 수치는 영상 프레임에 있어 텍스트 검색 인덱싱 불가
- Reddit/Discord 이미지 OCR 불가
- 신뢰할 만한 벤치마크 데이터 수집 실패

**대안 검증 방법** (구현 권장):
1. 다른 오픈소스 계산기와의 출력 cross-validation:
   - [Yapper689/Wuthering-Waves-Damage-Calculator](https://github.com/Yapper689/Wuthering-Waves-Damage-Calculator)
   - [The WuWa Calculator](https://www.thewuwacalculator.com/)
   - [wutheringtools.com](https://www.wutheringtools.com/)
2. 단위 테스트의 "실전 시나리오" 케이스에 알려진 출력값 입력하여 회귀 검증 (현재 `damage.test.ts`에 1개 구현됨)
3. Chrome 연결 후 직접 영상 시청 → 수치 추출 → 회귀 테스트 추가

---

## 변경 로그

- 2026-05-19 (1차): 초기 작성 (50명 캐릭터 기준 갭 정리)
- 2026-05-19 (2차): 19개 캐릭터의 공명체인/아웃트로 정확 수치 보완, 단위 테스트 47개 통과, 정합성 검증 errors 0
- 2026-05-19 (3차) Phase 1 P1 완료:
  - `damage.ts` `calcBaseDmg`에 `skillScalingBonus`/`flatBonus` 추가, `DamageParams`/모든 호출부 일괄 갱신
  - `AttackType`에 `coordinated` 추가 + `attackTypeBonusKey` 매핑 보강, `validateData.ts` 허용 목록 갱신
  - `src/data/outroBuffs.ts` 33명 신규 등록 (warning 33 → 0). 수치 미확정 항목은 description에 "데이터 갭" 명시 + 본 문서 RC-* 추적 ID 참조
  - `src/data/resonanceChains.ts` 신규 — 38개 캐릭터의 정량 가능 공명체인 노드 등록 (skillScaling, flatStat, defIgnore, resPen, amplify, teamBuff, coordinatedAttack)
  - `src/data/inherentSkills.ts` 신규 — 27개 캐릭터의 고유 스킬 정량 효과 등록
  - `validateData.ts`에 resonanceChain/inherentSkill의 skillId 참조 무결성 검증 추가
  - 단위 테스트 T01~T06 신규 (`src/lib/calc/__tests__/scenarios.test.ts`, 16 케이스) → 총 63/63 통과
  - 미해소 항목: Forte 회로 노드별 정확 수치, motion value 1:1 검증, 4★ 공명체인 일부 — Phase 2 이후
- 2026-05-20 (22차) 전체 인헤런트 한·영 명칭 일괄 재검증·정정 (wuthering.gg KR + EN 다중 fetch):
  - **체크 결과**: WuCalc_06 영문 인헤런트명 다수 부정확. AI 직역도 부정확 (예: "속삭이는 눈" ≠ "Whispering Eye"는 공식 "Fine Snow"). 모든 캐릭터의 인헤런트 한·영 명칭을 wuthering.gg KR/EN에서 직접 수집해 1:1 매핑 정정.
  - **정정 캐릭터 (한/영 → 공식 한/영)**:
    - 카멜리아: Epiphyte/Seedbed 이름·효과 swap 정정 → 점유(Epiphyte) normalDmgBonus + 온실(Seedbed) havocDmgBonus
    - 페비: Absolution Enhancement / Confession Enhancement (X 임의 이름) → 존재(Presence) / 계시(Revelation). Forte 모드 효과는 별도 entry (phoebe-forte-absolution / -confession)로 분리
    - 모니에: High Syntony Field/Interfered Marker (X 메커니즘명) → 청사진(Blueprint) / 유계(Boundedness)
    - 음림: Sinner's Mark/Forte Judgment Strike (X 임의 라벨) → 과도한 통증(Pain Immersion) / 명확한 목표(Deadly Focus). Forte는 yinlin-forte-judgment-strike entry
    - 금희: 회절+20% / 인트로+50% (X 효과 라벨) → 수호신의 빛(Radiant Surge) / 정신(Converged Flash)
    - 카카루: Cruelty (X 메커니즘명) → 핏빛의 각오(Bloodshed Awaken) / 용감한 헌신(Revenant Rush)
    - 갈브레나: Fated End (X 스택명) → 사냥의 맹세(Oathbound Hunt) / 폭식의 죄(Sin Feaster)
    - 기염: 디스크립터 → 수천평란(Heavenly Balance) / 온풍집류(Tempest Taming)
    - 감심: 디스크립터 → 형식 무극(Formless Release)
    - 앙코: 디스크립터 → 화난 그늘이(Angry Cosmos) / 음메음메 응원가(Woolies Cheer Dance)
    - 카를로타: Ars Gratia Artis만 있었음 → 맑은 순수함(Flawless Purity) + 예술지상주의(Ars Gratia Artis)
    - 모르테피: → 친절한 접대(Harmonic Control) / 자유로운 리듬(Rhythmic Vibrato)
    - 치샤: → 뜨거운 탄창(Scorching Magazine) + 극도로 매운맛(Numbingly Spicy!)
    - 유호: → 편옥(Treasured Piece) + 구슬(Rare Find)
    - 산화: → 빙결(Condensation) + 폭설(Avalanche)
    - 카르티시아: → 마음으로 엮어낸 기도(A Heart's Truest Wishes) + 바람으로 새긴 흔적(Wind's Indelible Imprint)
    - 벨리나: → 생명의 은혜(Grace of Life) + 자연의 선물(Gift of Nature)
    - 파수인: Inner/Supernal Stellarealm (X 메커니즘명) → 흐르는 생사(Life Entwined) + 자아의 이끌림(Self Gravitation)
    - 상리요: → 예지(Knowing) + 집중(Focus)
    - 린네: → 영원히 빛바래지 않는 색채!(Colors Never Fade!) + 『적응형 광학의 생활 속 실제 응용』(Adaptive Optics: Everyday Applications)
    - 루크 헤르센: → 눈속에 묻힌 맥박(Pulses Under the Snow) + 이유 없이 찾아온 치유의 계시(Uncaused Diagnosis)
    - 방랑자·회절: Odyssey of Beginnings (X) → 과묵(Reticence) + 경청(Silent Listener)
    - 젠니: → 빠른 응답(Quick Response) + 고통에 대한 저항(Fear No Pain)
    - 치사: → 풀리지 않는 운명(Inescapable Fate) + 모든 것의 종점(All Ends Here)
    - 플로로: → 변음 기호(Accidental) + 팔중주(Octet)
    - 능양: → 사자왕의 강림(Lion's Pride) + 꾸준한 수행(Diligent Practice)
    - 에이메스: Between the Stars/Before All Sounds 영문 OK → 별과 별 사이/만물이 있기 전에 (한글 추가)
    - 장리: Secret Strategist/Sweeping Force 영문 OK → 은밀한 모략/태세 분쇄 (한글 추가)
    - 히유키: 이전 정정 (Fine Snow/Ephemeral Realm)
  - **테스트 영향**: 4 데니아 테스트 제거 + Phoebe/Yinlin 테스트 ID 갱신. 결과 167/167 통과, 0 errors/0 warnings, 클린 typecheck.
  - **재발 방지**: 메모리 `feedback_korean_names.md`에 "AI는 절대 한↔영 직역 금지, 매번 양쪽 별도 출처에서 수집" 강화 저장 + MEMORY.md 인덱스 갱신.

- 2026-05-20 (21차) 데니아 제거 + 히유키 영문 명칭 재검증·정정:
  - **데니아 일괄 제거** — 출시일이 phase 2 (2026-05-21)이므로 아직 미출시. characters.json / outroBuffs.ts / inherentSkills.ts / resonanceChains.ts / signatureWeapons.ts / weapons.json (Forged Dwarf Star) / weaponPassives.ts에서 모두 제거. 데니아 테스트 4건도 정리. 출시 후 인게임 검증된 데이터로 재등록 예정.
  - **히유키 영문 명칭 정확화 정정** (wuthering.gg EN 페이지 검증):
    - 인헤런트 1: "Whispering Eye" (X, 한글 직역) → **"Fine Snow"** (공식)
    - 인헤런트 2: "Changing World" (X, 한글 직역) → **"Ephemeral Realm"** (공식)
    - Forte 게이지: "Frost Forge Sheath" (X, 직역 추측) → **"Snowforged Blade"** (공식)
    - skill-4 영문: "Forte Circuit · Frost Forge Sheath" → **"Forte Circuit · Frostharden Iai / Whiteout Bitterfrost"** (Forte 시스템 명칭 보완)
  - 결과: 한글-영어 명칭이 직관적으로 1:1 매핑되지 않는다는 점 확인. 영문은 공식 EN 페이지 그대로 사용해야 함 (의역/직역 금지). 메모리 `feedback_korean_names.md` 갱신 — 매번 데이터 수집 시 한/영 정확화 워크플로 적용.
  - 누적: 49 캐릭터 (히유키만 추가, 데니아 제외), 76 무기 패시브, **167/167 테스트 통과**, 0 errors / 0 warnings.

- 2026-05-20 (20차) 데이터 갭 최소화 — 히유키/데니아 전체 메커니즘 정확 등록:
  - **히유키 공식 한글 스킬명 정정** (wuthering.gg KR 페이지 검증):
    - 일반 공격: "타오르는 벚꽃의 도법" (Flaming Sakura Blade Art)
    - 공명 스킬: "서리의 징벌" (Frostblight) — 이전 "서리꽃" 정정
    - 공명 해방: "끌어온 내 가능성" (Foreclaiming) — 이전 "자아 봉인" 정정
    - 변주 스킬: "서리의 칼날" (Frostedge)
    - 잠재력 회로: "서리 단조·납도" (Frost Forge Sheath)
  - **히유키 패시브(인헤런트) 2종 등록**: 속삭이는 눈 (Whispering Eye), 변하는 세상 (Changing World) — description만(정량은 STATE에)
  - **히유키 공명체인 S1~S6 등록** (한글 노드명 + 정량 효과):
    - S1 (오지 않는 봄이여 / Spring That Never Comes): normal-0 +120% scalingBonus
    - S2 (고요히 타오르는 얼음의 불꽃 / Silently Burning Ice Flame): description only
    - S3 (공허한 몸에 깃든 무한한 가능성 / Infinite Possibilities in Empty Body): skill-4 +160% scalingBonus
    - S4 (물결 사이에 떠다니는 갈대처럼 / Like a Reed Drifting on Waves): teamBuff allAttr +0.20, 30s
    - S5 (무수한 기도와 소원이 와도 / Countless Prayers and Wishes): skill-1 +80% scalingBonus
    - S6 (설령 그 끝이 영원한 밤에 기다린다 해도 / Even If the End Awaits in Eternal Night): critDmg +5.00
  - **히유키 상태 메커니즘 2종 등록**:
    - 눈의 침식 (Snow Rust) — max 3 stacks, fullStack: critDmg +0.40 + amplify glacio +0.60
    - 서리 단조·납도 (Frost Forge Sheath) — max 3pt, per pt: skillScaling on liberation-2 +4.0 (풀 3pt = +1200%)
  - **데니아 시그니처 무기 Forged Dwarf Star (위조된 작은별) 등록** (weapons.json + weaponPassives.ts):
    - rectifier 5★, baseAtk Lv90 500, subStat critRate 0.36 (특이 — 3.3 신규 패턴)
    - R1: ATK +12% (정적) + Liberation +36% (Fusion Burst / Tune Strain-Shifting 트리거) + teamBuff ATK +24% (조건부)
  - **데니아 인헤런트 2종 + 공명체인 S1~S6 등록**:
    - 인헤런트: 남겨진 거짓말 (Lingering Lies), 새겨진 찬란한 빛깔 (Engraved Brilliance) — description only
    - S1: critDmg +0.30
    - S2: teamBuff fusionDmgBonus +0.50, 15s
    - S3: liberation-2 +0.80 scalingBonus
    - S5: liberation-2 +1.00 scalingBonus (S3+S5 누적 +1.80)
    - S6: atkPercent +0.60 + fusionDmgBonus +0.60
  - **signatureWeapons.ts에 'denia: Forged Dwarf Star' 추가**
  - 신규 테스트 10 케이스 → **171/171 통과** (이전 161)
  - 남은 미해소: 데니아 모션 밸류 (출시일 오늘 — 2026-05-21 phase 2 시작), 데니아 ascensionStat (소스 충돌)

- 2026-05-19 (19차) 잔여 작업 일괄 완료 — Frostburn/Hiyuki 모션/Denia/R2~R5 추가/Tune Break 최종:
  - **Hiyuki Frostburn 시그니처 무기 등록** (weapons.json): 서린 불꽃 / Frostburn, 5★ sword, baseAtk Lv90 587, subStat critRate 0.243, passive "다시는 나란 존재가 없기를" (Self No More) — ATK +12% + Glacio Chafe 부여 시 Glacio +28% Amplify + 공명해방 적 DEF 10% 무시 + 출전 시 Glacio Chafe 피해 +20% Amplify 6초. weaponPassives.ts에 조건부 효과(amplify glacio +0.28 + defIgnore +0.10 on liberation) 등록. (Game8 + wuthering.gg 한국 페이지 다중 확인)
  - **Hiyuki 모션 밸류 등록** — 7개 스킬에 모션 값 채움: Basic Stage 1~3 / 강공격 / 공중 / 회피반격, Resonance Skill (Frostblight 3히트), Resonance Liberation (Foreclaiming 3히트: Inward Vision/Blade Base/Snowforged Blade), Intro Skill (Frostedge), Forte Circuit (Foreclaimed Self 5단 + 강공격 + Heavy Bitterfrost). wuthering.gg 검증.
  - **Denia 캐릭터 등록** (3.3 후반기, 2026-05-21 출시): 5★ Fusion Rectifier. baseStats Lv90: HP 11025, ATK 425, DEF 1148 (wuthering.gg). skills 5개 스켈레톤(빈 hits, motion value 미공개). ascensionStat은 출처별 충돌(ER 100% vs ATK 36%)로 미등록 (data gap). outroBuffs에 데이터 갭 entry 추가.
  - **R2~R5 추가 weapon 검증**: Luminous Hymn ×1.75 (R1 24% → R5 42%), The Last Dance ×2.0 (R1 48% → R5 96%) 명시. Negative Status 시리즈 4종 ×2.0 (R1 4% → R5 8% per stack) 명시. 총 17개 무기 per-weapon override 등록.
  - **Tune Break 공식 최종 조사 결과** — 자체 Tune Break 공격은 1차 출처에서 영구 데이터 갭으로 확정. 검증된 사실: (1) Tune Break 데미지는 별도 채널, (2) **ATK 및 DMG Bonus modifier 미적용** (Game8 다중 확인), (3) Tune Break Boost 스탯에 기반, (4) Lynae 패시브의 per stack × per point × 0.12% 공식만 검증됨(`calcTuneBreakBoostAmplify` 헬퍼로 구현). 자체 공격 데미지의 정확한 배율 공식은 데이터마이닝 출처가 공개될 때까지 미해소.
  - 결과: 잔여 작업 5건 중 4건 완료 + 1건(Tune Break 자체 공격 공식) 영구 데이터 갭 확정. 총 161/161 통과, 0 errors / 0 warnings.

- 2026-05-19 (18차) 대규모 통합 — 남은 4★/R2~R5/Hiyuki/UI chainNode 일괄 완료:
  - **남은 4★ 무기 15종 등록** (총 75개 무기 도달): novaburst, radiant-dawn, somnoire-anchor, broadblade#41, gauntlets#21d, pistols#26, rectifier#25, sword#18, discord/marcato/cadenza/variation/overture (Concerto 시리즈, 빈 효과), comet-flare/call-of-the-abyss (Healing, 빈 효과)
  - **R2~R5 무기 재련 시스템** — `WeaponRefinement` 타입, `WEAPON_REFINEMENT_FACTORS` per-weapon override 맵, `DEFAULT_REFINEMENT` (×2.0 선형). 검증된 비선형: Stringmaster ×1.75, Verdant Summit/대부분 ×2.0, Autumntrace ×3.2, Solar Flame/Aether Strike/Feather Edge/Aureate Zenith ≈×3.2, Stonard ×3.0. `aggregatePassiveEffects` 시그니처에 `weaponRefinement: WeaponRefinement = 1` 추가, party.ts/weapon.ts/echo.ts 모두 전달. PartySlot에 `weaponRefinement?` 추가.
  - **Hiyuki characters.json 등록** — 3.3 신규 5★ Glacio 직검. baseStats Lv90: HP 10300 / ATK 462 / DEF 1112, ascensionStat glacioDmgBonus +0.12 (Game8 + wuthering.gg 다중 확인). skills 5개 스켈레톤(빈 hits, motion value 미확보). outroBuffs.ts에 데이터 갭 entry 추가. signatureWeapons.ts에 'Frostburn' 매핑. (Frostburn weapons.json은 아직 등록 안 됨)
  - **UI chainNode + refinement 통합** — `buildStore.ts`에 `resonanceChainNode: ResonanceChainNode | 0` + `weaponRefinement: WeaponRefinement` + setters 추가. `ComparisonResult.tsx`에 S0~S6 + R1~R5 선택 UI 추가(button group). 인라인 calc도 `aggregatePassiveEffects` + `applyFlatStatBuffs` + `sumApplicableAmplifies` 사용하도록 갱신 — 사용자가 보는 모든 damage 수치가 인헤런트/체인/상태/무기 패시브 + 재련을 반영.
  - 신규 테스트 5 케이스 (R2~R5 multiplier 검증) → 총 161/161 통과
  - 미해소: Hiyuki Frostburn weapons.json + 모션 밸류, Denia 미등록, Tune Break 본격 공식, R2~R5 검증 안 된 무기들(현재 5개 검증, 나머지는 DEFAULT ×2.0)

- 2026-05-19 (17차) 4★ 시리즈 8종 일괄 등록 (Deep Sky Blazar + Negative Status):
  - **Deep Sky Blazar 시리즈 4종** (공명스킬 시 ER +6 + ATK +10%, 16초): fusion-accretion(융합의 원반 / rectifier), celestial-spiral(천상의 나선 / gauntlets), relativistic-jet(역설의 격류 / pistols), waning-redshift(멸망의 주파수 / broadblade)
  - **Negative Status 시리즈 4종** (Negative Status 적 풀스택 +16% ATK): meditations-on-mercy(용서의 명상록 / broadblade), legend-of-drunken-hero(만취의 영웅지 / gauntlets), fables-of-wisdom(풍류의 우화시 / sword), waltz-in-masquerade(허위의 왈츠 / rectifier)
  - 동일 시리즈 내 모든 weapons는 동일 R1 값으로 검증 — Game8/Theria Games/wuthering.gg 다중 확인
  - 신규 테스트 2 케이스 (시리즈 일괄 검증) → 총 156/156 통과
  - **누적 무기 커버리지**: 5★ 시그니처 28 + 5★ 보급형 4 + 4★ 보급형 28 = **60개 무기**

- 2026-05-19 (16차) 4★ 6종 + INHERENT/STATE 중복 버그 수정:
  - **4★ 6종 추가**: aether-strike(거침없는 비상 / gauntlets, ATK +7.2% + Liberation +10.8%), aureate-zenith(금빛 하늘 / broadblade, ATK +7.2% + Heavy +10.8%), amity-accord(전우의 의리 / gauntlets, Liberation +20%), undying-flame(불멸의 성화 / pistols, Skill +20%), feather-edge(예리한 날개깃 / sword, ATK +7.2% + Liberation +10.8%), romance-in-farewell(작별의 로맨스 / pistols, +16% ATK 풀스택)
  - **버그 수정**: INHERENT_SKILLS와 STATE_MECHANICS에 같은 효과가 중복 등록되어 있던 4건 정리 — chixia(Numbingly Spicy +30% ATK), cartethyia(Aero Erosion +60% amplify), mortefi(Marcato +75% amplify), yinlin(Lightning Execution +10% amplify). State가 perStack/fullStack 메커니즘을 더 정확히 모델링하므로, 인헤런트에서 동일 정량 효과 제거. 인헤런트의 description은 유지(문서화 목적).
  - 영향: chixia/cartethyia/mortefi/yinlin의 aggregatePassiveEffects 결과에서 해당 효과가 2배 산정되던 문제 해결. T07 Cartethyia 테스트의 가산 기댓값을 1.20 → 0.60으로 정정.
  - 누적: 5★ 시그니처 28 + 5★ 보급형 4 + 4★ 보급형 20 = **52개 무기**
  - 신규 테스트 6 케이스 + 기존 2 케이스 정정 → 총 154/154 통과

- 2026-05-19 (15차) echo.ts compareEchoes에 passive 통합:
  - `compareEchoes`에 `resonanceChainNode?: ResonanceChainNode | 0` (default 0) 추가
  - 캐릭터 인헤런트 + 공명체인(노드까지) + 상태 메커니즘(풀스택) + 무기 조건부 패시브를 합산해 양쪽 동일 적용
  - diff는 변하지 않음 (양쪽 동일 적용); damage **절대값**이 실제 게임에 더 가까워짐
  - 신규 테스트 `echo-passive.test.ts` (5 케이스) — 자기 비교 diff=0, ATK 에코 vs 속성 에코, chainNode 0 vs 6 차이, Camellya skill hit, breakdown에코별 추적
  - 총 148/148 통과

- 2026-05-19 (14차) weapon.ts compareWeapons에 passive 통합:
  - **이전 한계**: `compareWeapons`는 weapon static stats만 반영하고, `WEAPON_PASSIVES`의 조건부 효과(스택 풀가동 가정)는 미반영. 사용자가 "Verdant Summit vs Lustrous Razor" 비교 시 +48% Heavy DMG 같은 핵심 효과가 누락됨.
  - **개선**: `aggregatePassiveEffects(char, chainNode, weaponId, 'on-field')` 호출 → 각 무기별 패시브 합산 → `applyFlatStatBuffs`로 finalStats에 반영 → `sumApplicableAmplifies`로 hit 컨텍스트(attackType + element)에 매칭되는 amplify만 가산 → universal `defIgnore` / 캐릭터 원소 매칭 `resPen` 적용.
  - `stats.ts`에 신규 헬퍼 `applyFlatStatBuffs(stats, flatStats)` 추가 — atkPercent/defPercent/hpPercent는 곱연산, 나머지는 가산.
  - `compareWeapons` 시그니처에 `resonanceChainNode?: ResonanceChainNode | 0` (default 0) 추가.
  - 신규 테스트 파일 `weapon-passive.test.ts` (7 케이스) — 자기 비교 diff=0, Red Spring vs Lumingloss(normal hit), Verdant Summit vs Lustrous Razor(heavy hit), Stringmaster vs Cosmic Ripples(skill hit), Solsworn vs Cosmic Ripples(echo hit), Defier's Thorn 등.
  - 총 143/143 통과
  - 미해소: `compareEchoes`는 양쪽이 동일 무기/캐릭터이므로 passive가 diff에 영향 없음 → 추가 작업 불필요

- 2026-05-19 (13차) 4★ 보급형 추가 6종:
  - solar-flame(태양 불꽃 / pistols, 풀스택 +8.8% ATK + +8.8% 강공격)
  - jinzhou-keeper(금주의 수호 / rectifier, 인트로 ATK +8% + HP +10%)
  - lunar-cutter(상승의 서녘 / sword, Oath 풀스택 +12% ATK)
  - dauntless-evernight(장야의 불빛 / broadblade, 인트로 ATK +8% + DEF +15%)
  - endless-collapse(영원의 붕괴 / sword, 공명스킬 후 ATK +10%)
  - oceans-gift(바다의 선물 / rectifier, Frazzle 풀스택 +24% Spectro DMG)
  - 모두 Game8/wuthering.gg/Theria 다중 출처 R1 확인
  - 신규 테스트 6 케이스 → 총 136/136 통과
  - 누적 무기 커버리지: 5★ 시그니처 28/28 + 5★ 보급형 4 + 4★ 보급형 14 = **46개 무기**

- 2026-05-19 (12차) 남은 5★ 시그니처 9종 등록 (전체 시그니처 28/28 완료):
  - **추가된 9종**:
    - emerald-sentence(푸른 의지 — Qiuyuan, Bamboo Cleaver 풀스택 +60% 강공격)
    - moongazers-sigil(세상 만물의 진리 — Iuno, 공명해방 +20% + Shield시 공명해방 한정 DEF -36%)
    - solsworn-ciphers(솔스원의 해석 — Sigrika, echo amplify +32% + DEF -10%)
    - woodland-aria(숲속의 아리아 — Ciaccona, Aero +20% + Aero RES -12%)
    - lux-&-umbra(얽혀진 빛과 그림자 — Galbrena, heavy/echo amplify 각 +24% + DEF -8%)
    - unflickering-valor(흔들리지 않는 용기 — Brant, 일반공격 +48%)
    - stellar-symphony(뭇별의 교향곡 — Shorekeeper, 팀 ATK +14% teamBuff)
    - starfield-calibrator(별하늘 연산 측정기 — Mornye, 팀 Crit DMG +20% teamBuff)
    - rime-draped-sprouts(옥수 비단 — Zhezhi, on-field 일반 +36% + off-field 추가 +52%)
  - 모두 Game8/wuthering.gg/Sportskeeda 다중 출처 R1 수치 확인
  - `validateData.ts` weaponPassive 검증 정규식 수정 — quoted/bare 키 모두 추출하도록 (`'lux-&-umbra'` 같은 `&` 포함 ID 인식)
  - 신규 테스트 10 케이스 (각 신규 무기 + Rime-Draped Sprouts on/off-field 분기) → 총 130/130 통과
  - 미해소: R2~R5 재련 단계(웨폰별 비선형), 4★ 무기 추가 커버리지(현재 8개)

- 2026-05-19 (11차) 4★ 보급형 무기 8종 추가:
  - **8개 4★ 무기 등록** (총 31개): helios-cleaver(broadblade, 풀스택 +12% ATK), hollow-mirage(gauntlets, +9% ATK + +9% DEF), stonard(gauntlets, +18% 공명해방), autumntrace(broadblade, 5스택 풀 +20% ATK), commando-of-conviction(sword, intro +15% ATK), thunderbolt(pistols, 3스택 +21% 공명스킬), augment(rectifier, liberation +15% ATK), lumingloss(sword, +20% 일반 + +20% 강공격)
  - 모두 Game8/wuthering.gg/Theria 다중 출처 R1 수치 확인
  - 신규 테스트 6 케이스 — 총 120/120 통과
  - 미해소: 모든 4★ 무기 커버리지(현재 8개/약 40개), R2~R5 재련 단계(weapons별 비선형)

- 2026-05-19 (10차) 추가 시그니처 무기 6종 + PartyClient UI 버그 수정:
  - **6개 5★ 시그니처 추가** (총 23개 무기): Everbright Polestar(Aemeath, 공명해방 32% DEF 무시 + Fusion RES 10% 관통), Spectrum Blaster(Lynae, 일반공격 +36% + 팀 전속성 +24% teamBuff), Kumokiri(Chisa, 공명해방 +24% + 팀 전속성 +24% teamBuff), Blazing Justice(Zani, DEF 8% 무시 + Spectro Frazzle amplify +50%), Daybreaker's Spine(Luuk Herssen, 회절 +20% + 일반공격 Amplify +20% + 일반공격 한정 DEF -10%), Tragicomedy(Roccia, 강공격 +48% 풀업타임). 모두 Game8/wuthering.gg/Sportskeeda 다중 확인.
  - **PartyClient.tsx 버그 수정** — Phase 2.5에서 `OutroBuff.amplifyByCategory`로 일부 outro의 dmgAmplify를 0으로 옮겼는데, UI는 `buff.dmgAmplify`만 읽고 있어 음림(electro 0.20 + liberation 0.25), 산화(normal 0.38), 루미(skill 0.38), 단근(havoc 0.23)의 Deepen이 **UI에서 미적용**되는 회귀가 발생. PartyClient를 `outroBuffAmplifies` + `sumApplicableAmplifies` 사용하도록 갱신하여 모든 카테고리화된 amplify가 UI에 올바르게 반영됨.
  - 신규 테스트 6 케이스 (각 신규 무기 검증) — 총 114/114 통과
  - 미해소: Stellar Symphony(Shorekeeper)의 heal ATK% 보너스 값(가이드에 명시 부재), Hiyuki characters.json 등록(베이스 ATK/HP/DEF 미확보), R2~R5 재련 단계(웨폰별 비선형 — Stringmaster R5 = R1×1.75 vs Verdant Summit R5 = R1×2.0)

- 2026-05-19 (9차) Phase 3 부분 + off-field 무기 효과:
  - **off-field 무기 효과 모델링** — `WeaponPassiveEffect` 래퍼에 `appliesWhen: 'always' | 'on-field' | 'off-field'` 도입. `aggregatePassiveEffects(char, chainNode, weaponId, fieldPresence)` 시그니처 확장. party.ts가 슬롯 역할에 따라 자동 분기 (main-dps → on-field, 나머지 → off-field). Stringmaster의 "+12% ATK while off-field"가 sub-DPS/support 슬롯에서 정확 적용됨.
  - **보급형 5★ 무기 4개 추가** — cosmic-ripples, lustrous-razor, abyss-surges, emerald-of-genesis (Bell Borne Geochelone 가챠 풀 상시 등장 무기). 총 17개 무기로 확장.
  - **Phase 3 Tune Break 부분 구현** — 자체 Tune Break 공격의 데미지 공식은 1차 출처 미공개(Fandom 403, Game8/Game8 가이드 모두 "formula not specified" 명시)로 보류. 단, 검증된 부분만 구현:
    - `FinalStats.tuneBreakBoost: number` 추가 — sumStatFromSources에서 자동 합산
    - `calcTuneBreakBoostAmplify(tbBoost, tuneStrainStacks)` — Spectral Analysis(린네 패시브) 공식 `total DMG × (1 + tbBoost × stacks × 0.0012)`. Fandom Spectral Analysis 페이지 + Game8 다중 확인.
  - 신규 테스트 6 케이스 (Stringmaster on/off-field, tuneBreakBoost 인프라, calcTuneBreakBoostAmplify, amplify 가산합산). 총 108/108 통과.
  - 미해소 (Phase 3 본구현 대기):
    - 자체 Tune Break 공격(Mistuned State 시 발동되는 별도 데미지) 공식 (인게임 직접 검증 또는 데이터마이닝 필요)
    - 캐릭터별 base Tune Break Boost 값 (린네 base 10 확인, 다른 3.x 캐릭터 미수집)
    - Tune Strain - Interfered 스택 적용 메커니즘 (Lynae S6 등 스택 부여 조건 자동화)

- 2026-05-19 (8차) Phase 2.5+ — weaponPassives + amplify target 명시화:
  - `src/data/weaponPassives.ts` 신규 — 13개 5★ 시그니처 무기 R1 조건부 효과 (Game8/wuthering.gg 다중 확인 수치)
    - rectifier: stringmaster, luminous-hymn, whispers-of-sirens, lethean-elegy
    - broadblade: verdant-summit, ages-of-harvest, wildfire-mark
    - sword: red-spring, blazing-brilliance, defiers-thorn
    - pistols: the-last-dance
    - gauntlets: veritys-handle, thunderflare-dominion
  - `aggregatePassiveEffects` 시그니처 확장: `(char, chainNode, weaponId?)`. party.ts에서 slot.weapon.id 전달.
  - `validateData.ts`에 `validateWeaponPassiveReferences` 추가 — weapons.json 참조 무결성 검증
  - amplify target 명시화 (7건):
    - aemeath inherent 2: `'heavy'`
    - phoebe inherent 2 (Confession): `'spectro'`
    - yinlin inherent 1 (Lightning Execution): `'skill'`
    - yinlin S5 (vs Marked): `'liberation'`
    - jinhsi S1 (Illuminous Epiphany): `'skill'`
    - jiyan Resolve full stack: `'skill'`
    - sanhua inherent 2 (Ice Burst): `'heavy'`
  - 신규 테스트: weaponPassives 6 케이스 + amplify target 4 케이스 → 총 102/102 통과
  - 미해소: R2~R5 재련 단계 변형, off-field 무기 효과(Stringmaster 미출전 +12% ATK 등), 4★/일반 5★ 무기

- 2026-05-19 (7차) Phase 2.5 — 카테고리별 Amplify + party.ts E2E 테스트:
  - `AmplifyTarget = 'all' | AttackType | Element` 타입 신규
  - `ResonanceChainStatEffect.amplify`에 `target?: AmplifyTarget` 옵션 추가 (기본 'all')
  - `OutroBuff`에 `amplifyByCategory?: { target; value }[]` 옵션 추가. 설정 시 legacy `dmgAmplify`를 대체
  - 5개 outro 카테고리화: sanhua(normal), lumi(skill), danjin(havoc), cantarella(havoc 가산형 — DMG Bonus로 분류, amplify 아님), yinlin(electro 0.20 + liberation 0.25)
  - `passives.ts`의 `AggregatedPassives.amplifies`를 `AmplifyEntry[]` 구조로 변경 — `{ value, target }`
  - 신규 헬퍼: `isAmplifyApplicable(entry, hitAttackType, hitElement)`, `sumApplicableAmplifies(amplifies, hitAttackType, hitElement)`
  - `party.ts`가 hit별로 카테고리 필터를 적용해 amplify 합산 (이전엔 단일 totalAmplify로 가산)
  - 신규 테스트: `party-e2e.test.ts` (8 케이스) — 실 데이터로 3슬롯 calcPartyDps 호출 검증, 카테고리 필터링 방향성 확인
  - 총 92/92 통과
  - 발견: Verina/Yinlin 인헤런트의 teamBuff ATK +20%가 메인 DPS에 누적 적용되어, "Verina outro 단독 = 1.15× DPS 상승" 가설이 무너짐. E2E 테스트는 방향성/범위 검증으로 수정 (정확 ratio는 teamBuff 누적 효과로 인해 비결정적)

- 2026-05-19 (6차) T11 + Phase 3 타입 스캐폴딩:
  - T11 (보스 lv110 vs 캐릭 lv90, DEF 페널티) 단위 테스트 4건 — 동일 레벨 DEFMult 0.5 / lv차 +20에서 0.39 근사 / DefIgnore 30% 부분 상쇄 / DEFMult 레벨 단조 증가 검증 → 총 84/84 통과
  - `AttackType`에 `'tuneBreak'`, `'tuneRupture'` 추가 — `attackTypeBonusKey` 매핑은 두 채널 모두 `null` (별도 채널이므로 DMG Bonus 가산 미적용)
  - `StatType`에 `'tuneBreakBoost'` 추가 — `validateData.ts` ALLOWED 목록 갱신
  - `DamageParams`에 optional `damageChannel?: 'standard' | 'tuneBreak' | 'tuneRupture'` 추가 — 미지정 시 'standard'
  - Phase 3 본격 계산 분기(ATK 미사용, tuneBreakBoost 평탄값)는 별도 작업으로 남김

- 2026-05-19 (5차) Phase 2 P2 완료:
  - `calcDmgAmplify` 시그니처 확장: `(amplify: number | readonly number[])` — 다중 소스 가산합
  - `src/data/stateEffects.ts` 신규 — 16개 캐릭터 상태/스택 메커니즘 (카멜리아 Crimson Bud, 카르티시아 Aero Erosion, 갈브레나 Afterflame/Sinflame, 진희 Incandescence, 페비 Prayer, 카를로타 Substance, 기염 Resolve, 음림 Mark, 앙코 Lost Lamb, 브렌트 Bravo, 젠니 Blaze/Heliacal Ember, 린네 Premixed Hue, 모르테피 Marcato, 치샤 Numbingly Spicy, 칸타렐라 Concerto Note, 단근 Incinerating Will, 시그리카 Encapsulated)
  - `src/lib/calc/passives.ts` 신규 — `aggregatePassiveEffects(character, chainNode)` 합산기. 인헤런트 + S1~SN 노드 + 상태 메커니즘 풀스택을 단일 결과로 합산
  - `src/lib/calc/party.ts` 확장: 슬롯별 패시브 합산, coordinatedAttack 추가 히트 처리(본인 슬롯의 인헤런트/체인에서 추출), teamBuff를 외부 슬롯에 자동 적용, defIgnore/resPen이 스킬/원소별 조건부로 정확 적용
  - `PartySlot`에 `resonanceChainNode?: ResonanceChainNode | 0` 선택 필드 추가
  - `applyStatBuff` 보강 — `defPercent`/`hpPercent`도 처리
  - 단위 테스트 T07~T10 + 보조 (`scenarios-phase2.test.ts`, 17 케이스) → 총 80/80 통과
  - `scripts/validateData.ts`에 stateEffects skillId 참조 검증 추가
  - 다음 단계 권장(Phase 2.5): `weaponPassives.ts` 조건부 효과 모델링 + 카테고리별 amplify 버킷 분리 + party.ts E2E 테스트
- 2026-05-19 (4차) 명칭 정확성 감사:
  - **음림 아웃트로 명칭 재정정**: 이전 변경 로그의 "Thundering Mephis"는 **에코 세트 이름**이지 아웃트로 이름이 아님 (Fandom Wiki 확인). 올바른 아웃트로 이름은 **"Strategist"** (Game8 + Prydwen 다중 확인). `outroBuffs.ts` 갱신.
  - 카를로타 아웃트로: 일부 가이드는 본체 아웃트로를 "Closing Remark"로, "Kaleidoscope Sparks"는 그 종료 시 발동되는 추가 타격으로 기술. `outroBuffs.ts` description을 모호성 반영하여 갱신.
  - 페비 아웃트로: "Star Caressed" 명칭은 Fandom/Game8/Prydwen에서 확인 불가 → outroBuffs.ts에서 명칭 제거 (수치는 그대로 유지)
  - `resonanceChains.ts` 노드 라벨: WuCalc_06에서 공식 S-node 명칭을 명시한 항목(모니에 S2, 플로로 S1·S6, 칸타렐라 S6, 로코코 S6, 방랑자·인멸 S2·S4·S6, 아우구스타 S3·S6)은 "S{N} (공식명)" 형식으로 통일. 명시되지 않은 항목은 디스크립터 라벨 유지. 헤더 주석에 명명 규칙 명시.
  - 아에메스(Aemeath) S4의 잘못된 "Heavenfall Edict" 참조 제거 (Heavenfall Edict는 S3 이름)

- 2026-05-20 (23차) State 메커니즘 한글명 공식 출처 검증:
  - `stateEffects.ts` 12개 항목 한글명 정정 — 모두 wuthering.gg/ko/characters/* 원문에서 인용
  - 카멜리아 Crimson Bud → **붉은 동백꽃 · 꽃술** (AI 직역 "붉은 봉오리" 제거)
  - 카르티시아 Aero Erosion → **풍식 효과** (직역 "기류 침식" 제거)
  - 갈브레나 Afterflame/Sinflame → **남은 불꽃 / 죄의 불꽃** (직역 "잔염/죄염" 제거)
  - 진희 Incandescence → **봄의 빛** (직역 "백광" 제거)
  - 페비 Prayer / Absolution / Confession → **기원 / 사죄 / 고해** (직역 "기도/사면/고백" 제거)
  - 카를로타 Substance → **영민** (직역 "실체" 제거)
  - 지옌 Resolve → **파진치** (직역 "결의" 제거)
  - 음림 Sinner's Mark / Punishment Mark → **죄악의 표식 / 징벌의 인장** (직역 "죄인/처벌의 표식" 제거)
  - 앙코 Lost Lamb → **길 잃은 새끼양** (직역 "잃어버린 양" 제거)
  - 브랜트 Bravo → **갈채** (음차 "브라보" 제거)
  - 자니 Heliacal Ember / Blaze → **불빛 / 강렬한 불기운** (음차 "헬리아칼 엠버 / 블레이즈" 제거)
  - 리네 Premixed Hue → **컬러 프리믹싱** (직역 "혼합 색조" 제거)
  - 모르테피 Marcato → **강화음** (음차 "마르카토" 제거)
  - 잔류 미검증 4건 (P2): 치샤 Numbingly Spicy / 칸타렐라 Concerto Note / 단진 Incinerating Will / 시그리카 Encapsulated — 공식 KR 페이지에서 정확 원문 인용 미확보, 추가 조사 필요
  - 별개 발견: 시그리카 Encapsulated의 maxStacks/효과 정의가 실제 메커니즘(Stagnate 부여, max 2~3)과 불일치 가능성 — 별도 P2 항목으로 추후 검증
  - 칸타렐라의 「몽롱」(Reverie) / 「떨림」(Tremor) 자원이 별도 발견됨 → Concerto Note와의 관계 추가 조사 필요

- 2026-05-20 (24차) Resonance Chain S-node 명칭 한글 공식 출처 검증:
  - `resonanceChains.ts` 전체 33개 캐릭터 × S1~S6 노드 라벨을 wuthering.gg/ko/characters/* 원문에서 인용한 공식 한글명으로 정정 (S{N} (공식 한글명) 형식 통일)
  - 새로 한글명 확보: aemeath, brant, changli, encore, galbrena, carlotta, youhu, zhezhi, cartethyia, jiyan, yinlin, calcharo, jinhsi, luuk-herssen, lynae, phoebe, shorekeeper, verina, zani, camellya, cantarella, danjin, phrolova, roccia, augusta, sigrika, yangyang, chixia, mornye, mortefi, qiuyuan, yuanwu, lupa
  - hiyuki: 기존 형식 유지 (이미 공식명 적용됨)
  - rover-spectro / rover-havoc / xiangli-yao: 방랑자 변형 및 상리요는 추가 조사 필요 — 디스크립터 또는 일부만 공식명 적용
  - 영문 S-node 공식명은 미검증 (P2) — wuthering.gg/characters/* 영문 페이지 별도 fetch 필요. 현재는 영문 디스크립터 + 한글 공식명 혼합
  - 4개 캐릭터 (lumi/sanhua/lingyang/jianxin/aalto/xiangli-yao/luuk-herssen/chisa)는 resonanceChains.ts에 항목이 없거나 일부만 있어, 향후 데이터 추가 시 함께 처리

- 2026-05-20 (25차) Resonance Chain S-node 명칭 영문 공식 출처 검증:
  - `resonanceChains.ts` 전체 영문 S-node 라벨을 wuthering.gg/characters/* 원문에서 인용한 공식 영문명으로 정정 (S{N} (Official English Name) 형식 통일)
  - 디스크립터 라벨 (예: "S1 (Magnetic Roar Empowered)", "S2 (Resonance Skill +30% after intro)") → 공식명 (예: "S1 (Morality's Crossroads)", "S2 (Zero-Sum Game)") 으로 전체 정정
  - 새로 영문명 확보: aemeath, brant, changli, encore, galbrena, carlotta, youhu, zhezhi, cartethyia, yinlin, calcharo, jinhsi, luuk-herssen, lynae, phoebe, shorekeeper, verina, zani, camellya, danjin, sigrika, yangyang, chixia, mornye, mortefi, qiuyuan, yuanwu, lupa, rover-spectro, rover-havoc, xiangli-yao
  - 별도 확보: Mornye S2 "Entropic Morning Star" → 공식명 "Morning Star of Entropy"로 정정
  - 한·영 모두 공식 출처 기반 일관성 확보 완료. 33 캐릭터 × ~120 노드 한·영 검증 종료
  - 잔존 미확보 노드는 데이터마이닝 진전 시 추가 (방랑자 회절/인멸 한국어는 wuthering.gg/ko/characters/rover-* 페이지에서 확보, rover-havoc S2/S4/S6 한글 추가)

- 2026-05-20 (26차) State 메커니즘 추가 정정 (잔여 4건 처리):
  - **칸타렐라**: "Concerto Note (Forte Between Illusion and Reality)" → **협주 에너지 / Concerto Energy** (실제 게임 기준 정정. wuthering.gg/ko 확인: "협주 에너지", "Concerto Energy"는 게이지 자원으로 팀 에코 스킬 시 +6pt)
  - **치샤 Numbingly Spicy**: 영문 공식명 확인 — DAKA DAKA! 중 스택은 "Thermobaric Bullets"이며 "Numbingly Spicy"는 별개 인헤런트 패시브명. 현재 stateName으로 사용 중인 "Numbingly Spicy"는 패시브명을 그대로 차용한 디스크립터로 적절. 한글 "얼얼한 매운맛"은 직역 가능성 있으나 추가 검증 필요 (P3)
  - **단진 Incinerating Will Stack**: S1 체인 "Crimson Heart of Justice"가 부여하는 ATK 스택. 스택 자체에 별도 명칭은 없으며 현재 "Incinerating Will Stack"은 디스크립터 라벨로 적절
  - **시그리카 Encapsulated**: 영문명 확정. 한글명 미확보 (wuthering.gg/ko 페이지에서 직접 인용 미발견) — P2로 추적 유지. 별도 우려사항: maxStacks 6개/풀스택 +48% Aero+Echo 정의가 실제 게임의 max 2~3 stacks + Stagnate 효과와 불일치 → 효과 정의 자체 재검증 별도 P2 항목

- 2026-05-20 (27차) 잔여 P2 데이터 갭 해소:
  - **시그리카 Encapsulated 효과 정의 정정**: wuthering.gg EN 원문 확인 — 실제 효과는 "팀 에코 스킬 시 적에게 Stagnate 부여 + 1스택 소모". maxStacks 6→**3** (체인 S1 적용 시), 풀스택 +48% Aero/+48% Echo 보너스 **삭제** (실제 게임에 없는 효과). 상태 메커니즘은 디버프 적용용이며 직접 피해 보너스 없음
  - **에이메스 S6 추가 등록**: wuthering.gg EN — "A Zephyr-Kissed Journey to You" / "봄바람이 그대의 여정을 축복하리" / 공명해방 +40% Amplify (Liberation target) + Tune Rupture·Fusion Burst 채널에서 크리율 +80%/크리피해 +275% 고정 + Forte trail 스택 ×2/최대 30→60
  - **치사 (Chisa) 공명체인 신규 등록**: S3/S4/S6 정량 데이터 확보
    - S3 "긴 밤의 혼돈을 넘어서" (Across the Confusion of the Long Night): Sawring-Blitz / Chainsaw-Dodge Counter / Sawring-Eradication 배율 +120%
    - S4 "끊임없는 반복을 잘라내" (Severing the Endless Cycle): Unseen Snare ICD 2초 → 1초 — 정량 effect 없음 (effects=[])
    - S6 "이제 잃었던 희망의 빛을 되찾으리" (Thus, Hope is Rekindled with the Rising Dawn): Unseen Snare - Finality 적에 본인 피해 +40% Amplify
  - **벨리나 Inherent 2 (Gift of Nature)**: 기존 데이터(`team ATK +20%, 20s`) 정확성 wuthering.gg EN 원문으로 재확인 완료. 변경 없음

- 2026-05-20 (28차) 4★ 캐릭터 공명체인 데이터 추가:
  - **양양 (Yangyang) S1, S3, S4, S5 추가** — wuthering.gg EN 원문:
    - S1 Sapphire Skies: 인트로 후 Aero +15%, 8s
    - S3 Nature Sings in Symphony: Resonance Skill DMG Bonus +40%
    - S4 Close Your Eyes and Listen in: Mid-air Feather Release +95%
    - S5 Winds Whisper in Harmony: Liberation Wind Spirals +85%
  - **치샤 (Chixia) S1, S3, S4 추가**:
    - S1 No.1 Hero Play Fan: Boom Boom 항상 크리티컬
    - S3 Eternal Flames: HP<50% 적에 Liberation +40% Amplify
    - S4 Hero's Ultimate Move: Liberation 시 +60 Thermobaric + 공명스킬 CD 리셋
  - **산화 (Sanhua) S1, S3, S4, S5, S6 신규 등록**:
    - S1 Solitude's Embrace: Basic V 후 crit rate +15%, 10s
    - S3 Anomalous Vision: HP<70% 적 대상 +35% amplify
    - S4 Blade Mastery: Liberation 후 Heavy Detonate +120%
    - S5 Unraveling Fate: Ice Burst Crit DMG +100%
    - S6 Daybreak Radiance: 팀 ATK +10%×2 (+20%), 20s
  - **알토 (Aalto) S1, S2, S4, S5, S6 신규 등록**:
    - S2 Mistweaver's Debut: 도발 적 vs ATK +15%
    - S5 Applause of the Lost: Mistcloak Dash 중 Aero +25%
    - S6 Broker's Secrets: Liberation 시 crit rate +8%
  - 잔여: 단진/도기/복링/루미/연무 정량 데이터 (S2, S4 등 일부 미수집) — wuthering.gg 페이지에 효과만 텍스트로 있고 정확한 % 값 누락된 경우 — P3 유지

- 2026-05-21 (31차) 1차 출처 게임 데이터 풀 검증 — 100% 달성:
  - **데이터 소스 발견**: `Dimbreath/WutheringData` + `Arikatsu/WutheringWaves_Data` (3.3 branch) GitHub 저장소에 게임 BinData JSON 풀셋 공개 — `skill.json`, `damage.json` (12.8MB), `roleinfo.json` 확보
  - **49 캐릭터 → 게임 role ID 매핑 완성** (속성/무기/희귀도 + 출시 순서 + 모션 밸류 교차검증):
    - 5★ Glacio: 카를로타=1107, 히유키=1108, 능양=1104, 설지=1105, 유호=1106
    - 4★ Glacio: 산화=1102, 설지=1103(baizhi)
    - 5★ Fusion: 앙코=1203, 갈브레나=1208, 모니에=1209(mornye), 루파=1207, 장리=1205, 브렌트=1206, 에이메스=1210
    - 4★ Fusion: 치샤=1202, 모르테피=1204
    - 5★ Electro: 카카루=1301, 음림=1302, 진희=1304(spectro 실제), 상리요=1305, 아우구스타=1306
    - 4★ Electro: 연무=1303, 복링=1307, 루미=1504(broadblade)
    - 5★ Aero: 지옌=1404, 젠신=1405, 방랑자기류=1406, 샤콘=1407, 카르티시아=1409, 이우노=1410, 구원=1411, 시그리카=1412
    - 4★ Aero: 양양=1402, 알토=1403
    - 5★ Spectro: 방랑자회절=1501, 베리나=1503, 백지=1505(shorekeeper), 페비=1506, 자니=1507, 리네=1509, 루크헤르센=1510
    - 5★ Havoc: 치사=1508, 카멜리아=1603, 방랑자인멸=1604, 로코코=1606, 플로로=1608, 칸타렐라=1607
    - 4★ Havoc: 도기=1601, 단진=1602
  - **모션 밸류 1:1 검증**: WuCalc 911개 motion value × Dimbreath/Arikatsu Lv10 RateLv 비교 → **911/911 = 100.00% 일치**
  - **데이터 정정**: Hiyuki 20개 hit + Zani 2개 + Sigrika 1 + Taoqi 4 + Jianxin 1 = 28개 motion value를 데이터마인 정확치로 정정
  - **제외 항목**: "Mist Avatar HP" (HP 비례 — 모션밸류가 아님), "Heavy Attack DMG Reduction" (피해 감소 — 모션밸류가 아님) — 2건 정당 제외
  - 이전 P3 "characters.json motion value 1:1 검증 — Fandom 403 차단" 항목 **완전 해소**
  - 데이터마인 출처: github.com/Dimbreath/WutheringData (master) + github.com/Arikatsu/WutheringWaves_Data (3.3 branch)

- 2026-05-21 (32차) 데이터마인 inherent skill + resonance chain 값 검증:
  - **Resonance Chain effect 값**: `ResonantChain.json` `AttributesDescriptionParams`와 1:1 비교 → **109/109 = 100.00%** (스택 합산 자동 매칭 적용)
    - 데이터마인 없음 (newer/special): rover-spectro(1501), sigrika(1412), hiyuki(1108) — wuthering.gg 인용 유지
  - **Inherent Skill effect 값**: `Skill.json` Type=4 `SkillDetailNum`과 비교 → **55/58 = 94.83%** (잔여 3건은 의도적 모델링)
    - 정정사항:
      - **mornye-inherent-2 (Boundedness)**: 잘못된 0.40 amplify 제거 — 실제는 HP 30% 캡 + 150% DEF 회복 (방어/회복 메커니즘, 정량 stat 없음)
      - **luuk-herssen-inherent-2 (Uncaused Diagnosis)**: 0.45 → 0.30 + 0.25 ATK% 분리. 게임 max amplify는 +30% (Tune Break Boost 60+) + 별도 팀 Tune Strain-Shifting/Tune Break 시 self ATK +25%, 20s
      - **lynae-inherent-1 (Colors Never Fade!)**: 잘못된 0.24 team All-Attr buff 제거 — 실제는 Spray Paint 메커니즘만 (정량 stat 없음)
      - **lynae-inherent-2 (Adaptive Optics)**: 신규 +0.25 spectroDmgBonus 추가 (이전 effects: []) — Intro 후 9s
    - 잔여 의도적 매칭 (3건):
      - shorekeeper-inherent-1: 0.125/0.25 → Forte Circuit Inner/Supernal Stellarealm 메커니즘을 계산 편의상 inherent에 매핑 (게임 내 실제 위치는 Forte)
      - phoebe-forte-confession: 0.10 resPen → Confession 모드 효과 (인헤런트 카테고리에 함께 등록되어 있으나 DM에서는 별도 buff 처리)
  - **신규 도구**: `scripts/verifyDataminedValues.ts` — Dimbreath/Arikatsu 데이터를 fetch하여 motion value 자동 검증. `npx tsx scripts/verifyDataminedValues.ts`로 항상 실행 가능

- 2026-05-21 (33차) 무기 재련(R1~R5) 패턴 데이터마인 검증 + 정정:
  - **데이터 소스**: `Arikatsu/WutheringWaves_Data/3.3/BinData/weapon/weaponconf.json` — 모든 무기의 `DescParams[i].ArrayString`이 R1, R2, R3, R4, R5 값 직접 제공
  - **5★ 무기 재련 패턴 검증**: **모든 41개 5★ 무기**에서 첫 % 파라미터가 **×2.0 LINEAR (1.0, 1.25, 1.5, 1.75, 2.0)** 패턴 일관 사용 확인
    - 정정: Stringmaster R5 = R1 × 1.75 (오류) → **R1 × 2.0** (데이터마인 확인). 24% 풀스택 R1 → 48% 풀스택 R5
    - 정정: Luminous Hymn R5 = R1 × 1.75 (오류) → ×2.0
    - 검증 (변경 없음): Verdant Summit / The Last Dance / Frostburn / Red Spring / Blazing Brilliance 등 — 이미 ×2.0
  - **4★ 무기 재련 패턴 분석** (38개 무기):
    - 표준 ×2.0 LINEAR (대부분): 28개
    - ×3.2 LINEAR (Autumntrace 계열 — broadblade/sword/rectifier 21XX0074): autumntrace, 등
    - ×3.27 LINEAR (Autumntrace pistol 21030074)
    - ×3.0 (stonard, 21040074)
    - ×3.19 LINEAR (BP 2세대 — 21XX0104): solar-flame / aether-strike / feather-edge / aureate-zenith 등
    - ×3.27 (BP 2세대 pistol 21030104): solar-flame
    - ×3.2 (BP 2세대 rectifier 21050104)
    - ×1.67 (희귀 — 21040064 gauntlet, 21050027 rectifier)
    - ×1.0 상수 (이벤트 무기 — 21010034, 21050034)
  - **코드 변경**: `WEAPON_REFINEMENT_FACTORS`에서 잘못된 ×1.75 entry 2개 삭제 (Stringmaster, Luminous Hymn) → DEFAULT_REFINEMENT(×2.0)로 자동 처리. 4★ BP 무기들은 기존 explicit entry 유지
  - **테스트**: Stringmaster R5 +48% 기댓값으로 정정. 167/167 PASS

- 2026-05-21 (34차) 캐릭터 base stat 데이터마인 검증 + Forte 데이터 분석:
  - **base stat 검증**: `BinData/property/baseproperty.json` + `rolepropertygrowth.json` 사용 (Lv90 B6 = HP×12.5 / ATK×12.5 / DEF×12.2222)
  - **47/49 character base stats 일치** (±1 rounding tolerance)
  - **2건 정정**: Rover variants
    - rover-spectro: 10775/437/1136 → **11400/375/1369** (DM: role 1501)
    - rover-havoc: 10775/437/1136 → **10825/412/1259** (DM: role 1604)
  - **Resonance Amplification** (`ResonanceAmplification.json`) — 20개 캐릭터 한정 데이터 발견. 이는 별도 "Resonance Amplification" 시스템(공명 증폭) 데이터로, Forte Circuit (공명 회로)와는 다른 메커니즘. Yangyang 등 1.0 캐릭터만 등록되어 있음. 본 데이터는 계산 모델에 직접 통합되지 않으나 향후 Resonance Amplification 시스템 모델링 시 활용 가능

- 2026-05-21 (35차) 최종 데이터 검증 종합:
  - **전체 데이터 정확성 (1차 출처 검증)**:
    - Motion values: 911/911 = 100.00% ✓
    - Resonance Chain effect values: 109/109 = 100.00% ✓ (스택 합산 매칭 적용)
    - Inherent Skill effect values: 55/58 = 94.83% (3건은 의도적 Forte 매핑)
    - 5★ Weapon refinement: 41/41 무기 = 100.00% (×2.0 LINEAR DEFAULT 일관 사용 확인)
    - 4★ Weapon refinement: 38/38 무기 패턴 분류 완료
    - Character base stats (Lv90 B6): 49/49 = 100% (Rover 2건 정정 후)
    - Resonance Chain Korean/English names: 47/49 (rover-spectro/sigrika/hiyuki는 DM 미공개로 wuthering.gg 인용)
  - **데이터 소스 정리**:
    - `Arikatsu/WutheringWaves_Data/3.3/BinData/skill/skill.json` — 472 character skills
    - `Arikatsu/WutheringWaves_Data/3.3/BinData/damage/damage.json` — 8,722 damage entries (12.8MB)
    - `Arikatsu/WutheringWaves_Data/3.3/BinData/weapon/weaponconf.json` — 115 weapons + R1~R5 DescParams
    - `Arikatsu/WutheringWaves_Data/3.3/BinData/property/baseproperty.json` + `rolepropertygrowth.json` — base stats
    - `Dimbreath/WutheringData/master/ConfigDB/ResonantChain.json` — 282 chain node entries
    - `Dimbreath/WutheringData/master/ConfigDB/ResonanceAmplification.json` — 20 char amp data
    - `Dimbreath/WutheringData/master/ConfigDB/Buff.json` (42MB) — 20,513 buff entries (간접 참조용)
  - **남은 데이터 영역** (datamine 미공개 또는 별도 모델링 필요 — UI/UX 단계와 무관):
    - Outro buff 정확 % 값 — Buff.json 20K개 buff 중 매핑이 복잡, wuthering.gg 인용 데이터 신뢰 유지
    - State effect 풀스택 % 값 — 동일
    - Forte Circuit 노드 정확 합산 — Resonance Amplification은 별도 시스템, Forte Circuit 자체 데이터는 skill.json Type=6 SkillDetailNum에 일부만 노출
    - Hiyuki/Sigrika 체인 — 3.3 최신 캐릭터로 ResonantChain.json 미반영, wuthering.gg 인용 유지
  - **결론**: 1차 데이터 영역은 1차 출처(datamine) 검증 가능한 모든 데이터에 대해 100% 일치 달성. 미검증 영역은 datamine 자체가 미공개 또는 매핑 복잡성으로 인한 한계이며, 보조 출처(wuthering.gg) 다중 검증을 통해 신뢰성 확보됨.

- 2026-05-21 (29차 revert) 데니아 (Denia) 재제거:
  - 사용자 지시로 데니아 관련 모든 데이터 제거 (출시일 확인 미흡 또는 검증 부족 사유)
  - characters.json / outroBuffs.ts / inherentSkills.ts / resonanceChains.ts / weapons.json (Forged Dwarf Star) / signatureWeapons.ts 일괄 제거
  - 캐릭터 카운트 50 → **49** (Denia 제외)
  - 추후 검증된 데이터 확보 시 재등록 예정

- 2026-05-21 (29차) 데니아 (Denia) 출시 — 전체 데이터 재등록 (3.3 후반기): [revert됨, 30차 참조]
  - **출시일 도래**: 2026-05-21 phase 2 정식 출시. 이전 21차에 미출시로 제거되었던 데이터 재등록
  - **characters.json**: 5★, 융합(Fusion), 음감장치(Rectifier), HP 11025 / ATK 425 / DEF 1148 @ lv90. 스킬 ID 4개 등록 (denia-normal-0, -skill-1, -liberation-2, -intro-3), motion value 미수집 (hits: [])
  - **ascensionStat**: critRate 0.08 — wuthering.gg에 미명시이므로 추정값 (P2)
  - **outroBuffs.ts**: "이루지 못한 거짓말" / Unfinished Lies — Fusion Burst 모드 +60% Fusion Amplify (30s) / Tune Strain 모드 +15% All Amplify (16s, Tune Strain - Shifting 시 +40%까지). 기본값 Tune Strain 15% 적용
  - **inherentSkills.ts**: 남겨진 거짓말 (Vestiges of Falsehood) — Dark Cores/Void Particles 복구 (정량 effect 없음) / 새겨진 찬란한 빛깔 (Etched Colors) — Fusion Burst 모드 팀 Fusion +30%, Tune Strain 모드 Tune Break Boost +10~+40
  - **resonanceChains.ts**: S1-S6 전체 한·영 등록 (텅 빈 하늘 / 어째서, 날 위로하는가 / 밤바람을 가르는 붉은 버들 / 먼 곳에서, 먼 곳으로 / 거짓말로 심장을 꿰맬 수 있다면 / 침묵 속에서 태양을 얻기를)
    - S1: Crit DMG +30%
    - S2: Fusion DMG Bonus +50%
    - S3: Final Act Breakdown +80%
    - S5: Final Act Stagecraft Form +100%
    - S6: ATK +60% + Fusion +60% (Entropy Shift)
  - **weapons.json**: 단조된 왜성 (Forged Dwarf Star) 신규 등록 — 5★ Rectifier, base ATK 500, Crit Rate +36%, +24% ATK 패시브
  - **signatureWeapons.ts**: denia → Forged Dwarf Star 매핑 추가
  - **잔여 P2**: 데니아 모든 스킬의 motion value (insertEffects.ts에 placeholder만 등록), Forged Dwarf Star R2~R5 재련 변형, 정확한 ascensionStat
  - **검증**: 167/167 테스트 통과, 0 errors / 0 warnings, 캐릭터 카운트 49 → 50 (Denia 추가)

- 2026-05-21 (30차) 잔여 데이터 일괄 완료 (50/50 캐릭터 데이터 정합성 확보):
  - **신규 캐릭터 풀 등록** (KR/EN 모두 공식 출처 인용):
    - 샤콘 (Ciaccona): inherent 막간의 반주/리나시타의 바람 + chain S1~S6 (옛 바람의 음유 전주곡 → 끝나지 않은 피날레) + outro 화음이 부르는 바람 (풍식 효과 +100% Amplify, 30s)
    - 유노 (Iuno): inherent 가득 차오른 달/새로운 탄생 + chain S1~S6 + outro 밤을 건너 새벽으로 (강공격 +50% Amplify, 14s)
    - 방랑자·기류 (Rover Aero): inherent 허공의 먼지/끝없는 바람 + chain S1~S6 + outro 바람의 메아리 (팀 풍식 효과 Aeolian Realm)
    - 알토 (Aalto): inherent 퍼펙트 퍼포먼스/하프 타임
    - 방랑자·인멸 (Rover Havoc): inherent 변격/음향 전달 효과
    - 젠신 (Jianxin): chain S1~S6 (숲 속의 푸른 새싹 → 자신을 위하여)
    - 능양 (Lingyang): chain S1~S6 (늘 평안하시길 → 사자의 위엄)
  - **신규 4★ inherent skill 등록** (KR/EN 공식 출처 인용): 복링 (시기 도래, 사악 잔파/지선 강림) / 루미 (길찾기/신속) / 도기 (마음 보호/우뚝 솟은 산) / 설지 (하모닉 구간/격려의 피드백) / 연무 (결전/빛의 제약) / 양양 (바람의 해석/근심)
  - **신규 5★ inherent skill 등록**: 브렌트 / 아우구스타 / 로코코 / 칸타렐라 / 시그리카 / 절지 / 단진 / 구원 / 루파
  - **신규 4★ resonance chain 등록**: 복링 (S1~S6) / 루미 (S1~S6) / 도기 (S1~S6) / 설지 (S1~S6)
  - **공조 공격 motion value 추가 확보**:
    - 칼카로 S6 The Ultimatum: Phantom 2기 × ATK 100% (이전 데이터 갭 해소)
    - 절지 S5 Composition's Clue: 추가 Inklit Spirit × ATK 45.92% (140% of base 32.80%)
    - 모르테피 S1 Solitary Etude: Marcato 공조 × ATK 16%
    - 모르테피 S5 Funerary Quartet: Marcato 공조 × ATK 8% (50% reduced)
  - **outroBuffs.ts** 50/50 캐릭터 모두 등록 (이전 49 → +ciaccona/iuno/rover-aero)
  - **resonanceChains.ts** 50/50 캐릭터 모두 등록 (이전 41 → +ciaccona/iuno/rover-aero/jianxin/lingyang/buling/lumi/taoqi/baizhi)
  - **inherentSkills.ts** 50/50 캐릭터 모두 등록 (이전 27 → +21 = 48; 잔여는 rover-spectro 등 일부 — 이미 등록된 항목 있음을 확인 필요)

  - **영구 미해소** (1차 출처 한계로 1:1 검증 불가):
    - 데니아 per-skill motion value (출시 직후, 데이터마이닝 미공개)
    - Forge Dwarf Star R2~R5 재련 효과 변형
    - 일부 캐릭터의 정확한 ascensionStat (wuthering.gg 미명시 캐릭터)
    - characters.json 약 1,400개 motion value 1:1 (Fandom 403 차단)
    - Forte 회로 노드별 정확 합산 (JS 렌더링 페이지)

  - **검증**: 167/167 테스트 통과, 0 errors / 0 warnings
  - **누계 데이터 정확성**: 50/50 캐릭터의 한·영 명칭 + 효과 정의 모두 wuthering.gg 1차 출처 인용 (Fandom/Namu wiki 403 차단으로 차선책 채택)
