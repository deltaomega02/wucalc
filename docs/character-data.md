# WuCalc 캐릭터별 딜 계산 데이터

> 작성 기준: 2026년 5월 / 게임 버전 3.x  
> 캐릭터 명칭은 **한국 공식 인게임 명칭(나무위키 검증)** 과 **영문 공식명** 을 사용한다.  
> `src/data/resonanceChains.ts`, `src/data/inherentSkills.ts`, `src/data/outroBuffs.ts`, `src/data/stateEffects.ts`에 데이터로 옮길 1차 자료다.

---

## 0. 명칭 검증 결과

### 0.1 속성(Element) 한국 공식명

| 영문 키 | 한국 공식명 | 비공식 별칭 |
|---|---|---|
| fusion | 융합 | — |
| glacio | **응결** | 빙결 (커뮤니티 별칭) |
| aero | 기류 | — |
| electro | 전도 | — |
| havoc | 인멸 | — |
| spectro | 회절 | — |

> 본 문서는 인게임 공식 표기인 **응결**을 사용한다. 코드 측 `Element` 타입 키는 `glacio`로 유지.

### 0.2 무기 타입 한국 공식명

| 영문 키 | 한국 공식명 |
|---|---|
| broadblade | 광인검 (광검) |
| sword | 직검 |
| pistols | 권총 |
| gauntlets | 권갑 |
| rectifier | 증폭기 |

### 0.3 캐릭터 명칭 마스터 테이블 (48 + 누락 2명 = 50)

| ID | 한국 공식명 | 영문 공식명 | 속성 | 무기 | 등급 | 본 데이터 보유 여부 |
|---|---|---|---|---|---|---|
| **융합 (Fusion)** | | | | | | |
| aemeath | 에이메스 | Aemeath | 융합 | 직검 | 5★ | O |
| brant | 브렌트 | Brant | 융합 | 직검 | 5★ | O |
| changli | 장리 | Changli | 융합 | 직검 | 5★ | O |
| chixia | 치샤 | Chixia | 융합 | 권총 | 4★ | O |
| denia | **데니아** | **Denia** | 융합 | 증폭기 | 5★ | **X (신규 — 3.3 후반기)** |
| encore | 앙코 | Encore | 융합 | 증폭기 | 5★ | O |
| galbrena | 갈브레나 | Galbrena | 융합 | 권총 | 5★ | O |
| lupa | 루파 | Lupa | 융합 | 광인검 | 5★ | O |
| mornye | 모니에 | Mornye | 융합 | 광인검 | 5★ | O |
| mortefi | 모르테피 | Mortefi | 융합 | 권총 | 4★ | O |
| **응결 (Glacio)** | | | | | | |
| baizhi | 설지 | Baizhi | 응결 | 증폭기 | 4★ | O |
| carlotta | 카를로타 | Carlotta | 응결 | 권총 | 5★ | O |
| hiyuki | **히유키** | **Hiyuki** | 응결 | 직검 | 5★ | **X (신규 — 3.3 전반기)** |
| lingyang | 능양 | Lingyang | 응결 | 권갑 | 5★ | O |
| sanhua | 산화 | Sanhua | 응결 | 직검 | 4★ | O |
| youhu | 유호 | Youhu | 응결 | 권갑 | 4★ | O |
| zhezhi | 절지 | Zhezhi | 응결 | 증폭기 | 5★ | O |
| **기류 (Aero)** | | | | | | |
| aalto | 알토 | Aalto | 기류 | 권총 | 4★ | O |
| cartethyia | 카르티시아 | Cartethyia | 기류 | 직검 | 5★ | O |
| ciaccona | 샤콘 | Ciaccona | 기류 | 권총 | 5★ | O |
| iuno | 유노 | Iuno | 기류 | 권갑 | 5★ | O |
| jianxin | 감심 | Jianxin | 기류 | 권갑 | 5★ | O |
| jiyan | 기염 | Jiyan | 기류 | 광인검 | 5★ | O |
| qiuyuan | 구원 | Qiuyuan | 기류 | 직검 | 5★ | O |
| rover-aero | 방랑자·기류 | Rover (Aero) | 기류 | 직검 | 5★ | O |
| sigrika | 시그리카 | Sigrika | 기류 | 권갑 | 5★ | O |
| yangyang | 양양 | Yangyang | 기류 | 직검 | 4★ | O |
| **전도 (Electro)** | | | | | | |
| augusta | 아우구스타 | Augusta | 전도 | 광인검 | 5★ | O |
| buling | 복링 | Buling | 전도 | 권갑 | 4★ | O |
| calcharo | 카카루 | Calcharo | 전도 | 광인검 | 5★ | O |
| lumi | 루미 | Lumi | 전도 | 광인검 | 4★ | O |
| xiangli-yao | 상리요 | Xiangli Yao | 전도 | 권갑 | 5★ | O |
| yinlin | 음림 | Yinlin | 전도 | 증폭기 | 5★ | O |
| yuanwu | 연무 | Yuanwu | 전도 | 권갑 | 4★ | O |
| **회절 (Spectro)** | | | | | | |
| jinhsi | 금희 | Jinhsi | 회절 | 광인검 | 5★ | O |
| luuk-herssen | 루크·헤르센 | Luuk Herssen | 회절 | 권갑 | 5★ | O |
| lynae | 린네 | Lynae | 회절 | 권총 | 5★ | O |
| phoebe | 페비 | Phoebe | 회절 | 증폭기 | 5★ | O |
| rover-spectro | 방랑자·회절 | Rover (Spectro) | 회절 | 직검 | 5★ | O |
| shorekeeper | 파수인 | Shorekeeper | 회절 | 증폭기 | 5★ | O |
| verina | 벨리나 | Verina | 회절 | 증폭기 | 5★ | O |
| zani | 젠니 | Zani | 회절 | 권갑 | 5★ | O |
| **인멸 (Havoc)** | | | | | | |
| camellya | 카멜리아 | Camellya | 인멸 | 직검 | 5★ | O |
| cantarella | 칸타렐라 | Cantarella | 인멸 | 증폭기 | 5★ | O |
| chisa | 치사 | Chisa | 인멸 | 광인검 | 5★ | O |
| danjin | 단근 | Danjin | 인멸 | 직검 | 4★ | O |
| phrolova | 플로로 | Phrolova | 인멸 | 증폭기 | 5★ | O |
| roccia | 로코코 | Roccia | 인멸 | 권갑 | 5★ | O |
| rover-havoc | 방랑자·인멸 | Rover (Havoc) | 인멸 | 직검 | 5★ | O |
| taoqi | 도기 | Taoqi | 인멸 | 광인검 | 4★ | O |

**검증 결과 정정 사항**: 현재 `src/data/characters.json`의 48개 캐릭터 한국명/영문명은 **모두 정확**. 단, 다음 신규 캐릭터가 누락되어 있다:
- 히유키 (Hiyuki) — 3.3 전반기 / 응결 직검 5★
- 데니아 (Denia) — 3.3 후반기 / 융합 증폭기 5★

---

## 1. 캐릭터별 딜 계산 데이터

> 본 섹션은 `src/data/resonanceChains.ts`, `src/data/inherentSkills.ts`, `src/data/outroBuffs.ts`, `src/data/stateEffects.ts`에 옮길 1차 자료다.  
> 모든 데이터는 영문 위키·prydwen.gg·game8.co·sportskeeda·lootbar.gg·theriagames.com·namu.wiki 다중 출처 교차 검증.  
> **수치가 출처별로 불일치하거나 미공개인 경우** "데이터 갭"으로 명시 → `docs/data-gaps.md`로 추적.

각 캐릭터의 정리 양식은 동일하다:

```
### {한국명} ({영문명})
- **속성/무기/등급**: ...
- **스케일링 스탯**: atk / hp / def
- **잠재력 회로 (Forte Circuit)**: 노드 합산 보너스 / 메커니즘
- **고유 스킬 1 / 2**: 패시브 효과
- **공명 체인 S1~S6**: 각 노드의 효과 (정량)
- **아웃트로 효과**: 다음 공명자에게 주는 버프
- **상태/스택 메커니즘**: 풀스택 가정 시 효과
- **공조 공격**: 있음/없음 + motion value
```

---

### 1.1 융합 (Fusion)

#### 에이메스 (Aemeath)
- **속성/무기/등급**: 융합 / 직검 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 동기화율(Synchronization Rate)을 공명율로 변환하는 자원 메커니즘. 노드 합산 수치 데이터 갭
- **고유 스킬 1 (Between the Stars)**: 팀이 Tune Rupture-Shifting 또는 Negative Status 부여 시 본인 크리피해 +20% (최대 3중첩 = +60%). Finale에 적 DEF 20% 무시
- **고유 스킬 2 (Before All Sounds)**: 강공격에 피해 증폭 +200%
- **공명 체인**:
  - S1: 즉시 응답 상태에서 강공격 크리피해 +300%. 처치한 적의 최고 스택을 다음 적에게 이월
  - S2: Duet of Seraphic Plumes — Overture/Encore 피해 배율 ×2 (+100%)
  - S3: Heavenfall Edict — Finale 피해 배율 ×2 (고유 스킬 팀 제한 해제, 자체로 60% 크리피해 + 20% DEF 무시 발동)
  - S4: 인트로 또는 핵심 공명스킬 사용 시 팀 전속성 피해 +20%, 30초
  - S5: 메카 비행 스태미나 리셋, 치명상 시 1회 부활 (10분 쿨)
  - S6: 데이터 갭
- **아웃트로 효과**: 아군 전체(본인 제외) 전속성 피해 증폭 +10%. Tune Rupture-Shifting/Fusion Burst 가능 아군은 추가 +10% (지속 시간 데이터 갭)
- **상태/스택**: 동기화율 100 도달 시 Tune Rupture/Fusion Burst 모드 전환 → Finale 발동
- **공조 공격**: 없음 (본체+메카 동시 타격)

#### 브렌트 (Brant)
- **속성/무기/등급**: 융합 / 직검 / 5★
- **스케일링 스탯**: atk (ER을 ATK로 변환)
- **잠재력 회로**: ER 150% 초과분 1%당 ATK +12 (최대 +1,560). Aflame 상태에서는 ER 150% 초과 1%당 ATK +20 (최대 +2,600)
- **고유 스킬 1**: Bravo 25/50/75/100 도달 시 팀 자동 치유
- **고유 스킬 2**: Aflame 상태에서 일반/공명스킬 명중 시 Bravo 획득 효율 ×2. Forte가 "My Moment"로 변환되며 ER→ATK 변환량 강화
- **공명 체인**:
  - S1: 아웃트로 시전 후 20초 내 다음 공명자 공명스킬 명중 시 브렌트가 ATK의 440% 융합 피해 추가 폭격
  - S2: 공중공격 및 Returned from Ashes 사용 시 크리율 +30%
  - S3: Returned from Ashes 피해 배율 +42%
  - S4: Returned from Ashes 보호막 양 +20%
  - S5: 일반공격 피해 시 일반공격 피해 보너스 +15%
  - S6: 공중공격 피해 배율 +30%
- **아웃트로 효과**: "The Course is Set!" — 다음 공명자의 융합 피해 +20%, 공명스킬 피해 +25%, 14초
- **상태/스택**: Bravo 100 풀스택 시 공명스킬이 Returned from Ashes로 대체 (대량 피해 + 팀 보호막)
- **공조 공격**: 있음 (S1: 폭격 추가 발동, ATK의 440%)

#### 장리 (Changli)
- **속성/무기/등급**: 융합 / 직검 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로 (Strategy of Duality)**: 융합 피해 +20%, 공명해방 피해 +25%. True Sight 사용 시 Enflamement 스택당 융합 피해 +5% (최대 4스택 = +20%)
- **고유 스킬 1 (Secret Strategist)**: True Sight 후 Enflamement 스택당 융합 피해 +5%
- **고유 스킬 2 (Sweeping Force)**: 4 Enflamement 상태에서 공명해방 또는 Forte 강공격 후 융합 피해 +20%, 적 DEF 15% 무시
- **공명 체인**:
  - S1: 공명스킬 Tripartite Flames와 강공격 Flaming Sacrifice 사용 시 본인 피해 +10%, 경직 저항
  - S2: Enflamement 스택 보유 시 크리율 +25%, 8초
  - S3: 공명해방 Radiance of Fealty 피해 +80%
  - S4: 인트로 사용 후 팀 ATK +20%, 30초
  - S5: Flaming Sacrifice 배율 +50%, 피해량 +50%
  - S6: Tripartite Flames / Flaming Sacrifice / Radiance of Fealty가 적 DEF 추가 40% 무시
- **아웃트로 효과**: 다음 공명자의 융합 피해 +20%, 공명해방 피해 +25%, 10초 또는 교체 전까지
- **상태/스택**: Enflamement 4 풀스택 시 강공격 Flaming Sacrifice 발동
- **공조 공격**: 없음

#### 치샤 (Chixia)
- **속성/무기/등급**: 융합 / 권총 / 4★
- **스케일링 스탯**: atk
- **잠재력 회로**: Thermobaric Bullets 최대치 +10, 공명스킬 Boom Boom 피해 +50%
- **고유 스킬 1 (Numbingly Spicy!)**: DAKA DAKA! 중 Thermobaric Bullet 명중 시 ATK +1%, 10초, 최대 30중첩 (=+30% ATK)
- **고유 스킬 2**: 공명해방 Blazing Flames 중 추가 효과 (구체 수치 데이터 갭)
- **공명 체인**:
  - S1: Boom Boom 모든 타격 크리티컬 확정
  - S2: 공명해방 중 적 처치 시 공명에너지 +5 (최대 20)
  - S3: HP 50% 미만 적에게 공명해방 피해 +40%
  - S4: 공명해방이 Thermobaric Bullets 60개 제공, 공명스킬 쿨다운 즉시 리셋
  - S5: Numbingly Spicy 최대 스택 시 ATK 추가 +30% (S5 채택 시 효과적으로 +60%)
  - S6: Boom Boom 시전 시 팀 일반공격 피해 +25%, 15초
- **아웃트로 효과**: 데이터 갭 (공식 한국어 명세 미확인)
- **상태/스택**: Thermobaric Bullet 60발 풀 + Numbingly Spicy 30 풀 시 ATK +30% (S5 시 +60%)
- **공조 공격**: 없음

#### 데니아 (Denia) ★ 신규 (3.3 후반기)
- **속성/무기/등급**: 융합 / 증폭기 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭 (정확한 배율 미공개 — 출시 후 검증 필요)
- **고유 스킬 / 공명 체인**: 데이터 갭 — 빠른 협주, 공명해방 피해, 견인, 불꽃 효과, 조화도 파괴 증폭이 핵심 (서브 딜러 겸 보조형)
- **아웃트로 효과**: 데이터 갭
- **공조 공격**: 데이터 갭

#### 앙코 (Encore)
- **속성/무기/등급**: 융합 / 증폭기 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭 (인헤런트 스킬에 융합 피해 부여)
- **고유 스킬 1**: 공명해방 중 HP 70% 이상에서 피해 +10%
- **고유 스킬 2**: 공명스킬 사용 후 융합 피해 +10%, 10초
- **공명 체인**:
  - S1: 일반공격 명중 시 융합 피해 +3%, 6초, 최대 4중첩 (+12%)
  - S2: 일반공격 Woolies Attack 또는 공명스킬 Energetic Welcome 시전 시 공명에너지 +10 (10초마다 1회)
  - S3: 공명해방 Cloudy: Frenzy / Cosmos: Rupture 배율 **+40% (Skill Scaling Bonus 카테고리)**
  - S4: 공명해방 Cosmos: Rupture가 팀 융합 피해 보너스 +20%, 30초
  - S5: 공명스킬 피해 보너스 +35%
  - S6: 공명해방 Cosmos: Rave 중 피해 시 Lost Lamb 1스택 ATK +5%, 10초, 최대 6중첩 (+30% ATK)
- **아웃트로 효과 (Cosmos Rave)**: 6초간 광역 융합 피해 — 피해형 아웃트로
- **상태/스택**: S1 4중첩 + 고유 2의 +10% + S6 6중첩 = 풀스택 가정
- **공조 공격**: 없음

#### 갈브레나 (Galbrena)
- **속성/무기/등급**: 융합 / 권총 / 5★
- **스케일링 스탯**: atk, crit dmg (권장 비율 75:250)
- **잠재력 회로**: Afterflame 최대 40 + Sinflame 최대 100 이중 자원. Afterflame 1점당 Demon Hypostasis 변환 스킬 피해 +1.5% (최대 +60%)
- **고유 스킬 (Fated End)**: 서로 다른 스킬 연속 사용 시 5초마다 1스택 (최대 4), 스택당 피해 +5% (최대 +20%)
- **공명 체인**:
  - S1: 공명스킬 Ascent of Malice 시 Afterflame 1점당 주요 스킬 크리피해 +2% (최대 +80%)
  - S2: Burning Drive ATK 보너스 +350%
  - S3: 공명해방 배율 **+130% (Skill Scaling Bonus)**
  - S4: 팀원 Echo 스킬 시전 시 팀 전속성 피해 +20%, 20초
  - S5: 공명스킬 Encroach/Ascent of Malice/Ravage 배율 **+150%**
  - S6: Demon Hypostasis가 Eternal Hypostasis로 강화, 일반/강공/공중/회피 카운터 배율 +60%
- **아웃트로 효과 (Ashen Pursuit)**: ATK의 79.5%×3 + 556.5% 융합 피해 (피해형)
- **상태/스택**: Afterflame 40 + Sinflame 100 풀스택 시 Demon Hypostasis 모드
- **공조 공격**: 없음

#### 루파 (Lupa)
- **속성/무기/등급**: 융합 / 광인검 / 5★
- **스케일링 스탯**: atk (HP 스케일링 보조)
- **잠재력 회로**: Forte 게이지 풀 시 강공격/공명스킬 융합 피해 보너스 일시 부여. Glory 효과: 융합 팀원 수에 따라 적 융합 저항 무시
- **고유 스킬 1**: Fire-Kissed Glory / Wolf's Gnawing / Wolf's Claw / Firestrike 시 팀 융합 피해 +20%, 30초, 최대 2스택 (+40%)
- **고유 스킬 2 (Pack Hunt)**: 공명해방 후 35초간 팀 ATK +6%, 보스/재앙급 적에게 융합 피해 +10%
- **공명 체인**:
  - S1: 공명해방 사용 시 공명에너지 +10, 크리율 +20%
  - S2: 팀 피해 +40%
  - S3: 강화 인트로 배율 ×2, 융합 캐릭터 수와 무관하게 Pack Hunt/Glory 최대치 적용
  - S4: 강화 Dance with the Wolf 배율 강화
  - S5: 소폭 향상
  - S6: 핵심 3 스킬이 적 DEF 30% 무시, 공명스킬 사용 시 Forte 즉시 충전
- **아웃트로 효과**: 다음 공명자 융합 피해 +20%, 일반공격 피해 +25%, 14초
- **상태/스택**: Seeds of Revelation 4스택 시 Revelation·Era 발동 (공명해방 + 일반공격 대체)
- **공조 공격**: 있음 (공명해방 후 5초간 잔류 어시스트)

#### 모니에 (Mornye)
- **속성/무기/등급**: 융합 / 광인검 / 5★
- **스케일링 스탯**: **def** (DEF 스케일링 힐러/버퍼)
- **잠재력 회로**: Rest Mass Energy 100점 도달 시 Syntony Field 생성 (HP 회복 + 경직 저항 + Off-Tune 충전율 증가)
- **고유 스킬 1 (High Syntony Field)**: 팀 DEF +20%
- **고유 스킬 2 (Interfered Marker)**: ER 260% 충족 시 적이 받는 피해 +40%
- **공명 체인**:
  - S1 (Silent Observer): Tune Rupture/Tune Strain 부여 조건 제거 (3.x 외 캐릭터 호환)
  - S2 (Entropic Morning Star): Interfered Marker 적에게 팀 크리피해 ER 100% 초과 1%당 +0.2% (최대 +32%). Syntony Field가 Off-Tune 충전율 +20% 추가
  - S3 (Blueprint of Recursion): 공명스킬 Distributed Array 시 공명에너지 +25, Relative Momentum +100 (25초마다 1회)
  - S4: High Syntony Field 회복량 +30%
  - S5: 공명해방 Critical Protocol 배율 +40%, Tune Rupture Response Particle Jetis 배율 +160%
  - S6: Critical Protocol 추가 피해 +400%, 4초 전투 회피 시 0.2초마다 최대 공명에너지 10% 회복
- **아웃트로 효과**: "Let's Hit the Road Together!" — 다음 공명자 전속성 피해 증폭 +25%, 30초
- **상태/스택**: High Syntony Field 활성 시 팀 DEF/Off-Tune/회복 강화. Interfered Marker 적은 추가 피해 +40%
- **공조 공격**: 없음 (서포터)

#### 모르테피 (Mortefi)
- **속성/무기/등급**: 융합 / 권총 / 4★
- **스케일링 스탯**: atk, crit dmg
- **잠재력 회로**: 데이터 갭 (Forte 게이지 충전 후 추가 데미지 소스 활성화)
- **고유 스킬 1 (Harmonic Control)**: 공명스킬 Passionate Variation 후 Fury Fugue 피해 +25%, 8초
- **고유 스킬 2 (Rhythmic Vibrato)**: 공명해방 Burning Rhapsody 중 Marcato 명중마다 다음 Marcato 피해 +1.5%, 0.35초마다 1회, 최대 50중첩 (+75%)
- **공명 체인**:
  - S1: 공명해방 중 온필드 캐릭의 공명스킬 명중 시 추가 공조 공격 2회 Marcato
  - S2: Echo Skill 사용 후 공명에너지 +10 (20초마다 1회)
  - S3: 공명해방 중 Marcato 크리피해 +30%
  - S4: 공명해방 Burning Rhapsody 지속 +7초
  - S5: 공명스킬 명중 시 Marcato 4발 추가 발사 (피해 50% 감소)
  - S6: 공명해방 Violent Finale 시 팀 ATK +20%, 20초
- **아웃트로 효과**: 다음 공명자 강공격 피해 증폭 +38%, 14초
- **상태/스택**: Burning Rhapsody 중 일반공격 명중당 Marcato 1발, 강공격 명중당 2발 (최소 0.35초 간격)
- **공조 공격**: 있음 (Marcato 자동 발사 — motion value 데이터 갭)

---

### 1.2 응결 (Glacio)

#### 설지 (Baizhi)
- **속성/무기/등급**: 응결 / 증폭기 / 4★
- **스케일링 스탯**: hp (회복량 = 본인 최대 HP의 일정 비율)
- **잠재력 회로**: Concentration 최대 4스택. 일반공격 명중 시 1스택, 공명스킬/강공격 시 채워진 스택만큼 추가 힐 틱
- **고유 스킬 1 (Harmonic Range)**: 패시브 발동 시 Euphonia 필드 생성, 픽업 시 ATK 버프 20초
- **고유 스킬 2**: 공명해방 시 파티 HP 회복
- **공명 체인**:
  - S1: Concentration 당 공명에너지 추가 회복
  - S2: 응결 피해 +15%, 힐량 +15%
  - S3: 인트로 후 파티 최대 HP +12%
  - S4: 공명해방 추가 발동 + 힐·응결 피해 추가
  - S5: 10분마다 1회 부활
  - S6: 응결 피해 +12%, 12초
- **아웃트로 효과 (Rejuvenating Flow)**: 30초간 3초마다 본인 최대 HP의 1.54% 만큼 다음 공명자 회복. 회복 받은 공명자는 6초간 전속성 피해 강화 +15%
- **상태/스택**: Concentration 4 풀스택 시 추가 힐 틱 4회 발생
- **공조 공격**: 없음

#### 카를로타 (Carlotta)
- **속성/무기/등급**: 응결 / 권총 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: Substance 최대 120, 2단계. 풀게이지 시 Final Bow 발동 → 공명해방 3종(Era of New Wave / Death Knell / Fatal Finale) 배율 **+80% (Skill Scaling Bonus)**
- **고유 스킬 1 (Flawless Purity)**: 공명스킬 재시전 후 강하공격 캐스팅 시 무적, 비행 스태미나 -20%
- **고유 스킬 2 (Ars Gratia Artis)**: 인트로/공명스킬 재시전/공명해방 사격/강화 강공격이 Deconstruction 상태 부여
- **공명 체인**:
  - S1: Deconstruction 적에게 크리율 증가 + 공명스킬 시 Substance 추가 회복
  - S2: 공명해방 Fatal Finale 배율 +126%
  - S3: 아웃트로·공명스킬 배율 강화
  - S4: 강공격/Containment Tactics/Imminent Oblivion 시 30초간 팀 공명스킬 피해 +25%
  - S5: 강공격 Imminent Oblivion 배율 증가
  - S6: 공명해방 Death Knell 사격 시 크리스탈 파편 ×2 + 배율 총 +186.6%
- **아웃트로 효과 (Kaleidoscope Sparks)**: 아웃트로 종료 시 ATK의 1032.18% 응결 피해 1회 + 다음 공명자에게 응결 피해 강화 + 공명스킬 피해 강화 (지속시간 데이터 갭)
- **상태/스택**: Substance 120 풀 시 강공격 Imminent Oblivion 가능 (공명스킬 DMG로 취급)
- **공조 공격**: 없음

#### 히유키 (Hiyuki) ★ 신규 (3.3 전반기)
- **속성/무기/등급**: 응결 / 직검 / 5★
- **출시일**: 2026년 4월 30일 (3.3 전반기)
- **소개**: 아시노하라 출신, 라하이 로이 머무는 특별 대책반 멤버, 신규 메인 딜러
- **스케일링 스탯**: atk (메인 딜러 패턴)
- **잠재력 회로**: 데이터 갭 (정확한 배율 미공개)
- **고유 스킬 / 공명 체인**: S1 stop point — 피해 증가 + 군중 제어 + 저항 면역 (sportskeeda); S6 — 데이터 갭
- **아웃트로 효과**: 데이터 갭
- **공조 공격**: 데이터 갭

#### 능양 (Lingyang)
- **속성/무기/등급**: 응결 / 권갑 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: Lion's Spirit 풀충전 후 강공격으로 Striding Lion 자세 진입 → 일반공격·공명스킬 강화, 공중 모드 전환
- **고유 스킬 1**: 인트로 피해 +50%
- **고유 스킬 2**: Striding Lion 상태 일반공격 적중 시 3초 내 다음 공명스킬 피해 +150%
- **공명 체인**: S1~S6 명칭 (Lion of Light Blessings Abound / Dominant and Fierce Power Unbound / Jaw-dropping Feats Loud and Wide / Immortals Bow in Reverence Flawed / Seven-Star Shine Stepped upon High / Demons Tremble Divine Power Nigh). S3·S6가 핵심 (정량 데이터 갭)
- **아웃트로 효과**: 다음 공명자 응결 피해 +20%, 30초 (공명해방 추가 피해 +50%는 14초)
- **상태/스택**: Striding Lion 자세 진입 시 모든 공격 공중 모드 + 강화
- **공조 공격**: 없음

#### 산화 (Sanhua)
- **속성/무기/등급**: 응결 / 직검 / 4★
- **스케일링 스탯**: atk
- **잠재력 회로**: Frostbite 리듬 게이지. 블루존에서 손을 떼면 Heavy Attack: Detonate 발동 → Forte Circuit Ice Burst 크리 피해 ×2
- **고유 스킬 1**: 인트로 후 8초간 공명스킬 피해 +20%
- **고유 스킬 2**: 5번째 일반공격 후 8초간 Ice Burst 피해 +20%
- **공명 체인**: 전체 데이터 갭 (정확한 % 미공개)
- **아웃트로 효과 (Frosty Resolve / Silversnow)**: 다음 공명자 일반공격 피해 +38% Deepen, 14초 (※ 이건 디펜(Amplify) 카테고리)
- **상태/스택**: 인트로 → 공명스킬 → 5타 → 강공격(Detonate) 사이클
- **공조 공격**: 있음 (응결 생성체 자동 폭발 — motion value 데이터 갭)

#### 유호 (Youhu)
- **속성/무기/등급**: 응결 / 권갑 / 4★
- **스케일링 스탯**: atk
- **잠재력 회로 (Poetic Essence)**: 4 Antique 슬롯 채운 후 강공격 발동 시 데미지 + Concerto 20 즉시 획득 + 룰렛 기반 추가 효과
- **고유 스킬 1 (Treasured Piece)**: 공명해방 시 파티 HP 회복
- **고유 스킬 2**: 인트로 후 14초간 본인 응결 피해 +15%
- **공명 체인**:
  - S1: Lucky Draw 시전 후 10% 확률로 5초간 무피해/경직 무시
  - S2: Poetic Essence의 Antithesis·Triplet·Perfect Rhyme 피해 ×2
  - S3: ATK +20%
  - S4: 공명스킬 Scroll Divination 사용 시 20% 확률로 쿨다운 없음
  - S5: 인트로 후 14초간 크리율 +15%
  - S6: 공명스킬 사용 시 Sky Blue 1스택 (최대 4, 7초), 스택당 크리피해 +15%
- **아웃트로 효과 (Heart of Antiquity)**: 다음 공명자 **공조 공격 피해 +100%**, 28초
- **상태/스택**: 4 Antique 충전 → Poetic Essence → 28초 공조 공격 100% 강화 아웃트로
- **공조 공격**: 있음 (motion value 데이터 갭)

#### 절지 (Zhezhi)
- **속성/무기/등급**: 응결 / 증폭기 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: Afflatus 게이지 최대 90, 3단계 (각 30)
- **고유 스킬 1 (Dash the Brush)**: Stroke of Genius / Stroke of Maestro 재시전 시 ATK +6%, 22초, 최대 3스택 (+18%)
- **고유 스킬 2 (Ornament)**: 아웃트로 시 다음 캐릭에게 공명에너지 +15 즉시 부여
- **공명 체인**:
  - S1: 공명스킬 Creation's Zenith 시 공명에너지 +15, 27초간 크리율 +10%
  - S2: 공조 공격 강화 (전체 +9.7%)
  - S3: 3스택 버프 동시 갱신 (전체 +16.9%)
  - S4: 파티 ATK +20%, 30초 (전체 +6.2%)
  - S5: Inklit Spirit 3체마다 1체 추가 공조 (140% 일반공격) (전체 +23%)
  - S6: 공명스킬 시 Ivory Herald 1체 추가 (Stroke of Genius 120%, 일반공격 취급) (전체 +23.5%)
- **아웃트로 효과 (Sketch of Renown)**: 다음 공명자 응결 피해 강화 +20% + 공명스킬 피해 강화 +25%, 14초 (가산)
- **상태/스택**: Inklit Spirit / Ivory Herald 공조 → 3 풀스택 시 ATK +18%
- **공조 공격**: 있음 (Inklit Spirit + Ivory Herald — motion value 데이터 갭)

---

### 1.3 기류 (Aero)

#### 알토 (Aalto)
- **속성/무기/등급**: 기류 / 권총 / 4★
- **스케일링 스탯**: atk
- **잠재력 회로**: Mist 필드 통해 사격 시 게이지 1바씩 충전. Mist 통과 회피 시 wisp 형태 → 게이지당 Mist Bullet 발사
- **고유 스킬 1**: 데이터 갭
- **고유 스킬 2**: wisp 상태에서 스태미나 회복
- **공명 체인**: S3에서 본인 피해 출력 최대 +77% (단일 노드). S1·S2·S4~S6 데이터 갭
- **아웃트로 효과 (Mist Bullet)**: 다음 공명자 기류 피해 +23%, 14초 또는 교체 전까지
- **상태/스택**: Mist 필드 깔고 통과해 wisp 상태로 Mist Bullet 추가 발사
- **공조 공격**: 없음

#### 카르티시아 (Cartethyia)
- **속성/무기/등급**: 기류 / 직검 / 5★
- **스케일링 스탯**: **hp** (명조 최초 HP 계수 메인 딜러)
- **잠재력 회로**: Sword of Divinity / Discord / Virtue 3검 시스템 — 4타 일반·강공격(인트로)·공명스킬이 각각 1자루씩 발동 → Fleurdelys 변신. 변신 시 기류 침식(Aero Erosion) 스택 부여
- **고유 스킬**: Aero Erosion 적용 적에게 카르티시아·Fleurdelys 모든 피해 +30% (스택 무관). 3스택 초과 시 1스택당 추가 +10% (6스택 시 +30% 추가, 총 +60%)
- **공명 체인**:
  - S1: 처치 시 Aero Erosion 스택 다음 적에 복사 + Resolve 30당 크리피해 +20% (15초)
  - S2: 방랑자·기류와 함께 시 Aero Erosion 최대 스택 6→9
  - S3: 일부 공격 +2스택, 공명해방 배율 ×2
  - S4: 피해 +20%, 치명타 회피·10% HP 회복·80% 피해 감소(10초), 공명해방 HP 비용 25%로 감소
  - S5: 디버프 적 시 팀 전속성 피해 +20% (20초)
  - S6: 공명해방 시 모든 적 Aero Erosion 자동 풀스택, 만스택 적에게 즉시 추가 피해
- **아웃트로 효과 (Aero Vortex)**: 8초간 주기적 Aero Erosion 피해, 디버프 적 공격 시 +17.5% 피해, 다음 공명자 기류 피해 강화 20초 (Negative Status 적 한정)
- **상태/스택**: Fleurdelys 자유 전환, Aero Erosion 6스택 풀 시 자체 +60% 피해 강화
- **공조 공격**: 있음 (Fleurdelys 형태 분신 — motion value 데이터 갭)

#### 샤콘 (Ciaccona)
- **속성/무기/등급**: 기류 / 권총 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: Forte 3스택 충전 후 Quadruple Downbeat 강공격 발동 → Concerto 25 즉시 생성, Aero Erosion 1스택 추가, 적 끌어모음
- **고유 스킬**: Intermezzo 활성 시 본인·Harmonic Echoes가 Melodic Solo 상태 → 근방 파티 기류 피해 보너스 부여 (수치 데이터 갭)
- **공명 체인**:
  - S1: 본인 피해 + 공명스킬 후 경직 저항
  - S2: 파티 기류 피해 +40%
  - S3: 회전 단축, Forte 강공격 스팸 가속
  - S4~S6: 추가 데미지 부스트 + 파티 피해 감소 (개별 수치 데이터 갭)
- **아웃트로 효과**: 적의 Aero Erosion 피해 +100% (지속시간 데이터 갭)
- **상태/스택**: 3스택 → Quadruple Downbeat로 적 풀링 + Aero Erosion + 25 Concerto
- **공조 공격**: 있음 (Harmonic Echoes — motion value 데이터 갭)

#### 유노 (Iuno)
- **속성/무기/등급**: 기류 / 권갑 / 5★
- **스케일링 스탯**: atk (공명해방 위주)
- **잠재력 회로**: Half Moon / Full Moon 2 상태 전환 시스템
- **고유 스킬 1**: 잦은 실드 획득
- **고유 스킬 2**: 인트로 또는 공명해방 시 Wan Light 5스택 즉시 획득
- **공명 체인**: 데이터 갭 (개별 노드 상세 미공개)
- **아웃트로 효과**: 다음 공명자 강공격 피해 강화 +50%, 14초
- **상태/스택**: Half Moon ↔ Full Moon 전환으로 Wan Light 스택 누적
- **공조 공격**: 있음 — motion value 데이터 갭

#### 감심 (Jianxin)
- **속성/무기/등급**: 기류 / 권갑 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 풀게이지 시 강공격 홀드로 Primordial Chi Spiral 발동 → 광역 지속 피해 + 주기적 파티 쉴드 생성
- **고유 스킬 1**: 공명해방 피해 +20%
- **고유 스킬 2**: Forte 획득 쉴드 강도 +20%
- **공명 체인**:
  - S1·S2: 쿨다운/Forte 충전 강화 (개별 수치 데이터 갭)
  - S3: 본인 피해 부스트
  - S4~S6: 파티 단위 버프 및 큰 폭의 피해 부스트 (수치 데이터 갭)
- **아웃트로 효과**: 다음 공명자 공명해방 피해 강화 +38%, 14초
- **상태/스택**: Forte 풀 → Primordial Chi Spiral 채널링 (광역 + 쉴드)
- **공조 공격**: 없음

#### 기염 (Jiyan)
- **속성/무기/등급**: 기류 / 광인검 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로 (Resolve)**: 게이지 최대 60. 일반공격(Lone Lance)·인트로(Tactical Strike) 명중 시 획득. 30 Resolve 소비로 공명스킬 강화 (피해 +20%) 또는 공명해방에 용형 일격 추가
- **고유 스킬 1**: 인트로 후 15초간 ATK +10%
- **고유 스킬 2**: 적 명중 후 8초간 크리피해 +12%
- **공명 체인**:
  - S1 (Benevolence): 공명스킬 Windqueller 추가 시전 가능 + Resolve 비용 -15
  - S2 (Versatility): 인트로 후 Resolve +30 + ATK +28%, 15초
  - S3: 크리율·크리피해 대폭 증가
  - S4: 파티 강공격 버프
  - S5: ATK 대폭 강화
  - S6: 공명해방 피해 대폭 강화 (최고 가치)
- **아웃트로 효과 (Windborne)**: 다음 공명자 8초간 강공격 시 기염의 용 추가 폭발 (최대 2회)
- **상태/스택**: Qingloong Wind Form (풍속 자세) — 공명해방 후 진입, 일반·강공격이 기류 피해로 전환·광역화. Resolve 60 풀스택으로 강화 해방
- **공조 공격**: 있음 (아웃트로 후 다음 캐릭 강공격에 용 폭발, 8초 내 최대 2회)

#### 구원 (Qiuyuan)
- **속성/무기/등급**: 기류 / 직검 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로 (Swordster's Soliloquy)**: 게이지 3단계 (각 200, 최대 600)
  - 200: 강화 일반공격 Inkwash 활성화
  - 400: 필드 액티브 공명자에게 에코 스킬 피해 보너스 +30%, 30초
  - 600: 강화 강공격 3타 → Concerto 회복 + 고배율 피해
- **고유 스킬 1**: 에코 스킬 후 Circuit Energy 획득 시마다 ATK +10%
- **고유 스킬 2**: 데이터 갭
- **공명 체인**:
  - S1·S2·S3: 데이터 갭
  - S4·S5: 저가치
  - S6: 3번째 강화 강공격 시 적에게 5초 정지 (stasis/freeze)
- **아웃트로 효과**: 다음 공명자 에코 피해 강화 +50% (지속시간 14초 추정)
- **상태/스택**: 게이지 600 풀스택 시 에코 +30% + Inkwash + 강화 강공격 3타
- **공조 공격**: 있음 (에코 기반 — motion value 데이터 갭)

#### 방랑자·기류 (Rover - Aero)
- **속성/무기/등급**: 기류 / 직검 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: Windstrings 게이지 최대 120. 풀충전 시 강화 공명스킬 Unbound Flow (2단 기류 피해) 사용 가능
- **고유 스킬**: 카르티시아와 함께 시 Resonance Liberation에 Windstrings 추가 + 힐량 증가 (수치 데이터 갭)
- **공명 체인**: 데이터 갭
- **아웃트로 효과 (Eroding Form)**: 다음 공명자 공격이 적 명중 시 적 Aero Erosion 최대 스택 +3
- **상태/스택**: Windstrings 120 풀 → Unbound Flow 2단 + Aero Erosion 풀링
- **공조 공격**: 있음 (서포트형 — motion value 데이터 갭)

#### 시그리카 (Sigrika)
- **속성/무기/등급**: 기류 / 권갑 / 5★
- **스케일링 스탯**: atk (에코 스킬 위주)
- **잠재력 회로**: Learn My True Name 강력한 에코 기반 공격. 풀스택 시 기류 피해 +30% + 에코 스킬 피해 +30%
- **고유 스킬**: 파티원 에코 스킬 사용 시 1스택 (최대 6) → 풀스택 시 기류 피해 +48% + 에코 스킬 피해 +48%
- **공명 체인**:
  - S1: Forte Circuit 배율 +120%
  - S2~S5: 데이터 갭
  - S6: 추가 Encapsulated 스택 + 강력한 데미지 부스트 (수치 갭)
- **아웃트로 효과 (In This Very Moment)**: Concerto 풀 시 ATK 795% 기류 피해 + 파티에 Encapsulated (최대 3스택, 아웃트로마다 +1)
- **상태/스택**: 파티 에코 6스택 → 본인 기류/에코 피해 각 +48% (고유) + 자체 +30% (Forte)
- **공조 공격**: 있음 (에코 메인 — motion value 데이터 갭)

#### 양양 (Yangyang)
- **속성/무기/등급**: 기류 / 직검 / 4★
- **스케일링 스탯**: atk
- **잠재력 회로**: Melody 최대 3스택 → Feather Release (공중 강공격) 발동
- **고유 스킬 1**: 풀스택 Mid-Air 공격 후 스태미나 +30
- **고유 스킬 2**: 인트로 후 8초간 기류 피해 +8%
- **공명 체인**: S1~S5 데이터 갭. S6: Mid-Air Feather Release 후 파티 ATK +20%, 20초
- **아웃트로 효과**: 다음 공명자 5초간 초당 4 공명에너지 회복 (총 20). Moonlit Clouds 세트 발동 시 추가 ATK +22.5%, 15초
- **상태/스택**: Melody 3 풀스택 → Feather Release + S6 도달 시 파티 ATK +20%
- **공조 공격**: 없음

---

### 1.4 전도 (Electro)

#### 아우구스타 (Augusta)
- **속성/무기/등급**: 전도 / 광인검 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: Prowess (최대 100) + Ascendancy 듀얼 게이지, 최종 자원 Majesty (최대 2) 스택 후 2차 궁극기 발동 (시간 정지 + 강화 중공격 연타)
- **고유 스킬 1**: Glory's Favor 실드 +50%
- **고유 스킬 2**: 전투 시작 시 Majesty 1 스택
- **공명 체인**:
  - S1 (Stained in Scorched Earth): 데이터 갭
  - S2: 데이터 갭
  - S3 (Forged in Rot and Ruin): 강공격 Thunderoar(Backstep/Spinslash/Uppercut) 및 Dodge Counter Thunderoar Backstep 배율 +25%
  - S4·S5: 데이터 갭
  - S6 (Engraved in Radiant Light): 강공격 Thunderoar: Spinslash/Uppercut 시 Thunder Rage 발동 — 100% ATK 전도 피해 ×2
- **아웃트로 효과 (Stride of Goldenflare)**: 팀 ATK +20%, 30초
- **상태/스택**: Prowess + Ascendancy → Majesty 2 풀스택 시 2차 궁극기
- **공조 공격**: 데이터 갭

#### 복링 (Buling)
- **속성/무기/등급**: 전도 / 권갑 / 4★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭
- **고유 스킬 1**: Yin-Yang Balance 진입 시 공명에너지 +25 (24초 1회)
- **고유 스킬 2**: 치유 보너스 +20%
- **공명 체인**: 개별 노드 데이터 갭
- **아웃트로 효과**: Five Thunders Spell Array 활성 중 팀원이 인트로 시 활성 공명자에게 DMG 버프 (수치 갭)
- **상태/스택**: Trigram(Mountain/Thunder) 자원 → 다양한 강공격 → Minor Yin/Yang → Yin-Yang Balance. 공명해방 → Five Thunders Spell Array 생성, 2초마다 전도 피해 + Electro Flare 2스택 (24초)
- **공조 공격**: 있음 (Five Thunders Spell Array의 좌표 공격 — motion value 데이터 갭)

#### 카카루 (Calcharo)
- **속성/무기/등급**: 전도 / 광인검 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭 (일반적 표준 보너스 추정)
- **고유 스킬 1**: 공명해방 중 Killing Intent 5스택까지 누적
- **고유 스킬 2**: 공명스킬 Extermination Order 적중 시 Cruelty 1 (최대 3)
- **공명 체인**:
  - S1: Extermination Order 적중 시 공명에너지 +10 (20초 1회)
  - S2: 인트로 후 공명스킬 피해 보너스 +30%, 15초
  - S3: Deathblade Gear 상태 중 전도 피해 보너스 +25%
  - S4: 아웃트로 Shadowy Raid 후 팀 전도 피해 보너스 +20%, 30초
  - S5: 인트로 Wanted Criminal / Necessary Means 피해 +50%
  - S6: 공명해방 Death Messenger 시 Phantom 2기 공조 공격
- **아웃트로 효과 (Shadowy Raid)**: 다음 공명자 전도 피해 보너스 증가 (구체 수치 데이터 갭)
- **상태/스택**: Cruelty 3 → 강공격 Mercy로 대체. 공명해방 시 Deathblade Gear 진입 → Killing Intent 5 풀스택 시 강화 마무리
- **공조 공격**: S6에서 있음 (Phantom 2기)

#### 루미 (Lumi)
- **속성/무기/등급**: 전도 / 광인검 / 4★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭
- **고유 스킬**: 데이터 갭
- **공명 체인**:
  - S1: Energized Rebound 후 3초 내 STA +60
  - S2: Energized Pounce·Rebound가 적 DEF 20% 무시
  - S3: 공명해방 Squeakie Express 피해 +30%
  - S4: 일반공격 피해 보너스 +30%
  - S5: Spark 풀회복 시 Laser 배율 +100%
  - S6: 공명해방 시 팀 ATK +20%, 20초
- **아웃트로 효과 (Luminal Synthesis)**: 다음 공명자 ATK +22.5%, 15초 + 공명스킬 피해 증폭 +38%
- **상태/스택**: 듀얼 Forte (Yellow Light: 원거리 / Red Light: 근접) → 모드 전환
- **공조 공격**: 데이터 갭

#### 상리요 (Xiangli Yao)
- **속성/무기/등급**: 전도 / 권갑 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭
- **고유 스킬 1**: 공명스킬 시전마다 스택, 1스택당 전도 피해 +5%, 최대 4 (=+20%), 8초
- **고유 스킬 2**: Intuition State 중 차단 저항
- **공명 체인**: S1~S6 개별 노드 데이터 갭. S6: 1,935,463 DMG, 213.35% 상대 파워
- **아웃트로 효과 (Chain Rule)**: 들어오는 공명자가 일반공격으로 명중한 첫 적에게 레이저 빔 강하, 본인 ATK의 237.63% 전도 피해 (광역), 8초 지속, 2초당 1회, 최대 3회
- **상태/스택**: 공명스킬·일반공격 명중 → Forte 회복 → Intuition State 강화 공명스킬 연타
- **공조 공격**: 있음 (Chain Rule — ATK의 237.63% × 최대 3회)

#### 음림 (Yinlin)
- **속성/무기/등급**: 전도 / 증폭기 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭
- **고유 스킬 1**: Sinner's Mark 적중 시 Lightning Execution 피해 +10%, 발동 시 ATK +10%, 4초
- **고유 스킬 2**: Forte Judgment Strike 배율 +55%, 적중 시 팀 ATK +20%, 12초
- **공명 체인**:
  - S1: Magnetic Roar · Lightning Execution 피해 +70% **(Skill Scaling Bonus)**
  - S2: Electromagnetic Blast 적중 시 Judgement Point 5 + 공명에너지 5 추가 회복
  - S3: Forte Judgment Strike 배율 +55%
  - S4: Judgment Strike 적중 시 팀 ATK +20%, 12초
  - S5: 공명해방 Thundering Wrath가 Sinner's Mark/Punishment Mark 적에게 +100% 피해
  - S6: 공명해방 후 30초간 일반공격 적중 시 Furious Thunder 발동, ATK의 419.59% 전도 피해
- **아웃트로 효과 (Diamonds Are Forever)**: 다음 공명자 ATK +30% (영문 자료 일부에서 표기, 출처별 미세 차이)
- **상태/스택**: Forte 풀스택 → Chameleon Cipher (강화 일반공격). 강공격 홀드로 Sinner's Mark → Punishment Mark (18초)
- **공조 공격**: 있음 (Sinner's Mark/Punishment Mark 폭발 + S6 Furious Thunder)

#### 연무 (Yuanwu)
- **속성/무기/등급**: 전도 / 권갑 / 4★
- **스케일링 스탯**: atk + def (S3/S4/S6에 DEF 스케일링)
- **잠재력 회로**: 데이터 갭
- **고유 스킬 1**: Thunder Wedge 피해 + Lightning Infused 상태 중 전반 피해 증가 (수치 갭)
- **고유 스킬 2**: Thunder Wedge 유효 범위 확장 + 인트로 시 Wedge 자동 설치
- **공명 체인**:
  - S1: Lightning Infused 중 일반/강공격 속도 +20%
  - S2: 인트로 Thunder Bombardment 시 공명에너지 +15
  - S3: Thunder Wedge 공조 공격 적중 시 본인 DEF의 20% 추가 피해
  - S4: 공명해방 시 활성 캐릭에게 DEF의 200% 실드, 10초
  - S5: Thunder Wedge 필드 존재 시 공명해방 피해 보너스 +50%
  - S6: Thunder Wedge 범위 내 팀원 DEF +32%, 3초
- **아웃트로 효과**: 적 Vibration Strength 약화로 브레이크 가속 (수치 갭)
- **상태/스택**: Forte 풀 → 공명해방 또는 공명스킬 홀드로 Thunder Wedge 폭파. Lightning Infused 상태 → 전반 피해 증가
- **공조 공격**: 있음 (Thunder Wedge — motion value 데이터 갭)

---

### 1.5 회절 (Spectro)

#### 금희 (Jinhsi)
- **속성/무기/등급**: 회절 / 광인검 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 회절 피해 +20%, 인트로 Loong's Halo 배율 +50%
- **고유 스킬 1**: 회절 피해 +20%
- **고유 스킬 2**: 인트로 피해 +50%
- **공명 체인**:
  - S1: 일반/Crescent Divinity 시 스택 (최대 4, 6초), Illuminous Epiphany 시 모두 소모, 스택당 피해 +20% (최대 +80%)
  - S2: 4초 이상 비전투 시 Incandescence +40 (4초마다 1회)
  - S3: 인트로 후 Incandescence +12, Immortal's Descendancy 1스택 (ATK +25%, 20초, 최대 2스택 = +50%)
  - S4: 공명해방 또는 강화 공명스킬 시 팀 속성 피해 +20%, 20초
  - S5: 공명해방 배율 +120% (×2.2) **(Skill Scaling Bonus)**
  - S6: 강화 공명스킬 III 배율 +45%, Incandescence 스택 소모 추가 배율 +45%
- **아웃트로 효과**: 20초간 팀원이 Incandescence 생성하는 주기를 원소당 3초→1초로 단축 (자원 가속 ×3)
- **상태/스택**: Incandescence 최대 50 풀 시 강화 공명스킬 Illuminous Epiphany 발동, 스택당 배율 +20% (S6 ×1.45 추가)
- **공조 공격**: 없음

#### 루크·헤르센 (Luuk Herssen)
- **속성/무기/등급**: 회절 / 권갑 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: Ichor Flow 최대 300, 일반·공명스킬·Golden Impale·Gavel of Earthshaker 명중 시 Ichor 회복. 강화 공명스킬 시 Ichor Deposit(검 형태) 투척 → 후속 폭발
- **고유 스킬 1 (Uncaused Diagnosis)**: Tune Strain-Interfered 적에게 Tune Break Boost 10점당 피해 증폭 +5% (최대 +30%). Interfered 3스택 이상 시 추가 +15%
- **고유 스킬 2**: Tune Strain-Interfered 스택 0.12%당 본인 총 피해 증가
- **공명 체인**:
  - S1: Mid-air 피해 강화 + Interfered 스택 피해 증폭 강화, 거의 상시 경직 저항
  - S2: 공명해방 배율 +60%, Uncaused Diagnosis가 Interfered 적에게 추가 피해 증폭 +10% (최대 +60%)
  - S3: Aureate Judge 상태에서 모든 Aureole of Execution 배율 +136%
  - S4: 아군이 Tune Break 피해 시 팀 피해 +20%, 20초 (중첩 불가)
  - S5: 인트로/아웃트로 피해 보너스 +80%, 기본 공명스킬 배율 +50%, 쿨다운 -2초, 충전수 +1
  - S6: Tune Break 시 주요 스킬 배율 강화, Tune Strain 현재 스택 +2 (개인 딜 +35.03%)
- **아웃트로 효과**: 데이터 갭 (공식 한국어 명세 미확인)
- **상태/스택**: Ichor Flow 300 풀 + Tune Strain-Interfered 최대 → Aureate Judge 모드
- **공조 공격**: 있음 (Ichor Deposit 자가 폭발 추적)

#### 린네 (Lynae)
- **속성/무기/등급**: 회절 / 권총 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: Lumiflow 120점 이상 + 전투 1초마다 Premixed Hue 1스택. 스택당 Additive Color의 회절 피해 +55%, 최대 25스택 (이론치 +1375%)
- **고유 스킬**: 스킬 시전 시 팀 전속성 피해 보너스 +24%, 30초 + Premixed Hue 시스템
- **공명 체인**:
  - S1: Polychrome Leap/Visual Impact 시 경직 면역, Spray Paint 지속 +100%
  - S2: 본인 전속성 피해 증폭 +25%, 아웃트로가 다음 캐릭에게 전속성 피해 증폭 +25% 추가
  - S3: Visual Impact 배율 +90%, Premixed Hue가 Additive Color에도 적용
  - S4: ATK +20%
  - S5: Prismatic Overblast 배율 +70%
  - S6: 로테이션/플레이스타일 변경 (데이터 갭)
- **아웃트로 효과**: 다음 공명자 전속성 피해 증폭 +15% + 공명해방 피해 +25%
- **상태/스택**: Premixed Hue 25스택 → Additive Color 회절 피해 +1375%
- **공조 공격**: 있음 (Spray Paint 끌어당김 + 회절 피해 지속)

#### 페비 (Phoebe)
- **속성/무기/등급**: 회절 / 증폭기 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: Absolution 또는 Confession 상태 진입 시 회절 피해 +12% + 크리율 +50%, 25초. Prayer 게이지 최대 120 (5/초, 24초 회복)
- **고유 스킬 1 (Absolution Enhancement)**: 공명해방 배율 +255% (Absolution 모드) **(Skill Scaling Bonus)**
- **고유 스킬 2 (Confession Enhancement)**: 적 회절 저항 -10% + 회절 Frazzle 피해 증폭 +100% (Confession 모드 + Silent Prayer 부여)
- **공명 체인**:
  - S1: 공명해방 피해 증가, Confession에서 즉시 풀 Spectro Frazzle 적용
  - S2: 아웃트로 피해 보너스, Confession에서 Frazzle 피해 증폭 추가
  - S3: 강공격 Starflash 피해 증가
  - S4: 적 회절 저항 감소
  - S5: 회절 피해 보너스 추가
  - S6: 공명해방에 추가 CC
- **아웃트로 효과**: 데이터 갭
- **상태/스택**: Prayer 풀 → Absolution/Confession 전환. Absolution 풀 = 공명해방 배율 +255%. Confession 풀 = 적 회절 저항 -10% + Frazzle 피해 +100%
- **공조 공격**: 없음 (Confession 모드 Frazzle 부여로 회절 DPS 어시스트)

#### 방랑자·회절 (Rover - Spectro)
- **속성/무기/등급**: 회절 / 직검 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭
- **고유 스킬 1 (Silent Listener)**: 강공격 Resonance 후 ATK +15%, 5초
- **고유 스킬 2 (Odyssey of Beginnings)**: 공명스킬 Resonating Slashes/Spin 시 크리율 +15%, 7초
- **공명 체인**:
  - S1: 공명스킬 시 크리율 +15%, 7초
  - S2: 회절 피해 보너스 +20%
  - S3: ER +20%
  - S4: 공명해방 시 5초간 팀에게 매초 ATK의 20% HP 회복
  - S5: 공명해방 피해 보너스 +40%
  - S6: 공명스킬 명중 시 적 회절 저항 -10%, 20초
- **아웃트로 효과**: 다음 공명자에게 버프 없음. 대신 온필드 캐릭 주위 3초 시간 정지 필드
- **상태/스택**: Spectro Frazzle 적용기
- **공조 공격**: 없음

#### 파수인 (Shorekeeper)
- **속성/무기/등급**: 회절 / 증폭기 / 5★
- **스케일링 스탯**: hp + ER (250% ER 목표)
- **잠재력 회로 (Unspoken Conjecture)**: Stellarealm 범위 +150%, 지속 +10초, 인트로가 기존 Stellarealm 종료시키지 않음
- **고유 스킬**: Stellarealm 내 아군 인트로 시 Inner Stellarealm으로 강화 (크리율 +최대 12.5%, ER 스케일링). 추가 인트로 시 Supernal Stellarealm 강화 (크리피해 +최대 25%, ER 스케일링). 2번째: Stellarealm 내 아군 있으면 본인 ER +10%
- **공명 체인**:
  - S1: 데이터 갭 (Forte 1과 동일 효과로 보임)
  - S2: Outer Stellarealm이 팀 ATK +40%
  - S3: 공명해방 End Loop 시 본인 공명에너지 +20 (25초 1회)
  - S4: 공명스킬 Chaos Theory 시 회복 보너스 +70%
  - S5: 일반공격 3단 끌어당김 범위 +50%, Illation 범위 +30%
  - S6: 인트로 Discernment 배율 +42%
- **아웃트로 효과**: 팀 피해 증폭 +15%, 30초 (스왑 무관 지속)
- **상태/스택**: Supernal Stellarealm (2회 인트로) 시 팀 크리율 +12.5% + 크리피해 +25% (+ S2 시 ATK +40%)
- **공조 공격**: 없음

#### 벨리나 (Verina)
- **속성/무기/등급**: 회절 / 증폭기 / 5★
- **스케일링 스탯**: atk (치유량 ATK 기반)
- **잠재력 회로**: Photosynthesis Energy 최대 4스택, Forte 강공/공중 강공 강화
- **고유 스킬 1 (Gift of Nature)**: 강공/공중 강공/공명해방/아웃트로 시 팀 ATK +20%, 20초
- **고유 스킬 2**: 데이터 갭
- **공명 체인**:
  - S1: 아웃트로가 다음 공명자를 5초마다 ATK의 20%만큼 30초간 치유
  - S2: 공명스킬이 Forte 추가 1바 + 공명에너지 +10
  - S3: Photosynthesis Mark 회복량 +12%
  - S4: Forte 강공/공중공격/공명해방/아웃트로 시 팀 회절 피해 +15%, 24초
  - S5: HP 50% 미만 대상 치유량 +20%
  - S6: Forte 강공/공중공격 피해 +20%
- **아웃트로 효과**: 팀 전속성 피해 증폭 +15%, 30초 + 다음 공명자 ATK 19%만큼 6초 회복
- **상태/스택**: Photosynthesis 4 + Gift of Nature → 팀 ATK +20% 상시 + 아웃트로 전속성 +15%
- **공조 공격**: 없음

#### 젠니 (Zani)
- **속성/무기/등급**: 회절 / 권갑 / 5★
- **스케일링 스탯**: atk + crit dmg
- **잠재력 회로**: 이중 Forte (Blaze 최대 100, Inferno 모드 시 150 / Heliacal Ember 최대 60, 스택당 6초, 스택당 Blaze +5; Frazzle→Heliacal 변환)
- **고유 스킬 1**: 인트로 후 회절 피해 +12%, 14초
- **고유 스킬 2**: Ready Stance 중 피격 시 받는 피해 -40%
- **공명 체인**:
  - S1: Targeted Action/Forcible Riposte 시 회절 피해 +50%, 14초 + 공명스킬 Heavy Slash - Nightfall 중 경직 면역 (+20% 딜)
  - S2: 크리율 +20%, Targeted Action/Forcible Riposte 배율 +80% (+15.8% 딜)
  - S3: Inferno 모드 중 Blaze 1점 소모마다 공명해방 The Last Stand 배율 +8% (최대 +1200%) **(Skill Scaling Bonus)**
  - S4: 인트로 Immediate Execution 시 팀 ATK +20%, 30초
  - S5: 공명해방 Rekindle 배율 +120%
  - S6: Heavy Slash 4종 배율 +40%, Blaze 1점 소모마다 Heavy Slash - Nightfall 명중 시 배율 +40%
- **아웃트로 효과**: 다음 공명자에게 적 회절 저항 -10% + 회절 Frazzle 피해 증폭 +100%
- **상태/스택**: Heliacal Ember 60 + Blaze 150 풀 시 Inferno 모드 진입, The Last Stand 배율 폭증 (S3 시 최대 +1200%)
- **공조 공격**: 있음 (아군 Frazzle 부여 시 즉시 자동 발동)

---

### 1.6 인멸 (Havoc)

#### 카멜리아 (Camellya)
- **속성/무기/등급**: 인멸 / 직검 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭
- **고유 스킬 1 (Epiphyte)**: 인멸 피해 +15%, 지상 일반 + 공중 Vining/Blazing Waltz 차단 저항
- **고유 스킬 2 (Seedbed)**: 강공격을 일반공격 피해로 변환, 사용 시 인멸 피해 +15%
- **공명 체인**:
  - S1: 인트로 Everblooming 시 크리피해 +28%, 18초 (25초 1회)
  - S2: 공명스킬 Ephemeral 배율 +120% **(Skill Scaling Bonus)**
  - S3: 공명해방 Fervor Efflorescent 배율 +50%, Budding 시 ATK +58%
  - S4: Everblooming 시 팀 일반공격 피해 보너스 +25%, 30초
  - S5: 인트로 Everblooming 배율 +303%, 아웃트로 Twining 배율 +68%
  - S6: Forte Sweet Dream 배율 +150%
- **아웃트로 효과 (Twining)**: 다음 공명자 버프 (수치 갭)
- **상태/스택**: Forte Crimson Pistil 소비 → Concerto 에너지 + Crimson Bud 획득. Concerto 최대 시 Resonance Skill → Ephemeral. **Crimson Bud 10 소비 시 Sweet Dream 배율 +5%, 풀스택 10 Bud = +50%**
- **공조 공격**: 데이터 갭 (주로 본인 공격)

#### 칸타렐라 (Cantarella)
- **속성/무기/등급**: 인멸 / 증폭기 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭
- **고유 스킬**: Mirage 상태 중 치유 보너스 +25% (전체 수치 갭)
- **공명 체인**:
  - S1: Embrace the Endless Waves — 차단 저항
  - S2: 데이터 갭
  - S3: 공명해방이 Mirage 상태 즉시 발동 (Delusive Dive 생략)
  - S4: 데이터 갭
  - S5: 데이터 갭
  - S6 (Fall, Fall... and Fall Deeper into the Dream): 일반공격 Phantom Sting 배율 +80%, 공명해방 Flowing Suffocation 시 적 DEF 30% 무시, 10초
- **아웃트로 효과 (Gentle Tentacles)**: 다음 공명자 인멸 피해 +20%, 공명스킬 피해 +25%, 14초
- **상태/스택**: Trance/Shiver 자원 관리. Mirage 상태에서 일반공격 Phantom Sting (3연타). Forte Between Illusion and Reality: 팀 에코 스킬마다 Concerto +6 (에코 1종당 1회, 최대 6회)
- **공조 공격**: 데이터 갭 (서브 딜러/버퍼)

#### 치사 (Chisa)
- **속성/무기/등급**: 인멸 / 광인검 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭
- **고유 스킬 1**: 데이터 갭
- **고유 스킬 2**: 인멸 피해 +20% + 치유 보너스 +20% (로테이션 중)
- **공명 체인**:
  - S1: Sawring 시리즈 및 Chainsaw Mode Dodge Counter 중 차단 면역. Unseen Snare 부여 시 ATK +30%, 15초. Unseen Snare 표시 적이 공명자의 직접 피해 받을 때 인멸 Bane 1스택 (2초 1회)
  - S2~S5: 개별 노드 데이터 갭
  - S6: 데이터 갭 (S6 기준 650,146 DMG, 251.57% 상대 파워)
- **아웃트로 효과**: 데이터 갭
- **상태/스택**: Sight of Unraveling - Oblivion = Forte. Scissors Mode에서 공격으로 Ring of Chainsaw 게이지 충전 → Chainsaw Mode 진입. 3세트 Havoc Bane 빌드: ATK +20%, 공명해방 피해 +30%, 5초
- **공조 공격**: 데이터 갭

#### 단근 (Danjin)
- **속성/무기/등급**: 인멸 / 직검 / 4★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭
- **고유 스킬**: 데이터 갭 (Ruby Blossom 자원 관리)
- **공명 체인**:
  - S1: Incinerating Will 적중 시 ATK +5%, 6초, 최대 6스택 (+30%)
  - S2: Incinerating Will 적중 시 피해 +20%
  - S3: 공명해방 피해 보너스 +30%
  - S4: Ruby Blossom 60 이상 시 크리율 +15%, 강공격 Scatterbloom 종료까지 유지
  - S5: 인멸 피해 보너스 +15%, HP 60% 미만 시 추가 +15% (총 +30%)
  - S6: 강공격 Chaoscleave 시 팀 ATK +20%, 20초
- **아웃트로 효과**: 데이터 갭 (Havoc Deepen 23% 14초로 추정)
- **상태/스택**: Ruby Blossom → 강공격 Scatterbloom/Chaoscleave. HP 소모로 강화 공격. S1×6 풀 + S5 HP<60% = ATK +30%, 인멸 피해 +30%
- **공조 공격**: 데이터 갭

#### 플로로 (Phrolova)
- **속성/무기/등급**: 인멸 / 증폭기 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭
- **고유 스킬 1 (Accidental)**: Suite of Quietus / Suite of Immortality / Echo Skill 시 Volatile Note - Cadenza 1 획득
- **고유 스킬 2**: 데이터 갭
- **공명 체인**:
  - S1 (A Key to Netherworld's Secrets): Movement of Fate and Finality / Murmurs in a Haunting Dream 배율 +80%. Maestro 미진입 + Volatile Notes 2 미만 + 4초 비전투 시 Cadenza 2 이상까지 자동 획득
  - S2: Aftersound 스택 계산 관련 (수치 갭)
  - S3 (A Dagger to Cut Clean Obsessions): Hecate 관련 (수치 갭)
  - S4·S5: 데이터 갭
  - S6 (A Night to Depart From Eternal Rest): 강화 일반공격 Hecate 배율 +24%. Movement of Fate/Murmurs 시 Hecate에게 Apparition of Beyond 시전 명령 — ATK의 216.42% 인멸 피해 (Echo Skill 취급), Aftersound 8스택. 비활성 시 적이 Hecate/플로로로부터 +40% 피해. 활성 시 인멸 피해 보너스 +60%
- **아웃트로 효과**: 다음 공명자 강공격 피해 강화
- **상태/스택**: Forte Rhapsody of a New World. Volatile Notes 최대 6 (Strings/Winds/Cadenza). Scarlet Coda 시 모든 Note → Cadenza. **Maestro 상태(24초) = ATK +120% + Hecate 공조**
- **공조 공격**: 있음 (Hecate Apparition of Beyond — 216.42% ATK, Echo Skill 취급, S6)

#### 로코코 (Roccia)
- **속성/무기/등급**: 인멸 / 권갑 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭
- **고유 스킬**: 데이터 갭
- **공명 체인**:
  - S1: 데이터 갭
  - S2 (When the Luceanite Gleams): 파티 피해 보너스 (수치 갭)
  - S3~S5: 데이터 갭
  - S6 (When the Golden Wings Fly): 공명해방 Commedia Improvviso! 시 12초간: 일반공격 Real Fantasy가 적 DEF 60% 무시. Stage 3 후 공중 발사 → Beyond Imagination 상태 → 일반공격이 Reality Recreation으로 변환 (Real Fantasy Stage 3 DMG의 100%, 강공격 취급, 차단 면역)
- **아웃트로 효과**: 다음 공명자 일반공격 피해 +25%, 인멸 피해 +20%
- **상태/스택**: 일반공격 위주 인멸 DPS 버퍼. 주 활용: Havoc Rover, Camellya에게 강력한 증폭
- **공조 공격**: 데이터 갭

#### 방랑자·인멸 (Rover - Havoc)
- **속성/무기/등급**: 인멸 / 직검 / 5★
- **스케일링 스탯**: atk
- **잠재력 회로**: 데이터 갭
- **고유 스킬**: 데이터 갭
- **공명 체인**:
  - S1 (Cryptic Insight): 공명스킬 피해 보너스 (수치 갭)
  - S2 (Waning Crescent): 강공격 Devastation으로 Dark Surge 진입 시 공명스킬 쿨다운 초기화
  - S3 (Surging Resonance): 데이터 갭
  - S4 (Annihilated Silence): 강공격 Devastation 및 공명해방 Deadening Abyss 적중 시 적 인멸 저항 -10%, 20초
  - S5 (Aeon Symphony): Dark Surge 상태 일반공격 V가 추가 인멸 피해 (V 피해의 50%)
  - S6 (Ebbing Undercurrent): Dark Surge 상태에서 크리율 +25%
- **아웃트로 효과**: 데이터 갭
- **상태/스택**: Dark Surge 상태 → 강화 모드. 강공격 Devastation → Dark Surge 변신
- **공조 공격**: 데이터 갭

#### 도기 (Taoqi)
- **속성/무기/등급**: 인멸 / 광인검 / 4★
- **스케일링 스탯**: **def** (실드 및 일부 피해 DEF 스케일)
- **잠재력 회로**: 데이터 갭 (Rocksteady Shield / Power Shift 관련)
- **고유 스킬**: 데이터 갭
- **공명 체인**:
  - S1: Forte Power Shift 실드 +40%
  - S2: 공명해방 Unmovable 크리율 +20%, 크리피해 +20%
  - S3: 공명스킬 Rocksteady Shield 지속 30초로 연장
  - S4: 강공격 Strategic Parry 성공 시 HP 25% 회복, DEF +50%, 5초 (15초 1회)
  - S5: Forte Power Shift 피해 +50%, 적중 시 공명에너지 +20
  - S6: Rocksteady Shield 유지 중 일반/강공격 피해 +40%
- **아웃트로 효과**: 데이터 갭 (실드/DEF 버프 추정)
- **상태/스택**: 실드 및 DEF 기반 보조/탱커. 풀스택 가정: S4 발동 시 DEF +50%, 실드 보유 시 S6의 일반/강공격 +40%
- **공조 공격**: 데이터 갭

---

## 2. 데이터 갭 추적 목록 (`docs/data-gaps.md` 이관 대상)

다음 항목은 공식/2차 소스에서 일관된 수치를 찾지 못해 인게임 직접 확인 또는 추가 데이터마이닝 필요:

1. **모든 캐릭터의 Forte 회로 노드별 정확한 합산 보너스 수치**
2. **공조 공격(Coordinated Attack)의 motion value** — 위키 표 직접 파싱 필요
3. **시그리카·유노·방랑자·기류·알토·구원·양양의 S4~S6 일부 노드**
4. **페비·치샤·방랑자·회절·루크·헤르센·단근의 아웃트로 효과 수치**
5. **아우구스타·복링·치사·칸타렐라·플로로(S2/S4/S5)·로코코(S1/S3/S4/S5)·방랑자·인멸(S3)의 일부 공명체인 수치**
6. **히유키(Hiyuki)·데니아(Denia) 전체 데이터** — 출시 직후 패치 노트 확인 필요
7. **DEF 공식 상수 `800, 8`** — 데이터마이닝 1차 출처
8. **저항 3구간 임계값 `0.8, 5×`** — 데이터마이닝 1차 출처

---

## 부록. 출처 (Sources)

### 1차 자료
- [Fandom — Damage](https://wutheringwaves.fandom.com/wiki/Damage)
- [Fandom — ATK](https://wutheringwaves.fandom.com/wiki/ATK)
- [Fandom — DMG Bonus](https://wutheringwaves.fandom.com/wiki/DMG_Bonus)
- [Fandom — DMG Amplify](https://wutheringwaves.fandom.com/wiki/DMG_Amplify)
- [Fandom — Crit. DMG](https://wutheringwaves.fandom.com/wiki/Crit._DMG)
- [Fandom — DMG RES](https://wutheringwaves.fandom.com/wiki/DMG_RES)
- [Fandom — Coordinated Attack](https://wutheringwaves.fandom.com/wiki/Coordinated_Attack)
- [Fandom — Tune Rupture](https://wutheringwaves.fandom.com/wiki/Tune_Rupture)

### 2차 자료
- [WutheringWaves.gg — Damage Calculation Guide](https://wutheringwaves.gg/damage-calculation-guide/)
- [Prydwen — Character Database](https://www.prydwen.gg/wuthering-waves/characters/)
- [Game8 — Wuthering Waves](https://game8.co/games/Wuthering-Waves)
- [Game8 — Coordinated Attack](https://game8.co/games/Wuthering-Waves/archives/494574)
- [Game8 — Tune Break Explained](https://game8.co/games/Wuthering-Waves/archives/568979)
- [Wuthering.gg](https://wuthering.gg/characters)
- [Sportskeeda — Resonance Chain Guides (캐릭터별)](https://www.sportskeeda.com/esports/)
- [Lootbar — Character Builds](https://lootbar.gg)
- [Theria Games — WuWa](https://theriagames.com)

### 한국 명칭 검증
- [나무위키 — 명조: 워더링 웨이브/공명자](https://namu.wiki/w/명조:%20워더링%20웨이브/공명자)
- [나무위키 — 카카루](https://namu.wiki/w/카카루(명조:%20워더링%20웨이브))
- [나무위키 — 음림](https://namu.wiki/w/음림)
- [나무위키 — 카멜리아](https://namu.wiki/w/카멜리아(명조:%20워더링%20웨이브))
- [나무위키 — 페비](https://namu.wiki/w/페비(명조:%20워더링%20웨이브))
- [나무위키 — 로코코](https://namu.wiki/w/로코코(명조:%20워더링%20웨이브))
- [나무위키 — 복링](https://namu.wiki/w/복링)
- [나무위키 — 설지](https://namu.wiki/w/설지)
- [나무위키 — 산화](https://namu.wiki/w/산화(명조:%20워더링%20웨이브))
- [나무위키 — 치샤](https://namu.wiki/w/치샤)
- [나무위키 — 치사](https://namu.wiki/w/치사(명조:%20워더링%20웨이브))
- [나무위키 — 루미](https://namu.wiki/w/루미(명조:%20워더링%20웨이브))
- [나무위키 — 벨리나](https://namu.wiki/w/벨리나(명조:%20워더링%20웨이브))
- [나무위키 — 앙코](https://namu.wiki/w/앙코(명조:%20워더링%20웨이브))
- [나무위키 — 파수인](https://namu.wiki/w/파수인)

### 신규 캐릭터 (3.3)
- [Vortex Gaming — 명조 3.3 히유키 데니아](https://vortexgaming.io/postdetail/722433)
- [Vortex Gaming — 히유키 공략](https://vortexgaming.io/postdetail/773850)
- [Gamsgo — 데니아 프리뷰](https://www.gamsgo.com/ko/blog/wuthering-waves-denia-preview)
