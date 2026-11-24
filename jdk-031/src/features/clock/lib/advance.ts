export const PLAYBACK_RATES = [1, 60, 600, 3600] as const;

export function rateLabel(rate: number): string {
  if (rate === 1) return "实时";
  if (rate === 60) return "1 分/秒";
  if (rate === 600) return "10 分/秒";
  return "1 时/秒";
}

export function normalizeRate(rate: number): number {
  return PLAYBACK_RATES.includes(rate as (typeof PLAYBACK_RATES)[number]) ? rate : 600;
}

/** 单帧最多推进 0.1 秒，避免标签页在后台停住后一次跳过整夜。 */
export function advanceUtc(utcMillis: number, dtSeconds: number, rate: number): number {
  const capped = Math.min(Math.max(dtSeconds, 0), 0.1);
  return utcMillis + capped * 1000 * normalizeRate(rate);
}
