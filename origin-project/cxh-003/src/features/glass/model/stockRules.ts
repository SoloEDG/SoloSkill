import type { AtelierDocument } from '@/shared/types';

export function findStock(document: AtelierDocument, id: string) {
  return document.glass.find((item) => item.id === id);
}

export function availableStock(document: AtelierDocument) {
  return document.glass.filter((item) => item.remaining > 0);
}

export function stockSummary(document: AtelierDocument) {
  return document.glass.reduce((summary, item) => {
    summary.total += item.remaining;
    if (item.remaining > 0) summary.materialKinds += 1;
    return summary;
  }, { total: 0, materialKinds: 0 });
}

export function stockColor(document: AtelierDocument, id: string) {
  return findStock(document, id)?.color ?? '#b7afa0';
}
