import { useEffect, useReducer, useRef, useState } from "react";
import { idleSession } from "../shared/initial";
import { gameReducer } from "./gameReducer";
import { loadGame, saveGame } from "./storage";
export function useGame() {
  const loaded = useRef<ReturnType<typeof loadGame> | null>(null);
  if (!loaded.current) loaded.current = loadGame();
  const [state, send] = useReducer(gameReducer, loaded.current, (initial) => ({
    ...initial,
    session: idleSession(),
  }));
  const recovery = useRef(loaded.current.recovery === true);
  const [saved, setSaved] = useState(!recovery.current);
  useEffect(() => {
    if (recovery.current) return;
    setSaved(saveGame(state.doc));
  }, [state.doc]);
  useEffect(() => {
    let previous = performance.now();
    let debt = 0;
    let frame = 0;
    const step = (now: number) => {
      if (!document.hidden) {
        debt += Math.min((now - previous) / 1000, 0.15);
        while (debt >= 0.05) {
          send({ type: "tick", dt: 0.05 });
          debt -= 0.05;
        }
      } else debt = 0;
      previous = now;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    const release = () => send({ type: "reel", held: false });
    window.addEventListener("blur", release);
    document.addEventListener("visibilitychange", release);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("blur", release);
      document.removeEventListener("visibilitychange", release);
    };
  }, []);
  return { state, send, saved };
}
