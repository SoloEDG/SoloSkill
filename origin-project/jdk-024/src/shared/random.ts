export function random(seed: number): [number, number] {
  const next = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return [next / 4294967296, next];
}
export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}
