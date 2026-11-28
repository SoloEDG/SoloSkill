import type { SoundSource } from "../../../shared/types";
export function sourceIsAudible(source: SoundSource, time: number) {
  return (
    source.active && (time + source.phase) % source.interval < source.duration
  );
}
export function toneForSource(source: SoundSource, sampleRate: number) {
  const n = Math.max(1, Math.floor(source.duration * sampleRate)),
    data = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    data[i] =
      Math.sin(2 * Math.PI * source.pitch * t) *
      Math.min(1, t * 55) *
      Math.max(0, 1 - t / source.duration) *
      0.36;
  }
  return data;
}
