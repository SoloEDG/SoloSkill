import { Fish, MousePointer2, RotateCcw, Anchor } from "lucide-react";
import type { Command } from "../../../shared/commands";
import type { GameDocument, Session } from "../../../shared/types";
import { species } from "../../../shared/catalog";
export function FishingPanel({
  doc,
  session: s,
  send,
}: {
  doc: GameDocument;
  session: Session;
  send: (c: Command) => void;
}) {
  const finish = s.phase === "landed" || s.phase === "escaped";
  return (
    <div className="fishing-controls">
      <div className="live-status" role="status">
        <span className={"status-dot " + s.phase} />
        <span>{s.message}</span>
      </div>
      {s.phase === "fighting" && (
        <div className="fight-meters">
          <label>
            鱼线张力 <strong>{Math.round(s.tension * 100)}%</strong>
            <meter
              aria-label="鱼线张力"
              min="0"
              max="1"
              low={0.25}
              high={0.8}
              optimum={0.55}
              value={s.tension}
            />
          </label>
          <label>
            距离上岸 <strong>{Math.round(s.progress * 100)}%</strong>
            <progress aria-label="收线进度" max="1" value={s.progress} />
          </label>
          <small>
            鱼的体力 {Math.round(s.energy * 100)}% · 松线{" "}
            {s.slackTime.toFixed(1)} / 5 秒
          </small>
        </div>
      )}
      <div className="action-row">
        <span className="control-tip">
          <MousePointer2 size={15} />
          {s.phase === "ready"
            ? "点击蓄力，再次点击抛竿"
            : s.phase === "charging"
              ? `抛竿力度 ${Math.round(s.charge * 100)}%`
              : s.phase === "fighting"
                ? "按住收线 · 松开缓解张力"
                : "享受这一刻的宁静"}
        </span>
        {s.phase === "ready" && (
          <button
            className="primary"
            disabled={!doc.stock[doc.bait]}
            onClick={() => send({ type: "charge-start" })}
          >
            <Anchor size={17} />
            开始抛竿
          </button>
        )}
        {s.phase === "charging" && (
          <button className="primary" onClick={() => send({ type: "cast" })}>
            抛竿 · {Math.round(s.charge * 100)}%
          </button>
        )}
        {s.phase === "waiting" && (
          <button className="primary" disabled>
            等待咬钩…
          </button>
        )}
        {s.phase === "bite" && (
          <button
            className="primary bite-button"
            onClick={() => send({ type: "strike" })}
          >
            <Fish size={17} />
            提竿！
          </button>
        )}
        {s.phase === "fighting" && (
          <button
            className={"primary reel-button " + (s.reeling ? "held" : "")}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              send({ type: "reel", held: true });
            }}
            onPointerUp={() => send({ type: "reel", held: false })}
            onPointerCancel={() => send({ type: "reel", held: false })}
            onLostPointerCapture={() => send({ type: "reel", held: false })}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                send({ type: "reel", held: true });
              }
            }}
            onKeyUp={() => send({ type: "reel", held: false })}
            onBlur={() => send({ type: "reel", held: false })}
          >
            按住收线
          </button>
        )}
        {finish && (
          <button className="primary" onClick={() => send({ type: "next" })}>
            <RotateCcw size={16} />
            再抛一竿
          </button>
        )}
      </div>
      {s.phase === "charging" && (
        <progress className="charge-bar" max="1" value={s.charge} />
      )}{" "}
      {s.phase === "landed" && s.fish && (
        <div className="catch-toast">
          <Fish />
          <span>
            新收获{" "}
            <strong>
              {species(s.fish).name} · {s.weight.toFixed(2)} kg
            </strong>
          </span>
          <small>已放入背包，图鉴同步记录</small>
        </div>
      )}
    </div>
  );
}
