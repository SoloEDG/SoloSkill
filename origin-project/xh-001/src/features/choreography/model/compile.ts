import { CELL_COUNT, type PerformancePlan, type ShowDocument } from '../../../shared/types';
import { orderCells } from '../../rules';

export function compileShow(document: ShowDocument): PerformancePlan {
  const events: PerformancePlan['events'] = [], cues: PerformancePlan['cues'] = [];
  let cells = Array(CELL_COUNT).fill(0) as number[], cursor = 0;
  const { capacity, duration, stagger, order } = document.rules;
  for (const scene of document.scenes) {
    const changed = orderCells(scene.cells.flatMap((value,i) => value !== cells[i] ? [i] : []),order);
    const slots = Array(capacity).fill(cursor) as number[];
    let nextStart = cursor, settled = cursor;
    for (const cell of changed) {
      const slot = slots.indexOf(Math.min(...slots));
      const start = Math.max(nextStart,slots[slot]), end = start + duration/1000;
      events.push({ cell,from:cells[cell],to:scene.cells[cell],start,end,sceneId:scene.id });
      slots[slot] = end; nextStart = start+stagger/1000; settled = Math.max(settled,end);
    }
    cues.push({ sceneId:scene.id,start:cursor,settled,end:settled+scene.hold,flips:changed.length });
    cursor = settled+scene.hold; cells = [...scene.cells];
  }
  const boundaries = events.flatMap(event => [{ t:event.start,delta:1 },{ t:event.end,delta:-1 }]).sort((a,b) => a.t-b.t || a.delta-b.delta);
  let peak = 0, active = 0;
  for (const boundary of boundaries) { active += boundary.delta; peak = Math.max(peak,active); }
  return { events,cues,duration:cursor,peak };
}
