import type { Stance } from "@/shared/world";

export const stances = {
  crouch: { label: "潜行", stride: 1, volume: 1, sightGain: 25 },
  walk: { label: "行走", stride: 1, volume: 3, sightGain: 36 },
  dash: { label: "疾跑", stride: 2, volume: 5, sightGain: 49 }
} satisfies Record<Stance, { label: string; stride: number; volume: number; sightGain: number }>;
