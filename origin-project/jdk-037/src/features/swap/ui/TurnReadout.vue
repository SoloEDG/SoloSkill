<script setup lang="ts">
import { Activity, Layers3, Zap } from 'lucide-vue-next';

defineProps<{ note: string; depth: number; combo: string | null }>();
</script>

<template>
  <div class="readout" aria-live="polite">
    <span><Activity :size="15" aria-hidden="true" />{{ note }}</span>
    <span v-if="combo"><Zap :size="15" aria-hidden="true" />{{ combo }}</span>
    <span v-if="depth"><Layers3 :size="15" aria-hidden="true" />{{ depth }} 连锁</span>
  </div>
</template>

<style scoped>
.readout { display: flex; flex-wrap: wrap; align-items: center; column-gap: 13px; min-height: 34px; padding: 6px 0 0; color: var(--muted); font-size: 12px; }
.readout span { display: flex; align-items: center; gap: 5px; }
.readout svg { color: var(--amber); flex: 0 0 auto; }
</style>
