import type { Joint, Load, Vehicle } from '../../../shared/bridge';

export function loadsAt(roadway: Joint[], vehicle: Vehicle, front: number): Load[] {
  const loads: Load[] = [];
  for (const axle of [front, front - vehicle.spacing]) {
    const right = roadway.findIndex(joint => joint.x >= axle);
    if (right < 0 || axle < roadway[0].x) continue;
    const b = roadway[right];
    if (right === 0) {
      loads.push({ joint: b.id, force: vehicle.weight / 2 });
      continue;
    }
    const a = roadway[right - 1];
    const ratio = (axle - a.x) / (b.x - a.x);
    loads.push({ joint: a.id, force: vehicle.weight * (1 - ratio) / 2 });
    loads.push({ joint: b.id, force: vehicle.weight * ratio / 2 });
  }
  return loads;
}
