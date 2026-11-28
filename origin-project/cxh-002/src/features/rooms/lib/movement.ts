import type { Point, Room } from "../../../shared/types";
import { pathBlocked, pointSegmentDistance } from "../../../shared/geometry";
export function moveListener(room: Room, target: Point): Room {
  const p = {
      x: Math.max(70, Math.min(room.width - 70, target.x)),
      y: Math.max(70, Math.min(room.height - 70, target.y)),
    },
    collides = room.walls.some(
      (w) => !(w.door && w.open) && pointSegmentDistance(p, w.a, w.b) < 19,
    );
  return collides || pathBlocked(room.listener, p, room.walls)
    ? room
    : { ...room, listener: p };
}
export function turnListener(room: Room, delta: number): Room {
  return {
    ...room,
    heading: (room.heading + delta + Math.PI * 4) % (Math.PI * 2),
  };
}
