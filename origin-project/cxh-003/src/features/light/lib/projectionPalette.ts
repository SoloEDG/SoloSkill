export function patchColor(color: string, opacity: number) {
  const value = color.replace('#', '');
  const n = Number.parseInt(value, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${opacity})`;
}

export function parseRgb(color: string) {
  const value = color.replace('#', '');
  const parsed = Number.parseInt(value, 16);
  return { r: (parsed >> 16) & 255, g: (parsed >> 8) & 255, b: parsed & 255 };
}

export function blendLight(color: string, energy: number) {
  const { r, g, b } = parseRgb(color);
  const factor = Math.max(0, Math.min(1, energy));
  return `rgb(${Math.round(r * factor)},${Math.round(g * factor)},${Math.round(b * factor)})`;
}

export function relativeLuminance(color: string) {
  const { r, g, b } = parseRgb(color);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}
