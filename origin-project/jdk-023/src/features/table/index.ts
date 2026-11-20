import type { PinballDocument } from '@/shared/document'
import type { Solid } from '@/shared/solids'
import { collectSolids } from '@/features/table/lib/solids'
import { publishGates, tickMechanisms } from '@/features/table/model/mechanism-rules'

export { anchors, sampleRamp, sampleScoop, stickPlunger } from '@/features/table/lib/playfield-layout'
export { collectSolids } from '@/features/table/lib/solids'
export {
  consumeContacts,
  cooldownFor,
  createMechanisms,
  mountFresh,
  publishGates,
  tickMechanisms,
} from '@/features/table/model/mechanism-rules'
export type { KeptRecords } from '@/features/table/model/mechanism-rules'
export { default as TableView } from '@/features/table/ui/TableView.vue'
export { default as MechanismPanel } from '@/features/table/ui/MechanismPanel.vue'

export function syncTable(doc: PinballDocument, dtMs: number): Solid[] {
  tickMechanisms(doc, dtMs)
  publishGates(doc)
  return collectSolids(doc)
}
