import { computed, ref, shallowRef } from 'vue';
import { preset, addJoint, link, remove } from '../features/design';
import { estimate } from '../features/budget';
import { interval, testBridge, vehicles } from '../features/testing';
import type { Frame, Material } from '../shared/bridge';

export function useSession() {
  const bridge=shallowRef(preset()), frames=shallowRef<Frame[]>([]);
  const material=ref<Material>('wood'), mode=ref<'link'|'node'|'remove'>('link');
  const selected=ref<string|null>(null), vehicle=ref(0), busy=ref(false);
  const spent=computed(()=>estimate(bridge.value).spend);
  const frame=computed(()=>frames.value.at(-1)??null);
  function choose(id:string) {
    if(busy.value||mode.value!=='link')return;
    if(!selected.value) { selected.value=id;return; }
    revise(link(bridge.value,selected.value,id,material.value));
    selected.value=null;
  }
  function revise(next:typeof bridge.value) {
    if(busy.value||next===bridge.value)return;
    bridge.value=next;
    frames.value=[];
  }
  const point=(x:number,y:number)=>revise(addJoint(bridge.value,x,y));
  const erase=(id:string)=>{if(mode.value==='remove')revise(remove(bridge.value,id));};
  const reset=()=>{revise(preset());selected.value=null;};
  async function run() {
    if(busy.value)return;
    busy.value=true;
    const result=testBridge(bridge.value,vehicles[vehicle.value]);
    frames.value=[];
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    for(const row of result){
      frames.value=[...frames.value,row];
      if(!reduced)await new Promise(resolve=>setTimeout(resolve,interval));
    }
    busy.value=false;
  }
  return {bridge,material,mode,selected,vehicle,busy,frames,frame,spent,choose,point,erase,reset,run};
}
