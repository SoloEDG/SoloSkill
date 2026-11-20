import type { FrameInput } from '@/shared/commands'
import type { PinballDocument } from '@/shared/document'
import type { FlipperAnchors } from '@/shared/geometry'
import { advanceFlippers } from '@/features/flippers/lib/flipper-kinematics'
import { advancePlunger, applyNudges, decayNudgeFlash } from '@/features/flippers/lib/plunger-nudge'

export { advanceFlippers } from '@/features/flippers/lib/flipper-kinematics'
export { advancePlunger, applyNudges, clearWarnings, decayNudgeFlash } from '@/features/flippers/lib/plunger-nudge'
export { default as ControlDeck } from '@/features/flippers/ui/ControlDeck.vue'
export { default as TiltLamp } from '@/features/flippers/ui/TiltLamp.vue'

export function advanceControls(
  doc: PinballDocument,
  input: FrameInput,
  dtMs: number,
  pose: FlipperAnchors,
): void {
  applyNudges(doc, input)
  advanceFlippers(doc, input, dtMs, pose)
  advancePlunger(doc, input, dtMs)
  decayNudgeFlash(doc, dtMs)
}
