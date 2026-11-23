import type { GuideNote, PitchPoint, TimeRange } from '../../../shared/document'
import { clockLabel } from '../../../shared/time'
import { noteName } from './detect'

interface Trace { points: PitchPoint[]; color: string }

interface Plot {
  position: number
  range: TimeRange
  notes: GuideNote[]
  traces: Trace[]
}

export function drawPitch(canvas: HTMLCanvasElement, width: number, height: number, plot: Plot) {
  const ratio = window.devicePixelRatio || 1
  canvas.width = Math.round(width * ratio)
  canvas.height = Math.round(height * ratio)
  const context = canvas.getContext('2d')
  if (!context) return
  context.scale(ratio, ratio)
  const left = 43
  const right = width - 15
  const bottom = height - 30
  const top = 14
  const first = plot.range.start
  const duration = plot.range.end - first
  const notes = plot.notes.filter(note => note.end > first && note.start < plot.range.end)
  const midis = notes.map(note => note.midi)
  const [low, high] = midis.length
    ? [Math.min(...midis) - 3, Math.max(...midis) + 3]
    : [54, 72]
  const x = (time: number) => left + (time - first) / duration * (right - left)
  const y = (midi: number) => bottom - (midi - low) / (high - low) * (bottom - top)
  const ticks = width < 370 ? 3 : width < 520 ? 5 : 8
  context.font = '10px "IBM Plex Mono", monospace'

  for (let midi = low; midi <= high; midi++) {
    const major = midi % 3 === 0
    context.strokeStyle = major ? '#383d33' : '#2a3027'
    context.beginPath()
    context.moveTo(left, y(midi))
    context.lineTo(right, y(midi))
    context.stroke()
    if (major) {
      context.fillStyle = '#a5ac96'
      context.fillText(noteName(midi), 13, y(midi) + 3)
    }
  }
  for (let index = 0; index <= ticks; index++) {
    const time = first + duration * index / ticks
    const px = x(time)
    context.strokeStyle = '#343a30'
    context.beginPath()
    context.moveTo(px, top)
    context.lineTo(px, bottom)
    context.stroke()
    context.fillStyle = '#a5ac96'
    context.textAlign = index === 0 ? 'left' : index === ticks ? 'right' : 'center'
    context.fillText(clockLabel(time, duration < 6), px, height - 10)
  }

  context.save()
  context.beginPath()
  context.rect(left, top, right - left, bottom - top)
  context.clip()
  for (const note of notes) {
    const start = x(note.start)
    const length = Math.max(4, x(note.end) - start)
    context.fillStyle = '#e5bd70'
    context.beginPath()
    context.roundRect(start, y(note.midi) - 4, length, 8, 4)
    context.fill()
  }
  for (const trace of plot.traces) {
    context.strokeStyle = trace.color
    context.lineWidth = 2
    context.beginPath()
    let last: PitchPoint | undefined
    for (const point of trace.points) {
      if (point.midi === null) { last = undefined; continue }
      if (!last || point.time - last.time > 0.14) context.moveTo(x(point.time), y(point.midi))
      else context.lineTo(x(point.time), y(point.midi))
      last = point
    }
    context.stroke()
  }
  if (plot.position >= first && plot.position <= plot.range.end) {
    context.strokeStyle = '#f6eddb'
    context.lineWidth = 1
    context.beginPath()
    context.moveTo(x(plot.position), top)
    context.lineTo(x(plot.position), bottom)
    context.stroke()
  }
  context.restore()
}
