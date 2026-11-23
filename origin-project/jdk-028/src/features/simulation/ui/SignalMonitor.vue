<script setup lang="ts">
import { computed } from "vue";
import type { CircuitDocument, SimulationResult } from "@/shared/types";
const props = defineProps<{
  document: CircuitDocument;
  signals: SimulationResult;
  selected: string | null;
}>();
const node = computed(() =>
  props.document.nodes.find((n) => n.id === props.selected),
);
const unknowns = computed(
  () =>
    Object.values(props.signals.values).filter((value) => value === "X").length,
);
</script>
<template>
  <div class="signal-monitor">
    <div class="panel-heading"><span>信号观测</span><small>PROBE</small></div>
    <div v-if="node" class="probe-detail">
      <b>{{ node.label }}</b
      ><span v-for="(value, port) in signals.pins[node.id]" :key="port"
        >IN{{ port + 1 }}
        <strong :class="`text-${value}`">{{ value }}</strong></span
      ><span
        >OUT
        <strong :class="`text-${signals.values[node.id]}`">{{
          signals.values[node.id]
        }}</strong></span
      >
    </div>
    <div v-else class="probe-detail">
      <span>{{ document.nodes.length }} 个元件</span
      ><span>{{ document.wires.length }} 条连线</span
      ><span>{{
        unknowns ? `${unknowns} 个未确定信号` : "全部信号已确定"
      }}</span>
    </div>
    <p class="small-note">
      {{
        unknowns
          ? "X 表示端口悬空或信号尚未确定。点击元件检查输入。"
          : "亮橙色线路表示 1，蓝灰色线路表示 0。"
      }}
    </p>
  </div>
</template>
