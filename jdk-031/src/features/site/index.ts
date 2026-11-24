import type { SiteState } from "@/shared/types";
import { zoneText } from "@/features/site/lib/coords";

export { useSite } from "@/features/site/model/useSite";
export { sanitizeSite, zoneText } from "@/features/site/lib/coords";
export { findPreset, PRESETS } from "@/features/site/lib/places";
export { default as SitePanel } from "@/features/site/ui/SitePanel.vue";

export function siteLabel(site: SiteState): string {
  const lat = site.latDeg >= 0 ? `北纬 ${site.latDeg.toFixed(2)}°` : `南纬 ${Math.abs(site.latDeg).toFixed(2)}°`;
  const lon = site.lonDeg >= 0 ? `东经 ${site.lonDeg.toFixed(2)}°` : `西经 ${Math.abs(site.lonDeg).toFixed(2)}°`;
  return `${site.name} · ${lat} · ${lon} · ${zoneText(site.zoneHours)}`;
}
