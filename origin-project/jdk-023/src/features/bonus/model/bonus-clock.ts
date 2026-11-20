import { flashNote, type PinballDocument } from '@/shared/document'

export function tickBonus(doc: PinballDocument, dtMs: number): void {
  if (doc.chain.bonusMs > 0) {
    doc.chain.bonusMs = Math.max(0, doc.chain.bonusMs - dtMs)
    if (doc.chain.bonusMs === 0) {
      doc.chain.multiplier = 1
      doc.chain.count = 0
      doc.chain.lastZone = null
      doc.chain.remainMs = 0
      flashNote(doc, '奖励结束')
    }
    return
  }
  if (doc.chain.remainMs <= 0) return
  doc.chain.remainMs = Math.max(0, doc.chain.remainMs - dtMs)
  if (doc.chain.remainMs === 0) {
    doc.chain.count = 0
    doc.chain.lastZone = null
  }
}

export function clearChain(doc: PinballDocument): void {
  doc.chain.count = 0
  doc.chain.lastZone = null
  doc.chain.remainMs = 0
  doc.chain.bonusMs = 0
  doc.chain.multiplier = 1
}
