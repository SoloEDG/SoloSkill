import { equatorial } from "../src/features/catalog/lib/positions";
import { frameOn } from "../src/features/sky/lib/frame";
import { toHorizontal } from "../src/features/sky/lib/horizontal";
import { DEFAULT_SITE, DEFAULT_UTC } from "../src/shared/document";
import type { ViewState } from "../src/shared/types";

const failures: string[] = [];
function check(name: string, ok: boolean, detail: string): void {
  if (!ok) failures.push(`${name}: ${detail}`);
  else console.log(`ok ${name}: ${detail}`);
}

const polaris = equatorial("polaris", DEFAULT_UTC);
if (!polaris) throw new Error("missing polaris");
const polar = toHorizontal(polaris.raDeg, polaris.decDeg, DEFAULT_SITE, DEFAULT_UTC);
check("polaris alt", polar.altDeg > 38 && polar.altDeg < 44, polar.altDeg.toFixed(2));
check("polaris az", polar.azDeg < 20 || polar.azDeg > 340, polar.azDeg.toFixed(2));

const sun = equatorial("sun", DEFAULT_UTC);
if (!sun) throw new Error("missing sun");
const sunHz = toHorizontal(sun.raDeg, sun.decDeg, DEFAULT_SITE, DEFAULT_UTC);
check("evening sun down", sunHz.altDeg < -5, sunHz.altDeg.toFixed(2));

const noon = Date.UTC(2026, 10, 24, 4, 0);
const noonSun = equatorial("sun", noon);
if (!noonSun) throw new Error("missing noon sun");
const noonHz = toHorizontal(noonSun.raDeg, noonSun.decDeg, DEFAULT_SITE, noon);
check("noon sun up", noonHz.altDeg > 20, noonHz.altDeg.toFixed(2));

const moonA = equatorial("moon", DEFAULT_UTC);
const moonB = equatorial("moon", DEFAULT_UTC + 86_400_000);
if (!moonA || !moonB) throw new Error("missing moon");
const moonShift = Math.abs(moonB.raDeg - moonA.raDeg);
check("moon moves", moonShift > 5 && moonShift < 20, `${moonA.raDeg.toFixed(2)} -> ${moonB.raDeg.toFixed(2)}`);
check("moon phase", moonA.phase !== null && moonA.phase >= 0 && moonA.phase <= 1, String(moonA.phase));

const jupiter = equatorial("jupiter", DEFAULT_UTC);
check("jupiter", Boolean(jupiter && Number.isFinite(jupiter.raDeg) && Math.abs(jupiter.decDeg) < 30), JSON.stringify(jupiter));

const view: ViewState = { centerAlt: 40, centerAz: 10, fovDeg: 90 };
frameOn(view, -8, 123);
check("frame low", view.centerAlt === 28 && Math.abs(view.centerAz - 123) < 0.01, JSON.stringify(view));
frameOn(view, 60, 200);
check("frame high", view.centerAlt === 60 && view.centerAz === 200, JSON.stringify(view));

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
