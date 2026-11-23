import type { PcmFrame } from '../../../shared/document'
import workletUrl from './pcm-processor.js?url&no-inline'

export async function openInput(onFrame: (frame: PcmFrame) => void, onLost: () => void) {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('请通过本机地址或 HTTPS 使用麦克风。')
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  })
  let context: AudioContext | undefined
  try {
    const audioContext = new AudioContext()
    context = audioContext
    await audioContext.audioWorklet.addModule(workletUrl)
    await audioContext.resume()
    const source = audioContext.createMediaStreamSource(stream)
    const node = new AudioWorkletNode(audioContext, 'night-session-capture')
    const silent = new GainNode(audioContext, { gain: 0 })
    source.connect(node).connect(silent).connect(audioContext.destination)
    let onFlushed: (() => void) | undefined
    node.port.onmessage = ({ data }: MessageEvent<PcmFrame | { flushed: true }>) => {
      if ('flushed' in data) onFlushed?.()
      else onFrame(data)
    }
    for (const track of stream.getAudioTracks()) track.addEventListener('ended', onLost)

    function close() {
      source.disconnect()
      node.disconnect()
      silent.disconnect()
      node.port.close()
      for (const track of stream.getTracks()) track.stop()
      void audioContext.close()
    }

    function flush() {
      return new Promise<void>(resolve => {
        const timer = window.setTimeout(resolve, 160)
        onFlushed = () => { window.clearTimeout(timer); resolve() }
        node.port.postMessage('flush')
      })
    }
    return { clock: () => audioContext.currentTime, sampleRate: audioContext.sampleRate, flush, close }
  } catch (error) {
    for (const track of stream.getTracks()) track.stop()
    if (context) void context.close()
    throw error
  }
}
