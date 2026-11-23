import { ref } from "vue";
import type {
  CircuitDocument,
  GateKind,
  GateNode,
  Point,
} from "@/shared/types";
import { createId } from "@/shared/document";
export function usePlacement() {
  const tool = ref<GateKind | null>(null);
  function createNode(
    document: CircuitDocument,
    kind: GateKind,
    position: Point,
  ): GateNode {
    const peers = document.nodes.filter((node) => node.kind === kind);
    const label =
      kind === "INPUT"
        ? (["A", "B", "C", "D"].find(
            (name) => !document.nodes.some((node) => node.label === name),
          ) ?? `I${peers.length + 1}`)
        : kind === "OUTPUT"
          ? peers.length
            ? `Y${peers.length + 1}`
            : "Y"
          : `${kind} ${peers.length + 1}`;
    return {
      id: createId("node"),
      kind,
      label,
      value: 0,
      x: position.x,
      y: position.y,
    };
  }
  return { tool, createNode };
}
