import { useRef, useState } from "react";
import { Pause, Play, MapPin, Maximize2, Flag, Gem } from "lucide-react";
import type { Analysis, Expedition } from "../../../shared/types";
import type { Command } from "../../../shared/commands";
import { isTerminal } from "../../../shared/initial";
import { region } from "../model/regions";
import { BoardCell } from "./BoardCell";
export function BoardView({
  expedition: e,
  analysis,
  showHints,
  send,
}: {
  expedition: Expedition;
  analysis: Analysis;
  showHints: boolean;
  send: (c: Command) => void;
}) {
  const [focus, setFocus] = useState(44);
  const wrap = useRef<HTMLDivElement>(null);
  const r = region(e.board.difficulty);
  const hints = new Map(
    showHints
      ? [...analysis.safe, ...analysis.danger].map((h) => [h.cell, h.kind])
      : [],
  );
  const activeFocus = Math.min(focus, e.board.cells.length - 1);
  const navigate = (id: number, key: string) => {
    const x = id % e.board.width,
      y = Math.floor(id / e.board.width);
    const next =
      key === "ArrowLeft"
        ? x > 0
          ? id - 1
          : id
        : key === "ArrowRight"
          ? x < e.board.width - 1
            ? id + 1
            : id
          : key === "ArrowUp"
            ? y > 0
              ? id - e.board.width
              : id
            : y < e.board.height - 1
              ? id + e.board.width
              : id;
    setFocus(next);
    wrap.current
      ?.querySelector<HTMLButtonElement>(`[data-cell="${next}"]`)
      ?.focus();
  };
  return (
    <section className="board-panel">
      <div className="board-heading">
        <div>
          <span className="eyebrow">EXPEDITION 025 / {r.code}</span>
          <h2>
            {r.name}
            <span>{r.tag}</span>
          </h2>
        </div>
        <div className="board-actions">
          <span>
            <i />{" "}
            {e.status === "ready"
              ? "待出发"
              : e.status === "active"
                ? "探险进行中"
                : "探险已结束"}
          </span>
          <button
            className="icon-button"
            aria-label={e.paused ? "继续探险" : "暂停探险"}
            disabled={e.status !== "active"}
            onClick={() => send({ type: "pause" })}
          >
            {e.paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            className="icon-button"
            aria-label="聚焦地图"
            onClick={() =>
              wrap.current
                ?.querySelector<HTMLButtonElement>(
                  `[data-cell="${activeFocus}"]`,
                )
                ?.focus()
            }
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>
      <div className="map-area" ref={wrap}>
        <div className="map-flourish top-left" />
        <div className="map-flourish bottom-right" />
        <div
          className="column-labels"
          style={{ gridTemplateColumns: `repeat(${e.board.width},1fr)` }}
        >
          {Array.from({ length: e.board.width }, (_, i) => (
            <span key={i}>{String.fromCharCode(65 + i)}</span>
          ))}
        </div>
        <div className="map-row">
          <div
            className="row-labels"
            style={{ gridTemplateRows: `repeat(${e.board.height},1fr)` }}
          >
            {Array.from({ length: e.board.height }, (_, i) => (
              <span key={i}>{String(i + 1).padStart(2, "0")}</span>
            ))}
          </div>
          <div
            role="grid"
            aria-label="遗迹探索地图"
            aria-rowcount={e.board.height}
            aria-colcount={e.board.width}
            className="board-grid"
            style={{ gridTemplateColumns: `repeat(${e.board.width},1fr)` }}
          >
            {e.board.cells.map((c) => (
              <BoardCell
                key={c.id}
                cell={c}
                width={e.board.width}
                terminal={isTerminal(e.status)}
                hint={hints.get(c.id)}
                selected={c.id === activeFocus}
                onOpen={() => {
                  setFocus(c.id);
                  send({ type: "cell", id: c.id });
                }}
                onMark={() => {
                  setFocus(c.id);
                  send({ type: "cell", id: c.id, mark: true });
                }}
                onChord={() => send({ type: "chord", id: c.id })}
                onNavigate={(key) => navigate(c.id, key)}
              />
            ))}
          </div>
        </div>
        <div className="map-coordinate">
          <MapPin size={10} />
          北纬 24° 16′ · 东经 102° 32′<span>比例 1 : 100</span>
        </div>
        {e.status === "ready" && (
          <div className="first-step">
            点击任意石板，开始探险<span>首步及周围八格始终安全</span>
          </div>
        )}
        {e.paused && (
          <div className="pause-overlay">
            <Pause size={34} />
            <h3>遗迹会等你回来</h3>
            <p>时间已暂停，地图和补给均已保存。</p>
            <button className="primary" onClick={() => send({ type: "pause" })}>
              <Play size={14} />
              继续探险
            </button>
          </div>
        )}
      </div>
      <div className="board-legend">
        <span>
          <i className="legend-hidden" />
          未知石板
        </span>
        <span>
          <i className="legend-open" />
          安全区域
        </span>
        <span>
          <Flag size={12} />
          危险标记
        </span>
        <span>
          <Gem size={12} />
          遗迹文物
        </span>
        <small>右键标记 · 双击数字快速展开</small>
      </div>
    </section>
  );
}
