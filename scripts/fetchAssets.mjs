// scripts/fetchAssets.mjs
// 게임 원본 UI 에셋 다운로드 — encore.moe 리소스 프록시 사용
//
// 다운로드 대상:
//   public/images/characters/pile/{slug}.webp  — 풀바디 일러스트 (FormationRoleCard)
//   public/images/characters/head/{slug}.webp  — 256px 헤드 아이콘 (RoleHeadIconLarge)
//   public/images/weapons/{slug}.webp          — 무기 아이콘 (EN 명칭 매칭)
//
// 실행: node scripts/fetchAssets.mjs

import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const API = 'https://api.encore.moe';
const UA = { 'user-agent': 'Mozilla/5.0 (WuCalc asset fetcher)' };

/** 캐릭터 slug → 게임 role ID (Arikatsu 3.3 Textmaps 검증 매핑) */
const ROLE_IDS = {
  yangyang: 1402, chixia: 1202, verina: 1503, baizhi: 1103,
  sanhua: 1102, 'rover-spectro': 1501, encore: 1203, danjin: 1602,
  taoqi: 1601, aalto: 1403, jiyan: 1404, mortefi: 1204,
  camellya: 1603, calcharo: 1301, yinlin: 1302, yuanwu: 1303,
  'rover-havoc': 1604, lingyang: 1104, jianxin: 1405, jinhsi: 1304,
  changli: 1205, zhezhi: 1105, 'xiangli-yao': 1305, youhu: 1106,
  shorekeeper: 1505, lumi: 1504, roccia: 1606, carlotta: 1107,
  brant: 1206, phoebe: 1506, phrolova: 1608, cantarella: 1607,
  mornye: 1209, lupa: 1207, qiuyuan: 1411, cartethyia: 1409,
  'rover-aero': 1406, zani: 1507, ciaccona: 1407,
  iuno: 1410, augusta: 1306, galbrena: 1208,
  chisa: 1508, buling: 1307,
  lynae: 1509, aemeath: 1210, 'luuk-herssen': 1510, sigrika: 1412,
  hiyuki: 1108,
};

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

async function fetchJson(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function download(url, dest, { skipExisting = true } = {}) {
  if (skipExisting) {
    try { await access(dest); return 'skip'; } catch { /* not yet */ }
  }
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error(`too small (${buf.length}B) ${url}`);
  await writeFile(dest, buf);
  return `${(buf.length / 1024).toFixed(0)}KB`;
}

/** 동시 실행 제한 풀 */
async function pool(items, limit, worker) {
  const results = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await worker(items[idx], idx);
      }
    }),
  );
  return results;
}

async function main() {
  const pileDir = path.join(ROOT, 'public/images/characters/pile');
  const headDir = path.join(ROOT, 'public/images/characters/head');
  const weaponDir = path.join(ROOT, 'public/images/weapons');
  await Promise.all([pileDir, headDir, weaponDir].map((d) => mkdir(d, { recursive: true })));

  const failures = [];

  // ── 1. 캐릭터: pile + head ──
  const charEntries = Object.entries(ROLE_IDS);
  await pool(charEntries, 6, async ([slug, roleId]) => {
    try {
      const d = await fetchJson(`${API}/en/character/${roleId}`);
      const pile = d.FormationRoleCard;
      const head = d.RoleHeadIconLarge ?? d.RoleHeadIconCircle;
      if (pile) {
        const r = await download(pile, path.join(pileDir, `${slug}.webp`));
        console.log(`pile  ${slug} ${r}`);
      } else failures.push(`pile missing: ${slug}`);
      if (head) {
        const r = await download(head, path.join(headDir, `${slug}.webp`));
        console.log(`head  ${slug} ${r}`);
      } else failures.push(`head missing: ${slug}`);
    } catch (e) {
      failures.push(`char ${slug}: ${e.message}`);
    }
  });

  // ── 2. 무기: EN 명칭 매칭 ──
  const ourWeapons = JSON.parse(
    await readFile(path.join(ROOT, 'src/data/weapons.json'), 'utf8'),
  );
  const { weapons: apiWeapons } = await fetchJson(`${API}/en/weapon`);
  const byName = new Map(apiWeapons.map((w) => [norm(w.Name), w]));

  await pool(ourWeapons, 8, async (w) => {
    const hit = byName.get(norm(w.name.en));
    if (!hit?.Icon) {
      failures.push(`weapon unmatched: ${w.id} (${w.name.en})`);
      return;
    }
    try {
      const r = await download(hit.Icon, path.join(weaponDir, `${w.id}.webp`));
      console.log(`weap  ${w.id} ${r}`);
    } catch (e) {
      failures.push(`weapon ${w.id}: ${e.message}`);
    }
  });

  console.log('\n── 결과 ──');
  console.log(`실패/누락: ${failures.length}`);
  failures.forEach((f) => console.log('  ✗', f));
}

main().catch((e) => { console.error(e); process.exit(1); });
