import { clamp, wrap360 } from "@/shared/angles";
import type { ViewState } from "@/shared/types";

/** 低空或地平线下的目标不把圆心压到地平，只把方位转过去。 */
export function frameOn(view: ViewState, altDeg: number, azDeg: number): void {
  view.centerAz = wrap360(azDeg);
  view.centerAlt = altDeg >= 20 ? clamp(altDeg, 20, 78) : 28;
}
