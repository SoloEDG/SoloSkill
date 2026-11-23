import { computed, shallowRef } from 'vue'
import type { PitchPoint, TimeRange } from '../../../shared/document'
import { noteName, samplePitch } from '../lib/detect'

export function usePitch() {
  const points = shallowRef<PitchPoint[]>([])
  const latest = computed(() => {
    const midi = points.value.at(-1)?.midi
    return midi == null ? null : noteName(midi)
  })

  function receive(time: number, samples: Float32Array, rate: number) {
    points.value = [...points.value, { time, midi: samplePitch(samples, rate) }]
  }

  function slice(range: TimeRange) {
    return points.value.filter(point => point.time >= range.start && point.time < range.end)
  }

  function clear() { points.value = [] }
  return { points, latest, receive, slice, clear }
}
