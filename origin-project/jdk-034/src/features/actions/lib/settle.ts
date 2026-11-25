import type { Contacts, MoveRecord, Preview, Route } from '../../../shared/types';

export function settle(route: Route, contacts: Contacts, energy: number, preview: Preview) {
  const record: MoveRecord = {
    ...preview,
    before: { ...contacts },
    energyBefore: energy,
    energyAfter: Math.max(0, energy - preview.cost),
  };
  const finish = !preview.failure && route.finish === preview.move.target;
  const result = preview.failure ? 'fall' : finish ? 'success' : null;
  return { record, result } as const;
}
