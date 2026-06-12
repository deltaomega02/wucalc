# WuCalc — 명조(Wuthering Waves) 데미지 계산기

게임의 복잡한 데미지 공식을 정밀 구현한 계산기 웹앱.
캐릭터 49종 · 무기 104종의 메커니즘을 TypeScript 타입 시스템으로 정량 모델링하고,
**모든 수식을 단위 테스트 167개로 공식 자료와 교차 검증**한다.

AI 도구를 적극 활용해 개발하되, 품질은 테스트와 데이터 정합성 검사로 담보하는 개발 방식의 실례.

## 기술 스택

| 영역 | 기술 | 용도 |
|---|---|---|
| 프레임워크 | Next.js (App Router), React | SSR 웹앱 |
| 언어 | TypeScript (strict 모드) | 게임 데이터·수식의 타입 안전성 |
| 테스트 | Vitest — 단위·시나리오·E2E 167개 | 데미지 공식 회귀 방지 |
| OCR | Tesseract (한/영 traineddata) | 게임 스크린샷에서 스탯 자동 인식 (클라이언트 처리) |
| i18n | 메시지 카탈로그 (ko/en) | 다국어 지원 |
| 배포 | Docker, docker-compose | 컨테이너 셀프호스팅 |

## 동작 방식

### 데미지 계산 파이프라인

```
[입력] 캐릭터 + 무기 + 에코(장비) + 파티 구성
  → stats:    기본 스탯 + 장비·패시브·공명체인 효과 합산 (FinalStats)
  → passives: 조건부 효과 적용 판정 (appliesWhen — 스킬 타입·상태별)
  → damage:   기본 피해 × 증폭(Amplify) × 속성/스킬 보너스 × 크리 기대값
  → party:    슬롯별 시너지(아웃트로 버프, 공조 공격) 반영한 파티 DPS
[출력] 스킬별·시나리오별 기대 데미지
```

### 데이터 모델링

게임 메커니즘을 코드가 아닌 **정량 데이터**로 분리해 패치 대응과 검증을 쉽게 했다.

- `src/data/resonanceChains.ts` — 캐릭터 38종 공명체인 효과
- `src/data/inherentSkills.ts` — 고유 스킬 27종
- `src/data/stateEffects.ts` — 상태/스택 메커니즘 16종
- `src/data/weaponPassives.ts` — 무기 패시브 75종 (조건부 적용 `appliesWhen`, 재련 배율 포함)

### 검증 체계 (이 프로젝트의 핵심)

게임 데미지 공식은 "정답이 있는 도메인" — 공식 자료·위키의 기대값을 테스트로 박아 둔다.

| 레이어 | 파일 | 검증 대상 |
|---|---|---|
| 단위 | `damage.test.ts`, `stats.test.ts` | 개별 수식·스탯 합산 |
| 시나리오 | `scenarios*.test.ts` (T01~T11) | 캐릭터+무기+상태 조합의 최종 데미지 |
| 통합 | `party-e2e.test.ts` | 실제 데이터 3슬롯 파티 E2E |
| 데이터 | `npm run validate-data` | 참조 무결성·정합성 (0 errors 유지) |
| 명칭 | `npm run verify-names` | 한/영 공식 명칭 교차 검증 |

데이터 출처가 서로 다를 때(위키 간 불일치)는 1차 출처 다중 교차 검증으로 정정했다 — 과정은 `docs/verification-report.md`에 기록.

### OCR 스탯 인식

게임 스크린샷은 개인 데이터이므로 서버로 보내지 않고 **브라우저 안에서** Tesseract로 처리한다.
게임 UI는 폰트·레이아웃이 고정이라 영역 크롭 + 전처리로 인식률을 확보.

## 프로젝트 구조

```
wucalc/
├── src/
│   ├── app/            # Next.js 라우트 (페이지)
│   ├── components/     # UI 컴포넌트
│   ├── lib/
│   │   ├── calc/       # 계산 엔진 (damage, stats, passives, party, echo, boss)
│   │   │   └── __tests__/   # 테스트 167개 (8개 파일)
│   │   └── ocr/        # Tesseract 스탯 인식
│   ├── data/           # 캐릭터·무기·체인 정량 데이터
│   ├── stores/         # 클라이언트 상태
│   └── i18n/ + messages/   # 다국어
├── scripts/            # 데이터 정합성·명칭 검증 스크립트
└── docs/               # 아키텍처, 데미지 공식, 검증 보고서, 데이터 갭 추적
```

## 실행

```bash
npm install
npm run dev          # 개발 서버
npm test             # 단위 테스트 (167개)
npm run validate-data  # 데이터 정합성 검사
npx tsc --noEmit     # 타입 체크 (strict, 클린 유지)
```

Docker: `docker compose up -d`
