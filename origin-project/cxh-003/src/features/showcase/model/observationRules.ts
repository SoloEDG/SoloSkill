import type { AtelierDocument, Observation } from '@/shared/types';
export function saveObservation(document: AtelierDocument, name: string): AtelierDocument {
  const observation: Observation = {
    id: `o${Date.now()}`,
    name: name.trim() || `观察时刻 ${document.observations.length + 1}`,
    createdAt: new Date().toISOString(),
    light: { ...document.light },
    shardIds: document.shards.map((piece) => piece.id),
    glass: document.glass.map((item) => ({ ...item })),
    shards: document.shards.map((piece) => ({ ...piece })),
    leads: document.leads.map((lead) => ({ ...lead })),
  };
  return { ...document, observations: [observation, ...document.observations] };
}
export function restoreObservation(document: AtelierDocument, id: string): AtelierDocument {
  const observation = document.observations.find((item) => item.id === id);
  if (!observation) return document;
  const hasWorkSnapshot = observation.glass && observation.shards && observation.leads;
  return {
    ...document,
    ...(hasWorkSnapshot ? {
      glass: observation.glass?.map((item) => ({ ...item })) ?? document.glass,
      shards: observation.shards?.map((piece) => ({ ...piece })) ?? document.shards,
      leads: observation.leads?.map((lead) => ({ ...lead })) ?? document.leads,
    } : {}),
    light: { ...observation.light },
    selectedShard: null,
  };
}
