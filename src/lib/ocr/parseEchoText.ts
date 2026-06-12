// src/lib/ocr/parseEchoText.ts
import type { StatType, EchoCost } from '@/types/game';
import type { EchoSlot } from '@/stores/buildStore';

/**
 * 인게임 한국어/영어 스탯명 → StatType 매핑
 *
 * 우선순위: 정확한 인게임 표기 → 커뮤니티 약어 → 영어
 * 주의: "공격력"은 flat ATK, "공격력%"는 ATK% — % 유무로 구분
 */
const STAT_PATTERNS: {
  patterns: RegExp[];
  type: StatType;
  flat?: boolean;
}[] = [
  // ── 크리티컬 (% 스탯) — OCR 오타 내성: 컬/칼, 률/율/룔, 해/헤 ──
  // 순서 중요: 피해를 먼저 검사해야 인게임 단독 표기 "크리티컬"(=크리확)과 구분된다
  {
    patterns: [/크리[^%\n]{0,4}피[해헤]/i, /치피/i, /crit\.?\s*d(a?mg|amage)/i],
    type: 'critDmg',
  },
  {
    // 인게임 에코 패널은 크리확을 "크리티컬"로만 표기한다 (확률 생략)
    patterns: [/크리[^%\n]{0,4}확[률율룔]/i, /크리티[컬칼](?!\s*피[해헤])/i, /치확/i, /crit\.?\s*rate/i],
    type: 'critRate',
  },

  // ── 공격력 (% vs flat 구분은 값 파싱에서 처리) ──
  {
    patterns: [/공격력\s*%/i, /atk\s*%/i],
    type: 'atkPercent',
  },
  {
    // ^[^가-힣]*: 일러스트 조각 노이즈("1 공격력 40")는 허용,
    // 설명문("자신의 공격력이...")은 한글 선행이라 차단
    patterns: [/^[^가-힣]*공격력(?!\s*%)/i, /^[^가-힣]*atk(?!\s*%)/i],
    type: 'atk',
    flat: true,
  },

  // ── HP (인게임에서 영문 HP 사용) ──
  {
    patterns: [/HP\s*%/i, /체력\s*%/i],
    type: 'hpPercent',
  },
  {
    patterns: [/^[^가-힣]*HP(?!\s*%)/i, /^[^가-힣]*체력(?!\s*%)/i],
    type: 'hp',
    flat: true,
  },

  // ── 방어력 ──
  {
    patterns: [/방어력\s*%/i, /def\s*%/i],
    type: 'defPercent',
  },
  {
    patterns: [/^[^가-힣]*방어력(?!\s*%)/i, /^[^가-힣]*def(?!\s*%)/i],
    type: 'def',
    flat: true,
  },

  // ── 공명 효율 (에너지 충전) ──
  {
    patterns: [/공명[^%\n]{0,3}효[율률룔]/i, /에너지\s*충전/i, /energy\s*regen/i],
    type: 'energyRegen',
  },

  // ── 치유 (메인: 치료 효과 보너스 / 서브: 치유 효율) ──
  {
    patterns: [/치료\s*효과\s*보너스/i, /치유\s*효율/i, /치유\s*보너스/i, /healing\s*bonus/i],
    type: 'healingBonus',
  },

  // ── 속성 피해 보너스 ──
  {
    patterns: [/용융\s*피해\s*보너스/i, /fusion\s*dmg/i],
    type: 'fusionDmgBonus',
  },
  {
    patterns: [/응결\s*피해\s*보너스/i, /glacio\s*dmg/i],
    type: 'glacioDmgBonus',
  },
  {
    patterns: [/기류\s*피해\s*보너스/i, /aero\s*dmg/i],
    type: 'aeroDmgBonus',
  },
  {
    patterns: [/전도\s*피해\s*보너스/i, /electro\s*dmg/i],
    type: 'electroDmgBonus',
  },
  {
    patterns: [/인멸\s*피해\s*보너스/i, /havoc\s*dmg/i],
    type: 'havocDmgBonus',
  },
  {
    patterns: [/회절\s*피해\s*보너스/i, /spectro\s*dmg/i],
    type: 'spectroDmgBonus',
  },

  // ── 공격 타입 보너스 (서브옵) ──
  {
    patterns: [/기본\s*공격\s*보너스/i, /일반\s*공격\s*보너스/i, /basic\s*attack\s*dmg/i, /normal\s*attack\s*dmg/i],
    type: 'normalDmgBonus',
  },
  {
    patterns: [/강\s*공격\s*보너스/i, /heavy\s*attack\s*dmg/i],
    type: 'heavyDmgBonus',
  },
  {
    patterns: [/공명\s*스킬\s*보너스/i, /공명스킬\s*보너스/i, /resonance\s*skill\s*dmg/i, /skill\s*dmg\s*bonus/i],
    type: 'skillDmgBonus',
  },
  {
    patterns: [/공명\s*해방\s*보너스/i, /공명해방\s*보너스/i, /resonance\s*liberation\s*dmg/i, /liberation\s*dmg/i],
    type: 'liberationDmgBonus',
  },
];

interface ParsedStat {
  type: StatType;
  value: number;
  isFlat: boolean;
}

/**
 * OCR 텍스트 한 줄에서 스탯 추출
 *
 * "크리티컬 확률 +22.0%" → { type: 'critRate', value: 0.22, isFlat: false }
 * "공격력 +150" → { type: 'atk', value: 150, isFlat: true }
 */
/** OCR 출력 정규화 — 선행 장식(+·불릿), 전각 기호, 소수점 콤마(22,0% → 22.0%) */
function normalizeLine(line: string): string {
  return line
    .replace(/^[+＋·•※*\-—\s]+/, '') // 인게임 서브옵 "+ HP 320"의 + 접두사 제거 (^ 앵커 패턴 보호)
    .replace(/％/g, '%')
    .replace(/[．]/g, '.')
    .replace(/(\d),(\d{1,2})(?!\d)/g, '$1.$2'); // 콤마 소수점 (천단위 2,280은 보존)
}

function parseStatLine(rawLine: string): ParsedStat | null {
  const trimmed = normalizeLine(rawLine.trim());
  if (!trimmed || trimmed.length < 3) return null;

  // 숫자 추출 — **마지막** 숫자 토큰을 값으로 쓴다.
  // 인게임 패널은 [이름 ... 값] 우측 정렬이라 값이 항상 마지막이고,
  // 일러스트 조각이 행 앞에 "1 공격력 40" 같은 노이즈 숫자를 끼워넣는다 (실캡처 실측)
  const numMatches = [...trimmed.matchAll(/\+?\s*([\d,]+\.?\d*)\s*(%)?/g)].filter(
    (m) => {
      const v = parseFloat(m[1].replace(/,/g, ''));
      return !isNaN(v) && v > 0;
    },
  );
  const numMatch = numMatches[numMatches.length - 1];
  if (!numMatch) return null;

  const rawValue = parseFloat(numMatch[1].replace(/,/g, ''));
  if (rawValue <= 0 || isNaN(rawValue)) return null;

  const hasPercent = numMatch[2] === '%';

  // 스탯 타입 매칭 — OCR이 한글을 글자별 단어로 쪼개는 경우("공 격 력 40")를 위해
  // 공백 압축 변형도 함께 검사한다
  const compact = trimmed.replace(/\s+/g, '');
  for (const { patterns, type, flat } of STAT_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(trimmed) || pattern.test(compact)) {
        // flat 스탯인데 %가 붙어있으면 percent 버전으로 전환
        if (flat && hasPercent) {
          const percentType = type === 'atk' ? 'atkPercent'
            : type === 'hp' ? 'hpPercent'
            : type === 'def' ? 'defPercent'
            : type;
          return { type: percentType, value: fixPercent(rawValue) / 100, isFlat: false };
        }

        return {
          type,
          value: flat ? rawValue : fixPercent(rawValue) / 100,
          isFlat: flat ?? false,
        };
      }
    }
  }

  return null;
}

/**
 * 소수점 누락 보정 — OCR이 "22.0"의 점을 놓쳐 "220"으로 읽는 사례.
 * 게임 내 % 스탯은 65%를 넘을 수 없으므로 그 위면 10으로 나눠 복원.
 */
function fixPercent(v: number): number {
  let out = v;
  while (out > 65) out /= 10;
  return out;
}

/**
 * 코스트 추출
 *
 * 에코 화면에서 코스트는 보통 아이콘 옆에 숫자로 표시됨
 */
function parseCost(text: string): EchoCost | null {
  // (?!\d): "COST 12/12"(보유 코스트 게이지)의 1을 코스트로 오인하지 않도록
  const re = /(?:cost|코스트)\s*[:：]?\s*([134])(?!\d)|([134])(?!\d)\s*(?:cost|코스트)/gi;
  for (const match of text.matchAll(re)) {
    const v = parseInt(match[1] || match[2]);
    if (v === 4 || v === 3 || v === 1) return v as EchoCost;
  }
  return null;
}

/**
 * OCR 텍스트 전체에서 에코 데이터를 추출
 *
 * 에코 상세 화면 레이아웃:
 * 1. 에코 이름 (번개 메피스 등)
 * 2. 메인 스탯 (선택 메인 + 고정 보조)
 * 3. 서브 스탯 (최대 5줄)
 */
function assembleEcho(allStats: ParsedStat[], explicitCost: EchoCost | null): Partial<EchoSlot> {
  if (allStats.length === 0) {
    return explicitCost ? { cost: explicitCost } : {};
  }

  // 메인 스탯 추정: 에코 패널에서 메인이 가장 먼저 표시됨
  const mainStat = allStats[0];

  // 고정 보조 메인 스탯 필터링 (flat ATK 100/150이나 flat HP 2280 등)
  const subStats = allStats.slice(1).filter((s) => {
    if (s.isFlat && s.type === 'atk' && s.value >= 100) return false;
    if (s.isFlat && s.type === 'hp' && s.value >= 1000) return false;
    return true;
  });

  // 코스트 추정: 고정 보조가 flat ATK면 3/4코스트, flat HP면 1코스트
  let inferredCost = explicitCost;
  if (!inferredCost) {
    const hasLargeAtk = allStats.some((s) => s.isFlat && s.type === 'atk' && s.value >= 100);
    const hasLargeHp = allStats.some((s) => s.isFlat && s.type === 'hp' && s.value >= 1000);
    if (hasLargeHp) inferredCost = 1;
    else if (hasLargeAtk) inferredCost = 4;
    else inferredCost = 4;
  }

  return {
    cost: inferredCost,
    mainStatType: mainStat.type,
    mainStatValue: mainStat.value,
    subStats: [
      ...subStats.slice(0, 5).map((s) => ({ type: s.type, value: s.value })),
      ...Array(Math.max(0, 5 - subStats.length)).fill({ type: '' as const, value: 0 }),
    ].slice(0, 5),
  };
}

export function parseEchoFromText(ocrText: string): Partial<EchoSlot> {
  const lines = ocrText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const allStats: ParsedStat[] = [];
  for (const line of lines) {
    const stat = parseStatLine(line);
    if (stat) allStats.push(stat);
  }
  return assembleEcho(allStats, parseCost(ocrText));
}

/** 좌표 있는 OCR 라인 (tesseract blocks 출력) */
export interface OcrLine {
  text: string;
  x0: number;
  y0: number;
}

/** 좌표 있는 OCR 단어 */
export interface OcrWord {
  text: string;
  x0: number;
  y0: number;
  y1: number;
}

/**
 * 단어들을 y 좌표로 행 클러스터링 → 행 텍스트 재구성.
 * tesseract가 좌/우 컬럼을 한 줄로 병합해도 단어 bbox는 정확하므로
 * 컬럼 분리 후 우리가 직접 행을 만든다.
 */
function buildRows(words: OcrWord[]): OcrLine[] {
  if (words.length === 0) return [];
  const sorted = [...words].sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
  const heights = sorted.map((w) => w.y1 - w.y0).sort((a, b) => a - b);
  const tol = Math.max(6, (heights[heights.length >> 1] || 20) * 0.7);

  const rows: OcrWord[][] = [];
  for (const w of sorted) {
    const last = rows[rows.length - 1];
    if (last && Math.abs(w.y0 - last[0].y0) <= tol) last.push(w);
    else rows.push([w]);
  }
  return rows.map((row) => {
    const byX = row.sort((a, b) => a.x0 - b.x0);
    return {
      text: byX.map((w) => w.text).join(' '),
      x0: byX[0].x0,
      y0: byX[0].y0,
    };
  });
}

/**
 * 전체 화면 스크린샷 대응 v2 — 단어 좌표 기반.
 * 좌/우 절반의 단어로 각각 행을 재구성하고, 스탯 행이 많은 쪽을 선택한 뒤
 * 그 컬럼의 최장 연속 스탯 블록을 에코 패널로 간주한다.
 *
 * singleColumn: 이미 패널만 크롭된 이미지 — 좌/우 분리를 건너뛴다
 * (크롭 좌표계에서는 스탯명이 좌측, 값이 우측이라 분리하면 행이 깨진다)
 */
export function parseEchoFromWords(
  words: OcrWord[],
  imageWidth: number,
  options?: { singleColumn?: boolean },
): Partial<EchoSlot> {
  if (options?.singleColumn) {
    return extractFromRows(buildRows(words), words.map((w) => w.text).join(' '));
  }

  const mid = imageWidth / 2;
  const leftRows = buildRows(words.filter((w) => w.x0 < mid));
  const rightRows = buildRows(words.filter((w) => w.x0 >= mid));

  const statCount = (rows: OcrLine[]) =>
    rows.filter((r) => parseStatLine(r.text) !== null).length;
  const chosen = statCount(rightRows) >= statCount(leftRows) ? rightRows : leftRows;

  return extractFromRows(chosen, words.map((w) => w.text).join(' '));
}

/**
 * 1차 인식 단어들에서 스탯 패널로 추정되는 영역(bbox)을 찾는다.
 * 크롭-줌 2차 패스용 — 스탯 키워드/수치가 몰린 컬럼의 경계를 돌려준다.
 */
export function findStatRegion(
  words: { text: string; x0: number; x1: number; y0: number; y1: number }[],
  imageWidth: number,
): { x: number; y: number; w: number; h: number } | null {
  const KEYWORD = /크리|피해|공격|효율|공명|보너스|HP|COST|\d+\.?\d*%/i;
  const hits = words.filter((w) => KEYWORD.test(w.text));
  if (hits.length < 3) return null;

  // 키워드 다수결 컬럼
  const mid = imageWidth / 2;
  const rightHits = hits.filter((w) => w.x0 >= mid);
  const side = rightHits.length >= hits.length - rightHits.length ? rightHits : hits.filter((w) => w.x0 < mid);
  if (side.length < 3) return null;

  const x0 = Math.min(...side.map((w) => w.x0));
  const x1 = Math.max(...side.map((w) => w.x1));
  const y0 = Math.min(...side.map((w) => w.y0));
  const y1 = Math.max(...side.map((w) => w.y1));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/**
 * 전체 화면 스크린샷 대응 — 좌표 기반 추출.
 *
 * 1. 스탯으로 파싱되는 라인들이 좌/우 어느 컬럼에 몰려 있는지 판단
 *    (에코 관리 화면은 좌측 그리드 노이즈 + 우측 스탯 패널 구조)
 * 2. 그 컬럼 안에서 y 순으로 정렬 후, "연속된 스탯 라인 블록"(갭 1 허용) 중
 *    가장 긴 것을 스탯 패널로 간주 — 하단 어빌리티/화음 설명문이 자연 차단됨
 * 3. 코스트는 선택 컬럼에서 우선 탐색, 없으면 전체 텍스트
 */
export function parseEchoFromLines(lines: OcrLine[], imageWidth: number): Partial<EchoSlot> {
  const parsed = lines.filter((l) => l.text.trim().length > 0);
  const statLines = parsed.filter((p) => parseStatLine(p.text) !== null);
  if (statLines.length === 0) return {};

  // 컬럼 선택 — 스탯 라인 다수결
  const mid = imageWidth / 2;
  const rightCount = statLines.filter((p) => p.x0 >= mid).length;
  const useRight = rightCount >= statLines.length - rightCount;
  const column = parsed.filter((p) => (useRight ? p.x0 >= mid : p.x0 < mid));

  return extractFromRows(column, lines.map((l) => l.text).join('\n'));
}

/**
 * 노이즈 행 필터 — 캐릭터 일러스트 조각이 OCR로 변한 쓰레기 행("/ =", "A) \")을
 * 런 계산에서 제외한다. 한글/퍼센트/두 자리 이상 숫자/HP·COST가 없으면 노이즈.
 */
function isMeaningfulRow(text: string): boolean {
  return /[가-힣]|%|\d{2,}|HP|COST/i.test(text);
}

const RUN_GAP_TOLERANCE = 2;

/** 선택된 컬럼의 행들에서: 최장 연속 스탯 블록(갭 2 허용) → 에코 조립 */
function extractFromRows(rows: OcrLine[], fallbackCostText: string): Partial<EchoSlot> {
  const sorted = [...rows]
    .sort((a, b) => a.y0 - b.y0)
    .filter((r) => isMeaningfulRow(r.text));

  let best: ParsedStat[] = [];
  let current: ParsedStat[] = [];
  let gap = 0;
  for (const row of sorted) {
    const stat = parseStatLine(row.text);
    if (stat) {
      current.push(stat);
      gap = 0;
    } else if (current.length > 0) {
      gap++;
      if (gap > RUN_GAP_TOLERANCE) {
        if (current.length > best.length) best = current;
        current = [];
        gap = 0;
      }
    }
  }
  if (current.length > best.length) best = current;

  const cost =
    parseCost(sorted.map((r) => r.text).join('\n')) ?? parseCost(fallbackCostText);
  return assembleEcho(best, cost);
}
