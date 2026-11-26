<script setup lang="ts">
import { Droplets, Wind } from 'lucide-vue-next';
import type { Crew } from '../../../shared/mission';
import { airCapacity, waterCapacity } from '../model/inventory';
defineProps<{ crew: Crew; charges: number; atExit: boolean }>();
defineEmits<{ refill: [] }>();
</script>

<template>
  <section class="panel" aria-label="装备">
    <h2>装备</h2>
    <div class="gear"><Droplets :size="16" /><span>水量</span><b data-testid="water">{{ crew.water }} / {{ waterCapacity }}</b></div>
    <div class="gear"><Wind :size="16" /><span>呼吸余量</span><b data-testid="air">{{ crew.air }} / {{ airCapacity }}</b></div>
    <button :disabled="!atExit || !charges || (crew.air===airCapacity && crew.water===waterCapacity)" @click="$emit('refill')">安全区补给 · {{ charges }}</button>
  </section>
</template>

<style scoped>
.gear { display:flex; gap:6px; align-items:center; font-size:12px; margin-block:5px; }
.gear svg { color:#a2cbd1; } .gear b { margin-left:auto; }
button { margin-top:6px; width:100%; }
</style>
