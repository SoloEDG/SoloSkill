import { useCallback, useEffect, useMemo, useState } from "react";
import type { Room, SearchEvent, SearchSession } from "../shared/types";
import { createGameDocument } from "../shared/defaults";
import { loadDocument, saveDocument } from "../shared/persistence";
import {
  RoomPanel,
  moveListener,
  turnListener,
  toggleDoor,
} from "../features/rooms";
import { CluePanel, useAudioEngine } from "../features/clues";
import {
  MovementPanel,
  startSession,
  appendEvent,
  useTimer,
} from "../features/movement";
import {
  TargetsPanel,
  attemptFind,
  challengeResult,
} from "../features/targets";
import { ReviewPanel, roomAt } from "../features/review";
const initial = createGameDocument();
export function App() {
  const [doc, setDoc] = useState(() => loadDocument(initial));
  const [room, setRoom] = useState<Room>(doc.rooms[0]);
  const [session, setSession] = useState<SearchSession | null>(null);
  const [audioOn, setAudioOn] = useState(false);
  const [replayTime, setReplayTime] = useState<number | null>(null);
  const challenge = doc.challenges[0],
    elapsed = useTimer(session?.status === "active", challenge.timeLimit),
    playing = session?.status === "active" && replayTime === null;
  const recordSound = useCallback(
    (sourceId: string, occluded: boolean) => {
      if (session?.status !== "active") return;
      setSession((previous) =>
        previous
          ? appendEvent(
              previous,
              "sound",
              room,
              occluded ? "隔断后传来一声短音" : "听见一声清晰的短音",
              sourceId,
            )
          : previous,
      );
    },
    [room, session?.status],
  );
  const audio = useAudioEngine(room, audioOn && playing, recordSound);
  const shown = useMemo(
    () =>
      replayTime !== null && session ? roomAt(session, room, replayTime) : room,
    [replayTime, session, room],
  );
  useEffect(() => {
    saveDocument(doc);
  }, [doc]);
  useEffect(() => {
    if (!session || session.status !== "active") return;
    const status = challengeResult(challenge, session, elapsed);
    if (status !== "active")
      setSession({ ...session, status, endedAt: Date.now() });
  }, [challenge, elapsed, session]);
  function log(
    type: SearchEvent["type"],
    next: Room,
    detail: string,
    id?: string,
  ) {
    if (session?.status === "active")
      setSession((prev) =>
        prev ? appendEvent(prev, type, next, detail, id) : prev,
      );
  }
  function move(x: number, y: number) {
    if (!playing) return;
    const next = moveListener(room, { x, y });
    if (next !== room) {
      setRoom(next);
      log("move", next, "移动到新位置");
    }
  }
  function turn(d: number) {
    if (!playing) return;
    const next = turnListener(room, d);
    setRoom(next);
    log("turn", next, "转动听觉朝向");
  }
  function find(id: string) {
    if (!session || session.status !== "active") return;
    const r = attemptFind(room, session, id);
    setRoom(r.room);
    setSession(r.session);
    setDoc({
      ...doc,
      rooms: doc.rooms.map((v) => (v.id === room.id ? r.room : v)),
    });
  }
  function start() {
    audio.start();
    setRoom({
      ...room,
      listener: { x: 235, y: 275 },
      heading: 0,
      sources: room.sources.map((s) => ({ ...s, found: false })),
    });
    setSession(startSession(challenge));
    setReplayTime(null);
    setAudioOn(true);
  }
  function hear() {
    audio.start();
    setAudioOn(true);
  }
  function door() {
    const next = toggleDoor(room, "door-1");
    setRoom(next);
    setDoc({
      ...doc,
      rooms: doc.rooms.map((v) => (v.id === room.id ? next : v)),
    });
    log(
      "move",
      next,
      next.walls.find((v) => v.id === "door-1")?.open
        ? "打开了隔断门"
        : "关上了隔断门",
    );
  }
  function replay() {
    if (!session) return;
    setReplayTime(0);
    const end = session.events.at(-1)?.time ?? 0;
    let t = 0;
    const id = window.setInterval(() => {
      t += 0.25;
      if (t >= end) {
        setReplayTime(null);
        clearInterval(id);
      } else setReplayTime(t);
    }, 250);
  }
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.target instanceof HTMLButtonElement) return;
      if (e.key === "a" || e.key === "ArrowLeft") turn(-Math.PI / 8);
      else if (e.key === "d" || e.key === "ArrowRight") turn(Math.PI / 8);
      else if (e.key === "w" || e.key === "ArrowUp")
        move(
          room.listener.x + Math.cos(room.heading) * 180,
          room.listener.y + Math.sin(room.heading) * 180,
        );
      else if (e.key === "s" || e.key === "ArrowDown")
        move(
          room.listener.x - Math.cos(room.heading) * 180,
          room.listener.y - Math.sin(room.heading) * 180,
        );
      else if (e.key === "Enter" && playing) {
        const target = room.sources.find(
          (s) =>
            !s.found &&
            Math.hypot(
              s.position.x - room.listener.x,
              s.position.y - room.listener.y,
            ) < 40,
        );
        if (target) find(target.id);
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [room, playing]);
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark">回</div>
        <div className="brand-copy">
          <b>室内回声</b>
          <span>ROOMTONE / AUDIO SEARCH LAB</span>
        </div>
        <div className="top-spacer" />
        <div className="session-status">
          <i className={playing ? "pulse" : ""} />
          {playing ? "寻物进行中" : "准备聆听"}
        </div>
        <button
          className="headphone"
          onClick={() => {
            audio.start();
            setAudioOn(true);
          }}
        >
          ♫ 耳机试听
        </button>
      </header>
      <main>
        <section className="page-intro">
          <div>
            <div className="eyebrow">听觉寻物 · 场景 01</div>
            <h1>
              在房间里，<em>听见</em>藏起来的东西。
            </h1>
            <p>
              声音会随你的朝向、距离和隔断变化。戴上耳机，沿着最清晰的线索走。
            </p>
          </div>
          <div className="challenge-card">
            <small>本次挑战</small>
            <b>{challenge.title}</b>
            <span>
              2 件物品 <i /> 03:30 时限
            </span>
          </div>
        </section>
        <section className="studio-grid">
          <aside className="left-rail">
            <MovementPanel
              room={room}
              onTurn={turn}
              onToggleDoor={door}
              disabled={!playing}
            />
            <TargetsPanel
              room={room}
              challenge={challenge}
              elapsed={elapsed}
              found={find}
              message={
                session?.events.at(-1)?.type === "hint"
                  ? (session.events.at(-1)?.detail ?? "")
                  : ""
              }
            />
            <ReviewPanel
              session={session?.status !== "active" ? session : null}
              onReplay={replay}
            />
          </aside>
          <div className="center-stage">
            <RoomPanel
              room={shown}
              session={session}
              onMove={move}
              onFind={find}
              interactive={playing}
            />
            <div className="stage-controls">
              <div className="transport">
                <button
                  className="primary-action"
                  onClick={playing ? hear : start}
                >
                  {playing ? "♫ 听一听" : "▷ 开始挑战"}
                </button>
                {playing && (
                  <button
                    onClick={() =>
                      setSession((prev) =>
                        prev
                          ? {
                              ...prev,
                              status: "abandoned",
                              endedAt: Date.now(),
                            }
                          : prev,
                      )
                    }
                  >
                    结束搜索
                  </button>
                )}
                {replayTime !== null && (
                  <span className="mono">回顾 {replayTime.toFixed(1)}s</span>
                )}
              </div>
              <div className="listener-readout">
                <span>
                  位置{" "}
                  <b>
                    {Math.round(room.listener.x / 10) / 10} /{" "}
                    {Math.round(room.listener.y / 10) / 10}
                  </b>
                </span>
                <span>
                  朝向{" "}
                  <b>
                    {Math.round((room.heading * 180) / Math.PI + 360) % 360}°
                  </b>
                </span>
              </div>
            </div>
          </div>
          <aside className="right-rail">
            <CluePanel
              room={room}
              enabled={audioOn}
              onEnable={() => {
                audio.start();
                setAudioOn(true);
              }}
            />
            <section className="card room-notes">
              <div className="eyebrow">空间记录</div>
              <div className="room-fact">
                <span>隔断</span>
                <b>木门 / 布帘 / 玻璃</b>
              </div>
              <div className="room-fact">
                <span>目标声源</span>
                <b>{room.sources.length} 个间歇声源</b>
              </div>
              <div className="room-fact">
                <span>听者模型</span>
                <b>双耳方位 / 遮挡衰减</b>
              </div>
              <button onClick={() => setDoc(createGameDocument())}>
                重置房间
              </button>
            </section>
          </aside>
        </section>
      </main>
      <footer>
        <span>ROOMTONE / AUDIO SEARCH LAB</span>
        <span>声场由房间结构与移动共同决定</span>
        <span>本地保存</span>
      </footer>
    </div>
  );
}
