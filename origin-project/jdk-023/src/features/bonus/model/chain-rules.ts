import type { ContactEvent } from '@/shared/contacts'
import { flashNote, type PinballDocument } from '@/shared/document'
import { BodyId } from '@/shared/ids'

export const CHAIN_NEED = 4
export const CHAIN_WINDOW_MS = 2500
export const BONUS_MS = 15000
export const BONUS_MULTIPLIER = 2

const ZONES = new Set<string>([
  BodyId.laneL,
  BodyId.laneC,
  BodyId.laneR,
  BodyId.hole,
  BodyId.ramp,
  BodyId.spinner,
])

function arm(doc: PinballDocument, zone: string): void {
  doc.chain.count += 1
  doc.chain.lastZone = zone
  doc.chain.remainMs = CHAIN_WINDOW_MS
  if (doc.chain.count < CHAIN_NEED || doc.chain.bonusMs > 0) return
  doc.chain.bonusMs = BONUS_MS
  doc.chain.multiplier = BONUS_MULTIPLIER
  doc.live.bonusEntries += 1
  flashNote(doc, '进入奖励，得分双倍')
}

export function absorbZones(doc: PinballDocument, events: ContactEvent[]): void {
  if (doc.chain.bonusMs > 0) return
  for (const event of events) {
    if (!ZONES.has(event.id)) continue
    if (doc.chain.remainMs <= 0) {
      doc.chain.count = 0
      doc.chain.lastZone = null
    }
    if (doc.chain.lastZone === event.id) {
      doc.chain.remainMs = CHAIN_WINDOW_MS
      continue
    }
    arm(doc, event.id)
  }
}
