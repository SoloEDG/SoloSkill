<script setup lang="ts">
import { Cpu, Flag, Radio } from "lucide-vue-next";
import { terrainRules } from "../model/terrain";
</script>

<template>
  <ul class="map-legend" aria-label="地图图例">
    <li><i class="legend-token player-token" />玩家</li>
    <li><i class="legend-token guard-token" />守卫</li>
    <li><i class="legend-token sight-token" />视野</li>
    <li><i class="legend-token metal" />{{ terrainRules.metal.label }}</li>
    <li><i class="legend-token mat" />{{ terrainRules.mat.label }}</li>
    <li><Cpu />档案核心</li>
    <li><Flag />撤离点</li>
    <li><Radio />调查点</li>
  </ul>
</template>
