# WuCalc 디자인 브리프 (Design Brief)

> 명조의 세계관 × 2026 모던 웹 디자인 트렌드를 합쳐 만들어내는 압도적 인터페이스.
> 작성: 2026-05-21

---

## 0. 컨셉 한 줄

> **"Echo Resonance Console"** — 검은 해안의 파동 잔해를 해독하는 잠수정 콘솔.
> Cel-shaded 캐릭터 아트 × 시네마틱 다크 × 일렉트로닉 글로우 × 일본식 벤토 그리드.

---

## 1. 브랜드 DNA — 명조에서 가져올 5가지 코드

### 1-1. **共鳴 (Resonance)** — 동심원 파동
- 호버/포커스 시 동심원이 퍼지는 ripple 모션
- 데이터가 갱신될 때 ring pulse (Vacancy Damping 컨셉)
- 모든 액션 = 음파의 시각화

### 1-2. **黒岸 (Black Coast)** — 검은 해안 / 비명의 잔향
- 베이스 컬러: 심해 흑청 (deep teal-black)
- 텍스처: 어두운 stratus + 미세한 노이즈 그레인 (post-Lament feel)
- 절대 순수 #000 사용 금지 — 항상 hue가 깃든 거의-검정

### 1-3. **聲骸 (TacET / Echo)** — 파편화된 데이터
- UI 요소 = "Echo 결정체"
- 데이터 카드 = 부유하는 결정 (subtle elevation + glassy facet)
- 카테고리 구분자: 6각형/8각형 클립패스

### 1-4. **6대 속성 (Resonance Elements)** — 핵심 컬러 매핑
| 속성 | 영문 | 시그니처 색 | RGB | 무드 |
|---|---|---|---|---|
| **응결** | Glacio | `#7AE0FF` cyan-ice | rgb(122,224,255) | 차갑고 정밀한 빙결 |
| **융합** | Fusion | `#FF7A5E` ember-orange | rgb(255,122,94) | 폭발하는 화염 |
| **전도** | Electro | `#C77AFF` violet-arc | rgb(199,122,255) | 번개의 잔영 |
| **기류** | Aero | `#7AFFB8` mint-wind | rgb(122,255,184) | 흐르는 바람 |
| **회절** | Spectro | `#FFE07A` solar-gold | rgb(255,224,122) | 빛 입자 |
| **인멸** | Havoc | `#FF7AB8` crimson-violet | rgb(255,122,184) | 잔혹한 자취 |

### 1-5. **Concerto (협주)** — 팀 시너지
- 캐릭터 슬롯 = 악기 자리
- 데미지 계산 = 협주곡 진행 (1악장 인트로, 2악장 본 딜, 3악장 아웃트로)
- 결과 그래프 = "악보처럼" 시각화

---

## 2. 컬러 시스템

### 2-1. 베이스 (Surface ladder)

```
--bg-deepest     #06080C   // 무한 — 페이지 밖
--bg-base        #0B0F16   // 메인 캔버스 (no pure black)
--surface-1      #11161F   // 카드 외곽
--surface-2      #161C28   // 카드 내부
--surface-3      #1C2433   // 호버 / 활성
--surface-glass  rgba(22,28,40,0.6)  // glassmorphism overlay
```

### 2-2. 텍스트 (luminance hierarchy — Linear 스타일)

```
--text-primary   #E8EDF5   // 핵심 본문
--text-secondary #A8B3C4   // 보조
--text-muted     #6B7689   // 디스에이블 / 캡션
--text-faint     #3C4554   // 외곽선 텍스트
```

### 2-3. 액센트 (Neon Punch)

```
--accent-cyan    #4DD9FF   // 메인 액션 (Glacio 계열 — WuCalc 시그니처)
--accent-magenta #FF4D8F   // 위험 / 크리티컬
--accent-amber   #FFB84D   // 경고
--accent-emerald #4DFFB8   // 성공 / 디버그 패스
```

### 2-4. 시그니처 그라데이션 (Glow Halo)

```
--glow-resonance  linear-gradient(135deg, #4DD9FF 0%, #C77AFF 50%, #FF4D8F 100%)
--glow-elemental  per-character (그 캐릭터 속성 색 → 보조 hue)
--glow-rarity-5   linear-gradient(180deg, #FFE07A 0%, #FF7A5E 100%)  // 5★
--glow-rarity-4   linear-gradient(180deg, #C77AFF 0%, #7A6EFF 100%)  // 4★
```

### 2-5. 사용 규칙

- **순수 white/black 절대 금지** — 모든 색은 brand hue가 1% 이상 포함
- **카드 보더 = 0.5px alpha 8%** (shadow 대신 luminance border — Linear 패턴)
- **glow는 인터랙티브 요소에만** (button, focus state, KPI 카드)
- 한 화면에 액센트 컬러 ≤ 2개 (속성색 + 시그니처 cyan)

---

## 3. 타이포그래피

### 3-1. 폰트 스택

```
/* Display (헤드라인, KPI 숫자) */
--font-display: 'Space Grotesk', 'Pretendard', system-ui;
/* — 미래적 sans, korean fallback */

/* Body (UI 텍스트) */
--font-body: 'Inter', 'Pretendard Variable', system-ui;
/* — 가독성 최강 */

/* Mono (수치, 모션 밸류) */
--font-mono: 'JetBrains Mono', 'IBM Plex Mono', monospace;
/* — 데미지 % 표시, console feel */

/* Decorative (특별한 강조 — 한정 사용) */
--font-decor: 'Tenor Sans', serif;
/* — 명조 스킬명 같은 "이름표" */
```

### 3-2. 스케일 (1.250 ratio)

```
text-2xs   10px  // 캡션
text-xs    12px  // 메타
text-sm    14px  // body
text-base  16px  // body lg
text-lg    20px  // subheading
text-xl    24px  // section h3
text-2xl   32px  // page h2
text-3xl   40px  // h1
text-4xl   56px  // hero display
text-5xl   80px  // landing KPI / 결과 숫자
```

### 3-3. 키네틱 타이포 (2026 트렌드)

- 페이지 진입 시 hero 타이틀: 자모 단위 stagger fade-up (50ms씩)
- 데미지 결과 숫자: count-up 애니메이션 + 글로우 펄스
- 캐릭터 이름: 호버 시 letter-spacing 미세 확장 (한글에도 적용)
- Variable font weight 활용 — 호버 시 600 → 700 부드러운 전환

---

## 4. 레이아웃 — Bento Grid 시스템

### 4-1. 그리드 베이스

```
12-column grid, gap-6 (24px)
max-width: 1440px (premium feel — 너무 넓지 않게)
gutter: clamp(16px, 4vw, 48px)
```

### 4-2. Bento 카드 사이즈 토큰

```
.tile-1x1    // 1 col × 1 row  — KPI 단일 수치
.tile-2x1    // 2 col × 1 row  — 비교 차트
.tile-1x2    // 1 col × 2 row  — 캐릭터 카드
.tile-2x2    // 2 col × 2 row  — 메인 데미지 차트
.tile-3x2    // 3 col × 2 row  — 파티 슬롯
.tile-full   // 12 col × N row — 상세 분석
```

### 4-3. 카드 구조 — "Echo Crystal"

```
┌─ Border (1px alpha border)
│  ┌─ Glass overlay (8% backdrop-blur)
│  │  ┌─ Content padding (24px)
│  │  │   • Label (text-xs, uppercase, muted)
│  │  │   • Primary value (text-3xl, mono, glow)
│  │  │   • Delta indicator (text-sm, emerald/magenta)
│  │  │   • Sparkline / mini chart
│  │  └─
│  └─ Bottom: faint hairline glow (when active)
└─ Hover: surface-3 + scale(1.01) + glow halo
```

### 4-4. 페이지별 레이아웃 컨셉

#### **Landing / Hero**
- 풀 블리드 다크 캔버스 + 미세한 노이즈 그레인
- 중앙: 6각형 회전 logo + 키네틱 타이틀 "WuCalc — Resonance Console"
- 배경: WebGL particles (low-poly, GPU-friendly) — Echo 입자 부유
- CTA: Cyan glow border button "이젠 음파를 해독하라" ("Decode the Resonance")

#### **Calculator (메인)**
```
┌─────────────────────────────────────────────────────────────┐
│  Top bar: 로고 / 페이지 nav / 언어 / 테마 토글               │
├──────────────┬──────────────────────────────┬────────────────┤
│              │                              │                │
│  Character   │   Damage Output             │   Buff Stack   │
│  Slot 3      │   (Bento 2x2)               │   (1x2)        │
│  (3x2)       │                              │                │
│              │   대형 KPI: 7,234,891         │                │
│              │   ↑ 12.4% vs baseline       │                │
├──────────────┼──────────────────────────────┴────────────────┤
│              │   Skill Breakdown (full row, bar chart)       │
│   Echo       │                                                │
│   Slots      │                                                │
│   (3x2)      │                                                │
├──────────────┴────────────────────────────────────────────────┤
│   Detailed log (full-width, monospace, collapsible)           │
└────────────────────────────────────────────────────────────────┘
```

#### **Character browser**
- 50명 캐릭터 카드 — bento 변형 (5★는 2x2, 4★는 1x1)
- 카드 hover: 캐릭터 cel-shaded 일러스트 fade-in + 속성 glow
- 필터: 속성 (6 hexagon icons), 무기, 희귀도 — sticky 우측

#### **Weapon browser**
- 무기 타입별 5각 fan-out 메뉴 (광검/장검/권총/권갑/음감장치)
- 선택 시 좌측 무기 상세 (3D 효과 — subtle perspective)
- R1~R5 슬라이더 (kinetic — 드래그 시 수치 morph)

#### **Party Builder**
- 3개 슬롯 = 3개 큰 캐릭터 카드
- 캐릭터 간 "Concerto 라인" — SVG path로 시너지 표시 (속성 매칭 시 glow)
- Outro / Intro 화살표가 슬롯 간 흐름으로 애니메이션

---

## 5. 컴포넌트 라이브러리

### 5-1. Button

```
Primary    cyan glow border, transparent fill, hover→glow halo
Secondary  surface-2 fill, no border, hover→surface-3
Ghost      no fill, text-secondary, hover→text-primary
Danger     magenta accent
Element    각 속성 컬러 (캐릭터 선택 등 컨텍스트)
```

### 5-2. Input / Select

- 외곽선 alpha 12%
- focus → cyan glow border (0.5px) + bg shift to surface-3
- 숫자 입력: mono font, suffix 단위 (%, etc.) muted color
- Slider: cyan rail + glow thumb + tick marks

### 5-3. Tabs

- 언더라인 형 (Linear/Vercel 스타일)
- active: cyan underline + glow + subtle bg
- inactive: text-muted, hover→text-secondary

### 5-4. Modal / Drawer

- Backdrop: rgba(6,8,12,0.7) + backdrop-blur(20px)
- Modal frame: surface-2 + 1px alpha 8% border + glow on top edge
- 진입: scale(0.96) → 1 + opacity, 200ms cubic-bezier ease-out

### 5-5. Chart (데이터 시각화)

- 색: 속성 컬러 매핑 (Glacio 라인 = cyan, etc.)
- Grid lines: alpha 6%
- Axis: text-faint
- 호버 tooltip: glass card + 정확한 수치 표시
- 라이브러리: **Recharts** 또는 **Visx** (D3 기반, 가벼움)

### 5-6. Toast / Notification

- 우상단 fade-slide
- success: emerald glow line / error: magenta glow line
- auto-dismiss 4s, ring progress 인디케이터

---

## 6. 모션 / 인터랙션 언어

### 6-1. Easing

```
--ease-resonance   cubic-bezier(0.16, 1, 0.3, 1)  // 빠르게 시작 → 부드럽게 정착
--ease-instant     cubic-bezier(0.4, 0, 0.2, 1)    // 표준 material
--ease-bounce      cubic-bezier(0.34, 1.56, 0.64, 1)  // 데미지 결과 등장
```

### 6-2. Duration

```
100ms — micro (호버 색상 변화)
200ms — small (버튼 누름, focus)
350ms — medium (카드 전환, modal 진입)
600ms — large (페이지 전환, hero 입장)
1.2s — cinematic (데미지 결과 reveal)
```

### 6-3. 시그니처 모션 — "Resonance Ripple"

- 클릭 위치에서 동심원 ring 1.5초 expand + fade
- SVG `<circle>` + `r` animate from 0 → 80px + stroke alpha 1 → 0
- 색: 현재 컨텍스트 색 (캐릭터 선택 시 그 속성 색)

### 6-4. 데이터 갱신 — "Echo Pulse"

- KPI 카드의 숫자 변경 시:
  1. 기존 숫자 fade-up (translate-y -8px, opacity 1→0, 200ms)
  2. 새 숫자 fade-up (translate-y 8px→0, opacity 0→1, 250ms)
  3. 카드 border 1초간 cyan pulse (alpha 0→0.6→0)

### 6-5. 페이지 전환

- Next.js View Transitions API 사용
- 캐릭터 카드 클릭 → 상세 페이지: shared element transition (avatar morph)
- 일반 페이지 이동: 좌→우 slide + fade (300ms)

### 6-6. 스크롤 인터랙션

- Hero: parallax 캐릭터 silhouette (subtle, 0.3 ratio)
- Section 등장: IntersectionObserver + stagger (자식 100ms 간격)
- 큰 숫자: scroll-into-view 시 count-up

---

## 7. 일러스트레이션 / 그래픽 요소

### 7-1. 6각형 모티프

- 캐릭터 아바타 프레임: 6각형 클립 + 속성 컬러 외곽 glow
- 속성 아이콘: 6각형 내부에 elemental sigil
- 카테고리 구분자: 작은 6각형 chip

### 7-2. 파동 (Wave) 모티프

- 페이지 푸터: SVG 사인파 + 미세한 노이즈 텍스처
- 로딩 인디케이터: 동심원 ring 펄스 (resonance ping)
- 데이터 비교 차트: 파동 형태 area chart

### 7-3. 글리치 / 노이즈 (절제)

- 호버 시 텍스트 0.1초 미세 글리치 (RGB split, 한 번만)
- 백그라운드: SVG turbulence noise filter (opacity 0.03) — 무한 텍스처
- 절대 과용 금지 — accent로만

### 7-4. 캐릭터 일러스트 통합

- wuthering.gg API 또는 자체 호스팅 cel-shaded PNG
- 카드 호버 시 캐릭터가 카드 안에서 살짝 "들숨" (scale 1→1.03, 600ms)
- 캐릭터 디테일 페이지: 좌측 풀 일러스트 + 우측 데이터 (50/50 split)

---

## 8. 페이지 컨셉 디테일

### 8-1. Landing Page

```
[ Hero ]
  Background: WebGL particle field (Three.js, 200 particles, glow)
  Center: WuCalc logo (custom — 6각형 안에 'W' + wave underline)
  Tagline (kinetic):
    "명조 데미지를 음파처럼 해독한다"
    "Decode every wave of damage."
  CTAs:
    [Try Calculator →] (cyan glow primary)
    [Browse Characters] (ghost)

[ Featured Stats ]
  Bento grid 4x2:
    • 49 캐릭터 / 104 무기 / 911 모션 밸류 / 100% 데이터마인 검증
    각 KPI 카드 — count-up + element-specific glow

[ Live Calculation Demo ]
  Half-page interactive: 자동으로 카멜리아 데미지 계산 진행 표시
  Skill breakdown bar 애니메이션 + 최종 숫자 reveal

[ Why WuCalc ]
  3개 큰 카드 (bento):
    - "1차 출처 데이터마인 검증" (방패 아이콘 + 100% 배지)
    - "공조 공격 / 카테고리별 Amplify 정확 모델" (수식 아이콘)
    - "50/50 캐릭터 풀 커버리지" (캐릭터 콜라주)

[ Footer ]
  파동 SVG + 링크 / 데이터 출처 크레딧
```

### 8-2. Calculator Page

핵심 인터랙션 — **Concerto Flow (악장 진행)**

1. **1st 악장: Cast** — 캐릭터/무기/에코 선택
   - 좌측 sticky panel (3슬롯 × 캐릭터/무기/에코)
   - 슬롯 간 화살표 (intro→outro 흐름)
2. **2nd 악장: Modulate** — 버프 / 적 설정
   - 우상단 controls — chain unlock 슬라이더, 적 레벨 input
3. **3rd 악장: Resolve** — 데미지 결과
   - 메인 중앙 큰 KPI 카드 (글로우 펄스 reveal)
   - 하단 skill-by-skill breakdown bar chart
   - 옆에 baseline 대비 delta 인디케이터

### 8-3. Character Detail

```
┌────────────────────┬─────────────────────────────────────────┐
│                    │  치사 (Chisa) — Havoc Broadblade 5★    │
│   풀 일러스트       │  HP 10,775 / ATK 438 / DEF 1,137       │
│   (cel-shaded,    │                                          │
│   parallax        │  [Skills] [Inherent] [Chain] [Outro]   │
│   on scroll)      │  ───────────────────────────────────    │
│                    │  스킬 트리 / 모션 밸류 테이블             │
└────────────────────┴─────────────────────────────────────────┘
배경: 그 캐릭터 속성 색의 미세한 그라데이션 mesh
```

### 8-4. Party Builder

- 3개 슬롯 + Concerto 라인 시각화
- 슬롯 클릭 → 캐릭터 picker drawer (우측 슬라이드)
- 시너지 분석: 4가지 지표 (속성 매칭, intro/outro 체인, buff 카테고리 매칭, role 균형)
- 실시간 DPS curve — 30초 윈도우에서 각 슬롯 contribution

---

## 9. 접근성 (a11y)

- **Contrast**: 모든 텍스트/배경 조합 WCAG AA 이상 (large text는 AAA 권장)
- **Focus ring**: 키보드 포커스 시 cyan 2px outline + offset 2px
- **Motion reduce**: `prefers-reduced-motion` 시 모든 transition 0.1s, particle off
- **Color independence**: 속성 색 + 6각형 모양 + 라벨 3중 표기 (색맹 대응)
- **Korean/English toggle**: 모든 텍스트 i18n 준비 (next-intl already in stack)
- **Screen reader**: aria-live on damage results, semantic landmarks
- **Keyboard nav**: 캐릭터 picker는 grid + arrow keys, tab 순서 명확

---

## 10. 기술 구현 가이드 (Next.js 15 + Tailwind 4 stack)

### 10-1. CSS 변수 정의 (`globals.css`)

```css
:root {
  /* Surface */
  --bg-deepest: #06080C;
  --bg-base: #0B0F16;
  --surface-1: #11161F;
  --surface-2: #161C28;
  --surface-3: #1C2433;
  
  /* Text */
  --text-primary: #E8EDF5;
  --text-secondary: #A8B3C4;
  --text-muted: #6B7689;
  --text-faint: #3C4554;
  
  /* Accent */
  --accent-cyan: #4DD9FF;
  --accent-magenta: #FF4D8F;
  --accent-amber: #FFB84D;
  --accent-emerald: #4DFFB8;
  
  /* Element (per-character themable) */
  --elem-glacio: #7AE0FF;
  --elem-fusion: #FF7A5E;
  --elem-electro: #C77AFF;
  --elem-aero: #7AFFB8;
  --elem-spectro: #FFE07A;
  --elem-havoc: #FF7AB8;
  
  /* Glow tokens */
  --glow-cyan: 0 0 24px rgba(77,217,255,0.25), 0 0 48px rgba(77,217,255,0.1);
  --glow-elem: 0 0 24px var(--elem-current, transparent);
  
  /* Easing */
  --ease-resonance: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 10-2. Tailwind 4 토큰 (`tailwind.config.ts`)

```ts
theme: {
  extend: {
    colors: {
      bg: { deepest, base, ... },
      surface: { 1, 2, 3 },
      text: { primary, secondary, muted, faint },
      accent: { cyan, magenta, amber, emerald },
      elem: { glacio, fusion, electro, aero, spectro, havoc },
    },
    fontFamily: {
      display: ['"Space Grotesk"', 'Pretendard', 'system-ui'],
      sans: ['Inter', '"Pretendard Variable"', 'system-ui'],
      mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
    },
    boxShadow: {
      glow: 'var(--glow-cyan)',
      'glow-elem': 'var(--glow-elem)',
    },
    backdropBlur: {
      glass: '12px',
    },
    transitionTimingFunction: {
      resonance: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  }
}
```

### 10-3. 핵심 라이브러리 픽업

```json
{
  "framer-motion": "^12.x",      // 모션 / shared element
  "@react-three/fiber": "^9.x",   // Hero particle background
  "recharts": "^3.x",             // 차트
  "lucide-react": "^0.5x",        // 아이콘 (커스텀 6각형 별도)
  "vaul": "^1.x",                 // Drawer
  "cmdk": "^1.x",                 // ⌘K 명령 팔레트 (Raycast-style)
  "sonner": "^2.x"                // Toast
}
```

### 10-4. 폴더 구조 (제안)

```
src/components/
├── ui/                    // 기본 컴포넌트 (button, input, card 등)
│   ├── BentoCard.tsx     // 모든 KPI 카드의 베이스
│   ├── ElementBadge.tsx  // 6각형 속성 아이콘
│   ├── GlowButton.tsx
│   └── KineticNumber.tsx // count-up + glow pulse
├── layout/
│   ├── TopBar.tsx
│   ├── PageShell.tsx
│   └── ResonanceBackground.tsx  // 노이즈 + 미세 particle
├── characters/
│   ├── CharacterCard.tsx
│   ├── CharacterPicker.tsx      // Drawer 형식
│   └── CharacterDetail.tsx
├── calculator/
│   ├── PartySlots.tsx
│   ├── DamageResult.tsx         // 메인 KPI + reveal 애니메이션
│   ├── SkillBreakdown.tsx
│   └── ConcertoFlow.tsx         // SVG path 시너지 라인
└── hero/
    ├── ParticleField.tsx        // R3F WebGL
    └── KineticTitle.tsx
```

### 10-5. 성능 가드레일

- **Hero particle**: WebGL `<canvas>` 외 region에서는 unmount (Intersection 기반)
- **glassmorphism**: 모바일에서는 backdrop-blur 비활성화 (CSS media query 또는 device check)
- **kinetic typo**: variable font 단일 파일 (woff2, subset)
- **이미지**: Next/Image + WebP/AVIF, 캐릭터 일러는 lazy + blurDataURL
- **Total Bundle**: 메인 페이지 < 250KB gzipped (Lighthouse 90+ 목표)

---

## 11. 디자인 결정 트레이드오프 / 안티-패턴

### ✅ DO

- Linear/Vercel 수준의 surface 조명 — pure neutrals 금지, 모든 카드 hue 1% 함유
- 6각형 모티프 일관 사용 (속성 아이콘, avatar frame, chip)
- Mono font로 모든 수치 표시 — 데미지/MV/% 통일
- 변수 폰트 single-file 사용으로 다양한 weight 부드럽게 전환
- 키보드 nav 우선 설계 (⌘K 명령 팔레트 포함)
- 다크 모드 우선 출시, 라이트 모드는 v2 (Linear/Raycast 패턴)

### ❌ DON'T

- 글래스모피즘 과용 — 네비/모달에만 사용 (Studiomeyer 권고)
- 캐릭터 풀 일러스트를 모든 카드에 — 부담스럽고 시각 노이즈
- 6각형 외에 다른 도형 (5각/7각 등) 혼용 — 일관성 깨짐
- 한 화면 액센트 컬러 3개 이상 — 시각 혼란
- 순수 #000 / #FFF — 차갑고 싸구려처럼 보임
- 거대한 hero 비디오 / 캐릭터 영상 자동재생 — 성능 + UX 악
- 무한 스크롤 — 데이터 도구이므로 명확한 페이지네이션 / 필터
- "Built with AI" 같은 진부한 마케팅 카피

---

## 12. 다음 액션 — 디자인 → 구현

### Phase A (1주차): Foundation
1. globals.css에 CSS 변수 시스템 적용
2. tailwind.config 토큰 통합
3. 폰트 페어링 검토 (Space Grotesk vs Inter Display 등 실 테스트)
4. 기본 컴포넌트 5개 작성: Button, BentoCard, ElementBadge, KineticNumber, GlowInput

### Phase B (2주차): Landing + Hero
1. ParticleField (R3F) 프로토타입
2. KineticTitle 컴포넌트
3. Featured Stats bento 구현
4. Resonance Ripple 클릭 인터랙션

### Phase C (3주차): Calculator
1. PartySlots 좌측 panel
2. DamageResult 중앙 KPI (Echo Pulse 애니메이션)
3. SkillBreakdown bar chart
4. ConcertoFlow SVG 시너지 라인

### Phase D (4주차): Character / Weapon / Party
1. Character browser (filter sticky + bento cards)
2. Character detail (split layout)
3. Weapon picker (5각 fan-out)
4. Party builder 통합

### Phase E (5주차): Polish
1. 페이지 전환 (View Transitions API)
2. ⌘K 명령 팔레트 (cmdk)
3. a11y 패스 (axe-core 자동 검증)
4. Lighthouse 90+ 튜닝

---

## 13. 참고 레퍼런스

### 디자인 시스템
- [Linear](https://linear.app) — 다크 surface ladder + accent
- [Raycast](https://raycast.com) — 단일 다크 모드 + 명령 팔레트
- [Vercel](https://vercel.com) — 미니멀 다크 + indigo accent
- [Arc Browser](https://arc.net) — 글로우 + 글래스

### 게임 UI
- 명조 인게임 UI — 6각형 모티프, 동심원 ripple, 속성 컬러
- HSR 공식 사이트 — 시네마틱 다크 + 캐릭터 일러스트 통합
- Genshin Impact 메뉴 — 파편화된 카드 레이아웃

### 2026 트렌드
- Bento Grid (Linear, Vercel admin templates)
- Glowmorphism (Huly)
- Kinetic Typography (variable fonts)
- Spatial 3D (Three.js + R3F)

### 영감받지 말 것
- wuthering.gg — 너무 평범한 light bg + 정보 나열
- prydwen.gg — 가이드형, 데이터 도구 부족
- 기존 WuWa 계산기들 — 기능만 있고 디자인 빈약

---

## 14. 한 페이지 컨셉 무드보드 (텍스트)

```
화면 진입 — 검은 해안의 부유물처럼 떠다니는 echo 입자
중앙에 6각형 logo가 동심원 ripple과 함께 페이드인
"WuCalc — Resonance Console" 글자가 자모 단위로 떠오름
하단 KPI: 49 / 104 / 911 / 100% — count-up + cyan glow pulse
배경에는 미세한 노이즈 그레인 + 한 줄의 사인파가 천천히 흐름
모든 것이 음파처럼 — 정적이지만 살아있는, 깊지만 가벼운, 게임 인포가 콘솔처럼.
```

---

**End of Brief.** 이제 이 문서를 바탕으로 Phase A부터 구현 시작.
