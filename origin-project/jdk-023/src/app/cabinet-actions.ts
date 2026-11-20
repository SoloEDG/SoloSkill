import { flashNote, type PinballDocument } from '@/shared/document'
import { clearChain } from '@/features/bonus'
import { clearWarnings } from '@/features/flippers'
import { commitSession } from '@/features/records'
import { mountFresh, stickPlunger } from '@/features/table'

export function togglePause(doc: PinballDocument): void {
  if (doc.phase === 'paused') {
    doc.phase = doc.phaseBeforePause ?? 'ready'
    doc.phaseBeforePause = null
    return
  }
  if (doc.phase === 'playing' || doc.phase === 'ready') {
    doc.phaseBeforePause = doc.phase
    doc.phase = 'paused'
  }
}

export function applyDrain(doc: PinballDocument): void {
  doc.signals.drain = false
  if (doc.phase === 'gameover') return
  if (doc.nudge.tilted) doc.live.tilted = true
  clearWarnings(doc)
  clearChain(doc)
  doc.ballsLeft -= 1
  doc.ball.rideMs = 0
  doc.ball.holdMs = 0
  doc.ball.vx = 0
  doc.ball.vy = 0
  if (doc.ballsLeft <= 0) {
    doc.phase = 'gameover'
    doc.ball.held = 'none'
    flashNote(doc, '球用尽了')
    commitSession(doc, false)
    return
  }
  doc.phase = 'ready'
  doc.plunger.power = 0
  stickPlunger(doc)
  flashNote(doc, '下一颗球')
}

export function restartGame(doc: PinballDocument): void {
  if (doc.run.launched && !doc.run.committed) commitSession(doc, doc.phase !== 'gameover')
  mountFresh(doc, {
    career: doc.career,
    history: doc.history,
    bestScore: doc.bestScore,
  })
}
