import type { SearchSession } from "../../../shared/types";
import { measureRoute } from "../lib/routeMetrics";
export function ReviewPanel({
  session,
  onReplay,
}: {
  session: SearchSession | null;
  onReplay: () => void;
}) {
  if (!session)
    return (
      <section className="card review-card empty-review">
        <div className="eyebrow">回顾 / REVIEW</div>
        <h2>
          搜索结束后
          <br />
          回看声迹。
        </h2>
        <p>路线会标出移动、线索出现与找到目标的位置。</p>
      </section>
    );
  const sounds = session.events.filter((e) => e.type === "sound");
  const metrics = measureRoute(session);
  return (
    <section className="card review-card">
      <div className="card-heading">
        <div>
          <div className="eyebrow">
            搜索回顾 / {session.status === "won" ? "完成" : "结束"}
          </div>
          <h2>声迹档案</h2>
        </div>
        <button onClick={onReplay}>▷ 回放</button>
      </div>
      <div className="review-stats">
        <span>
          <b>{metrics.distance}</b>
          <small>空间单位</small>
        </span>
        <span>
          <b>{metrics.turns}</b>
          <small>次转向</small>
        </span>
        <span>
          <b>{sounds.length}</b>
          <small>次声音</small>
        </span>
      </div>
      <div className="sound-events">
        {sounds.slice(-4).map((e) => (
          <div key={e.id}>
            <span className="mono">{e.time.toFixed(1)}s</span>
            <i />
            {e.detail}
          </div>
        ))}
      </div>
    </section>
  );
}
