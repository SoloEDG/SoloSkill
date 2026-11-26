import { position, type Grid, type Piece } from '../../../shared/board';
import { cellsWhere, square } from './area';

export function canCombine(a: Piece | null, b: Piece | null) {
  return !!a && !!b && (a.special === 'prism' || b.special === 'prism' || (!!a.special && !!b.special));
}

export function combine(grid: Grid, from: number, to: number) {
  const a = grid.pieces[from];
  const b = grid.pieces[to];
  if (!a || !b || !canCombine(a, b)) return null;

  const { x, y } = position(to);
  if (a.special === 'prism' && b.special === 'prism') {
    return { label: '双棱镜', cells: cellsWhere(() => true) };
  }
  if (a.special === 'prism' || b.special === 'prism') {
    const peer = a.special === 'prism' ? b : a;
    const cells = cellsWhere((x, y) => grid.pieces[y * 8 + x]?.color === peer.color);
    if (peer.special === 'burst') cells.push(...cells.flatMap(index => square(index, 1)));
    if (peer.special === 'row' || peer.special === 'column') {
      const axis = new Set(cells.map(index => position(index)[peer.special === 'row' ? 'y' : 'x']));
      cells.push(...cellsWhere((x, y) => axis.has(peer.special === 'row' ? y : x)));
    }
    return { label: peer.special ? '棱镜共振' : '棱镜扫色', cells: [...cells, from, to] };
  }
  if (a.special === 'burst' && b.special === 'burst') return { label: '双核心震荡', cells: square(to, 2) };
  if (a.special === 'burst' || b.special === 'burst') {
    return { label: '宽幅震荡', cells: cellsWhere((cx, cy) => Math.abs(cx - x) <= 1 || Math.abs(cy - y) <= 1) };
  }
  return { label: '十字脉冲', cells: cellsWhere((cx, cy) => cx === x || cy === y) };
}
