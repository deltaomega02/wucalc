// src/components/party/PartyClient.tsx
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { characters, weapons, sets, getEchoSetById } from '@/data';
import { SIGNATURE_WEAPONS } from '@/data/signatureWeapons';
import { RECOMMENDED_SETS } from '@/data/recommendedSets';
import { OUTRO_BUFFS } from '@/data/outroBuffs';
import { calcFinalStats, getAttackTypeBonus } from '@/lib/calc/stats';
import { calcHitDamage } from '@/lib/calc/damage';
import { calcBossStatsAtLevel, estimateClearRate, getClearGrade } from '@/lib/calc/boss';
import type { Boss } from '@/lib/calc/boss';
import type { DamageParams } from '@/lib/calc/types';
import { outroBuffAmplifies } from '@/lib/calc/party';
import { sumApplicableAmplifies, type AmplifyEntry } from '@/lib/calc/passives';
import type { Character, Weapon, FinalStats, EchoSet, Element } from '@/types/game';
import { ELEMENT_TEXT_COLOR, ELEMENT_BG_COLOR, ELEMENT_VAR, ELEMENT_VAR_BRIGHT } from '@/lib/utils/element';
import { formatNumber } from '@/lib/utils/format';
import SearchSelect from '@/components/ui/SearchSelect';
import { usePartyStore, type PartySlotState } from '@/stores/partyStore';
import bossData from '@/data/enemies/bosses.json';

const bosses = bossData as Boss[];

type Role = 'main-dps' | 'sub-dps' | 'support';
const ROLES: { key: Role; fieldTime: number }[] = [
  { key: 'main-dps', fieldTime: 0.70 },
  { key: 'sub-dps', fieldTime: 0.20 },
  { key: 'support', fieldTime: 0.10 },
];

type SlotState = PartySlotState;

export default function PartyClient() {
  const tp = useTranslations('party');
  const te = useTranslations('element');
  const tc = useTranslations('characters');
  const locale = useLocale();
  const searchParams = useSearchParams();

  // 파티 상태는 영속화 — 탭을 닫아도, 역경의 탑으로 넘어가도 유지된다
  const slots = usePartyStore((s) => s.slots);
  const bossId = usePartyStore((s) => s.bossId);
  const bossLevel = usePartyStore((s) => s.bossLevel);
  const timeLimit = usePartyStore((s) => s.timeLimit);
  const updateSlot = usePartyStore((s) => s.updateSlot);
  const setBossId = usePartyStore((s) => s.setBossId);
  const setBossLevel = usePartyStore((s) => s.setBossLevel);
  const setTimeLimit = usePartyStore((s) => s.setTimeLimit);
  const setLastTotalDps = usePartyStore((s) => s.setLastTotalDps);

  // 캐릭터 상세 "파티에 배치" 딥링크: /party?char=<id> → 메인 딜러 슬롯 프리필
  const prefilled = useRef(false);
  useEffect(() => {
    if (prefilled.current) return;
    const charId = searchParams.get('char');
    if (charId && characters.some((c) => c.id === charId)) {
      prefilled.current = true;
      if (slots[0].characterId !== charId) {
        updateSlot(0, { characterId: charId, weaponId: '' });
      }
    }
  }, [searchParams, slots, updateSlot]);

  const selectedBoss = bosses.find((b) => b.id === bossId);
  const bossStats = useMemo(
    () => selectedBoss ? calcBossStatsAtLevel(selectedBoss, bossLevel) : null,
    [selectedBoss, bossLevel],
  );

  // 캐릭터 옵션
  const charOptions = useMemo(() =>
    [...characters]
      .sort((a, b) => b.rarity - a.rarity || (a.name[locale] ?? a.name.en).localeCompare(b.name[locale] ?? b.name.en))
      .map((c) => ({
        value: c.id,
        label: c.name[locale] ?? c.name.en,
        sublabel: `${c.rarity}★ ${te(c.element)}`,
        group: te(c.element),
        icon: `/images/characters/head/${c.id}.webp`,
        iconBg: ELEMENT_VAR_BRIGHT[c.element],
      })),
    [locale, te, tp],
  );

  // 보스 옵션
  const bossOptions = useMemo(() =>
    bosses.map((b) => ({
      value: b.id,
      label: b.name[locale] ?? b.name.en,
      sublabel: te(b.element),
      group: b.category === 'overlord' ? tp('worldBoss') : tp('weeklyBoss'),
    })),
    [locale, te, tp],
  );

  // DPS 계산
  const result = useMemo(() => {
    if (!bossStats) return null;

    // 1. 아웃트로 버프 수집 — 각 캐릭터가 필드에 나올 때 적용받는 버프
    // amplifyByCategory(카테고리별 Deepen)는 히트별로 attack-type/element 매칭 필터,
    // statBuffs는 attack-type/element 분류해서 가산. Phase 2.5+ 모델.
    const outroBuffsForSlot = slots.map((_, idx) => {
      const amplifies: AmplifyEntry[] = [];
      let atkFlatBonus = 0;
      let heavyBonus = 0;
      let normalBonus = 0;

      for (let i = 0; i < slots.length; i++) {
        if (i === idx) continue;
        const buff = OUTRO_BUFFS[slots[i].characterId];
        if (!buff) continue;
        amplifies.push(...outroBuffAmplifies(buff));
        for (const sb of buff.statBuffs) {
          if (sb.type === 'atkPercent') atkFlatBonus += sb.value;
          else if (sb.type === 'heavyDmgBonus') heavyBonus += sb.value;
          else if (sb.type === 'normalDmgBonus') normalBonus += sb.value;
          // 속성/스킬 DMG Bonus는 elementBonus / skillDmgBonus 등 별도 합산 권장
          // (현재 UI 모델은 user-input stats를 사용하므로 outro statBuff의 element 류는
          //  사용자 입력 elementDmgBonus에 수동 가산을 권장)
        }
      }
      return { amplifies, atkFlatBonus, heavyBonus, normalBonus };
    });

    const perChar = slots.map((slot, idx) => {
      const char = characters.find((c) => c.id === slot.characterId);
      if (!char) return { id: '', name: { ko: '', en: '' }, dps: 0, element: 'aero' as Element, role: ROLES[idx].key };

      const elemRes = bossStats.resistance[char.element] ?? 0.10;
      const buffs = outroBuffsForSlot[idx];

      // 아웃트로 ATK% 버프는 최종 ATK에 가산 (기초ATK × ATK%가 아닌, 총ATK에 비례)
      // atkTotal은 유저가 입력한 최종 공격력이므로, 아웃트로 ATK%는 추가 보너스로 처리
      const bonusAtk = slot.atkTotal * buffs.atkFlatBonus;

      let totalDmg = 0;
      let hitCount = 0;

      for (const skill of char.skills) {
        for (const hit of skill.hits) {
          const baseScaling =
            hit.scalingStat === 'hp' ? slot.hpTotal
            : hit.scalingStat === 'def' ? slot.defTotal
            : slot.atkTotal + bonusAtk;

          const atkTypeBonus =
            (hit.attackType === 'normal' ? slot.normalDmgBonus + buffs.normalBonus
            : hit.attackType === 'heavy' ? slot.heavyDmgBonus + buffs.heavyBonus
            : hit.attackType === 'skill' ? slot.skillDmgBonus
            : hit.attackType === 'liberation' ? slot.liberationDmgBonus
            : 0);

          const hitAmplify = sumApplicableAmplifies(
            buffs.amplifies, hit.attackType, char.element,
          );

          const params: DamageParams = {
            totalAtk: baseScaling,
            motionValue: hit.motionValue,
            attackType: hit.attackType,
            element: char.element,
            critRate: slot.critRate,
            critDmg: slot.critDmg,
            attackTypeBonus: atkTypeBonus,
            elementBonus: slot.elementDmgBonus,
            skillScalingBonus: 0,
            flatBonus: 0,
            dmgAmplify: hitAmplify,
            enemyResistance: elemRes,
            resPen: 0,
            enemyDef: bossStats.def,
            defIgnore: 0,
            attackerLevel: 90,
          };

          totalDmg += calcHitDamage(params).expected;
          hitCount++;
        }
      }

      const avgDmgPerHit = hitCount > 0 ? totalDmg / hitCount : 0;
      const dps = avgDmgPerHit * 1.5 * ROLES[idx].fieldTime;

      return {
        id: char.id,
        name: char.name,
        dps,
        element: char.element,
        role: ROLES[idx].key,
      };
    });

    const totalDps = perChar.reduce((s, c) => s + c.dps, 0);
    const clearRate = estimateClearRate(totalDps, bossStats.hp, timeLimit);
    const grade = getClearGrade(clearRate);

    return { perChar, totalDps, clearRate, grade, bossHp: bossStats.hp };
  }, [slots, bossStats, timeLimit]);

  // 총 DPS를 영속 저장 — 역경의 탑 인장 예측이 자동으로 읽어간다
  useEffect(() => {
    const dps = result?.totalDps ?? 0;
    if (Math.abs(usePartyStore.getState().lastTotalDps - dps) > 0.5) {
      setLastTotalDps(dps);
    }
  }, [result, setLastTotalDps]);

  return (
    <div className="space-y-8">
      {/* ── 파티 구성 ── */}
      <section>
        <SectionLabel>{tp('teamComp')}</SectionLabel>
        <div className="grid gap-5 lg:grid-cols-3">
          {ROLES.map((role, idx) => (
            <PartySlotCard
              key={role.key}
              role={role.key}
              fieldTime={role.fieldTime}
              slot={slots[idx]}
              onChange={(p) => updateSlot(idx, p)}
              charOptions={charOptions}
              outroBuffs={idx !== 0 ? OUTRO_BUFFS[slots[idx].characterId] : undefined}
            />
          ))}
        </div>
      </section>

      {/* ── 보스 선택 ── */}
      <section>
        <SectionLabel>{tp('bossSelect')}</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">{tp('bossSelect')}</label>
            <SearchSelect options={bossOptions} value={bossId} onChange={setBossId} placeholder="" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">{tp('bossLevel')}</label>
            <div className="flex gap-2">
              {[70, 80, 90, 100, 110].map((lv) => (
                <button key={lv} type="button" onClick={() => setBossLevel(lv)}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${bossLevel === lv ? 'bg-text text-bg' : 'border border-border text-text-muted hover:text-text'}`}
                >{lv}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">{tp('timeLimit')}</label>
            <div className="flex items-center gap-3">
              <input type="range" min={60} max={300} step={10} value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                className="flex-1 accent-primary" />
              <span className="w-14 text-right text-sm font-mono text-text">{timeLimit}{tp('seconds')}</span>
            </div>
          </div>
        </div>

        {/* 보스 정보 미니 카드 */}
        {selectedBoss && bossStats && (
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span className={`rounded-full px-2.5 py-1 font-medium ${ELEMENT_BG_COLOR[selectedBoss.element]} ${ELEMENT_TEXT_COLOR[selectedBoss.element]}`}>
              {selectedBoss.name[locale] ?? selectedBoss.name.en}
            </span>
            <span>HP {formatNumber(bossStats.hp, 0)}</span>
            <span>DEF {bossStats.def}</span>
            {Object.entries(bossStats.resistance).map(([elem, val]) => (
              val > 0.10 && (
                <span key={elem} className={ELEMENT_TEXT_COLOR[elem as Element]}>
                  {te(elem)} {(val * 100).toFixed(0)}%
                </span>
              )
            ))}
          </div>
        )}
      </section>

      {/* ── 결과 ── */}
      {result && result.totalDps > 0 && (
        <section>
          <SectionLabel>{tp('results')}</SectionLabel>

          {/* 핵심 수치 3개 */}
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard
              label={tp('totalDps')}
              value={formatNumber(result.totalDps, 0)}
              unit={tp('perSecond')}
              size="large"
            />
            <MetricCard
              label={tp('rotationDmg')}
              value={formatNumber(result.totalDps * 20, 0)}
              unit="/ 20s"
            />
            <MetricCard
              label={tp('clearRate')}
              value={`${(result.clearRate * 100).toFixed(1)}%`}
              unit={result.grade.grade}
              color={result.grade.color}
            />
          </div>

          {/* DPS 파형 — 진폭 = 기여도, 속성색 파면의 간섭 */}
          <WaveformDps perChar={result.perChar} totalDps={result.totalDps} />

          {/* 클리어 추정 바 */}
          <div className="coast-card mt-6 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text">{tp('clearEstimate')}</h3>
              <span className={`text-2xl font-black ${result.grade.color}`}>{result.grade.grade}</span>
            </div>
            <p className="mb-4 text-xs text-text-muted">
              {result.grade.description[locale] ?? result.grade.description.en}
            </p>

            {/* HP 바 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-text-muted">
                <span>{tp('bossHp')}: {formatNumber(result.bossHp, 0)}</span>
                <span>{tp('estimatedDmg')}: {formatNumber(result.totalDps * timeLimit * 0.85, 0)}</span>
              </div>
              <div className="relative h-5 overflow-hidden rounded-full bg-border/30">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                    result.clearRate >= 1 ? 'bg-positive' : result.clearRate >= 0.8 ? 'bg-accent' : 'bg-negative'
                  }`}
                  style={{ width: `${Math.min(100, result.clearRate * 100)}%` }}
                />
                {/* 100% 라인 */}
                <div className="absolute inset-y-0 left-[100%] w-px bg-text/30" style={{ left: `${Math.min(100, 100 / Math.max(result.clearRate, 0.01))}%` }} />
              </div>
            </div>
          </div>

          {/* 캐릭터별 기여도 */}
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-text">{tp('contribution')}</h3>
            {result.perChar.filter((c) => c.dps > 0).map((c) => {
              const ratio = result.totalDps > 0 ? c.dps / result.totalDps : 0;
              return (
                <div key={c.id} className="flex items-center gap-4">
                  <div className="w-28 shrink-0">
                    <p className={`text-sm font-medium ${ELEMENT_TEXT_COLOR[c.element]}`}>
                      {c.name[locale] ?? c.name.en}
                    </p>
                    <p className="text-[12px] text-text-muted">{c.role === 'main-dps' ? tp('mainDps') : c.role === 'sub-dps' ? tp('subDps') : tp('support')}</p>
                  </div>
                  <div className="flex-1 h-6 rounded-full bg-border/20 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${ELEMENT_BG_COLOR[c.element].replace('/15', '/40')}`}
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </div>
                  <div className="w-24 text-right">
                    <p className="text-sm font-mono font-semibold text-text">{formatNumber(c.dps, 0)}</p>
                    <p className="text-[12px] text-text-muted">{(ratio * 100).toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

/** 파티 슬롯 카드 */
function PartySlotCard({ role, fieldTime, slot, onChange, charOptions, outroBuffs }: {
  role: Role;
  fieldTime: number;
  slot: SlotState;
  onChange: (p: Partial<SlotState>) => void;
  charOptions: { value: string; label: string; sublabel?: string; group?: string }[];
  outroBuffs?: { description: Record<string, string>; dmgAmplify: number };
}) {
  const tp = useTranslations('party');
  const te = useTranslations('element');
  const ts = useTranslations('stat');
  const tc = useTranslations('characters');
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);

  const char = characters.find((c) => c.id === slot.characterId);
  const weaponOptions = useMemo(() => {
    if (!char) return [];
    const sigName = SIGNATURE_WEAPONS[char.id];
    return weapons
      .filter((w) => w.type === char.weaponType)
      .sort((a, b) => (b.name.en === sigName ? 1 : 0) - (a.name.en === sigName ? 1 : 0) || b.rarity - a.rarity)
      .map((w) => ({
        value: w.id,
        label: `${w.name.en === sigName ? '⚔ ' : ''}${w.name[locale] ?? w.name.en}`,
        sublabel: `${w.rarity}★`,
        icon: `/images/weapons/${w.id}.webp`,
      }));
  }, [char, locale]);

  const roleColorMap: Record<Role, string> = {
    'main-dps': 'text-primary',
    'sub-dps': 'text-accent',
    'support': 'text-positive',
  };

  return (
    <div className="glass-float rounded-2xl p-5 space-y-4">
      {/* 역할 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-widest ${roleColorMap[role]}`}>
            {role === 'main-dps' ? tp('mainDps') : role === 'sub-dps' ? tp('subDps') : tp('support')}
          </span>
          <span className="rounded-full bg-border/30 px-2 py-0.5 text-[12px] text-text-muted">
            {(fieldTime * 100).toFixed(0)}%
          </span>
        </div>
        {char && (
          <span className="flex items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${ELEMENT_BG_COLOR[char.element]} ${ELEMENT_TEXT_COLOR[char.element]}`}>
              {te(char.element)}
            </span>
            <Link
              href={`/characters/${char.id}`}
              className="inline-flex items-center gap-0.5 text-[12px] font-medium text-text-muted transition-colors hover:text-primary"
              title={tc('openDex')}
            >
              {tp('viewDex')}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7" /><path d="M7 7h10v10" />
              </svg>
            </Link>
          </span>
        )}
      </div>

      {/* 캐릭터 + 무기 */}
      <div className="space-y-2">
        <SearchSelect
          options={charOptions}
          value={slot.characterId}
          onChange={(id) => onChange({ characterId: id, weaponId: '' })}
          placeholder={tp('selectChar')}
          searchPlaceholder={tc('searchPlaceholder')}
        />
        {char && (
          <SearchSelect
            options={weaponOptions}
            value={slot.weaponId}
            onChange={(id) => onChange({ weaponId: id })}
            placeholder={tp('selectWeapon')}
          />
        )}
      </div>

      {/* 핵심 4스탯 */}
      {char && (
        <>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <StatField label={ts('critRate')} value={slot.critRate} isPercent step={0.01}
              onChange={(v) => onChange({ critRate: v })} highlight />
            <StatField label={ts('critDmg')} value={slot.critDmg} isPercent step={0.01}
              onChange={(v) => onChange({ critDmg: v })} highlight />
            <StatField label={ts('atk')} value={slot.atkTotal} step={10}
              onChange={(v) => onChange({ atkTotal: v })} />
            <StatField label={`${te(char.element)} DMG`} value={slot.elementDmgBonus} isPercent step={0.01}
              onChange={(v) => onChange({ elementDmgBonus: v })} />
          </div>

          {/* 상세 스탯 토글 */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs text-text-muted transition-colors hover:text-text"
          >
            {expanded ? tp('collapse') : `${tp('detailStats')} ▾`}
          </button>

          {/* 확장 스탯 */}
          {expanded && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border/50 pt-3">
              <StatField label="HP" value={slot.hpTotal} step={100}
                onChange={(v) => onChange({ hpTotal: v })} />
              <StatField label={ts('def')} value={slot.defTotal} step={10}
                onChange={(v) => onChange({ defTotal: v })} />
              <StatField label={ts('energyRegen')} value={slot.energyRegen} isPercent step={0.01}
                onChange={(v) => onChange({ energyRegen: v })} />
              <div />
              <StatField label={ts('normalDmgBonus')} value={slot.normalDmgBonus} isPercent step={0.01}
                onChange={(v) => onChange({ normalDmgBonus: v })} />
              <StatField label={ts('heavyDmgBonus')} value={slot.heavyDmgBonus} isPercent step={0.01}
                onChange={(v) => onChange({ heavyDmgBonus: v })} />
              <StatField label={ts('skillDmgBonus')} value={slot.skillDmgBonus} isPercent step={0.01}
                onChange={(v) => onChange({ skillDmgBonus: v })} />
              <StatField label={ts('liberationDmgBonus')} value={slot.liberationDmgBonus} isPercent step={0.01}
                onChange={(v) => onChange({ liberationDmgBonus: v })} />
            </div>
          )}
        </>
      )}

      {/* 아웃트로 버프 */}
      {outroBuffs && (
        <div className="rounded-lg border border-border/50 px-3 py-2.5">
          <p className="text-[12px] font-medium text-text-muted mb-0.5">{tp('outroBuffs')}</p>
          <p className="text-xs text-text leading-relaxed">
            {outroBuffs.description[locale] ?? outroBuffs.description.en}
          </p>
        </div>
      )}
    </div>
  );
}

/** DPS 파형 — 각 캐릭터의 기여도를 속성색 감쇠 사인파로 겹쳐 그린다 */
function WaveformDps({
  perChar,
  totalDps,
}: {
  perChar: { id: string; name: Record<string, string>; dps: number; element: Element }[];
  totalDps: number;
}) {
  const tp = useTranslations('party');
  const W = 720;
  const H = 120;
  const mid = H / 2;
  const active = perChar.filter((c) => c.dps > 0);
  if (active.length === 0 || totalDps <= 0) return null;

  return (
    <div className="coast-card mt-6 overflow-hidden rounded-2xl p-5">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-text-muted">
        {tp('waveform')}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full" preserveAspectRatio="none" aria-hidden>
        {/* 기준선 */}
        <line
          x1={0}
          y1={mid}
          x2={W}
          y2={mid}
          stroke="var(--color-border)"
          strokeDasharray="4 7"
        />
        {active.map((c, idx) => {
          const amp = (c.dps / totalDps) * (mid - 8);
          const freq = 2.5 + idx * 1.5;
          const points = Array.from({ length: 121 }, (_, i) => {
            const x = (i / 120) * W;
            const env = Math.sin((Math.PI * i) / 120); // 양끝 감쇠
            const y = mid - amp * env * Math.sin((2 * Math.PI * freq * i) / 120 + idx * 1.7);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(' ');
          return (
            <polyline
              key={c.id}
              points={points}
              fill="none"
              stroke={ELEMENT_VAR[c.element]}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.82}
              style={{
                strokeDasharray: 1600,
                animation: `dash-flow 1.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.18}s backwards`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

/** 커스텀 스탯 입력 필드 — 브라우저 기본 화살표 제거, 커스텀 +/- */
function StatField({ label, value, isPercent, step, onChange, highlight }: {
  label: string;
  value: number;
  isPercent?: boolean;
  step: number;
  onChange: (v: number) => void;
  highlight?: boolean;
}) {
  const displayVal = isPercent ? (value * 100).toFixed(1) : String(Math.round(value));
  const inc = isPercent ? step : step;
  const dec = isPercent ? step : step;

  return (
    <div>
      <label className={`mb-1 block text-[12px] ${highlight ? 'font-medium text-text' : 'text-text-muted'}`}>
        {label}
      </label>
      <div className="flex items-stretch rounded-lg border border-border overflow-hidden transition-colors focus-within:border-primary/50">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - dec))}
          className="flex w-7 items-center justify-center text-text-muted transition-colors hover:bg-border/30 hover:text-text active:bg-border/50"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14" />
          </svg>
        </button>
        <input
          type="text"
          inputMode="decimal"
          value={displayVal}
          onChange={(e) => {
            const raw = parseFloat(e.target.value);
            if (!isNaN(raw)) onChange(isPercent ? raw / 100 : raw);
          }}
          className="flex-1 bg-transparent px-1 py-1.5 text-center text-[13px] font-mono text-text outline-none [appearance:textfield]"
        />
        <button
          type="button"
          onClick={() => onChange(value + inc)}
          className="flex w-7 items-center justify-center text-text-muted transition-colors hover:bg-border/30 hover:text-text active:bg-border/50"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        {isPercent && (
          <span className="flex items-center pr-2 text-[12px] text-text-muted">%</span>
        )}
      </div>
    </div>
  );
}

/** 섹션 레이블 — ◆ 다이아 + 헤어라인 (전 페이지 공통 콘솔 문법) */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="diamond text-sm font-bold tracking-tight text-text">{children}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
    </div>
  );
}

/** 핵심 수치 카드 */
function MetricCard({ label, value, unit, size, color }: {
  label: string; value: string; unit: string; size?: 'large'; color?: string;
}) {
  return (
    <div className="coast-card rounded-2xl p-5 text-center">
      <p className="text-xs font-medium text-text-muted mb-2">{label}</p>
      <p className={`font-mono font-black ${size === 'large' ? 'text-3xl' : 'text-2xl'} ${color ?? 'text-text'}`}>
        {value}
      </p>
      <p className="mt-1 text-[12px] text-text-muted">{unit}</p>
    </div>
  );
}
