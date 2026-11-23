import { computed, type Ref } from "vue";
import type { CircuitDocument } from "@/shared/types";
import { evaluate } from "../lib/evaluate";
export function useSimulation(document: Ref<CircuitDocument>) {
  const signals = computed(() => evaluate(document.value));
  function toggle(id: string) {
    const node = document.value.nodes.find((n) => n.id === id);
    if (node?.kind === "INPUT") node.value = node.value === 0 ? 1 : 0;
  }
  return { signals, toggle };
}
