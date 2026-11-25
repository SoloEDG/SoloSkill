import { axis, clamp, distance, dot, pointAt, subtract } from '../../../shared/math'
import type { Course, Gate, Point } from '../../../shared/race'

export function gateEnds(gate: Pick<Gate, 'center' | 'bearing' | 'width'>): [Point, Point] {
  const across = axis(gate.bearing + 90)
  const half = gate.width / 2
  return [
    { x: gate.center.x - across.x * half, y: gate.center.y - across.y * half },
    { x: gate.center.x + across.x * half, y: gate.center.y + across.y * half },
  ]
}

export const buoyPosition = (gate: Gate) => gateEnds(gate)[gate.buoySide === -1 ? 0 : 1]

export function inspectWater(course: Course, position: Point, margin = 0): string[] {
  const contacts = course.hazards.filter(h => distance(h.center, position) <= h.radius + 5 + margin).map(h => h.id)
  for (const gate of course.gates) {
    if (distance(buoyPosition(gate), position) <= 13 + margin) contacts.push(gate.name)
  }
  const border = 12 + margin
  if (position.x < border || position.x > course.size.x - border || position.y < border || position.y > course.size.y - border) {
    contacts.push('航域边界')
  }
  return contacts
}

export function isOffCourse(from: Point, gate: Gate, position: Point): boolean {
  const courseAxis = subtract(gate.center, from)
  const ratio = clamp(dot(subtract(position, from), courseAxis) / dot(courseAxis, courseAxis), 0, 1)
  return distance(position, pointAt(from, gate.center, ratio)) > 125
}
