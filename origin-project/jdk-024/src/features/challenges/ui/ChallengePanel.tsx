import { useState } from "react";
import { Flag, Check, ChevronDown, Lock } from "lucide-react";
import type { GameDocument } from "../../../shared/types";
import type { Command } from "../../../shared/commands";
import { challenges } from "../model/challenges";
import { challengeProgress, challengeReady } from "../lib/progress";
export function ChallengePanel({
  doc,
  send,
}: {
  doc: GameDocument;
  send: (c: Command) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="challenge-panel">
      <div className="section-title">
        <Flag size={16} />
        <h2>钓手的小目标</h2>
        <button
          className="text-btn"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? "收起" : "全部"}
          <ChevronDown size={13} />
        </button>
      </div>
      <div className="challenge-list">
        {challenges.slice(0, expanded ? 5 : 2).map((c) => {
          const n = challengeProgress(doc, c.id);
          const claimed = doc.claimed.includes(c.id);
          const open = doc.stats.catches >= c.unlockAt;
          return (
            <div className="challenge-item" key={c.id}>
              <div
                className={"challenge-stamp " + (n >= c.target ? "done" : "")}
              >
                <Flag size={17} />
              </div>
              <div>
                <strong>{c.name}</strong>
                <small>
                  {open ? c.description : `捕获 ${c.unlockAt} 尾后解锁`}
                </small>
                <progress aria-label={c.name} max={c.target} value={n} />
                <small className="reward">奖励 · {c.reward}</small>
              </div>
              {!open ? (
                <Lock size={13} aria-label="挑战未解锁" />
              ) : claimed ? (
                <Check size={16} />
              ) : challengeReady(doc, c.id) ? (
                <button
                  className="claim-btn"
                  onClick={() => send({ type: "claim", id: c.id })}
                >
                  领取
                </button>
              ) : (
                <span className="challenge-count">
                  {n}/{c.target}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
