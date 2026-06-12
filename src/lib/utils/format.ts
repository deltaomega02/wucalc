// src/lib/utils/format.ts

/** 숫자를 소수점 N자리까지 포맷 (기본 1자리) */
export function formatNumber(value: number, decimals = 1): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** 퍼센트 포맷 (0.33 → "33.0%") */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/** 대미지 차이를 부호 포함 포맷 ("+1,234" 또는 "-567") */
export function formatDiff(value: number, decimals = 0): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${formatNumber(value, decimals)}`;
}

/** 퍼센트 차이를 부호 포함 포맷 ("+12.3%" 또는 "-4.5%") */
export function formatDiffPercent(value: number, decimals = 1): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(decimals)}%`;
}
