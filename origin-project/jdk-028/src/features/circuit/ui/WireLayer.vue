<script setup lang="ts">
import type { CircuitDocument, SimulationResult } from "@/shared/types";
import { portPoint, wirePath } from "../lib/geometry";
const props = defineProps<{
  document: CircuitDocument;
  signals: SimulationResult;
  selected: string | null;
}>();
defineEmits<{ select: [id: string] }>();
function pathFor(id: string) {
  const wire = props.document.wires.find((w) => w.id === id)!;
  const from = props.document.nodes.find((n) => n.id === wire.from.nodeId);
  const to = props.document.nodes.find((n) => n.id === wire.to.nodeId);
  return from && to
    ? wirePath(
        portPoint(from, "output", wire.from.port),
        portPoint(to, "input", wire.to.port),
      )
    : "";
}
</script>
<template>
  <g class="wires"
    ><g v-for="wire in document.wires" :key="wire.id"
      ><path
        :d="pathFor(wire.id)"
        class="wire-hit"
        role="button"
        tabindex="0"
        aria-label="选择连线"
        @pointerdown.stop
        @click.stop="$emit('select', wire.id)"
        @keydown.enter="$emit('select', wire.id)" /><path
        :d="pathFor(wire.id)"
        :class="[
          'wire',
          `wire-${signals.wires[wire.id] ?? 'X'}`,
          { 'wire-selected': selected === wire.id },
        ]" /></g
  ></g>
</template>
