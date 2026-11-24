import type { Ref } from "vue";
import { sanitizeSite } from "@/features/site/lib/coords";
import { findPreset } from "@/features/site/lib/places";
import type { DomeDocument } from "@/shared/types";

export function useSite(dome: Ref<DomeDocument>) {
  function applyPreset(name: string): boolean {
    const preset = findPreset(name);
    if (!preset) return false;
    dome.value.site = { ...preset };
    return true;
  }

  function setName(name: string): void {
    dome.value.site = sanitizeSite({ ...dome.value.site, name });
  }

  function setLat(value: number): void {
    dome.value.site = sanitizeSite({ ...dome.value.site, latDeg: value });
  }

  function setLon(value: number): void {
    dome.value.site = sanitizeSite({ ...dome.value.site, lonDeg: value });
  }

  function setZone(value: number): void {
    dome.value.site = sanitizeSite({ ...dome.value.site, zoneHours: value });
  }

  return { applyPreset, setName, setLat, setLon, setZone };
}
