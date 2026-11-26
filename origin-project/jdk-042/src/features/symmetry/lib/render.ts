import { center, size, type Artwork } from '../../../shared/art';
import { paintStroke } from '../../brush';
import { angleAt, radians } from '../model/options';

export function drawArtwork(ctx: CanvasRenderingContext2D, art: Artwork, rotation = 0) {
  ctx.save();
  ctx.fillStyle = art.background;
  ctx.fillRect(0, 0, size, size);
  const axis = radians(art.symmetry.axis);
  for (let i = 0; i < art.symmetry.count; i++) {
    const angle = angleAt(art.symmetry, i);
    for (const mirror of art.symmetry.mirror ? [false,true] : [false]) {
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle + rotation);
      if (mirror) ctx.scale(1, -1);
      ctx.rotate(-axis);
      ctx.translate(-center, -center);
      for (const stroke of art.strokes) paintStroke(ctx, stroke);
      ctx.restore();
    }
  }
  ctx.restore();
}
