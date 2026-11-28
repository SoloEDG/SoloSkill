import type {
  Challenge,
  Point,
  Room,
  SearchEvent,
  SearchSession,
} from "../../../shared/types";
export function startSession(challenge: Challenge): SearchSession {
  return {
    id: crypto.randomUUID(),
    challengeId: challenge.id,
    startedAt: Date.now(),
    endedAt: null,
    events: [],
    foundIds: [],
    status: "active",
  };
}
export function appendEvent(
  session: SearchSession,
  type: SearchEvent["type"],
  room: Room,
  detail: string,
  sourceId?: string,
): SearchSession {
  return {
    ...session,
    events: [
      ...session.events,
      {
        id: crypto.randomUUID(),
        type,
        time: (Date.now() - session.startedAt) / 1000,
        position: { ...room.listener },
        heading: room.heading,
        detail,
        sourceId,
      },
    ],
  };
}
export function headingVector(h: number): Point {
  return { x: Math.cos(h), y: Math.sin(h) };
}
