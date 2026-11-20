import {
  Trophy,
  ArrowUpRight,
  Footprints,
  Gem,
  TriangleAlert,
} from "lucide-react";
import type { Report } from "../../../shared/types";
export function ResultPanel({
  report,
  onNew,
}: {
  report: Report;
  onNew: () => void;
}) {
  const title =
    report.outcome === "won"
      ? "遗迹已完整揭晓"
      : report.outcome === "lost"
        ? "探险暂告一段落"
        : "平安归营，收获已归档";
  return (
    <section className="result-panel" role="status">
      <div>
        <Trophy size={25} />
        <span>
          EXPEDITION COMPLETE<h2>{title}</h2>
        </span>
        <strong>
          {report.score}
          <small>勘探积分</small>
        </strong>
      </div>
      <p>
        <span>
          <Footprints size={13} />
          探索 {report.safe}/{report.totalSafe}
        </span>
        <span>
          <Gem size={13} />
          文物 {report.relics.length}
        </span>
        <span>
          <TriangleAlert size={13} />
          触发陷阱 {report.mistakes}
        </span>
      </p>
      <button className="primary" onClick={onNew}>
        开启新的探险
        <ArrowUpRight size={14} />
      </button>
    </section>
  );
}
