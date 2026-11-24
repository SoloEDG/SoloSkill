import { clamp, wrapSigned } from "@/shared/angles";
import type { SiteState } from "@/shared/types";

export function sanitizeSite(input: SiteState): SiteState {
  const name = input.name.trim().slice(0, 16);
  return {
    name: name || "未命名地点",
    latDeg: round(clamp(input.latDeg, -75, 75)),
    lonDeg: round(wrapSigned(input.lonDeg)),
    zoneHours: clamp(Math.round(input.zoneHours * 2) / 2, -12, 14),
  };
}

function round(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

export function zoneText(hours: number): string {
  const sign = hours >= 0 ? "+" : "−";
  const abs = Math.abs(hours);
  const whole = Math.floor(abs);
  const minutes = Math.round((abs - whole) * 60);
  return `UTC${sign}${String(whole).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
