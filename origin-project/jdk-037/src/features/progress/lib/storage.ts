import type { Records, StageRecord } from '../model/records';

const key = 'crystal-shift:records:1';

function valid(value: unknown): value is StageRecord {
  if (!value || typeof value !== 'object') return false;
  const { score, remaining, chain } = value as StageRecord;
  return [score, remaining, chain].every(field => Number.isSafeInteger(field) && field >= 0);
}

export function readRecords(): Records {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(key) ?? '{}');
    if (!stored || typeof stored !== 'object') return {};
    return Object.fromEntries(Object.entries(stored).filter(([stage, value]) => /^[1-9]\d*$/.test(stage) && valid(value)));
  } catch {
    return {};
  }
}

export function writeRecords(records: Records): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(records));
    return true;
  } catch {
    return false;
  }
}
