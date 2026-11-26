import { size, type Animation, type Artwork, type ExportKind } from '../../../shared/art';
import { drawArtwork } from '../../symmetry';
import { phase } from '../../animation';
import { download,toPng } from '../lib/download';
import { toVideo } from '../lib/video';

export async function exportArt(kind: ExportKind, art: Artwork, animation: Animation, current: number) {
  const canvas=document.createElement('canvas');
  canvas.width=canvas.height=size;
  const context=canvas.getContext('2d');
  if (!context) throw Error('无法创建导出画布');
  if (kind==='png') {
    drawArtwork(context,art,current);
    download(await toPng(canvas),'png');
  } else {
    download(await toVideo(canvas,animation.duration*1000,time=>drawArtwork(context,art,current+phase(time,animation))),'webm');
  }
}
