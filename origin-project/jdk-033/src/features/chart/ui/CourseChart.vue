<script setup lang="ts">
import { computed } from 'vue'
import { Anchor, Crosshair, LocateFixed } from 'lucide-vue-next'
import type { Course, Point, Sample } from '../../../shared/race'
import { buoyPosition, gateEnds } from '../lib/geometry'
import { pathFor, soundings } from '../lib/chartMarks'
import BoatGlyph from './BoatGlyph.vue'

const props = defineProps<{ course: Course; frame: Sample; trail: Point[]; replay: boolean; focus: Point | null }>()
const route = computed(() => pathFor([props.course.start, ...props.course.gates.flatMap(gate => gate.approach ? [gate.approach.center, gate.center] : [gate.center])]))
const trailPath = computed(() => pathFor(props.trail))
</script>

<template>
  <section class="chart" aria-label="航道地图">
    <svg class="sea-chart" :viewBox="`0 0 ${course.size.x} ${course.size.y}`" role="img" aria-label="针岬湾航图与帆船">
      <defs>
        <pattern id="sea-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#8fb4b5" stroke-opacity=".22"/></pattern>
        <pattern id="land-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V9" stroke="#b0a581" stroke-width="1" opacity=".43"/></pattern>
      </defs>
      <rect width="960" height="570" fill="#27555b"/>
      <rect width="960" height="570" fill="url(#sea-grid)"/>
      <g fill="none" stroke="#8db6b1" opacity=".29">
        <circle v-for="h in course.hazards" :key="h.id" :cx="h.center.x" :cy="h.center.y" :r="h.radius + 22"/>
        <circle v-for="h in course.hazards" :key="h.id + 'ring'" :cx="h.center.x" :cy="h.center.y" :r="h.radius + 39"/>
      </g>
      <g v-for="h in course.hazards" :key="h.id">
        <circle :cx="h.center.x" :cy="h.center.y" :r="h.radius" :fill="h.radius > 100 ? '#a69d78' : '#527270'" stroke="#c4bc98" stroke-width="1.7"/>
        <circle :cx="h.center.x" :cy="h.center.y" :r="h.radius" fill="url(#land-hatch)"/>
        <text :x="h.center.x" :y="h.center.y + 6" text-anchor="middle" :fill="h.radius > 100 ? '#292d2b' : '#e4dcc0'" class="water-text">{{ h.id }}</text>
      </g>
      <text v-for="depth in soundings" :key="depth.join(',')" :x="depth[0]" :y="depth[1]" fill="#a7c2bd" opacity=".55" class="depth">{{ depth[2] }}</text>
      <path :d="route" fill="none" stroke="#d0c89c" stroke-width="1.6" stroke-dasharray="4 7" opacity=".63"/>
      <path :d="trailPath" fill="none" stroke="#e9f6ef" stroke-width="2" stroke-linejoin="round"/>
      <g v-for="(gate, index) in course.gates" :key="gate.id" :opacity="index < frame.nextGate ? .42 : 1">
        <line v-if="gate.approach" :x1="gateEnds(gate.approach)[0].x" :y1="gateEnds(gate.approach)[0].y" :x2="gateEnds(gate.approach)[1].x" :y2="gateEnds(gate.approach)[1].y" :stroke="index === frame.nextGate ? '#ffd455' : '#a6b7a9'" stroke-width="1.4" stroke-dasharray="2 6"/>
        <line :x1="gateEnds(gate)[0].x" :y1="gateEnds(gate)[0].y" :x2="gateEnds(gate)[1].x" :y2="gateEnds(gate)[1].y" :stroke="index === frame.nextGate ? '#ffd455' : '#a6b7a9'" :stroke-width="index === frame.nextGate ? 2.6 : 1.3" stroke-dasharray="6 5"/>
        <circle :cx="buoyPosition(gate).x" :cy="buoyPosition(gate).y" r="9.5" :fill="index === frame.nextGate ? '#ffd455' : '#e77c62'" stroke="#1c3a3c" stroke-width="2.2"/>
        <circle :cx="gate.center.x" :cy="gate.center.y" r="3.6" :fill="index === frame.nextGate ? '#ffd455' : '#a6b7a9'"/>
        <text :x="gate.center.x + 13" :y="gate.center.y - 12" :fill="index === frame.nextGate ? '#ffd455' : '#e5e1c2'" class="water-text">{{ gate.id }} {{ gate.name }}</text>
      </g>
      <g v-if="focus" :transform="`translate(${focus.x} ${focus.y})`" stroke="#ffb44b" fill="none">
        <circle r="17" stroke-width="2"/><path d="M-24 0h11m26 0h11M0-24v11m0 26v11"/>
      </g>
      <BoatGlyph :boat="frame.boat"/>
      <g transform="translate(876 54)" stroke="#f1e9cd" fill="none">
        <circle r="23" opacity=".5"/><path d="M0 17V-15M-11 0H11M-4-9L0-16 4-9"/>
        <text x="0" y="-29" text-anchor="middle" fill="#f1e9cd" stroke="none" class="depth">N</text>
      </g>
      <g transform="translate(34 545)" stroke="#a5c3bb" fill="none">
        <path d="M0-5V0H96V-5M48 0V-5"/><text y="-10" fill="#c4d8ce" stroke="none" class="depth">100 m</text>
      </g>
    </svg>
    <div class="chart-tag"><Anchor :size="15"/><span>{{ course.name }}</span></div>
    <div class="chart-state"><component :is="replay ? Crosshair : LocateFixed" :size="14"/>{{ replay ? '回看' : '实时' }}</div>
  </section>
</template>
