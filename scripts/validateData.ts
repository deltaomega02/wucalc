// scripts/validateData.ts
/**
 * 게임 데이터 정합성 검증 스크립트.
 *
 * - characters.json, weapons.json, echoes/*.json을 읽어
 *   타입/값/참조 무결성을 검증한다.
 * - 비정상 데이터를 발견하면 비-제로 종료 코드로 종료한다.
 *
 * 실행: `npx tsx scripts/validateData.ts`
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const dataDir = path.join(ROOT, 'src', 'data');

const ALLOWED_ELEMENTS = ['fusion', 'glacio', 'aero', 'electro', 'havoc', 'spectro'];
const ALLOWED_WEAPON_TYPES = ['broadblade', 'sword', 'pistols', 'gauntlets', 'rectifier'];
const ALLOWED_SCALING = ['atk', 'def', 'hp'];
const ALLOWED_ATTACK_TYPES = [
  'normal',
  'heavy',
  'skill',
  'liberation',
  'intro',
  'outro',
  'echo',
  'coordinated',
  // Phase 3 신규 채널 — characters.json에 직접 등장하지는 않지만 타입 일관성을 위해 허용
  'tuneBreak',
  'tuneRupture',
];
const ALLOWED_STAT_TYPES = [
  'hp', 'hpPercent', 'atk', 'atkPercent', 'def', 'defPercent',
  'critRate', 'critDmg', 'energyRegen', 'healingBonus',
  'normalDmgBonus', 'heavyDmgBonus', 'skillDmgBonus', 'liberationDmgBonus',
  'introDmgBonus', 'outroDmgBonus', 'coordinatedDmgBonus', 'echoSkillDmgBonus',
  'allAttributeDmgBonus',
  'aeroDmgBonus', 'glacioDmgBonus', 'fusionDmgBonus',
  'electroDmgBonus', 'havocDmgBonus', 'spectroDmgBonus',
  'tuneBreakBoost',
];

interface Issue {
  severity: 'error' | 'warning';
  file: string;
  path: string;
  message: string;
}

const issues: Issue[] = [];

function readJson<T>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

function reportError(file: string, jsonPath: string, message: string): void {
  issues.push({ severity: 'error', file, path: jsonPath, message });
}

function reportWarning(file: string, jsonPath: string, message: string): void {
  issues.push({ severity: 'warning', file, path: jsonPath, message });
}

function validateCharacters(): void {
  const file = 'src/data/characters.json';
  const characters = readJson<Array<Record<string, unknown>>>(
    path.join(dataDir, 'characters.json'),
  );

  if (!Array.isArray(characters)) {
    reportError(file, '$', 'characters.json 루트가 배열이 아님');
    return;
  }

  const seenIds = new Set<string>();

  characters.forEach((c, idx) => {
    const base = `$[${idx}](${c.id ?? 'no-id'})`;

    // id
    if (typeof c.id !== 'string' || c.id.length === 0) {
      reportError(file, base, 'id가 비어있거나 문자열이 아님');
    } else if (seenIds.has(c.id)) {
      reportError(file, base, `중복 id: ${c.id}`);
    } else {
      seenIds.add(c.id);
    }

    // name
    const name = c.name as Record<string, unknown> | undefined;
    if (!name || typeof name.ko !== 'string' || typeof name.en !== 'string') {
      reportError(file, base, 'name.ko / name.en 누락');
    }

    // rarity
    if (c.rarity !== 4 && c.rarity !== 5) {
      reportError(file, base, `rarity는 4 또는 5여야 함 (실제: ${c.rarity})`);
    }

    // element
    if (typeof c.element !== 'string' || !ALLOWED_ELEMENTS.includes(c.element as string)) {
      reportError(file, base, `element 유효하지 않음: ${c.element}`);
    }

    // weaponType
    if (
      typeof c.weaponType !== 'string'
      || !ALLOWED_WEAPON_TYPES.includes(c.weaponType as string)
    ) {
      reportError(file, base, `weaponType 유효하지 않음: ${c.weaponType}`);
    }

    // baseStats
    const baseStats = c.baseStats as Record<string, Record<string, number>> | undefined;
    if (!baseStats || typeof baseStats !== 'object') {
      reportError(file, base, 'baseStats 누락');
    } else {
      Object.entries(baseStats).forEach(([level, stats]) => {
        const sBase = `${base}.baseStats.${level}`;
        if (!stats || typeof stats !== 'object') {
          reportError(file, sBase, 'baseStats 레벨 데이터가 객체가 아님');
          return;
        }
        for (const key of ['hp', 'atk', 'def']) {
          const v = stats[key];
          if (typeof v !== 'number' || v <= 0 || !Number.isFinite(v)) {
            reportError(file, `${sBase}.${key}`, `${key}가 양수가 아님: ${v}`);
          }
        }
      });
    }

    // ascensionStat (optional)
    if (c.ascensionStat) {
      const a = c.ascensionStat as Record<string, unknown>;
      if (
        typeof a.type !== 'string'
        || !ALLOWED_STAT_TYPES.includes(a.type as string)
      ) {
        reportError(file, `${base}.ascensionStat.type`, `유효하지 않은 stat type: ${a.type}`);
      }
      if (typeof a.value !== 'number' || !Number.isFinite(a.value)) {
        reportError(file, `${base}.ascensionStat.value`, 'value가 숫자가 아님');
      }
    }

    // skills
    const skills = c.skills as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(skills)) {
      reportError(file, `${base}.skills`, 'skills 배열 누락');
    } else {
      skills.forEach((s, si) => {
        const sBase = `${base}.skills[${si}](${s.id ?? '?'})`;
        if (typeof s.id !== 'string') reportError(file, sBase, 'skill.id 누락');
        const hits = s.hits as Array<Record<string, unknown>> | undefined;
        if (!Array.isArray(hits)) {
          reportError(file, `${sBase}.hits`, 'hits 배열 누락');
          return;
        }
        hits.forEach((h, hi) => {
          const hBase = `${sBase}.hits[${hi}]`;
          if (typeof h.motionValue !== 'number') {
            reportError(file, `${hBase}.motionValue`, 'motionValue가 숫자가 아님');
          } else if (!Number.isFinite(h.motionValue) || (h.motionValue as number) < 0) {
            reportError(
              file,
              `${hBase}.motionValue`,
              `motionValue 비정상: ${h.motionValue}`,
            );
          } else if ((h.motionValue as number) > 50) {
            reportWarning(
              file,
              `${hBase}.motionValue`,
              `매우 큰 motionValue: ${h.motionValue} (검수 권장)`,
            );
          }
          if (
            typeof h.attackType !== 'string'
            || !ALLOWED_ATTACK_TYPES.includes(h.attackType as string)
          ) {
            reportError(
              file,
              `${hBase}.attackType`,
              `유효하지 않은 attackType: ${h.attackType}`,
            );
          }
          if (
            typeof h.scalingStat !== 'string'
            || !ALLOWED_SCALING.includes(h.scalingStat as string)
          ) {
            reportError(
              file,
              `${hBase}.scalingStat`,
              `유효하지 않은 scalingStat: ${h.scalingStat}`,
            );
          }
        });
      });
    }
  });
}

function validateWeapons(): void {
  const file = 'src/data/weapons.json';
  const weapons = readJson<Array<Record<string, unknown>>>(
    path.join(dataDir, 'weapons.json'),
  );

  if (!Array.isArray(weapons)) {
    reportError(file, '$', '루트가 배열이 아님');
    return;
  }

  const seen = new Set<string>();
  weapons.forEach((w, idx) => {
    const base = `$[${idx}](${w.id ?? '?'})`;

    if (typeof w.id !== 'string' || w.id.length === 0) {
      reportError(file, base, 'id 누락');
    } else if (seen.has(w.id)) {
      reportError(file, base, `중복 id: ${w.id}`);
    } else {
      seen.add(w.id);
    }

    if (w.rarity !== 3 && w.rarity !== 4 && w.rarity !== 5) {
      reportError(file, base, `rarity는 3/4/5 (실제: ${w.rarity})`);
    }

    if (
      typeof w.type !== 'string'
      || !ALLOWED_WEAPON_TYPES.includes(w.type as string)
    ) {
      reportError(file, base, `weapon type 유효하지 않음: ${w.type}`);
    }

    const baseAtk = w.baseAtk as Record<string, number> | undefined;
    if (!baseAtk || typeof baseAtk !== 'object') {
      reportError(file, `${base}.baseAtk`, '누락');
    } else {
      Object.entries(baseAtk).forEach(([level, v]) => {
        if (typeof v !== 'number' || v <= 0 || !Number.isFinite(v)) {
          reportError(file, `${base}.baseAtk.${level}`, `비정상 값: ${v}`);
        }
      });
    }

    const sub = w.subStat as Record<string, unknown> | undefined;
    if (!sub || typeof sub.type !== 'string' || typeof sub.value !== 'number') {
      reportError(file, `${base}.subStat`, '누락 또는 비정상');
    } else if (!ALLOWED_STAT_TYPES.includes(sub.type as string)) {
      reportError(
        file,
        `${base}.subStat.type`,
        `유효하지 않은 stat type: ${sub.type}`,
      );
    }
  });
}

function validateEchoSets(): void {
  const file = 'src/data/echoes/sets.json';
  const sets = readJson<Array<Record<string, unknown>>>(
    path.join(dataDir, 'echoes', 'sets.json'),
  );

  if (!Array.isArray(sets)) {
    reportError(file, '$', '루트가 배열이 아님');
    return;
  }

  const seen = new Set<string>();
  sets.forEach((s, idx) => {
    const base = `$[${idx}](${s.id ?? '?'})`;
    if (typeof s.id !== 'string') reportError(file, base, 'id 누락');
    else if (seen.has(s.id)) reportError(file, base, `중복 id: ${s.id}`);
    else seen.add(s.id);

    const checkStatArray = (
      arr: unknown,
      arrPath: string,
    ): void => {
      if (!arr) return;
      if (!Array.isArray(arr)) {
        reportError(file, arrPath, '배열이 아님');
        return;
      }
      arr.forEach((stat, si) => {
        const sb = `${arrPath}[${si}]`;
        const st = stat as Record<string, unknown>;
        if (typeof st.type !== 'string' || !ALLOWED_STAT_TYPES.includes(st.type as string)) {
          reportError(file, `${sb}.type`, `유효하지 않은 stat type: ${st.type}`);
        }
        if (typeof st.value !== 'number' || !Number.isFinite(st.value)) {
          reportError(file, `${sb}.value`, `value 비정상: ${st.value}`);
        }
      });
    };

    checkStatArray(s.twoPiece, `${base}.twoPiece`);
    checkStatArray(s.fivePiece, `${base}.fivePiece`);
    if ('threePiece' in s) checkStatArray(s.threePiece, `${base}.threePiece`);
  });
}

function validateRecommendedSetsReferences(): void {
  // recommendedSets.ts는 TS 파일이라 require/import 불가.
  // 대신 정적 분석: 모든 캐릭터 ID가 characters.json에 존재하는지 확인
  const charactersFile = path.join(dataDir, 'characters.json');
  const characters = readJson<Array<{ id: string }>>(charactersFile);
  const charIds = new Set(characters.map(c => c.id));

  const tsContent = fs.readFileSync(
    path.join(dataDir, 'recommendedSets.ts'),
    'utf-8',
  );

  // 정규식으로 키 이름만 추출 (간단한 휴리스틱)
  const keyMatches = Array.from(
    tsContent.matchAll(/^\s*['"]?([\w-]+)['"]?:\s*\{\s*primary:/gm),
  );
  for (const m of keyMatches) {
    const charId = m[1];
    if (!charIds.has(charId)) {
      reportWarning(
        'src/data/recommendedSets.ts',
        `RECOMMENDED_SETS.${charId}`,
        `characters.json에 없는 캐릭터 ID: ${charId}`,
      );
    }
  }
}

function validateSignatureWeaponsReferences(): void {
  const charactersFile = path.join(dataDir, 'characters.json');
  const characters = readJson<Array<{ id: string }>>(charactersFile);
  const charIds = new Set(characters.map(c => c.id));

  const tsContent = fs.readFileSync(
    path.join(dataDir, 'signatureWeapons.ts'),
    'utf-8',
  );

  const keyMatches = Array.from(
    tsContent.matchAll(/^\s*['"]?([\w-]+)['"]?:\s*['"][^'"]+['"]/gm),
  );
  for (const m of keyMatches) {
    const charId = m[1];
    if (!charIds.has(charId)) {
      reportWarning(
        'src/data/signatureWeapons.ts',
        `SIGNATURE_WEAPONS.${charId}`,
        `characters.json에 없는 캐릭터 ID: ${charId}`,
      );
    }
  }
}

function validateResonanceChainReferences(): void {
  const charactersFile = path.join(dataDir, 'characters.json');
  const characters = readJson<Array<{ id: string; skills: { id: string }[] }>>(
    charactersFile,
  );
  const charIds = new Set(characters.map((c) => c.id));
  const skillIdsByChar = new Map(
    characters.map((c) => [c.id, new Set(c.skills.map((s) => s.id))]),
  );

  const tsContent = fs.readFileSync(
    path.join(dataDir, 'resonanceChains.ts'),
    'utf-8',
  );

  const charKeyRegex = /^ {2}['"]?([\w-]+)['"]?:\s*\[/gm;
  const sections = Array.from(tsContent.matchAll(charKeyRegex));

  for (let i = 0; i < sections.length; i++) {
    const charId = sections[i][1];
    if (!charIds.has(charId)) {
      reportWarning(
        'src/data/resonanceChains.ts',
        `RESONANCE_CHAINS.${charId}`,
        `characters.json에 없는 캐릭터 ID: ${charId}`,
      );
      continue;
    }

    const sliceStart = sections[i].index ?? 0;
    const sliceEnd = i + 1 < sections.length
      ? (sections[i + 1].index ?? tsContent.length)
      : tsContent.length;
    const block = tsContent.slice(sliceStart, sliceEnd);

    const skillIds = skillIdsByChar.get(charId) ?? new Set<string>();
    const skillRefRegex = /skillId:\s*['"]([\w-]+)['"]/g;
    for (const m of block.matchAll(skillRefRegex)) {
      if (!skillIds.has(m[1])) {
        reportError(
          'src/data/resonanceChains.ts',
          `RESONANCE_CHAINS.${charId}`,
          `존재하지 않는 skillId 참조: ${m[1]}`,
        );
      }
    }
  }
}

function validateInherentSkillReferences(): void {
  const charactersFile = path.join(dataDir, 'characters.json');
  const characters = readJson<Array<{ id: string; skills: { id: string }[] }>>(
    charactersFile,
  );
  const charIds = new Set(characters.map((c) => c.id));
  const skillIdsByChar = new Map(
    characters.map((c) => [c.id, new Set(c.skills.map((s) => s.id))]),
  );

  const tsContent = fs.readFileSync(
    path.join(dataDir, 'inherentSkills.ts'),
    'utf-8',
  );

  const charKeyRegex = /^ {2}['"]?([\w-]+)['"]?:\s*\[/gm;
  const sections = Array.from(tsContent.matchAll(charKeyRegex));

  for (let i = 0; i < sections.length; i++) {
    const charId = sections[i][1];
    if (!charIds.has(charId)) {
      reportWarning(
        'src/data/inherentSkills.ts',
        `INHERENT_SKILLS.${charId}`,
        `characters.json에 없는 캐릭터 ID: ${charId}`,
      );
      continue;
    }

    const sliceStart = sections[i].index ?? 0;
    const sliceEnd = i + 1 < sections.length
      ? (sections[i + 1].index ?? tsContent.length)
      : tsContent.length;
    const block = tsContent.slice(sliceStart, sliceEnd);

    const skillIds = skillIdsByChar.get(charId) ?? new Set<string>();
    const skillRefRegex = /skillId:\s*['"]([\w-]+)['"]/g;
    for (const m of block.matchAll(skillRefRegex)) {
      if (!skillIds.has(m[1])) {
        reportError(
          'src/data/inherentSkills.ts',
          `INHERENT_SKILLS.${charId}`,
          `존재하지 않는 skillId 참조: ${m[1]}`,
        );
      }
    }
  }
}

function validateWeaponPassiveReferences(): void {
  const weaponsFile = path.join(dataDir, 'weapons.json');
  const weapons = readJson<Array<{ id: string }>>(weaponsFile);
  const weaponIds = new Set(weapons.map((w) => w.id));

  const tsContent = fs.readFileSync(
    path.join(dataDir, 'weaponPassives.ts'),
    'utf-8',
  );

  // weapon ID는 알파넘+하이픈 외 '&', '_', '.' 같은 문자를 포함할 수 있음 (예: 'lux-&-umbra')
  // 따라서 쿼티드 키만 추출 + 베어 키 양쪽 모두 처리
  const quotedKeyRegex = /^ {2}['"]([^'"]+)['"]:\s*\[/gm;
  const bareKeyRegex = /^ {2}([a-zA-Z_][\w-]*):\s*\[/gm;
  const found = new Set<string>();
  for (const m of tsContent.matchAll(quotedKeyRegex)) found.add(m[1]);
  for (const m of tsContent.matchAll(bareKeyRegex)) found.add(m[1]);
  for (const weaponId of found) {
    if (!weaponIds.has(weaponId)) {
      reportWarning(
        'src/data/weaponPassives.ts',
        `WEAPON_PASSIVES.${weaponId}`,
        `weapons.json에 없는 무기 ID: ${weaponId}`,
      );
    }
  }
}

function validateStateEffectReferences(): void {
  const charactersFile = path.join(dataDir, 'characters.json');
  const characters = readJson<Array<{ id: string; skills: { id: string }[] }>>(
    charactersFile,
  );
  const charIds = new Set(characters.map((c) => c.id));
  const skillIdsByChar = new Map(
    characters.map((c) => [c.id, new Set(c.skills.map((s) => s.id))]),
  );

  const tsContent = fs.readFileSync(
    path.join(dataDir, 'stateEffects.ts'),
    'utf-8',
  );

  const charKeyRegex = /^ {2}['"]?([\w-]+)['"]?:\s*\[/gm;
  const sections = Array.from(tsContent.matchAll(charKeyRegex));

  for (let i = 0; i < sections.length; i++) {
    const charId = sections[i][1];
    if (!charIds.has(charId)) {
      reportWarning(
        'src/data/stateEffects.ts',
        `STATE_MECHANICS.${charId}`,
        `characters.json에 없는 캐릭터 ID: ${charId}`,
      );
      continue;
    }

    const sliceStart = sections[i].index ?? 0;
    const sliceEnd = i + 1 < sections.length
      ? (sections[i + 1].index ?? tsContent.length)
      : tsContent.length;
    const block = tsContent.slice(sliceStart, sliceEnd);

    const skillIds = skillIdsByChar.get(charId) ?? new Set<string>();
    const skillRefRegex = /skillId:\s*['"]([\w-]+)['"]/g;
    for (const m of block.matchAll(skillRefRegex)) {
      if (!skillIds.has(m[1])) {
        reportError(
          'src/data/stateEffects.ts',
          `STATE_MECHANICS.${charId}`,
          `존재하지 않는 skillId 참조: ${m[1]}`,
        );
      }
    }
  }
}

function validateOutroBuffsReferences(): void {
  const charactersFile = path.join(dataDir, 'characters.json');
  const characters = readJson<Array<{ id: string }>>(charactersFile);
  const charIds = new Set(characters.map(c => c.id));

  const tsContent = fs.readFileSync(
    path.join(dataDir, 'outroBuffs.ts'),
    'utf-8',
  );

  const keyMatches = Array.from(
    tsContent.matchAll(/^\s*['"]?([\w-]+)['"]?:\s*\{\s*characterId:/gm),
  );
  const registeredIds = new Set<string>();
  for (const m of keyMatches) {
    registeredIds.add(m[1]);
    if (!charIds.has(m[1])) {
      reportWarning(
        'src/data/outroBuffs.ts',
        `OUTRO_BUFFS.${m[1]}`,
        `characters.json에 없는 캐릭터 ID: ${m[1]}`,
      );
    }
  }

  // 누락된 캐릭터 보고 (등록 권장)
  for (const c of characters) {
    if (!registeredIds.has(c.id)) {
      reportWarning(
        'src/data/outroBuffs.ts',
        `(missing)`,
        `아웃트로 미등록 캐릭터: ${c.id}`,
      );
    }
  }
}

function main(): void {
  console.log('🔍 데이터 정합성 검증 시작\n');

  try {
    validateCharacters();
    validateWeapons();
    validateEchoSets();
    validateRecommendedSetsReferences();
    validateSignatureWeaponsReferences();
    validateOutroBuffsReferences();
    validateResonanceChainReferences();
    validateInherentSkillReferences();
    validateStateEffectReferences();
    validateWeaponPassiveReferences();
  } catch (err) {
    console.error('❌ 검증 중 예외 발생:', err);
    process.exit(2);
  }

  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');

  console.log(`\n=== 결과 ===`);
  console.log(`Errors:   ${errors.length}`);
  console.log(`Warnings: ${warnings.length}\n`);

  if (errors.length > 0) {
    console.log('--- Errors ---');
    errors.slice(0, 200).forEach(i => {
      console.log(`  [${i.file}] ${i.path}: ${i.message}`);
    });
    if (errors.length > 200) console.log(`  ... (${errors.length - 200} more)`);
  }

  if (warnings.length > 0) {
    console.log('\n--- Warnings ---');
    warnings.slice(0, 100).forEach(i => {
      console.log(`  [${i.file}] ${i.path}: ${i.message}`);
    });
    if (warnings.length > 100) console.log(`  ... (${warnings.length - 100} more)`);
  }

  if (errors.length === 0) {
    console.log('\n✅ 모든 데이터가 정합성 검증을 통과했습니다.');
    process.exit(0);
  } else {
    console.log('\n❌ 검증 실패. 오류를 수정한 후 다시 실행하세요.');
    process.exit(1);
  }
}

main();
