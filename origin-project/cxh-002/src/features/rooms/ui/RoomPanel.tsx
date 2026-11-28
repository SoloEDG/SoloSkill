import type { Room, SearchSession } from "../../../shared/types";
import { RoomCanvas } from "./RoomCanvas";
export function RoomPanel({
  room,
  session,
  onMove,
  onFind,
  interactive,
}: {
  room: Room;
  session: SearchSession | null;
  onMove: (x: number, y: number) => void;
  onFind: (id: string) => void;
  interactive: boolean;
}) {
  return (
    <section className="room-panel">
      <div className="room-head">
        <div>
          <div className="eyebrow">声学空间 / ROOM 01</div>
          <h2>{room.name}</h2>
        </div>
        <div className="room-tools">
          <span>比例 1:48</span>
          <span className="live-tag">
            <i />
            在线监听
          </span>
        </div>
      </div>
      <RoomCanvas
        room={room}
        session={session}
        onMove={onMove}
        onFind={onFind}
        interactive={interactive}
      />
      <div className="map-legend">
        <span>
          <i className="you-dot" />
          你的位置
        </span>
        <span>
          <i className="source-dot" />
          未找到的物件
        </span>
        <span>
          <i className="wall-line" />
          隔断 / 遮挡
        </span>
        <small>点击地面移动，双击近处物件尝试拾取</small>
      </div>
    </section>
  );
}
