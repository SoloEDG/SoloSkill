import type { Track } from '../../../shared/race';
export const tracks:Track[]=[
 {id:'valley',name:'松谷环线',width:38,gravel:[2,3],marks:[{x:220,y:320},{x:630,y:320},{x:710,y:220},{x:602,y:104},{x:250,y:105},{x:120,y:220}]},
 {id:'ridge',name:'北岭碎石场',width:33,gravel:[0,2,4],marks:[{x:225,y:330},{x:595,y:330},{x:700,y:263},{x:585,y:140},{x:374,y:211},{x:230,y:92},{x:110,y:223}]}
];
export function spawn(track:Track) {
 const [a,b]=track.marks;
 return {...a,angle:Math.atan2(b.y-a.y,b.x-a.x),speed:0};
}
