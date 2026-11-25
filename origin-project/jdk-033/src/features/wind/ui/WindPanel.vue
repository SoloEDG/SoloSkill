<script setup lang="ts">
import { Wind as WindIcon, ArrowUp } from 'lucide-vue-next'
import { compass } from '../../../shared/format'
import type { Wind, WindMode } from '../../../shared/race'
defineProps<{ wind: Wind; mode: WindMode; locked: boolean }>()
defineEmits<{ mode: [value: WindMode] }>()
</script>

<template>
  <section class="instrument" aria-label="风况">
    <h2><WindIcon :size="17"/> 风况</h2>
    <div class="instrument-line">
      <div class="wind-rose" aria-hidden="true"><ArrowUp :size="27" :style="{ transform: `rotate(${wind.bearing + 90}deg)` }"/></div>
      <div class="reading"><strong data-testid="wind-speed">{{ wind.knots.toFixed(1) }}</strong><span> kn</span><small data-testid="wind-bearing">来向 {{ compass(wind.bearing) }}</small></div>
    </div>
    <div class="segment"><button :disabled="locked" :aria-pressed="mode === 'shifting'" @click="$emit('mode', 'shifting')">变向风</button><button :disabled="locked" :aria-pressed="mode === 'steady'" @click="$emit('mode', 'steady')">稳定风</button></div>
  </section>
</template>
