<script setup lang="ts">
import type { Reserves } from '../../../shared/territory';
defineProps<{ points: Reserves }>();
</script>

<template>
  <section class="balance" aria-label="控制分">
    <span>杉卫 <b data-testid="points-cedar">{{ points.cedar }}</b></span>
    <meter min="0" :max="Math.max(1,points.cedar+points.ember)" :value="points.cedar" aria-label="杉卫控制分占比"></meter>
    <span><b>{{ points.ember }}</b> 赤庭</span>
  </section>
</template>

<style scoped>
.balance { display: flex; gap: 10px; font-size: 12px; align-items: center; font-variant-numeric: tabular-nums; padding-block: 10px; }
.balance span { white-space: nowrap; }
meter { width: 100%; }
meter::-webkit-meter-bar { background: #c0614c; border: 0; }
meter::-webkit-meter-optimum-value { background: #418270; }
</style>
