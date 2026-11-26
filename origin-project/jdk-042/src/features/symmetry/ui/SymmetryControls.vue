<script setup lang="ts">
import { divisions } from '../model/options';
import type { Symmetry } from '../../../shared/art';
defineProps<{ value: Symmetry; locked: boolean }>();
defineEmits<{ change: [Partial<Symmetry>] }>();
</script>
<template>
<section><h2>对称</h2>
  <label>分区 <select :value="value.count" :disabled="locked" @change="$emit('change',{count:Number(($event.target as HTMLSelectElement).value)})">
  <option v-for="count in divisions" :key="count" :value="count">{{count}}</option></select></label>
  <label>轴角度 <input type="range" min="0" max="359" :value="value.axis" :disabled="locked"
    @input="$emit('change',{axis:Number(($event.target as HTMLInputElement).value)})"><output>{{value.axis}}°</output></label>
  <label>镜像 <input type="checkbox" :checked="value.mirror" :disabled="locked" @change="$emit('change',{mirror:($event.target as HTMLInputElement).checked})"></label>
</section>
</template>
<style scoped>
input[type=range] {flex:1;min-width:0;} output {font-variant-numeric:tabular-nums;}
</style>
