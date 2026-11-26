import { onMounted, onUnmounted, reactive } from 'vue';
import type { Controls } from '../../../shared/race';
const bindings:Record<string,keyof Controls>={ArrowUp:'throttle',ArrowDown:'brake',ArrowLeft:'left',ArrowRight:'right',w:'throttle',s:'brake',a:'left',d:'right'};
export function useControls() {
 const state=reactive<Controls>({throttle:false,brake:false,left:false,right:false});
 const set=(key:keyof Controls,pressed:boolean)=>{state[key]=pressed;};
 const key=(event:KeyboardEvent)=>{
  const action=bindings[event.key];
  if(!action||(event.target instanceof HTMLElement&&event.target.matches('select,input,textarea')))return;
  event.preventDefault();set(action,event.type==='keydown');
 };
 const reset=()=>Object.values(bindings).forEach(key=>set(key,false));
 onMounted(()=>{window.addEventListener('keydown',key);window.addEventListener('keyup',key);window.addEventListener('blur',reset);});
 onUnmounted(()=>{window.removeEventListener('keydown',key);window.removeEventListener('keyup',key);window.removeEventListener('blur',reset);});
 return {state,set,reset};
}
