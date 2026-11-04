import React from 'react';
import { Feather, AudioLines, Headphones, Key } from 'lucide-react';

interface HeaderProps {
  selectedVoiceName: string;
  userApiKey: string;
  onOpenApiKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedVoiceName,
  userApiKey,
  onOpenApiKeyModal,
}) => {
  return (
    <header
      id="app-header"
      className="w-full border-b border-[#ece4d9] bg-[#faf7f2]/95 backdrop-blur-md sticky top-0 z-30 shadow-[0_2px_12px_rgba(44,37,35,0.04)]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-200 flex items-center justify-center shadow-xs shrink-0">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-stone-900 font-serif-literary">
              Voice Generator
            </h1>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              Generator voice over
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Custom API Key Button */}
          <button
            type="button"
            id="api-key-config-btn"
            onClick={onOpenApiKeyModal}
            title={
              userApiKey
                ? 'Menggunakan Gemini API Key pribadi (Klik untuk ubah)'
                : 'Menggunakan API Key bawaan server (Klik untuk masukkan key Anda)'
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shadow-2xs ${
              userApiKey
                ? 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 ring-1 ring-emerald-400/40'
                : 'bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 hover:text-stone-900'
            }`}
          >
            <Key className={`w-3.5 h-3.5 ${userApiKey ? 'text-emerald-700' : 'text-stone-500'}`} />
            <span className="hidden xs:inline">API Key:</span>
            {userApiKey ? (
              <span className="flex items-center gap-1 font-semibold text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Pribadi
              </span>
            ) : (
              <span className="text-stone-500 font-semibold">Bawaan</span>
            )}
          </button>

          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-900/10 text-amber-900 border border-amber-900/15">
            <AudioLines className="w-3.5 h-3.5" />
            gemini-3.1-flash-tts-preview
          </span>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-200/70 text-stone-700">
            <Headphones className="w-3.5 h-3.5" />
            <span>{selectedVoiceName} Voice</span>
          </div>
        </div>
      </div>
    </header>
  );
};
