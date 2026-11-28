import type { Room } from "../../../shared/types";
import { listenAt } from "../../rooms";
import { clueObservation } from "../model/clueLabels";
export function CluePanel({
  room,
  enabled,
  onEnable,
}: {
  room: Room;
  enabled: boolean;
  onEnable: () => void;
}) {
  return (
    <section className="card clue-card">
      <div className="card-heading">
        <div>
          <div className="eyebrow">耳机 / 双声道</div>
          <h2>听觉线索</h2>
        </div>
        <button
          className={enabled ? "sound-toggle enabled" : "sound-toggle"}
          onClick={onEnable}
        >
          {enabled ? "♫ 正在监听" : "♫ 开启声音"}
        </button>
      </div>
      <div className="listen-meter">
        <span>左耳</span>
        <div className="meter-bars left">
          {Array.from({ length: 21 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <span className="mono">L</span>
      </div>
      <div className="listen-meter">
        <span>右耳</span>
        <div className="meter-bars right">
          {Array.from({ length: 21 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <span className="mono">R</span>
      </div>
      <div className="clue-list">
        {room.sources
          .filter((s) => !s.found)
          .map((s) => {
            const l = listenAt(room, s, room.listener, room.heading);
            return (
              <div className="clue-row" key={s.id}>
                <i style={{ background: s.color }} />
                <div className="clue-name">
                  <b>
                    线索 {String(room.sources.indexOf(s) + 1).padStart(2, "0")}
                  </b>
                  <small>{clueObservation(l.gain, l.occluded)}</small>
                </div>
                <div className="signal-strength">
                  <i
                    style={{
                      width: `${Math.round(l.gain * 100)}%`,
                      background: s.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
      <p className="caption">
        转身会改变左右耳方向；墙、门和布帘会改变声音的清晰度。
      </p>
    </section>
  );
}
