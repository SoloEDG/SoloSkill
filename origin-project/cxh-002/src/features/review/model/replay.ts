import type { Room, SearchEvent, SearchSession } from "../../../shared/types";
export function eventsAt(s: SearchSession, t: number): SearchEvent[] {
  return s.events.filter((e) => e.time <= t);
}
export function roomAt(s: SearchSession, b: Room, t: number): Room {
  const e = eventsAt(s, t),
    last = [...e]
      .reverse()
      .find(
        (v) => v.type === "move" || v.type === "turn" || v.type === "found",
      );
  return last ? { ...b, listener: last.position, heading: last.heading } : b;
}
export function soundMoments(s: SearchSession) {
  return s.events
    .filter((e) => e.type === "sound")
    .map((e) => ({ time: e.time, position: e.position, sourceId: e.sourceId }));
}
