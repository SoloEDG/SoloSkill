"use strict";

// jdk-031/src/shared/angles.ts
function degToRad(deg) {
  return deg * Math.PI / 180;
}
function radToDeg(rad2) {
  return rad2 * 180 / Math.PI;
}
function wrap360(deg) {
  const turned = deg % 360;
  return turned < 0 ? turned + 360 : turned;
}
function wrapSigned(deg) {
  const full = wrap360(deg);
  return full > 180 ? full - 360 : full;
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// jdk-031/src/shared/time.ts
function julianDay(utcMillis) {
  return utcMillis / 864e5 + 24405875e-1;
}
function julianCentury(utcMillis) {
  return (julianDay(utcMillis) - 2451545) / 36525;
}
function daysSinceJ2000(utcMillis) {
  return julianDay(utcMillis) - 2451545;
}
function greenwichSiderealDeg(utcMillis) {
  const day = julianDay(utcMillis) - 2451545;
  return wrap360(280.46061837 + 360.98564736629 * day);
}
function localSiderealDeg(utcMillis, lonDeg) {
  return wrap360(greenwichSiderealDeg(utcMillis) + lonDeg);
}

// jdk-031/src/features/catalog/lib/orbits.ts
var PLANETS = [
  { id: "mercury", name: "\u6C34\u661F", alias: "Mercury", mag: -0.4, a0: 0.38709927, ad: 37e-8, e0: 0.20563593, ed: 1906e-8, i0: 7.00497902, iDot: -594749e-8, L0: 252.2503235, Ld: 149472.67411175, w0: 77.45779628, wd: 0.16047689, O0: 48.33076593, Od: -0.12534081 },
  { id: "venus", name: "\u91D1\u661F", alias: "Venus", mag: -4.2, a0: 0.72333566, ad: 39e-7, e0: 677672e-8, ed: -4107e-8, i0: 3.39467605, iDot: -7889e-7, L0: 181.9790995, Ld: 58517.81538729, w0: 131.60246718, wd: 268329e-8, O0: 76.67984255, Od: -0.27769418 },
  { id: "earth", name: "\u5730\u7403", alias: "Earth", mag: 0, a0: 1.00000261, ad: 562e-8, e0: 0.01671123, ed: -4392e-8, i0: -1531e-8, iDot: -0.01294668, L0: 100.46457166, Ld: 35999.37244981, w0: 102.93768193, wd: 0.32327364, O0: 0, Od: 0 },
  { id: "mars", name: "\u706B\u661F", alias: "Mars", mag: -0.2, a0: 1.52371034, ad: 1847e-8, e0: 0.0933941, ed: 7882e-8, i0: 1.84969142, iDot: -813131e-8, L0: -4.55343205, Ld: 19140.30268499, w0: -23.94362959, wd: 0.44441088, O0: 49.55953891, Od: -0.29257343 },
  { id: "jupiter", name: "\u6728\u661F", alias: "Jupiter", mag: -2.3, a0: 5.202887, ad: -11607e-8, e0: 0.04838624, ed: -13253e-8, i0: 1.30439695, iDot: -183714e-8, L0: 34.39644051, Ld: 3034.74612775, w0: 14.72847983, wd: 0.21252668, O0: 100.47390909, Od: 0.20469106 },
  { id: "saturn", name: "\u571F\u661F", alias: "Saturn", mag: 0.4, a0: 9.53667594, ad: -12506e-7, e0: 0.05386179, ed: -50991e-8, i0: 2.48599187, iDot: 193609e-8, L0: 49.95424423, Ld: 1222.49362201, w0: 92.59887831, wd: -0.41897216, O0: 113.66242448, Od: -0.28867794 }
];
var rad = (deg) => deg * Math.PI / 180;
function solveEccentric(mean, eccentricity) {
  let eccentric = mean;
  for (let step = 0; step < 8; step += 1) {
    eccentric = mean + eccentricity * Math.sin(eccentric);
  }
  return eccentric;
}
function heliocentric(body, century) {
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
    z: radius * (sinArg * Math.sin(incline))
  };
}
function toEquatorial(vector, century) {
  const tilt = rad(23.439291 - 0.0130042 * century);
  const x = vector.x;
  const y = vector.y * Math.cos(tilt) - vector.z * Math.sin(tilt);
  const z = vector.y * Math.sin(tilt) + vector.z * Math.cos(tilt);
  return {
    raDeg: wrap360(radToDeg(Math.atan2(y, x))),
    decDeg: radToDeg(Math.atan2(z, Math.hypot(x, y)))
  };
}
function planetCatalog() {
  return PLANETS.filter((item) => item.id !== "earth").map(({ id, name, alias, mag }) => ({ id, name, alias, mag }));
}
function planetEquatorial(id, utcMillis) {
  const century = julianCentury(utcMillis);
  const earth = PLANETS.find((item) => item.id === "earth");
  const body = PLANETS.find((item) => item.id === id);
  if (!earth || !body || id === "earth") return null;
  const origin = heliocentric(earth, century);
  const place = heliocentric(body, century);
  return toEquatorial(
    { x: place.x - origin.x, y: place.y - origin.y, z: place.z - origin.z },
    century
  );
}
function earthEquatorial(utcMillis) {
  const century = julianCentury(utcMillis);
  const earth = PLANETS.find((item) => item.id === "earth");
  if (!earth) return { raDeg: 0, decDeg: 0 };
  const place = heliocentric(earth, century);
  const sun2 = toEquatorial({ x: -place.x, y: -place.y, z: -place.z }, century);
  return sun2;
}

// jdk-031/src/features/catalog/lib/solar.ts
function lunarVector(day) {
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
    distance
  };
}
function equatorialOf(x, y, z, day) {
  const tilt = degToRad(23.4393 - 3563e-10 * day);
  const xe = x;
  const ye = y * Math.cos(tilt) - z * Math.sin(tilt);
  const ze = y * Math.sin(tilt) + z * Math.cos(tilt);
  return {
    raDeg: wrap360(radToDeg(Math.atan2(ye, xe))),
    decDeg: radToDeg(Math.atan2(ze, Math.hypot(xe, ye)))
  };
}
function sunEquatorial(utcMillis) {
  return earthEquatorial(utcMillis);
}
function moonEquatorial(utcMillis) {
  const day = daysSinceJ2000(utcMillis);
  const moon = lunarVector(day);
  const place = equatorialOf(moon.x, moon.y, moon.z, day);
  const sun2 = sunEquatorial(utcMillis);
  const elongation = angularSeparation(place.raDeg, place.decDeg, sun2.raDeg, sun2.decDeg);
  const phase = (1 - Math.cos(degToRad(elongation))) / 2;
  return { ...place, phase, distanceEarthRadii: moon.distance };
}
function angularSeparation(ra1, dec1, ra2, dec2) {
  const a1 = degToRad(ra1);
  const d1 = degToRad(dec1);
  const a2 = degToRad(ra2);
  const d2 = degToRad(dec2);
  const cos = Math.sin(d1) * Math.sin(d2) + Math.cos(d1) * Math.cos(d2) * Math.cos(a1 - a2);
  return radToDeg(Math.acos(Math.max(-1, Math.min(1, cos))));
}

// jdk-031/src/features/catalog/lib/stars.ts
var STARS = [
  { id: "polaris", name: "\u52FE\u9648\u4E00", alias: "Polaris", raDeg: 37.954, decDeg: 89.264, mag: 1.98 },
  { id: "dubhe", name: "\u5929\u67A2", alias: "Dubhe", raDeg: 165.932, decDeg: 61.751, mag: 1.79 },
  { id: "merak", name: "\u5929\u7487", alias: "Merak", raDeg: 165.46, decDeg: 56.382, mag: 2.37 },
  { id: "phecda", name: "\u5929\u7391", alias: "Phecda", raDeg: 178.457, decDeg: 53.695, mag: 2.44 },
  { id: "megrez", name: "\u5929\u6743", alias: "Megrez", raDeg: 183.857, decDeg: 57.033, mag: 3.31 },
  { id: "alioth", name: "\u7389\u8861", alias: "Alioth", raDeg: 193.507, decDeg: 55.96, mag: 1.77 },
  { id: "mizar", name: "\u5F00\u9633", alias: "Mizar", raDeg: 200.981, decDeg: 54.925, mag: 2.27 },
  { id: "alkaid", name: "\u6447\u5149", alias: "Alkaid", raDeg: 206.885, decDeg: 49.313, mag: 1.86 },
  { id: "schedar", name: "\u738B\u826F\u56DB", alias: "Schedar", raDeg: 10.127, decDeg: 56.537, mag: 2.24 },
  { id: "caph", name: "\u738B\u826F\u4E00", alias: "Caph", raDeg: 2.295, decDeg: 59.15, mag: 2.28 },
  { id: "cih", name: "\u7B56", alias: "Cih", raDeg: 14.177, decDeg: 60.717, mag: 2.15 },
  { id: "ruchbah", name: "\u9601\u9053\u4E09", alias: "Ruchbah", raDeg: 21.454, decDeg: 60.235, mag: 2.68 },
  { id: "segin", name: "\u9601\u9053\u4E8C", alias: "Segin", raDeg: 28.599, decDeg: 63.67, mag: 3.35 },
  { id: "algol", name: "\u5927\u9675\u4E94", alias: "Algol", raDeg: 47.042, decDeg: 40.956, mag: 2.12 },
  { id: "hamal", name: "\u5A04\u5BBF\u4E09", alias: "Hamal", raDeg: 31.793, decDeg: 23.462, mag: 2.01 },
  { id: "aldebaran", name: "\u6BD5\u5BBF\u4E94", alias: "Aldebaran", raDeg: 68.98, decDeg: 16.509, mag: 0.87 },
  { id: "capella", name: "\u4E94\u8F66\u4E8C", alias: "Capella", raDeg: 79.172, decDeg: 45.998, mag: 0.08 },
  { id: "rigel", name: "\u53C2\u5BBF\u4E03", alias: "Rigel", raDeg: 78.634, decDeg: -8.202, mag: 0.13 },
  { id: "bellatrix", name: "\u53C2\u5BBF\u4E94", alias: "Bellatrix", raDeg: 81.283, decDeg: 6.35, mag: 1.64 },
  { id: "mintaka", name: "\u53C2\u5BBF\u4E09", alias: "Mintaka", raDeg: 83.002, decDeg: -0.299, mag: 2.25 },
  { id: "alnilam", name: "\u53C2\u5BBF\u4E8C", alias: "Alnilam", raDeg: 84.053, decDeg: -1.202, mag: 1.69 },
  { id: "alnitak", name: "\u53C2\u5BBF\u4E00", alias: "Alnitak", raDeg: 85.19, decDeg: -1.943, mag: 1.77 },
  { id: "betelgeuse", name: "\u53C2\u5BBF\u56DB", alias: "Betelgeuse", raDeg: 88.793, decDeg: 7.407, mag: 0.45 },
  { id: "saiph", name: "\u53C2\u5BBF\u516D", alias: "Saiph", raDeg: 86.939, decDeg: -9.67, mag: 2.07 },
  { id: "sirius", name: "\u5929\u72FC", alias: "Sirius", raDeg: 101.287, decDeg: -16.716, mag: -1.46 },
  { id: "procyon", name: "\u5357\u6CB3\u4E09", alias: "Procyon", raDeg: 114.825, decDeg: 5.225, mag: 0.34 },
  { id: "castor", name: "\u5317\u6CB3\u4E8C", alias: "Castor", raDeg: 113.65, decDeg: 31.888, mag: 1.58 },
  { id: "pollux", name: "\u5317\u6CB3\u4E09", alias: "Pollux", raDeg: 116.329, decDeg: 28.026, mag: 1.14 },
  { id: "alphard", name: "\u661F\u5BBF\u4E00", alias: "Alphard", raDeg: 141.897, decDeg: -8.659, mag: 1.99 },
  { id: "regulus", name: "\u8F69\u8F95\u5341\u56DB", alias: "Regulus", raDeg: 152.093, decDeg: 11.967, mag: 1.4 },
  { id: "denebola", name: "\u4E94\u5E1D\u5EA7\u4E00", alias: "Denebola", raDeg: 177.265, decDeg: 14.572, mag: 2.14 },
  { id: "acrux", name: "\u5341\u5B57\u67B6\u4E8C", alias: "Acrux", raDeg: 186.649, decDeg: -63.099, mag: 0.77 },
  { id: "spica", name: "\u89D2\u5BBF\u4E00", alias: "Spica", raDeg: 201.298, decDeg: -11.161, mag: 0.98 },
  { id: "arcturus", name: "\u5927\u89D2", alias: "Arcturus", raDeg: 213.915, decDeg: 19.182, mag: -0.05 },
  { id: "alphecca", name: "\u8D2F\u7D22\u56DB", alias: "Alphecca", raDeg: 233.672, decDeg: 26.715, mag: 2.22 },
  { id: "antares", name: "\u5FC3\u5BBF\u4E8C", alias: "Antares", raDeg: 247.352, decDeg: -26.432, mag: 1.06 },
  { id: "shaula", name: "\u5C3E\u5BBF\u516B", alias: "Shaula", raDeg: 263.402, decDeg: -37.104, mag: 1.62 },
  { id: "vega", name: "\u7EC7\u5973", alias: "Vega", raDeg: 279.234, decDeg: 38.784, mag: 0.03 },
  { id: "altair", name: "\u6CB3\u9F13\u4E8C", alias: "Altair", raDeg: 297.696, decDeg: 8.868, mag: 0.76 },
  { id: "deneb", name: "\u5929\u6D25\u56DB", alias: "Deneb", raDeg: 310.358, decDeg: 45.28, mag: 1.25 },
  { id: "fomalhaut", name: "\u5317\u843D\u5E08\u95E8", alias: "Fomalhaut", raDeg: 344.413, decDeg: -29.622, mag: 1.16 },
  { id: "scheat", name: "\u5BA4\u5BBF\u4E8C", alias: "Scheat", raDeg: 345.944, decDeg: 28.083, mag: 2.44 },
  { id: "markab", name: "\u5BA4\u5BBF\u4E00", alias: "Markab", raDeg: 346.19, decDeg: 15.205, mag: 2.49 },
  { id: "algenib", name: "\u58C1\u5BBF\u4E00", alias: "Algenib", raDeg: 3.309, decDeg: 15.184, mag: 2.83 },
  { id: "alpheratz", name: "\u58C1\u5BBF\u4E8C", alias: "Alpheratz", raDeg: 2.097, decDeg: 29.09, mag: 2.07 },
  { id: "canopus", name: "\u8001\u4EBA", alias: "Canopus", raDeg: 95.988, decDeg: -52.696, mag: -0.74 }
];

// jdk-031/src/features/catalog/lib/positions.ts
var SUN = { id: "sun", name: "\u592A\u9633", alias: "Sun", kind: "sun", mag: -26.7 };
var MOON = { id: "moon", name: "\u6708\u4EAE", alias: "Moon", kind: "moon", mag: -12.6 };
function equatorial(id, utcMillis) {
  if (id === "sun") {
    const sun2 = sunEquatorial(utcMillis);
    return { ...sun2, mag: SUN.mag, phase: null };
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

// jdk-031/src/features/sky/lib/frame.ts
function frameOn(view2, altDeg, azDeg) {
  view2.centerAz = wrap360(azDeg);
  view2.centerAlt = altDeg >= 20 ? clamp(altDeg, 20, 78) : 28;
}

// jdk-031/src/features/sky/lib/horizontal.ts
function toHorizontal(raDeg, decDeg, site, utcMillis) {
  const hour = degToRad(wrapSigned(localSiderealDeg(utcMillis, site.lonDeg) - raDeg));
  const dec = degToRad(decDeg);
  const lat = degToRad(site.latDeg);
  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(hour);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const azFromSouth = Math.atan2(
    Math.sin(hour),
    Math.cos(hour) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat)
  );
  return { altDeg: radToDeg(alt), azDeg: wrap360(radToDeg(azFromSouth) + 180) };
}

// jdk-031/src/shared/document.ts
var DEFAULT_UTC = Date.UTC(2026, 10, 24, 14, 40);
var DEFAULT_SITE = {
  name: "\u5317\u4EAC",
  latDeg: 39.9042,
  lonDeg: 116.4074,
  zoneHours: 8
};

// jdk-031/scripts/sky-check.ts
var failures = [];
function check(name, ok, detail) {
  if (!ok) failures.push(`${name}: ${detail}`);
  else console.log(`ok ${name}: ${detail}`);
}
var polaris = equatorial("polaris", DEFAULT_UTC);
if (!polaris) throw new Error("missing polaris");
var polar = toHorizontal(polaris.raDeg, polaris.decDeg, DEFAULT_SITE, DEFAULT_UTC);
check("polaris alt", polar.altDeg > 38 && polar.altDeg < 44, polar.altDeg.toFixed(2));
check("polaris az", polar.azDeg < 20 || polar.azDeg > 340, polar.azDeg.toFixed(2));
var sun = equatorial("sun", DEFAULT_UTC);
if (!sun) throw new Error("missing sun");
var sunHz = toHorizontal(sun.raDeg, sun.decDeg, DEFAULT_SITE, DEFAULT_UTC);
check("evening sun down", sunHz.altDeg < -5, sunHz.altDeg.toFixed(2));
var noon = Date.UTC(2026, 10, 24, 4, 0);
var noonSun = equatorial("sun", noon);
if (!noonSun) throw new Error("missing noon sun");
var noonHz = toHorizontal(noonSun.raDeg, noonSun.decDeg, DEFAULT_SITE, noon);
check("noon sun up", noonHz.altDeg > 20, noonHz.altDeg.toFixed(2));
var moonA = equatorial("moon", DEFAULT_UTC);
var moonB = equatorial("moon", DEFAULT_UTC + 864e5);
if (!moonA || !moonB) throw new Error("missing moon");
var moonShift = Math.abs(moonB.raDeg - moonA.raDeg);
check("moon moves", moonShift > 5 && moonShift < 20, `${moonA.raDeg.toFixed(2)} -> ${moonB.raDeg.toFixed(2)}`);
check("moon phase", moonA.phase !== null && moonA.phase >= 0 && moonA.phase <= 1, String(moonA.phase));
var jupiter = equatorial("jupiter", DEFAULT_UTC);
check("jupiter", Boolean(jupiter && Number.isFinite(jupiter.raDeg) && Math.abs(jupiter.decDeg) < 30), JSON.stringify(jupiter));
var view = { centerAlt: 40, centerAz: 10, fovDeg: 90 };
frameOn(view, -8, 123);
check("frame low", view.centerAlt === 28 && Math.abs(view.centerAz - 123) < 0.01, JSON.stringify(view));
frameOn(view, 60, 200);
check("frame high", view.centerAlt === 60 && view.centerAz === 200, JSON.stringify(view));
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
