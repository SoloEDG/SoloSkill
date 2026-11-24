import { computed, type Ref } from "vue";
import { evaluateGadgets, poweredSummary } from "../lib/power";
import type { GameDocument } from "@/shared/types";

export function useGadget(document: Ref<GameDocument>) {
  const plates = computed(() => document.value.level.plates);
  const doors = computed(() => document.value.level.doors);
  const floors = computed(() => document.value.level.floors);
  const summary = computed(() => poweredSummary(document.value));
  function refresh(): void {
    evaluateGadgets(document.value);
  }
  return { plates, doors, floors, summary, refresh };
}
