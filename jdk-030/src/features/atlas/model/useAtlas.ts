import { computed, type Ref } from "vue";
import { TILE } from "../lib/draw";
import { goalCells } from "../lib/grid";
import type { GameDocument } from "@/shared/types";

export function useAtlas(document: Ref<GameDocument>) {
  const tileSize = TILE;
  const board = computed(() => ({
    width: document.value.level.width * tileSize,
    height: document.value.level.height * tileSize,
    cols: document.value.level.width,
    rows: document.value.level.height,
  }));
  const goals = computed(() => goalCells(document.value.level));
  const title = computed(() => document.value.level.title);
  const blurb = computed(() => document.value.level.blurb);
  return { tileSize, board, goals, title, blurb };
}
