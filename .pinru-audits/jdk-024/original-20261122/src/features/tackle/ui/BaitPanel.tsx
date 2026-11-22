import { PackageOpen, RefreshCw, Check } from "lucide-react";
import type { GameDocument } from "../../../shared/types";
import type { Command } from "../../../shared/commands";
import { baits } from "../model/baits";
import { attraction } from "../lib/affinity";
export function BaitPanel({
  doc,
  busy,
  send,
}: {
  doc: GameDocument;
  busy: boolean;
  send: (c: Command) => void;
}) {
  const choices = attraction(doc.spot, doc.bait);
  return (
    <section className="bait-panel">
      <div className="section-title">
        <PackageOpen size={17} />
        <h2>鱼饵盒</h2>
        <button
          className="text-btn"
          disabled={busy}
          onClick={() => send({ type: "resupply" })}
        >
          <RefreshCw size={12} />
          补给
        </button>
      </div>
      <div className="bait-list">
        {baits.map((b) => (
          <button
            key={b.id}
            disabled={busy || !doc.stock[b.id]}
            onClick={() => send({ type: "bait", id: b.id })}
            className={"bait-card " + (doc.bait === b.id ? "active" : "")}
          >
            <span className="bait-icon" style={{ color: b.color }}>
              {b.icon}
            </span>
            <span>
              <strong>{b.name}</strong>
              <small>{b.note}</small>
            </span>
            <span className="stock">
              ×{doc.stock[b.id]}
              {doc.bait === b.id && <Check size={13} />}
            </span>
          </button>
        ))}
      </div>
      <p className="bait-hint">
        当前偏好：
        {choices
          .filter((v) => v.fish.baits.includes(doc.bait))
          .map((v) => v.fish.name)
          .join("、") || "探索未知鱼群"}
      </p>
    </section>
  );
}
