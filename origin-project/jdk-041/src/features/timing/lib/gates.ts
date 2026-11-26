import { Vector } from 'matter-js';
import type { Point,Track } from '../../../shared/race';

export function hitGate(before:Point,after:Point,track:Track,target:number) {
 const gate=track.marks[target];
 const origin=track.marks[(target+track.marks.length-1)%track.marks.length];
 const direction=Vector.normalise(Vector.sub(gate,origin));
 const from=Vector.dot(Vector.sub(before,gate),direction),to=Vector.dot(Vector.sub(after,gate),direction);
 if(from>=0||to<0)return false;
 const at=Vector.add(before,Vector.mult(Vector.sub(after,before),-from/(to-from)));
 return Math.abs(Vector.cross(Vector.sub(at,gate),direction))<=track.width;
}
