import type { GameDocument } from "./types";
const KEY = "cxh002-roomtone-v1";
export function loadDocument(fallback: GameDocument): GameDocument {
  try {
    const value = JSON.parse(
      localStorage.getItem(KEY) || "null",
    ) as GameDocument | null;
    if (
      !value ||
      value.version !== 1 ||
      !Array.isArray(value.rooms) ||
      !Array.isArray(value.challenges)
    )
      return fallback;
    return value;
  } catch {
    return fallback;
  }
}
export function saveDocument(value: GameDocument) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function validateDocument(value: unknown): GameDocument {
  if (!value || typeof value !== "object") throw new Error("文件内容无效。");
  const d = value as GameDocument;
  if (
    d.version !== 1 ||
    !Array.isArray(d.rooms) ||
    !Array.isArray(d.challenges) ||
    d.rooms.length > 12
  )
    throw new Error("文件版本或房间数据不受支持。");
  for (const r of d.rooms) {
    if (
      !r.id ||
      !r.name ||
      !Number.isFinite(r.width) ||
      !Number.isFinite(r.height) ||
      !Array.isArray(r.walls) ||
      !Array.isArray(r.sources)
    )
      throw new Error("房间结构不完整。");
    for (const s of r.sources)
      if (
        !s.id ||
        !s.position ||
        !Number.isFinite(s.pitch) ||
        !Number.isFinite(s.interval)
      )
        throw new Error("声源数据不完整。");
  }
  return structuredClone(d);
}
