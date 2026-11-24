import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { findBody, useCatalog } from "@/features/catalog";
import { useClock } from "@/features/clock";
import { loadSession, saveNote, saveSession, usePlan } from "@/features/plan";
import { siteLabel, useSite } from "@/features/site";
import { bodyHorizontal, useSkyView } from "@/features/sky";
import { createDocument } from "@/shared/document";
import type { Notice } from "@/shared/types";

export function useDome() {
  const dome = ref(loadSession() ?? createDocument());
  const notice = ref<Notice>({ tone: "info", text: "地点和时刻一起决定星空，清单标出此刻是否还在地平线上。" });
  const site = useSite(dome);
  const clock = useClock(dome);
  const sky = useSkyView(dome);
  const catalog = useCatalog();
  const plan = usePlan(dome);
  let timer = 0;
  let playingTimer = 0;
  let armed = false;

  function write(): void {
    try {
      saveSession(dome.value);
    } catch {
      notice.value = { tone: "warn", text: "浏览器没有收下这次保存。" };
    }
  }

  function scheduleSave(): void {
    if (!armed) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(write, 350);
  }

  function focus(id: string): void {
    const body = findBody(id);
    if (!body || !sky.frame(id)) {
      notice.value = { tone: "warn", text: "没有找到这颗星。" };
      return;
    }
    catalog.remember(id);
    notice.value = { tone: "info", text: `视线已转向${body.name}。` };
  }

  function addCurrent(): void {
    const id = dome.value.selectionId;
    if (!id) {
      notice.value = { tone: "warn", text: "先点一颗星，再加入清单。" };
      return;
    }
    const status = plan.add(id);
    const name = findBody(id)?.name ?? "这颗星";
    if (status === "duplicate") notice.value = { tone: "info", text: `${name}已经在当前计划里。` };
    else if (status === "limit") notice.value = { tone: "warn", text: `一份计划最多 ${plan.limit} 颗。` };
    else if (status === "ok") notice.value = { tone: "info", text: `${name}已加入「${plan.active.value?.name ?? "计划"}」。` };
  }

  const sunAlt = computed(() => bodyHorizontal("sun", dome.value)?.altDeg ?? null);
  const selection = computed(() => {
    const id = dome.value.selectionId;
    if (!id) return null;
    const body = findBody(id);
    const place = bodyHorizontal(id, dome.value);
    if (!body || !place) return null;
    return { name: body.name, altDeg: place.altDeg, azDeg: place.azDeg, above: place.altDeg > 0 };
  });
  const label = computed(() => siteLabel(dome.value.site));

  watch(
    () =>
      JSON.stringify({
        site: dome.value.site,
        plans: dome.value.plans,
        active: dome.value.activePlanId,
        rate: dome.value.clock.rate,
        utc: dome.value.clock.playing ? null : dome.value.clock.utcMillis,
      }),
    scheduleSave,
  );

  watch(
    () => dome.value.clock.playing,
    (playing) => {
      window.clearInterval(playingTimer);
      if (!armed) return;
      if (playing) playingTimer = window.setInterval(write, 2000);
      else write();
    },
  );

  function onKey(event: KeyboardEvent): void {
    if (event.code !== "Space" || event.repeat || event.defaultPrevented) return;
    if (event.target instanceof HTMLElement &&
        (event.target.isContentEditable || event.target.closest("input, textarea, select, button, a[href]"))) return;
    event.preventDefault();
    clock.toggle();
  }

  onMounted(() => {
    armed = true;
    window.addEventListener("keydown", onKey);
    window.addEventListener("pagehide", write);
  });

  onUnmounted(() => {
    window.clearTimeout(timer);
    window.clearInterval(playingTimer);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("pagehide", write);
  });

  return { dome, notice, site, clock, sky, catalog, plan, sunAlt, selection, label, focus, addCurrent, saveNote };
}
