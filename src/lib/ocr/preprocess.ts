// src/lib/ocr/preprocess.ts
// OCR 전처리 v2 — 멀티 변형 파이프라인.
//
// 단일 전역 이진화는 도박이다: 화면 평균 밝기에 따라 극성(밝은 글씨/어두운 글씨)
// 판정이 뒤집히면 패널 텍스트가 통째로 사라진다 (실사용 "전혀 인식 못함" 사례).
// → 세 가지 변형을 만들어 순차 인식하고 가장 잘 파싱되는 결과를 쓴다:
//   1. gray      — 이진화 없이 대비 스트레치만 (tesseract 내부 이진화에 위임)
//   2. bin-light — 밝은 글씨 가정 (잉크 = 밝은 픽셀) — 게임 패널 표준
//   3. bin-dark  — 어두운 글씨 가정 (잉크 = 어두운 픽셀)

const MAX_DIM = 2200; // 1920/2560 캡처를 다운스케일하지 않는다 (작은 패널 글자 보호)
const MIN_DIM = 1100;

export interface PreprocessVariant {
  label: 'gray' | 'bin-light' | 'bin-dark';
  canvas: HTMLCanvasElement;
}

export async function prepareVariants(file: Blob): Promise<PreprocessVariant[]> {
  const bmp = await createImageBitmap(file);
  const longest = Math.max(bmp.width, bmp.height);
  const scale = longest > MAX_DIM ? MAX_DIM / longest : longest < MIN_DIM ? MIN_DIM / longest : 1;
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);

  const base = document.createElement('canvas');
  base.width = w;
  base.height = h;
  const ctx = base.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();

  const img = ctx.getImageData(0, 0, w, h);
  const px = img.data;
  const n = w * h;

  // 그레이스케일 + 히스토그램
  const gray = new Uint8Array(n);
  const hist = new Uint32Array(256);
  for (let i = 0; i < n; i++) {
    const j = i * 4;
    const g = ((px[j] * 299 + px[j + 1] * 587 + px[j + 2] * 114) / 1000) | 0;
    gray[i] = g;
    hist[g]++;
  }

  // 2~98% 퍼센타일 대비 스트레치
  const lo = percentile(hist, n, 0.02);
  const hi = percentile(hist, n, 0.98);
  const range = Math.max(1, hi - lo);
  const stretched = new Uint8Array(n);
  const histS = new Uint32Array(256);
  for (let i = 0; i < n; i++) {
    const v = Math.max(0, Math.min(255, Math.round(((gray[i] - lo) / range) * 255)));
    stretched[i] = v;
    histS[v]++;
  }
  const threshold = otsu(histS, n);

  const makeCanvas = (fill: (i: number) => number): HTMLCanvasElement => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const cx = c.getContext('2d')!;
    const data = cx.createImageData(w, h);
    const out = data.data;
    for (let i = 0; i < n; i++) {
      const v = fill(i);
      const j = i * 4;
      out[j] = out[j + 1] = out[j + 2] = v;
      out[j + 3] = 255;
    }
    cx.putImageData(data, 0, 0);
    return c;
  };

  return [
    { label: 'gray', canvas: makeCanvas((i) => stretched[i]) },
    { label: 'bin-light', canvas: makeCanvas((i) => (stretched[i] > threshold ? 0 : 255)) },
    { label: 'bin-dark', canvas: makeCanvas((i) => (stretched[i] <= threshold ? 0 : 255)) },
  ];
}

/** 영역 크롭 + 확대 — 2차 패스(작은 패널 글자 재인식)용 */
export function cropZoom(
  src: HTMLCanvasElement,
  region: { x: number; y: number; w: number; h: number },
  scale = 2,
  pad = 28,
): HTMLCanvasElement {
  const sx = Math.max(0, region.x - pad);
  const sy = Math.max(0, region.y - pad);
  const sw = Math.min(src.width - sx, region.w + pad * 2);
  const sh = Math.min(src.height - sy, region.h + pad * 2);

  const out = document.createElement('canvas');
  out.width = Math.round(sw * scale);
  out.height = Math.round(sh * scale);
  const ctx = out.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, sx, sy, sw, sh, 0, 0, out.width, out.height);
  return out;
}

function percentile(hist: Uint32Array, total: number, p: number): number {
  const target = total * p;
  let acc = 0;
  for (let i = 0; i < 256; i++) {
    acc += hist[i];
    if (acc >= target) return i;
  }
  return 255;
}

/** Otsu — 클래스 간 분산 최대화 임계값 */
function otsu(hist: Uint32Array, total: number): number {
  let sumAll = 0;
  for (let i = 0; i < 256; i++) sumAll += i * hist[i];
  let sumB = 0;
  let wB = 0;
  let best = 0;
  let bestVar = -1;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sumAll - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > bestVar) {
      bestVar = between;
      best = t;
    }
  }
  return best;
}
