import { KEY_DIR } from "@/shared/commands";
import type { Dir } from "@/shared/types";

export function dirFromKey(event: KeyboardEvent): Dir | "reset" | null {
  const target = event.target;
  if (target instanceof HTMLElement && target.closest("input, textarea, select")) {
    return null;
  }
  if (event.key === "r" || event.key === "R") return "reset";
  return KEY_DIR[event.key] ?? null;
}

export function shouldCapture(event: KeyboardEvent): boolean {
  return dirFromKey(event) !== null;
}
