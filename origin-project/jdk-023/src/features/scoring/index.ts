import type { ContactEvent, RideFns } from '@/shared/contacts'
import type { PinballDocument } from '@/shared/document'
import type { Solid } from '@/shared/solids'
import { advanceBall } from '@/features/scoring/model/ball-step'
import { applyScore } from '@/features/scoring/model/score-rules'

export { advanceBall } from '@/features/scoring/model/ball-step'
export { applyScore, pointsFor } from '@/features/scoring/model/score-rules'
export { default as ScoreHud } from '@/features/scoring/ui/ScoreHud.vue'
export { default as EventTicker } from '@/features/scoring/ui/EventTicker.vue'

export function simulateBall(doc: PinballDocument, solids: Solid[], dtMs: number, rides: RideFns): ContactEvent[] {
  return applyScore(doc, advanceBall(doc, solids, dtMs, rides))
}
