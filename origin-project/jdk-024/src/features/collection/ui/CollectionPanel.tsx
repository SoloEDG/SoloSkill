import { useState } from "react";
import { BookOpen, Backpack, ArrowUpRight } from "lucide-react";
import type { GameDocument } from "../../../shared/types";
import type { Command } from "../../../shared/commands";
import { fishCatalog, species } from "../../../shared/catalog";
import { bagWeight } from "../lib/records";
import { FishIllustration } from "./FishIllustration";
export function CollectionPanel({
  doc,
  send,
}: {
  doc: GameDocument;
  send: (c: Command) => void;
}) {
  const [tab, setTab] = useState<"atlas" | "bag">("atlas");
  const [detail, setDetail] = useState<string | null>(null);
  const fish = detail ? species(detail) : null;
  return (
    <section className="collection-panel">
      <div className="section-title">
        <BookOpen size={17} />
        <h2>湖畔图鉴</h2>
        <span>
          {Object.keys(doc.journal).length} / {fishCatalog.length} 已发现
        </span>
      </div>
      <div className="mini-tabs">
        <button
          className={tab === "atlas" ? "active" : ""}
          onClick={() => setTab("atlas")}
        >
          <BookOpen size={13} />
          鱼类图鉴
        </button>
        <button
          className={tab === "bag" ? "active" : ""}
          onClick={() => setTab("bag")}
        >
          <Backpack size={13} />
          我的背包 <b>{doc.bag.length}</b>
        </button>
      </div>
      {tab === "atlas" ? (
        <>
          <div className="atlas-grid">
            {fishCatalog.map((f) => (
              <button
                className="fish-tile"
                key={f.id}
                onClick={() => setDetail(detail === f.id ? null : f.id)}
                aria-expanded={detail === f.id}
              >
                <FishIllustration fish={f} locked={!doc.journal[f.id]} />
                <span>{doc.journal[f.id] ? f.name : "待发现"}</span>
                <small>
                  {f.rarity}
                  <ArrowUpRight size={10} />
                </small>
              </button>
            ))}
          </div>
          {fish && (
            <div className="fish-detail">
              <strong>{fish.name}</strong>
              <em>{fish.latin}</em>
              <p>{fish.note}</p>
              <small>
                {doc.journal[fish.id]
                  ? `捕获 ${doc.journal[fish.id]?.count} 尾 · 最大 ${doc.journal[fish.id]?.best.toFixed(2)} kg`
                  : "尝试探索它偏爱的水域与鱼饵。"}
              </small>
            </div>
          )}
        </>
      ) : (
        <div className="bag-list">
          <small>
            共 {doc.bag.length} 尾 · {bagWeight(doc.bag).toFixed(2)} kg
          </small>
          {doc.bag.length === 0 && (
            <div className="empty-bag">
              <Backpack size={26} />
              <p>背包里还没有收获</p>
              <small>第一尾鱼，正等着与你相遇。</small>
            </div>
          )}
          {doc.bag.map((c) => (
            <div className="bag-item" key={c.id}>
              <FishIllustration fish={species(c.fish)} />
              <span>
                <strong>{species(c.fish).name}</strong>
                <small>{c.weight.toFixed(2)} kg</small>
              </span>
              <button
                className="text-btn"
                onClick={() => send({ type: "release", id: c.id })}
              >
                放流
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="collection-foot">把每一次相遇，留在手记里。</p>
    </section>
  );
}
