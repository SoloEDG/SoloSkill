import { computed, onMounted, onUnmounted, type Ref } from "vue";
import { advanceUtc, normalizeRate } from "@/features/clock/lib/advance";
import { formatCivil, formatSidereal, localSiderealDeg, utcToZonedInput, zonedToUtc } from "@/shared/time";
import type { DomeDocument } from "@/shared/types";

export function useClock(dome: Ref<DomeDocument>) {
  let handle = 0;
  let last = 0;

  function loop(now: number): void {
    if (last && dome.value.clock.playing) {
      const elapsed = (now - last) / 1000;
      dome.value.clock.utcMillis = advanceUtc(dome.value.clock.utcMillis, elapsed, dome.value.clock.rate);
    }
    last = now;
    handle = requestAnimationFrame(loop);
  }

  onMounted(() => {
    handle = requestAnimationFrame(loop);
  });

  onUnmounted(() => cancelAnimationFrame(handle));

  function toggle(): void {
    dome.value.clock.playing = !dome.value.clock.playing;
    last = 0;
  }

  function setRate(rate: number): void {
    dome.value.clock.rate = normalizeRate(rate);
  }

  function step(minutes: number): void {
    dome.value.clock.utcMillis += minutes * 60_000;
  }

  function setLocal(value: string): boolean {
    const utc = zonedToUtc(value, dome.value.site.zoneHours);
    if (utc === null) return false;
    dome.value.clock.utcMillis = utc;
    return true;
  }

  const localValue = computed(() => utcToZonedInput(dome.value.clock.utcMillis, dome.value.site.zoneHours));
  const civil = computed(() => formatCivil(dome.value.clock.utcMillis, dome.value.site.zoneHours));
  const lst = computed(() => formatSidereal(localSiderealDeg(dome.value.clock.utcMillis, dome.value.site.lonDeg)));

  return { toggle, setRate, step, setLocal, localValue, civil, lst };
}
