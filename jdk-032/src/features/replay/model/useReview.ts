import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import type { SimulationRun } from '@/shared/document'
import { previousEvent } from '../lib/eventOrder'

export function useReview(run: Ref<SimulationRun | null>) {
  const time = ref(0)
  const playing = ref(false)
  let timer = 0
  const events = computed(() => run.value?.events ?? [])
  const currentEvent = computed(() => previousEvent(events.value, time.value))
  const focusPieceId = computed(() => currentEvent.value?.pieceId ?? null)

  function stop() {
    playing.value = false
    if (timer) window.clearInterval(timer)
    timer = 0
  }
  function pause() { stop() }
  function seek(value: number) {
    stop()
    time.value = Math.max(0, Math.min(run.value?.duration ?? 0, value))
  }
  function play() {
    if (!run.value || run.value.duration <= 0 || playing.value) return
    if (time.value >= run.value.duration) time.value = 0
    playing.value = true
    timer = window.setInterval(() => {
      time.value = Math.min(run.value?.duration ?? 0, time.value + 0.04)
      if (time.value >= (run.value?.duration ?? 0)) stop()
    }, 40)
  }
  function toggle() { if (playing.value) pause(); else play() }
  function restart() { seek(0) }
  function focusEvent(eventId: string) {
    const event = events.value.find(item => item.id === eventId)
    if (event) seek(event.time)
  }
  watch(run, () => { time.value = 0; stop() })
  onBeforeUnmount(stop)
  return { time, playing, events, currentEvent, focusPieceId, seek, play, pause, toggle, restart, focusEvent }
}
