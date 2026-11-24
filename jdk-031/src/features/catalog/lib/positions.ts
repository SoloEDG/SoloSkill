import type { BodyKind } from "@/shared/types";
import { planetCatalog, planetEquatorial } from "@/features/catalog/lib/orbits";
import { moonEquatorial, sunEquatorial } from "@/features/catalog/lib/solar";
import { STARS } from "@/features/catalog/lib/stars";

export interface CatalogBody {
  id: string;
  name: string;
  alias: string;
  kind: BodyKind;
  mag: number;
}

export interface SkyPoint {
  raDeg: number;
  decDeg: number;
  mag: number;
  phase: number | null;
}

const SUN: CatalogBody = { id: "sun", name: "太阳", alias: "Sun", kind: "sun", mag: -26.7 };
const MOON: CatalogBody = { id: "moon", name: "月亮", alias: "Moon", kind: "moon", mag: -12.6 };

export function listBodies(): CatalogBody[] {
  const planets = planetCatalog().map((item) => ({ ...item, kind: "planet" as const }));
  const stars = STARS.map((item) => ({
    id: item.id,
    name: item.name,
    alias: item.alias,
    kind: "star" as const,
    mag: item.mag,
  }));
  return [SUN, MOON, ...planets, ...stars];
}

export function findBody(id: string): CatalogBody | null {
  return listBodies().find((item) => item.id === id) ?? null;
}

export function equatorial(id: string, utcMillis: number): SkyPoint | null {
  if (id === "sun") {
    const sun = sunEquatorial(utcMillis);
    return { ...sun, mag: SUN.mag, phase: null };
  }
  if (id === "moon") {
    const moon = moonEquatorial(utcMillis);
    return { raDeg: moon.raDeg, decDeg: moon.decDeg, mag: MOON.mag, phase: moon.phase };
  }
  const planet = planetCatalog().find((item) => item.id === id);
  if (planet) {
    const place = planetEquatorial(id, utcMillis);
    if (!place) return null;
    return { ...place, mag: planet.mag, phase: null };
  }
  const star = STARS.find((item) => item.id === id);
  if (!star) return null;
  return { raDeg: star.raDeg, decDeg: star.decDeg, mag: star.mag, phase: null };
}
