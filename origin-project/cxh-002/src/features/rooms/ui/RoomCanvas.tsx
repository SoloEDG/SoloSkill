import { useEffect, useRef } from "react";
import type { Room, SearchSession } from "../../../shared/types";
interface Props {
  room: Room;
  session: SearchSession | null;
  onMove: (x: number, y: number) => void;
  onFind: (id: string) => void;
  interactive: boolean;
}
export function RoomCanvas({
  room,
  session,
  onMove,
  onFind,
  interactive,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current,
      ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const z = c.width / room.width;
    ctx.fillStyle = "#151b1b";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#222c2b";
    ctx.fillRect(50 * z, 54 * z, 960 * z, 576 * z);
    for (const [x, y] of [
      [280, 210],
      [355, 210],
      [430, 210],
      [690, 170],
      [690, 245],
      [850, 335],
      [250, 525],
      [430, 525],
    ]) {
      ctx.beginPath();
      ctx.arc(x * z, y * z, 2 * z, 0, Math.PI * 2);
      ctx.fillStyle = "#46504b";
      ctx.fill();
    }
    for (const w of room.walls) {
      if (w.door && w.open) continue;
      ctx.strokeStyle =
        w.material === "curtain"
          ? "#8c7460"
          : w.material === "glass"
            ? "#95c6c3"
            : "#b3ad99";
      ctx.lineWidth =
        w.id === "n" || w.id === "e" || w.id === "s" || w.id === "w" ? 8 : 7;
      ctx.beginPath();
      ctx.moveTo(w.a.x * z, w.a.y * z);
      ctx.lineTo(w.b.x * z, w.b.y * z);
      ctx.stroke();
    }
    if (session && session.status !== "active") {
      for (const source of room.sources.filter((item) => item.found)) {
        ctx.beginPath();
        ctx.arc(
          source.position.x * z,
          source.position.y * z,
          9 * z,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "#171c1b";
        ctx.fill();
        ctx.strokeStyle = source.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = source.color;
        ctx.fillText("✓", source.position.x * z - 4, source.position.y * z + 4);
      }
    }
    ctx.save();
    ctx.translate(room.listener.x * z, room.listener.y * z);
    ctx.rotate(room.heading);
    ctx.fillStyle = "#eee3c9";
    ctx.beginPath();
    ctx.arc(0, 0, 10 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e2a764";
    ctx.beginPath();
    ctx.moveTo(13 * z, 0);
    ctx.lineTo(23 * z, -5 * z);
    ctx.lineTo(23 * z, 5 * z);
    ctx.fill();
    ctx.restore();
    if (session) {
      const events = session.events.filter(
        (e) => e.type === "move" || e.type === "found",
      );
      if (events.length > 1) {
        ctx.beginPath();
        events.forEach((e, i) =>
          i
            ? ctx.lineTo(e.position.x * z, e.position.y * z)
            : ctx.moveTo(e.position.x * z, e.position.y * z),
        );
        ctx.strokeStyle = "#e3a768a8";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, [room, session]);
  return (
    <canvas
      ref={ref}
      width={1060}
      height={680}
      className="room-canvas"
      aria-label="房间空间声景图"
      onClick={(e) => {
        if (!interactive) return;
        const r = e.currentTarget.getBoundingClientRect();
        onMove(
          ((e.clientX - r.left) / r.width) * room.width,
          ((e.clientY - r.top) / r.height) * room.height,
        );
      }}
      onDoubleClick={(e) => {
        if (!interactive) return;
        const r = e.currentTarget.getBoundingClientRect(),
          x = ((e.clientX - r.left) / r.width) * room.width,
          y = ((e.clientY - r.top) / r.height) * room.height,
          s = room.sources.find(
            (v) =>
              !v.found && Math.hypot(v.position.x - x, v.position.y - y) < 30,
          );
        if (s) onFind(s.id);
      }}
    />
  );
}
