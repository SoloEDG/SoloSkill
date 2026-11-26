<script setup lang="ts">
import { computed } from 'vue';
import type { Frame } from '../../../shared/bridge';
const props=defineProps<{ frame: Frame | null }>();
const peak=computed(()=>Math.max(0,...Object.values(props.frame?.stresses??{}).map(Math.abs)));
</script>
<template>
  <section aria-label="结构图例"><h2>结构受力</h2>
    <p><i class="high"></i>接近极限 <i class="broken"></i>断裂</p>
    <p v-if="frame">当前最高利用率 <b>{{ Math.round(peak*100) }}%</b></p>
  </section>
</template>
<style scoped>
p {font-size:12px;margin-block:5px;} i {display:inline-block;width:14px;height:3px;vertical-align:middle;margin:0 3px;} .high {background:#e47937;} .broken {background:#a5232b;}
</style>
