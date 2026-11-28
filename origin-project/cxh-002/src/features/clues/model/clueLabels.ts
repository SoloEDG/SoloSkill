import type { SoundSource } from "../../../shared/types";
export function clueLabel(source: SoundSource) {
  return source.interval > 7
    ? `慢节拍 / ${source.interval.toFixed(1)} 秒`
    : `短节拍 / ${source.interval.toFixed(1)} 秒`;
}
export function clueObservation(gain: number, occluded: boolean) {
  if (gain < 0.08) return "很远 / 微弱";
  if (occluded) return "隔着隔断";
  if (gain > 0.45) return "近处 / 清晰";
  return "中等距离";
}
