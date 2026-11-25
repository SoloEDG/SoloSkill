import type { Command, Stance } from "@/shared/world";

const commands: Record<string, Command> = {
  arrowup: { type: "move", direction: "north" },
  w: { type: "move", direction: "north" },
  arrowright: { type: "move", direction: "east" },
  d: { type: "move", direction: "east" },
  arrowdown: { type: "move", direction: "south" },
  s: { type: "move", direction: "south" },
  arrowleft: { type: "move", direction: "west" },
  a: { type: "move", direction: "west" },
  " ": { type: "wait" },
  ".": { type: "wait" }
};

const modes: Record<string, Stance> = { "1": "crouch", "2": "walk", "3": "dash" };

export function keyboardIntent(event: KeyboardEvent) {
  if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return null;
  if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable]")) return null;
  if (event.key === " " && event.target instanceof HTMLElement && event.target.closest("button")) return null;
  const key = event.key.toLowerCase();
  return { command: commands[key], stance: modes[key] };
}
