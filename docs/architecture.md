# WuCalc 프로젝트 아키텍처

## Docker 구성

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### docker-compose.yml

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - WATCHPACK_POLLING=true
    command: npm run dev
```

### .dockerignore

```
node_modules
.next
.git
*.md
docker-compose.yml
```

### Docker 개발 명령어

```bash
# 최초 빌드 및 실행
docker compose up --build

# 이후 실행
docker compose up

# 패키지 추가 (컨테이너 안에서)
docker compose exec app npm install <패키지명>

# 패키지 추가 후 리빌드
docker compose up --build

# 컨테이너 셸 접속
docker compose exec app sh

# 종료
docker compose down
```

---

## 프로젝트 디렉토리 구조

```
wucalc/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
│
├── public/
│   ├── icons/                  # 캐릭터/무기/에코 아이콘 이미지
│   └── images/
│
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── layout.tsx              # 루트 레이아웃
│   │   ├── page.tsx                # 랜딩 페이지
│   │   ├── calculator/             # 에코 비교 계산기
│   │   │   └── page.tsx
│   │   ├── weapons/                # 무기 비교
│   │   │   └── page.tsx
│   │   └── globals.css
│   │
│   ├── components/             # UI 컴포넌트
│   │   ├── ui/                     # 기본 요소 (Button, Input, Card, Select)
│   │   ├── layout/                 # Header, Footer, Sidebar, Navigation
│   │   └── calculator/             # 계산기 전용 (EchoInput, StatDisplay, ComparisonResult)
│   │
│   ├── lib/                    # 비즈니스 로직 (React 무관)
│   │   ├── calc/                   # 대미지 계산 엔진
│   │   │   ├── damage.ts               # 메인 대미지 공식
│   │   │   ├── stats.ts                # 스탯 합산 로직
│   │   │   ├── echo.ts                 # 에코 스탯 계산
│   │   │   ├── weapon.ts               # 무기 스탯/패시브 계산
│   │   │   ├── constants.ts            # 공식 상수 정의
│   │   │   └── types.ts                # 계산 관련 타입
│   │   └── utils/                  # 포맷팅, 반올림 등 유틸
│   │
│   ├── data/                   # 게임 데이터 (정적 JSON)
│   │   ├── characters/             # 캐릭터별 스탯, 스킬 배율
│   │   ├── weapons/                # 무기 스탯, 패시브
│   │   ├── echoes/                 # 에코 세트효과, 메인/서브옵 범위
│   │   └── enemies/                # 보스 HP, 내성, DEF
│   │
│   ├── stores/                 # Zustand 상태 관리
│   │   └── buildStore.ts           # 빌드 입력 상태
│   │
│   ├── hooks/                  # 커스텀 React 훅
│   │   └── useCalculator.ts        # 계산 결과 훅
│   │
│   └── types/                  # 글로벌 타입 정의
│       └── game.ts                 # Character, Weapon, Echo 등 타입
│
├── docs/                       # 프로젝트 내부 문서
└── scripts/                    # 데이터 변환 스크립트
```

---

## 핵심 타입 정의 (src/types/game.ts)

```typescript
// 원소 속성
type Element = 'fusion' | 'glacio' | 'aero' | 'electro' | 'havoc' | 'spectro';

// 무기 타입
type WeaponType = 'broadblade' | 'sword' | 'pistols' | 'gauntlets' | 'rectifier';

// 공격 타입
type AttackType = 'normal' | 'heavy' | 'skill' | 'liberation' | 'intro' | 'outro' | 'echo';

// 기본 스탯
interface BaseStats {
  hp: number;
  atk: number;
  def: number;
}

// 캐릭터 데이터
interface Character {
  id: string;
  name: Record<string, string>;  // { ko, en }
  rarity: 4 | 5;
  element: Element;
  weaponType: WeaponType;
  baseStats: Record<string, BaseStats>;  // 레벨별
  skills: Record<string, SkillData>;
}

// 무기 데이터
interface Weapon {
  id: string;
  name: Record<string, string>;
  rarity: 3 | 4 | 5;
  type: WeaponType;
  baseAtk: Record<string, number>;  // 레벨별
  subStat: { type: string; value: number };
  passive: WeaponPassive;
}

// 에코 데이터
interface Echo {
  cost: 1 | 3 | 4;
  mainStat: StatEntry;
  subStats: StatEntry[];
  setId?: string;
}

interface StatEntry {
  type: StatType;
  value: number;
}

type StatType =
  | 'hp' | 'hpPercent'
  | 'atk' | 'atkPercent'
  | 'def' | 'defPercent'
  | 'critRate' | 'critDmg'
  | 'energyRegen'
  | 'normalDmgBonus' | 'heavyDmgBonus'
  | 'skillDmgBonus' | 'liberationDmgBonus'
  | 'aeroDmgBonus' | 'glacioDmgBonus'
  | 'fusionDmgBonus' | 'electroDmgBonus'
  | 'havocDmgBonus' | 'spectroDmgBonus';

// 빌드 (유저 입력)
interface Build {
  character: Character;
  weapon: Weapon;
  echoes: Echo[];          // 최대 5개
  echoSetBonuses: string[];
  characterLevel: number;
  skillLevels: Record<string, number>;
}

// 계산 결과
interface CalcResult {
  finalStats: FinalStats;
  damagePerHit: Record<string, number>;    // 스킬별 기대 대미지
  avgDps: number;                           // 평균 초당 딜량
  critMultiplier: number;                   // 평균 크리 배율
}

interface FinalStats {
  hp: number;
  atk: number;
  def: number;
  critRate: number;
  critDmg: number;
  elementDmgBonus: number;
  energyRegen: number;
}
```

---

## 디자인 시스템

### 색상 (다크모드 기본)

```
Primary:     #4ECDC4  (청록 — 메인 액센트)
Accent:      #FFD700  (골드 — 5성/하이라이트)
Background:  #0F1117  (메인 배경)
Surface:     #1A1D2E  (카드/패널 배경)
Border:      #2A2D3E  (구분선)
Text:        #E8E8E8  (기본 텍스트)
TextMuted:   #8B8FA3  (보조 텍스트)
Positive:    #4ADE80  (증가/긍정)
Negative:    #F87171  (감소/부정)
```

### UI 원칙
- 모바일 우선 반응형 (breakpoint: sm:640px, md:768px, lg:1024px)
- 비교 결과는 Positive/Negative 색상으로 즉각적 판단 가능
- 인풋 변경 시 결과 실시간 업데이트 (debounce 200ms)
- 광고 영역 없음, 미니멀 레이아웃

---

## 외부 데이터 파이프라인

게임 데이터를 수동으로 타이핑하지 않는다. 아래 파이프라인으로 자동화한다.

### 데이터 소스 (우선순위순)

1. **GitHub 커뮤니티 데이터 리포지토리**
   - 검색 키워드: `wuthering waves data json github`
   - 캐릭터 스탯, 스킬 배율, 무기 데이터 등이 JSON/CSV로 정리된 리포지토리 활용
   - 라이선스 확인 필수

2. **Wuthering Waves Fandom Wiki**
   - MediaWiki API로 페이지 데이터 파싱 가능
   - URL 패턴: `https://wutheringwaves.fandom.com/api.php?action=parse&page={pagename}&format=json`
   - 스킬 배율, 에코 세트 효과 등

3. **hakush.in**
   - 미래시 포함 게임 데이터 제공
   - API wrapper 존재: `hakushin-py` (Python)

4. **인게임 데이터마이닝 결과물**
   - 검색으로 최신 데이터시트/JSON 확보

### 스크립트 구조

```
scripts/
├── sync-data.ts          # 메인 동기화 진입점 (npm run sync-data)
├── sources/
│   ├── fetchFromWiki.ts   # Fandom Wiki API 파서
│   ├── fetchFromGithub.ts # GitHub 리포 raw 데이터 fetch
│   └── fetchFromApi.ts    # 기타 API 소스
├── transform/
│   ├── characters.ts      # 원본 → src/data/characters/ 변환
│   ├── weapons.ts         # 원본 → src/data/weapons/ 변환
│   └── echoes.ts          # 원본 → src/data/echoes/ 변환
└── validate/
    └── schema.ts          # 변환된 데이터의 타입 정합성 검증
```

### package.json scripts

```json
{
  "scripts": {
    "sync-data": "ts-node scripts/sync-data.ts",
    "validate-data": "ts-node scripts/validate/schema.ts"
  }
}
```

### 원칙
- 데이터 동기화 스크립트는 Docker 안에서 실행한다
- 원본 데이터를 그대로 쓰지 않고, 반드시 프로젝트 타입에 맞게 변환/검증 후 src/data/에 저장한다
- 게임 버전 업데이트 시 `npm run sync-data` 한 번이면 전체 데이터가 갱신되는 구조를 목표로 한다
- 외부 API가 죽어도 서비스는 동작해야 한다 (마지막 동기화된 정적 JSON으로 서빙)
