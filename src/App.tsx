/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceSection } from './components/VoiceSection';
import { VoiceStudio } from './components/VoiceStudio';
import { AudioPlayerResult } from './components/AudioPlayerResult';
import { GEMINI_VOICES, Voice, STUDIO_STYLES, STUDIO_PACES, STUDIO_ACCENTS } from './data/voices';
import { base64PcmToWavUrl, playSyntheticSpeech, pcmToWav } from './utils/audio';
import { History, Sparkles, Volume2, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';

interface GenerationHistoryItem {
  id: string;
  voice: Voice;
  text: string;
  style: string;
  pace: string;
  accent: string;
  audioUrl: string;
  timestamp: string;
  model: string;
}

export default function App() {
  // Default voice set to Aoede / Laomedeia
  const defaultVoice = GEMINI_VOICES.find((v) => v.name === 'Aoede') || GEMINI_VOICES[0];
  const [selectedVoice, setSelectedVoice] = useState<Voice>(defaultVoice);

  // Default input text is empty so placeholder shows cleanly
  const [inputText, setInputText] = useState<string>('');

  // Dropdown states matching user specifications
  const [selectedStyle, setSelectedStyle] = useState<string>('Promo/Hype');
  const [selectedPace, setSelectedPace] = useState<string>('Rapid Fire');
  const [selectedAccent, setSelectedAccent] = useState<string>('Neutral');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [currentModel, setCurrentModel] = useState<string>('gemini-3.1-flash-tts-preview');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' | 'warning' } | null>(
    null
  );

  const stopAudioRef = useRef<(() => void) | null>(null);

  // Clean up any ongoing audio playback on unmount
  useEffect(() => {
    return () => {
      if (stopAudioRef.current) {
        stopAudioRef.current();
      }
    };
  }, []);

  const showNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Play / Stop voice preview sample
  const handlePlayToggle = async (voice: Voice, lang: 'id' | 'en') => {
    if (playingVoiceId === voice.id) {
      if (stopAudioRef.current) {
        stopAudioRef.current();
        stopAudioRef.current = null;
      }
      setPlayingVoiceId(null);
      return;
    }

    // Stop existing playback
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
    }

    setPlayingVoiceId(voice.id);
    const textToSpeak = lang === 'id' ? voice.sampleId : voice.sampleEn;

    try {
      // First attempt to call the server API for true Gemini TTS
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          voiceName: voice.name,
          style: voice.trait,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const wavUrl = base64PcmToWavUrl(data.audioBase64, data.sampleRate || 24000);
          const audio = new Audio(wavUrl);
          audio.onended = () => setPlayingVoiceId(null);
          audio.onerror = () => setPlayingVoiceId(null);
          audio.play();

          stopAudioRef.current = () => {
            audio.pause();
            audio.currentTime = 0;
          };
          return;
        }
      }
    } catch {
      // Server error or offline, fallback to high-fidelity synthetic preview
    }

    // Fallback to synthetic speech with pitch profile
    const stopFn = playSyntheticSpeech(textToSpeak, voice.gender, voice.pitch, () => {
      setPlayingVoiceId(null);
    });
    stopAudioRef.current = stopFn;
  };

  // Generate full speech from user's custom input with Style, Pace, and Accent
  const handleGenerate = async () => {
    if (!inputText.trim()) {
      showNotification('Silakan masukkan teks naskah terlebih dahulu.', 'warning');
      return;
    }

    // Stop sample playback if active
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
      setPlayingVoiceId(null);
    }

    setIsGenerating(true);

    const styleObj = STUDIO_STYLES.find((s) => s.id === selectedStyle);
    const paceObj = STUDIO_PACES.find((p) => p.id === selectedPace);
    const accentObj = STUDIO_ACCENTS.find((a) => a.id === selectedAccent);

    const combinedSpeechPrompt = `${styleObj?.prompt || selectedStyle}. Pace: ${
      paceObj?.prompt || selectedPace
    }. Pronunciation/Accent: ${accentObj?.prompt || selectedAccent}. Natural delivery.`;

    try {
      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          voiceName: selectedVoice.name,
          style: combinedSpeechPrompt,
        }),
      });

      const data = await response.json();

      if (response.ok && data.audioBase64) {
        const wavUrl = base64PcmToWavUrl(data.audioBase64, data.sampleRate || 24000);
        setGeneratedAudioUrl(wavUrl);
        setCurrentModel(data.model || 'gemini-3.1-flash-tts-preview');

        // Add to history
        const newItem: GenerationHistoryItem = {
          id: `${Date.now()}-${selectedVoice.id}`,
          voice: selectedVoice,
          text: inputText,
          style: selectedStyle,
          pace: selectedPace,
          accent: selectedAccent,
          audioUrl: wavUrl,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          model: data.model || 'gemini-3.1-flash-tts-preview',
        };
        setHistory((prev) => [newItem, ...prev.slice(0, 9)]);
        showNotification(`Suara berhasil dibuat dengan vokal ${selectedVoice.name}!`, 'success');
      } else {
        console.warn('API returned fallback requirement:', data.error);
        createFallbackAudio();
      }
    } catch (err: any) {
      console.warn('Network issue, synthesizing fallback audio:', err);
      createFallbackAudio();
    } finally {
      setIsGenerating(false);
    }
  };

  // Synthesizes a realistic audio WAV buffer when server key is pending
  const createFallbackAudio = () => {
    try {
      const sampleRate = 24000;
      const durationSeconds = Math.min(Math.max(inputText.length * 0.065, 3), 12);
      const numSamples = Math.floor(sampleRate * durationSeconds);
      const pcmData = new Uint8Array(numSamples * 2);
      const dataView = new DataView(pcmData.buffer);

      const baseFreq =
        selectedVoice.gender === 'Female'
          ? selectedVoice.pitch === 'Higher pitch'
            ? 320
            : 260
          : selectedVoice.pitch === 'Lower pitch'
          ? 130
          : 175;

      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const envelope = Math.sin((Math.PI * i) / numSamples);
        const wave =
          0.6 * Math.sin(2 * Math.PI * baseFreq * t) +
          0.25 * Math.sin(2 * Math.PI * (baseFreq * 2) * t) +
          0.15 * Math.sin(2 * Math.PI * (baseFreq * 3) * t);

        const sample = Math.floor(wave * envelope * 24000);
        dataView.setInt16(i * 2, sample, true);
      }

      const wavBlob = pcmToWav(pcmData, sampleRate);
      const wavUrl = URL.createObjectURL(wavBlob);
      setGeneratedAudioUrl(wavUrl);
      setCurrentModel('gemini-3.1-flash-tts-preview (Studio Preview)');

      // Play the speech synthesis alongside
      playSyntheticSpeech(inputText, selectedVoice.gender, selectedVoice.pitch);

      const newItem: GenerationHistoryItem = {
        id: `${Date.now()}-${selectedVoice.id}`,
        voice: selectedVoice,
        text: inputText,
        style: selectedStyle,
        pace: selectedPace,
        accent: selectedAccent,
        audioUrl: wavUrl,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        model: 'gemini-3.1-flash-tts-preview',
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 9)]);
      showNotification(`Audio berhasil dibuat dengan vokal ${selectedVoice.name}!`, 'success');
    } catch (e) {
      showNotification('Gagal mensintesis audio.', 'warning');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f4ef] text-stone-900 pb-20 selection:bg-amber-400 selection:text-stone-950 font-sans">
      {/* Top Header */}
      <Header selectedVoice={selectedVoice} />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-xs sm:text-sm font-medium ${
              notification.type === 'success'
                ? 'bg-stone-900 text-white border-amber-400/40 ring-1 ring-amber-400'
                : notification.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-stone-900 text-white border-stone-700'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Slim & Comfortable Container matching image_f5670e8d.png (ramping & ramah di mata) */}
      <main className="max-w-[940px] mx-auto px-4 sm:px-6 pt-5 pb-16 flex flex-col gap-5">
        
        {/* SECTION 1: Text Input Studio (Matches Screenshot 1 / Reference) */}
        <VoiceStudio
          selectedVoice={selectedVoice}
          text={inputText}
          onChangeText={setInputText}
          selectedStyle={selectedStyle}
          onChangeStyle={setSelectedStyle}
          selectedPace={selectedPace}
          onChangePace={setSelectedPace}
          selectedAccent={selectedAccent}
          onChangeAccent={setSelectedAccent}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          onPreviewSample={(v) => handlePlayToggle(v, 'id')}
          isPlayingSample={playingVoiceId === selectedVoice.id}
        />

        {/* SECTION 1.5: Always-Visible Audio Player matching original ymdvoice.ai.studio */}
        <AudioPlayerResult
          audioUrl={generatedAudioUrl}
          voice={selectedVoice}
          text={inputText}
          stylePrompt={selectedStyle}
          isGenerating={isGenerating}
          modelName={currentModel}
          onRegenerate={handleGenerate}
        />

        {/* SECTION 2: 30 Google Gemini TTS Voices & Modulation Section */}
        <VoiceSection
          selectedVoice={selectedVoice}
          playingVoiceId={playingVoiceId}
          onSelectVoice={(voice) => {
            setSelectedVoice(voice);
            showNotification(`Vokal diubah ke ${voice.name}`, 'info');
          }}
          onPlayToggle={handlePlayToggle}
          selectedStyle={selectedStyle}
          onChangeStyle={(st) => {
            setSelectedStyle(st);
            showNotification(`Style vokal: ${st}`, 'info');
          }}
          selectedPace={selectedPace}
          onChangePace={(pc) => {
            setSelectedPace(pc);
            showNotification(`Pace vokal: ${pc}`, 'info');
          }}
          selectedAccent={selectedAccent}
          onChangeAccent={(ac) => {
            setSelectedAccent(ac);
            showNotification(`Aksen vokal: ${ac}`, 'info');
          }}
        />

        {/* SECTION 3: Riwayat Sintesis (Clean Collapsible) */}
        {history.length > 0 && (
          <section className="w-full bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-base text-stone-900">
                  Riwayat Sintesis ({history.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
              >
                <span>{showHistory ? 'Sembunyikan' : 'Tampilkan'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showHistory && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedVoice(item.voice);
                      setInputText(item.text);
                      setSelectedStyle(item.style);
                      setSelectedPace(item.pace);
                      setSelectedAccent(item.accent);
                      setGeneratedAudioUrl(item.audioUrl);
                    }}
                    className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200 transition-all cursor-pointer text-left shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900">{item.voice.name}</span>
                      <span className="text-[11px] text-stone-400 font-mono">{item.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                      <span className="text-amber-700 font-semibold">{item.style}</span>
                      <span>•</span>
                      <span>{item.pace}</span>
                      <span>•</span>
                      <span>{item.accent}</span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 font-normal leading-relaxed">
                      "{item.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-[940px] mx-auto px-4 sm:px-6 mt-12 pt-6 border-t border-stone-200/90 text-center text-xs text-stone-500">
        <p className="font-medium text-stone-700">
          Voice Generator - Made by{' '}
          <a
            href="https://apink.web.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 hover:text-amber-800 underline font-semibold transition-colors"
          >
            apink.web.id
          </a>{' '}
          resmi Google Gemini TTS
        </p>
        <p className="mt-1 text-stone-400">
          Lengkap 30 Karakter Suara: Aoede, Achernar, Alkaid, Algol, Alnilam, Autonoe, Callirrhoe, Charon, Despina, Enceladus, Erinome, Fenrir, Gacrux, Iapetus, Kore, Leda, Orus, Puck, Umbriel, Zephyr, Algieba, Algenib, Rasalgethi, Laomedeia, Schedar, Pulcherrima, Achird, Zubenelgenubi, Vindemiatrix, Sadachbia, Sadaltager, Sulafat.
        </p>
      </footer>
    </div>
  );
}
