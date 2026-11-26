<script setup lang="ts">
import { Footprints, SprayCan, UserRound } from 'lucide-vue-next';
import type { Action } from '../../../shared/mission';
defineProps<{ action: Action; ready: boolean; message: string; locked: boolean }>();
defineEmits<{ action: [action: Action]; commit: [] }>();
const actions = [{ id:'move',label:'移动',icon:Footprints }, { id:'spray',label:'喷水',icon:SprayCan }, { id:'search',label:'搜救',icon:UserRound }] as const;
</script>
<template>
  <section class="panel" aria-label="行动">
    <h2>行动</h2>
    <div class="commands"><button v-for="item in actions" :key="item.id" :disabled="locked" :aria-pressed="action===item.id" @click="$emit('action',item.id)">
      <component :is="item.icon" :size="15" />{{ item.label }}
    </button></div>
    <button class="commit" data-testid="commit" :disabled="locked||!ready" @click="$emit('commit')">{{ message }}</button>
  </section>
</template>
<style scoped>
.commands { display:grid; grid-template-columns:repeat(3,1fr); gap:4px; }
.commands button { padding-inline:3px; }
.commands [aria-pressed=true] { border-color:#a5dcc8; color:#b3e9d5; }
.commit { width:100%; margin-top:5px; background:#31574d; }
</style>
