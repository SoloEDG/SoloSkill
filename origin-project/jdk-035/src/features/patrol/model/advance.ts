import { cellKey, facingBetween, sameCell, type Direction } from "@/shared/grid";
import type { GuardPerception, Level } from "@/shared/world";
import type { Guard } from "./guards";
import { nextStep } from "../lib/path";

const sweep: readonly Direction[] = ["north", "east", "south", "west"];

function advanceOne(level: Level, guard: Guard, occupied: Set<string>): Guard {
  if (guard.mode === "search") {
    const facing = sweep[(sweep.indexOf(guard.facing) + 1) % sweep.length];
    if (guard.searchLeft > 1) return { ...guard, facing, searchLeft: guard.searchLeft - 1 };
    return { ...guard, mode: "return", facing, target: null, searchLeft: 0 };
  }
  const patrolling = guard.mode === "patrol";
  const investigating = guard.mode === "investigate";
  const destination = (investigating ? guard.target : guard.route.points[guard.nextPoint]) ?? guard.cell;
  const cell = nextStep(level, guard.cell, destination, occupied);
  const facing = sameCell(guard.cell, cell) ? guard.facing : facingBetween(guard.cell, cell);
  if (!sameCell(cell, destination)) return { ...guard, cell, facing };
  if (investigating) return { ...guard, cell, facing, mode: "search", searchLeft: 2 };
  return { ...guard, cell, facing, mode: "patrol", nextPoint: (guard.nextPoint + 1) % guard.route.points.length,
    target: patrolling ? guard.target : null };
}

export function advanceGuards(level: Level, guards: readonly Guard[]): Guard[] {
  const occupied = new Set(guards.map((guard) => cellKey(guard.cell)));
  return guards.map((guard) => {
    occupied.delete(cellKey(guard.cell));
    const moved = advanceOne(level, guard, occupied);
    occupied.add(cellKey(moved.cell));
    return moved;
  });
}

export function respondToClues(guards: readonly Guard[], readings: readonly GuardPerception[]): Guard[] {
  return guards.map((guard) => {
    const clue = readings.find((reading) => reading.id === guard.route.id)?.clue;
    if (!clue || (guard.mode === "search" && sameCell(guard.cell, clue.cell))) return guard;
    return { ...guard, mode: "investigate", target: clue.cell, searchLeft: 0 };
  });
}
