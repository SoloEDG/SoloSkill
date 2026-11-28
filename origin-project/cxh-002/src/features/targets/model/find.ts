import type { Room, SearchSession } from "../../../shared/types";
import { distance } from "../../../shared/geometry";
import { appendEvent } from "../../movement";
export function attemptFind(room: Room, session: SearchSession, id: string) {
  const target = room.sources.find((s) => s.id === id);
  if (!target || target.found) return { room, session, success: false };
  if (distance(room.listener, target.position) > 38)
    return {
      room,
      session: appendEvent(session, "hint", room, "离目标还有一段距离", id),
      success: false,
    };
  const nextRoom = {
    ...room,
    sources: room.sources.map((s) => (s.id === id ? { ...s, found: true } : s)),
  };
  return {
    room: nextRoom,
    session: {
      ...appendEvent(session, "found", nextRoom, "找到目标", id),
      foundIds: [...session.foundIds, id],
    },
    success: true,
  };
}
