// scripts/fetchTowerData.mjs
// 역경의 탑 현재 로테이션 데이터 갱신 — encore.moe /toa API
//
//   node scripts/fetchTowerData.mjs            # 현재 시즌 자동 선택
//   node scripts/fetchTowerData.mjs 37         # 특정 시즌
//
// 출력: src/data/enemies/tower.json 재생성 (스키마 v2)
//  - 층별 enemies/bossIds/buffs/targets/fatigueCost (한·영 공식 텍스트)
//  - 층별 적 레벨은 API 미제공 → level 필드 생략 (UI는 가정 레벨 사용)

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const API = 'https://api.encore.moe';
const UA = { 'user-agent': 'Mozilla/5.0 (WuCalc tower fetcher)' };

/** areaNum → 탑 메타 (1=잔향/좌, 2=심연/중앙, 3=울림/우) */
const AREA_META = {
  1: { id: 'resonant', position: 'left', zone: 'standard' },
  2: { id: 'hazard', position: 'center', zone: 'hazard' },
  3: { id: 'echoing', position: 'right', zone: 'standard' },
};
const ZONE_TIME_LIMIT = { standard: 240, hazard: 180 };

const stripHtml = (s) => s.replace(/<[^>]+>/g, '').trim();

async function fetchJson(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

/** season[area][floor][?][0] → entry */
function entryOf(season, area, floor) {
  const lvl3 = season[String(area)]?.[String(floor)];
  if (!lvl3) return null;
  const key = Object.keys(lvl3)[0];
  return lvl3[key]?.[0] ?? null;
}

async function main() {
  // 1. 시즌 결정
  const { seasons } = await fetchJson(`${API}/en/toa`);
  const argId = process.argv[2] ? Number(process.argv[2]) : null;
  const season =
    (argId != null ? seasons.find((s) => s.id === argId) : null) ??
    seasons.find((s) => s.current) ??
    seasons[seasons.length - 1];
  console.log(`시즌 ${season.id} (${season.start} ~ ${season.finish}, current=${season.current})`);

  // 2. 시즌 상세 (en + ko)
  const [enAll, koAll] = await Promise.all([
    fetchJson(`${API}/en/toa/${season.id}`),
    fetchJson(`${API}/ko/toa/${season.id}`),
  ]);
  const en = enAll[String(season.id)];
  const ko = koAll[String(season.id)];

  // 3. 보스 매칭용 인덱스
  const bosses = JSON.parse(
    await readFile(path.join(ROOT, 'src/data/enemies/bosses.json'), 'utf8'),
  );
  const bossByEn = new Map();
  for (const b of bosses) {
    bossByEn.set(b.name.en.toLowerCase(), b.id);
    // "Reminiscence: Fleurdelys" → "fleurdelys" 같은 접두사 별칭도 등록
    const colonIdx = b.name.en.indexOf(':');
    if (colonIdx !== -1) bossByEn.set(b.name.en.slice(colonIdx + 1).trim().toLowerCase(), b.id);
  }
  const unmatchedBosses = new Set();

  // 4. 탑 빌드
  const towers = [];
  for (const areaNum of [1, 2, 3]) {
    const meta = AREA_META[areaNum];
    const firstEn = entryOf(en, areaNum, 1);
    const firstKo = entryOf(ko, areaNum, 1);
    if (!firstEn || !firstKo) throw new Error(`area ${areaNum} 데이터 없음`);

    const floors = [];
    for (let f = 1; f <= 4; f++) {
      const e = entryOf(en, areaNum, f);
      const k = entryOf(ko, areaNum, f);
      if (!e || !k) continue;

      const enemies = [];
      const bossIds = [];
      e.monsters.forEach((m, i) => {
        const isBoss = /Overlord|Calamity|Boss/i.test(m.rarity?.desc ?? '');
        const matched = isBoss ? bossByEn.get(m.name.toLowerCase()) : undefined;
        if (matched) {
          bossIds.push(matched);
        } else {
          if (isBoss) unmatchedBosses.add(m.name);
          enemies.push({ ko: k.monsters[i]?.name ?? m.name, en: m.name });
        }
      });

      floors.push({
        floor: f,
        timeLimit: ZONE_TIME_LIMIT[meta.zone],
        fatigueCost: e.cost,
        enemies,
        bossIds,
        buffs: e.buffs.map((b, i) => ({
          ko: stripHtml(k.buffs[i]?.desc ?? ''),
          en: stripHtml(b.desc),
        })),
        // 인장 타깃: "남은 시간 X초 이상 클리어" — params[0] = 남은 시간(초)
        targets: e.targets.map((t) => ({ score: t.score, timeLeft: t.params?.[0] ?? 0 })),
      });
    }

    // 전 층 공통 버프 = 지역 간섭 (교집합), 없으면 1층 버프
    const floorBuffSets = floors.map((f) => new Set(f.buffs.map((b) => b.en)));
    const common = floors[0].buffs.filter((b) => floorBuffSets.every((s) => s.has(b.en)));
    const interferenceEffects = (common.length > 0 ? common : floors[0].buffs).slice(0, 4);

    towers.push({
      id: meta.id,
      name: { ko: firstKo.areaName, en: firstEn.areaName },
      position: meta.position,
      floors,
      interference: {
        name: { ko: '심경 간섭', en: 'Deep Realm Interference' },
        effects: interferenceEffects,
      },
    });
  }

  // 5. 기존 파일의 고정 메타(crestThresholds 등) 유지하며 재조립
  const prev = JSON.parse(
    await readFile(path.join(ROOT, 'src/data/enemies/tower.json'), 'utf8'),
  );
  const out = {
    name: prev.name,
    resetCycle: prev.resetCycle,
    seasonId: season.id,
    seasonStart: season.start,
    /** 다음 리셋 날짜 (= 현재 시즌 종료일) */
    currentResetDate: season.finish,
    zones: {
      hazard: {
        name: prev.zones.hazard.name,
        towers,
      },
    },
    crestThresholds: prev.crestThresholds,
  };

  await writeFile(
    path.join(ROOT, 'src/data/enemies/tower.json'),
    JSON.stringify(out, null, 2) + '\n',
  );

  console.log(`tower.json 갱신 완료 — 탑 ${towers.length}개, 층 ${towers.reduce((s, t) => s + t.floors.length, 0)}개`);
  if (unmatchedBosses.size > 0) {
    console.log(`⚠ bosses.json 미등록 보스 (enemies로 분류): ${[...unmatchedBosses].join(', ')}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
