import { findBody } from "@/features/catalog";
import { bodyHorizontal } from "@/features/sky";
import { formatAzimuth, formatSigned } from "@/shared/angles";
import type { DomeDocument } from "@/shared/types";

export interface PlanRow {
  id: string;
  name: string;
  altDeg: number;
  azDeg: number;
  above: boolean;
  trend: "rising" | "setting" | "still";
  altText: string;
  azText: string;
  stateText: string;
}

export function aboveHorizon(altDeg: number): boolean {
  return altDeg > 0;
}

export function describePlan(dome: DomeDocument): PlanRow[] {
  const plan = dome.plans.find((item) => item.id === dome.activePlanId) ?? dome.plans[0];
  if (!plan) return [];
  return plan.bodyIds.flatMap((id) => {
    const body = findBody(id);
    const now = bodyHorizontal(id, dome);
    if (!body || !now) return [];
    const later = bodyHorizontal(id, {
      ...dome,
      clock: { ...dome.clock, utcMillis: dome.clock.utcMillis + 600_000 },
    });
    const delta = (later?.altDeg ?? now.altDeg) - now.altDeg;
    const trend = delta > 0.15 ? "rising" : delta < -0.15 ? "setting" : "still";
    const above = aboveHorizon(now.altDeg);
    return [
      {
        id,
        name: body.name,
        altDeg: now.altDeg,
        azDeg: now.azDeg,
        above,
        trend,
        altText: formatSigned(now.altDeg),
        azText: formatAzimuth(now.azDeg),
        stateText: `${above ? "地平线上" : "地平线下"} · ${trendText(trend)}`,
      },
    ];
  });
}

function trendText(trend: PlanRow["trend"]): string {
  if (trend === "rising") return "升起";
  if (trend === "setting") return "落下";
  return "高度几乎不动";
}
