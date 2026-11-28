import { useEffect, useMemo, useRef, useState } from 'react';
import { Board, PatternPanel, createScene, paintCell } from '../features/patterns';
import { RulesPanel } from '../features/rules';
import { Timeline, compileShow, formatTime, samplePlan, useTransport } from '../features/choreography';
import { MechanicalAudio, SoundPanel } from '../features/sound';
import { RecordingPanel, downloadBlob, safeName, useRecorder } from '../features/recording';
import { validateDocument } from '../shared/validate';
import type { Scene } from '../shared/types';
import { useDocument } from './useDocument';

export function App() {
  const { document:show,setDocument:setShow,notice,setNotice }=useDocument();
  const [selected,setSelected]=useState(show.scenes[0].id);
  const scene=show.scenes.find(item=>item.id===selected)??show.scenes[0];
  const plan=useMemo(()=>compileShow(show),[show]);
  const transport=useTransport(plan.duration), recorder=useRecorder();
  const audio=useRef<MechanicalAudio|null>(null), input=useRef<HTMLInputElement>(null);
  const locked=transport.playing||recorder.recording;
  const previewing=transport.playing||transport.time>0;
  const discs=useMemo(()=>previewing?samplePlan(plan,transport.time):scene.cells.map(face=>({face,angle:0,moving:false})),[plan,transport.time,scene,previewing]);
  useEffect(()=>{ audio.current=new MechanicalAudio(); return()=>audio.current?.dispose(); },[]);
  useEffect(()=>{ if(!transport.playing)audio.current?.stop(); },[transport.playing]);
  function editScene(next:Scene) {
    transport.stop(); setShow(current=>({...current,scenes:current.scenes.map(item=>item.id===next.id?next:item)}));
  }
  async function play() {
    try {
      const ready=await audio.current?.play(plan,show.sound,transport.time>=plan.duration?0:transport.time);
      if(ready)transport.play();
    } catch { setNotice('浏览器未能开启声音。请再次点击播放。'); }
  }
  function changeScenes(scenes:Scene[]) { transport.stop();setShow(current=>({...current,scenes})); }
  async function importFile(file:File) {
    try {
      if(file.size>2000000)throw new Error('演出文件超过 2 MB，请检查文件。');
      const next=validateDocument(JSON.parse(await file.text()));
      transport.stop();setShow(next);setSelected(next.scenes[0].id);setNotice('演出文件已载入。');
    } catch(error) { setNotice(error instanceof Error?error.message:'文件无法读取。'); }
  }
  return <div className="studio"><header className="topbar"><div className="brand"><b>FOLD<span>●</span></b><div>机械翻点屏<br/><small>CHOREOGRAPHY STUDIO</small></div></div>
    <div className="project-name"><input aria-label="演出名称" maxLength={80} disabled={locked} value={show.title} onChange={e=>setShow({...show,title:e.target.value})}/><span className="save-state"><i/>本地自动保存</span></div>
    <div className="project-actions"><button disabled={locked} onClick={()=>input.current?.click()}>打开演出</button><button onClick={()=>downloadBlob(new Blob([JSON.stringify(show,null,2)],{type:'application/json'}),`${safeName(show.title)}.json`)}>↓ 保存文件</button><input ref={input} hidden type="file" accept=".json,application/json" onChange={e=>{ const file=e.target.files?.[0]; if(file)void importFile(file);e.target.value=''; }}/></div>
  </header>
  {notice && <div className="notice" role="status">{notice}<button aria-label="关闭提示" onClick={()=>setNotice('')}>×</button></div>}
  <main><div className="work-heading"><div><span className="eyebrow">THE MECHANICAL STAGE</span><h1>让图案，响起来。</h1></div><div className="device-tag mono"><span className="dot yellow"/>32 × 12 / FLIP-DOT</div></div>
    <div className="workspace"><PatternPanel scene={scene} disabled={locked} onChange={editScene}/>
      <section className="stage"><div className="stage-toolbar"><span className="stage-label"><i className={transport.playing?'dot yellow':'dot muted'}/>{transport.playing?'演出中':previewing?'预览已暂停':'图案编辑'}<span className="separator">/</span>{previewing?show.scenes.find(s=>plan.cues.some(c=>c.sceneId===s.id&&transport.time>=c.start&&transport.time<c.end))?.name??'演出结束':scene.name}</span><span className="mono">{discs.filter(d=>d.moving).length} / {show.rules.capacity} 在途</span></div>
      <Board discs={discs} editing={!locked&&!previewing} onPaint={(cell,value)=>editScene(paintCell(scene,cell,value))}/>
      <div className="stage-footer"><span>黄铜亮面 / 石墨暗面</span><span>{previewing?'停止后返回图案编辑':'点击圆片绘制 · 拖动连续涂画'}</span></div>
      <div className="transport"><div className="transport-buttons"><button className="stop-button" aria-label="停止并返回编辑" disabled={recorder.recording} onClick={transport.stop}>■</button><button className="play-button" disabled={recorder.recording} onClick={transport.playing?transport.pause:play}>{transport.playing?'Ⅱ 暂停演出':'▶ 播放演出'}</button></div><div className="time-display mono">{formatTime(transport.time)}<small> / {formatTime(plan.duration)}</small></div><div className="plan-stat"><b>{plan.events.length}</b> 次翻转<span>峰值并发 {plan.peak}</span></div></div>
      </section><RulesPanel rules={show.rules} disabled={locked} onChange={rules=>{transport.stop();setShow({...show,rules});}}/>
      <div className="bottom-main"><Timeline scenes={show.scenes} selected={scene.id} plan={plan} time={transport.time} disabled={locked} onSelect={id=>{transport.stop();setSelected(id);}} onSeek={time=>{if(!recorder.recording)transport.seek(time);}} onHold={(id,value)=>changeScenes(show.scenes.map(s=>s.id===id?{...s,hold:value}:s))} onAdd={()=>{const next=createScene();changeScenes([...show.scenes,next]);setSelected(next.id);}} onRemove={id=>{const next=show.scenes.filter(s=>s.id!==id);changeScenes(next);if(id===scene.id)setSelected(next[0].id);}} onMove={(id,delta)=>{const next=[...show.scenes],i=next.findIndex(s=>s.id===id);[next[i],next[i+delta]]=[next[i+delta],next[i]];changeScenes(next);}}/>
      <RecordingPanel duration={plan.duration} events={plan.events.length} recording={recorder.recording} progress={recorder.progress} message={recorder.message} onCancel={recorder.cancel} onRecord={()=>{transport.stop();void recorder.start(structuredClone(show),plan);}}/></div>
      <SoundPanel settings={show.sound} disabled={locked} onChange={sound=>{transport.stop();setShow({...show,sound});}} onTest={play}/>
    </div>
  </main><footer className="app-footer"><span>FOLD · 把每一次翻转编进节奏</span><span className="mono">LOCAL WORKSPACE / xh-001</span></footer></div>;
}
