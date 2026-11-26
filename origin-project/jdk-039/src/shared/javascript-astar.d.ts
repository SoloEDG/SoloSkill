declare module 'javascript-astar' {
  interface Cell {
    x: number;
    y: number;
    weight: number;
  }

  export class Graph {
    grid: Cell[][];
    constructor(weights: number[][]);
  }

  export const astar: {
    search(graph: Graph, start: Cell, end: Cell): Cell[];
  };
}
