import type { AtelierDocument, Shard } from '@/shared/types';
export type Point = { x: number; y: number };
export function shardOutline(shard: Shard): Point[] {
  const points: Point[] = shard.shape === 'triangle' ? [{x:0,y:-.42},{x:.42,y:.42},{x:-.42,y:.42}] : shard.shape === 'diamond' ? [{x:0,y:-.46},{x:.46,y:0},{x:0,y:.46},{x:-.46,y:0}] : [{x:-.42,y:-.42},{x:.42,y:-.42},{x:.42,y:.42},{x:-.42,y:.42}];
  const angle = shard.rotation * Math.PI / 180;
  return points.map(p => ({x:shard.x+.5+p.x*Math.cos(angle)-p.y*Math.sin(angle), y:shard.y+.5+p.x*Math.sin(angle)+p.y*Math.cos(angle)}));
}
export function projectionPatches(document: AtelierDocument) {
  const angle = document.light.azimuth * Math.PI / 180;
  const stretch = 1.1 + (80-document.light.elevation)/90;
  return document.shards.map(shard => {
    const stock = document.glass.find(item => item.id === shard.stockId);
    const outline = shardOutline(shard);
    return {id:shard.id, color:stock?.color ?? '#dddddd', opacity:(stock?.transmission ?? .5)*document.light.intensity*.72,
      window: outline.map(p=>`${125+p.x*22},${28+p.y*26}`).join(' '),
      floor: outline.map(p=>`${45+p.x*34+Math.cos(angle)*38+(p.y-2)*Math.sin(angle)*9},${133+p.y*10*stretch+Math.sin(angle)*20}`).join(' ')};
  });
}
