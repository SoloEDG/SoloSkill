import type { DomeDocument, SiteState } from "@/shared/types";

export const DEFAULT_UTC = Date.UTC(2026, 10, 24, 14, 40);

export const DEFAULT_SITE: SiteState = {
  name: "北京",
  latDeg: 39.9042,
  lonDeg: 116.4074,
  zoneHours: 8,
};

export function createDocument(): DomeDocument {
  return {
    version: 1,
    site: { ...DEFAULT_SITE },
    clock: { utcMillis: DEFAULT_UTC, playing: false, rate: 600 },
    view: { centerAlt: 42, centerAz: 150, fovDeg: 96 },
    selectionId: null,
    plans: [
      {
        id: "tonight",
        name: "今晚",
        bodyIds: ["polaris", "vega", "capella", "aldebaran", "betelgeuse", "sirius", "jupiter", "moon"],
      },
    ],
    activePlanId: "tonight",
  };
}

export function resetView(dome: DomeDocument): void {
  dome.view.centerAlt = 42;
  dome.view.centerAz = 150;
  dome.view.fovDeg = 96;
}
