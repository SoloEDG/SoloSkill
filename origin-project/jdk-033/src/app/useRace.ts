import { computed, onMounted, onUnmounted, ref } from 'vue'
import { course } from '../features/chart'
import { useWind } from '../features/wind'
import { useSail } from '../features/sail'
import { useJury } from '../features/jury'
import { useLogbook } from '../features/logbook'
import type { Point, RaceEvent, RaceStatus, Sample } from '../shared/race'

const stepSize = .025
const maxDuration = 600

export function useRace() {
  const wind = useWind()
  const sail = useSail(course)
  const jury = useJury(course)
  const logbook = useLogbook()
  const status = ref<RaceStatus>('ready')
  const elapsed = ref(0)
  const focus = ref<Point | null>(null)
  const live = computed<Sample>(() => ({
    time: elapsed.value, boat: sail.boat.value, wind: wind.sample(elapsed.value),
    nextGate: jury.nextGate.value, penalty: jury.penalty.value,
  }))
  const frame = computed(() => logbook.frame.value ?? live.value)
  const trail = computed(() => (logbook.selected.value?.samples ?? logbook.samples.value).map(sample => sample.boat.position))
  const active = computed(() => status.value === 'running' || status.value === 'paused')
  let animation = 0, last = 0, pending = 0
  function reset() {
    status.value = 'ready'
    elapsed.value = pending = 0
    focus.value = null
    logbook.selected.value = null
    logbook.samples.value = []
    sail.reset()
    jury.reset()
  }
  function start() {
    const mode = wind.mode.value
    reset()
    wind.set(mode)
    status.value = 'running'
    jury.add('start', '出发', 0, sail.boat.value.position)
    logbook.record(live.value, true)
  }
  function togglePause() {
    if (status.value === 'running') { status.value = 'paused'; sail.steer(0) }
    else if (status.value === 'paused') status.value = 'running'
    pending = 0
  }
  function end(result: 'abandoned' | 'finished') {
    if (!active.value) return
    if (result === 'abandoned') jury.add('abandon', '结束航次', elapsed.value, sail.boat.value.position)
    logbook.record(live.value, true)
    logbook.archive({
      courseId: course.id, windMode: wind.mode.value, status: result,
      duration: elapsed.value, penalty: jury.penalty.value, events: [...jury.events.value],
    })
    status.value = result
  }
  function tick() {
    const from = sail.boat.value
    const previousEvent = jury.events.value.at(-1)
    const next = sail.step(live.value.wind, stepSize)
    const verdict = jury.inspect(from.position, next.position, elapsed.value, stepSize)
    sail.boat.value = verdict.blocked ? { ...next, position: from.position, knots: 0 } : next
    elapsed.value += stepSize
    if (verdict.finish) {
      elapsed.value = verdict.finish.time
      sail.boat.value = { ...next, position: verdict.finish.position }
      end('finished')
      return
    }
    const event = jury.events.value.at(-1)
    if (event && event !== previousEvent && event.kind === 'mark' && event.time < elapsed.value) {
      logbook.record({ ...live.value, time: event.time, wind: wind.sample(event.time),
        boat: { ...next, position: event.position } }, true)
    }
    logbook.record(live.value, event?.time === elapsed.value)
    if (elapsed.value >= maxDuration) end('abandoned')
  }
  function loop(now: number) {
    if (last && status.value === 'running') {
      pending += Math.min(.2, (now - last) / 1000)
      while (pending >= stepSize && status.value === 'running') {
        pending -= stepSize
        tick()
      }
    }
    last = now
    animation = requestAnimationFrame(loop)
  }
  function keydown(event: KeyboardEvent) {
    if (event.target instanceof HTMLElement && event.target.matches('input, select, button, textarea')) return
    if (status.value !== 'running') return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      sail.steer(event.key === 'ArrowLeft' ? -1 : 1)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      sail.sheet(sail.boat.value.sheet + (event.key === 'ArrowUp' ? 2 : -2))
    }
  }
  function keyup(event: KeyboardEvent) {
    const released = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
    if (released && sail.boat.value.rudder === released) sail.steer(0)
  }
  function suspend() { if (status.value === 'running') togglePause() }
  function locate(event: RaceEvent) { focus.value = event.position; if (logbook.selected.value) logbook.seek(event.time) }
  onMounted(() => {
    animation = requestAnimationFrame(loop)
    window.addEventListener('keydown', keydown)
    window.addEventListener('keyup', keyup)
    window.addEventListener('blur', suspend)
  })
  onUnmounted(() => {
    cancelAnimationFrame(animation)
    window.removeEventListener('keydown', keydown)
    window.removeEventListener('keyup', keyup)
    window.removeEventListener('blur', suspend)
  })
  return { course, wind, sail, jury, logbook, status, focus, frame, trail, active, start, togglePause, end, locate }
}
