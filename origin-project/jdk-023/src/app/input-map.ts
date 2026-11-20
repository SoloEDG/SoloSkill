import { idleInput, type FrameInput } from '@/shared/commands'

const leftCodes = new Set(['KeyA', 'KeyZ', 'ShiftLeft'])
const rightCodes = new Set(['KeyD', 'ShiftRight'])

export interface InputController {
  snapshot: () => FrameInput
  setLeft: (down: boolean) => void
  setRight: (down: boolean) => void
  setPlunger: (down: boolean) => void
  releasePlunger: () => void
  pulseNudge: (direction: -1 | 1) => void
  pulsePause: () => void
  pulseRestart: () => void
  destroy: () => void
}

export function createInputController(target: Window): InputController {
  const keys = { left: false, right: false, plunger: false }
  const pointer = { left: false, right: false, plunger: false }
  const edges = { nudgeLeft: false, nudgeRight: false, pause: false, restart: false, plungerReleased: false }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return
    if (event.code === 'Space') event.preventDefault()
    if (leftCodes.has(event.code)) keys.left = true
    if (rightCodes.has(event.code)) keys.right = true
    if (event.code === 'Space') keys.plunger = true
    if (event.code === 'KeyQ') edges.nudgeLeft = true
    if (event.code === 'KeyE') edges.nudgeRight = true
    if (event.code === 'KeyP' || event.code === 'Escape') edges.pause = true
  }

  function onKeyUp(event: KeyboardEvent): void {
    if (leftCodes.has(event.code)) keys.left = false
    if (rightCodes.has(event.code)) keys.right = false
    if (event.code === 'Space') {
      keys.plunger = false
      edges.plungerReleased = true
    }
  }

  function onBlur(): void {
    keys.left = false
    keys.right = false
    if (keys.plunger) edges.plungerReleased = true
    keys.plunger = false
    pointer.left = false
    pointer.right = false
    if (pointer.plunger) edges.plungerReleased = true
    pointer.plunger = false
  }

  function onPointerUp(): void {
    pointer.left = false
    pointer.right = false
    if (pointer.plunger) edges.plungerReleased = true
    pointer.plunger = false
  }

  target.addEventListener('keydown', onKeyDown)
  target.addEventListener('keyup', onKeyUp)
  target.addEventListener('blur', onBlur)
  target.addEventListener('pointerup', onPointerUp)

  return {
    snapshot(): FrameInput {
      const frame: FrameInput = {
        ...idleInput(),
        left: keys.left || pointer.left,
        right: keys.right || pointer.right,
        plunger: keys.plunger || pointer.plunger,
        plungerReleased: edges.plungerReleased,
        nudgeLeft: edges.nudgeLeft,
        nudgeRight: edges.nudgeRight,
        pauseEdge: edges.pause,
        restartEdge: edges.restart,
      }
      edges.nudgeLeft = false
      edges.nudgeRight = false
      edges.pause = false
      edges.restart = false
      edges.plungerReleased = false
      return frame
    },
    setLeft(down: boolean): void {
      pointer.left = down
    },
    setRight(down: boolean): void {
      pointer.right = down
    },
    setPlunger(down: boolean): void {
      pointer.plunger = down
    },
    releasePlunger(): void {
      if (pointer.plunger) edges.plungerReleased = true
      pointer.plunger = false
    },
    pulseNudge(direction: -1 | 1): void {
      if (direction < 0) edges.nudgeLeft = true
      else edges.nudgeRight = true
    },
    pulsePause(): void {
      edges.pause = true
    },
    pulseRestart(): void {
      edges.restart = true
    },
    destroy(): void {
      target.removeEventListener('keydown', onKeyDown)
      target.removeEventListener('keyup', onKeyUp)
      target.removeEventListener('blur', onBlur)
      target.removeEventListener('pointerup', onPointerUp)
    },
  }
}
