import type { Archive, Expedition } from "../../../shared/types";
import { isTerminal } from "../../../shared/initial";
import { expeditionReport } from "../lib/score";
export function settle(archive: Archive, e: Expedition, now: number): Archive {
  if (!isTerminal(e.status) || archive.reports.some((r) => r.id === e.id))
    return archive;
  const report = expeditionReport(e, now);
  const discoveries = { ...archive.discoveries };
  for (const id of report.relics) discoveries[id] = (discoveries[id] ?? 0) + 1;
  return {
    reports: [report, ...archive.reports].slice(0, 50),
    discoveries,
    totalScore: archive.totalScore + report.score,
  };
}
