import { useEffect, useReducer, useRef, useState } from "react";
import { gameReducer } from "./gameReducer";
import { loadGame, saveGame } from "./storage";
export function useGame() {
  const loaded = useRef<ReturnType<typeof loadGame> | null>(null);
  if (!loaded.current) loaded.current = loadGame();
  const [state, send] = useReducer(gameReducer, loaded.current);
  const [saved, setSaved] = useState(!("recovery" in loaded.current));
  const recovery = useRef("recovery" in loaded.current);
  useEffect(() => {
    if (recovery.current) {
      setSaved(false);
      return;
    }
    setSaved(saveGame(state.doc));
  }, [state.doc]);
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!document.hidden) send({ type: "tick" });
    }, 1000);
    const hide = () => {
      if (document.hidden) send({ type: "pause", paused: true });
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);
  return { state, send, saved };
}
