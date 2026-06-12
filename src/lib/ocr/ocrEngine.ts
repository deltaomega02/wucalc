// src/lib/ocr/ocrEngine.ts
// 싱글톤 OCR 엔진 — tesseract.js 워커를 세션당 1회만 생성/로딩한다.
//
// 기존 문제: 스캔할 때마다 createWorker → traineddata 로드 → terminate.
// 개선:
//  - 워커/모델 1회 로딩 후 재사용 (두 번째 스캔부터 ~1-2초)
//  - warmUpOcr(): 계산기 진입 시 유휴 시간에 미리 예열
//  - 진행률 콜백 (모델 로딩 vs 인식 단계 구분)
//  - PSM.SINGLE_BLOCK: 스탯 패널 = 단일 텍스트 블록 가정 → 레이아웃 오인식 감소

import type { Worker } from 'tesseract.js';

export type OcrPhase = 'loading' | 'recognizing';
export type OcrProgress = (phase: OcrPhase, progress: number) => void;

let workerPromise: Promise<Worker> | null = null;
let currentProgress: OcrProgress | null = null;

async function createOcrWorker(): Promise<Worker> {
  const { createWorker, PSM } = await import('tesseract.js');
  const worker = await createWorker('kor+eng', 1, {
    logger: (m) => {
      if (!currentProgress) return;
      if (m.status === 'recognizing text') {
        currentProgress('recognizing', m.progress ?? 0);
      } else {
        currentProgress('loading', m.progress ?? 0);
      }
    },
  });
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    preserve_interword_spaces: '1',
  });
  return worker;
}

function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = createOcrWorker().catch((e) => {
      workerPromise = null; // 실패 시 다음 시도에서 재생성
      throw e;
    });
  }
  return workerPromise;
}

/** 계산기 진입 시 유휴 시간에 모델을 미리 받아둔다 (실패는 조용히 무시) */
export function warmUpOcr() {
  const idle =
    typeof requestIdleCallback === 'function'
      ? requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 2500);
  idle(() => {
    getWorker().catch(() => {});
  });
}

export interface OcrWordOut {
  text: string;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface OcrEchoResult {
  text: string;
  words: OcrWordOut[];
}

/**
 * 이미지(캔버스/blob) → 텍스트 + 좌표 있는 단어들.
 * 단어 bbox 기반이라 tesseract가 좌/우 컬럼을 한 줄로 병합해도
 * 파서가 컬럼을 정확히 분리할 수 있다.
 */
export async function recognizeEcho(
  image: HTMLCanvasElement | Blob,
  onProgress?: OcrProgress,
): Promise<OcrEchoResult> {
  currentProgress = onProgress ?? null;
  try {
    const worker = await getWorker();
    const { data } = await worker.recognize(image, {}, { text: true, blocks: true });

    const words: OcrWordOut[] = [];
    for (const block of data.blocks ?? []) {
      for (const para of block.paragraphs ?? []) {
        for (const line of para.lines ?? []) {
          for (const word of line.words ?? []) {
            words.push({
              text: word.text,
              x0: word.bbox.x0,
              x1: word.bbox.x1,
              y0: word.bbox.y0,
              y1: word.bbox.y1,
            });
          }
        }
      }
    }
    return { text: data.text, words };
  } finally {
    currentProgress = null;
  }
}
