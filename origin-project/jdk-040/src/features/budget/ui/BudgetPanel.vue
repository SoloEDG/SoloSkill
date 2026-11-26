<script setup lang="ts">
import { materials, allowance } from '../model/catalog';
import type { Material } from '../../../shared/bridge';
defineProps<{ spent:number; selected:Material; locked:boolean }>();
defineEmits<{ select:[Material] }>();
</script>
<template>
  <section><h2>材料与预算</h2>
    <p><strong data-testid="spent">{{ spent }}</strong> / {{ allowance }}</p>
    <meter :value="spent" :max="allowance" aria-label="已用预算"></meter>
    <button v-for="(item,key) in materials" :key="key" :disabled="locked" :aria-pressed="selected===key" @click="$emit('select',key)">
      <i :style="{background:item.color}"></i>{{ item.label }} <small>{{ item.rate }} / 米</small>
    </button>
  </section>
</template>
<style scoped>
p {margin:4px 0;} meter {width:100%;margin-bottom:6px;} button {display:flex;width:100%;justify-content:start;margin-block:4px;gap:8px;} button[aria-pressed=true] {border-color:#197269;} i {width:12px;height:12px;} small {margin-left:auto;}
</style>
