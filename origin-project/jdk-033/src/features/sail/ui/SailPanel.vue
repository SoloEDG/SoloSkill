<script setup lang="ts">
import { ChevronLeft, ChevronRight, Sailboat } from 'lucide-vue-next'
import { compass } from '../../../shared/format'
import type { Boat } from '../../../shared/race'
defineProps<{ boat: Boat; disabled: boolean }>()
defineEmits<{ steer: [value: number]; sheet: [value: number] }>()
</script>

<template>
  <section class="instrument" aria-label="船帆控制">
    <h2><Sailboat :size="17"/> 船帆控制</h2>
    <div class="instrument-line">
      <div class="reading"><strong data-testid="boat-speed">{{ boat.knots.toFixed(1) }}</strong><span> kn</span><small>对地航速</small></div>
      <div class="reading course-reading"><strong data-testid="heading">{{ compass(boat.heading) }}</strong><small>船首</small></div>
    </div>
    <label class="slider-label" for="sheet">帆角 <output>{{ boat.sheet }}°</output></label>
    <input id="sheet" type="range" min="0" max="85" :value="boat.sheet" :disabled="disabled" @input="$emit('sheet', Number(($event.target as HTMLInputElement).value))">
    <div class="segment rudder">
      <button type="button" :disabled="disabled" :aria-pressed="boat.rudder === -1" title="左舵" @click="$emit('steer', boat.rudder === -1 ? 0 : -1)"><ChevronLeft :size="17"/> 左舵</button>
      <button type="button" :disabled="disabled" :aria-pressed="boat.rudder === 0" title="回中" @click="$emit('steer', 0)">回中</button>
      <button type="button" :disabled="disabled" :aria-pressed="boat.rudder === 1" title="右舵" @click="$emit('steer', boat.rudder === 1 ? 0 : 1)">右舵 <ChevronRight :size="17"/></button>
    </div>
  </section>
</template>
