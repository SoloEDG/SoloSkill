import { Footprints, Flag, Gem } from "lucide-react";
import type { Expedition } from "../../../shared/types";
export function ProgressStrip({ expedition: e }: { expedition: Expedition }) {
  const safe = e.board.cells.filter((c) => c.revealed && !c.mine).length;
  const total = e.board.cells.length - e.board.mines;
  const flags = e.board.cells.filter((c) => c.mark === "flag").length;
  const relics = e.board.cells.filter(
    (c) => c.revealed && c.relic && !c.mine,
  ).length;
  return (
    <div className="progress-strip">
      <div>
        <Footprints size={17} />
        <span>
          已探索区域
          <strong>
            {safe}
            <small> / {total}</small>
          </strong>
        </span>
        <progress value={safe} max={total} />
      </div>
      <div>
        <Flag size={17} />
        <span>
          危险标记
          <strong>
            {String(flags).padStart(2, "0")}
            <small> / {e.board.mines}</small>
          </strong>
        </span>
      </div>
      <div>
        <Gem size={17} />
        <span>
          发现文物
          <strong>
            {String(relics).padStart(2, "0")}
            <small> / 6</small>
          </strong>
        </span>
      </div>
    </div>
  );
}
