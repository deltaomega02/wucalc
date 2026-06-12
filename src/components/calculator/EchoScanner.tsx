// src/components/calculator/EchoScanner.tsx
// 에코 스크린샷 OCR 입력 — v2 (성능/정확도 고도화)
//
// v1 문제: 스캔마다 워커 생성+모델 로드(수십MB), 전처리 없음 → 느리고 부정확
// v2:
//  - 싱글톤 워커 + 계산기 진입 시 백그라운드 예열 (ocrEngine)
//  - 캔버스 전처리: 대비 스트레치 + Otsu 이진화 + 자동 반전 (preprocess)
//  - 단계별 진행률 (모델 준비 / 인식 %)
//  - 인식 요약 표시 ("메인 + 서브 N개 인식")
'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { EchoSlot } from '@/stores/buildStore';
import { warmUpOcr, recognizeEcho, type OcrPhase } from '@/lib/ocr/ocrEngine';

interface EchoScannerProps {
  onScanComplete: (result: Partial<EchoSlot>) => void;
  accent: string;
}

type Phase = 'idle' | OcrPhase | 'done' | 'error';

export default function EchoScanner({ onScanComplete, accent }: EchoScannerProps) {
  const t = useTranslations('calc');
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugText, setDebugText] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // 계산기 진입 시 유휴 시간에 모델 예열 → 첫 스캔도 빠르게
  useEffect(() => {
    warmUpOcr();
  }, []);

  async function handleFile(file: File) {
    setPhase('loading');
    setProgress(0);
    setError(null);
    setSummary(null);
    setDebugText(null);

    try {
      const { prepareVariants, cropZoom } = await import('@/lib/ocr/preprocess');
      const { parseEchoFromWords, parseEchoFromText, findStatRegion } = await import(
        '@/lib/ocr/parseEchoText'
      );
      const variants = await prepareVariants(file);

      const onOcrProgress = (p: OcrPhase, value: number) => {
        setPhase(p);
        setProgress(value);
      };
      const qualityOf = (r: Partial<EchoSlot>) =>
        (r.mainStatType ? 10 : 0) +
        (r.subStats ?? []).filter((s) => s.type !== '').length;

      // 1단계 멀티패스: 변형별 인식→파싱, 최고 품질 채택 (메인+서브4면 조기 종료)
      let best: Partial<EchoSlot> = {};
      let bestQuality = -1;
      let bestWords: Awaited<ReturnType<typeof recognizeEcho>>['words'] = [];
      let bestCanvas: HTMLCanvasElement = variants[0].canvas;
      let lastText = '';

      for (const variant of variants) {
        const { text, words } = await recognizeEcho(variant.canvas, onOcrProgress);
        lastText = text;

        let result =
          words.length > 0 ? parseEchoFromWords(words, variant.canvas.width) : {};
        if (!result.mainStatType) result = parseEchoFromText(text);

        const quality = qualityOf(result);
        if (quality > bestQuality) {
          bestQuality = quality;
          best = result;
          bestWords = words;
          bestCanvas = variant.canvas;
        }
        if (quality >= 14) break; // 메인 + 서브 4개 — 충분히 좋음
      }

      // 2단계 크롭-줌: 항상 실행 — 스탯 영역만 ×2 확대한 인식이 구조적으로
      // 가장 깨끗하다(일러스트 노이즈 배제). 1단계와 동률이어도 크롭 결과 우선.
      // (실캡처 실측: 1단계는 노이즈 행이 가짜 서브를 만들어 만점처럼 보일 수 있음)
      if (bestWords.length > 0) {
        const region = findStatRegion(bestWords, bestCanvas.width);
        if (region && region.w > 40 && region.h > 40) {
          const zoomed = cropZoom(bestCanvas, region, 2);
          const { words } = await recognizeEcho(zoomed, onOcrProgress);
          const result = parseEchoFromWords(words, zoomed.width, { singleColumn: true });
          if (qualityOf(result) >= bestQuality) {
            bestQuality = qualityOf(result);
            best = result;
          }
        }
      }

      if (best.mainStatType) {
        onScanComplete(best);
        const subCount = (best.subStats ?? []).filter((s) => s.type !== '').length;
        setSummary(t('scanResult', { count: subCount }));
        setPhase('done');
        setTimeout(() => setPhase((cur) => (cur === 'done' ? 'idle' : cur)), 3500);
      } else {
        setError(t('scanNoStats'));
        setDebugText(lastText.replace(/\s+/g, ' ').trim().slice(0, 200) || null);
        setPhase('error');
      }
    } catch (err) {
      console.error('OCR error:', err);
      setError(t('scanError'));
      setPhase('error');
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  }

  function handlePaste(e: React.ClipboardEvent) {
    for (const item of e.clipboardData.items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) handleFile(file);
        break;
      }
    }
  }

  const busy = phase === 'loading' || phase === 'recognizing';

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onPaste={handlePaste}
      tabIndex={0}
      className="relative"
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className={`relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed px-3 py-2.5 text-xs transition-all ${
          phase === 'done'
            ? 'border-positive/50 bg-positive/5'
            : 'border-border bg-bg/50 hover:border-primary hover:bg-primary/5'
        } ${busy ? 'cursor-wait' : ''}`}
      >
        {/* 인식 진행률 바 */}
        {busy && (
          <span
            className="absolute inset-y-0 left-0 bg-primary/10 transition-[width] duration-200"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        )}

        {busy ? (
          <span className="relative flex items-center gap-2 text-text-muted">
            <Spinner />
            {phase === 'loading'
              ? t('scanLoadingModel')
              : `${t('scanning')} ${Math.round(progress * 100)}%`}
          </span>
        ) : phase === 'done' && summary ? (
          <span className="relative flex items-center gap-2 font-medium text-positive">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {summary}
          </span>
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={accent}
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span className={accent}>{t('scanEcho')}</span>
            <span className="text-text-muted">/ {t('pasteOrDrag')}</span>
          </>
        )}
      </button>

      {phase === 'error' && error && (
        <div className="mt-1 space-y-1">
          <p className="text-xs text-negative">{error}</p>
          {debugText && (
            <details className="text-[11px] text-text-muted">
              <summary className="cursor-pointer">{t('scanDebug')}</summary>
              <p className="mt-1 break-all font-mono">{debugText}</p>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
    </svg>
  );
}
