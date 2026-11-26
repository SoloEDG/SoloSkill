import type { Material } from '../../../shared/bridge';

export const allowance = 490;
export const materials: Record<Material,{ label:string; rate:number; stiffness:number; tension:number; compression:number; color:string }> = {
  wood:{ label:'木梁', rate:11, stiffness:250, tension:18, compression:18, color:'#9e5d32' },
  steel:{ label:'钢梁', rate:21, stiffness:660, tension:47, compression:40, color:'#214e70' },
  cable:{ label:'拉索', rate:8, stiffness:190, tension:29, compression:0, color:'#556b69' },
};
