export { useClock } from "@/features/clock/model/useClock";
export { advanceUtc, normalizeRate, PLAYBACK_RATES, rateLabel } from "@/features/clock/lib/advance";
export { default as ClockPanel } from "@/features/clock/ui/ClockPanel.vue";

export function clockStatus(playing: boolean, rateText: string): string {
  return playing ? `正在以${rateText}推进模拟时刻` : "模拟时刻停住，星图保持这一瞬间";
}
