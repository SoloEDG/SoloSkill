import { cellKey, type Cell, type Direction } from "@/shared/grid";
import type { Footstep, GuardPerception, Level } from "@/shared/world";
import { canSee } from "../lib/vision";
import { soundField } from "../lib/sound";

interface Sensor {
  readonly id: string;
  readonly cell: Cell;
  readonly facing: Direction;
}

export function measure(level: Level, sensors: readonly Sensor[], trace: readonly Cell[],
  footsteps: readonly Footstep[], previous: readonly GuardPerception[], sightGain: number): GuardPerception[] {
  const sounds = footsteps.map((step) => ({ step, field: soundField(level, step) }));
  return sensors.map((sensor) => {
    let visible: Cell | undefined;
    for (const cell of trace) if (canSee(level, sensor.cell, sensor.facing, cell)) visible = cell;

    let heard = 0;
    let soundCell: Cell | undefined;
    for (const { step, field } of sounds) {
      const volume = field.get(cellKey(sensor.cell)) ?? 0;
      if (volume > 0 && volume >= heard) {
        heard = volume;
        soundCell = step.cell;
      }
    }
    const points = previous.find((reading) => reading.id === sensor.id)?.points ?? 0;
    const next = visible || heard > 0 ? points + (visible ? sightGain : 0) + heard * 8 : points - 21;
    const clue = visible ? { cell: visible, source: "sight" } as const
      : soundCell ? { cell: soundCell, source: "sound" } as const : null;
    return { id: sensor.id, points: Math.max(0, Math.min(100, next)), sawPlayer: !!visible, heard, clue };
  });
}

export function strongestExposure(readings: readonly GuardPerception[]) {
  return Math.max(0, ...readings.map((reading) => reading.points));
}

export function visibleCells(level: Level, sensors: readonly Sensor[]) {
  const visible = new Set<string>();
  level.tiles.forEach((_, index) => {
    const cell = { x: index % level.columns, y: Math.floor(index / level.columns) };
    if (sensors.some((sensor) => canSee(level, sensor.cell, sensor.facing, cell))) visible.add(cellKey(cell));
  });
  return visible;
}
