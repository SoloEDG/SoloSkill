<script setup lang="ts">
import { ref } from "vue";
import type {
  CircuitDocument,
  GateKind,
  SimulationResult,
  Point,
} from "@/shared/types";
import type { PortRequest } from "@/shared/commands";
import { BOARD, snapPosition } from "../lib/geometry";
import GateNodeView from "./GateNode.vue";
import WireLayer from "./WireLayer.vue";
const props = defineProps<{
  document: CircuitDocument;
  signals: SimulationResult;
  selected: string | null;
  pending: PortRequest | null;
  tool: GateKind | null;
}>();
const emit = defineEmits<{
  place: [point: Point];
  move: [id: string, point: Point];
  select: [id: string | null];
  port: [port: PortRequest];
  toggle: [id: string];
}>();
const svg = ref<SVGSVGElement | null>(null);
let drag: { id: string; offset: Point } | null = null;
function coordinate(event: PointerEvent): Point {
  const matrix = svg.value?.getScreenCTM();
  if (!matrix) return { x: 0, y: 0 };
  return new DOMPoint(event.clientX, event.clientY).matrixTransform(
    matrix.inverse(),
  );
}
function startDrag(event: PointerEvent, id: string) {
  if (event.button !== 0) return;
  emit("select", id);
  const node = props.document.nodes.find((n) => n.id === id)!;
  const point = coordinate(event);
  drag = { id, offset: { x: point.x - node.x, y: point.y - node.y } };
  svg.value?.setPointerCapture(event.pointerId);
}
function pointerMove(event: PointerEvent) {
  if (!drag) return;
  const point = coordinate(event);
  emit(
    "move",
    drag.id,
    snapPosition({ x: point.x - drag.offset.x, y: point.y - drag.offset.y }),
  );
}
function background(event: PointerEvent) {
  if (event.button !== 0) return;
  if (props.tool) emit("place", snapPosition(coordinate(event)));
  else emit("select", null);
}
</script>
<template>
  <div class="board-scroll">
    <svg
      ref="svg"
      class="circuit-board"
      :class="{ placing: tool }"
      :viewBox="`0 0 ${BOARD.width} ${BOARD.height}`"
      aria-label="电路接线工作台"
      @pointermove="pointerMove"
      @pointerup="drag = null"
      @pointercancel="drag = null"
      @lostpointercapture="drag = null"
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#c9d5dd" />
        </pattern>
      </defs>
      <rect
        width="1000"
        height="520"
        fill="url(#grid)"
        @pointerdown="background"
      />
      <text x="25" y="29" class="board-caption">
        COMBINATIONAL CIRCUIT / 组合逻辑接线台
      </text>
      <WireLayer
        :document="document"
        :signals="signals"
        :selected="selected"
        @select="emit('select', $event)"
      />
      <GateNodeView
        v-for="node in document.nodes"
        :key="node.id"
        :node="node"
        :value="signals.values[node.id] ?? 'X'"
        :selected="selected === node.id"
        :pending="pending?.nodeId === node.id"
        @start-drag="startDrag"
        @port="emit('port', $event)"
        @toggle="emit('toggle', $event)"
        @select="emit('select', $event)"
      />
      <text
        v-if="!document.nodes.length"
        x="500"
        y="260"
        text-anchor="middle"
        class="empty-board"
      >
        从左侧选择元件，开始你的第一个电路
      </text>
    </svg>
  </div>
</template>
