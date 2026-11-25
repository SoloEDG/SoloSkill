<script setup lang="ts">
import { computed } from "vue";
import type { RunEvent } from "@/shared/world";

const props = defineProps<{ events: readonly RunEvent[] }>();
const latest = computed(() => props.events.slice(-5).reverse());
</script>

<template>
  <section class="status-section log-section" aria-labelledby="log-heading">
    <h2 id="log-heading">行动记录</h2>
    <ol aria-live="polite">
      <li v-for="(event, index) in latest" :key="`${event.turn}:${index}`" :class="event.tone">
        <time>{{ String(event.turn).padStart(2, '0') }}</time><span>{{ event.text }}</span>
      </li>
    </ol>
  </section>
</template>
