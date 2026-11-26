<script setup lang="ts">
import { Undo2, Trash2 } from 'lucide-vue-next';
defineProps<{ width: number; empty: boolean; locked: boolean }>();
defineEmits<{ width: [number]; undo: []; clear: [] }>();
</script>
<template>
<section><h2>笔触</h2>
  <label>线宽 <input type="range" min="2" max="36" :value="width" :disabled="locked" @input="$emit('width', Number(($event.target as HTMLInputElement).value))"><output>{{width}}</output></label>
  <div class="row"><button title="撤回一笔" aria-label="撤回一笔" :disabled="empty||locked" @click="$emit('undo')"><Undo2 :size="17"/></button>
  <button title="清空画布" aria-label="清空画布" :disabled="empty||locked" @click="$emit('clear')"><Trash2 :size="17"/></button></div>
</section>
</template>
<style scoped>
output {font-variant-numeric:tabular-nums; min-width:2ch;text-align:right;}
input {flex:1;min-width:0;}
</style>
