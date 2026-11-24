export interface SiteState {
  name: string;
  latDeg: number;
  lonDeg: number;
  zoneHours: number;
}

export interface ClockState {
  utcMillis: number;
  playing: boolean;
  rate: number;
}

export interface ViewState {
  centerAlt: number;
  centerAz: number;
  fovDeg: number;
}

export interface PlanRecord {
  id: string;
  name: string;
  bodyIds: string[];
}

export interface DomeDocument {
  version: 1;
  site: SiteState;
  clock: ClockState;
  view: ViewState;
  selectionId: string | null;
  plans: PlanRecord[];
  activePlanId: string;
}

export type BodyKind = "star" | "planet" | "sun" | "moon";

export interface Notice {
  tone: "info" | "warn";
  text: string;
}
