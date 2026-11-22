import { newDocument } from "../shared/initial";
import { fishCatalog } from "../shared/catalog";
import type { GameDocument } from "../shared/types";
const key = "stillwater-jdk024-v1";
function valid(value: unknown): value is GameDocument {
  if (!value || typeof value !== "object") return false;
  const d = value as GameDocument;
  const fishIds = fishCatalog.map((f) => f.id);
  const spots = ["reed", "brook", "deep"];
  const baits = ["worm", "corn", "fly"];
  return (
    d.version === 1 &&
    spots.includes(d.spot) &&
    baits.includes(d.bait) &&
    Number.isFinite(d.power) &&
    d.power >= 0.15 &&
    d.power <= 0.95 &&
    Number.isFinite(d.drag) &&
    d.drag >= 0.15 &&
    d.drag <= 0.95 &&
    Number.isInteger(d.seed) &&
    !!d.stock &&
    baits.every(
      (b) =>
        Number.isInteger(d.stock[b as keyof typeof d.stock]) &&
        d.stock[b as keyof typeof d.stock] >= 0,
    ) &&
    !!d.stats &&
    ["casts", "catches", "escapes", "released"].every(
      (k) =>
        Number.isInteger(d.stats[k as keyof typeof d.stats]) &&
        d.stats[k as keyof typeof d.stats] >= 0,
    ) &&
    Array.isArray(d.claimed) &&
    d.claimed.every((c) => typeof c === "string") &&
    Array.isArray(d.bag) &&
    d.bag.every(
      (c) =>
        c &&
        typeof c.id === "string" &&
        fishIds.includes(c.fish) &&
        spots.includes(c.spot) &&
        baits.includes(c.bait) &&
        [c.weight, c.time, c.duration, c.peakTension].every(Number.isFinite),
    ) &&
    !!d.journal &&
    Object.entries(d.journal).every(
      ([id, e]) =>
        fishIds.includes(id as (typeof fishIds)[number]) &&
        e &&
        Number.isInteger(e.count) &&
        e.count > 0 &&
        Number.isFinite(e.best) &&
        Number.isFinite(e.first),
    )
  );
}
export function loadGame(): { doc: GameDocument; notice: string; recovery?: true } {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { doc: newDocument(), notice: "" };
    const parsed: unknown = JSON.parse(raw);
    return valid(parsed)
      ? { doc: parsed, notice: "" }
      : {
          doc: newDocument(),
          notice: "本地手记格式或版本无法读取，已保留原手记并开启临时游玩。",
          recovery: true,
        };
  } catch {
    return {
      doc: newDocument(),
      notice: "无法读取本地手记，已暂停自动保存，本次可以临时游玩。",
      recovery: true,
    };
  }
}
export function saveGame(doc: GameDocument) {
  try {
    localStorage.setItem(key, JSON.stringify(doc));
    return true;
  } catch {
    return false;
  }
}
