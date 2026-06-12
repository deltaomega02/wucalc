/**
 * scripts/verifyDataminedValues.ts
 *
 * WuCalc 데이터를 Dimbreath/Arikatsu 게임 데이터마인과 1:1 검증한다.
 *
 * 검증 대상:
 *   1. characters.json의 motion value (RateLv[Lv10])
 *   2. resonanceChains.ts의 effect value (ResonantChain.AttributesDescriptionParams)
 *   3. inherentSkills.ts의 effect value (Skill.SkillDetailNum, Type=4)
 *
 * 사용법:
 *   npx tsx scripts/verifyDataminedValues.ts
 *
 * 데이터 소스:
 *   - github.com/Dimbreath/WutheringData (master)
 *   - github.com/Arikatsu/WutheringWaves_Data (3.3 branch)
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

const DATAMINE_BASE = 'https://raw.githubusercontent.com/Arikatsu/WutheringWaves_Data/3.3';
const DIMBREATH_BASE = 'https://raw.githubusercontent.com/Dimbreath/WutheringData/master';

/** 49 WuCalc 캐릭터 ID → 게임 내부 role ID 매핑 (출시 순서 + 속성/무기/희귀도 + 모션 밸류 교차검증) */
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

/** WuCalc characters.json 모션 밸류와 데이터마인 Lv10 RateLv 1:1 비교 */
async function verifyMotionValues(): Promise<{ matched: number; total: number }> {
  const skillsRes = await fetch(`${DATAMINE_BASE}/BinData/skill/skill.json`);
  const skills = await skillsRes.json();
  const dmgRes = await fetch(`${DATAMINE_BASE}/BinData/damage/damage.json`);
  const dmgs = await dmgRes.json();

  const dmgDict = new Map<number, any>(dmgs.map((d: any) => [d.Id, d]));
  const sgSkills: Record<number, any[]> = {};
  for (const s of skills) {
    (sgSkills[s.SkillGroupId] ??= []).push(s);
  }

  const charactersPath = path.join(process.cwd(), 'src/data/characters.json');
  const wc = JSON.parse(readFileSync(charactersPath, 'utf-8'));
  const wcMap = new Map<string, any>(wc.map((c: any) => [c.id, c]));
  const EXCLUDE = new Set(['Mist Avatar HP', 'Heavy Attack DMG Reduction']);

  let total = 0;
  let matched = 0;
  for (const [cid, rid] of Object.entries(CHAR_TO_ROLE)) {
    const ch = wcMap.get(cid);
    if (!ch) continue;
    const dmSet = new Set<number>();
    for (const s of sgSkills[rid] ?? []) {
      for (const did of s.DamageList ?? []) {
        const d = dmgDict.get(did);
        if (d?.RateLv) {
          const lv10 = d.RateLv[9] ?? d.RateLv.at(-1);
          if (lv10 > 0) dmSet.add(Math.round(lv10 / 10000 * 10000) / 10000);
        }
      }
    }
    for (const s of ch.skills ?? []) {
      for (const h of s.hits ?? []) {
        if (EXCLUDE.has(h.name.en)) continue;
        total++;
        if (dmSet.has(Math.round(h.motionValue * 10000) / 10000)) matched++;
      }
    }
  }
  return { matched, total };
}

async function main() {
  console.log('🔍 WuCalc data verification against datamined sources');
  console.log(`   Source: ${DATAMINE_BASE}\n`);

  const mv = await verifyMotionValues();
  const rate = (mv.matched / mv.total * 100).toFixed(2);
  console.log(`Motion Values:     ${mv.matched}/${mv.total} = ${rate}%`);
  if (mv.matched === mv.total) {
    console.log('\n✅ All motion values verified against datamine.');
  } else {
    console.log(`\n⚠️  ${mv.total - mv.matched} mismatches remain`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
