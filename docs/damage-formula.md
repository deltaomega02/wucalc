# WuCalc 대미지 공식 레퍼런스

> 출처: Wuthering Waves Fandom Wiki, wutheringwaves.gg, 커뮤니티 검증 데이터
> 이 문서는 src/lib/calc/ 구현의 기준이 된다.

---

## 1. 기본 대미지 공식

```
DMG = BaseDMG × Resistance × Bonuses
```

---

## 2. BaseDMG (기본 피해량)

```
BaseDMG = BaseAbilityDMG + FlatDMG + (FlatBonusPercent × BaseAbilityDMG)
```

### BaseAbilityDMG
```
BaseAbilityDMG = AbilityAttribute × MotionValue(%)
```

- **AbilityAttribute**: 스킬이 스케일링하는 스탯. 대부분 ATK, 일부 캐릭터 DEF 또는 HP.
- **MotionValue(%)**: 스킬 레벨별 배율. 게임 내 스킬 설명에 표시되는 % 수치.

### ATK 계산
```
TotalATK = (BaseATK_Character + BaseATK_Weapon) × (1 + ATKPercent) + FlatATK
```

- BaseATK_Character: 캐릭터 레벨별 기본 공격력
- BaseATK_Weapon: 무기 레벨별 기본 공격력
- ATKPercent: 에코 메인/서브옵 + 무기 서브스탯 + 세트효과 + 공명사슬 등의 합산
- FlatATK: 에코 서브옵의 고정 공격력

---

## 3. Resistance (적 방어 계수)

```
Resistance = RESMultiplier × DEFMultiplier × DMGReduction_Total × ElemReduction_Total
```

### 3.1 속성 저항 계수 (RESMultiplier)

```
RES_Total = BaseRES_Enemy + ResPEN_Attacker
RESMultiplier = 1 - RES_Total
```

- 대부분의 적 기본 저항: **10% (0.10)**
- 특정 속성을 저항하는 적: 추가 **약 33.3%** 저항
- 저항이 음수가 되면 대미지 증가 효과

### 3.2 방어 계수 (DEFMultiplier)

```
DEFMultiplier = (100 + AttackerLevel × LevelMultiplier) / 
               ((100 + AttackerLevel × LevelMultiplier) + DEF_Effective)
```

- DEF_Effective = DEF_Base × (1 - DEFIgnorePercent)
- LevelMultiplier: 레벨 기반 계수 (커뮤니티 역산 데이터 필요)

### 3.3 DMG Reduction / Elem Reduction

```
DMGReduction_Total = 1 - (DMGReduction_Base + DMGReduction_Additional)
ElemReduction_Total = 1 - (ElemReduction_Base + ElemReduction_Additional)
```

대부분의 일반 전투에서 이 값은 1 (감소 없음). 특정 보스 메커닉에서만 적용.

---

## 4. Bonuses (보너스 계수)

```
Bonuses = DMGBonus × DMGAmplify × SpecialDMG × CritMultiplier
```

### 4.1 DMG Bonus (피해 보너스%)

```
DMGBonus = 1 + (AttackTypeBonus + ElementBonus)
```

- **AttackTypeBonus**: 일반공격 피해 보너스%, 공명스킬 피해 보너스%, 공명해방 피해 보너스% 등
- **ElementBonus**: 풍속 피해 보너스%, 빙결 피해 보너스% 등

이 둘은 **가산(additive)** 관계 — 같은 카테고리 내에서 합산.

### 4.2 DMG Amplify (피해 증폭)

별도의 곱연산 카테고리. Deepen 효과(아웃트로 스킬 디펜) 등이 여기 속함.

```
DMGAmplify = 1 + (sum of all Amplify sources)
```

### 4.3 Special DMG

추가적인 별도 곱연산 카테고리.

### 4.4 CritMultiplier (크리티컬)

```
// 단일 히트 크리 시
CritDMG_Hit = 1 + CritDamage

// 평균 기대 크리 배율
AvgCritMultiplier = 1 + (CritRate × CritDamage)
```

- CritRate는 0~1 사이로 클램프 (100% 초과 시 1로 취급)
- 기본 CritRate: 5%
- 기본 CritDamage: 150%

---

## 5. 에코(Echo) 스탯 시스템

### 에코 코스트별 메인 스탯 범위 (Lv.25 기준)

**4 Cost (메인 에코)**
| 메인 스탯 | 최대값 |
|---|---|
| ATK% | 33% |
| HP% | 33% |
| DEF% | 41.5% |
| 크리확률 | 22% |
| 크리피해 | 44% |
| 치유 보너스 | 26.4% |
| 에너지충전 | 32% |

**3 Cost**
| 메인 스탯 | 최대값 |
|---|---|
| ATK% | 30% |
| HP% | 30% |
| DEF% | 38% |
| 속성 피해 보너스 | 30% |
| 에너지충전 | 32% |

**1 Cost**
| 메인 스탯 | 최대값 |
|---|---|
| ATK% | 18% |
| HP% | 22.8% |
| DEF% | 18% |
| ATK (고정) | 150 |
| HP (고정) | 2280 |
| DEF (고정) | 200 |

### 서브 스탯 최대값 (1회 강화당)

| 서브 스탯 | 최대값/회 |
|---|---|
| ATK% | 3.0% |
| HP% | 3.0% |
| DEF% | 3.8% |
| ATK (고정) | 40 |
| HP (고정) | 580 |
| DEF (고정) | 50 |
| 크리확률 | 6.3% |
| 크리피해 | 12.6% |
| 에너지충전 | 5.4% |
| 일반공격 보너스 | 3.0% |
| 중공격 보너스 | 3.0% |
| 공명스킬 보너스 | 3.0% |
| 공명해방 보너스 | 3.0% |

---

## 6. 에코 비교 계산 흐름

이것이 MVP의 핵심 로직이다.

```
입력:
  - 캐릭터 선택 → 기본 스탯 로드
  - 무기 선택 → 무기 스탯 로드
  - 나머지 에코 4개 → 스탯 합산 (고정값 사용 또는 직접 입력)
  - 비교 대상 에코 A, 에코 B → 각각 메인옵 + 서브옵 입력

계산:
  1. 에코 A 장착 시 최종 스탯 합산
  2. 에코 B 장착 시 최종 스탯 합산
  3. 각각 대미지 공식 적용 → 스킬별 기대 딜량 산출
  4. 차이 계산

출력:
  - 에코 A 기대 딜량 vs 에코 B 기대 딜량
  - 차이 (절대값 + %)
  - 어떤 스탯 차이가 딜량에 가장 크게 기여했는지 하이라이트
```

---

## 7. 곱연산 vs 가산 정리

명조의 대미지 보너스 시스템에서 핵심은 **서로 다른 카테고리는 곱연산**이라는 점이다.

```
최종 대미지 = BaseDMG × (1 + DMGBonus합) × (1 + Amplify합) × (1 + SpecialDMG합) × CritMult

같은 카테고리 내부: 가산 (수확체감)
서로 다른 카테고리 간: 곱연산 (효율적)
```

예시: ATK% 30%를 2번 쌓으면 60% 증가. 하지만 ATK% 30% + 속성피해 30%는 약 69% 증가. 이것이 "여러 종류의 보너스를 분산 투자하는 것이 효율적"인 이유다.

이 원리가 에코 비교 계산기의 핵심 가치 — 유저가 직관적으로 판단하기 어려운 "어떤 조합이 더 효율적인지"를 수치로 보여준다.

---

## 8. 주의사항

- 위 수치들은 2026년 3월 기준이며, 게임 업데이트로 변경될 수 있다
- DEF 계수의 정확한 레벨 스케일링 공식은 커뮤니티 역산치이며, 공식 발표값이 아니다
- Tune Break / Tune Rupture 등 3.0 이후 추가된 메커닉은 Phase 2에서 다룬다
- 에코 서브스탯 최대값은 버전에 따라 소폭 조정될 수 있으므로, 데이터 파일에서 관리하고 하드코딩하지 않는다
