// src/lib/waveEngine.ts
// 공유 파동 필드 — 화면(뷰포트 px) 좌표계의 수면 시뮬레이션.
// CausticsField(셰이더)와 동일한 파면 공식을 JS로 평가해서
// BuoyancyManager가 각 컴포넌트 위치의 수면 높이를 샘플링한다.
//
// 높이 단위: 무차원(크레스트 ≈ amp). 픽셀 변환은 소비자가 담당.

interface Ripple {
  x: number; // 뷰포트 px
  y: number;
  t0: number; // 초
  amp: number; // 0~1
}

const LIFE = 5; // 초
const MAX_RIPPLES = 24;

class WaveEngine {
  private ripples: Ripple[] = [];

  /** 파문 추가 (뷰포트 px 좌표) */
  add(x: number, y: number, amp: number) {
    this.ripples.push({ x, y, t0: performance.now() / 1000, amp });
    if (this.ripples.length > MAX_RIPPLES) this.ripples.shift();
  }

  prune(t: number) {
    this.ripples = this.ripples.filter((r) => t - r.t0 <= LIFE);
  }

  get active(): boolean {
    return this.ripples.length > 0;
  }

  /**
   * (x,y)의 수면 높이 — 셰이더와 동일한 파면 모델.
   * 거리 정규화 기준은 뷰포트 높이(셰이더의 uv.y와 일치).
   */
  heightAt(x: number, y: number, t: number, viewportH: number): number {
    let h = 0;
    const H = viewportH || 800;
    for (const r of this.ripples) {
      const age = t - r.t0;
      if (age <= 0 || age > LIFE) continue;
      const d = Math.hypot(x - r.x, y - r.y) / H;
      const R = (0.55 + 0.45 * r.amp) * (1 - Math.exp(-age * 0.85));
      const env = Math.exp(-age * (0.65 + (1 - r.amp) * 1.3)) * r.amp;
      // 선두 크레스트
      const front = Math.exp(-(((d - R) * 90) ** 2));
      // 파면 뒤 잔파열
      let train = 0;
      if (d < R) train = Math.sin((R - d) * 52 - age * 1.6) * Math.exp(-(R - d) * 5.5);
      h += (front + train * 0.6) * env;
    }
    return h;
  }
}

export const waveEngine = new WaveEngine();
