import { COLS, ROWS, type DiscState } from '../../../shared/types';

export const BOARD_WIDTH = 1120;
export const BOARD_HEIGHT = 488;
const PADDING_X = 32, PADDING_Y = 46;
export function locateCell(x: number, y: number): number | null {
  const col = Math.floor((x - PADDING_X) / 33);
  const row = Math.floor((y - PADDING_Y) / 33);
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
  const dx = x - (PADDING_X + col * 33 + 16.5), dy = y - (PADDING_Y + row * 33 + 16.5);
  return dx * dx + dy * dy <= 15 * 15 ? row * COLS + col : null;
}
export function drawBoard(ctx: CanvasRenderingContext2D, discs: DiscState[], width: number, height: number) {
  ctx.save(); ctx.scale(width / BOARD_WIDTH, height / BOARD_HEIGHT);
  ctx.fillStyle = '#101c22'; ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
  const surface = ctx.createLinearGradient(0,0,0,BOARD_HEIGHT);
  surface.addColorStop(0, '#24343b'); surface.addColorStop(1, '#122129');
  ctx.fillStyle = surface; ctx.fillRect(12, 12, BOARD_WIDTH - 24, BOARD_HEIGHT - 24);
  ctx.strokeStyle = '#405057'; ctx.lineWidth = 1; ctx.strokeRect(12.5,12.5,BOARD_WIDTH-25,BOARD_HEIGHT-25);
  for (const [x,y] of [[23,23],[1097,23],[23,465],[1097,465]]) {
    ctx.fillStyle = '#859396'; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#18252a'; ctx.beginPath(); ctx.moveTo(x-2,y+1); ctx.lineTo(x+2,y-1); ctx.stroke();
  }
  discs.forEach((disc, i) => {
    const x = PADDING_X + (i % COLS) * 33 + 16.5;
    const y = PADDING_Y + Math.floor(i / COLS) * 33 + 16.5;
    ctx.fillStyle = '#071116'; ctx.beginPath(); ctx.arc(x,y+1.7,15.4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#52636b'; ctx.fillRect(x-16,y-1,32,2);
    const scaleY = Math.max(0.045, Math.abs(Math.cos(disc.angle * Math.PI)));
    ctx.save(); ctx.translate(x,y); ctx.scale(1,scaleY);
    const face = ctx.createLinearGradient(0,-15,0,15);
    if (disc.face) { face.addColorStop(0,'#f0cf6b'); face.addColorStop(0.45,'#dbb246'); face.addColorStop(1,'#b8892d'); }
    else { face.addColorStop(0,'#283b43'); face.addColorStop(1,'#17272e'); }
    ctx.fillStyle = face; ctx.beginPath(); ctx.arc(0,0,14.3,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = disc.face ? '#f4db8b' : '#3b5058'; ctx.lineWidth = 0.65; ctx.stroke();
    ctx.restore();
  });
  ctx.fillStyle = '#a0afb3'; ctx.font = '10px monospace';
  ctx.fillText('FOLD / ELECTROMECHANICAL DISPLAY', 45, 453);
  ctx.textAlign = 'right'; ctx.fillText('32 × 12    /    384 DISCS',1076,453);
  ctx.restore();
}
