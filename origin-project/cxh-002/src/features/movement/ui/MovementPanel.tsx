import type { Room } from "../../../shared/types";
export function MovementPanel({
  room,
  onTurn,
  onToggleDoor,
  disabled,
}: {
  room: Room;
  onTurn: (d: number) => void;
  onToggleDoor: () => void;
  disabled: boolean;
}) {
  return (
    <section className="card movement-card">
      <div className="card-heading">
        <div>
          <div className="eyebrow">身体 / LISTENER</div>
          <h2>位置与朝向</h2>
        </div>
        <span className="direction-readout">
          {Math.round((room.heading * 180) / Math.PI + 360) % 360}°
        </span>
      </div>
      <div className="turn-control">
        <button
          disabled={disabled}
          aria-label="向左转"
          onClick={() => onTurn(-Math.PI / 8)}
        >
          ↶
        </button>
        <div className="compass">
          <i style={{ transform: `rotate(${room.heading}rad)` }}>▲</i>
          <span>N</span>
        </div>
        <button
          disabled={disabled}
          aria-label="向右转"
          onClick={() => onTurn(Math.PI / 8)}
        >
          ↷
        </button>
      </div>
      <div className="movement-hint">
        <span>W / A / S / D</span>
        <span>方向键</span>
      </div>
      <button
        disabled={disabled}
        className="door-button"
        onClick={onToggleDoor}
      >
        开 / 关 · 西侧木门
      </button>
    </section>
  );
}
