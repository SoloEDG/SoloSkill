import { degToRad, radToDeg, wrap360 } from "@/shared/angles";
import { daysSinceJ2000 } from "@/shared/time";
import { earthEquatorial, type EqPoint } from "@/features/catalog/lib/orbits";

export interface MoonPoint extends EqPoint {
  phase: number;
  distanceEarthRadii: number;
}

function lunarVector(day: number): { x: number; y: number; z: number; distance: number } {
  const node = degToRad(125.1228 - 0.0529538083 * day);
  const argument = degToRad(318.0634 + 0.1643573223 * day);
  const anomaly = degToRad(115.3654 + 13.0649929509 * day);
  const incline = degToRad(5.1454);
  const eccentricity = 0.0549;
  const anomalyNow = Math.atan2(Math.sin(anomaly), Math.cos(anomaly));
  let eccentric = anomalyNow + eccentricity * Math.sin(anomalyNow) * (1 + eccentricity * Math.cos(anomalyNow));
  for (let step = 0; step < 6; step += 1) {
    eccentric = anomalyNow + eccentricity * Math.sin(eccentric);
  }
  const semi = 60.2666;
  const xv = semi * (Math.cos(eccentric) - eccentricity);
  const yv = semi * Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(eccentric);
  const trueAnomaly = Math.atan2(yv, xv);
  const distance = Math.hypot(xv, yv);
  const angle = trueAnomaly + argument;
  return {
    x: distance * (Math.cos(node) * Math.cos(angle) - Math.sin(node) * Math.sin(angle) * Math.cos(incline)),
    y: distance * (Math.sin(node) * Math.cos(angle) + Math.cos(node) * Math.sin(angle) * Math.cos(incline)),
    z: distance * Math.sin(angle) * Math.sin(incline),
    distance,
  };
}

function equatorialOf(x: number, y: number, z: number, day: number): EqPoint {
  const tilt = degToRad(23.4393 - 3.563e-7 * day);
  const xe = x;
  const ye = y * Math.cos(tilt) - z * Math.sin(tilt);
  const ze = y * Math.sin(tilt) + z * Math.cos(tilt);
  return {
    raDeg: wrap360(radToDeg(Math.atan2(ye, xe))),
    decDeg: radToDeg(Math.atan2(ze, Math.hypot(xe, ye))),
  };
}

export function sunEquatorial(utcMillis: number): EqPoint {
  return earthEquatorial(utcMillis);
}

export function moonEquatorial(utcMillis: number): MoonPoint {
  const day = daysSinceJ2000(utcMillis);
  const moon = lunarVector(day);
  const place = equatorialOf(moon.x, moon.y, moon.z, day);
  const sun = sunEquatorial(utcMillis);
  const elongation = angularSeparation(place.raDeg, place.decDeg, sun.raDeg, sun.decDeg);
  const phase = (1 - Math.cos(degToRad(elongation))) / 2;
  return { ...place, phase, distanceEarthRadii: moon.distance };
}

export function angularSeparation(ra1: number, dec1: number, ra2: number, dec2: number): number {
  const a1 = degToRad(ra1);
  const d1 = degToRad(dec1);
  const a2 = degToRad(ra2);
  const d2 = degToRad(dec2);
  const cos =
    Math.sin(d1) * Math.sin(d2) + Math.cos(d1) * Math.cos(d2) * Math.cos(a1 - a2);
  return radToDeg(Math.acos(Math.max(-1, Math.min(1, cos))));
}
