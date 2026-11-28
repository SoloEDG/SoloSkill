import type { Room, Wall } from "../../../shared/types";
export function toggleDoor(room: Room, id: string): Room {
  return {
    ...room,
    walls: room.walls.map((w) =>
      w.id === id && w.door ? { ...w, open: !w.open } : w,
    ),
  };
}
export function updateWall(room: Room, id: string, patch: Partial<Wall>): Room {
  return {
    ...room,
    walls: room.walls.map((w) => (w.id === id ? { ...w, ...patch } : w)),
  };
}
export function replaceRoom(room: Room, next: Room): Room {
  if (next.id !== room.id) throw new Error("房间标识不可替换");
  return next;
}
