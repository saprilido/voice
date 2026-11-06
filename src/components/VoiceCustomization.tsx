import React, { useState, useMemo, useRef, useEffect } from 'react';
import { notifyQuotaExhausted } from '../utils/quota';
import {
  Mic,
  Radio,
  Search,
  X,
  SlidersVertical,
  Sparkles,
  Clock,
  Globe,
  Check,
  Play,
  Square,
  Loader2,
  AlertCircle,
  HelpCircle,
  Filter
} from 'lucide-react';
import {
  GEMINI_VOICES,
  Voice,
  STYLE_DIRECTIVES,
  PACE_DIRECTIVES,
  ACCENT_DIRECTIVES
} from '../data/voices';
import { pcmBase64ToWavBlob } from '../utils/audio';

interface VoiceCustomizationProps {
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
  selectedStyleId: string;
  onSelectStyle: (styleId: string) => void;
  selectedPaceId: string;
  onSelectPace: (paceId: string) => void;
  selectedAccentId: string;
  onSelectAccent: (accentId: string) => void;
  customStylePrompt: string;
  onChangeCustomStyle: (prompt: string) => void;
  isCustomStyleEnabled: boolean;
  onToggleCustomStyle: (enabled: boolean) => void;
  onStopMainAudio?: () => void;
  disabled?: boolean;
  userApiKey?: string;
}

export const VoiceCustomization: React.FC<VoiceCustomizationProps> = ({
  selectedVoice,
  onSelectVoice,
  selectedStyleId,
  onSelectStyle,
  selectedPaceId,
  onSelectPace,
  selectedAccentId,
  onSelectAccent,
  customStylePrompt,
  onChangeCustomStyle,
  isCustomStyleEnabled,
  onToggleCustomStyle,
  onStopMainAudio,
  disabled = false,
  userApiKey,
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'pace' | 'accent'>('style');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [loadingVoiceId, setLoadingVoiceId] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const sampleAudioRef = useRef<HTMLAudioElement | null>(null);
  const cachedSampleUrls = useRef<Record<string, string>>({});

  useEffect(() => {
    return () => {
      if (sampleAudioRef.current) {
        sampleAudioRef.current.pause();
        sampleAudioRef.current = null;
      }
    };
  }, []);

  const playAudioUrl = (url: string, voiceId: string) => {
    const audio = new Audio(url);
    sampleAudioRef.current = audio;
    setPlayingVoiceId(voiceId);
    audio.onended = () => {
      setPlayingVoiceId(null);
    };
    audio.onerror = () => {
      setPlayingVoiceId(null);
      setPreviewError(`Error playing sample for ${voiceId}.`);
    };
    audio.play().catch((err) => {
      console.error('Audio play error:', err);
      setPlayingVoiceId(null);
    });
  };

  const handleToggleSample = async (voiceId: string) => {
    setPreviewError(null);

    // If currently playing this sample, pause it
    if (playingVoiceId === voiceId) {
      if (sampleAudioRef.current) {
        sampleAudioRef.current.pause();
        sampleAudioRef.current.currentTime = 0;
      }
      setPlayingVoiceId(null);
      return;
    }

    // Stop existing playback
    if (sampleAudioRef.current) {
      sampleAudioRef.current.pause();
      sampleAudioRef.current.currentTime = 0;
    }
    if (onStopMainAudio) {
      onStopMainAudio();
    }

    // If already cached
    if (cachedSampleUrls.current[voiceId]) {
      playAudioUrl(cachedSampleUrls.current[voiceId], voiceId);
      return;
    }

    try {
      setLoadingVoiceId(voiceId);
      const headers: Record<string, string> = {};
      if (userApiKey) {
        headers['x-gemini-api-key'] = userApiKey;
      }
      const res = await fetch(`/api/tts/sample?voice=${encodeURIComponent(voiceId)}`, { headers });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.code === 'QUOTA_EXHAUSTED') {
          notifyQuotaExhausted();
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!data.audioData) {
        throw new Error('No audio returned.');
      }
      const wavBlob = pcmBase64ToWavBlob(data.audioData, data.sampleRate || 24000);
      const url = URL.createObjectURL(wavBlob);
      cachedSampleUrls.current[voiceId] = url;
      setLoadingVoiceId(null);
      playAudioUrl(url, voiceId);
    } catch (err: any) {
      console.error('Voice sample play failed:', err);
      setLoadingVoiceId(null);
      setPreviewError(`Failed to load preview for ${voiceId}: ${err?.message || 'Error'}`);
    }
  };

  const categoryCounts = useMemo(() => {
    return {
      all: GEMINI_VOICES.length,
      female: GEMINI_VOICES.filter((v) => v.genderHint.toLowerCase().includes('female')).length,
      male: GEMINI_VOICES.filter((v) => v.genderHint.toLowerCase().includes('male')).length,
      higher: GEMINI_VOICES.filter((v) => (v.pitch || '').toLowerCase().includes('higher')).length,
      middle: GEMINI_VOICES.filter((v) => {
        const p = (v.pitch || '').toLowerCase();
        return p === 'middle pitch' || (p.includes('middle') && !p.includes('lower'));
      }).length,
      lower: GEMINI_VOICES.filter((v) => (v.pitch || '').toLowerCase().includes('lower')).length,
    };
  }, []);

  const filteredVoices = useMemo(() => {
    return GEMINI_VOICES.filter((v) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(query);
        const matchesTrait = (v.trait || '').toLowerCase().includes(query);
        const matchesPitch = (v.pitch || '').toLowerCase().includes(query);
        const matchesTone = v.tone.toLowerCase().includes(query);
        const matchesDesc = v.description.toLowerCase().includes(query);
        if (!matchesName && !matchesTrait && !matchesPitch && !matchesTone && !matchesDesc) {
          return false;
        }
      }

      if (categoryFilter === 'female') {
        return v.genderHint.toLowerCase().includes('female');
      }
      if (categoryFilter === 'male') {
        return v.genderHint.toLowerCase().includes('male');
      }
      if (categoryFilter === 'higher') {
        return (v.pitch || '').toLowerCase().includes('higher');
      }
      if (categoryFilter === 'middle') {
        const p = (v.pitch || '').toLowerCase();
        return p === 'middle pitch' || (p.includes('middle') && !p.includes('lower'));
      }
      if (categoryFilter === 'lower') {
        return (v.pitch || '').toLowerCase().includes('lower');
      }
      return true;
    });
  }, [categoryFilter, searchQuery]);

  return (
    <div id="voice-and-style-controls" className="w-full space-y-8">
      {/* Voices Section */}
      <div className="space-y-5">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-4 border-b border-stone-200/80">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-amber-400 flex items-center justify-center shadow-xs shrink-0 ring-1 ring-stone-800">
              <Mic className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight whitespace-nowrap">
                  30 Google Gemini TTS Voices
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                  Full 30 Suara
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[11px] font-mono text-stone-500 bg-stone-100 border border-stone-200/70">
                  gemini-3.1-flash-tts-preview
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-normal">
                Dengarkan sample suara atau klik kartu untuk memilih persona resmi Google TTS untuk narasi Anda.
              </p>
            </div>
          </div>

          {selectedVoice && (
            <div className="flex items-center gap-2 self-start md:self-center px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs shrink-0 shadow-2xs">
              <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span className="text-stone-600">Suara aktif:</span>
              <strong className="font-bold text-amber-950">{selectedVoice}</strong>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/60 font-semibold text-amber-950">
                {GEMINI_VOICES.find((v) => v.id === selectedVoice)?.trait}
              </span>
            </div>
          )}
        </div>

        {/* Search and Category Filter Toolbar */}
        <div className="bg-stone-50/90 border border-stone-200/90 rounded-2xl p-3.5 sm:p-4 space-y-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama suara, karakter (Soft, Firm, Bright), nada..."
                className="w-full pl-9.5 pr-8 py-2 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  title="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-stone-500">
              <span className="font-medium text-stone-700">
                Menampilkan <strong className="font-bold text-stone-900">{filteredVoices.length}</strong> dari 30 suara
              </span>
              {(categoryFilter !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-amber-800 hover:text-amber-950 font-semibold underline cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-stone-400 text-xs flex items-center gap-1 mr-1 shrink-0 font-medium">
              <Filter className="w-3.5 h-3.5" />
              Kategori:
            </span>

            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/90'
              }`}
            >
              Semua
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  categoryFilter === 'all' ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {categoryCounts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCategoryFilter('female')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === 'female'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/90'
              }`}
            >
              Female
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  categoryFilter === 'female' ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {categoryCounts.female}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCategoryFilter('male')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === 'male'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/90'
              }`}
            >
              Male
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  categoryFilter === 'male' ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {categoryCounts.male}
              </span>
            </button>

            <div className="h-4 w-px bg-stone-300 mx-1 shrink-0" />

            <button
              type="button"
              onClick={() => setCategoryFilter('higher')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === 'higher'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/90'
              }`}
            >
              Higher pitch
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  categoryFilter === 'higher' ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {categoryCounts.higher}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCategoryFilter('middle')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === 'middle'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/90'
              }`}
            >
              Middle pitch
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  categoryFilter === 'middle' ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {categoryCounts.middle}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCategoryFilter('lower')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === 'lower'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/90'
              }`}
            >
              Lower pitch
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  categoryFilter === 'lower' ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {categoryCounts.lower}
              </span>
            </button>
          </div>
        </div>

        {/* Preview error if any */}
        {previewError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{previewError}</span>
            </div>
            <button
              type="button"
              onClick={() => setPreviewError(null)}
              className="text-xs text-rose-700 hover:text-rose-900 underline font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Voice Cards Grid */}
        {filteredVoices.length === 0 ? (
          <div className="py-14 text-center text-stone-500 bg-stone-50/50 rounded-3xl border border-dashed border-stone-300">
            <Mic className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-800">Tidak ada suara yang cocok</p>
            <p className="text-xs text-stone-500 mt-0.5">
              Tidak ditemukan suara dengan kata kunci "{searchQuery}" pada kategori ini.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
              className="mt-3.5 px-4 py-1.5 rounded-xl bg-stone-900 text-stone-100 text-xs font-semibold shadow-xs hover:bg-stone-800 cursor-pointer"
            >
              Tampilkan Semua 30 Suara
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredVoices.map((voice) => {
              const isSelected = selectedVoice === voice.id;
              const isPlaying = playingVoiceId === voice.id;
              const isLoading = loadingVoiceId === voice.id;

              return (
                <div
                  key={voice.id}
                  id={`voice-card-${voice.id.toLowerCase()}`}
                  onClick={() => onSelectVoice(voice.id)}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-amber-500/30'
                      : 'bg-white hover:bg-stone-50/80 border-stone-200/90 text-stone-800 hover:border-stone-300'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1.5 mb-1.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3
                            className={`font-semibold text-sm sm:text-base tracking-tight truncate ${
                              isSelected ? 'text-white' : 'text-stone-900'
                            }`}
                          >
                            {voice.name}
                          </h3>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] font-medium ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                          {voice.genderHint}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${
                          isSelected
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                      >
                        {voice.trait}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-stone-800 text-stone-300 border border-stone-700'
                            : 'bg-stone-100 text-stone-600 border border-stone-200/60'
                        }`}
                      >
                        {voice.pitch}
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed line-clamp-2 mb-3.5 ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                      {voice.description}
                    </p>
                  </div>

                  <div
                    className={`pt-3 border-t flex items-center justify-between gap-2 mt-auto ${
                      isSelected ? 'border-stone-800' : 'border-stone-100'
                    }`}
                  >
                    <button
                      type="button"
                      id={`play-sample-btn-${voice.id.toLowerCase()}`}
                      title={`Dengarkan sample suara ${voice.name}`}
                      disabled={isLoading || disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSample(voice.id);
                      }}
                      className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                        isPlaying
                          ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400/50'
                          : isSelected
                          ? 'bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700'
                          : 'bg-stone-100 hover:bg-amber-100/90 text-stone-800 hover:text-amber-950 border border-stone-200'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                          <span>Loading...</span>
                        </>
                      ) : isPlaying ? (
                        <>
                          <Square className="w-2.5 h-2.5 fill-current text-stone-950" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-2.5 h-2.5 fill-current text-amber-600" />
                          <span>Play Sample</span>
                        </>
                      )}
                    </button>

                    {isPlaying ? (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-400/15 border border-amber-400/30">
                        <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1 h-3.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce" />
                        <span className="text-[10px] text-amber-300 font-semibold ml-1">Playing</span>
                      </div>
                    ) : isSelected ? (
                      <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400 font-medium">
                        Pilih suara →
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Voice Modulation & Acoustics Tabs */}
      <div className="space-y-4 pt-6 border-t border-stone-200/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <SlidersVertical className="w-3.5 h-3.5 text-stone-700" />
              Voice Modulation & Acoustics
            </span>
          </div>

          <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200/70 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('style')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'style' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-700" />
              Style
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pace')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pace' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Clock className="w-3 h-3 text-stone-600" />
              Pace
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('accent')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'accent' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Globe className="w-3 h-3 text-stone-600" />
              Accent
            </button>
          </div>
        </div>

        {/* Tab 1: Style Cards */}
        {activeTab === 'style' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {STYLE_DIRECTIVES.map((item) => {
                const isSelected = selectedStyleId === item.id;
                return (
                  <button
                    key={item.id}
                    id={`style-card-${item.id}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectStyle(item.id)}
                    className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-stone-900/10'
                        : 'bg-white hover:bg-stone-50/80 border-stone-200/90 text-stone-800 hover:border-stone-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-sm sm:text-base">{item.name}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Pace Cards */}
        {activeTab === 'pace' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PACE_DIRECTIVES.map((item) => {
                const isSelected = selectedPaceId === item.id;
                return (
                  <button
                    key={item.id}
                    id={`pace-card-${item.id}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectPace(item.id)}
                    className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-stone-900/10'
                        : 'bg-white hover:bg-stone-50/80 border-stone-200/90 text-stone-800 hover:border-stone-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm sm:text-base">{item.name}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Accent Cards */}
        {activeTab === 'accent' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ACCENT_DIRECTIVES.map((item) => {
                const isSelected = selectedAccentId === item.id;
                return (
                  <button
                    key={item.id}
                    id={`accent-card-${item.id}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectAccent(item.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex items-center justify-between ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-stone-900/10'
                        : 'bg-white hover:bg-stone-50/80 border-stone-200/90 text-stone-800 hover:border-stone-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="font-medium text-sm truncate">{item.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-1.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Style Prompt Input */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-500">
              Additional Gemini Voice Prompt (Optional)
            </span>
            <button
              type="button"
              onClick={() => onToggleCustomStyle(!isCustomStyleEnabled)}
              className="text-xs text-stone-700 hover:text-stone-900 underline cursor-pointer"
            >
              {isCustomStyleEnabled ? 'Hide custom prompt' : 'Add custom prompt'}
            </button>
          </div>

          {isCustomStyleEnabled && (
            <div className="space-y-1.5">
              <input
                id="custom-style-input"
                type="text"
                disabled={disabled}
                value={customStylePrompt}
                onChange={(e) => onChangeCustomStyle(e.target.value)}
                placeholder="e.g., Speak with a light laugh, warm pauses, and conversational intimacy..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
              <p className="text-[11px] text-stone-500 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                Combined with chosen Style, Pace, and Accent directives.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
