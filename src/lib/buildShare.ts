// src/lib/buildShare.ts
// 빌드 공유 URL — 계산기 상태를 base64url로 직렬화/복원
//
// /calculator?b=<payload> 형태. payload = base64url(UTF-8 JSON).
// 스토어 전체가 아니라 공유에 의미 있는 필드만 담는다 (버전 필드로 전방 호환).

import type { EchoSlot } from '@/stores/buildStore';
import type { ResonanceChainNode } from '@/types/game';
import type { WeaponRefinement } from '@/lib/calc/passives';

export interface SharedBuild {
  v: 1;
  characterId: string;
  weaponId: string;
  echoSetId: string;
  echoSubSetId: string;
  echoSlots: EchoSlot[];
  candidateEchoes: EchoSlot[];
  compareSlotIndex: number;
  targetSkillIndex: number | 'all';
  resonanceChainNode: ResonanceChainNode | 0;
  weaponRefinement: WeaponRefinement;
}

function toBase64Url(s: string): string {
  const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(s)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function encodeBuild(build: Omit<SharedBuild, 'v'>): string {
  return toBase64Url(JSON.stringify({ v: 1, ...build }));
}

/** 손상/구버전 payload는 null — 호출부는 조용히 무시 */
export function decodeBuild(payload: string): SharedBuild | null {
  try {
    const data = JSON.parse(fromBase64Url(payload)) as SharedBuild;
    if (data?.v !== 1 || typeof data.characterId !== 'string') return null;
    if (!Array.isArray(data.echoSlots) || data.echoSlots.length !== 5) return null;
    if (!Array.isArray(data.candidateEchoes) || data.candidateEchoes.length !== 5) return null;
    return data;
  } catch {
    return null;
  }
}
