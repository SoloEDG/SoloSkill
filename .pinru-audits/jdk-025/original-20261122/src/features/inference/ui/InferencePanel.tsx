import {
  ScanSearch,
  Lightbulb,
  TriangleAlert,
  ArrowUpRight,
} from "lucide-react";
import type { Analysis, Expedition } from "../../../shared/types";
import { coordinate } from "../../../shared/geometry";
import { inferenceSummary } from "../model/notes";
export function InferencePanel({
  analysis: a,
  expedition: e,
  showHints,
  onHints,
  onLocate,
}: {
  analysis: Analysis;
  expedition: Expedition;
  showHints: boolean;
  onHints: () => void;
  onLocate: (id: number) => void;
}) {
  return (
    <section className="inference-panel">
      <div className="panel-heading">
        <ScanSearch size={15} />
        <h2>推断笔记</h2>
        <span>LOGIC NOTES</span>
      </div>
      <div className={"logic-status " + (a.conflicts.length ? "conflict" : "")}>
        <Lightbulb size={16} />
        <p>{inferenceSummary(a, e)}</p>
      </div>
      <div className="logic-counts">
        <div>
          <b>{String(a.safe.length).padStart(2, "0")}</b>
          <span>条件安全</span>
        </div>
        <div>
          <b>{String(a.danger.length).padStart(2, "0")}</b>
          <span>推断危险</span>
        </div>
        <div>
          <b>{String(a.constraints).padStart(2, "0")}</b>
          <span>有效线索</span>
        </div>
      </div>
      <button
        className={"outline-button " + (showHints ? "active" : "")}
        aria-pressed={showHints}
        onClick={onHints}
      >
        <ScanSearch size={13} />
        {showHints ? "隐藏推断高亮" : "在地图上高亮"}
      </button>
      <div className="deduction-list">
        {[...a.safe.slice(0, 2), ...a.danger.slice(0, 1)].map((d) => (
          <button key={d.cell} onClick={() => onLocate(d.cell)}>
            <i className={d.kind} />
            <span>
              {coordinate(d.cell, e.board.width)} ·{" "}
              {d.kind === "safe" ? "可探索" : "需警惕"}
            </span>
            <ArrowUpRight size={12} />
          </button>
        ))}
      </div>
      <p className="logic-caution">
        <TriangleAlert size={11} />
        推断以你的旗标为条件，不会读取暗格答案。
      </p>
    </section>
  );
}
