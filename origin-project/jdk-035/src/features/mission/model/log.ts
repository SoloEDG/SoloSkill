import type { GuardPerception, RunEvent } from "@/shared/world";
import type { Objective } from "./objective";

interface Report {
  turn: number;
  before: Objective;
  after: Objective;
  observations: readonly GuardPerception[];
  identified: readonly string[];
}

export const initialEvent: RunEvent = { turn: 0, tone: "neutral", text: "已进入静默档案馆" };

export function describeTurn({ turn, before, after, observations, identified }: Report): RunEvent[] {
  const entries: RunEvent[] = [];
  if (before.securedAt === null && after.securedAt !== null) entries.push({ turn, tone: "objective", text: "已取得档案核心" });
  if (after.phase === "caught") entries.push({ turn, tone: "alert", text: "玩家已被截获" });
  if (after.phase === "escaped") entries.push({ turn, tone: "objective", text: "档案核心已撤离" });
  for (const observation of observations) {
    if (!identified.includes(observation.id)) continue;
    const detail = observation.sawPlayer ? "观察到移动" : "听见脚步";
    entries.push({ turn, tone: "alert", text: `守卫 ${observation.id} ${detail}，转入调查` });
  }
  return entries;
}
