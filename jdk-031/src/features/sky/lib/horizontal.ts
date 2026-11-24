import { degToRad, radToDeg, wrap360, wrapSigned } from "@/shared/angles";
import { localSiderealDeg } from "@/shared/time";
import type { SiteState } from "@/shared/types";

export interface Horizontal {
  altDeg: number;
  azDeg: number;
}

export function toHorizontal(raDeg: number, decDeg: number, site: SiteState, utcMillis: number): Horizontal {
  const hour = degToRad(wrapSigned(localSiderealDeg(utcMillis, site.lonDeg) - raDeg));
  const dec = degToRad(decDeg);
  const lat = degToRad(site.latDeg);
  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(hour);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const azFromSouth = Math.atan2(
    Math.sin(hour),
    Math.cos(hour) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat),
  );
  return { altDeg: radToDeg(alt), azDeg: wrap360(radToDeg(azFromSouth) + 180) };
}
