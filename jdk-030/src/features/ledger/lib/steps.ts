import type { Attempt, GameDocument, MoveResult } from "@/shared/types";

export function freshAttempt(): Attempt {
  return { steps: 0, status: "playing" };
}

export function countMove(document: GameDocument, result: MoveResult): boolean {
  if (!result.moved || document.attempt.status !== "playing") return false;
  document.attempt.steps += 1;
  return true;
}

export function markCleared(document: GameDocument): boolean {
  if (document.attempt.status === "cleared") return false;
  document.attempt.status = "cleared";
  return true;
}
