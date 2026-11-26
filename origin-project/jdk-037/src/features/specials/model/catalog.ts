import type { Special } from '../../../shared/board';

export const specialLabel: Record<Special, string> = {
  row: '横向脉冲', column: '纵向脉冲', burst: '震荡核心', prism: '棱镜',
};

export function specialFor(shape: string, across: boolean): Special | undefined {
  if (shape === 'line5') return 'prism';
  if (shape === 'line4') return across ? 'row' : 'column';
  if (shape === 'L' || shape === 'T' || shape === 'cross' || shape === 'blob') return 'burst';
}
