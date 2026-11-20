import { useState } from "react";
import { X, ArrowUpRight } from "lucide-react";
import type { Difficulty } from "../../shared/types";
import { regions } from "../../features/terrain";
export function LaunchDialog({
  difficulty,
  ongoing,
  onClose,
  onConfirm,
}: {
  difficulty: Difficulty;
  ongoing: boolean;
  onClose: () => void;
  onConfirm: (d: Difficulty, seed: string) => void;
}) {
  const [choice, setChoice] = useState(difficulty);
  const [seed, setSeed] = useState("RUIN-" + String(Date.now()).slice(-6));
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="launch-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <button
          className="icon-button close"
          aria-label="取消新探险"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <span className="eyebrow">UNEARTH A NEW STORY</span>
        <h2 id="launch-title">下一段旅程，去哪里？</h2>
        <label>
          遗址区域
          <select
            autoFocus
            value={choice}
            onChange={(e) => setChoice(e.target.value as Difficulty)}
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} · {r.width}×{r.height} · {r.mines}处危险
              </option>
            ))}
          </select>
        </label>
        <label>
          地图种子
          <input
            value={seed}
            maxLength={40}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="给这片遗迹一个名字"
          />
        </label>
        <p className="dialog-note">
          相同区域、种子和首步位置会生成相同地图。
          {ongoing
            ? "当前未完成探险将被替换且不计入档案；取消可继续原探险。"
            : "每次出发都会获得新的完整补给。"}
        </p>
        <div className="dialog-actions">
          <button className="outline-button" onClick={onClose}>
            暂不出发
          </button>
          <button className="primary" onClick={() => onConfirm(choice, seed)}>
            确认出发
            <ArrowUpRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}
