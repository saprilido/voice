import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Volume2,
  Mic2,
  Sparkles,
  Filter,
  SlidersHorizontal,
  Clock,
  Globe,
  Radio,
  Check,
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import {
  Voice,
  GEMINI_VOICES,
  STUDIO_STYLES,
  STUDIO_PACES,
  STUDIO_ACCENTS
} from '../data/voices';
import { VoiceCard } from './VoiceCard';

interface VoiceSectionProps {
  selectedVoice: Voice;
  playingVoiceId: string | null;
  onSelectVoice: (voice: Voice) => void;
  onPlayToggle: (voice: Voice, lang: 'id' | 'en') => void;
  selectedStyle: string;
  onChangeStyle: (style: string) => void;
  selectedPace: string;
  onChangePace: (pace: string) => void;
  selectedAccent: string;
  onChangeAccent: (accent: string) => void;
}

type CategoryFilter = 'all' | 'female' | 'male' | 'higher' | 'middle' | 'lower';
type ModulationTab = 'style' | 'pace' | 'accent';

export const VoiceSection: React.FC<VoiceSectionProps> = ({
  selectedVoice,
  playingVoiceId,
  onSelectVoice,
  onPlayToggle,
  selectedStyle,
  onChangeStyle,
  selectedPace,
  onChangePace,
  selectedAccent,
  onChangeAccent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activeTab, setActiveTab] = useState<ModulationTab>('style');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomPromptInput, setShowCustomPromptInput] = useState(false);
  const sampleLang = 'id';

  // Dynamic counts for category pills
  const counts = useMemo(() => {
    return {
      all: GEMINI_VOICES.length,
      female: GEMINI_VOICES.filter((v) => v.gender === 'Female').length,
      male: GEMINI_VOICES.filter((v) => v.gender === 'Male').length,
      higher: GEMINI_VOICES.filter((v) => v.pitch === 'Higher pitch').length,
      middle: GEMINI_VOICES.filter((v) => v.pitch === 'Middle pitch').length,
      lower: GEMINI_VOICES.filter((v) => v.pitch === 'Lower pitch').length,
    };
  }, []);

  // Filtered voice list
  const filteredVoices = useMemo(() => {
    return GEMINI_VOICES.filter((voice) => {
      // Search matching
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesSearch =
          voice.name.toLowerCase().includes(query) ||
          voice.trait.toLowerCase().includes(query) ||
          voice.pitch.toLowerCase().includes(query) ||
          voice.styleTag.toLowerCase().includes(query) ||
          voice.description.toLowerCase().includes(query) ||
          voice.tags.some((t) => t.toLowerCase().includes(query));

        if (!matchesSearch) return false;
      }

      // Category matching
      if (activeCategory === 'female' && voice.gender !== 'Female') return false;
      if (activeCategory === 'male' && voice.gender !== 'Male') return false;
      if (activeCategory === 'higher' && voice.pitch !== 'Higher pitch') return false;
      if (activeCategory === 'middle' && voice.pitch !== 'Middle pitch') return false;
      if (activeCategory === 'lower' && voice.pitch !== 'Lower pitch') return false;

      return true;
    });
  }, [searchQuery, activeCategory]);

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  const isFiltered = searchQuery !== '' || activeCategory !== 'all';
  const activeVoiceTrait = selectedVoice.trait.split('&')[0].trim();

  return (
    <section className="w-full bg-white rounded-3xl border border-stone-200 shadow-xs p-5 sm:p-7 flex flex-col gap-5 transition-all">
      {/* 
        TOP HEADER:
        Matches exact layout in user's screenshot
      */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-stone-100">
        {/* Left: Icon, Title, Badge, Code pill, and Subtitle */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs border border-stone-800">
            <Mic2 className="w-5 h-5" />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                30 Google Gemini TTS Voices
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300/80">
                • Full 30 Suara
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-stone-100 text-stone-600 border border-stone-200">
                gemini-3.1-flash-tts-preview
              </span>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed max-w-2xl">
              Dengarkan sample suara atau klik kartu untuk memilih persona resmi Google TTS untuk narasi Anda.
            </p>
          </div>
        </div>

        {/* Right: Active Voice Pill matching Screenshot */}
        <div className="shrink-0 flex items-center self-start md:self-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50/80 border border-amber-300 text-xs text-stone-800 shadow-2xs">
            <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />
            <span className="text-stone-500 font-medium">Suara aktif:</span>
            <span className="font-bold text-stone-900">{selectedVoice.name}</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold text-[11px] border border-amber-200">
              {activeVoiceTrait}
            </span>
          </div>
        </div>
      </div>

      {/* 
        SEARCH & CATEGORY FILTERS:
        Matches exact layout in user's screenshot
      */}
      <div className="flex flex-col gap-3">
        {/* Search input line */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama suara, karakter (Soft, Firm, Bright), nada..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-stone-50/60 hover:bg-stone-50 focus:bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 self-end sm:self-center">
            <span>
              Menampilkan <strong className="text-stone-900">{filteredVoices.length}</strong> dari {counts.all} suara
            </span>
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-amber-800 hover:text-amber-900 font-semibold underline cursor-pointer ml-1"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Category Pills line matching screenshot */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-stone-500 font-medium mr-1 flex items-center gap-1 text-[11px]">
            <Filter className="w-3 h-3 text-stone-400" /> Kategori:
          </span>

          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-stone-200/70'
            }`}
          >
            Semua {counts.all}
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('female')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'female'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-stone-200/70'
            }`}
          >
            Female {counts.female}
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('male')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'male'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-stone-200/70'
            }`}
          >
            Male {counts.male}
          </button>

          <div className="w-px h-4 bg-stone-300 mx-1 shrink-0" />

          <button
            type="button"
            onClick={() => setActiveCategory('higher')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'higher'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-stone-200/70'
            }`}
          >
            Higher pitch {counts.higher}
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('middle')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'middle'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-stone-200/70'
            }`}
          >
            Middle pitch {counts.middle}
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('lower')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'lower'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-stone-200/70'
            }`}
          >
            Lower pitch {counts.lower}
          </button>
        </div>
      </div>

      {/* 
        3-COLUMN RESPONSIVE VOICES GRID:
        Exactly matching the clean card layout in the screenshot
      */}
      <div>
        {filteredVoices.length === 0 ? (
          <div className="text-center py-14 px-4 bg-stone-50/70 rounded-2xl border border-dashed border-stone-300">
            <p className="text-sm font-semibold text-stone-700">Tidak ada suara yang sesuai dengan filter.</p>
            <p className="text-xs text-stone-500 mt-1">Coba gunakan kata kunci lain atau reset filter Anda.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-3.5 px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Tampilkan Semua Suara
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredVoices.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                isSelected={selectedVoice.id === voice.id}
                isPlaying={playingVoiceId === voice.id}
                sampleLang={sampleLang}
                onSelect={onSelectVoice}
                onPlayToggle={(v) => onPlayToggle(v, sampleLang)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 
        VOICE MODULATION & ACOUSTICS SECTION:
        Matching exact bottom section in user's screenshot
      */}
      <div className="pt-6 border-t border-stone-200/90 flex flex-col gap-4">
        {/* Modulation Header & Tab Switchers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
            <div className="flex items-center gap-0.5 text-stone-800">
              <span className="w-1 h-3 bg-stone-700 rounded-full" />
              <span className="w-1 h-4 bg-stone-700 rounded-full" />
              <span className="w-1 h-2 bg-stone-700 rounded-full" />
            </div>
            <span>VOICE MODULATION & ACOUSTICS</span>
          </div>

          {/* Style, Pace, Accent Tabs */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200/80 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('style')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'style'
                  ? 'bg-white text-stone-950 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
              <span>Style</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pace')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'pace'
                  ? 'bg-white text-stone-950 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-stone-600" />
              <span>Pace</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('accent')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'accent'
                  ? 'bg-white text-stone-950 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-stone-600" />
              <span>Accent</span>
            </button>
          </div>
        </div>

        {/* 6 Modulation Cards Grid (Style, Pace, or Accent) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {activeTab === 'style' &&
            STUDIO_STYLES.map((styleItem) => {
              const isSelected = selectedStyle === styleItem.id;
              return (
                <div
                  key={styleItem.id}
                  onClick={() => onChangeStyle(styleItem.id)}
                  className={`p-4 rounded-2xl transition-all cursor-pointer text-left border select-none ${
                    isSelected
                      ? 'bg-[#121212] text-white border-stone-800 shadow-xl ring-1 ring-amber-500/30'
                      : 'bg-white hover:bg-stone-50/80 text-stone-800 border-stone-200/90 shadow-2xs hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-bold tracking-tight ${
                        isSelected ? 'text-white' : 'text-stone-900'
                      }`}
                    >
                      {styleItem.label}
                    </h4>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs leading-relaxed mt-1.5 ${
                      isSelected ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {styleItem.description}
                  </p>
                </div>
              );
            })}

          {activeTab === 'pace' &&
            STUDIO_PACES.map((paceItem) => {
              const isSelected = selectedPace === paceItem.id;
              return (
                <div
                  key={paceItem.id}
                  onClick={() => onChangePace(paceItem.id)}
                  className={`p-4 rounded-2xl transition-all cursor-pointer text-left border select-none ${
                    isSelected
                      ? 'bg-[#121212] text-white border-stone-800 shadow-xl ring-1 ring-amber-500/30'
                      : 'bg-white hover:bg-stone-50/80 text-stone-800 border-stone-200/90 shadow-2xs hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-bold tracking-tight ${
                        isSelected ? 'text-white' : 'text-stone-900'
                      }`}
                    >
                      {paceItem.label}
                    </h4>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs leading-relaxed mt-1.5 ${
                      isSelected ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {paceItem.description}
                  </p>
                </div>
              );
            })}

          {activeTab === 'accent' &&
            STUDIO_ACCENTS.map((accentItem) => {
              const isSelected = selectedAccent === accentItem.id;
              return (
                <div
                  key={accentItem.id}
                  onClick={() => onChangeAccent(accentItem.id)}
                  className={`p-4 rounded-2xl transition-all cursor-pointer text-left border select-none ${
                    isSelected
                      ? 'bg-[#121212] text-white border-stone-800 shadow-xl ring-1 ring-amber-500/30'
                      : 'bg-white hover:bg-stone-50/80 text-stone-800 border-stone-200/90 shadow-2xs hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-bold tracking-tight ${
                        isSelected ? 'text-white' : 'text-stone-900'
                      }`}
                    >
                      {accentItem.label}
                    </h4>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs leading-relaxed mt-1.5 ${
                      isSelected ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {accentItem.prompt}
                  </p>
                </div>
              );
            })}
        </div>

        {/* Optional Custom Voice Prompt Footer matching Screenshot */}
        <div className="pt-2 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">Additional Gemini Voice Prompt (Optional)</span>
            <button
              type="button"
              onClick={() => setShowCustomPromptInput(!showCustomPromptInput)}
              className="text-stone-700 hover:text-stone-900 font-semibold underline cursor-pointer"
            >
              {showCustomPromptInput ? 'Tutup custom prompt' : 'Add custom prompt'}
            </button>
          </div>

          {showCustomPromptInput && (
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Instruksi kustom tambahan untuk Gemini TTS (contoh: 'Berikan penekanan emosional hangat pada kalimat penutup')"
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-stone-400 focus:border-stone-500"
            />
          )}
        </div>
      </div>
    </section>
  );
};
