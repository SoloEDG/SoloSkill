import { computed, type Ref } from "vue";
import { boxesByKind } from "../lib/occupancy";
import { applyMove } from "../lib/push";
import type { Dir, GameDocument, MoveResult } from "@/shared/types";

export function useHauler(document: Ref<GameDocument>) {
  const counts = computed(() => boxesByKind(document.value));
  const player = computed(() => document.value.level.player);
  function tryMove(dir: Dir): MoveResult {
    return applyMove(document.value, dir);
  }
  return { counts, player, tryMove };
}
