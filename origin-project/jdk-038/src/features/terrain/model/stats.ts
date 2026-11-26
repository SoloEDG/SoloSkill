import type { Terrain } from '../../../shared/territory';

export const terrainStats: Record<Terrain, { label: string; income: number; defense: number; fill: string }> = {
  field: { label: '平原', income: 1, defense: 0, fill: '#e5d5a7' },
  forest: { label: '林地', income: 2, defense: 1, fill: '#a7bd86' },
  ridge: { label: '山脊', income: 1, defense: 2, fill: '#b9adab' },
  quarry: { label: '采石场', income: 3, defense: 0, fill: '#dda57c' },
};
