import { Thermometer, Wind, Waves } from "lucide-react";
import type { SpotId } from "../../../shared/types";
import { water } from "../model/waters";
export function WaterConditions({ spot }: { spot: SpotId }) {
  const w = water(spot);
  return (
    <div className="conditions">
      <span>
        <Thermometer size={14} />
        {w.temperature}°C 水温
      </span>
      <span>
        <Wind size={14} />
        微风 2 级
      </span>
      <span>
        <Waves size={14} />
        {w.current} · {w.depth}
      </span>
    </div>
  );
}
