import type { AtelierAction, AtelierDocument } from '@/shared/types';
import { addShard, moveShard, rotateShard } from '@/features/layout';
import { connectAdjacent, toggleLeadStyle } from '@/features/leads';
import { restoreObservation, saveObservation } from '@/features/showcase';

export function atelierReducer(document: AtelierDocument, action: AtelierAction): AtelierDocument {
  switch (action.type) {
    case 'select-module': return { ...document, activeModule: action.module };
    case 'place-shard': return addShard(document, action.stockId);
    case 'move-shard': return moveShard(document, action.shardId, action.x, action.y);
    case 'rotate-shard': return rotateShard(document, action.shardId);
    case 'select-shard': return { ...document, selectedShard: action.shardId };
    case 'connect-nearest': return connectAdjacent(document);
    case 'toggle-lead-style': return toggleLead(document, action.leadId);
    case 'set-light': return { ...document, light: { ...document.light, ...action.patch } };
    case 'save-observation': return saveObservation(document, action.name);
    case 'restore-observation': return restoreObservation(document, action.observationId);
    case 'rename-work': return { ...document, title: action.title };
    default: return document;
  }
}

export function toggleLead(document: AtelierDocument, id: string) { return toggleLeadStyle(document, id); }
