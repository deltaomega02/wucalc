// src/types/game.ts

/** 원소 속성 */
export type Element =
  | 'fusion'
  | 'glacio'
  | 'aero'
  | 'electro'
  | 'havoc'
  | 'spectro';

/** 무기 타입 */
export type WeaponType =
  | 'broadblade'
  | 'sword'
  | 'pistols'
  | 'gauntlets'
  | 'rectifier';

/** 공격 타입 */
export type AttackType =
  | 'normal'
  | 'heavy'
  | 'skill'
  | 'liberation'
  | 'intro'
  | 'outro'
  | 'echo'
  | 'coordinated'
  /** Tune Break — 3.0+ 진동 게이지 절단 채널. ATK 스케일링 미적용, tuneBreakBoost 기반 평탄값 (Phase 3) */
  | 'tuneBreak'
  /** Tune Rupture — 진동 폭발 채널. Tune Break의 후속 폭발 이펙트 (Phase 3) */
  | 'tuneRupture';

/** 스탯 종류 */
export type StatType =
  | 'hp'
  | 'hpPercent'
  | 'atk'
  | 'atkPercent'
  | 'def'
  | 'defPercent'
  | 'critRate'
  | 'critDmg'
  | 'energyRegen'
  | 'healingBonus'
  | 'normalDmgBonus'
  | 'heavyDmgBonus'
  | 'skillDmgBonus'
  | 'liberationDmgBonus'
  | 'introDmgBonus'
  | 'outroDmgBonus'
  | 'coordinatedDmgBonus'
  | 'echoSkillDmgBonus'
  | 'allAttributeDmgBonus'
  | 'aeroDmgBonus'
  | 'glacioDmgBonus'
  | 'fusionDmgBonus'
  | 'electroDmgBonus'
  | 'havocDmgBonus'
  | 'spectroDmgBonus'
  /** Tune Break 채널 강화 스탯 (3.0+ 신규 메커닉, Phase 3에서 본격 사용) */
  | 'tuneBreakBoost';

/** 스탯 항목 (타입 + 수치) */
export interface StatEntry {
  type: StatType;
  value: number;
}

/** 기본 스탯 (HP/ATK/DEF) */
export interface BaseStats {
  hp: number;
  atk: number;
  def: number;
}

/** 스킬 단일 히트 데이터 */
export interface SkillHit {
  name: Record<string, string>;
  motionValue: number;
  attackType: AttackType;
  /** 스케일링 기준 스탯 — 대부분 'atk', 일부 캐릭터 'def' 또는 'hp' */
  scalingStat: 'atk' | 'def' | 'hp';
}

/** 스킬 데이터 */
export interface SkillData {
  id: string;
  name: Record<string, string>;
  hits: SkillHit[];
}

/** 캐릭터 데이터 */
export interface Character {
  id: string;
  name: Record<string, string>;
  rarity: 4 | 5;
  element: Element;
  weaponType: WeaponType;
  /** 레벨별 기본 스탯 (키: "1", "20", "40", "50", "60", "70", "80", "90") */
  baseStats: Record<string, BaseStats>;
  /** 캐릭터 고유 보너스 스탯 (승급 보너스) */
  ascensionStat?: StatEntry;
  skills: SkillData[];
}

/** 공명체인 노드 번호 (S1~S6) */
export type ResonanceChainNode = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Amplify(Deepen) 적용 대상 카테고리.
 * - 'all': 모든 피해 적용 (벨리나 outro 등)
 * - AttackType: 특정 공격 타입에만 적용 (산화 기본공격 디펜, 루미 공명스킬 디펜 등)
 * - Element: 특정 속성에만 적용 (음림 전도 디펜, 단근 인멸 디펜 등)
 */
export type AmplifyTarget = 'all' | AttackType | Element;

/**
 * 공명체인/고유 스킬의 정량 효과.
 *
 * 게임 내 효과 중 수치로 모델링 가능한 항목만을 분류한다.
 * 'skillScaling' = MV × (1 + bonus) — Skill Scaling Bonus 카테고리
 * 'amplify'      = Deepen (곱연산 증폭)
 * 'flatStat'     = 가산 카테고리 (ATK%, CritRate, DMG Bonus 등)
 */
export type ResonanceChainStatEffect =
  | { kind: 'flatStat'; stat: StatType; value: number }
  | { kind: 'skillScaling'; skillId: string; bonus: number }
  | { kind: 'defIgnore'; value: number; skillIds?: string[] }
  | { kind: 'resPen'; element: Element; value: number; durationSec?: number }
  | { kind: 'amplify'; value: number; target?: AmplifyTarget; conditional?: string }
  | { kind: 'critRate'; value: number; durationSec?: number; conditional?: string }
  | { kind: 'coordinatedAttack'; sourceSkillId: string; mvPercent: number }
  | { kind: 'teamBuff'; stat: StatType; value: number; durationSec: number };

/** 공명체인 단일 노드 정의 (S1 ~ S6 중 하나) */
export interface ResonanceChainEffect {
  node: ResonanceChainNode;
  name: Record<string, string>;
  description: Record<string, string>;
  /** 정량 효과 (수치 미상인 노드는 빈 배열) */
  effects: ResonanceChainStatEffect[];
}

/**
 * 고유 스킬 (Inherent Skill) — 캐릭터 무조건 보유 패시브.
 * 일반적으로 캐릭터당 2개.
 */
export interface InherentSkill {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  effects: ResonanceChainStatEffect[];
  /** 발동 조건 (서술용. 자동 적용 시 항상 true 가정) */
  condition?: Record<string, string>;
}

/**
 * 상태/스택 메커니즘 (Stance, Stack, Mode).
 *
 * 카멜리아 Crimson Bud, 진희 Incandescence, 페비 Absolution/Confession,
 * 카르티시아 Aero Erosion, 카를로타 Substance, 갈브레나 Afterflame 등
 * 풀스택/풀모드 도달 시 활성화되는 메커니즘을 정량화한다.
 *
 * `defaultAssumedStacks`: 1차 시뮬레이션(풀업타임 가정) 계산 시 사용할 스택 수.
 * 보통 `maxStacks`와 동일하지만 일부 메커니즘은 평균값을 사용한다.
 */
export interface StateMechanic {
  characterId: string;
  stateName: Record<string, string>;
  description: Record<string, string>;
  maxStacks: number;
  defaultAssumedStacks: number;
  /** 스택 1개당 적용되는 정량 효과 (스택 수만큼 누적) */
  perStackEffect: ResonanceChainStatEffect[];
  /** 풀스택 도달 시 추가로 활성화되는 효과 (모드 진입 등) */
  fullStackEffect?: ResonanceChainStatEffect[];
}

/** 무기 패시브 효과 */
export interface WeaponPassive {
  name: Record<string, string>;
  description: Record<string, string>;
  /** 패시브가 제공하는 스탯 보너스 (1재련 기준) */
  stats: StatEntry[];
}

/** 무기 데이터 */
export interface Weapon {
  id: string;
  name: Record<string, string>;
  rarity: 3 | 4 | 5;
  type: WeaponType;
  /** 레벨별 기초 공격력 (키: "1", "20", "40", "50", "60", "70", "80", "90") */
  baseAtk: Record<string, number>;
  subStat: StatEntry;
  passive: WeaponPassive;
}

/** 에코 코스트 */
export type EchoCost = 1 | 3 | 4;

/** 에코 데이터 (유저 입력) */
export interface Echo {
  cost: EchoCost;
  mainStat: StatEntry;
  subStats: StatEntry[];
  setId?: string;
}

/** 에코 세트 효과 */
export interface EchoSet {
  id: string;
  name: Record<string, string>;
  /** 2피스 효과 (일반 세트) 또는 없음 (3피스 전용 세트) */
  twoPiece: StatEntry[];
  /** 5피스 효과 (일반 세트) — 풀업타임 가정 스탯 */
  fivePiece: StatEntry[];
  /** 3피스 효과 (3피스 전용 세트) — 풀업타임 가정 스탯 */
  threePiece?: StatEntry[];
  /** 5피스/3피스 효과의 조건 설명 */
  fivePieceCondition?: Record<string, string>;
  /** 3피스 전용 세트 여부 */
  isThreePieceOnly?: boolean;
}

/** 에코 메인 스탯 선택지 */
export interface EchoMainStatOption {
  type: StatType;
  maxValue: number;
}

/** 에코 서브 스탯 티어 (고정 디스크리트 값) */
export interface EchoSubStatTier {
  type: StatType;
  tiers: number[];
  flat: boolean;
}

/** 적 데이터 */
export interface Enemy {
  id: string;
  name: Record<string, string>;
  level: number;
  def: number;
  /** 속성별 저항 (기본 10%) */
  resistance: Partial<Record<Element, number>>;
  baseResistance: number;
}

/** 최종 합산 스탯 */
export interface FinalStats {
  hp: number;
  atk: number;
  def: number;
  critRate: number;
  critDmg: number;
  energyRegen: number;
  normalDmgBonus: number;
  heavyDmgBonus: number;
  skillDmgBonus: number;
  liberationDmgBonus: number;
  introDmgBonus: number;
  outroDmgBonus: number;
  coordinatedDmgBonus: number;
  echoSkillDmgBonus: number;
  allAttributeDmgBonus: number;
  elementDmgBonus: number;
  /**
   * Tune Break Boost — 3.0+ 신규 스탯.
   * 비-3.x 캐릭터의 기본값은 0, 3.x 캐릭터(예: 린네 = 10)는 양수.
   * 자체 Tune Break 피해의 1차 출처 공식이 미공개이므로 현재는 합산만 수행하고
   * 계산 분기는 별도 작업으로 남김 (data-gaps.md 참조).
   * 검증된 용례: 린네의 Tune Strain - Interfered 타깃에 대해
   *   per stack × per point × 0.12% 추가 피해 증폭 (Spectral Analysis 패시브).
   */
  tuneBreakBoost: number;
}

/** 빌드 (유저 입력 전체) */
export interface Build {
  character: Character;
  characterLevel: number;
  weapon: Weapon;
  weaponLevel: number;
  echoes: Echo[];
  echoSetBonuses: string[];
  skillLevels: Record<string, number>;
}

/** 대미지 계산 결과 */
export interface CalcResult {
  finalStats: FinalStats;
  damagePerHit: Record<string, number>;
  avgDps: number;
  critMultiplier: number;
}

/** 에코/무기 비교 결과 */
export interface ComparisonResult {
  damageA: number;
  damageB: number;
  diff: number;
  diffPercent: number;
  statsA: FinalStats;
  statsB: FinalStats;
  breakdown: ComparisonBreakdown[];
}

/** 비교 상세 내역 (어떤 스탯 차이가 딜에 기여했는지) */
export interface ComparisonBreakdown {
  statType: StatType;
  valueA: number;
  valueB: number;
  dmgContribution: number;
}
