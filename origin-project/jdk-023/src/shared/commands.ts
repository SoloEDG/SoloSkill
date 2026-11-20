export interface FrameInput {
  left: boolean
  right: boolean
  plunger: boolean
  plungerReleased: boolean
  nudgeLeft: boolean
  nudgeRight: boolean
  pauseEdge: boolean
  restartEdge: boolean
}

export type CabinetCommand = { type: 'pause-toggle' } | { type: 'restart' }

export function commandFromInput(input: FrameInput): CabinetCommand | null {
  if (input.restartEdge) return { type: 'restart' }
  if (input.pauseEdge) return { type: 'pause-toggle' }
  return null
}

export function idleInput(): FrameInput {
  return {
    left: false,
    right: false,
    plunger: false,
    plungerReleased: false,
    nudgeLeft: false,
    nudgeRight: false,
    pauseEdge: false,
    restartEdge: false,
  }
}
