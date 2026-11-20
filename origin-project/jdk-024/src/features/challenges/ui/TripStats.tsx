import type { GameDocument } from "../../../shared/types";
export function TripStats({ doc }: { doc: GameDocument }) {
  return (
    <div className="trip-stats">
      <div>
        <strong>{String(doc.stats.catches).padStart(2, "0")}</strong>
        <span>累计收获</span>
      </div>
      <div>
        <strong>{String(doc.stats.casts).padStart(2, "0")}</strong>
        <span>抛竿次数</span>
      </div>
      <div>
        <strong>{String(doc.stats.released).padStart(2, "0")}</strong>
        <span>已放流</span>
      </div>
    </div>
  );
}
