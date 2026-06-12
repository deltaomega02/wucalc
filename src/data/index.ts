// src/data/index.ts
import type { Character, Weapon, EchoSet, EchoMainStatOption, EchoSubStatTier, Enemy } from '@/types/game';

import characterData from './characters.json';
import weaponData from './weapons.json';
import echoSets from './echoes/sets.json';
import echoMainStats from './echoes/mainStats.json';
import echoSubStats from './echoes/subStats.json';
import defaultEnemy from './enemies/default.json';

export const characters: Character[] = characterData as Character[];

export const weapons: Weapon[] = weaponData as Weapon[];

export const sets: EchoSet[] = echoSets as EchoSet[];

export const mainStatOptions: Record<string, EchoMainStatOption[]> =
  echoMainStats as Record<string, EchoMainStatOption[]>;

export const subStatTiers: EchoSubStatTier[] =
  echoSubStats as EchoSubStatTier[];

/** 스탯 타입별 티어값 조회 */
export function getSubStatTiers(type: string): number[] {
  return subStatTiers.find((s) => s.type === type)?.tiers ?? [];
}

export const enemies: Enemy[] = [defaultEnemy as Enemy];

/** 캐릭터 ID로 검색 */
export function getCharacterById(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}

/** 무기 타입으로 필터 */
export function getWeaponsByType(type: string): Weapon[] {
  return weapons.filter((w) => w.type === type);
}

/** 에코 세트 ID로 검색 */
export function getEchoSetById(id: string): EchoSet | undefined {
  return sets.find((s) => s.id === id);
}
