import type { Cell, Direction } from "@/shared/grid";
import type { GuardMode, GuardRoute, Level } from "@/shared/world";

export interface Guard {
  readonly route: GuardRoute;
  readonly cell: Cell;
  readonly facing: Direction;
  readonly mode: GuardMode;
  readonly nextPoint: number;
  readonly target: Cell | null;
  readonly searchLeft: number;
}

export const modeLabels: Record<GuardMode, string> = {
  patrol: "巡逻", investigate: "调查", search: "搜索", return: "返回"
};

export function createGuards(level: Level): Guard[] {
  return level.routes.map((route) => ({
    route,
    cell: route.points[0],
    facing: route.facing,
    mode: "patrol",
    nextPoint: 1 % route.points.length,
    target: null,
    searchLeft: 0
  }));
}
