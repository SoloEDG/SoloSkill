import { useEffect, useReducer, useState } from "react";
import { idleSession } from "../shared/initial";
import { gameReducer } from "./gameReducer";
import { loadGame, saveGame } from "./storage";
export function useGame() {
  const [state, send] = useReducer(gameReducer, undefined, () => ({
    ...loadGame(),
    session: idleSession(),
  }));
  const [saved, setSaved] = useState(true);
  useEffect(() => {
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
