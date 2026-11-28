import type { PerformancePlan, SoundSettings } from '../../../shared/types';
import { scheduleSound } from './scheduler';

export class MechanicalAudio {
  private context:AudioContext | null = null;
  private stopSchedule:(()=>void) | null = null;
  private generation=0;
  async play(plan:PerformancePlan,settings:SoundSettings,offset:number):Promise<boolean> {
    this.stop();
    if(!settings.enabled || settings.volume===0)return true;
    const generation=this.generation;
    this.context ??=new AudioContext();
    await this.context.resume();
    if(generation!==this.generation)return false;
    this.stopSchedule=scheduleSound(this.context,this.context.destination,plan,settings,offset);
    return true;
  }
  stop() {this.generation++;this.stopSchedule?.();this.stopSchedule=null;}
  dispose() {this.stop();void this.context?.close();this.context=null;}
}
