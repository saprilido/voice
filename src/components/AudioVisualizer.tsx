import React from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  isLoading: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, isLoading }) => {
  return (
    <div
      id="audio-visualizer-container"
      className="flex items-center justify-center gap-[3px] h-10 px-4 py-2 rounded-full bg-stone-100/80 border border-stone-200/80 backdrop-blur-sm select-none"
      title={isPlaying ? 'Voice audio active' : 'Audio visualizer'}
    >
      {Array.from({ length: 28 }).map((_, r) => {
        const i = Math.abs(r - 14) / 14;
        const a = Math.max(12, Math.floor((1 - i * 0.6) * 24));
        const o = (r % 7) * 0.09;
        return (
          <span
            key={r}
            className={`w-[2.5px] rounded-full transition-all duration-300 ${
              isPlaying
                ? 'bg-stone-700 animate-pulse'
                : isLoading
                ? 'bg-amber-600/60 animate-bounce'
                : 'bg-stone-300'
            }`}
            style={{
              height: isPlaying
                ? `${Math.max(6, Math.sin(r * 0.4) * 12 + a)}px`
                : isLoading
                ? `${8 + (r % 4) * 4}px`
                : '4px',
              animationDuration: isPlaying ? `${0.6 + (r % 5) * 0.15}s` : '1.2s',
              animationDelay: `${o}s`,
            }}
          />
        );
      })}
    </div>
  );
};
