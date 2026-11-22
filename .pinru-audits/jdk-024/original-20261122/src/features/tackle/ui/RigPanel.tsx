import { SlidersHorizontal } from "lucide-react";
import type { GameDocument } from "../../../shared/types";
import type { Command } from "../../../shared/commands";
export function RigPanel({
  doc,
  busy,
  send,
}: {
  doc: GameDocument;
  busy: boolean;
  send: (c: Command) => void;
}) {
  return (
    <section className="rig-panel">
      <div className="section-title">
        <SlidersHorizontal size={16} />
        <h2>溪流轻竿</h2>
        <span>2.4 m</span>
      </div>
      <div className="rod-drawing">
        <i />
        <i />
        <i />
        <b>STILLWATER / 240</b>
      </div>
      <label>
        收线力度 <output>{Math.round(doc.power * 100)}%</output>
        <input
          aria-label="收线力度"
          type="range"
          min="15"
          max="95"
          value={doc.power * 100}
          onChange={(e) =>
            send({ type: "power", value: +e.target.value / 100 })
          }
        />
      </label>
      <label>
        泄力设置 <output>{Math.round(doc.drag * 100)}%</output>
        <input
          aria-label="泄力设置"
          disabled={busy}
          type="range"
          min="15"
          max="95"
          value={doc.drag * 100}
          onChange={(e) => send({ type: "drag", value: +e.target.value / 100 })}
        />
      </label>
      <small className="muted">力度越高收线越快，也越容易绷紧鱼线。</small>
    </section>
  );
}
