import React, { useState, useRef, useEffect } from 'react';
import { Smile, Clock, Globe, ChevronDown, Check } from 'lucide-react';
import {
  STYLE_DIRECTIVES,
  PACE_DIRECTIVES,
  ACCENT_DIRECTIVES
} from '../data/voices';

interface VoiceTuningControlsProps {
  selectedStyleId: string;
  onSelectStyle: (id: string) => void;
  selectedPaceId: string;
  onSelectPace: (id: string) => void;
  selectedAccentId: string;
  onSelectAccent: (id: string) => void;
  disabled?: boolean;
}

export const VoiceTuningControls: React.FC<VoiceTuningControlsProps> = ({
  selectedStyleId,
  onSelectStyle,
  selectedPaceId,
  onSelectPace,
  selectedAccentId,
  onSelectAccent,
  disabled = false,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'style' | 'pace' | 'accent' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStyle = STYLE_DIRECTIVES.find((s) => s.id === selectedStyleId) || STYLE_DIRECTIVES[0];
  const currentPace = PACE_DIRECTIVES.find((p) => p.id === selectedPaceId) || PACE_DIRECTIVES[1];
  const currentAccent = ACCENT_DIRECTIVES.find((a) => a.id === selectedAccentId) || ACCENT_DIRECTIVES[1];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="voice-tuning-controls"
      className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 relative"
    >
      {/* 1. Style Dropdown */}
      <div className="relative flex flex-col">
        <label
          htmlFor="style-dropdown-btn"
          className="text-stone-700 font-medium text-sm mb-1.5 flex items-center justify-between"
        >
          <span>Style</span>
          <span className="text-[11px] text-stone-500 font-normal">Inflection</span>
        </label>
        <button
          id="style-dropdown-btn"
          type="button"
          disabled={disabled}
          onClick={() => setOpenDropdown(openDropdown === 'style' ? null : 'style')}
          className={`w-full h-11 px-3.5 rounded-xl border transition-all text-left flex items-center justify-between gap-2 text-sm font-medium ${
            openDropdown === 'style'
              ? 'bg-white border-stone-800 shadow-sm ring-2 ring-stone-900/10'
              : 'bg-white hover:bg-stone-50/80 border-stone-300/80 text-stone-800'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-2 truncate">
            <Smile className="w-4 h-4 text-stone-600 shrink-0" />
            <span className="truncate">{currentStyle.name}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
              openDropdown === 'style' ? 'rotate-180 text-stone-900' : ''
            }`}
          />
        </button>

        {openDropdown === 'style' && (
          <div
            id="style-dropdown-menu"
            className="absolute top-full left-0 mt-1.5 w-full sm:w-84 max-w-[92vw] bg-white rounded-2xl border border-stone-200 shadow-xl p-1.5 z-40 max-h-[380px] overflow-y-auto space-y-1 animate-in fade-in-50 duration-150"
          >
            {STYLE_DIRECTIVES.map((item) => {
              const isSelected = item.id === currentStyle.id;
              return (
                <button
                  key={item.id}
                  id={`select-style-${item.id}`}
                  type="button"
                  onClick={() => {
                    onSelectStyle(item.id);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-colors cursor-pointer flex flex-col gap-0.5 ${
                    isSelected
                      ? 'bg-stone-100 text-stone-900'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 text-sm">{item.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-stone-800 shrink-0" />}
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">{item.description}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Pace Dropdown */}
      <div className="relative flex flex-col">
        <label
          htmlFor="pace-dropdown-btn"
          className="text-stone-700 font-medium text-sm mb-1.5 flex items-center justify-between"
        >
          <span>Pace</span>
          <span className="text-[11px] text-stone-500 font-normal">Cadence</span>
        </label>
        <button
          id="pace-dropdown-btn"
          type="button"
          disabled={disabled}
          onClick={() => setOpenDropdown(openDropdown === 'pace' ? null : 'pace')}
          className={`w-full h-11 px-3.5 rounded-xl border transition-all text-left flex items-center justify-between gap-2 text-sm font-medium ${
            openDropdown === 'pace'
              ? 'bg-white border-stone-800 shadow-sm ring-2 ring-stone-900/10'
              : 'bg-white hover:bg-stone-50/80 border-stone-300/80 text-stone-800'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-2 truncate">
            <Clock className="w-4 h-4 text-stone-600 shrink-0" />
            <span className="truncate">{currentPace.name}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
              openDropdown === 'pace' ? 'rotate-180 text-stone-900' : ''
            }`}
          />
        </button>

        {openDropdown === 'pace' && (
          <div
            id="pace-dropdown-menu"
            className="absolute top-full left-0 mt-1.5 w-full sm:w-80 max-w-[92vw] bg-white rounded-2xl border border-stone-200 shadow-xl p-1.5 z-40 max-h-[380px] overflow-y-auto space-y-1 animate-in fade-in-50 duration-150"
          >
            {PACE_DIRECTIVES.map((item) => {
              const isSelected = item.id === currentPace.id;
              return (
                <button
                  key={item.id}
                  id={`select-pace-${item.id}`}
                  type="button"
                  onClick={() => {
                    onSelectPace(item.id);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-colors cursor-pointer flex flex-col gap-0.5 ${
                    isSelected
                      ? 'bg-stone-100 text-stone-900'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 text-sm">{item.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-stone-800 shrink-0" />}
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">{item.description}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Accent Dropdown */}
      <div className="relative flex flex-col">
        <label
          htmlFor="accent-dropdown-btn"
          className="text-stone-700 font-medium text-sm mb-1.5 flex items-center justify-between"
        >
          <span>Accent</span>
          <span className="text-[11px] text-stone-500 font-normal">Pronunciation</span>
        </label>
        <button
          id="accent-dropdown-btn"
          type="button"
          disabled={disabled}
          onClick={() => setOpenDropdown(openDropdown === 'accent' ? null : 'accent')}
          className={`w-full h-11 px-3.5 rounded-xl border transition-all text-left flex items-center justify-between gap-2 text-sm font-medium ${
            openDropdown === 'accent'
              ? 'bg-white border-stone-800 shadow-sm ring-2 ring-stone-900/10'
              : 'bg-white hover:bg-stone-50/80 border-stone-300/80 text-stone-800'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-2 truncate">
            <Globe className="w-4 h-4 text-stone-600 shrink-0" />
            <span className="truncate">{currentAccent.name}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
              openDropdown === 'accent' ? 'rotate-180 text-stone-900' : ''
            }`}
          />
        </button>

        {openDropdown === 'accent' && (
          <div
            id="accent-dropdown-menu"
            className="absolute top-full left-0 sm:right-0 sm:left-auto mt-1.5 w-full sm:w-64 max-w-[92vw] bg-white rounded-2xl border border-stone-200 shadow-xl p-1.5 z-40 max-h-[380px] overflow-y-auto space-y-0.5 animate-in fade-in-50 duration-150"
          >
            {ACCENT_DIRECTIVES.map((item) => {
              const isSelected = item.id === currentAccent.id;
              return (
                <button
                  key={item.id}
                  id={`select-accent-${item.id}`}
                  type="button"
                  onClick={() => {
                    onSelectAccent(item.id);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-between text-sm font-medium ${
                    isSelected
                      ? 'bg-stone-100 text-stone-900'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="truncate">{item.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-stone-800 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
