import type { Attempt, MoveRecord } from '../../../shared/types';

const key = 'crux-jdk034-attempts-v1';

function recordShape(item: MoveRecord) {
  return item && item.before && item.next && item.move && item.support && item.landing
    && Number.isFinite(item.energyAfter) && Number.isFinite(item.energyBefore);
}

export function readAttempts(storage: Storage): Attempt[] {
  try {
    const raw = JSON.parse(storage.getItem(key) ?? '[]') as Attempt[];
    if (!Array.isArray(raw)) return [];
    return raw.filter(item => item && typeof item.id === 'string' && typeof item.routeId === 'string'
      && (item.result === 'success' || item.result === 'fall') && Number.isFinite(item.at)
      && Array.isArray(item.moves) && item.moves.length > 0 && item.moves.every(recordShape)).slice(0, 30);
  } catch {
    return [];
  }
}

export function saveAttempts(storage: Storage, attempts: Attempt[]) {
  try {
    storage.setItem(key, JSON.stringify(attempts));
    return true;
  } catch {
    return false;
  }
}
