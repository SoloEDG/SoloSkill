export const minDuration = 2;
export const maxDuration = 12;
export const defaultDuration = 6;

export function phase(time: number, animation: Animation) {
  const length = animation.duration * 1000;
  return ((time % length + length) % length) / length * Math.PI * 2;
}

export function durationOf(value: number) {
  return Math.max(minDuration, Math.min(maxDuration, Math.round(value)));
}
import type { Animation } from '../../../shared/art';

