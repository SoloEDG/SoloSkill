export const PLAN_LIMIT = 24;

export function addMember(ids: readonly string[], id: string): { ids: string[]; status: "ok" | "duplicate" | "limit" } {
  if (ids.includes(id)) return { ids: [...ids], status: "duplicate" };
  if (ids.length >= PLAN_LIMIT) return { ids: [...ids], status: "limit" };
  return { ids: [...ids, id], status: "ok" };
}

export function removeMember(ids: readonly string[], id: string): string[] {
  return ids.filter((item) => item !== id);
}

export function planId(): string {
  return `plan-${Math.random().toString(36).slice(2, 8)}`;
}
