import { computed, type Ref } from "vue";
import { LEVELS, getLevel, hydrate } from "../lib/catalog";
import { betterRecord, readSave, writeSave } from "../lib/persist";
import { evaluateGadgets } from "@/features/gadget";
import { freshAttempt } from "@/features/ledger";
import type { GameDocument } from "@/shared/types";

export function loadInitial(): GameDocument {
  const saved = readSave();
  const currentLevelId =
    saved && LEVELS.some((level) => level.id === saved.currentLevelId)
      ? saved.currentLevelId
      : LEVELS[0].id;
  const document: GameDocument = {
    version: 1,
    currentLevelId,
    level: hydrate(getLevel(currentLevelId)),
    attempt: freshAttempt(),
    records: saved?.records ?? {},
  };
  evaluateGadgets(document);
  return document;
}

export function useVoyage(document: Ref<GameDocument>) {
  const catalog = computed(() =>
    LEVELS.map((level) => ({
      id: level.id,
      title: level.title,
      blurb: level.blurb,
      bestSteps: document.value.records[level.id]?.bestSteps ?? null,
      current: level.id === document.value.currentLevelId,
    })),
  );
  const completed = computed(() =>
    Object.entries(document.value.records)
      .map(([id, record]) => ({
        id,
        title: LEVELS.find((level) => level.id === id)?.title ?? id,
        bestSteps: record.bestSteps,
        clearedAt: record.clearedAt,
      }))
      .sort((a, b) => a.bestSteps - b.bestSteps),
  );

  function persist(): void {
    writeSave({
      version: 1,
      currentLevelId: document.value.currentLevelId,
      records: document.value.records,
    });
  }

  function openLevel(id: string): void {
    const blueprint = getLevel(id);
    document.value.currentLevelId = id;
    document.value.level = hydrate(blueprint);
    document.value.attempt = freshAttempt();
    evaluateGadgets(document.value);
    persist();
  }

  function resetLevel(): void {
    openLevel(document.value.currentLevelId);
  }

  function commitClear(): void {
    const id = document.value.currentLevelId;
    const steps = document.value.attempt.steps;
    document.value.records[id] = betterRecord(document.value.records[id], steps, Date.now());
    persist();
  }

  return { catalog, completed, openLevel, resetLevel, commitClear, persist };
}
