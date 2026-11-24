import { computed, type Ref } from "vue";
import { findBody } from "@/features/catalog";
import { addMember, planId, PLAN_LIMIT, removeMember } from "@/features/plan/lib/membership";
import { describePlan, type PlanRow } from "@/features/plan/lib/rows";
import type { DomeDocument } from "@/shared/types";

export function usePlan(dome: Ref<DomeDocument>) {
  const rows = computed(() => describePlan(dome.value));
  const active = computed(() => dome.value.plans.find((item) => item.id === dome.value.activePlanId) ?? dome.value.plans[0]);

  function add(id: string): "ok" | "missing" | "duplicate" | "limit" {
    if (!findBody(id)) return "missing";
    const plan = active.value;
    if (!plan) return "missing";
    const next = addMember(plan.bodyIds, id);
    plan.bodyIds = next.ids;
    return next.status;
  }

  function remove(id: string): void {
    const plan = active.value;
    if (!plan) return;
    plan.bodyIds = removeMember(plan.bodyIds, id);
  }

  function rename(name: string): void {
    const plan = active.value;
    if (!plan) return;
    const trimmed = name.trim().slice(0, 24);
    if (trimmed) plan.name = trimmed;
  }

  function create(name: string): void {
    const id = planId();
    dome.value.plans.push({ id, name: name.trim().slice(0, 24) || "新的计划", bodyIds: [] });
    dome.value.activePlanId = id;
  }

  function activate(id: string): void {
    if (dome.value.plans.some((item) => item.id === id)) dome.value.activePlanId = id;
  }

  function removePlan(id: string): void {
    if (dome.value.plans.length < 2) return;
    dome.value.plans = dome.value.plans.filter((item) => item.id !== id);
    if (!dome.value.plans.some((item) => item.id === dome.value.activePlanId)) {
      dome.value.activePlanId = dome.value.plans[0].id;
    }
  }

  return { rows, active, add, remove, rename, create, activate, removePlan, limit: PLAN_LIMIT };
}

export type { PlanRow };
