import { ref } from 'vue'
import type { WindMode } from '../../../shared/race'
import { windAt } from '../lib/forecast'

export function useWind() {
  const mode = ref<WindMode>('shifting')
  const sample = (time: number) => windAt(time, mode.value)
  const set = (next: WindMode) => { mode.value = next }
  return { mode, sample, set }
}
