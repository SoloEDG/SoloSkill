import { Backpack, ScanLine, Flame, ShieldCheck, Check } from "lucide-react";
import type { Expedition } from "../../../shared/types";
import type { Command } from "../../../shared/commands";
import { toolCatalog } from "../model/catalog";
import { hasTool } from "../lib/targets";
export function ToolPanel({
  expedition: e,
  send,
}: {
  expedition: Expedition;
  send: (c: Command) => void;
}) {
  return (
    <section className="tool-panel">
      <div className="panel-heading">
        <Backpack size={15} />
        <h2>随身行囊</h2>
        <span>有限补给</span>
      </div>
      <div className="tool-list">
        {toolCatalog.map((t, i) => {
          const Icon = [ScanLine, Flame, ShieldCheck][i];
          const selected = t.id === "shield" ? e.shield : e.mode === t.id;
          return (
            <button
              key={t.id}
              title={t.description}
              disabled={!hasTool(e, t.id) || (t.id === "shield" && e.shield)}
              aria-pressed={selected}
              className={"tool-card " + (selected ? "selected" : "")}
              onClick={() =>
                t.id === "shield"
                  ? send({ type: "shield" })
                  : send({
                      type: "mode",
                      mode: e.mode === t.id ? "reveal" : t.id,
                    })
              }
            >
              <span className={"tool-icon tool-" + t.id}>
                <Icon size={21} />
              </span>
              <span>
                <strong>{t.name}</strong>
                <small>{t.subtitle}</small>
              </span>
              <span className="tool-stock">
                {selected && t.id === "shield" ? (
                  <Check size={14} />
                ) : (
                  <>
                    ×<b>{e.tools[t.id]}</b>
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>
      <p className="tool-note">
        道具只在成功使用时扣除。
        <br />
        第一步探索后，才能使用补给。
      </p>
    </section>
  );
}
