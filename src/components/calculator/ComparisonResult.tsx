// src/components/calculator/ComparisonResult.tsx
'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useBuildStore, slotToEcho } from '@/stores/buildStore';
import { characters, weapons, getEchoSetById } from '@/data';
import { calcFinalStats, getAttackTypeBonus, applyFlatStatBuffs } from '@/lib/calc/stats';
import { calcHitDamage } from '@/lib/calc/damage';
import { aggregatePassiveEffects, sumApplicableAmplifies, type AggregatedPassives } from '@/lib/calc/passives';
import type { DamageParams } from '@/lib/calc/types';
import type { FinalStats, Character, Weapon, Echo, EchoSet, SkillHit, ResonanceChainNode } from '@/types/game';
import type { WeaponRefinement } from '@/lib/calc/passives';
import { formatNumber, formatDiffPercent } from '@/lib/utils/format';

interface SkillDamageRow {
  name: string;
  dmgA: number;
  dmgB: number;
  diff: number;
  diffPercent: number;
}

interface StatDiffRow {
  label: string;
  valueA: number;
  valueB: number;
  diff: number;
  isPercent: boolean;
}

export default function ComparisonResult() {
  const t = useTranslations();
  const locale = useLocale();
  const store = useBuildStore();

  const result = useMemo(() => {
    const char = characters.find((c) => c.id === store.characterId);
    const weap = weapons.find((w) => w.id === store.weaponId);
    if (!char || !weap) return null;

    // 세트 보너스
    const echoSets: EchoSet[] = [];
    const primarySet = store.echoSetId ? getEchoSetById(store.echoSetId) : undefined;
    if (primarySet) echoSets.push(primarySet);
    const subSet = store.echoSubSetId ? getEchoSetById(store.echoSubSetId) : undefined;
    if (subSet) echoSets.push(subSet);

    // 현재 빌드: 에코 5개 그대로
    const currentEchoes: Echo[] = store.echoSlots.map(slotToEcho);

    // 후보 빌드: 교체 슬롯만 후보 에코로 교체
    const swappedEchoes = [...currentEchoes];
    swappedEchoes[store.compareSlotIndex] = slotToEcho(store.candidateEchoes[store.compareSlotIndex]);

    const statsA = calcFinalStats(char, '90', weap, '90', currentEchoes, echoSets);
    const statsB = calcFinalStats(char, '90', weap, '90', swappedEchoes, echoSets);

    // 패시브(인헤런트 + 공명체인 + 상태 + 무기 조건부) 합산 — 양쪽 동일 적용 (diff 영향 없음, 절대값 정확도 향상)
    const passives = aggregatePassiveEffects(
      char, store.resonanceChainNode, weap.id, 'on-field', store.weaponRefinement,
    );
    applyFlatStatBuffs(statsA, passives.flatStats);
    applyFlatStatBuffs(statsB, passives.flatStats);

    // 스킬별 대미지
    const skills = char.skills.flatMap((skill) =>
      skill.hits.map((hit) => ({ ...hit, skillName: skill.name[locale] ?? skill.name.en })),
    );

    const targetHits =
      store.targetSkillIndex === 'all'
        ? skills
        : char.skills[store.targetSkillIndex]?.hits.map((hit) => ({
            ...hit,
            skillName: char.skills[store.targetSkillIndex as number].name[locale] ??
              char.skills[store.targetSkillIndex as number].name.en,
          })) ?? skills;

    const rows: SkillDamageRow[] = targetHits.map((hit) => {
      const dmgA = calcExpected(statsA, char, hit, store, passives);
      const dmgB = calcExpected(statsB, char, hit, store, passives);
      const diff = dmgB - dmgA;
      const diffPercent = dmgA !== 0 ? (diff / dmgA) * 100 : 0;
      return {
        name: `${hit.skillName} — ${hit.name[locale] ?? hit.name.en}`,
        dmgA, dmgB, diff, diffPercent,
      };
    });

    const totalA = rows.reduce((s, r) => s + r.dmgA, 0);
    const totalB = rows.reduce((s, r) => s + r.dmgB, 0);
    const totalDiff = totalB - totalA;
    const totalDiffPercent = totalA !== 0 ? (totalDiff / totalA) * 100 : 0;

    const statDiffs = buildStatDiffs(statsA, statsB, t);
    const critRatioA = statsA.critDmg / Math.max(statsA.critRate, 0.01);
    const critRatioB = statsB.critDmg / Math.max(statsB.critRate, 0.01);

    return { rows, totalA, totalB, totalDiff, totalDiffPercent, statsA, statsB, statDiffs, critRatioA, critRatioB };
  }, [store, locale, t]);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
        {t('calc.selectToCompare')}
      </div>
    );
  }

  const { totalDiff, totalDiffPercent, rows, statDiffs, statsA, statsB, critRatioA, critRatioB } = result;
  const winner = totalDiffPercent > 0.5 ? 'B' : totalDiffPercent < -0.5 ? 'A' : 'draw';

  return (
    <div className="space-y-4">
      {/* 공명 체인 / 무기 공진 선택 */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <h3 className="mb-3 text-sm font-bold text-text">{t('calc.buildContext')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">
              {t('calc.resonanceChain')}
            </label>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => store.setResonanceChainNode(n as ResonanceChainNode | 0)}
                  className={`flex-1 rounded py-1.5 text-xs font-medium transition-all ${
                    store.resonanceChainNode === n
                      ? 'bg-text text-bg'
                      : 'border border-border text-text-muted hover:text-text'
                  }`}
                >
                  S{n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">
              {t('calc.weaponRefinement')}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => store.setWeaponRefinement(r as WeaponRefinement)}
                  className={`flex-1 rounded py-1.5 text-xs font-medium transition-all ${
                    store.weaponRefinement === r
                      ? 'bg-text text-bg'
                      : 'border border-border text-text-muted hover:text-text'
                  }`}
                >
                  R{r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div className={`rounded-xl border p-5 text-center ${
        winner === 'B' ? 'border-positive/30 bg-positive/5'
          : winner === 'A' ? 'border-negative/30 bg-negative/5'
          : 'border-border bg-surface'
      }`}>
        <p className="text-xs text-text-muted mb-1">{t('calc.verdict')}</p>
        <p className={`text-2xl font-bold ${
          winner === 'B' ? 'text-positive' : winner === 'A' ? 'text-negative' : 'text-text-muted'
        }`}>
          {winner === 'B' ? `${t('calc.candidateWins')} ${formatDiffPercent(totalDiffPercent)}`
            : winner === 'A' ? `${t('calc.currentWins')} ${formatDiffPercent(-totalDiffPercent)}`
            : t('calc.draw')}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          {formatNumber(result.totalA, 0)} → {formatNumber(result.totalB, 0)}{' '}
          ({totalDiff >= 0 ? '+' : ''}{formatNumber(totalDiff, 0)})
        </p>
      </div>

      {/* Skill Breakdown */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <h3 className="mb-3 text-sm font-bold text-text">{t('calc.skillBreakdown')}</h3>
        <div className="space-y-2 overflow-x-auto">
          {rows.map((row, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="flex-1 truncate text-text-muted" title={row.name}>{row.name}</span>
              <span className="w-16 text-right font-mono text-text">{formatNumber(row.dmgA, 0)}</span>
              <span className="w-4 text-center text-text-muted">→</span>
              <span className="w-16 text-right font-mono text-text">{formatNumber(row.dmgB, 0)}</span>
              <span className={`w-16 text-right font-mono font-medium ${
                row.diffPercent > 0.5 ? 'text-positive' : row.diffPercent < -0.5 ? 'text-negative' : 'text-text-muted'
              }`}>
                {formatDiffPercent(row.diffPercent)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stat Contribution */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <h3 className="mb-3 text-sm font-bold text-text">{t('calc.statContribution')}</h3>
        <div className="space-y-2">
          {statDiffs
            .filter((s) => Math.abs(s.diff) > 0.001)
            .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
            .map((stat, idx) => {
              const maxDiff = Math.max(...statDiffs.map((s) => Math.abs(s.diff)), 0.001);
              const barWidth = Math.min(100, (Math.abs(stat.diff) / maxDiff) * 100);
              const isPositive = stat.diff > 0;
              return (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="w-28 shrink-0 text-text-muted">{stat.label}</span>
                  <div className="flex-1 h-4 bg-bg rounded overflow-hidden">
                    <div
                      className={`h-full rounded ${isPositive ? 'bg-positive/30' : 'bg-negative/30'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className={`w-20 text-right font-mono ${isPositive ? 'text-positive' : 'text-negative'}`}>
                    {stat.diff > 0 ? '+' : ''}
                    {stat.isPercent ? `${(stat.diff * 100).toFixed(1)}%` : formatNumber(stat.diff, 0)}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Crit Ratio */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <h3 className="mb-2 text-sm font-bold text-text">{t('calc.critRatio')}</h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <CritDisplay label={t('calc.currentBuild')} rate={statsA.critRate} dmg={statsA.critDmg} ratio={critRatioA} />
          <CritDisplay label={t('calc.afterSwap')} rate={statsB.critRate} dmg={statsB.critDmg} ratio={critRatioB} />
        </div>
      </div>
    </div>
  );
}

function CritDisplay({ label, rate, dmg, ratio }: { label: string; rate: number; dmg: number; ratio: number }) {
  const deviation = Math.abs(ratio - 2.0);
  const quality = deviation < 0.3 ? 'text-positive' : deviation < 0.8 ? 'text-accent' : 'text-negative';
  return (
    <div className="rounded-lg bg-bg p-3">
      <p className="mb-1 font-medium text-text-muted">{label}</p>
      <p className="text-text">{(rate * 100).toFixed(1)}% : {(dmg * 100).toFixed(1)}%</p>
      <p className={`font-mono font-bold ${quality}`}>1 : {ratio.toFixed(2)}{deviation < 0.3 && ' ✓'}</p>
    </div>
  );
}

function calcExpected(
  stats: FinalStats, char: Character, hit: SkillHit & { skillName: string },
  store: { enemyResistance: number; enemyDef: number; enemyLevel: number },
  passives: AggregatedPassives,
): number {
  const scalingStat =
    hit.scalingStat === 'hp' ? stats.hp
    : hit.scalingStat === 'def' ? stats.def
    : stats.atk;

  const dmgAmplify = sumApplicableAmplifies(passives.amplifies, hit.attackType, char.element);
  const universalDefIgnore = passives.defIgnores
    .filter((di) => !di.skillIds || di.skillIds.length === 0)
    .reduce((s, di) => s + di.value, 0);
  const resPen = passives.resPens
    .filter((rp) => rp.element === char.element)
    .reduce((s, rp) => s + rp.value, 0);

  const params: DamageParams = {
    totalAtk: scalingStat, motionValue: hit.motionValue, attackType: hit.attackType,
    element: char.element, critRate: stats.critRate, critDmg: stats.critDmg,
    attackTypeBonus: getAttackTypeBonus(stats, hit.attackType),
    elementBonus: stats.elementDmgBonus,
    skillScalingBonus: 0, flatBonus: 0,
    dmgAmplify,
    enemyResistance: store.enemyResistance, resPen,
    enemyDef: store.enemyDef, defIgnore: universalDefIgnore, attackerLevel: store.enemyLevel,
  };
  return calcHitDamage(params).expected;
}

function buildStatDiffs(a: FinalStats, b: FinalStats, t: (key: string) => string): StatDiffRow[] {
  return [
    { label: t('stat.atk'), valueA: a.atk, valueB: b.atk, diff: b.atk - a.atk, isPercent: false },
    { label: 'HP', valueA: a.hp, valueB: b.hp, diff: b.hp - a.hp, isPercent: false },
    { label: t('stat.def'), valueA: a.def, valueB: b.def, diff: b.def - a.def, isPercent: false },
    { label: t('stat.critRate'), valueA: a.critRate, valueB: b.critRate, diff: b.critRate - a.critRate, isPercent: true },
    { label: t('stat.critDmg'), valueA: a.critDmg, valueB: b.critDmg, diff: b.critDmg - a.critDmg, isPercent: true },
    { label: 'Element DMG', valueA: a.elementDmgBonus, valueB: b.elementDmgBonus, diff: b.elementDmgBonus - a.elementDmgBonus, isPercent: true },
    { label: t('stat.normalDmgBonus'), valueA: a.normalDmgBonus, valueB: b.normalDmgBonus, diff: b.normalDmgBonus - a.normalDmgBonus, isPercent: true },
    { label: t('stat.heavyDmgBonus'), valueA: a.heavyDmgBonus, valueB: b.heavyDmgBonus, diff: b.heavyDmgBonus - a.heavyDmgBonus, isPercent: true },
    { label: t('stat.skillDmgBonus'), valueA: a.skillDmgBonus, valueB: b.skillDmgBonus, diff: b.skillDmgBonus - a.skillDmgBonus, isPercent: true },
    { label: t('stat.liberationDmgBonus'), valueA: a.liberationDmgBonus, valueB: b.liberationDmgBonus, diff: b.liberationDmgBonus - a.liberationDmgBonus, isPercent: true },
  ];
}
