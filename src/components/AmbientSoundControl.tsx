import React, { useState } from 'react';
import { Sparkles, CloudRain, Flame, VolumeX } from 'lucide-react';
import { ambientEngine, AmbientSoundMode } from '../utils/audio';

export const AmbientSoundControl: React.FC = () => {
  const [mode, setMode] = useState<AmbientSoundMode>('none');
  const [volume, setVolume] = useState<number>(0.12);

  const handleToggleMode = (newMode: AmbientSoundMode) => {
    if (mode === newMode) {
      ambientEngine.setMode('none');
      setMode('none');
    } else {
      ambientEngine.setVolume(volume);
      ambientEngine.setMode(newMode);
      setMode(newMode);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    ambientEngine.setVolume(newVol);
  };

  return (
    <div
      id="ambient-sound-control"
      className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-stone-100/70 border border-stone-200/70 text-xs text-stone-600"
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-stone-700 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-700/70" />
          Ambient Resonance:
        </span>
        <span className="text-[11px] text-stone-500 hidden sm:inline">
          Subtle organic backdrop for deep listening
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          id="ambient-rain-btn"
          onClick={() => handleToggleMode('rain')}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
            mode === 'rain'
              ? 'bg-amber-900 text-amber-50 shadow-xs'
              : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200'
          }`}
          title="Gentle rain soundscape"
        >
          <CloudRain className="w-3.5 h-3.5" />
          <span>Summer Rain</span>
        </button>

        <button
          type="button"
          id="ambient-hearth-btn"
          onClick={() => handleToggleMode('hearth')}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
            mode === 'hearth'
              ? 'bg-amber-900 text-amber-50 shadow-xs'
              : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200'
          }`}
          title="Cozy hearthfire soundscape"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Warm Hearth</span>
        </button>

        {mode !== 'none' && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-stone-300/60">
            <input
              id="ambient-volume-slider"
              type="range"
              min="0.02"
              max="0.35"
              step="0.01"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 bg-stone-300 rounded-lg cursor-pointer accent-amber-900"
              title="Ambient Volume"
            />
            <button
              type="button"
              onClick={() => {
                ambientEngine.setMode('none');
                setMode('none');
              }}
              className="p-1 hover:text-stone-900 cursor-pointer"
              title="Mute ambient sound"
            >
              <VolumeX className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
