import type { Incident, Outcome } from '../../../shared/mission';

export function getOutcome(state: Incident, limit: number, total: number): Outcome | null {
  const accounted = state.rescued + state.lost;
  if (accounted !== total && state.turn < limit) return null;
  const damaged = state.building.hazards.filter(hazard => hazard.ruined).length;
  return {
    rescued:state.rescued, lost:state.lost, damaged, total,
    reason: state.rescued === total ? '救援完成' : accounted === total ? '人员已清点' : '响应窗口结束',
  };
}
