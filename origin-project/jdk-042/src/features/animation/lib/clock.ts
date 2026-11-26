import { onUnmounted, ref } from 'vue';

export function useClock() {
  const elapsed = ref(0);
  const playing = ref(false);
  let frame = 0;
  let previous = 0;
  function tick(now: number) {
    if (previous) elapsed.value += now - previous;
    previous = now;
    frame = requestAnimationFrame(tick);
  }
  function pause() {
    cancelAnimationFrame(frame);
    previous = 0;
    playing.value = false;
  }
  function play() {
    if (playing.value) return;
    playing.value = true;
    frame = requestAnimationFrame(tick);
  }
  onUnmounted(pause);
  return { elapsed, playing, play, pause, reset: () => { elapsed.value = 0; } };
}
