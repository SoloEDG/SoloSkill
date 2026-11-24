import { isKnownBody } from "@/features/catalog";
import { normalizeRate } from "@/features/clock";
import { sanitizeSite } from "@/features/site";
import { createDocument } from "@/shared/document";
import type { DomeDocument, PlanRecord, SiteState } from "@/shared/types";

const KEY = "jdk031-dome-session";

export function saveSession(dome: DomeDocument): void {
  const payload = {
    version: 1 as const,
    site: dome.site,
    clock: { utcMillis: dome.clock.utcMillis, rate: dome.clock.rate },
    plans: dome.plans,
    activePlanId: dome.activePlanId,
  };
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function loadSession(): DomeDocument | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return restore(parsed);
  } catch {
    return null;
  }
}

function restore(value: unknown): DomeDocument | null {
  if (!value || typeof value !== "object") return null;
  const record = value as { version?: unknown; site?: unknown; clock?: unknown; plans?: unknown; activePlanId?: unknown };
  if (record.version !== 1 || !isSite(record.site) || !record.clock || typeof record.clock !== "object") return null;
  const clock = record.clock as { utcMillis?: unknown; rate?: unknown };
  if (typeof clock.utcMillis !== "number" || !Number.isFinite(clock.utcMillis)) return null;
  const plans = sanitizePlans(record.plans);
  if (!plans.length) return null;
  const base = createDocument();
  const active = typeof record.activePlanId === "string" && plans.some((item) => item.id === record.activePlanId)
    ? record.activePlanId
    : plans[0].id;
  return {
    ...base,
    site: sanitizeSite(record.site),
    clock: {
      utcMillis: clock.utcMillis,
      playing: false,
      rate: normalizeRate(typeof clock.rate === "number" ? clock.rate : 600),
    },
    plans,
    activePlanId: active,
    selectionId: null,
  };
}

function isSite(value: unknown): value is SiteState {
  if (!value || typeof value !== "object") return false;
  const site = value as SiteState;
  return typeof site.name === "string" && [site.latDeg, site.lonDeg, site.zoneHours].every((item) => typeof item === "number" && Number.isFinite(item));
}

function sanitizePlans(value: unknown): PlanRecord[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 12).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const plan = item as PlanRecord;
    if (typeof plan.id !== "string" || !/^[a-z0-9-]{1,24}$/.test(plan.id)) return [];
    if (typeof plan.name !== "string" || !Array.isArray(plan.bodyIds)) return [];
    const bodyIds = plan.bodyIds.filter((id): id is string => typeof id === "string" && isKnownBody(id)).slice(0, 24);
    return [{ id: plan.id, name: plan.name.trim().slice(0, 24) || "未命名计划", bodyIds }];
  });
}
