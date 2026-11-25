import { normalize } from '../../../shared/math'
import type { Wind, WindMode } from '../../../shared/race'

export function windAt(time: number, mode: WindMode): Wind {
  if (mode === 'steady') return { bearing: 265, knots: 15 }
  return {
    bearing: normalize(265 + 25 * Math.sin(time / 5.8) + 11 * Math.sin(time / 2.1)),
    knots: 15 + 3 * Math.sin(time / 4.8) + 1.2 * Math.sin(time / 1.7),
  }
}
