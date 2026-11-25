<script setup lang="ts">
import { Navigation } from "lucide-vue-next";
import { modeLabels, type Guard } from "../model/guards";

defineProps<{ guards: readonly Guard[] }>();
const rotations = { north: -45, east: 45, south: 135, west: 225 };
</script>

<template>
  <section class="status-section patrol-section" aria-labelledby="patrol-heading">
    <h2 id="patrol-heading">守卫状态</h2>
    <ul class="guard-list">
      <li v-for="guard in guards" :key="guard.route.id">
        <span class="guard-id">{{ guard.route.id }}</span>
        <span class="guard-name">{{ guard.route.label }}</span>
        <span class="guard-mode" :class="guard.mode"><Navigation :style="{ transform: `rotate(${rotations[guard.facing]}deg)` }" :size="12" />{{ modeLabels[guard.mode] }}</span>
      </li>
    </ul>
  </section>
</template>
