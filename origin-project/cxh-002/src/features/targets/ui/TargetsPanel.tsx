import type { Challenge, Room } from "../../../shared/types";
export function TargetsPanel({
  room,
  challenge,
  elapsed,
  found,
  message,
}: {
  room: Room;
  challenge: Challenge;
  elapsed: number;
  found: (id: string) => void;
  message: string;
}) {
  return (
    <section className="card targets-card">
      <div className="card-heading">
        <div>
          <div className="eyebrow">任务 / SEARCH</div>
          <h2>本次目标</h2>
        </div>
        <span className="target-count">
          {room.sources.filter((s) => s.found).length}/
          {challenge.targetIds.length}
        </span>
      </div>
      {room.sources
        .filter((s) => challenge.targetIds.includes(s.id))
        .map((s, i) => (
          <div className="target-row" key={s.id}>
            <span className={s.found ? "target-check found" : "target-check"}>
              {s.found ? "✓" : String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <b>{s.found ? s.name : "未知物件"}</b>
              <small>
                {s.found
                  ? "已找到"
                  : s.interval > 7
                    ? "间歇发声"
                    : "持续发出微弱声音"}
              </small>
            </div>
            <button disabled={s.found} onClick={() => found(s.id)}>
              {s.found ? "完成" : "拾取"}
            </button>
          </div>
        ))}
      <div className="target-progress">
        <div
          style={{
            width: `${Math.max(0, 100 - (elapsed / challenge.timeLimit) * 100)}%`,
          }}
        />
      </div>
      {message && (
        <p className="target-feedback" role="status">
          {message}
        </p>
      )}
      <p className="caption">在地图目标附近双击，或靠近后按 Enter 拾取。</p>
    </section>
  );
}
