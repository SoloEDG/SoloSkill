<script setup lang="ts">
import { Map, RotateCcw } from 'lucide-vue-next';
import { TacticalMap } from '../features/terrain';
import { OrdersPanel } from '../features/deploy';
import { SupplyLedger } from '../features/economy';
import { TurnPanel } from '../features/round';
import { OutcomePanel, ControlBalance } from '../features/victory';
import { useSession } from './session';

const { battle, selected, strength, reports, busy, supply, points, outcome, income, current, forecast, allowed, deploy, pass, reset } = useSession();
</script>

<template>
  <header class="top"><div class="title"><Map :size="23" /><h1>六边疆域</h1></div>
    <button type="button" :disabled="busy" @click="reset"><RotateCcw :size="16" />新战局</button>
  </header>
  <main>
    <div class="field">
      <TacticalMap :map="battle.map" :supply="supply" :selected="selected" :allowed="allowed" @choose="selected=$event" />
      <ControlBalance :points="points" />
      <OutcomePanel v-if="outcome" :outcome="outcome" />
    </div>
    <aside>
      <TurnPanel :battle="battle" :reports="reports" :locked="busy||!!outcome" @pass="pass" />
      <OrdersPanel :tile="current" :strength="strength" :forecast="forecast" :locked="busy||!!outcome" @strength="strength=$event" @deploy="deploy" />
      <SupplyLedger :reserve="battle.reserve" :supply="supply" :income="income" />
    </aside>
  </main>
</template>
