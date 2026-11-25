import type { Terrain } from "@/shared/world";

export const terrainRules = {
  floor: { label: "地砖", passable: true, opaque: false, noise: 0, dampening: 1 },
  wall: { label: "墙壁", passable: false, opaque: true, noise: 0, dampening: Infinity },
  shelf: { label: "档案架", passable: false, opaque: true, noise: 0, dampening: Infinity },
  metal: { label: "金属板", passable: true, opaque: false, noise: 2, dampening: 1 },
  mat: { label: "软垫", passable: true, opaque: false, noise: -2, dampening: 2 }
} satisfies Record<Terrain, { label: string; passable: boolean; opaque: boolean; noise: number; dampening: number }>;
