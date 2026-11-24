import { radToDeg, wrap360 } from "@/shared/angles";
import { julianCentury } from "@/shared/time";

interface Elements {
  id: string;
  name: string;
  alias: string;
  mag: number;
  a0: number;
  ad: number;
  e0: number;
  ed: number;
  i0: number;
  iDot: number;
  L0: number;
  Ld: number;
  w0: number;
  wd: number;
  O0: number;
  Od: number;
}

const PLANETS: Elements[] = [
  { id: "mercury", name: "水星", alias: "Mercury", mag: -0.4, a0: 0.38709927, ad: 0.00000037, e0: 0.20563593, ed: 0.00001906, i0: 7.00497902, iDot: -0.00594749, L0: 252.2503235, Ld: 149472.67411175, w0: 77.45779628, wd: 0.16047689, O0: 48.33076593, Od: -0.12534081 },
  { id: "venus", name: "金星", alias: "Venus", mag: -4.2, a0: 0.72333566, ad: 0.0000039, e0: 0.00677672, ed: -0.00004107, i0: 3.39467605, iDot: -0.0007889, L0: 181.9790995, Ld: 58517.81538729, w0: 131.60246718, wd: 0.00268329, O0: 76.67984255, Od: -0.27769418 },
  { id: "earth", name: "地球", alias: "Earth", mag: 0, a0: 1.00000261, ad: 0.00000562, e0: 0.01671123, ed: -0.00004392, i0: -0.00001531, iDot: -0.01294668, L0: 100.46457166, Ld: 35999.37244981, w0: 102.93768193, wd: 0.32327364, O0: 0, Od: 0 },
  { id: "mars", name: "火星", alias: "Mars", mag: -0.2, a0: 1.52371034, ad: 0.00001847, e0: 0.0933941, ed: 0.00007882, i0: 1.84969142, iDot: -0.00813131, L0: -4.55343205, Ld: 19140.30268499, w0: -23.94362959, wd: 0.44441088, O0: 49.55953891, Od: -0.29257343 },
  { id: "jupiter", name: "木星", alias: "Jupiter", mag: -2.3, a0: 5.202887, ad: -0.00011607, e0: 0.04838624, ed: -0.00013253, i0: 1.30439695, iDot: -0.00183714, L0: 34.39644051, Ld: 3034.74612775, w0: 14.72847983, wd: 0.21252668, O0: 100.47390909, Od: 0.20469106 },
  { id: "saturn", name: "土星", alias: "Saturn", mag: 0.4, a0: 9.53667594, ad: -0.0012506, e0: 0.05386179, ed: -0.00050991, i0: 2.48599187, iDot: 0.00193609, L0: 49.95424423, Ld: 1222.49362201, w0: 92.59887831, wd: -0.41897216, O0: 113.66242448, Od: -0.28867794 },
];

export interface EqPoint {
  raDeg: number;
  decDeg: number;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const rad = (deg: number) => (deg * Math.PI) / 180;

function solveEccentric(mean: number, eccentricity: number): number {
  let eccentric = mean;
  for (let step = 0; step < 8; step += 1) {
    eccentric = mean + eccentricity * Math.sin(eccentric);
  }
  return eccentric;
}

function heliocentric(body: Elements, century: number): Vec3 {
  const semi = body.a0 + body.ad * century;
  const ecc = body.e0 + body.ed * century;
  const incline = rad(body.i0 + body.iDot * century);
  const meanLong = rad(body.L0 + body.Ld * century);
  const peri = rad(body.w0 + body.wd * century);
  const node = rad(body.O0 + body.Od * century);
  let mean = meanLong - peri;
  mean = Math.atan2(Math.sin(mean), Math.cos(mean));
  const eccentric = solveEccentric(mean, ecc);
  const xv = semi * (Math.cos(eccentric) - ecc);
  const yv = semi * Math.sqrt(Math.max(0, 1 - ecc * ecc)) * Math.sin(eccentric);
  const angle = Math.atan2(yv, xv);
  const radius = Math.hypot(xv, yv);
  const argument = angle + peri - node;
  const cosArg = Math.cos(argument);
  const sinArg = Math.sin(argument);
  return {
    x: radius * (Math.cos(node) * cosArg - Math.sin(node) * sinArg * Math.cos(incline)),
    y: radius * (Math.sin(node) * cosArg + Math.cos(node) * sinArg * Math.cos(incline)),
    z: radius * (sinArg * Math.sin(incline)),
  };
}

function toEquatorial(vector: Vec3, century: number): EqPoint {
  const tilt = rad(23.439291 - 0.0130042 * century);
  const x = vector.x;
  const y = vector.y * Math.cos(tilt) - vector.z * Math.sin(tilt);
  const z = vector.y * Math.sin(tilt) + vector.z * Math.cos(tilt);
  return {
    raDeg: wrap360(radToDeg(Math.atan2(y, x))),
    decDeg: radToDeg(Math.atan2(z, Math.hypot(x, y))),
  };
}

export function planetCatalog(): Array<Pick<Elements, "id" | "name" | "alias" | "mag">> {
  return PLANETS.filter((item) => item.id !== "earth").map(({ id, name, alias, mag }) => ({ id, name, alias, mag }));
}

export function planetEquatorial(id: string, utcMillis: number): EqPoint | null {
  const century = julianCentury(utcMillis);
  const earth = PLANETS.find((item) => item.id === "earth");
  const body = PLANETS.find((item) => item.id === id);
  if (!earth || !body || id === "earth") return null;
  const origin = heliocentric(earth, century);
  const place = heliocentric(body, century);
  return toEquatorial(
    { x: place.x - origin.x, y: place.y - origin.y, z: place.z - origin.z },
    century,
  );
}

export function earthEquatorial(utcMillis: number): EqPoint {
  const century = julianCentury(utcMillis);
  const earth = PLANETS.find((item) => item.id === "earth");
  if (!earth) return { raDeg: 0, decDeg: 0 };
  const place = heliocentric(earth, century);
  const sun = toEquatorial({ x: -place.x, y: -place.y, z: -place.z }, century);
  return sun;
}
