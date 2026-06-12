// src/stores/buildStore.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Echo, EchoCost, StatType, StatEntry, ResonanceChainNode } from '@/types/game';
import type { WeaponRefinement } from '@/lib/calc/passives';

/** 에코 슬롯 입력 상태 */
export interface EchoSlot {
  cost: EchoCost;
  mainStatType: StatType;
  mainStatValue: number;
  subStats: { type: StatType | ''; value: number }[];
}

/** 표준 에코 구성: 4-3-3-1-1 */
const DEFAULT_COSTS: EchoCost[] = [4, 3, 3, 1, 1];

function createEmptySlot(cost: EchoCost): EchoSlot {
  const mainDefaults: Record<EchoCost, { type: StatType; value: number }> = {
    4: { type: 'critRate', value: 0.22 },
    3: { type: 'aeroDmgBonus', value: 0.30 },
    1: { type: 'atkPercent', value: 0.18 },
  };
  const def = mainDefaults[cost];
  return {
    cost,
    mainStatType: def.type,
    mainStatValue: def.value,
    subStats: Array(5).fill(null).map(() => ({ type: '' as StatType | '', value: 0 })),
  };
}

interface BuildState {
  characterId: string;
  weaponId: string;
  echoSetId: string;
  echoSubSetId: string;

  /** 내 에코 5개 (현재 빌드) */
  echoSlots: EchoSlot[];

  /** 교체 대상 슬롯 인덱스 (0~4) */
  compareSlotIndex: number;

  /** 슬롯별 후보 에코 — 슬롯 전환해도 데이터 유지 */
  candidateEchoes: EchoSlot[];

  targetSkillIndex: number | 'all';
  enemyLevel: number;
  enemyDef: number;
  enemyResistance: number;
  /** 공명체인 단계 (0=S0, 1=S1, ..., 6=S6) */
  resonanceChainNode: ResonanceChainNode | 0;
  /** 무기 재련 단계 (1=R1, ..., 5=R5) */
  weaponRefinement: WeaponRefinement;

  setCharacter: (id: string) => void;
  setWeapon: (id: string) => void;
  setEchoSetId: (id: string) => void;
  setEchoSubSetId: (id: string) => void;
  setEchoSlot: (index: number, slot: Partial<EchoSlot>) => void;
  setEchoSlotSubStat: (slotIndex: number, subIndex: number, type: StatType | '', value: number) => void;
  setCompareSlotIndex: (index: number) => void;
  setCandidateEcho: (echo: Partial<EchoSlot>) => void;
  setCandidateSubStat: (subIndex: number, type: StatType | '', value: number) => void;
  setTargetSkill: (index: number | 'all') => void;
  setEnemyConfig: (config: Partial<{ enemyLevel: number; enemyDef: number; enemyResistance: number }>) => void;
  setResonanceChainNode: (node: ResonanceChainNode | 0) => void;
  setWeaponRefinement: (refinement: WeaponRefinement) => void;
  resetAll: () => void;
}

const initialState = {
  characterId: '',
  weaponId: '',
  echoSetId: '',
  echoSubSetId: '',
  echoSlots: DEFAULT_COSTS.map(createEmptySlot),
  compareSlotIndex: 0,
  candidateEchoes: DEFAULT_COSTS.map(createEmptySlot),
  targetSkillIndex: 'all' as number | 'all',
  enemyLevel: 90,
  enemyDef: 1520,
  enemyResistance: 0.10,
  resonanceChainNode: 0 as ResonanceChainNode | 0,
  weaponRefinement: 1 as WeaponRefinement,
};

export const useBuildStore = create<BuildState>()(
  persist(
    (set) => ({
      ...initialState,

      setCharacter: (id) => set({ characterId: id }),
      setWeapon: (id) => set({ weaponId: id }),
      setEchoSetId: (id) => set({ echoSetId: id }),
      setEchoSubSetId: (id) => set({ echoSubSetId: id }),

      setEchoSlot: (index, partial) =>
        set((s) => {
          const slots = [...s.echoSlots];
          slots[index] = { ...slots[index], ...partial };
          return { echoSlots: slots };
        }),

      setEchoSlotSubStat: (slotIndex, subIndex, type, value) =>
        set((s) => {
          const slots = [...s.echoSlots];
          const subs = [...slots[slotIndex].subStats];
          subs[subIndex] = { type, value };
          slots[slotIndex] = { ...slots[slotIndex], subStats: subs };
          return { echoSlots: slots };
        }),

      setCompareSlotIndex: (index) => set({ compareSlotIndex: index }),

      setCandidateEcho: (partial) =>
        set((s) => {
          const candidates = [...s.candidateEchoes];
          candidates[s.compareSlotIndex] = { ...candidates[s.compareSlotIndex], ...partial };
          return { candidateEchoes: candidates };
        }),

      setCandidateSubStat: (subIndex, type, value) =>
        set((s) => {
          const candidates = [...s.candidateEchoes];
          const subs = [...candidates[s.compareSlotIndex].subStats];
          subs[subIndex] = { type, value };
          candidates[s.compareSlotIndex] = { ...candidates[s.compareSlotIndex], subStats: subs };
          return { candidateEchoes: candidates };
        }),

      setTargetSkill: (index) => set({ targetSkillIndex: index }),
      setEnemyConfig: (config) => set(config),
      setResonanceChainNode: (node) => set({ resonanceChainNode: node }),
      setWeaponRefinement: (refinement) => set({ weaponRefinement: refinement }),
      resetAll: () => set(initialState),
    }),
    { name: 'wucalc-build' },
  ),
);

/** EchoSlot → Echo 타입 변환 */
export function slotToEcho(slot: EchoSlot): Echo {
  const subStats: StatEntry[] = slot.subStats
    .filter((s) => s.type !== '' && s.value > 0)
    .map((s) => ({ type: s.type as StatType, value: s.value }));
  return {
    cost: slot.cost,
    mainStat: { type: slot.mainStatType, value: slot.mainStatValue },
    subStats,
  };
}
