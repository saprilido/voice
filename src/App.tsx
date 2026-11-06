/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { PoemPresentationCard } from './components/PoemPresentationCard';
import { PersistentAudioPlayer } from './components/PersistentAudioPlayer';
import { VoiceCustomization } from './components/VoiceCustomization';
import { AmbientSoundControl } from './components/AmbientSoundControl';
import { MomentLibrary } from './components/MomentLibrary';
import { ApiKeyModal } from './components/ApiKeyModal';
import { QuotaModal } from './components/QuotaModal';
import { notifyQuotaExhausted } from './utils/quota';
import {
  DEFAULT_MOMENT,
  MomentItem,
  STYLE_DIRECTIVES,
  PACE_DIRECTIVES,
  ACCENT_DIRECTIVES,
  GEMINI_VOICES
} from './data/voices';
import { pcmBase64ToWavBlob, generateDefaultWavFilename } from './utils/audio';

export default function App() {
  const [currentMoment, setCurrentMoment] = useState<MomentItem>(DEFAULT_MOMENT);
  const [lines, setLines] = useState<string[]>(DEFAULT_MOMENT.lines);
  const [selectedVoice, setSelectedVoice] = useState<string>('Kore');
  const [selectedStyleId, setSelectedStyleId] = useState<string>('vocal-smile');
  const [selectedPaceId, setSelectedPaceId] = useState<string>('rapid-fire');
  const [selectedAccentId, setSelectedAccentId] = useState<string>('american-gen');
  const [customStylePrompt, setCustomStylePrompt] = useState<string>('');
  const [isCustomStyleEnabled, setIsCustomStyleEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.25);
  const [volume, setVolume] = useState<number>(0.9);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>(() => {
    return localStorage.getItem('user_gemini_api_key') || '';
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Setup audio element listeners
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (!audio.loop) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: Event) => {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update audio props when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = isLooping;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isLooping, playbackRate]);

  const fullText = lines.filter((l) => l.trim().length > 0).join('\n');

  const activeVoiceObj = useMemo(
    () => GEMINI_VOICES.find((v) => v.id === selectedVoice),
    [selectedVoice]
  );
  const activeStyleObj = useMemo(
    () => STYLE_DIRECTIVES.find((s) => s.id === selectedStyleId),
    [selectedStyleId]
  );

  const handleSelectStyle = (id: string) => {
    setSelectedStyleId(id);
    if (audioUrl) setAudioUrl(null);
  };

  const handleSelectPace = (id: string) => {
    setSelectedPaceId(id);
    if (audioUrl) setAudioUrl(null);
    const paceObj = PACE_DIRECTIVES.find((p) => p.id === id);
    if (paceObj?.playbackSpeedDefault) {
      setPlaybackRate(paceObj.playbackSpeedDefault);
    }
  };

  const handleSelectAccent = (id: string) => {
    setSelectedAccentId(id);
    if (audioUrl) setAudioUrl(null);
  };

  // Convert text to speech via Gemini TTS
  const handleGenerateSpeech = async () => {
    if (!fullText.trim()) return;

    setErrorNotice(null);
    setIsLoading(true);

    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const styleObj = STYLE_DIRECTIVES.find((s) => s.id === selectedStyleId);
      const paceObj = PACE_DIRECTIVES.find((p) => p.id === selectedPaceId);
      const accentObj = ACCENT_DIRECTIVES.find((a) => a.id === selectedAccentId);

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (userApiKey) {
        headers['x-gemini-api-key'] = userApiKey;
      }

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: fullText,
          voice: selectedVoice,
          style: styleObj?.directive,
          pace: paceObj?.directive,
          accent: accentObj?.directive,
          stylePrompt: isCustomStyleEnabled && customStylePrompt.trim() ? customStylePrompt.trim() : undefined,
          apiKey: userApiKey || undefined,
        }),
      });

      const data = await res.json();
      if (data?.code === 'QUOTA_EXHAUSTED') {
        notifyQuotaExhausted();
      }
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to convert text to speech');
      }
      if (!data.audioData) {
        throw new Error('No audio returned from Gemini TTS');
      }

      const wavBlob = pcmBase64ToWavBlob(data.audioData, data.sampleRate || 24000);
      const newUrl = URL.createObjectURL(wavBlob);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(newUrl);

      if (audioRef.current) {
        audioRef.current.src = newUrl;
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.volume = volume;
        audioRef.current.play().catch((e) => {
          console.warn('Auto-playback prevented by browser policy:', e);
        });
      }
    } catch (err: any) {
      console.error('TTS conversion error:', err);
      setErrorNotice(err.message || 'Error generating speech. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePlay = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => console.warn('Playback error:', e));
      }
    }
  };

  const handleReplay = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.warn(e));
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // WAV Download with custom filename feature (as requested)
  const handleDownloadWav = (customFileName?: string) => {
    if (!audioUrl) return;
    const baseName =
      customFileName?.trim() ||
      generateDefaultWavFilename(selectedVoice, activeVoiceObj?.genderHint, activeStyleObj?.name);
    const cleanName = baseName.replace(/\.wav$/i, '').replace(/[/\\?%*:|"<>]/g, '_') || 'audio';
    const finalFilename = `${cleanName}.wav`;

    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSelectMoment = (moment: MomentItem) => {
    setCurrentMoment(moment);
    setLines(moment.lines);
    setAudioUrl(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };

  const handleSaveApiKey = (key: string) => {
    if (key) {
      localStorage.setItem('user_gemini_api_key', key);
    } else {
      localStorage.removeItem('user_gemini_api_key');
    }
    setUserApiKey(key);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('user_gemini_api_key');
    setUserApiKey('');
  };

  const handleCustomAiGenerate = async (topic: string) => {
    setIsGeneratingAi(true);
    setErrorNotice(null);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (userApiKey) {
        headers['x-gemini-api-key'] = userApiKey;
      }

      const res = await fetch('/api/generate-moment', {
        method: 'POST',
        headers,
        body: JSON.stringify({ topic, apiKey: userApiKey || undefined }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to craft moment');
      }

      const generatedLines = data.text
        .split('\n')
        .map((l: string) => l.trim())
        .filter((l: string) => !!l);

      const customMoment: MomentItem = {
        id: `custom-${Date.now()}`,
        title: topic.slice(0, 24) + (topic.length > 24 ? '...' : ''),
        subtitle: 'Personal Reflection',
        lines: generatedLines,
        note: topic,
      };

      setCurrentMoment(customMoment);
      setLines(generatedLines);
      setAudioUrl(null);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || 'Failed to craft reflection');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const activeLineIndex = useMemo(() => {
    if (!isPlaying || duration <= 0) return -1;
    const validLines = lines
      .map((text, idx) => ({ text, originalIdx: idx }))
      .filter((l) => l.text.trim().length > 0);
    if (validLines.length === 0) return -1;

    const totalWords = validLines.reduce((acc, l) => acc + Math.max(1, l.text.split(/\s+/).length), 0);
    const progressRatio = Math.min(1, Math.max(0, currentTime / duration));
    let runningWords = 0;

    for (const line of validLines) {
      const lineWords = Math.max(1, line.text.split(/\s+/).length);
      if (progressRatio <= (runningWords + lineWords) / totalWords) {
        return line.originalIdx;
      }
      runningWords += lineWords;
    }
    return validLines[validLines.length - 1].originalIdx;
  }, [isPlaying, duration, currentTime, lines]);

  return (
    <div className="min-h-full bg-[#faf7f2] text-[#2c2523] flex flex-col justify-between selection:bg-amber-200 selection:text-amber-950 font-sans">
      {/* Top Header */}
      <Header
        selectedVoiceName={selectedVoice}
        userApiKey={userApiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Error Notice Banner */}
        {errorNotice && (
          <div
            id="error-banner"
            className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm shadow-xs"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Speech Generation Notice</p>
              <p className="text-xs text-rose-700 leading-relaxed">{errorNotice}</p>
            </div>
          </div>
        )}

        {/* Section 1: Poem / Text Display Section (Kolom Input Teks) */}
        <section id="poem-display-section" aria-label="Poem Display">
          <PoemPresentationCard
            lines={lines}
            title={currentMoment.title}
            subtitle={currentMoment.subtitle}
            isPlaying={isPlaying}
            isLoading={isLoading}
            activeLineIndex={activeLineIndex}
            onPlayOrPause={handleTogglePlay}
            onGenerateSpeech={handleGenerateSpeech}
            hasGeneratedAudio={!!audioUrl}
            selectedVoice={selectedVoice}
            selectedStyleId={selectedStyleId}
            onSelectStyle={handleSelectStyle}
            selectedPaceId={selectedPaceId}
            onSelectPace={handleSelectPace}
            selectedAccentId={selectedAccentId}
            onSelectAccent={handleSelectAccent}
            onEditLines={(newLines) => {
              setLines(newLines);
              if (audioUrl) setAudioUrl(null);
            }}
          />
        </section>

        {/* Section 2: Bagian yang terlampir (Pindah ke setelah kolom input teks sesuai Request #3) */}
        {/* 2A: Ambient Sound Section */}
        <section id="ambient-sound-section">
          <AmbientSoundControl />
        </section>

        {/* 2B: Moment Library Section */}
        <section
          id="moment-library-section"
          className="p-6 rounded-2xl bg-white/70 border border-[#e8e0d5] shadow-xs"
        >
          <MomentLibrary
            currentMomentId={currentMoment.id}
            onSelectMoment={handleSelectMoment}
            onCustomGenerate={handleCustomAiGenerate}
            isGeneratingAi={isGeneratingAi}
          />
        </section>

        {/* Section 3: Persistent Audio Player Bar (dengan Fitur Rename file .wav Request #1) */}
        <section id="audio-player-section" aria-label="Audio Controls">
          <PersistentAudioPlayer
            audioUrl={audioUrl}
            isPlaying={isPlaying}
            isLoading={isLoading}
            onTogglePlay={handleTogglePlay}
            onReplay={handleReplay}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            playbackRate={playbackRate}
            onChangePlaybackRate={setPlaybackRate}
            volume={volume}
            onChangeVolume={setVolume}
            onDownloadWav={handleDownloadWav}
            voiceName={selectedVoice}
            voiceGenderHint={activeVoiceObj?.genderHint}
            selectedStyleName={activeStyleObj?.name}
            isLooping={isLooping}
            onToggleLoop={() => setIsLooping(!isLooping)}
            currentTitle={currentMoment.title}
          />
        </section>

        {/* Section 4: Voice Customization & 30 Voices Grid */}
        <section
          id="voice-customization-section"
          className="p-6 rounded-2xl bg-white/70 border border-[#e8e0d5] shadow-xs"
        >
          <VoiceCustomization
            selectedVoice={selectedVoice}
            onSelectVoice={(vId) => {
              setSelectedVoice(vId);
              if (audioUrl) setAudioUrl(null);
            }}
            onStopMainAudio={() => {
              if (audioRef.current && isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
              }
            }}
            selectedStyleId={selectedStyleId}
            onSelectStyle={handleSelectStyle}
            selectedPaceId={selectedPaceId}
            onSelectPace={handleSelectPace}
            selectedAccentId={selectedAccentId}
            onSelectAccent={handleSelectAccent}
            customStylePrompt={customStylePrompt}
            onChangeCustomStyle={setCustomStylePrompt}
            isCustomStyleEnabled={isCustomStyleEnabled}
            onToggleCustomStyle={setIsCustomStyleEnabled}
            disabled={isLoading}
            userApiKey={userApiKey}
          />
        </section>
      </main>

      {/* Footer (Request #5: Dibuat oleh apink.web.id | 2026) */}
      <footer
        id="app-footer"
        className="w-full border-t border-[#ece4d9] py-5 text-center text-xs text-stone-500 bg-[#faf7f2]"
      >
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-stone-600">
            Dibuat oleh{' '}
            <a
              href="https://apink.web.id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-stone-900 hover:text-amber-700 underline decoration-stone-400 hover:decoration-amber-700 underline-offset-2 transition-colors"
            >
              apink.web.id
            </a>{' '}
            | 2026
          </p>
          <p className="text-[11px] text-stone-400">
            Powered by Google Gemini 3.1 Flash TTS Preview
          </p>
        </div>
      </footer>

      {/* Popup kuota habis */}
      <QuotaModal onOpenApiKey={() => setIsApiKeyModalOpen(true)} />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentApiKey={userApiKey}
        onSaveApiKey={handleSaveApiKey}
        onClearApiKey={handleClearApiKey}
      />
    </div>
  );
}
