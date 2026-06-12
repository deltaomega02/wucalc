// src/components/calculator/BuildSetup.tsx
'use client';

import { useMemo, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useBuildStore } from '@/stores/buildStore';
import { characters, weapons, sets } from '@/data';
import { SIGNATURE_WEAPONS } from '@/data/signatureWeapons';
import { RECOMMENDED_SETS } from '@/data/recommendedSets';
import { ELEMENT_TEXT_COLOR, ELEMENT_BG_COLOR, ELEMENT_VAR_BRIGHT } from '@/lib/utils/element';
import SearchSelect from '@/components/ui/SearchSelect';
import type { SearchSelectOption } from '@/components/ui/SearchSelect';

export default function BuildSetup() {
  const t = useTranslations();
  const locale = useLocale();
  const store = useBuildStore();

  const selectedChar = useMemo(
    () => characters.find((c) => c.id === store.characterId),
    [store.characterId],
  );

  const recommendation = useMemo(
    () => store.characterId ? RECOMMENDED_SETS[store.characterId] : undefined,
    [store.characterId],
  );

  useEffect(() => {
    if (recommendation) {
      store.setEchoSetId(recommendation.primary[0]);
      store.setEchoSubSetId(recommendation.primary[1] ?? '');
    }
  }, [store.characterId]);

  const characterOptions: SearchSelectOption[] = useMemo(() => {
    return [...characters]
      .sort((a, b) => b.rarity - a.rarity || (a.name[locale] ?? a.name.en).localeCompare(b.name[locale] ?? b.name.en))
      .map((c) => ({
        value: c.id,
        label: c.name[locale] ?? c.name.en,
        sublabel: `${c.rarity}★ ${t(`element.${c.element}`)} · ${t(`weaponType.${c.weaponType}`)}`,
        group: t(`element.${c.element}`),
        icon: `/images/characters/head/${c.id}.webp`,
        iconBg: ELEMENT_VAR_BRIGHT[c.element],
      }));
  }, [locale, t]);

  const weaponOptions: SearchSelectOption[] = useMemo(() => {
    if (!selectedChar) return [];
    const sigName = SIGNATURE_WEAPONS[selectedChar.id];
    return weapons
      .filter((w) => w.type === selectedChar.weaponType)
      .sort((a, b) => {
        const aS = a.name.en === sigName ? 1 : 0;
        const bS = b.name.en === sigName ? 1 : 0;
        if (aS !== bS) return bS - aS;
        return b.rarity - a.rarity || a.name.en.localeCompare(b.name.en);
      })
      .map((w) => {
        const isSig = w.name.en === sigName;
        return {
          value: w.id,
          label: `${isSig ? '⚔ ' : ''}${w.name[locale] ?? w.name.en}`,
          sublabel: `${w.rarity}★ ${t(`stat.${w.subStat.type}`)} ${(w.subStat.value * 100).toFixed(1)}%`,
          group: isSig ? t('calc.signatureWeapon') : `${w.rarity}★`,
          icon: `/images/weapons/${w.id}.webp`,
        };
      });
  }, [selectedChar, locale, t]);

  const setOptions: SearchSelectOption[] = useMemo(() => {
    const recIds = new Set([
      ...(recommendation?.primary ?? []),
      ...(recommendation?.alternatives ?? []).flat(),
    ]);
    return [
      { value: '', label: t('calc.noSet') },
      ...[...sets]
        .sort((a, b) => {
          const aR = recIds.has(a.id) ? 1 : 0;
          const bR = recIds.has(b.id) ? 1 : 0;
          if (aR !== bR) return bR - aR;
          return (a.name[locale] ?? a.name.en).localeCompare(b.name[locale] ?? b.name.en);
        })
        .map((s) => ({
          value: s.id,
          label: `${recIds.has(s.id) ? '★ ' : ''}${s.name[locale] ?? s.name.en}`,
          group: recIds.has(s.id) ? t('calc.recommendedSet') : t('calc.otherSets'),
        })),
    ];
  }, [recommendation, locale, t]);

  const availableSkills = useMemo(() => selectedChar?.skills ?? [], [selectedChar]);

  return (
    <div className="space-y-3">
      {/* Row 1: Character + Weapon */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="glass-float rounded-xl p-4">
          <label className="mb-2 block text-xs font-medium text-text-muted uppercase tracking-wider">
            {t('calc.character')}
          </label>
          <SearchSelect
            options={characterOptions}
            value={store.characterId}
            onChange={(id) => { store.setCharacter(id); store.setWeapon(''); }}
            placeholder={t('calc.selectCharacter')}
            searchPlaceholder={t('characters.searchPlaceholder')}
          />
          {selectedChar && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${ELEMENT_BG_COLOR[selectedChar.element]} ${ELEMENT_TEXT_COLOR[selectedChar.element]}`}>
                {t(`element.${selectedChar.element}`)}
              </span>
              <span className="text-xs text-text-muted">
                ATK {selectedChar.baseStats['90']?.atk} · HP {selectedChar.baseStats['90']?.hp.toLocaleString()}
              </span>
              <Link
                href={`/characters/${selectedChar.id}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-opacity hover:opacity-75"
              >
                {t('characters.openDex')}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7" /><path d="M7 7h10v10" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        <div className="glass-float rounded-xl p-4">
          <label className="mb-2 block text-xs font-medium text-text-muted uppercase tracking-wider">
            {t('calc.weapon')}
          </label>
          {!selectedChar ? (
            <div className="rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-muted">
              {t('calc.selectCharacterFirst')}
            </div>
          ) : (
            <SearchSelect
              options={weaponOptions}
              value={store.weaponId}
              onChange={(id) => store.setWeapon(id)}
              placeholder={t('calc.selectWeapon')}
              searchPlaceholder={t('characters.searchPlaceholder')}
            />
          )}
          {store.weaponId && (() => {
            const w = weapons.find(w => w.id === store.weaponId);
            return w ? (
              <div className="mt-2 text-xs text-text-muted">
                ATK {w.baseAtk['90']} · {t(`stat.${w.subStat.type}`)} {(w.subStat.value * 100).toFixed(1)}%
              </div>
            ) : null;
          })()}
        </div>
      </div>

      {/* Row 2: Sets + Skill */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="glass-float rounded-xl p-4">
          <label className="mb-2 block text-xs font-medium text-text-muted uppercase tracking-wider">
            {t('calc.primarySet')}
          </label>
          <SearchSelect options={setOptions} value={store.echoSetId} onChange={store.setEchoSetId}
            placeholder={t('calc.echoSet')} searchPlaceholder={t('characters.searchPlaceholder')} />
        </div>
        <div className="glass-float rounded-xl p-4">
          <label className="mb-2 block text-xs font-medium text-text-muted uppercase tracking-wider">
            {t('calc.subSet')}
          </label>
          <SearchSelect options={setOptions} value={store.echoSubSetId} onChange={store.setEchoSubSetId}
            placeholder={t('calc.noSet')} searchPlaceholder={t('characters.searchPlaceholder')} />
        </div>
        <div className="glass-float rounded-xl p-4">
          <label className="mb-2 block text-xs font-medium text-text-muted uppercase tracking-wider">
            {t('calc.targetSkill')}
          </label>
          {availableSkills.length === 0 ? (
            <div className="rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-muted">
              {t('calc.selectCharacterFirst')}
            </div>
          ) : (
            <SearchSelect
              options={[
                { value: 'all', label: t('calc.allSkills') },
                ...availableSkills.map((s, i) => ({ value: String(i), label: s.name[locale] ?? s.name.en })),
              ]}
              value={store.targetSkillIndex === 'all' ? 'all' : String(store.targetSkillIndex)}
              onChange={(v) => store.setTargetSkill(v === 'all' ? 'all' : parseInt(v))}
              placeholder={t('calc.targetSkill')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
