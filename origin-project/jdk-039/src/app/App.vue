<script setup lang="ts">
import { AlarmSmoke, Clock3, RotateCcw } from 'lucide-vue-next';
import { FloorPlan, SitePicker } from '../features/building';
import { HazardLegend } from '../features/hazards';
import { ActionPanel, CrewPicker } from '../features/crew';
import { GearLedger } from '../features/gear';
import { MissionReport } from '../features/settlement';
import { useSession } from './session';

const { site, incident, total, active, selected, action, crew, outcome, plan, start, commit, refill, wait } = useSession();
</script>
<template>
  <header class="top"><h1><AlarmSmoke :size="23" />火线调度</h1><button @click="start()"><RotateCcw :size="16" />重开</button></header>
  <main>
    <div class="field">
      <div class="stations"><SitePicker :selected="site" @site="start" /><button :disabled="!!outcome" @click="wait"><Clock3 :size="15" />等待</button></div>
      <FloorPlan :building="incident.building" :crews="incident.crews" :active="active" :selected="selected" :route="plan?.path??[]" @pick="selected=$event" />
      <MissionReport :incident="incident" :outcome="outcome" :total="total" />
    </div>
    <aside>
      <CrewPicker :crews="incident.crews" :active="active" :locked="!!outcome" @crew="active=$event" />
      <ActionPanel :action="action" :ready="!!plan?.ok" :message="plan?.message??'选择目标格'" :locked="!!outcome" @action="action=$event" @commit="commit" />
      <GearLedger :crew="crew" :charges="incident.charges" :at-exit="crew.pos===incident.building.exit && !outcome" @refill="refill" />
      <HazardLegend :building="incident.building" :selected="selected" />
    </aside>
  </main>
</template>
