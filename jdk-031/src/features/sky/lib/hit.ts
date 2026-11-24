import type { PlacedBody } from "@/features/sky/lib/scene";

export function pickBody(bodies: PlacedBody[], x: number, y: number): string | null {
  let best: { id: string; score: number } | null = null;
  for (const body of bodies) {
    if (!body.screen) continue;
    const distance = Math.hypot(body.screen.x - x, body.screen.y - y);
    const reach = body.kind === "star" ? 12 : 18;
    if (distance > reach) continue;
    const score = distance - Math.max(0, 1.4 - body.mag) * 0.8;
    if (!best || score < best.score) best = { id: body.id, score };
  }
  return best?.id ?? null;
}
