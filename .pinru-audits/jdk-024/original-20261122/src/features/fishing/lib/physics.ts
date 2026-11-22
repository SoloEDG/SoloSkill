import type { Session, GameDocument, FishSpecies } from "../../../shared/types";
import { clamp } from "../../../shared/random";
export function fightStep(
  s: Session,
  doc: GameDocument,
  fish: FishSpecies,
  dt: number,
): Session {
  const duration = s.duration + dt;
  const surge = (Math.sin(duration * 2.3) + 1) * 0.5 * fish.strength;
  const load = s.reeling ? doc.power * (1 - doc.drag * 0.5) : 0;
  const target = s.reeling
    ? 0.28 + load * 0.65 + surge * 0.27
    : 0.12 + surge * 0.1;
  const tension = clamp(s.tension + (target - s.tension) * dt * 2, 0, 1.2);
  const energy = clamp(s.energy + (s.reeling ? -doc.power * 0.07 : 0.025) * dt);
  const progress = clamp(
    s.progress +
      (s.reeling
        ? (doc.power * (0.13 - energy * 0.035)) / (1 + fish.strength * 0.3)
        : -0.012) *
        dt,
  );
  const overload =
    tension > 0.87 ? s.overload + dt : Math.max(0, s.overload - dt * 2);
  const slackTime = !s.reeling ? s.slackTime + dt : 0;
  const lost = overload > 1.3 || slackTime > 5 || duration > 55;
  return {
    ...s,
    duration,
    tension,
    energy,
    progress,
    overload,
    slackTime,
    peak: Math.max(s.peak, tension),
    phase: lost ? "escaped" : progress >= 1 ? "landed" : "fighting",
    reeling: lost ? false : s.reeling,
    message: lost
      ? overload > 1.3
        ? "鱼线绷断了。试着降低力度或增加泄力。"
        : slackTime > 5
          ? "鱼线松弛太久，鱼儿脱钩了。"
          : "鱼儿游回了深水。下一竿，再试一次。"
      : progress >= 1
        ? "漂亮！收获了一份来自湖水的礼物。"
        : "按住收线；张力过高时松开，让鱼线歇一歇。",
  };
}
