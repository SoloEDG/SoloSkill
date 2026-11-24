export { usePlan } from "@/features/plan/model/usePlan";
export { aboveHorizon, describePlan } from "@/features/plan/lib/rows";
export { PLAN_LIMIT } from "@/features/plan/lib/membership";
export { loadSession, saveSession } from "@/features/plan/lib/storage";
export { default as PlanBoard } from "@/features/plan/ui/PlanBoard.vue";

export function saveNote(planCount: number, targetCount: number): string {
  if (!targetCount) return "当前计划是空的，地点和时刻仍会记住。";
  return `已记住 ${planCount} 份计划，当前这份有 ${targetCount} 个目标。`;
}
