<script setup lang="ts">
import { computed } from 'vue';
import type { Frame } from '../../../shared/bridge';
const props=defineProps<{ frames:Frame[] }>();
const points=computed(()=>{
  const values=props.frames.map(frame=>Math.max(0,...Object.values(frame.stresses).map(Math.abs)));
  const height=Math.max(1.2,...values);
  return values.map((value,index)=>[10+index/Math.max(1,values.length-1)*180,63-value/height*53].join(',')).join(' ');
});
</script>
<template>
  <svg viewBox="0 0 200 72" role="img" aria-label="杆件峰值随试车位置变化">
    <path d="M10 8v55h180" fill="none" stroke="#97aba0"/>
    <polyline :points="points" fill="none" stroke="#2b7669" stroke-width="2"/>
  </svg>
</template>
