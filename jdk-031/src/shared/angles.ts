export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function wrap360(deg: number): number {
  const turned = deg % 360;
  return turned < 0 ? turned + 360 : turned;
}

export function wrapSigned(deg: number): number {
  const full = wrap360(deg);
  return full > 180 ? full - 360 : full;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatSigned(deg: number, digits = 1): string {
  const sign = deg >= 0 ? "+" : "−";
  return `${sign}${Math.abs(deg).toFixed(digits)}°`;
}

export function formatAzimuth(deg: number): string {
  return `${wrap360(deg).toFixed(0)}°`;
}
