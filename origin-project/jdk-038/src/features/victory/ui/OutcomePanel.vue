<script setup lang="ts">
import { Trophy } from 'lucide-vue-next';
import type { Outcome } from '../../../shared/match';
import { names } from '../../../shared/territory';
defineProps<{ outcome: Outcome }>();
</script>

<template>
  <section class="outcome" role="status" aria-live="polite">
    <h2><Trophy :size="20" />{{ outcome.winner==='draw' ? '平局' : names[outcome.winner]+'获胜' }}</h2>
    <p>{{ outcome.cause === 'base' ? '总部易主' : '回合控制分' }} · {{ outcome.points.cedar }} : {{ outcome.points.ember }}</p>
  </section>
</template>

<style scoped>
.outcome { background: #e9ead6; padding: 9px; border-left: 3px solid #306b4c; }
p { font-size: 13px; margin: 5px 0 0; }
</style>
