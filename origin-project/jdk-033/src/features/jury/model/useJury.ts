import { ref } from 'vue'
import { inspectWater, isOffCourse } from '../../chart'
import type { Course, EventKind, Point, RaceEvent } from '../../../shared/race'

import { gateCrossing } from '../lib/crossing'

export function useJury(course: Course) {
  const nextGate = ref(0)
  const penalty = ref(0)
  const events = ref<RaceEvent[]>([])
  let contacts = new Set<string>()
  let outside = false
  let approached = false

  function add(kind: EventKind, label: string, time: number, position: Point, seconds = 0) {
    penalty.value += seconds
    events.value.push({ id: String(events.value.length + 1), kind, label, time, position: { ...position }, penalty: seconds })
  }
  function reset() {
    nextGate.value = penalty.value = 0
    events.value = []
    contacts = new Set()
    outside = false
    approached = false
  }
  function inspect(from: Point, to: Point, start: number, dt: number) {
    const gate = course.gates[nextGate.value]
    if (!gate) return { blocked: false, finish: null }
    const newContacts = new Set(inspectWater(course, to))
    for (const name of newContacts) if (!contacts.has(name)) add('collision', `碰撞 · ${name}`, start + dt, from, 5)
    if (newContacts.size) {
      for (const name of newContacts) contacts.add(name)
      return { blocked: true, finish: null }
    }
    if (contacts.size) {
      const nearby = new Set(inspectWater(course, to, 3))
      for (const name of contacts) if (!nearby.has(name)) contacts.delete(name)
    }
    if (gate.approach) {
      if (gateCrossing(gate.approach, to, from)) approached = false
      if (gateCrossing(gate.approach, from, to)) approached = true
    }
    const hit = (!gate.approach || approached) ? gateCrossing(gate, from, to) : null
    const legStart = nextGate.value === 0 ? course.start : course.gates[nextGate.value - 1].center
    const offCourse = isOffCourse(legStart, gate, to)
    if (hit) {
      nextGate.value++
      approached = false
      outside = false
      const time = start + dt * hit.fraction
      if (nextGate.value === course.gates.length) {
        add('finish', '冲过终点', time, hit.point)
        return { blocked: false, finish: { time, position: hit.point } }
      }
      add('mark', `通过 ${gate.name}`, time, hit.point)
    } else {
      if (offCourse && !outside) add('deviation', '偏离航段', start + dt, to, 3)
      outside = offCourse
    }
    return { blocked: false, finish: null }
  }
  return { nextGate, penalty, events, reset, add, inspect }
}
