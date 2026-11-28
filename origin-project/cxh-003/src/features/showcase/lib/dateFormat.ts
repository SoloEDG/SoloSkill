export function formatObservationDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export function isRecentObservation(value: string, now = Date.now()) {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && now - timestamp >= 0 && now - timestamp < 24 * 60 * 60 * 1000;
}

export function observationDay(value: string) {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(value));
}

export function observationTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}
