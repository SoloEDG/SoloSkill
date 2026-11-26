import type { Level, Objective, Result, Tally } from '../../../shared/levels';
import type { Wave } from '../../../shared/turn';

export function initialTally(): Tally {
  return { score: 0, colors: { ruby: 0, amber: 0, emerald: 0, sapphire: 0, violet: 0 }, armor: 0, bestChain: 0 };
}

export function tallyWave(before: Tally, wave: Wave): Tally {
  const colors = { ...before.colors };
  for (const color of wave.colors) colors[color]++;
  return {
    colors,
    armor: before.armor + wave.armorHits.length,
    score: before.score + wave.depth * (10 * wave.cleared.length + 16 * wave.armorHits.length + 25 * wave.created.length),
    bestChain: Math.max(before.bestChain, wave.depth),
  };
}

export function objectiveProgress(goal: Objective, tally: Tally): [number, number] {
  return 'color' in goal ? [tally.colors[goal.color], goal.count] : [tally.armor, goal.armor];
}

export function finishTurn(level: Level, tally: Tally, moves: number): Result | null {
  const won = level.objectives.every(goal => {
    const [current, target] = objectiveProgress(goal, tally);
    return current >= target;
  });
  return won || moves === 0 ? { stage: level.id, won, score: tally.score, remaining: moves, chain: tally.bestChain } : null;
}
