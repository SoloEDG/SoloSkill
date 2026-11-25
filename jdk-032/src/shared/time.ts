export function formatSeconds(seconds: number) {
  return seconds.toFixed(2).padStart(5, '0')
}

export function stableId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}
