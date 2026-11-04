import React from 'react';
import { Play, Square, Check } from 'lucide-react';
import { Voice } from '../data/voices';

interface VoiceCardProps {
  voice: Voice;
  isSelected: boolean;
  isPlaying: boolean;
  sampleLang: 'id' | 'en';
  onSelect: (voice: Voice) => void;
  onPlayToggle: (voice: Voice) => void;
}

export const VoiceCard: React.FC<VoiceCardProps> = ({
  voice,
  isSelected,
  isPlaying,
  sampleLang,
  onSelect,
  onPlayToggle,
}) => {
  // Extract concise trait keyword for the top-right badge, e.g. "Breezy", "Soft", "Bright", "Warm"
  const traitKeyword = voice.trait.split('&')[0].trim();

  return (
    <div
      onClick={() => onSelect(voice)}
      className={`group relative flex flex-col justify-between rounded-2xl p-4 sm:p-4.5 transition-all duration-200 cursor-pointer select-none text-left border ${
        isSelected
          ? 'bg-[#121212] text-white border-stone-800 shadow-xl ring-1 ring-amber-500/30'
          : 'bg-white hover:bg-stone-50/70 text-stone-800 border-stone-200/90 hover:border-stone-300 hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Header: Voice Name & Trait Outline Pill */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3
              className={`font-bold text-base tracking-tight truncate ${
                isSelected ? 'text-white' : 'text-stone-900'
              }`}
            >
              {voice.name}
            </h3>
            {isSelected && (
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </div>

          {/* Top Right Trait Pill Badge */}
          <span
            className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              isSelected
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-amber-50 text-amber-700 border-amber-300/80'
            }`}
          >
            {traitKeyword}
          </span>
        </div>

        {/* Subtitle: Style Tag (e.g. Soft Female) & Pitch Badge */}
        <div className="flex items-center gap-2 mt-1 mb-2.5">
          <span className={`text-xs font-medium ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>
            {voice.styleTag}
          </span>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
              isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'
            }`}
          >
            {voice.pitch}
          </span>
        </div>

        {/* Description */}
        <p
          className={`text-xs leading-relaxed line-clamp-2 mb-4 font-normal ${
            isSelected ? 'text-stone-300' : 'text-stone-600'
          }`}
          title={voice.description}
        >
          {voice.description}
        </p>
      </div>

      {/* Card Footer: Play Sample & Selection indicator */}
      <div className="pt-3 border-t flex items-center justify-between gap-2 border-dashed border-stone-200/80 dark:border-stone-800">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPlayToggle(voice);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
              : isSelected
              ? 'bg-stone-800 hover:bg-stone-700 text-white font-semibold'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold border border-stone-200/80'
          }`}
          title={`Putar sampel suara ${voice.name}`}
        >
          {isPlaying ? (
            <>
              <Square className="w-3 h-3 fill-current" />
              <span>Hentikan</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current text-amber-500" />
              <span>Play Sample</span>
            </>
          )}
        </button>

        {/* Selection Indicator */}
        <div className="flex items-center gap-1 text-xs">
          {isSelected ? (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Selected
            </span>
          ) : (
            <span className="text-stone-400 group-hover:text-stone-700 font-medium transition-colors">
              Pilih suara →
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
