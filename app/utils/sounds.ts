import { ref } from 'vue'

export const soundsEnabled = ref(true)

let audioContext: AudioContext | undefined

type ToneOptions = {
  startFrequency: number
  endFrequency: number
  duration: number
  volume: number
  type?: OscillatorType
  delay?: number
}

function playTone({
  startFrequency,
  endFrequency,
  duration,
  volume,
  type = 'triangle',
  delay = 0,
}: ToneOptions) {
  if (!soundsEnabled.value || typeof window === 'undefined') return

  const AudioContextConstructor = window.AudioContext
  if (!AudioContextConstructor) return

  audioContext ??= new AudioContextConstructor()
  if (audioContext.state === 'suspended') void audioContext.resume()

  const startAt = audioContext.currentTime + delay
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(startFrequency, startAt)
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, startAt + duration)
  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.006)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start(startAt)
  oscillator.stop(startAt + duration + 0.01)
}

export function playUiClick() {
  playTone({ startFrequency: 520, endFrequency: 360, duration: 0.035, volume: 0.018 })
}

export function playGameSound(
  sound: 'start' | 'paint' | 'erase' | 'miss' | 'complete' | 'timeout',
  pitch = 0
) {
  if (sound === 'start') {
    playTone({ startFrequency: 280, endFrequency: 470, duration: 0.07, volume: 0.035 })
    playTone({
      startFrequency: 440,
      endFrequency: 700,
      duration: 0.08,
      volume: 0.035,
      delay: 0.065,
    })
    return
  }

  if (sound === 'paint') {
    playTone({
      startFrequency: 380 + pitch * 9,
      endFrequency: 190 + pitch * 4,
      duration: 0.075,
      volume: 0.045,
    })
  } else if (sound === 'erase') {
    playTone({ startFrequency: 270, endFrequency: 430, duration: 0.055, volume: 0.025 })
  } else if (sound === 'miss') {
    playTone({
      startFrequency: 170,
      endFrequency: 95,
      duration: 0.095,
      volume: 0.035,
      type: 'square',
    })
  } else if (sound === 'complete') {
    playTone({ startFrequency: 523, endFrequency: 523, duration: 0.11, volume: 0.035, delay: 0 })
    playTone({ startFrequency: 659, endFrequency: 659, duration: 0.11, volume: 0.035, delay: 0.07 })
    playTone({ startFrequency: 784, endFrequency: 784, duration: 0.16, volume: 0.04, delay: 0.14 })
  } else {
    playTone({
      startFrequency: 210,
      endFrequency: 105,
      duration: 0.18,
      volume: 0.04,
      type: 'square',
    })
  }
}
