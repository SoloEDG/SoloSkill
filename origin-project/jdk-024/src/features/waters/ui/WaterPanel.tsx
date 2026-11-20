import { Lock, MapPin, ArrowUpRight } from "lucide-react";
import type { Command } from "../../../shared/commands";
import type { GameDocument } from "../../../shared/types";
import { waters } from "../model/waters";
import { canVisit, habitatSummary } from "../lib/habitat";
export function WaterPanel({
  doc,
  busy,
  send,
}: {
  doc: GameDocument;
  busy: boolean;
  send: (c: Command) => void;
}) {
  return (
    <section className="water-panel">
      <div className="section-title">
        <MapPin size={17} />
        <h2>寻找一片静水</h2>
        <span>03 钓点</span>
      </div>
      <p className="muted intro">每一处水域，都有不同的相遇。</p>
      <div className="water-list">
        {waters.map((w, i) => {
          const open = canVisit(doc, w.id);
          return (
            <button
              key={w.id}
              className={"water-card " + (doc.spot === w.id ? "selected" : "")}
              disabled={busy || !open}
              onClick={() => send({ type: "spot", id: w.id })}
            >
              <span className={"water-thumb thumb-" + w.id}>
                <i />
                <b>{String(i + 1).padStart(2, "0")}</b>
              </span>
              <span className="water-text">
                <small>{w.subtitle}</small>
                <strong>{w.name}</strong>
                <span>
                  {open
                    ? `${w.depth} · ${habitatSummary(w.id).count} 种鱼`
                    : `捕获 ${w.catchesRequired} 尾后解锁`}
                </span>
              </span>
              {open ? <ArrowUpRight size={16} /> : <Lock size={14} />}
            </button>
          );
        })}
      </div>
      <div className="field-note">
        <span>ANGLER’S NOTE</span>
        <p>
          “好的钓手，
          <br />
          先学会等待。”
        </p>
        <div className="hand-line" />
        <small>今日宜放慢脚步</small>
      </div>
    </section>
  );
}
