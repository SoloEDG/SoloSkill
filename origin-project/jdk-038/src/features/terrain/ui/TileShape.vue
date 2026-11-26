<script setup lang="ts">
import { computed } from 'vue';
import type { Tile } from '../../../shared/territory';
import { geometryOf } from '../lib/hexes';
import { terrainStats } from '../model/stats';

const props = defineProps<{ tile: Tile; selected: boolean; allowed: boolean; connected: boolean }>();
const shape = computed(() => geometryOf(props.tile));
const label = computed(() => `${props.tile.key} ${terrainStats[props.tile.terrain].label} ${props.tile.guard} 驻军`);
defineEmits<{ choose: [] }>();
</script>

<template>
  <g class="tile" role="button" tabindex="0" :aria-label="label" :aria-pressed="selected"
    :data-tile="tile.key" :data-owner="tile.owner" :data-supplied="connected" :data-guard="tile.guard" :data-allowed="allowed"
    @click="$emit('choose')" @keydown.enter.prevent="$emit('choose')" @keydown.space.prevent="$emit('choose')">
    <polygon :points="shape.polygon" :fill="terrainStats[tile.terrain].fill"
      :class="[tile.owner, { allowed, selected, isolated: tile.owner && !connected }]" />
    <g :transform="'translate('+shape.x+' '+ shape.y+')'" aria-hidden="true" pointer-events="none">
      <path v-if="tile.terrain === 'forest'" d="M-23 6l6-10 6 10z m8 -4l7-12 7 12z m8 4l5-8 5 8z" />
      <path v-if="tile.terrain === 'ridge'" d="M-24 5l10-13 10 13z m15 0l10-19 13 19z" />
      <path v-if="tile.terrain === 'quarry'" d="M-18 -5h12v6h-12z M6 -7h10v10H6z M-3 -1h9v7h-9z" />
      <circle v-if="tile.guard" cy="0" r="13" :class="tile.owner!" />
      <text v-if="tile.guard" y="4" text-anchor="middle">{{ tile.guard }}</text>
      <text v-if="tile.base" y="-19" text-anchor="middle" class="base">总部</text>
      <text v-else-if="tile.owner && !connected" y="26" text-anchor="middle" class="base">断供</text>
    </g>
  </g>
</template>

<style scoped>
.tile { cursor: pointer; outline: none; }
polygon { stroke: #605f4f; stroke-width: 2; }
polygon.cedar { fill: #8bc7ad; stroke: #286753; stroke-width: 3; }
polygon.ember { fill: #e1a089; stroke: #a34936; stroke-width: 3; }
polygon.allowed { stroke: #937321; stroke-dasharray: 6 4; }
polygon.isolated { stroke-dasharray: 3 3; }
.tile:focus-visible polygon, polygon.selected { stroke: #161f19; stroke-width: 4; stroke-dasharray: none; }
path { fill: #555a40; opacity: .48; }
circle.cedar { fill: #286753; } circle.ember { fill: #a34936; }
text { fill: white; font: 700 13px system-ui; }
.base { fill: #1b2720; font-size: 11px; }
</style>
