// src/components/tower/TowerClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import towerData from '@/data/enemies/tower.json';
import bossData from '@/data/enemies/bosses.json';
import { ELEMENT_TEXT_COLOR, ELEMENT_BG_COLOR } from '@/lib/utils/element';
import { formatNumber } from '@/lib/utils/format';
import { calcBossStatsAtLevel } from '@/lib/calc/boss';
import type { Boss } from '@/lib/calc/boss';
import type { Element } from '@/types/game';
import { usePartyStore } from '@/stores/partyStore';

const bosses = bossData as Boss[];
const towers = towerData.zones.hazard.towers;
const thresholds = towerData.crestThresholds;

/** API가 층별 적 레벨을 제공하지 않아 인장 예측은 보스 Lv.100 기준으로 계산 */
const ASSUMED_BOSS_LEVEL = 100;

export default function TowerClient() {
  const t = useTranslations('tower');
  const te = useTranslations('element');
  const locale = useLocale();

  // 파티 시뮬레이터에서 저장한 총 DPS — 자동 연동 (hydration 후에만 표시)
  const partyDps = usePartyStore((s) => s.lastTotalDps);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const linkedDps = mounted ? partyDps : 0;

  // 보스가 등장하는 층의 클리어 예측
  const bossFloorEstimates = useMemo(() => {
    if (linkedDps <= 0) return [];
    return towers.flatMap((tower) => {
      const th = tower.position === 'center' ? thresholds.hazard : thresholds.standard;
      return tower.floors
        .filter((floor) => floor.bossIds.length > 0)
        .map((floor) => {
          const floorBosses = floor.bossIds
            .map((bid) => bosses.find((b) => b.id === bid))
            .filter(Boolean) as Boss[];
          const totalHp = floorBosses.reduce(
            (sum, boss) => sum + calcBossStatsAtLevel(boss, ASSUMED_BOSS_LEVEL).hp,
            0,
          );
          const estTime = totalHp / linkedDps;
          const crests =
            estTime <= th.crest3.clearWithin ? 3
            : estTime <= th.crest2.clearWithin ? 2
            : estTime <= th.crest1.clearWithin ? 1
            : 0;
          return {
            towerName: (tower.name as Record<string, string>)[locale] ?? tower.name.en,
            floor: floor.floor,
            bossNames: floorBosses
              .map((b) => ((b.name as Record<string, string>)[locale] ?? b.name.en))
              .join(' · '),
            estTime,
            crests,
          };
        });
    });
  }, [linkedDps, locale]);

  const resetDate = new Date(towerData.currentResetDate);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((resetDate.getTime() - now.getTime()) / 86400000));

  return (
    <div className="space-y-8">
      {/* 리셋 카운트다운 */}
      <div className="coast-card flex items-center justify-between rounded-2xl p-5">
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{t('currentRotation')}</p>
          <p className="mt-1 text-lg font-bold text-text">{(towerData.name as Record<string, string>)[locale] ?? towerData.name.en} — {t('nextReset')}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black font-mono text-primary">{daysLeft}</p>
          <p className="text-xs text-text-muted">{t('daysLeft', { days: daysLeft })}</p>
        </div>
      </div>

      {/* 3개 탑 */}
      {towers.map((tower) => (
        <TowerSection key={tower.id} tower={tower} />
      ))}

      {/* 인장 기준표 */}
      <div className="coast-card rounded-2xl p-5">
        <SectionTitle>{t('crestEstimate')}</SectionTitle>
        <p className="mb-4 text-xs text-text-muted">{t('crestDesc')}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* 잔향/울림 기준 */}
          <div className="rounded-xl border border-border p-4">
            <p className="mb-2 text-xs font-medium text-text">{t('resonantTower')} / {t('echoingTower')}</p>
            <p className="text-xs text-text-muted mb-1">{t('timeLimit')}: 240{t('seconds')}</p>
            <div className="space-y-1">
              <CrestBar label={t('crest3')} time="60초 이내" color="text-primary" width={100} />
              <CrestBar label={t('crest2')} time="120초 이내" color="text-positive" width={66} />
              <CrestBar label={t('crest1')} time="240초 이내" color="text-accent" width={33} />
            </div>
          </div>

          {/* 심연 기준 */}
          <div className="rounded-xl border border-primary/20 p-4">
            <p className="mb-2 text-xs font-medium text-primary">{t('hazardTower')}</p>
            <p className="text-xs text-text-muted mb-1">{t('timeLimit')}: 180{t('seconds')}</p>
            <div className="space-y-1">
              <CrestBar label={t('crest3')} time="30초 이내" color="text-primary" width={100} />
              <CrestBar label={t('crest2')} time="90초 이내" color="text-positive" width={66} />
              <CrestBar label={t('crest1')} time="180초 이내" color="text-accent" width={33} />
            </div>
          </div>
        </div>

        {linkedDps > 0 ? (
          /* 파티 시뮬레이터 자동 연동 — 보스 층 클리어 예측 */
          <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wider text-text-muted">
                  {t('linkedDps')}
                </p>
                <p className="font-mono text-2xl font-black text-primary">
                  {formatNumber(linkedDps, 0)}
                  <span className="ml-1 text-xs font-medium text-text-muted">DPS</span>
                </p>
              </div>
              <Link
                href="/party"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                {t('updateParty')}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <p className="mb-2 mt-4 text-[12px] font-medium uppercase tracking-wider text-text-muted">
              {t('bossFloorEstimate')} · {t('levelAssumption', { level: ASSUMED_BOSS_LEVEL })}
            </p>
            <div className="space-y-1.5">
              {bossFloorEstimates.map((est) => (
                <div
                  key={`${est.towerName}-${est.floor}`}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-surface px-3 py-2"
                >
                  <span className="text-xs font-medium text-text">
                    {est.towerName} · {t('floor', { n: est.floor })}
                  </span>
                  <span className="flex-1 truncate text-[12px] text-text-muted">
                    {est.bossNames}
                  </span>
                  <span className="font-mono text-[12px] text-text-muted">
                    {t('estimatedTime')} {est.estTime > 999 ? '999+' : est.estTime.toFixed(0)}
                    {t('seconds')}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[12px] font-bold ${
                      est.crests === 3
                        ? 'bg-primary/15 text-primary'
                        : est.crests === 2
                          ? 'bg-positive/15 text-positive'
                          : est.crests === 1
                            ? 'bg-accent/15 text-accent'
                            : 'bg-negative/10 text-negative'
                    }`}
                  >
                    {est.crests > 0 ? t(`crest${est.crests}`) : t('crest0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 파티 미설정 — 시뮬레이터로 안내 */
          <div className="mt-5 rounded-xl border border-dashed border-border p-4 text-center">
            <p className="text-xs text-text-muted mb-2">{t('setupParty')}</p>
            <Link
              href="/party"
              className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {t('goToParty')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/** 탑 하나의 정보 섹션 */
function TowerSection({ tower }: { tower: typeof towers[number] }) {
  const t = useTranslations('tower');
  const te = useTranslations('element');
  const locale = useLocale();

  const positionColor = tower.position === 'center' ? 'text-primary' : 'text-accent';

  return (
    <div className="glass-float overflow-hidden rounded-2xl">
      {/* 탑 헤더 */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div>
          <h3 className={`text-sm font-bold ${positionColor}`}>
            {(tower.name as Record<string, string>)[locale] ?? tower.name.en}
          </h3>
          <p className="text-[12px] text-text-muted mt-0.5">
            {tower.position === 'left' ? t('resonantTower') : tower.position === 'right' ? t('echoingTower') : t('hazardTower')}
          </p>
        </div>
      </div>

      {/* 심경 간섭 효과 */}
      <div className="px-5 pb-3">
        <p className="text-[12px] font-medium text-text-muted uppercase tracking-wider mb-1.5">{t('interference')}</p>
        <div className="space-y-1">
          {tower.interference.effects.map((eff, i) => (
            <p key={i} className="text-xs text-text leading-relaxed">
              <span className="text-text-muted mr-1">·</span>
              {(eff as Record<string, string>)[locale] ?? eff.en}
            </p>
          ))}
        </div>
      </div>

      {/* 층별 정보 */}
      <div className="border-t border-border/50">
        {tower.floors.map((floor) => (
          <FloorRow
            key={floor.floor}
            floor={floor}
            commonBuffs={new Set(tower.interference.effects.map((e) => e.en))}
          />
        ))}
      </div>
    </div>
  );
}

/** 층 하나의 행 */
function FloorRow({ floor, commonBuffs }: {
  floor: {
    floor: number; timeLimit: number; fatigueCost: number;
    enemies: { ko: string; en: string }[];
    bossIds: string[];
    buffs: { ko: string; en: string }[];
    targets: { score: number; timeLeft: number }[];
  };
  commonBuffs: Set<string>;
}) {
  const t = useTranslations('tower');
  const locale = useLocale();

  const floorBosses = floor.bossIds
    .map((bid) => bosses.find((b) => b.id === bid))
    .filter(Boolean) as Boss[];

  // 지역 공통 간섭에 없는 층 고유 버프만 추려서 노출
  const extraBuffs = floor.buffs.filter((b) => !commonBuffs.has(b.en));

  return (
    <div className="border-t border-border/30 px-5 py-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="w-8 text-xs font-bold text-text-muted">{t('floor', { n: floor.floor })}</span>
        <span className="text-[12px] text-text-muted">{floor.timeLimit}{t('seconds')}</span>
        <span className="text-[12px] text-text-muted">{t('fatigue')} {floor.fatigueCost}</span>
        <div className="flex-1 flex items-center gap-1.5 justify-end flex-wrap">
          {/* 보스 (강조) */}
          {floorBosses.map((boss) => {
            const stats = calcBossStatsAtLevel(boss, ASSUMED_BOSS_LEVEL);
            return (
              <span
                key={boss.id}
                className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${ELEMENT_BG_COLOR[boss.element]} ${ELEMENT_TEXT_COLOR[boss.element]}`}
                title={`HP ${formatNumber(stats.hp, 0)} · DEF ${stats.def} (Lv.${ASSUMED_BOSS_LEVEL})`}
              >
                {(boss.name as Record<string, string>)[locale] ?? boss.name.en}
              </span>
            );
          })}
          {/* 일반 적 */}
          {floor.enemies.map((enemy, i) => (
            <span key={i} className="rounded-full bg-border/20 px-2 py-0.5 text-[12px] text-text-muted">
              {(enemy as Record<string, string>)[locale] ?? enemy.en}
            </span>
          ))}
        </div>
      </div>
      {/* 층 고유 버프 */}
      {extraBuffs.length > 0 && (
        <div className="mt-1.5 space-y-0.5 pl-8">
          {extraBuffs.map((b, i) => (
            <p key={i} className="text-[12px] leading-relaxed text-text-muted">
              <span className="mr-1 text-primary">◆</span>
              {(b as Record<string, string>)[locale] ?? b.en}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="diamond text-sm font-bold tracking-tight text-text">{children}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
    </div>
  );
}

function CrestBar({ label, time, color, width }: { label: string; time: string; color: string; width: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-14 text-xs font-medium ${color}`}>{label}</span>
      <div className="flex-1 h-3 rounded-full bg-border/20 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            color === 'text-primary' ? 'bg-primary/30' : color === 'text-positive' ? 'bg-positive/30' : 'bg-accent/30'
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="w-16 text-right text-[12px] text-text-muted">{time}</span>
    </div>
  );
}
