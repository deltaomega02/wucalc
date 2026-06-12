// src/stores/partyStore.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** 파티 슬롯 입력 상태 (유저 입력 최종 스탯 기반) */
export interface PartySlotState {
  characterId: string;
  weaponId: string;
  atkTotal: number;
  hpTotal: number;
  defTotal: number;
  critRate: number;
  critDmg: number;
  elementDmgBonus: number;
  energyRegen: number;
  normalDmgBonus: number;
  heavyDmgBonus: number;
  skillDmgBonus: number;
  liberationDmgBonus: number;
}

export function emptyPartySlot(): PartySlotState {
  return {
    characterId: '', weaponId: '',
    atkTotal: 2800, hpTotal: 18000, defTotal: 1400,
    critRate: 0.35, critDmg: 2.10, elementDmgBonus: 0.46,
    energyRegen: 1.20,
    normalDmgBonus: 0, heavyDmgBonus: 0, skillDmgBonus: 0, liberationDmgBonus: 0,
  };
}

interface PartyState {
  slots: PartySlotState[];
  bossId: string;
  bossLevel: number;
  timeLimit: number;
  /** 마지막 시뮬레이션 총 DPS — 역경의 탑 인장 예측이 자동으로 읽어간다 */
  lastTotalDps: number;

  updateSlot: (index: number, partial: Partial<PartySlotState>) => void;
  setBossId: (id: string) => void;
  setBossLevel: (level: number) => void;
  setTimeLimit: (seconds: number) => void;
  setLastTotalDps: (dps: number) => void;
}

export const usePartyStore = create<PartyState>()(
  persist(
    (set) => ({
      slots: [emptyPartySlot(), emptyPartySlot(), emptyPartySlot()],
      bossId: 'crownless',
      bossLevel: 90,
      timeLimit: 180,
      lastTotalDps: 0,

      updateSlot: (index, partial) =>
        set((s) => {
          const slots = [...s.slots];
          slots[index] = { ...slots[index], ...partial };
          return { slots };
        }),
      setBossId: (bossId) => set({ bossId }),
      setBossLevel: (bossLevel) => set({ bossLevel }),
      setTimeLimit: (timeLimit) => set({ timeLimit }),
      setLastTotalDps: (lastTotalDps) => set({ lastTotalDps }),
    }),
    { name: 'wucalc-party' },
  ),
);
