import { useState } from "react";
import { BookOpen, ScrollText, Gem, ChevronDown } from "lucide-react";
import type { Archive, Expedition } from "../../../shared/types";
import { relicCatalog } from "../model/relics";
export function ChroniclePanel({
  archive,
  expedition: e,
}: {
  archive: Archive;
  expedition: Expedition;
}) {
  const [tab, setTab] = useState<"relics" | "log">("relics");
  const [detail, setDetail] = useState<string | null>(null);
  const found = e.board.cells
    .filter((c) => c.revealed && c.relic && !c.mine)
    .map((c) => c.relic);
  return (
    <section className="chronicle-panel">
      <div className="panel-heading">
        <BookOpen size={15} />
        <h2>探险手记</h2>
        <span>{e.actions.length} 条记录</span>
      </div>
      <div className="mini-tabs">
        <button
          className={tab === "relics" ? "active" : ""}
          onClick={() => setTab("relics")}
        >
          <Gem size={12} />
          遗迹收藏
        </button>
        <button
          className={tab === "log" ? "active" : ""}
          onClick={() => setTab("log")}
        >
          <ScrollText size={12} />
          行动日志
        </button>
      </div>
      {tab === "relics" ? (
        <div className="relic-list">
          {relicCatalog.map((r) => {
            const count = found.filter((id) => id === r.id).length;
            const known = count > 0 || !!archive.discoveries[r.id];
            return (
              <button
                className={"relic-card " + (known ? "discovered" : "")}
                key={r.id}
                onClick={() => setDetail(detail === r.id ? null : r.id)}
                aria-expanded={detail === r.id}
              >
                <span className="relic-symbol">{r.symbol}</span>
                <span>
                  <strong>{known ? r.name : "未知文物"}</strong>
                  <small>{known ? r.age : "遗迹深处，等待发现"}</small>
                  {detail === r.id && (
                    <em>
                      {known ? r.note : "揭开藏有文物的安全石板，即可收集。"}
                    </em>
                  )}
                </span>
                <span className="relic-quantity">
                  {count ? `+${count}` : <ChevronDown size={11} />}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="action-log">
          {e.actions.length === 0 ? (
            <p>第一条记录，始于你的第一步。</p>
          ) : (
            [...e.actions]
              .reverse()
              .slice(0, 20)
              .map((a) => (
                <div key={a.id}>
                  <small>
                    {String(Math.floor(a.second / 60)).padStart(2, "0")}:
                    {String(a.second % 60).padStart(2, "0")}
                  </small>
                  <span>{a.message}</span>
                </div>
              ))
          )}
        </div>
      )}
      <div className="archive-mini">
        <div>
          <strong>{String(archive.reports.length).padStart(2, "0")}</strong>
          <small>探险归档</small>
        </div>
        <div>
          <strong>{archive.totalScore.toLocaleString()}</strong>
          <small>累计勘探积分</small>
        </div>
        <span>
          留下足迹，
          <br />
          也带走故事。
        </span>
      </div>
    </section>
  );
}
