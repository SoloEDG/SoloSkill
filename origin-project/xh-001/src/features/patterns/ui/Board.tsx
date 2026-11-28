import { useEffect, useRef } from 'react';
import type { DiscState } from '../../../shared/types';
import { BOARD_HEIGHT, BOARD_WIDTH, drawBoard, locateCell } from '../lib/render';

interface Props { discs: DiscState[]; editing: boolean; onPaint: (cell: number, value: number) => void }
export function Board({ discs, editing, onPaint }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stroke = useRef<{ value: number; last: number } | null>(null);
  useEffect(() => { const ctx = canvas.current?.getContext('2d'); if (ctx) drawBoard(ctx,discs,BOARD_WIDTH,BOARD_HEIGHT); },[discs]);
  function cellAt(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return locateCell((event.clientX-rect.left)/rect.width*BOARD_WIDTH,(event.clientY-rect.top)/rect.height*BOARD_HEIGHT);
  }
  return <canvas ref={canvas} width={BOARD_WIDTH} height={BOARD_HEIGHT} className={editing ? 'board editable' : 'board'} aria-label="机械翻点屏，停止播放后可点击或拖动绘制圆片" onPointerDown={event => {
    if (!editing) return;
    const cell = cellAt(event); if (cell === null) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    stroke.current = { value: 1-discs[cell].face, last: cell }; onPaint(cell,stroke.current.value);
  }} onPointerMove={event => {
    if (!editing || !stroke.current) return;
    const cell = cellAt(event);
    if (cell !== null && cell !== stroke.current.last) { stroke.current.last = cell; onPaint(cell,stroke.current.value); }
  }} onPointerUp={() => { stroke.current = null; }} onPointerCancel={() => { stroke.current = null; }} onLostPointerCapture={() => { stroke.current = null; }} />;
}
