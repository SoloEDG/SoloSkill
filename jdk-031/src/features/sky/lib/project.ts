import { clamp, degToRad, wrap360 } from "@/shared/angles";
import type { ViewState } from "@/shared/types";

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
  thetaDeg: number;
}

function horizontalVector(altDeg: number, azDeg: number): Vec3 {
  const alt = degToRad(altDeg);
  const az = degToRad(azDeg);
  const flat = Math.cos(alt);
  return { x: flat * Math.sin(az), y: flat * Math.cos(az), z: Math.sin(alt) };
}

function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
}

function normalize(value: Vec3): Vec3 {
  const span = Math.hypot(value.x, value.y, value.z) || 1;
  return { x: value.x / span, y: value.y / span, z: value.z / span };
}

export function projectAltAz(
  altDeg: number,
  azDeg: number,
  view: ViewState,
  radiusPx: number,
  originX: number,
  originY: number,
): ScreenPoint | null {
  const center = horizontalVector(view.centerAlt, view.centerAz);
  const point = horizontalVector(altDeg, azDeg);
  const cosine = clamp(dot(center, point), -1, 1);
  const theta = Math.acos(cosine);
  const limit = degToRad(view.fovDeg / 2);
  if (theta > limit) return null;
  if (theta < 1e-4) return { x: originX, y: originY, thetaDeg: 0 };
  const eastRaw = cross({ x: 0, y: 0, z: 1 }, center);
  const east = normalize(Math.hypot(eastRaw.x, eastRaw.y, eastRaw.z) < 1e-4 ? { x: 1, y: 0, z: 0 } : eastRaw);
  const upward = normalize(cross(center, east));
  const ex = dot(point, east);
  const ey = dot(point, upward);
  const span = Math.hypot(ex, ey) || 1;
  const radius = (theta / limit) * radiusPx;
  return {
    x: originX - (ex / span) * radius,
    y: originY - (ey / span) * radius,
    thetaDeg: (theta * 180) / Math.PI,
  };
}

export function dragView(view: ViewState, dx: number, dy: number, radiusPx: number): void {
  const scale = view.fovDeg / Math.max(40, radiusPx * 2);
  const altitude = clamp(view.centerAlt + dy * scale, 8, 82);
  const cosine = Math.cos(degToRad(clamp(view.centerAlt, 8, 82)));
  view.centerAlt = altitude;
  view.centerAz = wrap360(view.centerAz - (dx * scale) / Math.max(0.22, cosine));
}

export function zoomView(view: ViewState, wheel: number): void {
  const next = view.fovDeg * (wheel > 0 ? 1.07 : 0.93);
  view.fovDeg = clamp(next, 22, 110);
}
