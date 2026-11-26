<script setup lang="ts">
import { ClipboardCheck } from 'lucide-vue-next';
import type { Incident, Outcome } from '../../../shared/mission';
import { turnLimit } from '../model/incident';

defineProps<{ incident: Incident; outcome: Outcome | null; total: number }>();
</script>
<template>
  <section class="report" aria-label="任务结算">
    <div class="turn">回合 <b data-testid="turn">{{ incident.turn }} / {{ turnLimit }}</b></div>
    <div>已救 <b data-testid="rescued">{{ incident.rescued }} / {{ total }}</b></div>
    <div>受损 <b data-testid="damaged">{{ incident.building.hazards.filter(item=>item.ruined).length }}</b></div>
    <div v-if="outcome" class="result" role="status"><ClipboardCheck :size="17" />{{ outcome.reason }} · 遇难 {{ outcome.lost }} · 未撤离 {{ outcome.total-outcome.rescued-outcome.lost }}</div>
  </section>
</template>
<style scoped>
.report { display:flex; gap:12px; flex-wrap:wrap; padding:8px 0; color:#bdc9c5; font-size:12px; }
.report b { color:#f0e1c7; margin-left:3px; white-space:nowrap; }
.result { display:flex; align-items:center; gap:6px; width:100%; color:#ffcf9a; padding-top:7px; border-top:1px solid #53615a; }
</style>
