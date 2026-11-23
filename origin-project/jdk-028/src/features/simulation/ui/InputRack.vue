<script setup lang="ts">
import type { GateNode, SimulationResult } from "@/shared/types";
defineProps<{ nodes: GateNode[]; signals: SimulationResult }>();
defineEmits<{ toggle: [id: string] }>();
</script>
<template>
  <div class="input-rack">
    <div class="panel-heading">
      <span>输入控制</span><small>LIVE INPUTS</small>
    </div>
    <div class="rack-switches">
      <button
        v-for="node in nodes.filter((n) => n.kind === 'INPUT')"
        :key="node.id"
        :class="['rack-switch', { on: signals.values[node.id] === 1 }]"
        :aria-label="`切换输入 ${node.label}`"
        :aria-pressed="signals.values[node.id] === 1"
        @click="$emit('toggle', node.id)"
      >
        <span>{{ node.label }}</span
        ><i /><b>{{ signals.values[node.id] }}</b></button
      ><span v-if="!nodes.some((n) => n.kind === 'INPUT')" class="panel-help"
        >放置一个输入开关以发送信号。</span
      >
    </div>
  </div>
</template>
