import type { GameDocument, Session, FishSpecies } from "../../../shared/types";
import { random } from "../../../shared/random";
import { idleSession } from "../../../shared/initial";
export function prepareCast(
  doc: GameDocument,
  charge: number,
  pool: { fish: FishSpecies; weight: number }[],
  delay: (roll: number) => number,
): { session: Session; seed: number } {
  const [roll, s1] = random(doc.seed);
  const [size, s2] = random(s1);
  const [wait, seed] = random(s2);
  let pick = roll * pool.reduce((n, f) => n + f.weight, 0);
  const chosen =
    pool.find((f) => (pick -= f.weight) <= 0)?.fish ?? pool[0].fish;
  return {
    seed,
    session: {
      ...idleSession(),
      id: `${seed}-${doc.stats.casts + 1}`,
      phase: "waiting",
      spot: doc.spot,
      bait: doc.bait,
      castPower: charge,
      fish: chosen.id,
      weight:
        Math.round((chosen.min + (chosen.max - chosen.min) * size) * 100) / 100,
      biteAt: delay(wait) + (1 - charge) * 0.8,
      message: "浮漂已落水，留意湖面上的动静。",
    },
  };
}
