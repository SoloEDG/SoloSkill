import type { AtelierDocument } from './types';
const KEY = 'cxh003-glass-atelier';
export function readDocument(fallback: AtelierDocument): AtelierDocument {
  try {
    const value = localStorage.getItem(KEY);
    if (!value) return fallback;
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed === 'object' && parsed !== null && 'glass' in parsed && 'shards' in parsed) return parsed as AtelierDocument;
  } catch { /* Invalid local data is ignored and replaced by the starter work. */ }
  return fallback;
}
export function writeDocument(document: AtelierDocument) {
  try { localStorage.setItem(KEY, JSON.stringify(document)); } catch { /* Browser storage may be unavailable. */ }
}
