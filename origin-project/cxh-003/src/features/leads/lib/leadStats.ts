import type { AtelierDocument } from '@/shared/types';
export function leadStats(document: AtelierDocument) {
  return { total: document.leads.length, came: document.leads.filter((item) => item.style === 'H came').length, foil: document.leads.filter((item) => item.style === 'foil').length };
}

export function connectionCoverage(document: AtelierDocument) {
  const connected = new Set(document.leads.flatMap((item) => [item.a, item.b]));
  const isolated = document.shards.filter((item) => !connected.has(item.id));
  return { connectedPieces: connected.size, isolatedPieces: isolated.length, totalPieces: document.shards.length };
}

export function coveragePercent(document: AtelierDocument) {
  const coverage = connectionCoverage(document);
  return coverage.totalPieces ? Math.round((coverage.connectedPieces / coverage.totalPieces) * 100) : 0;
}
