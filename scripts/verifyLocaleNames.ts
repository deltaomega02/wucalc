/**
 * scripts/verifyLocaleNames.ts
 *
 * WuCalc의 모든 한·영 명칭을 게임 공식 TextMap(데이터마인)과 1:1 대조한다.
 * "직접 번역 금지 — 1차 공식 출처" 원칙의 자동 검증 도구.
 *
 * 검증 대상:
 *   1. characters.json — 49캐릭터 이름 (RoleInfo_{roleId}_Name 정밀 대조)
 *   2. weapons.json — 무기 이름 (WeaponConf_*_WeaponName 역매칭)
 *   3. echoes/sets.json — 에코 세트 이름 (EN 콘텐츠 역매칭)
 *   4. characters.json — 스킬 이름 (EN 콘텐츠 역매칭, 정보성)
 *
 * 데이터 소스: github.com/Arikatsu/WutheringWaves_Data (3.3 branch) Textmaps
 *
 * 사용법:
 *   npx tsx scripts/verifyLocaleNames.ts
 *   TEXTMAP_CACHE_DIR=/tmp npx tsx scripts/verifyLocaleNames.ts  # 로컬 캐시 사용
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const BASE = 'https://raw.githubusercontent.com/Arikatsu/WutheringWaves_Data/3.3/Textmaps';

/** WuCalc 캐릭터 ID → 게임 내부 role ID (verifyDataminedValues.ts와 동일 매핑) */
const CHAR_TO_ROLE: Record<string, number> = {
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

interface TextEntry {
  Id: string;
  Content: string;
}

type LocalizedName = { ko: string; en: string };

async function loadTextmap(locale: 'ko' | 'en'): Promise<Map<string, string>> {
  const cacheDir = process.env.TEXTMAP_CACHE_DIR;
  let raw: string;
  const cachePath = cacheDir && path.join(cacheDir, `MultiText33.${locale}.json`);
  if (cachePath && existsSync(cachePath)) {
    console.log(`   (cache) ${cachePath}`);
    raw = readFileSync(cachePath, 'utf-8');
  } else {
    const url = `${BASE}/${locale}/multi_text/MultiText.json`;
    console.log(`   (fetch) ${url}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`textmap fetch 실패: ${locale} ${res.status}`);
    raw = await res.text();
  }
  const entries: TextEntry[] = JSON.parse(raw);
  return new Map(entries.map((e) => [e.Id, e.Content]));
}

/** EN 텍스트 → 해당 콘텐츠를 가진 모든 textmap Id (역매칭 인덱스) */
function buildReverseIndex(en: Map<string, string>): Map<string, string[]> {
  const idx = new Map<string, string[]>();
  for (const [id, content] of en) {
    const list = idx.get(content);
    if (list) list.push(id);
    else idx.set(content, [id]);
  }
  return idx;
}

interface Issue {
  category: string;
  id: string;
  detail: string;
}

async function main() {
  console.log('🔍 한·영 공식 명칭 검증 (Arikatsu 3.3 Textmaps)\n');
  const [ko, en] = await Promise.all([loadTextmap('ko'), loadTextmap('en')]);
  console.log(`   ko ${ko.size.toLocaleString()} entries / en ${en.size.toLocaleString()} entries\n`);
  const reverse = buildReverseIndex(en);

  const issues: Issue[] = [];
  const root = process.cwd();
  const characters = JSON.parse(readFileSync(path.join(root, 'src/data/characters.json'), 'utf-8'));
  const weapons = JSON.parse(readFileSync(path.join(root, 'src/data/weapons.json'), 'utf-8'));
  const sets = JSON.parse(readFileSync(path.join(root, 'src/data/echoes/sets.json'), 'utf-8'));

  /* ── 1. 캐릭터 이름 — role ID 정밀 대조 ── */
  let charOk = 0;
  for (const c of characters as { id: string; name: LocalizedName }[]) {
    const roleId = CHAR_TO_ROLE[c.id];
    if (!roleId) {
      issues.push({ category: 'character', id: c.id, detail: 'role ID 매핑 없음' });
      continue;
    }
    const key = `RoleInfo_${roleId}_Name`;
    const offKo = ko.get(key);
    const offEn = en.get(key);
    if (offKo === undefined || offEn === undefined) {
      issues.push({ category: 'character', id: c.id, detail: `textmap에 ${key} 없음` });
      continue;
    }
    const koOk = offKo === c.name.ko;
    const enOk = offEn === c.name.en;
    if (koOk && enOk) charOk++;
    else
      issues.push({
        category: 'character',
        id: c.id,
        detail: `우리("${c.name.ko}"/"${c.name.en}") vs 공식("${offKo}"/"${offEn}")`,
      });
  }
  console.log(`캐릭터 이름:   ${charOk}/${characters.length} 공식 일치`);

  /* ── 2. 무기 이름 — WeaponConf 역매칭 ── */
  const weaponKeyRe = /^WeaponConf_\d+_WeaponName$/;
  let weaponOk = 0;
  for (const w of weapons as { id: string; name: LocalizedName }[]) {
    const ids = (reverse.get(w.name.en) ?? []).filter((id) => weaponKeyRe.test(id));
    if (ids.length === 0) {
      issues.push({ category: 'weapon', id: w.id, detail: `EN명 "${w.name.en}" 공식 무기 텍스트에 없음` });
      continue;
    }
    const koMatch = ids.some((id) => ko.get(id) === w.name.ko);
    if (koMatch) weaponOk++;
    else
      issues.push({
        category: 'weapon',
        id: w.id,
        detail: `KO명 "${w.name.ko}" ≠ 공식 "${ids.map((id) => ko.get(id)).join('|')}"`,
      });
  }
  console.log(`무기 이름:     ${weaponOk}/${weapons.length} 공식 일치`);

  /* ── 3. 에코 세트 이름 — 역매칭 ── */
  let setOk = 0;
  for (const s of sets as { id: string; name: LocalizedName }[]) {
    const ids = reverse.get(s.name.en) ?? [];
    if (ids.length === 0) {
      issues.push({ category: 'echo-set', id: s.id, detail: `EN명 "${s.name.en}" 공식 텍스트에 없음` });
      continue;
    }
    const koMatch = ids.some((id) => ko.get(id) === s.name.ko);
    if (koMatch) setOk++;
    else
      issues.push({
        category: 'echo-set',
        id: s.id,
        detail: `KO명 "${s.name.ko}" ≠ 공식 "${[...new Set(ids.map((id) => ko.get(id)))].join('|')}"`,
      });
  }
  console.log(`에코 세트:     ${setOk}/${sets.length} 공식 일치`);

  /* ── 4. 스킬 이름 — 역매칭 (정보성: 게임 외 명칭은 별도 검토) ── */
  let skillOk = 0;
  let skillTotal = 0;
  const skillIssues: Issue[] = [];
  for (const c of characters as { id: string; skills?: { id: string; name: LocalizedName }[] }[]) {
    for (const sk of c.skills ?? []) {
      skillTotal++;
      const ids = reverse.get(sk.name.en) ?? [];
      if (ids.length === 0) {
        skillIssues.push({ category: 'skill', id: sk.id, detail: `EN명 "${sk.name.en}" 미발견` });
        continue;
      }
      const koMatch = ids.some((id) => ko.get(id) === sk.name.ko);
      if (koMatch) skillOk++;
      else
        skillIssues.push({
          category: 'skill',
          id: sk.id,
          detail: `KO "${sk.name.ko}" ≠ 공식 "${[...new Set(ids.map((id) => ko.get(id)))].slice(0, 3).join('|')}"`,
        });
    }
  }
  console.log(`스킬 이름:     ${skillOk}/${skillTotal} 공식 일치 (역매칭)`);

  /* ── 결과 ── */
  console.log('\n=== 핵심 불일치 (캐릭터/무기/에코 세트) ===');
  if (issues.length === 0) console.log('없음 ✅');
  for (const i of issues) console.log(`  [${i.category}] ${i.id}: ${i.detail}`);

  if (skillIssues.length > 0) {
    console.log(`\n=== 스킬 이름 검토 필요 (${skillIssues.length}건) ===`);
    for (const i of skillIssues.slice(0, 40)) console.log(`  [${i.category}] ${i.id}: ${i.detail}`);
    if (skillIssues.length > 40) console.log(`  ... 외 ${skillIssues.length - 40}건`);
  }

  if (issues.length > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
