import type { Symmetry } from '../../../shared/art';
export const defaults: Symmetry = { count: 8, axis: 0, mirror: true };
export const divisions = [3,4,5,6,8,10,12,16];

export function radians(degrees: number) {
  return degrees * Math.PI / 180;
}

export function angleAt(options: Symmetry, sector: number) {
  return radians(options.axis) + 2 * Math.PI * sector / options.count;
}
