import { wrap360 } from "@/shared/angles";

export function julianDay(utcMillis: number): number {
  return utcMillis / 86_400_000 + 2_440_587.5;
}

export function julianCentury(utcMillis: number): number {
  return (julianDay(utcMillis) - 2_451_545) / 36_525;
}

export function daysSinceJ2000(utcMillis: number): number {
  return julianDay(utcMillis) - 2_451_545;
}

export function greenwichSiderealDeg(utcMillis: number): number {
  const day = julianDay(utcMillis) - 2_451_545;
  return wrap360(280.46061837 + 360.98564736629 * day);
}

export function localSiderealDeg(utcMillis: number, lonDeg: number): number {
  return wrap360(greenwichSiderealDeg(utcMillis) + lonDeg);
}

export function formatSidereal(lstDeg: number): string {
  const hours = wrap360(lstDeg) / 15;
  const whole = Math.floor(hours);
  const minutes = Math.floor((hours - whole) * 60);
  return `${whole}h${String(minutes).padStart(2, "0")}m`;
}

export function zonedToUtc(value: string, zoneHours: number): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return null;
  return Date.UTC(year, month - 1, day, hour, minute) - zoneHours * 3_600_000;
}

export function utcToZonedInput(utcMillis: number, zoneHours: number): string {
  const shifted = new Date(utcMillis + zoneHours * 3_600_000);
  const pad = (value: number) => String(value).padStart(2, "0");
  const month = pad(shifted.getUTCMonth() + 1);
  const day = pad(shifted.getUTCDate());
  const hour = pad(shifted.getUTCHours());
  const minute = pad(shifted.getUTCMinutes());
  return `${shifted.getUTCFullYear()}-${month}-${day}T${hour}:${minute}`;
}

export function formatCivil(utcMillis: number, zoneHours: number): string {
  const input = utcToZonedInput(utcMillis, zoneHours);
  return input.replace("T", " ");
}
