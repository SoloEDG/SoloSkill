import type { Cell } from "@/shared/grid";
import type { Level, Terrain } from "@/shared/world";

const blueprint = [
  "##################",
  "#.....#..........#",
  "#.SS..#..MMM.....#",
  "#.SS.....MMM..T..#",
  "#.....##.....#...#",
  "###M####.....#...#",
  "#...M....###.....#",
  "#...M....#....SS.#",
  "#...MMM..#....SS.#",
  "#..#.........#...#",
  "#P.####.~~~..#..E#",
  "##################"
];

const terrainByCode: Record<string, Terrain> = {
  "#": "wall", "S": "shelf", "M": "metal", "~": "mat"
};

function findMarker(code: string): Cell {
  for (const [y, row] of blueprint.entries()) {
    const x = row.indexOf(code);
    if (x >= 0) return { x, y };
  }
  throw new Error(`Missing map marker: ${code}`);
}

const columns = blueprint[0].length;
if (blueprint.some((row) => row.length !== columns)) throw new Error("Map rows must have equal widths");

export const archive: Level = {
  name: "静默档案馆",
  columns,
  rows: blueprint.length,
  tiles: blueprint.flatMap((row) => Array.from(row, (code) => terrainByCode[code] ?? "floor")),
  start: findMarker("P"),
  objective: findMarker("T"),
  exit: findMarker("E"),
  routes: [
    { id: "A", label: "回廊岗", facing: "east", points: [{ x: 7, y: 6 }, { x: 8, y: 6 }, { x: 8, y: 8 }, { x: 5, y: 8 }, { x: 5, y: 6 }] },
    { id: "B", label: "档案岗", facing: "east", points: [{ x: 9, y: 2 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 9, y: 3 }] }
  ]
};
