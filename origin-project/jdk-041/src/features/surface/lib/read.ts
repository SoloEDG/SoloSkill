import type { Point, Surface, Track } from '../../../shared/race';
import { closest } from '../../track';

const roadSurface = (track:Track,index:number):Surface =>
 track.gravel.includes(index) ? 'gravel' : 'tarmac';

export function surfaceAt(track:Track,p:Point):Surface {
 const {index,distance}=closest(p,track);
 if(distance>track.width)return 'grass';
 return roadSurface(track,index);
}
