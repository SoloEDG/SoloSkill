import type { Stroke } from '../../../shared/art';

export function paintStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  const [first, ...rest] = stroke.points;
  if (!first) return;
  ctx.strokeStyle = ctx.fillStyle = stroke.ink.color;
  ctx.lineWidth = stroke.ink.width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  if (!rest.length) {
    ctx.arc(first.x, first.y, stroke.ink.width / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.moveTo(first.x, first.y);
  for (const point of rest) ctx.lineTo(point.x, point.y);
  ctx.stroke();
}
