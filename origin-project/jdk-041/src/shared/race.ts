export interface Point { x:number; y:number }
export interface Track { id:string; name:string; marks:Point[]; width:number; gravel:number[] }
export interface Car extends Point { angle:number; speed:number }
export interface Sample extends Car { time:number }
export interface Run { time:number; samples:Sample[] }
export type Surface = 'tarmac'|'gravel'|'grass';
export interface Controls { throttle:boolean; brake:boolean; left:boolean; right:boolean }
