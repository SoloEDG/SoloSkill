import {
  Flag,
  HelpCircle,
  TriangleAlert,
  ShieldCheck,
  Gem,
  Eye,
} from "lucide-react";
import type { Cell } from "../../../shared/types";
import { coordinate } from "../../../shared/geometry";
export function BoardCell({
  cell: c,
  width,
  terminal,
  hint,
  selected,
  onOpen,
  onMark,
  onChord,
  onNavigate,
}: {
  cell: Cell;
  width: number;
  terminal: boolean;
  hint: "safe" | "danger" | undefined;
  selected: boolean;
  onOpen: () => void;
  onMark: () => void;
  onChord: () => void;
  onNavigate: (key: string) => void;
}) {
  const hazard = c.mine && (c.revealed || terminal);
  const content = hazard ? (
    <TriangleAlert size={18} />
  ) : c.revealed ? (
    c.relic ? (
      <Gem size={17} />
    ) : (
      c.adjacent || ""
    )
  ) : c.mark === "flag" ? (
    <Flag size={17} />
  ) : c.mark === "question" ? (
    <HelpCircle size={17} />
  ) : c.intel === "danger" ? (
    <TriangleAlert size={15} />
  ) : c.intel === "safe" ? (
    <ShieldCheck size={15} />
  ) : null;
  let label = `${coordinate(c.id, width)}，`;
  label += hazard
    ? "已发现陷阱"
    : c.revealed
      ? `已探索，邻近危险${c.adjacent}${c.relic ? "，发现文物" : ""}`
      : c.mark === "flag"
        ? "危险旗标"
        : c.mark === "question"
          ? "疑问标记"
          : c.intel === "safe"
            ? "探针确认安全，未探索"
            : c.intel === "danger"
              ? "探针确认危险，未探索"
              : "未探索";
  return (
    <button
      role="gridcell"
      id={"tile-" + c.id}
      tabIndex={selected ? 0 : -1}
      aria-label={label}
      data-cell={c.id}
      className={[
        "tile",
        c.revealed ? "open" : "closed",
        hazard ? "hazard" : "",
        c.revealed ? "terrain-" + c.terrain : "",
        c.mark === "flag" ? "flagged" : "",
        c.intel !== "unknown" ? "intel-" + c.intel : "",
        hint ? "hint-" + hint : "",
        selected ? "tile-selected" : "",
        c.revealed && !c.mine ? "number-" + c.adjacent : "",
      ].join(" ")}
      onClick={onOpen}
      onContextMenu={(e) => {
        e.preventDefault();
        onMark();
      }}
      onDoubleClick={onChord}
      onKeyDown={(e) => {
        if (
          [
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "f",
            "F",
          ].includes(e.key)
        ) {
          e.preventDefault();
          if (e.key.toLowerCase() === "f") onMark();
          else onNavigate(e.key);
        }
      }}
    >
      {content}
      {c.revealed && c.relic && c.adjacent > 0 && (
        <span className="relic-number">{c.adjacent}</span>
      )}
      {c.revealed && c.adjacent === 0 && !c.relic && (
        <span className="stone-dot">·</span>
      )}
      {!c.revealed &&
        c.mark === "none" &&
        c.intel === "unknown" &&
        c.id % 13 === 0 && <span className="glyph">⌑</span>}
      {c.intel !== "unknown" && !c.revealed && (
        <Eye className="intel-badge" size={7} />
      )}
    </button>
  );
}
