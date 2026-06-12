// src/lib/ocr/__tests__/parseEchoText.test.ts
import { describe, it, expect } from 'vitest';
import { parseEchoFromText, parseEchoFromLines, type OcrLine } from '../parseEchoText';

describe('parseEchoFromText — 에코 스크린샷 OCR 파싱', () => {
  it('한국어 4코스트 에코: 메인/고정보조/서브 5개를 분리한다', () => {
    const ocr = [
      '천둥의 비늘',
      'COST 4',
      '크리티컬 확률 +22.0%',
      '공격력 +150', // 고정 보조 메인 (flat ATK ≥100 → 서브에서 제외)
      '크리티컬 피해 +21.0%',
      '공격력 +10.9%',
      '공명 효율 +12.4%',
      '공명 스킬 보너스 +8.6%',
      'HP +470',
    ].join('\n');

    const r = parseEchoFromText(ocr);
    expect(r.cost).toBe(4);
    expect(r.mainStatType).toBe('critRate');
    expect(r.mainStatValue).toBeCloseTo(0.22);

    const subs = (r.subStats ?? []).filter((s) => s.type !== '');
    const types = subs.map((s) => s.type);
    expect(types).toContain('critDmg');
    expect(types).toContain('atkPercent');
    expect(types).toContain('energyRegen');
    expect(types).toContain('skillDmgBonus');
    expect(types).toContain('hp'); // flat HP 470 (<1000) 은 정상 서브옵
    expect(types).not.toContain('atk'); // 고정 보조 150은 제외

    const atkP = subs.find((s) => s.type === 'atkPercent');
    expect(atkP?.value).toBeCloseTo(0.109);
  });

  it('영어 스크린샷도 파싱한다', () => {
    const ocr = ['Crit. Rate +22.0%', 'ATK +150', 'Crit. DMG +13.8%', 'ATK +9.4%'].join('\n');
    const r = parseEchoFromText(ocr);
    expect(r.mainStatType).toBe('critRate');
    const subs = (r.subStats ?? []).filter((s) => s.type !== '');
    expect(subs.map((s) => s.type)).toEqual(['critDmg', 'atkPercent']);
  });

  it('1코스트 추론: flat HP 고정 보조(≥1000)가 있으면 cost 1', () => {
    const ocr = ['공격력 +18.0%', 'HP +2280', '크리티컬 확률 +6.9%'].join('\n');
    const r = parseEchoFromText(ocr);
    expect(r.cost).toBe(1);
    expect(r.mainStatType).toBe('atkPercent');
  });

  it('스탯이 전혀 없으면 빈 결과', () => {
    const r = parseEchoFromText('아무 의미 없는 텍스트\n12345');
    expect(r.mainStatType).toBeUndefined();
  });

  it('OCR 오타 내성: 률→율, 효율 변형, 컬→칼', () => {
    const ocr = ['크리티칼 확율 +22.0%', '공명 효률 +12.4%', '크리티컬 피헤 +13.8%'].join('\n');
    const r = parseEchoFromText(ocr);
    expect(r.mainStatType).toBe('critRate');
    const types = (r.subStats ?? []).filter((s) => s.type !== '').map((s) => s.type);
    expect(types).toContain('energyRegen');
    expect(types).toContain('critDmg');
  });

  it('소수점 누락 보정: "220%"는 22.0%로 복원', () => {
    const r = parseEchoFromText('크리티컬 확률 +220%');
    expect(r.mainStatValue).toBeCloseTo(0.22);
  });

  it('콤마 소수점: "22,0%"를 22.0%로 정규화 (천단위 2,280은 보존)', () => {
    const r = parseEchoFromText(['크리티컬 확률 +22,0%', 'HP +2,280'].join('\n'));
    expect(r.mainStatValue).toBeCloseTo(0.22);
    expect(r.cost).toBe(1); // 고정 보조 HP 2280 → 1코스트 추론
  });

  it('노이즈 숫자가 행 앞에 붙어도 마지막 숫자를 값으로 (실캡처: "1 공격력 40")', () => {
    const r = parseEchoFromText(['크리티컬 피해 44.0%', '1 공격력 40'].join('\n'));
    const subs = (r.subStats ?? []).filter((s) => s.type !== '');
    expect(subs).toContainEqual({ type: 'atk', value: 40 });
  });

  it('인게임 단독 표기 "크리티컬"(확률 생략)은 크리확, "크리티컬 피해"는 크리피', () => {
    const r = parseEchoFromText(['크리티컬 피해 44.0%', '크리티컬 7.5%'].join('\n'));
    expect(r.mainStatType).toBe('critDmg');
    const subs = (r.subStats ?? []).filter((s) => s.type !== '');
    expect(subs[0]).toEqual({ type: 'critRate', value: 0.075 });
  });
});

describe('parseEchoFromLines — 전체 화면 스크린샷 (좌표 기반)', () => {
  /** 사용자 실패 사례 재현: 에코 관리 전체 화면 (이상 · 시길룸, COST 4) */
  const FULLSCREEN_LINES: OcrLine[] = [
    // 좌측 그리드 노이즈 — COST 12/12 함정 포함
    { text: 'COST 12/12', x0: 70, y0: 60 },
    { text: '전부 01 03 04', x0: 230, y0: 60 },
    { text: '화음 필터링 / 전부', x0: 250, y0: 130 },
    { text: '+25', x0: 280, y0: 300 },
    { text: '4', x0: 320, y0: 270 },
    { text: '+25', x0: 280, y0: 460 },
    { text: '미장착 순서', x0: 350, y0: 1080 },
    // 우측 스탯 패널
    { text: '이상 · 시길룸 +25', x0: 1500, y0: 170 },
    { text: 'COST 4', x0: 1505, y0: 210 },
    { text: '크리티컬 피해 44.0%', x0: 1510, y0: 258 },
    { text: '공격력 150', x0: 1510, y0: 295 },
    { text: '+ 크리티컬 7.5%', x0: 1510, y0: 332 },
    { text: '+ HP 320', x0: 1510, y0: 366 },
    { text: '+ 공명 효율 10.0%', x0: 1510, y0: 401 },
    { text: '+ 공격력 40', x0: 1510, y0: 436 },
    { text: '+ 크리티컬 피해 21.0%', x0: 1510, y0: 471 },
    // 하단 설명문 — 스탯 단어 포함 함정
    { text: '에코 어빌리티', x0: 1505, y0: 520 },
    { text: '시길룸을 소환한 후, 적에게 용융 피해를 입힌다', x0: 1510, y0: 550 },
    { text: '긴 여정을 떠나는 별 (2/2)', x0: 1510, y0: 750 },
    { text: '용융 피해가 증가된다', x0: 1510, y0: 780 },
    { text: '크리티컬이 증가되고 용융 피해가', x0: 1510, y0: 880 },
    { text: '증가된다', x0: 1510, y0: 910 },
  ];

  it('우측 패널만 추출: COST 4 / 메인 크리피 44% / 서브 5개 정확', () => {
    const r = parseEchoFromLines(FULLSCREEN_LINES, 1920);
    expect(r.cost).toBe(4); // COST 12/12에 속지 않는다
    expect(r.mainStatType).toBe('critDmg');
    expect(r.mainStatValue).toBeCloseTo(0.44);

    const subs = (r.subStats ?? []).filter((s) => s.type !== '');
    expect(subs).toEqual([
      { type: 'critRate', value: 0.075 },
      { type: 'hp', value: 320 },
      { type: 'energyRegen', value: 0.1 },
      { type: 'atk', value: 40 },
      { type: 'critDmg', value: 0.21 },
    ]);
  });

  it('스탯 라인이 전혀 없으면 빈 결과', () => {
    const r = parseEchoFromLines(
      [{ text: '아무 텍스트', x0: 100, y0: 100 }],
      1920,
    );
    expect(r.mainStatType).toBeUndefined();
  });
});
