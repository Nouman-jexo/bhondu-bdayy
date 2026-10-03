let audioContext: AudioContext | null = null

function getContext() {
  if (typeof window === 'undefined') return null
  if (!audioContext) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    audioContext = new Ctor()
  }
  if (audioContext.state === 'suspended') audioContext.resume()
  return audioContext
}

function tone(
  frequency: number,
  { type = 'sine', duration = 0.15, volume = 0.2, delay = 0, endFrequency }: {
    type?: OscillatorType
    duration?: number
    volume?: number
    delay?: number
    endFrequency?: number
  } = {},
) {
  const ctx = getContext()
  if (!ctx) return
  const start = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, start)
  if (endFrequency) osc.frequency.exponentialRampToValueAtTime(endFrequency, start + duration)
  gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

export const playTap = () => tone(880, { duration: 0.05, volume: 0.08, type: 'triangle' })
export const playPop = () => tone(720, { duration: 0.14, volume: 0.25, type: 'triangle', endFrequency: 140 })
export const playBuzz = () => tone(170, { duration: 0.25, volume: 0.12, type: 'square', endFrequency: 110 })
export const playChime = () =>
  [523, 659, 784, 1047].forEach((f, i) => tone(f, { delay: i * 0.1, duration: 0.35, volume: 0.15 }))
