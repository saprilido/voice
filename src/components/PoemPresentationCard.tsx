import React, { useState, useEffect } from 'react';
import { Copy, Check, Volume2, Sparkles, AudioLines, Pause, Play, RotateCcw } from 'lucide-react';
import { VoiceTuningControls } from './VoiceTuningControls';
import {
  STYLE_DIRECTIVES,
  PACE_DIRECTIVES,
  ACCENT_DIRECTIVES
} from '../data/voices';

interface PoemPresentationCardProps {
  lines: string[];
  title?: string;
  subtitle?: string;
  isPlaying: boolean;
  isLoading: boolean;
  activeLineIndex?: number;
  onPlayOrPause: () => void;
  onGenerateSpeech: () => void;
  hasGeneratedAudio: boolean;
  selectedVoice: string;
  selectedStyleId: string;
  onSelectStyle: (id: string) => void;
  selectedPaceId: string;
  onSelectPace: (id: string) => void;
  selectedAccentId: string;
  onSelectAccent: (id: string) => void;
  onEditLines?: (lines: string[]) => void;
}

export const PoemPresentationCard: React.FC<PoemPresentationCardProps> = ({
  lines,
  title = 'Text Input',
  subtitle = 'Masukkan teks',
  isPlaying,
  isLoading,
  onPlayOrPause,
  onGenerateSpeech,
  hasGeneratedAudio,
  selectedVoice,
  selectedStyleId,
  onSelectStyle,
  selectedPaceId,
  onSelectPace,
  selectedAccentId,
  onSelectAccent,
  onEditLines,
}) => {
  const [copied, setCopied] = useState(false);
  const [textValue, setTextValue] = useState(lines.join('\n') || 'Input teks di sini');

  const currentStyle = STYLE_DIRECTIVES.find((s) => s.id === selectedStyleId) || STYLE_DIRECTIVES[0];
  const currentPace = PACE_DIRECTIVES.find((p) => p.id === selectedPaceId) || PACE_DIRECTIVES[1];
  const currentAccent = ACCENT_DIRECTIVES.find((a) => a.id === selectedAccentId) || ACCENT_DIRECTIVES[1];

  useEffect(() => {
    if (lines && lines.length > 0) {
      setTextValue(lines.join('\n'));
    }
  }, [lines]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard copy failed', err);
    }
  };

  const handleChangeText = (val: string) => {
    setTextValue(val);
    if (onEditLines) {
      onEditLines(val.split('\n'));
    }
  };

  return (
    <div
      id="poem-presentation-card"
      className="relative w-full rounded-2xl bg-gradient-to-b from-[#fbf8f3] via-[#f7f2ea] to-[#f4eee4] border border-[#e5ded4] p-6 sm:p-10 shadow-[0_4px_24px_rgba(68,52,43,0.04)] transition-all overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-amber-100/40 to-transparent pointer-events-none rounded-full blur-2xl" />

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#e8e0d5]">
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-900/70">
            {subtitle}
          </span>
          <h2 className="text-xl sm:text-2xl font-serif-literary font-medium text-stone-800">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="copy-text-btn"
            onClick={handleCopy}
            title="Copy text to clipboard"
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-stone-600 hover:text-stone-900 bg-white/70 hover:bg-white border border-stone-200/80 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tuning Controls */}
      <div className="pt-4 pb-2">
        <VoiceTuningControls
          selectedStyleId={selectedStyleId}
          onSelectStyle={onSelectStyle}
          selectedPaceId={selectedPaceId}
          onSelectPace={onSelectPace}
          selectedAccentId={selectedAccentId}
          onSelectAccent={onSelectAccent}
          disabled={isLoading}
        />
      </div>

      {/* Main Textarea */}
      <div className="py-4 sm:py-6 min-h-[160px] w-full">
        <div className="w-full space-y-3">
          <textarea
            id="poem-edit-textarea"
            value={textValue}
            onChange={(e) => handleChangeText(e.target.value)}
            rows={5}
            className="w-full p-4 sm:p-5 rounded-xl border border-stone-300/80 bg-white/95 text-stone-800 font-serif-literary text-lg sm:text-xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-700/40 shadow-inner resize-y transition-all"
            placeholder="Input teks di sini"
          />

          {isPlaying && (
            <div className="p-3 rounded-lg bg-amber-900/5 border border-amber-900/10 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Speaking text with Gemini TTS...
              </span>
              <span className="text-stone-600 font-mono text-[11px] truncate">
                {selectedVoice} • {currentStyle.name} • {currentPace.name} • {currentAccent.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-6 border-t border-[#e8e0d5] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Selected Config Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200/60 border border-stone-300/50 text-stone-800 font-medium">
            <Volume2 className="w-3.5 h-3.5 text-amber-800" />
            <span>Voice: {selectedVoice}</span>
          </div>
          <span className="text-stone-400">•</span>
          <span className="font-medium text-stone-700">{currentStyle.name}</span>
          <span className="text-stone-400">•</span>
          <span className="font-medium text-stone-700">{currentPace.name}</span>
          <span className="text-stone-400">•</span>
          <span className="font-medium text-stone-700">{currentAccent.name}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
          {hasGeneratedAudio ? (
            <button
              type="button"
              id="play-pause-generated-audio-btn"
              onClick={onPlayOrPause}
              disabled={isLoading}
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm cursor-pointer ${
                isPlaying
                  ? 'bg-amber-900 text-amber-50 hover:bg-amber-950'
                  : 'bg-stone-900 text-stone-50 hover:bg-stone-800'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Reading</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Play Voice</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              id="convert-tts-primary-btn"
              onClick={onGenerateSpeech}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Generating Gemini Speech...</span>
                </>
              ) : (
                <>
                  <AudioLines className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span>Convert Text to Speech</span>
                </>
              )}
            </button>
          )}

          {hasGeneratedAudio && (
            <button
              type="button"
              id="regenerate-tts-btn"
              onClick={onGenerateSpeech}
              disabled={isLoading}
              title="Regenerate with current voice/style"
              className="p-2.5 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
