<script setup lang="ts">
import { Check, Cpu, Flag } from "lucide-vue-next";
import { phaseLabels, type Objective } from "../model/objective";

defineProps<{ objective: Objective }>();
</script>

<template>
  <section class="status-section mission-section" aria-labelledby="mission-heading">
    <div class="section-heading">
      <h2 id="mission-heading">行动任务</h2>
      <span class="phase-text" :class="objective.phase" aria-live="polite" data-mission-phase>{{ phaseLabels[objective.phase] }}</span>
    </div>
    <ol class="objectives">
      <li :class="{ complete: objective.securedAt !== null, current: objective.phase === 'retrieve' }">
        <Check v-if="objective.securedAt !== null" :size="17" /><Cpu v-else :size="17" />取得档案核心
      </li>
      <li :class="{ complete: objective.phase === 'escaped', current: objective.phase === 'extract' }">
        <Check v-if="objective.phase === 'escaped'" :size="17" /><Flag v-else :size="17" />抵达撤离点
      </li>
    </ol>
  </section>
</template>
