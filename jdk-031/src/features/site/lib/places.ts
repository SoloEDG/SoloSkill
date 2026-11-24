import type { SiteState } from "@/shared/types";

export const PRESETS: SiteState[] = [
  { name: "北京", latDeg: 39.9042, lonDeg: 116.4074, zoneHours: 8 },
  { name: "上海", latDeg: 31.2304, lonDeg: 121.4737, zoneHours: 8 },
  { name: "乌鲁木齐", latDeg: 43.8256, lonDeg: 87.6168, zoneHours: 8 },
  { name: "三亚", latDeg: 18.2528, lonDeg: 109.5119, zoneHours: 8 },
  { name: "喀什", latDeg: 39.4704, lonDeg: 75.9898, zoneHours: 8 },
  { name: "漠河", latDeg: 52.972, lonDeg: 122.537, zoneHours: 8 },
];

export function findPreset(name: string): SiteState | null {
  return PRESETS.find((item) => item.name === name) ?? null;
}
