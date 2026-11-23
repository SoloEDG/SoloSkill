class PcmCapture extends AudioWorkletProcessor {
  constructor() {
    super()
    this.frame = new Float32Array(2048)
    this.offset = 0
    this.startTime = 0
    this.port.onmessage = () => {
      this.send()
      this.port.postMessage({ flushed: true })
    }
  }

  send() {
    if (!this.offset) return
    const samples = this.frame.slice(0, this.offset)
    this.port.postMessage({ inputTime: this.startTime, samples }, [samples.buffer])
    this.offset = 0
  }

  process(inputs) {
    const input = inputs[0]?.[0]
    if (!input) return true
    for (let index = 0; index < input.length; index++) {
      if (!this.offset) this.startTime = currentTime + index / sampleRate
      this.frame[this.offset++] = input[index]
      if (this.offset === this.frame.length) this.send()
    }
    return true
  }
}

registerProcessor('night-session-capture', PcmCapture)
