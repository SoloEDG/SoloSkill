import type { SearchSession } from "../../../shared/types";

export interface RouteMetrics {
  distance: number;
  turns: number;
  soundStops: number;
  firstFind: number | null;
}

export function measureRoute(session: SearchSession): RouteMetrics {
  let distance = 0;
  let previous: SearchSession["events"][number] | undefined;
  for (const event of session.events) {
    if (event.type === "move" && previous) {
      distance += Math.hypot(
        event.position.x - previous.position.x,
        event.position.y - previous.position.y,
      );
    }
    if (event.type === "move" || event.type === "turn") previous = event;
  }
  const firstFind =
    session.events.find((event) => event.type === "found")?.time ?? null;
  return {
    distance: Math.round(distance),
    turns: session.events.filter((event) => event.type === "turn").length,
    soundStops: session.events.filter((event) => event.type === "sound").length,
    firstFind,
  };
}

export function routeSummary(session: SearchSession): string {
  const metrics = measureRoute(session);
  return `${metrics.distance} unit · ${metrics.turns} turns · ${metrics.soundStops} sound cues`;
}
