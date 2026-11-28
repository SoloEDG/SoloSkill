import { useCallback, useEffect, useRef } from "react";
import type { Room } from "../../../shared/types";
import { listenAt } from "../../rooms";
import { sourceIsAudible, toneForSource } from "../lib/oscillator";
export function useAudioEngine(
  room: Room,
  enabled: boolean,
  onSound: (sourceId: string, occluded: boolean) => void,
) {
  const ctx = useRef<AudioContext | null>(null),
    timer = useRef<number | null>(null),
    last = useRef(new Map<string, number>());
  const stop = useCallback(() => {
    if (timer.current !== null) clearInterval(timer.current);
    timer.current = null;
  }, []);
  const tick = useCallback(
    (time: number) => {
      if (!ctx.current || !enabled) return;
      for (const s of room.sources) {
        if (s.found || !sourceIsAudible(s, time)) continue;
        const sample = listenAt(room, s, room.listener, room.heading),
          prior = last.current.get(s.id) ?? -10;
        if (!sample.heard || time - prior < s.duration * 0.8) continue;
        last.current.set(s.id, time);
        onSound(s.id, sample.occluded);
        const c = ctx.current,
          b = c.createBuffer(
            1,
            Math.max(1, Math.floor(s.duration * c.sampleRate)),
            c.sampleRate,
          );
        b.getChannelData(0).set(toneForSource(s, c.sampleRate));
        const src = c.createBufferSource(),
          g = c.createGain(),
          p = c.createStereoPanner();
        src.buffer = b;
        g.gain.value = sample.gain;
        p.pan.value = sample.pan;
        src.connect(g).connect(p).connect(c.destination);
        src.start();
        src.onended = () => {
          src.disconnect();
          g.disconnect();
          p.disconnect();
        };
      }
    },
    [enabled, onSound, room],
  );
  useEffect(() => {
    if (!enabled) {
      stop();
      return;
    }
    ctx.current ??= new AudioContext();
    void ctx.current.resume();
    timer.current = window.setInterval(
      () => tick(performance.now() / 1000),
      70,
    );
    return stop;
  }, [enabled, room, tick, stop]);
  return {
    start: () => {
      ctx.current ??= new AudioContext();
      void ctx.current.resume();
    },
    stop,
  };
}
