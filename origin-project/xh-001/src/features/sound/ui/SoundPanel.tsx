import type { SoundSettings } from '../../../shared/types';
interface Props { settings:SoundSettings; disabled:boolean; onChange:(settings:SoundSettings)=>void; onTest:()=>void }
export function SoundPanel({ settings,disabled,onChange,onTest }:Props) {
  return <section className="panel sound-panel"><div className="panel-title"><h2>机械声场</h2><label className="toggle"><input aria-label="开启机械声" type="checkbox" checked={settings.enabled} disabled={disabled} onChange={e=>onChange({...settings,enabled:e.target.checked})}/><span/></label></div>
    <fieldset disabled={disabled}><label>机械音量 <output>{Math.round(settings.volume*100)}%</output><input type="range" min="0" max="1" step="0.01" value={settings.volume} onChange={e=>onChange({...settings,volume:+e.target.value})}/></label>
    <label>金属音色 <output>{Math.round(settings.tone*100)}%</output><input type="range" min="0" max="1" step="0.01" value={settings.tone} onChange={e=>onChange({...settings,tone:+e.target.value})}/></label>
    <label>左右展开 <output>{Math.round(settings.spread*100)}%</output><input type="range" min="0" max="1" step="0.01" value={settings.spread} onChange={e=>onChange({...settings,spread:+e.target.value})}/></label></fieldset>
    <button className="wide" disabled={disabled||!settings.enabled} onClick={onTest}>♫ 试听当前编舞</button>
  </section>;
}
