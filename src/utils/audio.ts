/**
 * Audio processing utilities for Google Gemini TTS (24kHz 16-bit PCM to WAV)
 */

export function pcmToWav(pcmData: Uint8Array, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Blob {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const buffer = new ArrayBuffer(44 + pcmData.length);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length
  view.setUint32(4, 36 + pcmData.length, true);
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
  view.setUint16(34, bitsPerSample, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, pcmData.length, true);

  // copy PCM samples
  const wavBytes = new Uint8Array(buffer);
  wavBytes.set(pcmData, 44);

  return new Blob([wavBytes.buffer as ArrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function base64PcmToWavUrl(base64Pcm: string, sampleRate = 24000): string {
  const bytes = base64ToUint8Array(base64Pcm);
  // Check if it already has a RIFF WAVE header (ASCII 'RIFF')
  if (
    bytes.length > 12 &&
    bytes[0] === 0x52 && // 'R'
    bytes[1] === 0x49 && // 'I'
    bytes[2] === 0x46 && // 'F'
    bytes[3] === 0x46    // 'F'
  ) {
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }
  const blob = pcmToWav(bytes, sampleRate);
  return URL.createObjectURL(blob);
}

// Fallback browser speech synthesis with pitch/rate tuning to simulate distinct character
export function playSyntheticSpeech(
  text: string,
  voiceGender: 'Female' | 'Male',
  voicePitch: 'Higher pitch' | 'Middle pitch' | 'Lower pitch',
  onEnd?: () => void
): () => void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return () => {};
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set pitch based on Gemini voice specs
  if (voicePitch === 'Higher pitch') {
    utterance.pitch = voiceGender === 'Female' ? 1.35 : 1.15;
    utterance.rate = 1.05;
  } else if (voicePitch === 'Lower pitch') {
    utterance.pitch = voiceGender === 'Female' ? 0.85 : 0.65;
    utterance.rate = 0.95;
  } else {
    utterance.pitch = voiceGender === 'Female' ? 1.05 : 0.9;
    utterance.rate = 1.0;
  }

  // Find appropriate browser voice matching gender/language
  const voices = window.speechSynthesis.getVoices();
  const isIndo = /[a-zA-Z]/.test(text) && (text.includes('halo') || text.includes('selamat') || text.includes('kita'));
  
  const preferred = voices.find(v => {
    const name = v.name.toLowerCase();
    const langMatch = isIndo ? v.lang.startsWith('id') : v.lang.startsWith('en');
    if (voiceGender === 'Female') {
      return langMatch && (name.includes('female') || name.includes('zira') || name.includes('samantha') || name.includes('gadis') || name.includes('natural'));
    } else {
      return langMatch && (name.includes('male') || name.includes('david') || name.includes('george') || name.includes('pria') || name.includes('daniel'));
    }
  }) || voices.find(v => isIndo ? v.lang.startsWith('id') : v.lang.startsWith('en')) || voices[0];

  if (preferred) {
    utterance.voice = preferred;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

/**
 * Extracts a concise Indonesian speech style name for filenames
 * e.g., 'Ramah', 'Berwibawa', 'Ceria', 'Tenang', 'Dramatis', 'Natural'
 */
export function getSpeechStyleSlug(stylePrompt?: string, styleTag?: string): string {
  if (!stylePrompt) {
    if (styleTag) {
      const lowerTag = styleTag.toLowerCase();
      if (lowerTag.includes('soft') || lowerTag.includes('friendly') || lowerTag.includes('warm') || lowerTag.includes('breezy')) return 'Ramah';
      if (lowerTag.includes('bright') || lowerTag.includes('youthful') || lowerTag.includes('upbeat')) return 'Ceria';
      if (lowerTag.includes('firm') || lowerTag.includes('deep') || lowerTag.includes('authoritative')) return 'Berwibawa';
      const cleanTag = styleTag.split(/\s+/)[0];
      return cleanTag || 'Ramah';
    }
    return 'Ramah';
  }

  const lower = stylePrompt.toLowerCase();

  // Explicit user styles
  if (lower.includes('vocal smile') || lower.includes('vocal_smile') || lower.includes('smile')) {
    return 'VocalSmile';
  }
  if (lower.includes('newscaster') || lower.includes('news')) {
    return 'Newscaster';
  }
  if (lower.includes('wispher') || lower.includes('whisper')) {
    return 'Whisper';
  }
  if (lower.includes('empathatic') || lower.includes('empathic') || lower.includes('empathy')) {
    return 'Empathic';
  }
  if (lower.includes('promo') || lower.includes('hype')) {
    return 'Promo';
  }
  if (lower.includes('deadpan') || lower.includes('monotone')) {
    return 'Deadpan';
  }

  // Indonesian & tone keywords
  if (lower.includes('ramah') || lower.includes('warm') || lower.includes('friendly') || lower.includes('approachable') || lower.includes('breezy') || lower.includes('soft')) {
    return 'Ramah';
  }
  if (lower.includes('berwibawa') || lower.includes('corporate') || lower.includes('authoritative') || lower.includes('resmi')) {
    return 'Berwibawa';
  }
  if (lower.includes('ceria') || lower.includes('energetic') || lower.includes('cheerful') || lower.includes('upbeat')) {
    return 'Ceria';
  }
  if (lower.includes('tenang') || lower.includes('calm') || lower.includes('soothing') || lower.includes('mindfulness') || lower.includes('meditatif')) {
    return 'Tenang';
  }
  if (lower.includes('dramatis') || lower.includes('dramatic') || lower.includes('suspense') || lower.includes('sinematik')) {
    return 'Dramatis';
  }
  if (lower.includes('tegas') || lower.includes('firm') || lower.includes('direct')) {
    return 'Tegas';
  }

  // Fallback to first alphanumeric word or Ramah
  const firstWord = stylePrompt.replace(/[^a-zA-Z0-9]/g, ' ').trim().split(/\s+/)[0];
  return firstWord || 'Ramah';
}

/**
 * Generates default filename in the format:
 * <nama profil>_<Speech Style>_<ddmmyyyy>
 * Example: Aoede_Ramah_03112026
 */
export function generateDefaultWavFilename(
  voiceName: string,
  stylePrompt?: string,
  styleTag?: string
): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const dateStr = `${day}${month}${year}`;

  const styleSlug = getSpeechStyleSlug(stylePrompt, styleTag);
  const cleanVoice = voiceName.replace(/[^a-zA-Z0-9_-]/g, '') || 'Voice';
  const cleanStyle = styleSlug.replace(/[^a-zA-Z0-9_-]/g, '') || 'Ramah';

  return `${cleanVoice}_${cleanStyle}_${dateStr}`;
}
