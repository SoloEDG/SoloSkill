import type { AtelierDocument, LeadJoint } from '@/shared/types';
import { isAdjacent } from '@/shared/geometry';
export function connectAdjacent(document: AtelierDocument): AtelierDocument {
  const additions: LeadJoint[] = [];
  for (let i = 0; i < document.shards.length; i++) for (let j = i + 1; j < document.shards.length; j++) {
    const a = document.shards[i], b = document.shards[j];
    if (isAdjacent(a, b) && !document.leads.some((lead) => [lead.a, lead.b].includes(a.id) && [lead.a, lead.b].includes(b.id))) additions.push({ id: `l${Date.now()}-${i}-${j}`, a: a.id, b: b.id, style: 'H came' });
  }
  return additions.length ? { ...document, leads: [...document.leads, ...additions] } : document;
}
export function toggleLeadStyle(document: AtelierDocument, id: string): AtelierDocument {
  return { ...document, leads: document.leads.map((lead) => lead.id === id ? { ...lead, style: lead.style === 'H came' ? 'foil' : 'H came' } : lead) };
}
