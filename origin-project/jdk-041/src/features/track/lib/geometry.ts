import { Vector } from 'matter-js';
import type { Point, Track } from '../../../shared/race';
export const segments = (track:Track) => track.marks.map((a,i)=>({a,b:track.marks[(i+1)%track.marks.length],i}));
export function closest(point:Point, track:Track) {
 let best={index:0,distance:Infinity};
 for(const {a,b,i} of segments(track)) {
  const delta=Vector.sub(b,a);
  const span=Math.max(0,Math.min(1,Vector.dot(Vector.sub(point,a),delta)/Vector.dot(delta,delta)));
  const distance=Vector.magnitude(Vector.sub(point,Vector.add(a,Vector.mult(delta,span))));
  if(distance<best.distance)best={index:i,distance};
 }
 return best;
}
