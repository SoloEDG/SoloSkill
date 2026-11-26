<script setup lang="ts">
import { Flag, ShieldCheck } from 'lucide-vue-next';
import { troopOptions } from '../model/orders';
import { terrainStats } from '../../terrain';
import { names, type Tile } from '../../../shared/territory';

defineProps<{ tile: Tile; strength: number; forecast: { legal: boolean; reason: string; retained: number }; locked: boolean }>();
defineEmits<{ strength: [value: number]; deploy: [] }>();
</script>

<template>
  <section aria-labelledby="orders">
    <h2 id="orders"><Flag :size="17" />部署</h2>
    <div class="tile-detail"><b>{{ tile.key }} · {{ terrainStats[tile.terrain].label }}</b><span>{{ tile.owner ? names[tile.owner] : '未占领' }}</span></div>
    <dl><div><dt>驻军</dt><dd>{{ tile.guard }}</dd></div><div><dt>防御</dt><dd>{{ terrainStats[tile.terrain].defense }}</dd></div></dl>
    <div class="strength" aria-label="兵力">
      <button v-for="count in troopOptions" :key="count" type="button" :aria-pressed="strength===count" :disabled="locked"
        @click="$emit('strength',count)">{{ count }}</button>
    </div>
    <button type="button" class="deploy" data-testid="deploy" :disabled="locked || !forecast.legal" @click="$emit('deploy')">
      <ShieldCheck :size="17" />{{ forecast.legal ? forecast.reason + ' · 驻军 ' + forecast.retained : forecast.reason }}
    </button>
  </section>
</template>

<style scoped>
.tile-detail,dl { display: flex; align-items: baseline; justify-content: space-between; margin: 8px 0; gap: 5px; font-size: 13px; }
.tile-detail span,dt { color: var(--muted); }
dl div { display: flex; gap: 5px; }
dd { margin: 0; font-weight: 700; }
.strength { display: grid; grid-template-columns: repeat(5,1fr); gap: 4px; margin: 9px 0; }
.strength button[aria-pressed=true] { background: #2b624e; color: white; }
.deploy { width: 100%; min-height: 40px; }
</style>
