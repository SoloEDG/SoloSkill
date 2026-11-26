<script setup lang="ts">
import { Flame, Route, Waves } from 'lucide-vue-next';
import type { Building } from '../../../shared/site';
import { walkCost } from '../model/risk';

defineProps<{ building: Building; selected: number | null }>();
</script>

<template>
  <section class="panel" aria-label="现场危险">
    <h2>现场危险</h2>
    <div class="hazard"><span><Flame :size="16" />火区</span><b data-testid="fire-count">{{ building.hazards.filter(h=>h.heat>0).length }}</b></div>
    <div class="hazard"><span><Waves :size="16" />浓烟</span><b>{{ building.hazards.filter(h=>h.smoke>=3).length }}</b></div>
    <div v-if="selected!==null" class="hazard"><span><Route :size="16" />选中区域</span><b>{{ walkCost(building,selected) ? '可通行' : '不可通行' }}</b></div>
  </section>
</template>

<style scoped>
.hazard,.hazard span { display:flex; align-items:center; gap:6px; }
.hazard { justify-content:space-between; min-height:25px; font-size:12px; }
.hazard svg { color:#ec9b7f; }
</style>
