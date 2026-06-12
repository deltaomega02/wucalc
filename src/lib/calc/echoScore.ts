// src/lib/calc/echoScore.ts
// 에코 점수 + 상위 % 추정 (재미 지표)
//
// 점수(결정적): 딜러 표준 가중치 × (서브옵 값 / 해당 옵션 최대 티어)의 합을
//   이론상 최강 에코(가중치 상위 5옵션 전부 최대 티어) 대비 0~100으로 정규화.
//
// 상위 %(추정): 랜덤 +25 에코를 몬테카를로로 뽑아 점수 분포를 만들고
//   그 안에서의 순위. ⚠ 인게임 실제 출현 확률은 1차 출처 미확보 —
//   "서브옵션 13종 균등 선택(중복 없음) + 티어 균등" 가정임을 UI에 명시한다.

import type { StatType } from '@/types/game';
import type { EchoSlot } from '@/stores/buildStore';
import { subStatTiers, getSubStatTiers } from '@/data';

/** 딜러 표준 가중치 — 크리 풀가중, 공%/딜보너스 차등, 방어계 0 */
export const ECHO_SCORE_WEIGHTS: Partial<Record<StatType, number>> = {
  critRate: 1.0,
  critDmg: 1.0,
  atkPercent: 0.75,
  skillDmgBonus: 0.45,
  liberationDmgBonus: 0.45,
  heavyDmgBonus: 0.45,
  normalDmgBonus: 0.45,
  energyRegen: 0.35,
  atk: 0.3,
  // hp/def 계열은 0 (딜 기준)
};

/** 서브옵 풀 — subStats.json에 등록된 전 타입 */
const SUB_POOL: StatType[] = subStatTiers.map((s) => s.type as StatType);

/** 이론상 최강 에코의 원점수 (가중치 상위 5옵션 × 최대 티어) */
const MAX_RAW = Object.values(ECHO_SCORE_WEIGHTS)
  .sort((a, b) => b - a)
  .slice(0, 5)
  .reduce((s, w) => s + w, 0);

/** 단일 에코 원점수 (0 ~ MAX_RAW) */
function rawScore(subStats: { type: StatType | ''; value: number }[]): number {
  let s = 0;
  for (const sub of subStats) {
    if (!sub.type) continue;
    const w = ECHO_SCORE_WEIGHTS[sub.type] ?? 0;
    if (w === 0) continue;
    const tiers = getSubStatTiers(sub.type);
    const max = tiers[tiers.length - 1] ?? 0;
    if (max > 0) s += w * Math.min(1.2, sub.value / max);
  }
  return s;
}

/** 단일 에코 점수 0~100 */
export function scoreEcho(slot: Pick<EchoSlot, 'subStats'>): number {
  return (rawScore(slot.subStats) / MAX_RAW) * 100;
}

// ── 몬테카를로 분포 (균등 가정) ──

type Rng = () => number;
const SAMPLES = 20000;

function sampleEchoScore(rng: Rng): number {
  // 13종에서 중복 없이 5개 선택 (균등), 티어 균등
  const pool = [...SUB_POOL];
  let s = 0;
  for (let k = 0; k < 5; k++) {
    const idx = Math.floor(rng() * pool.length);
    const type = pool.splice(idx, 1)[0];
    const w = ECHO_SCORE_WEIGHTS[type] ?? 0;
    if (w === 0) continue;
    const tiers = getSubStatTiers(type);
    const tier = tiers[Math.floor(rng() * tiers.length)] ?? 0;
    const max = tiers[tiers.length - 1] ?? 1;
    s += w * (tier / max);
  }
  return (s / MAX_RAW) * 100;
}

let singleDist: Float64Array | null = null;
let buildDist: Float64Array | null = null;

/** 분포 생성 (테스트용으로 rng 주입 가능) */
export function buildDistributions(rng: Rng = Math.random) {
  const single = new Float64Array(SAMPLES);
  for (let i = 0; i < SAMPLES; i++) single[i] = sampleEchoScore(rng);
  single.sort();

  const build = new Float64Array(SAMPLES);
  for (let i = 0; i < SAMPLES; i++) {
    let sum = 0;
    for (let j = 0; j < 5; j++) sum += sampleEchoScore(rng);
    build[i] = sum;
  }
  build.sort();

  singleDist = single;
  buildDist = build;
}

function ensureDist() {
  if (!singleDist || !buildDist) buildDistributions();
}

/** 정렬 배열에서 "상위 %" (score 이상인 비율) */
function topPercent(sorted: Float64Array, score: number): number {
  // 이분 탐색: score 미만 개수
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < score) lo = mid + 1;
    else hi = mid;
  }
  const above = sorted.length - lo;
  return Math.max(0.1, (above / sorted.length) * 100);
}

/** 단일 에코 상위 % (균등 가정 추정) */
export function echoTopPercent(score: number): number {
  ensureDist();
  return topPercent(singleDist!, score);
}

/** 5에코 종합 상위 % (균등 가정 추정) */
export function buildTopPercent(totalScore: number): number {
  ensureDist();
  return topPercent(buildDist!, totalScore);
}

/** 상위 % 등급 색 (5% 골드 / 20% 퍼플 / 50% 청록 / 나머지 회색) */
export function topPercentTone(pct: number): 'gold' | 'purple' | 'cyan' | 'muted' {
  if (pct <= 5) return 'gold';
  if (pct <= 20) return 'purple';
  if (pct <= 50) return 'cyan';
  return 'muted';
}
