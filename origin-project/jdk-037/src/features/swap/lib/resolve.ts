import { SIZE, adjacent, type Grid } from '../../../shared/board';
import type { Turn, Wave } from '../../../shared/turn';
import { hasColorSwap, replacePieces, type PieceSource } from '../../board';
import { canCombine, combine } from '../../specials';
import { resolveWave } from './wave';

function playable(grid: Grid) {
  return hasColorSwap(grid) || grid.pieces.some((piece, index) =>
    [index + 1, index + SIZE].some(next => adjacent(index, next) && canCombine(piece, grid.pieces[next] ?? null)));
}

export function playTurn(grid: Grid, from: number, to: number, source: PieceSource): Turn {
  const pieces = grid.pieces.slice();
  if (!adjacent(from, to) || !pieces[from] || !pieces[to]) return { legal: false, swap: grid };
  [pieces[from], pieces[to]] = [pieces[to], pieces[from]];
  const swap = { pieces, armor: grid.armor };
  const combo = combine(swap, from, to);
  const first = resolveWave(swap, 1, source, [to, from], combo?.cells);
  if (!first) return { legal: false, swap };

  const waves: Wave[] = [first];
  let final = first.board;
  for (let depth = 2; depth <= 64; depth++) {
    const wave = resolveWave(final, depth, source, []);
    if (!wave) break;
    waves.push(wave);
    final = wave.board;
  }
  const reshuffled = waves.length === 64 || !playable(final);
  if (reshuffled) final = replacePieces(source, final.armor);
  return { legal: true, swap, waves, final, reshuffled, combo: combo?.label ?? null };
}
