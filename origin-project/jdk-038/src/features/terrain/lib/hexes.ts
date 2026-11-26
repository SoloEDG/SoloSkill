import { defineHex, Orientation, Grid, Direction } from 'honeycomb-grid';
import type { Tile, TileKey } from '../../../shared/territory';

const Cell = defineHex({ dimensions: 43, orientation: Orientation.POINTY, origin: 'topLeft' });
const axes = new Grid(Cell);
const directions = [Direction.NE, Direction.E, Direction.SE, Direction.SW, Direction.W, Direction.NW];
export const keyOf = (q: number, r: number): TileKey => `${q},${r}`;

export function adjacentKeys(tile: Pick<Tile, 'q' | 'r'>): TileKey[] {
  return directions.map(axis => {
    const point = axes.neighborOf(tile, axis, { allowOutside: true })!;
    return keyOf(point.q, point.r);
  });
}

export function geometryOf(tile: Tile) {
  const { x, y, corners } = new Cell({ q: tile.q, r: tile.r });
  return { x, y, polygon: corners.map(point => `${point.x},${point.y}`).join(' ') };
}
