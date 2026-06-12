// src/components/calculator/CalculatorClient.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useBuildStore } from '@/stores/buildStore';
import type { EchoSlot } from '@/stores/buildStore';
import type { StatType } from '@/types/game';
import { mainStatOptions, getSubStatTiers } from '@/data';
import { encodeBuild, decodeBuild } from '@/lib/buildShare';
import {
  scoreEcho,
  echoTopPercent,
  buildTopPercent,
  topPercentTone,
} from '@/lib/calc/echoScore';
import BuildSetup from './BuildSetup';
import EchoInputForm from './EchoInputForm';
import ComparisonResult from './ComparisonResult';

const SLOT_LABELS = ['4C', '3C', '3C', '1C', '1C'];

const TONE_CLASS: Record<ReturnType<typeof topPercentTone>, string> = {
  gold: 'text-primary',
  purple: 'text-electro',
  cyan: 'text-accent',
  muted: 'text-text-muted',
};

function formatTopPct(pct: number): string {
  return pct < 1 ? pct.toFixed(1) : String(Math.round(pct));
}
const SUB_TYPES: StatType[] = [
  'critRate', 'critDmg', 'atkPercent', 'atk',
  'hpPercent', 'hp', 'defPercent', 'def',
  'energyRegen', 'normalDmgBonus', 'heavyDmgBonus',
  'skillDmgBonus', 'liberationDmgBonus',
];

export default function CalculatorClient() {
  const t = useTranslations('calc');
  const store = useBuildStore();
  const searchParams = useSearchParams();
  const restored = useRef(false);
  const [copied, setCopied] = useState(false);

  // ── 공유 URL 복원: /calculator?b=<payload> ──
  useEffect(() => {
    if (restored.current) return;
    const payload = searchParams.get('b');
    if (!payload) return;
    restored.current = true;
    const data = decodeBuild(payload);
    if (!data) return;

    const s = useBuildStore.getState();
    s.setCharacter(data.characterId);
    s.setWeapon(data.weaponId);
    data.echoSlots.forEach((slot, i) => s.setEchoSlot(i, slot));
    data.candidateEchoes.forEach((slot, i) => {
      s.setCompareSlotIndex(i);
      s.setCandidateEcho(slot);
    });
    s.setCompareSlotIndex(data.compareSlotIndex);
    s.setTargetSkill(data.targetSkillIndex);
    s.setResonanceChainNode(data.resonanceChainNode);
    s.setWeaponRefinement(data.weaponRefinement);
    // BuildSetup이 캐릭터 변경 시 추천 세트를 자동 적용하므로,
    // 그 이펙트가 돈 다음 틱에 공유된 세트로 덮어쓴다
    setTimeout(() => {
      s.setEchoSetId(data.echoSetId);
      s.setEchoSubSetId(data.echoSubSetId);
    }, 0);
  }, [searchParams]);

  // ── 공유 링크 복사 ──
  const copyShareLink = async () => {
    const s = useBuildStore.getState();
    const payload = encodeBuild({
      characterId: s.characterId,
      weaponId: s.weaponId,
      echoSetId: s.echoSetId,
      echoSubSetId: s.echoSubSetId,
      echoSlots: s.echoSlots,
      candidateEchoes: s.candidateEchoes,
      compareSlotIndex: s.compareSlotIndex,
      targetSkillIndex: s.targetSkillIndex,
      resonanceChainNode: s.resonanceChainNode,
      weaponRefinement: s.weaponRefinement,
    });
    const url = `${window.location.origin}${window.location.pathname}?b=${payload}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t('share'), url);
    }
  };

  return (
    <div className="space-y-6">
      {/* 0. 공유 */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={copyShareLink}
          disabled={!store.characterId}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
            copied
              ? 'bg-positive/15 text-positive'
              : 'bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40'
          }`}
        >
          {copied ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          )}
          {copied ? t('shareCopied') : t('share')}
        </button>
      </div>

      {/* 1. 캐릭터 + 무기 + 세트 */}
      <BuildSetup />

      {/* 2. 내 에코 5슬롯 */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="diamond text-sm font-bold text-text">{t('myBuild')}</h2>
          <BuildScoreBadge slots={store.echoSlots} />
        </div>
        <div className="grid gap-2 grid-cols-5">
          {store.echoSlots.map((slot, idx) => (
            <EchoSlotCard
              key={idx}
              index={idx}
              slot={slot}
              isSelected={store.compareSlotIndex === idx}
              onSelect={() => store.setCompareSlotIndex(idx)}
              onChange={(partial) => store.setEchoSlot(idx, partial)}
              onSubStatChange={(si, type, val) => store.setEchoSlotSubStat(idx, si, type, val)}
            />
          ))}
        </div>

        {/* 선택된 슬롯 확장 패널 */}
        <div className="mt-3 overflow-hidden rounded-xl border border-accent/40 bg-accent/5 transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-accent/20 px-4 py-2">
            <span className="text-xs font-bold text-accent">
              {t('slot')} {store.compareSlotIndex + 1} ({SLOT_LABELS[store.compareSlotIndex]}) — {t('editing')}
            </span>
            <div className="flex gap-1">
              {store.echoSlots.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => store.setCompareSlotIndex(idx)}
                  className={`h-6 w-6 rounded text-[12px] font-bold transition-all ${
                    store.compareSlotIndex === idx
                      ? 'bg-accent text-bg'
                      : 'bg-bg text-text-muted hover:text-accent'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3">
            <ExpandedSlotEditor
              slot={store.echoSlots[store.compareSlotIndex]}
              onChange={(partial) => store.setEchoSlot(store.compareSlotIndex, partial)}
              onSubStatChange={(si, type, val) =>
                store.setEchoSlotSubStat(store.compareSlotIndex, si, type, val)
              }
            />
          </div>
        </div>
      </div>

      {/* 3. 비교 영역: 현재 에코(좌) vs 후보 에코(우) */}
      <div>
        <h2 className="diamond mb-3 text-sm font-bold text-text">
          {t('slot')} {store.compareSlotIndex + 1} {t('comparison')}
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2 hidden md:flex">
            <span className="rounded-full bg-bg border-2 border-border px-3 py-1 text-xs font-bold text-text-muted">
              VS
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <EchoInputForm
              label={`${t('currentEcho')} — ${t('slot')} ${store.compareSlotIndex + 1}`}
              echo={store.echoSlots[store.compareSlotIndex]}
              onChange={(partial) => store.setEchoSlot(store.compareSlotIndex, partial)}
              onSubStatChange={(si, type, val) =>
                store.setEchoSlotSubStat(store.compareSlotIndex, si, type, val)
              }
              accent="text-primary"
              borderClass="border-primary/30"
              bgClass="bg-primary/5"
              compareWith={store.candidateEchoes[store.compareSlotIndex]}
            />
            <EchoInputForm
              label={t('candidateEcho')}
              echo={store.candidateEchoes[store.compareSlotIndex]}
              onChange={store.setCandidateEcho}
              onSubStatChange={store.setCandidateSubStat}
              accent="text-accent"
              borderClass="border-accent/30"
              bgClass="bg-accent/5"
              compareWith={store.echoSlots[store.compareSlotIndex]}
              onCopyFrom={() => {
                const current = store.echoSlots[store.compareSlotIndex];
                store.setCandidateEcho({
                  cost: current.cost,
                  mainStatType: current.mainStatType,
                  mainStatValue: current.mainStatValue,
                });
                current.subStats.forEach((s, i) => {
                  store.setCandidateSubStat(i, s.type as StatType | '', s.value);
                });
              }}
              copyLabel={t('copyFromCurrent')}
            />
          </div>
        </div>
      </div>

      {/* 4. 비교 결과 */}
      <ComparisonResult />
    </div>
  );
}

/** 5에코 종합 점수 + 상위 % 배지 (상위 %는 균등 가정 몬테카를로 추정 — 마운트 후 계산) */
function BuildScoreBadge({ slots }: { slots: EchoSlot[] }) {
  const t = useTranslations('calc');
  const totalScore = slots.reduce((s, sl) => s + scoreEcho(sl), 0);
  const hasAny = slots.some((sl) => sl.subStats.some((sub) => sub.type !== ''));
  const [pct, setPct] = useState<number | null>(null);

  useEffect(() => {
    if (!hasAny) {
      setPct(null);
      return;
    }
    setPct(buildTopPercent(totalScore));
  }, [totalScore, hasAny]);

  if (!hasAny || pct === null) return null;
  const tone = TONE_CLASS[topPercentTone(pct)];

  return (
    <span
      title={t('scoreAssumption')}
      className="inline-flex items-baseline gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs"
    >
      <span className="text-text-muted">{t('echoScore')}</span>
      <strong className="text-sm text-text">{totalScore.toFixed(0)}</strong>
      <span className={`font-bold ${tone}`}>{t('topPct', { pct: formatTopPct(pct) })}</span>
      <span className="text-[10px] text-text-muted">*</span>
    </span>
  );
}

/** 5슬롯 미니 카드 — 비선택은 요약, 선택은 하이라이트 */
function EchoSlotCard({
  index, slot, isSelected, onSelect,
}: {
  index: number;
  slot: EchoSlot;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (partial: Partial<EchoSlot>) => void;
  onSubStatChange: (subIndex: number, type: StatType | '', value: number) => void;
}) {
  const t = useTranslations();
  const filledSubs = slot.subStats.filter((s) => s.type !== '').length;
  const mainLabel = t(`stat.${slot.mainStatType}`);
  const mainVal = isFlat(slot.mainStatType)
    ? String(slot.mainStatValue)
    : `${(slot.mainStatValue * 100).toFixed(1)}%`;

  // 에코 점수 + 상위 % (상위 %는 마운트 후 — SSR/클라이언트 분포 불일치 방지)
  const score = scoreEcho(slot);
  const [pct, setPct] = useState<number | null>(null);
  useEffect(() => {
    setPct(filledSubs > 0 ? echoTopPercent(score) : null);
  }, [score, filledSubs]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-lg border p-2 text-left transition-all ${
        isSelected
          ? 'border-accent ring-2 ring-accent/30 bg-accent/5 scale-[1.02] shadow-lg shadow-accent/10'
          : 'border-border bg-surface hover:border-text-muted hover:scale-[1.01]'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[12px] font-bold ${isSelected ? 'text-accent' : 'text-text-muted'}`}>
          {SLOT_LABELS[index]}
        </span>
        {isSelected && (
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        )}
      </div>
      <p className={`text-xs font-medium truncate ${isSelected ? 'text-accent' : 'text-text'}`}>
        {mainLabel}
      </p>
      <p className="text-[12px] font-mono text-text-muted">{mainVal}</p>
      {pct !== null && (
        <p className={`font-mono text-[11px] font-bold ${TONE_CLASS[topPercentTone(pct)]}`}>
          {score.toFixed(0)} · {t('calc.topPct', { pct: formatTopPct(pct) })}
        </p>
      )}
      <div className="mt-1 flex gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < filledSubs ? (isSelected ? 'bg-accent/60' : 'bg-primary/40') : 'bg-border'
            }`}
          />
        ))}
      </div>
    </button>
  );
}

/** 선택된 슬롯의 확장 에디터 */
function ExpandedSlotEditor({
  slot, onChange, onSubStatChange,
}: {
  slot: EchoSlot;
  onChange: (partial: Partial<EchoSlot>) => void;
  onSubStatChange: (subIndex: number, type: StatType | '', value: number) => void;
}) {
  const t = useTranslations();
  const available = mainStatOptions[String(slot.cost)] ?? [];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {/* 주옵션 */}
      <div>
        <label className="mb-1 block text-[12px] font-medium text-text-muted uppercase tracking-wider">
          {t('calc.mainStat')}
        </label>
        <select
          value={slot.mainStatType}
          onChange={(e) => {
            const type = e.target.value as StatType;
            const opt = available.find((o) => o.type === type);
            onChange({ mainStatType: type, mainStatValue: opt?.maxValue ?? 0 });
          }}
          className="w-full rounded-lg border border-border bg-bg px-2.5 py-2 text-sm text-text outline-none focus:border-accent"
        >
          {available.map((opt) => (
            <option key={opt.type} value={opt.type}>
              {t(`stat.${opt.type}`)} {isFlat(opt.type) ? opt.maxValue : `${(opt.maxValue * 100).toFixed(1)}%`}
            </option>
          ))}
        </select>
      </div>

      {/* 부옵션 */}
      <div>
        <label className="mb-1 block text-[12px] font-medium text-text-muted uppercase tracking-wider">
          {t('calc.subStats')}
        </label>
        <div className="space-y-1">
          {slot.subStats.map((sub: { type: StatType | ''; value: number }, si: number) => (
            <div key={si} className="flex gap-1">
              <select
                value={sub.type}
                onChange={(e) => {
                  const newType = e.target.value as StatType | '';
                  const tiers = newType ? getSubStatTiers(newType) : [];
                  onSubStatChange(si, newType, tiers.length > 0 ? tiers[Math.floor(tiers.length / 2)] : 0);
                }}
                className="flex-1 rounded border border-border bg-bg px-1.5 py-1 text-xs text-text outline-none focus:border-accent"
              >
                <option value="">—</option>
                {SUB_TYPES.map((st) => (
                  <option key={st} value={st}>{t(`stat.${st}`)}</option>
                ))}
              </select>
              {sub.type ? (
                <select
                  value={sub.value}
                  onChange={(e) => onSubStatChange(si, sub.type as StatType, parseFloat(e.target.value))}
                  className="w-20 rounded border border-border bg-bg px-1 py-1 text-right text-xs font-mono text-text outline-none focus:border-accent"
                >
                  {(getSubStatTiers(sub.type) as number[]).map((tier, i) => (
                    <option key={i} value={tier}>
                      {isFlat(sub.type) ? tier : `${(tier * 100).toFixed(1)}%`}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function isFlat(type: string): boolean {
  return type === 'hp' || type === 'atk' || type === 'def';
}
