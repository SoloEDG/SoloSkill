import type { Surface } from '../../../shared/race';
export const traction:Record<Surface,{name:string; grip:number; limit:number; drag:number}>={
 tarmac:{name:'柏油',grip:1,limit:4.8,drag:.982},
 gravel:{name:'碎石',grip:.68,limit:3.4,drag:.968},
 grass:{name:'草地',grip:.41,limit:1.8,drag:.925},
};
