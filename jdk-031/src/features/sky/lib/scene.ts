import { equatorial, FIGURES, listBodies } from "@/features/catalog";
import { toHorizontal } from "@/features/sky/lib/horizontal";
import { projectAltAz, type ScreenPoint } from "@/features/sky/lib/project";
import type { DomeDocument } from "@/shared/types";

export interface PlacedBody {
  id: string;
  name: string;
  kind: "star" | "planet" | "sun" | "moon";
  mag: number;
  altDeg: number;
  azDeg: number;
  phase: number | null;
  above: boolean;
  inPlan: boolean;
  screen: ScreenPoint | null;
}

export interface CardMark {
  label: string;
  screen: ScreenPoint;
}

export interface Scene {
  bodies: PlacedBody[];
  lines: Array<{ from: ScreenPoint; to: ScreenPoint }>;
  horizon: Array<ScreenPoint | null>;
  rings: Array<Array<ScreenPoint | null>>;
  cards: CardMark[];
  center: ScreenPoint;
  radius: number;
}

export function bodyHorizontal(id: string, dome: DomeDocument): { altDeg: number; azDeg: number } | null {
  const place = equatorial(id, dome.clock.utcMillis);
  if (!place) return null;
  return toHorizontal(place.raDeg, place.decDeg, dome.site, dome.clock.utcMillis);
}

export function buildScene(dome: DomeDocument, width: number, height: number): Scene {
  const radius = Math.max(40, Math.min(width, height) / 2 - 14);
  const originX = width / 2;
  const originY = height / 2;
  const project = (altDeg: number, azDeg: number) =>
    projectAltAz(altDeg, azDeg, dome.view, radius, originX, originY);
  const planIds = new Set(dome.plans.find((item) => item.id === dome.activePlanId)?.bodyIds ?? []);
  const bodies = listBodies().flatMap((body) => {
    const place = equatorial(body.id, dome.clock.utcMillis);
    if (!place) return [];
    const horizontal = toHorizontal(place.raDeg, place.decDeg, dome.site, dome.clock.utcMillis);
    return [
      {
        id: body.id,
        name: body.name,
        kind: body.kind,
        mag: place.mag,
        altDeg: horizontal.altDeg,
        azDeg: horizontal.azDeg,
        phase: place.phase,
        above: horizontal.altDeg > 0,
        inPlan: planIds.has(body.id),
        screen: project(horizontal.altDeg, horizontal.azDeg),
      },
    ];
  });
  const byId = new Map(bodies.map((body) => [body.id, body]));
  const lines = FIGURES.flatMap(([fromId, toId]) => {
    const from = byId.get(fromId)?.screen ?? null;
    const to = byId.get(toId)?.screen ?? null;
    return from && to ? [{ from, to }] : [];
  });
  const cards = [
    { label: "北", az: 0 },
    { label: "东", az: 90 },
    { label: "南", az: 180 },
    { label: "西", az: 270 },
  ].flatMap((item) => {
    const screen = project(0, item.az);
    return screen ? [{ label: item.label, screen }] : [];
  });
  return {
    bodies,
    lines,
    horizon: sampleRing(0, project),
    rings: [30, 60].map((alt) => sampleRing(alt, project)),
    cards,
    center: { x: originX, y: originY, thetaDeg: 0 },
    radius,
  };
}

function sampleRing(
  altDeg: number,
  project: (altDeg: number, azDeg: number) => ScreenPoint | null,
): Array<ScreenPoint | null> {
  const points: Array<ScreenPoint | null> = [];
  for (let az = 0; az <= 360; az += 3) points.push(project(altDeg, az));
  return points;
}
