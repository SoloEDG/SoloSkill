import { astar, Graph } from 'javascript-astar';
import { HEIGHT, WIDTH, indexOf, positionOf, type Building } from '../../../shared/site';
import { walkCost } from '../../hazards';

export function getRoute(building: Building, origin: number, target: number) {
  if (origin === target || !walkCost(building, target)) return [];
  const graph = new Graph(Array.from({ length: WIDTH }, (_, x) =>
    Array.from({ length: HEIGHT }, (_, y) => walkCost(building, indexOf(x, y)))));
  const start = positionOf(origin);
  const end = positionOf(target);
  return astar.search(graph, graph.grid[start.x][start.y], graph.grid[end.x][end.y])
    .map(cell => ({ pos: indexOf(cell.x, cell.y), cost: cell.weight }));
}
