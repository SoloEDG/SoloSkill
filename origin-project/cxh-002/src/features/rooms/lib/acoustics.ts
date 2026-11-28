import type { Point, Room, SoundSource } from "../../../shared/types";
import { distance, pathBlocked } from "../../../shared/geometry";
export interface ListeningSample {
  sourceId: string;
  gain: number;
  pan: number;
  occluded: boolean;
  range: number;
  heard: boolean;
}
export function listenAt(
  room: Room,
  source: SoundSource,
  listener: Point,
  heading: number,
): ListeningSample {
  const d = distance(listener, source.position),
    occluded = pathBlocked(listener, source.position, room.walls),
    gain = source.volume * Math.exp(-d / source.radius) * (occluded ? 0.26 : 1),
    angle =
      Math.atan2(
        source.position.y - listener.y,
        source.position.x - listener.x,
      ) - heading,
    pan = Math.max(-1, Math.min(1, Math.sin(angle)));
  return {
    sourceId: source.id,
    gain,
    pan,
    occluded,
    range: d,
    heard: gain > 0.025,
  };
}
export function acousticFingerprint(room: Room, listener: Point) {
  return room.sources
    .filter((s) => s.active)
    .map((s) => listenAt(room, s, listener, room.heading))
    .sort((a, b) => a.sourceId.localeCompare(b.sourceId));
}
