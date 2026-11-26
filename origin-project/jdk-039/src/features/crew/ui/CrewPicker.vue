<script setup lang="ts">
import { Shield, UserRound } from 'lucide-vue-next';
import type { Crew } from '../../../shared/mission';
defineProps<{ crews: Crew[]; active: string; locked: boolean }>();
defineEmits<{ crew: [id: string] }>();
</script>
<template>
  <section class="panel" aria-label="救援队伍">
    <h2>救援队伍</h2>
    <div class="teams"><button v-for="crew in crews" :key="crew.id" :aria-pressed="crew.id===active" :disabled="locked" @click="$emit('crew',crew.id)">
      <Shield :size="15" />{{ crew.id }} 队 <UserRound v-if="crew.carrying" :size="14" aria-label="转移中" />
    </button></div>
  </section>
</template>
<style scoped>
.teams { display:grid; grid-template-columns:1fr 1fr; gap:5px; }
.teams [aria-pressed=true] { border-color:#99d8c0; color:#a3e1c6; }
</style>
