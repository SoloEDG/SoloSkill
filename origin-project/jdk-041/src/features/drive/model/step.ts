import { Vector } from 'matter-js';
import type { Car, Controls, Surface } from '../../../shared/race';
import { traction } from '../../surface';

export function drive(car:Car,input:Controls,surface:Surface,step=1):Car {
 const {grip,limit,drag}=traction[surface];
 const steer=Number(input.right)-Number(input.left);
 const speed0=car.speed+(input.throttle?.11:0)*step;
 const speed=Math.max(0,Math.min(limit,(speed0-Number(input.brake)*.22*grip*step)*drag**step));
 const angle=car.angle+steer*(.012+speed*.011)*grip*step;
 const next=Vector.add(car,Vector.rotate({x:speed*step,y:0},angle));
 return {x:Math.max(12,Math.min(808,next.x)),y:Math.max(12,Math.min(420,next.y)),angle,speed};
}
