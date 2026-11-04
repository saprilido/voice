/**
 * Audio processing utilities for Google Gemini TTS (24kHz 16-bit PCM to WAV)
 * and ambient sound synthesizer (Summer Rain, Warm Hearth)
 */

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export function pcmBase64ToWavBlob(base64Pcm: string, sampleRate = 24000, numChannels = 1): Blob {
  const binaryString = atob(base64Pcm);
  const len = binaryString.length;
  const pcmBytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    pcmBytes[i] = binaryString.charCodeAt(i);
  }

  // Check if it already has a RIFF WAVE header
  if (
    pcmBytes.length >= 4 &&
    pcmBytes[0] === 0x52 && // 'R'
    pcmBytes[1] === 0x49 && // 'I'
    pcmBytes[2] === 0x46 && // 'F'
    pcmBytes[3] === 0x46    // 'F'
  ) {
    return new Blob([pcmBytes.buffer as ArrayBuffer], { type: 'audio/wav' });
  }

  const byteRate = sampleRate * numChannels * 2; // 16-bit = 2 bytes
  const blockAlign = numChannels * 2;
  const buffer = new ArrayBuffer(44 + pcmBytes.length);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length
  view.setUint32(4, 36 + pcmBytes.length, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 = PCM)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate
  view.setUint32(28, byteRate, true);
  // block align
  view.setUint16(32, blockAlign, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, pcmBytes.length, true);

  // copy PCM samples
  new Uint8Array(buffer, 44).set(pcmBytes);

  return new Blob([buffer], { type: 'audio/wav' });
}

export type AmbientSoundMode = 'none' | 'rain' | 'hearth';

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private currentMode: AmbientSoundMode = 'none';
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
  }

  setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(vol, 1)), this.ctx.currentTime, 0.05);
    }
  }

  setMode(mode: AmbientSoundMode) {
    if (this.currentMode === mode) return;
    this.stop();
    this.currentMode = mode;
    if (mode !== 'none') {
      this.init();
      if (this.ctx && this.masterGain) {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        if (mode === 'rain') {
          this.playRain();
        } else if (mode === 'hearth') {
          this.playHearth();
        }
      }
    }
  }

  playRain() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 1.8;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);
    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    this.noiseNode = noise;
  }

  playHearth() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.015 * white) / 1.015;
      lastOut = output[i];
      if (Math.random() < 0.0006) {
        output[i] += (Math.random() * 2 - 1) * 0.4;
      }
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    this.noiseNode = noise;
  }

  stop() {
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {
        // Ignored
      }
      this.noiseNode = null;
    }
  }
}

export const ambientEngine = new AmbientAudioEngine();

/**
 * Generates default filename in the format:
 * <nama karakter>_<style>_<ddmmyyyy>
 * Example: Achird_FriendlyMale_04112026
 */
export function generateDefaultWavFilename(
  voiceName: string,
  genderHintOrStyle?: string,
  styleName?: string
): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const dateStr = `${day}${month}${year}`;

  const cleanVoice = (voiceName || 'Voice').replace(/[^a-zA-Z0-9]/g, '') || 'Voice';
  const rawStyle = genderHintOrStyle || styleName || 'Natural';
  const cleanStyle = rawStyle.replace(/[^a-zA-Z0-9]/g, '') || 'Natural';

  return `${cleanVoice}_${cleanStyle}_${dateStr}`;
}

