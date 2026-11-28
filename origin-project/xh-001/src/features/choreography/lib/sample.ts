import { CELL_COUNT, type DiscState, type PerformancePlan } from '../../../shared/types';

export function samplePlan(plan: PerformancePlan,time: number): DiscState[] {
  const discs: DiscState[] = Array.from({ length:CELL_COUNT },() => ({ face:0,angle:0,moving:false }));
  for (const event of plan.events) {
    if (time < event.start) continue;
    const progress = Math.min(1,(time-event.start)/(event.end-event.start));
    const angle = progress * progress * (3-2*progress);
    discs[event.cell] = { face: angle < 0.5 ? event.from : event.to, angle, moving:progress < 1 };
  }
  return discs;
}
export function formatTime(seconds: number): string {
  return `${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toFixed(2).padStart(5,'0')}`;
}
