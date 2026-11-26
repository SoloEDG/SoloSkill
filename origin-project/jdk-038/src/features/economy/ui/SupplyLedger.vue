<script setup lang="ts">
import { Boxes } from 'lucide-vue-next';
import { names, type Reserves, type Supply, type Team } from '../../../shared/territory';

defineProps<{ reserve: Reserves; supply: Supply; income: Reserves }>();
const sides: Team[] = ['cedar', 'ember'];
</script>

<template>
  <section aria-labelledby="resources"><h2 id="resources"><Boxes :size="17" />资源账</h2>
    <div v-for="side in sides" :key="side" class="ledger" :class="side">
      <b>{{ names[side] }}</b>
      <span>库存 <strong :data-testid="'reserve-'+side">{{ reserve[side] }}</strong></span>
      <span>产量 <strong :data-testid="'income-'+side">+{{ income[side] }}</strong></span>
      <span>供地 <strong>{{ supply[side].size }}</strong></span>
    </div>
  </section>
</template>

<style scoped>
.ledger { display: grid; grid-template-columns: 1.1fr repeat(3, 1fr); gap: 4px; align-items: center; min-height: 36px; font-size: 12px; border-bottom: 1px solid var(--line); }
.ledger span, .ledger strong { white-space: nowrap; }
.ledger strong { font-variant-numeric: tabular-nums; }
.cedar b { color: #27654f; } .ember b { color: #9c3f30; }
</style>
