import { addCell, directions, sameCell, type Cell, type Direction } from "@/shared/grid";
import type { Command, Footstep, Level, Stance } from "@/shared/world";
import { isWalkable, terrainAt, terrainRules } from "@/features/map";
import { stances } from "./stances";

export interface Actor {
  readonly cell: Cell;
  readonly facing: Direction;
  readonly stance: Stance;
}

export interface Movement {
  readonly actor: Actor;
  readonly crossed: readonly Cell[];
  readonly footsteps: readonly Footstep[];
}

export function createActor(start: Cell): Actor {
  return { cell: start, facing: "east", stance: "crouch" };
}

export function resolveCommand(level: Level, actor: Actor, command: Command, occupied: readonly Cell[]): Movement | null {
  if (command.type === "wait") return { actor, crossed: [], footsteps: [] };
  const stance = stances[actor.stance];
  const crossed: Cell[] = [];
  const footsteps: Footstep[] = [];
  let cell = actor.cell;
  for (let step = 0; step < stance.stride; step++) {
    const next = addCell(cell, directions[command.direction]);
    if (!isWalkable(level, next)) break;
    cell = next;
    crossed.push(cell);
    const volume = Math.max(0, stance.volume + terrainRules[terrainAt(level, cell)].noise);
    if (volume > 0) footsteps.push({ cell, volume });
    if (occupied.some((position) => sameCell(position, cell))) break;
  }
  if (!crossed.length) return null;
  return { actor: { ...actor, cell, facing: command.direction }, crossed, footsteps };
}
