<script setup lang="ts">
import { Play } from 'lucide-vue-next';
import { vehicles } from '../model/fleet';
defineProps<{ selected:number; locked:boolean }>();
defineEmits<{ vehicle:[number]; run:[] }>();
</script>
<template>
  <section><h2>车辆测试</h2>
    <label>车辆
      <select :disabled="locked" :value="selected" @change="$emit('vehicle',Number(($event.target as HTMLSelectElement).value))">
        <option v-for="(vehicle,index) in vehicles" :key="vehicle.name" :value="index">{{vehicle.name}} · {{vehicle.weight}} kN</option>
      </select>
    </label>
    <button data-testid="run" :disabled="locked" @click="$emit('run')"><Play :size="16"/>试车</button>
  </section>
</template>
<style scoped>
label {display:grid;gap:4px;margin-bottom:5px;font-size:12px;}button {width:100%;justify-content:center;}
</style>
