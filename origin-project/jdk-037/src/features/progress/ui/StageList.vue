<script setup lang="ts">
import { Check, ChevronRight, LockKeyhole } from 'lucide-vue-next';
import type { Level } from '../../../shared/levels';
import { isUnlocked, type Records } from '../model/records';

defineProps<{ levels: Level[]; records: Records; selected: number; busy: boolean }>();
defineEmits<{ choose: [stage: number] }>();
</script>

<template>
  <nav class="work-panel stage-list" aria-labelledby="stage-title">
    <h2 id="stage-title">矿区关卡</h2>
    <button
      v-for="level in levels" :key="level.id" type="button" class="stage" :class="{ active: selected === level.id }"
      :disabled="!isUnlocked(level.id, records) || busy" :aria-current="selected === level.id ? 'step' : undefined"
      :data-testid="'stage-' + level.id" @click="$emit('choose', level.id)"
    >
      <span class="stage-number">{{ String(level.id).padStart(2, '0') }}</span>
      <span class="stage-info">{{ level.name }}<small v-if="records[level.id]">最高 {{ records[level.id]?.score }}</small></span>
      <Check v-if="records[level.id]" :size="16" aria-hidden="true" />
      <ChevronRight v-else-if="isUnlocked(level.id, records)" :size="16" aria-hidden="true" />
      <LockKeyhole v-else :size="14" aria-hidden="true" />
    </button>
  </nav>
</template>

<style scoped>
.stage { display: grid; grid-template-columns: 28px 1fr 17px; align-items: center; gap: 6px; text-align: left; min-height: 42px; width: 100%; padding: 5px 6px; background: none; border: 1px solid transparent; border-top-color: var(--line); color: var(--ink); }
.stage:first-of-type { margin-top: 9px; }
.stage.active { border: 1px solid #8e7950; background: #3a3428; color: #ffe3a3; }
.stage:disabled { color: var(--muted); }
.stage-info { display: grid; gap: 2px; font-size: 13px; }
.stage-number, small { font: 11px var(--mono); color: var(--muted); }
</style>
