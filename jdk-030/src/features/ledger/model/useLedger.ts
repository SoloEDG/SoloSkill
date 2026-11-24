import { computed, type Ref } from "vue";
import { countMove, markCleared } from "../lib/steps";
import { coverageLine, goalsSatisfied } from "../lib/win";
import type { GameDocument, MoveResult } from "@/shared/types";

export function useLedger(document: Ref<GameDocument>) {
  const steps = computed(() => document.value.attempt.steps);
  const status = computed(() => document.value.attempt.status);
  const coverage = computed(() => coverageLine(document.value));
  function afterMove(result: MoveResult): { counted: boolean; cleared: boolean } {
    const counted = countMove(document.value, result);
    if (!counted) return { counted: false, cleared: false };
    if (goalsSatisfied(document.value)) return { counted: true, cleared: markCleared(document.value) };
    return { counted: true, cleared: false };
  }
  return { steps, status, coverage, afterMove, goalsSatisfied: () => goalsSatisfied(document.value) };
}
