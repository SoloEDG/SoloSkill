<script setup lang="ts">
import { ArrowRight, Hourglass } from 'lucide-vue-next';
import { names } from '../../../shared/territory';
import type { Battle, TurnSummary } from '../../../shared/match';
import { roundLimit } from '../model/turn';

defineProps<{ battle: Battle; reports: TurnSummary[]; locked: boolean }>();
defineEmits<{ pass: [] }>();
</script>

<template>
  <section aria-labelledby="turn">
    <h2 id="turn"><Hourglass :size="17" />回合 <b data-testid="round">{{ Math.min(roundLimit,battle.round) }} / {{ roundLimit }}</b></h2>
    <p class="player" aria-live="polite">{{ names[battle.side] }}行动 <span>余 {{ battle.actions }} 次</span></p>
    <button type="button" class="pass" data-testid="end-turn" :disabled="locked" @click="$emit('pass')">结束回合 <ArrowRight :size="17" /></button>
    <ul aria-label="回合记录"><li v-for="report in reports.slice(-4)" :key="report.team + report.round">{{ names[report.team] }} · 入库 {{ report.income }}<span v-if="report.weakened"> · {{ report.weakened }} 地减员</span></li></ul>
  </section>
</template>

<style scoped>
h2 b { margin-left: auto; font-size: 12px; }
.player { display: flex; align-items: center; justify-content: space-between; gap: 5px; font-size: 13px; margin: 8px 0; }
.player span { color: var(--muted); white-space: nowrap; }
.pass { width: 100%; background: #2a5142; color: white; }
ul { margin: 8px 0 0; padding: 0; list-style: none; min-height: 40px; font-size: 12px; color: var(--muted); }
</style>
