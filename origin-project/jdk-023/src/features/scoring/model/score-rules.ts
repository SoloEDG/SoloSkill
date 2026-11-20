import type { ContactEvent } from '@/shared/contacts'
import { findMechanism, type PinballDocument } from '@/shared/document'
import { BodyId } from '@/shared/ids'
import { cooldownFor } from '@/features/table'

const BASE_POINTS: Record<string, number> = {
  [BodyId.bumperA]: 100,
  [BodyId.bumperB]: 100,
  [BodyId.bumperC]: 120,
  [BodyId.slingL]: 15,
  [BodyId.slingR]: 15,
  [BodyId.dropA]: 500,
  [BodyId.dropB]: 500,
  [BodyId.dropC]: 500,
  [BodyId.spinner]: 40,
  [BodyId.laneL]: 25,
  [BodyId.laneC]: 25,
  [BodyId.laneR]: 25,
  [BodyId.hole]: 250,
  [BodyId.ramp]: 1000,
}

const NAME: Record<string, string> = {
  [BodyId.bumperA]: '左弹力柱',
  [BodyId.bumperB]: '中弹力柱',
  [BodyId.bumperC]: '右弹力柱',
  [BodyId.slingL]: '左弹射',
  [BodyId.slingR]: '右弹射',
  [BodyId.dropA]: '落靶',
  [BodyId.dropB]: '落靶',
  [BodyId.dropC]: '落靶',
  [BodyId.spinner]: '转轮',
  [BodyId.laneL]: '左通道',
  [BodyId.laneC]: '中通道',
  [BodyId.laneR]: '右通道',
  [BodyId.hole]: '回球洞',
  [BodyId.ramp]: '坡道',
}

export function pointsFor(id: string, multiplier: number): number | null {
  const base = BASE_POINTS[id]
  if (base === undefined) return null
  return base * multiplier
}

function remember(doc: PinballDocument, id: string, points: number): void {
  doc.feedSeq += 1
  doc.feed.unshift({ uid: doc.feedSeq, text: `${NAME[id] ?? '撞击'} +${points}`, points })
  if (doc.feed.length > 6) doc.feed.length = 6
}

export function applyScore(doc: PinballDocument, events: ContactEvent[]): ContactEvent[] {
  const awarded: ContactEvent[] = []
  for (const event of events) {
    const mechanism = findMechanism(doc, event.id)
    if (mechanism && mechanism.cooldownMs > 0) continue
    const points = pointsFor(event.id, doc.chain.multiplier)
    if (points === null) continue
    doc.score += points
    remember(doc, event.id, points)
    if (mechanism) mechanism.cooldownMs = cooldownFor(mechanism.kind)
    awarded.push(event)
  }
  return awarded
}
