import React from 'react';
import { Mic, Headphones, Sparkles } from 'lucide-react';
import { Voice } from '../data/voices';

interface HeaderProps {
  selectedVoice?: Voice;
}

export const Header: React.FC<HeaderProps> = ({ selectedVoice }) => {
  const voiceName = selectedVoice?.name || 'Aoede';

  return (
    <header className="w-full bg-[#fbf9f4]/95 backdrop-blur-md border-b border-[#e7e0d3] sticky top-0 z-40 transition-all">
      {/* Ramping / Slim Container matching image_f5670e8d.png */}
      <div className="max-w-[940px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center font-extrabold text-lg shadow-sm border border-stone-800 shrink-0">
            <Mic className="w-5 h-5" />
          </div>

          <div>
            <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 flex items-center gap-1.5">
              <span className="text-amber-600 font-bold">Voice Generator</span>
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              Generator Voice Over
            </p>
          </div>
        </div>

        {/* Right Badges & Download (Matching Screenshot) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Model Pill */}
          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>gemini-3.1-flash-tts-preview</span>
          </div>

          {/* Active Voice Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-300 shadow-2xs">
            <Headphones className="w-3.5 h-3.5 text-stone-600" />
            <span>{voiceName} Voice</span>
          </div>
        </div>
      </div>
    </header>
  );
};
