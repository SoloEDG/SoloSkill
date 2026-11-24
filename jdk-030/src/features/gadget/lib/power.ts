import { sameCell } from "@/shared/document";
import type { GameDocument } from "@/shared/types";

export function plateHeld(document: GameDocument, plateId: string): boolean {
  const plate = document.level.plates.find((item) => item.id === plateId);
  if (!plate) return false;
  return document.level.boxes.some(
    (box) => sameCell(box, plate) && box.kind === plate.accept,
  );
}

export function evaluateGadgets(document: GameDocument): void {
  const doorPower = new Set<string>();
  const floorPower = new Set<string>();
  for (const plate of document.level.plates) {
    const held = document.level.boxes.some(
      (box) => sameCell(box, plate) && box.kind === plate.accept,
    );
    plate.powered = held;
    if (!held) continue;
    for (const id of plate.doorIds) doorPower.add(id);
    for (const id of plate.floorIds) floorPower.add(id);
  }
  for (const door of document.level.doors) door.open = doorPower.has(door.id);
  for (const floor of document.level.floors) floor.active = floorPower.has(floor.id);
}

export function poweredSummary(document: GameDocument): string {
  const plates = document.level.plates.filter((plate) => plate.powered).length;
  const doors = document.level.doors.filter((door) => door.open).length;
  const floors = document.level.floors.filter((floor) => floor.active).length;
  return `${plates} 块踏板供电 · ${doors} 扇门打开 · ${floors} 处地板变形`;
}
