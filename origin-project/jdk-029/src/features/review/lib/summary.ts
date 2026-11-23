import type { GuideNote, Take } from '../../../shared/document'
import { within } from '../../../shared/time'

export function accuracy(take: Take, notes: readonly GuideNote[]) {
  let valid = 0
  let hits = 0
  for (const point of take.pitch) {
    if (point.midi === null) continue
    const target = notes.find(note => within(note, point.time))
    if (!target) continue
    valid++
    if (Math.abs(point.midi - target.midi) <= 0.5) hits++
  }
  return valid > 0 ? Math.round(hits / valid * 100) : null
}
