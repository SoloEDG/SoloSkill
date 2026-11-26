import { computed,ref } from 'vue';
import { useBrush } from '../features/brush';
import { drawArtwork,defaults } from '../features/symmetry';
import { background,baseInk,hexColor } from '../features/palette';
import { defaultDuration,durationOf,phase,useClock } from '../features/animation';
import { exportArt } from '../features/export';
import type { Artwork, ExportKind, Point, Symmetry } from '../shared/art';

export function useStudio() {
  const brush=useBrush();
  const clock=useClock();
  const symmetry=ref({...defaults});
  const ink=ref({...baseInk});
  const paper=ref(background);
  const duration=ref(defaultDuration);
  const busy=ref(false);
  const message=ref('');
  const animation=computed(()=>({duration:duration.value}));
  const rotation=computed(()=>phase(clock.elapsed.value,animation.value));
  const artwork=computed<Artwork>(()=>({strokes:brush.strokes.value,symmetry:symmetry.value,background:paper.value}));
  function draw(context:CanvasRenderingContext2D) {
    const value=artwork.value;
    const draft=brush.draft.value;
    drawArtwork(context,draft?{...value,strokes:[...value.strokes,draft]}:value,rotation.value);
  }
  function begin(point: Point) {
    clock.pause();
    clock.reset();
    brush.begin(point,ink.value);
  }
  const change=(patch:Partial<Symmetry>)=>{symmetry.value={...symmetry.value,...patch};};
  const color=(value:string)=>{ink.value={...ink.value,color:hexColor(value)??ink.value.color};};
  const setPaper=(value:string)=>{paper.value=hexColor(value)??paper.value;};
  const setDuration=(value:number)=>{duration.value=durationOf(value);};
  function toggle() { if (clock.playing.value) clock.pause(); else clock.play(); }
  async function save(kind:ExportKind) {
    if(busy.value||brush.draft.value)return;
    busy.value=true;
    message.value='正在导出';
    try { await exportArt(kind,artwork.value,animation.value,rotation.value); message.value='导出完成'; }
    catch(error) { message.value=error instanceof Error?error.message:'导出失败'; }
    finally { busy.value=false; }
  }
  return {brush,clock,symmetry,ink,paper,duration,busy,message,draw,begin,change,color,setPaper,setDuration,toggle,save};
}
