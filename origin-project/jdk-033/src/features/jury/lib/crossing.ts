import { axis, dot, pointAt, subtract } from '../../../shared/math'
import type { Gate, Point } from '../../../shared/race'

export function gateCrossing(gate: Pick<Gate, 'center' | 'bearing' | 'width'>, from: Point, to: Point): { fraction: number; point: Point } | null {
  const forward = axis(gate.bearing)
  const start = dot(subtract(from, gate.center), forward)
  const end = dot(subtract(to, gate.center), forward)
  if (start >= 0 || end < 0 || start === end) return null
  const fraction = -start / (end - start)
  const point = pointAt(from, to, fraction)
  const across = dot(subtract(point, gate.center), axis(gate.bearing + 90))
  return Math.abs(across) <= gate.width / 2 ? { fraction, point } : null
}
