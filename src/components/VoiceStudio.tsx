import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  Sparkles,
  Copy,
  Check,
  Trash2,
  BookOpen,
  ChevronDown,
  Smile,
  Clock,
  Globe,
  Play,
  RotateCcw
} from 'lucide-react';
import {
  Voice,
  PRESET_SCRIPTS,
  STUDIO_STYLES,
  STUDIO_PACES,
  STUDIO_ACCENTS
} from '../data/voices';

interface VoiceStudioProps {
  selectedVoice: Voice;
  text: string;
  onChangeText: (text: string) => void;
  selectedStyle: string;
  onChangeStyle: (style: string) => void;
  selectedPace: string;
  onChangePace: (pace: string) => void;
  selectedAccent: string;
  onChangeAccent: (accent: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onPreviewSample: (voice: Voice) => void;
  isPlayingSample: boolean;
}

export const VoiceStudio: React.FC<VoiceStudioProps> = ({
  selectedVoice,
  text,
  onChangeText,
  selectedStyle,
  onChangeStyle,
  selectedPace,
  onChangePace,
  selectedAccent,
  onChangeAccent,
  isGenerating,
  onGenerate,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<'style' | 'pace' | 'accent' | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCopy = async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Active objects
  const currentStyleObj = STUDIO_STYLES.find((s) => s.id === selectedStyle) || STUDIO_STYLES[0];
  const currentPaceObj = STUDIO_PACES.find((p) => p.id === selectedPace) || STUDIO_PACES[1];
  const currentAccentObj = STUDIO_ACCENTS.find((a) => a.id === selectedAccent) || STUDIO_ACCENTS[0];

  return (
    <div className="w-full bg-[#faf6ee] rounded-3xl border border-[#ebe3d5] shadow-xs p-5 sm:p-7 flex flex-col gap-4 text-stone-900 transition-all">
      {/* 
        HEADER: 
        MASUKKAN TEKS (subheading) + Text Input (serif title) + Copy Button 
      */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e7decb]">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#8c7456] uppercase block">
            MASUKKAN TEKS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight mt-0.5">
            Text Input
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!text.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium shadow-2xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 
        CONTROLS:
        Style (Inflection), Pace (Cadence), Accent (Pronunciation)
        Exact layout with custom dropdown menus matching user screenshots
      */}
      <div ref={dropdownRef} className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-30">
        {/* 1. Style Dropdown */}
        <div className="relative flex flex-col gap-1">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-semibold text-stone-800">Style</span>
            <span className="text-[11px] text-stone-500">Inflection</span>
          </div>

          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'style' ? null : 'style')}
            className="w-full bg-white hover:bg-stone-50/80 border border-stone-300 hover:border-stone-400 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-stone-900 shadow-2xs flex items-center justify-between gap-2 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <Smile className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">{currentStyleObj.label}</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-stone-400 shrink-0 transition-transform ${
                openDropdown === 'style' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Style Dropdown Menu */}
          {openDropdown === 'style' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-1.5 z-50 max-h-72 overflow-y-auto">
              {STUDIO_STYLES.map((style) => {
                const isSelected = style.id === selectedStyle;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      onChangeStyle(style.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full px-4 py-2.5 text-left flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected ? 'bg-stone-100 font-semibold' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-stone-900">{style.label}</div>
                      <div className="text-[11px] text-stone-500 leading-tight mt-0.5">{style.description}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-stone-900 shrink-0 mt-0.5 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Pace Dropdown */}
        <div className="relative flex flex-col gap-1">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-semibold text-stone-800">Pace</span>
            <span className="text-[11px] text-stone-500">Cadence</span>
          </div>

          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'pace' ? null : 'pace')}
            className="w-full bg-white hover:bg-stone-50/80 border border-stone-300 hover:border-stone-400 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-stone-900 shadow-2xs flex items-center justify-between gap-2 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">{currentPaceObj.label}</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-stone-400 shrink-0 transition-transform ${
                openDropdown === 'pace' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Pace Dropdown Menu */}
          {openDropdown === 'pace' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-1.5 z-50 max-h-72 overflow-y-auto">
              {STUDIO_PACES.map((pace) => {
                const isSelected = pace.id === selectedPace;
                return (
                  <button
                    key={pace.id}
                    type="button"
                    onClick={() => {
                      onChangePace(pace.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full px-4 py-2.5 text-left flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected ? 'bg-stone-100 font-semibold' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-stone-900">{pace.label}</div>
                      <div className="text-[11px] text-stone-500 leading-tight mt-0.5">{pace.description}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-stone-900 shrink-0 mt-0.5 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Accent Dropdown */}
        <div className="relative flex flex-col gap-1">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-semibold text-stone-800">Accent</span>
            <span className="text-[11px] text-stone-500">Pronunciation</span>
          </div>

          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'accent' ? null : 'accent')}
            className="w-full bg-white hover:bg-stone-50/80 border border-stone-300 hover:border-stone-400 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-stone-900 shadow-2xs flex items-center justify-between gap-2 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <Globe className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">{currentAccentObj.label}</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-stone-400 shrink-0 transition-transform ${
                openDropdown === 'accent' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Accent Dropdown Menu */}
          {openDropdown === 'accent' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-1.5 z-50 max-h-72 overflow-y-auto">
              {STUDIO_ACCENTS.map((accent) => {
                const isSelected = accent.id === selectedAccent;
                return (
                  <button
                    key={accent.id}
                    type="button"
                    onClick={() => {
                      onChangeAccent(accent.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected ? 'bg-stone-100 font-semibold' : 'hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium text-stone-900">{accent.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Example Script Chips (subtle and convenient) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        <span className="text-[11px] text-stone-500 font-medium shrink-0 flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-amber-700" /> Contoh:
        </span>
        {PRESET_SCRIPTS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onChangeText(preset.text)}
            className="px-2.5 py-1 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs border border-stone-300/80 shrink-0 shadow-2xs transition-all cursor-pointer"
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* 
        MAIN TEXTAREA:
        Clean, spacious, empty default state with requested placeholder
      */}
      <div className="flex flex-col gap-1">
        <div className="relative">
          <textarea
            rows={4}
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder="Ketik atau tempel teks naskah di sini..."
            className="w-full bg-white border border-[#e2d9cc] rounded-2xl p-4 text-sm sm:text-base leading-relaxed text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 shadow-2xs resize-y min-h-[120px] transition-all"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
          <span>
            {wordCount} kata • {charCount} karakter
          </span>
          {text && (
            <button
              type="button"
              onClick={() => onChangeText('')}
              className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer text-[11px] flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Bersihkan
            </button>
          )}
        </div>
      </div>

      {/* 
        BOTTOM ACTION BAR (Exact Match to image_f5670e8d.png):
        Left: Speaker Summary Pill (Voice: [Name] • [Style] • [Pace] • [Accent])
        Right: Play Voice Button (Black rounded pill) + Reload button (↺)
      */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 border border-[#e5ddcf] text-xs font-medium text-stone-800 shadow-2xs flex-wrap">
          <Volume2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-bold text-stone-900">Voice: {selectedVoice.name}</span>
          <span className="text-stone-400">•</span>
          <span className="text-stone-600">{selectedStyle}</span>
          <span className="text-stone-400">•</span>
          <span className="text-stone-600">{selectedPace}</span>
          <span className="text-stone-400">•</span>
          <span className="text-stone-600">{selectedAccent}</span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            disabled={isGenerating || !text.trim()}
            onClick={onGenerate}
            className={`px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer ${
              isGenerating || !text.trim()
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-60'
                : 'bg-[#121212] hover:bg-stone-800 text-white shadow-stone-900/10'
            }`}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Mensintesis...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Play Voice</span>
              </>
            )}
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={() => onChangeText('')}
            className="w-9 h-9 rounded-full bg-white hover:bg-stone-100 border border-stone-300 text-stone-600 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
            title="Bersihkan teks"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
