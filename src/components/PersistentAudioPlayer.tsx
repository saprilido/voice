import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  Volume2,
  VolumeX,
  Download,
  Sparkles,
  FileAudio,
  RotateCcw as ResetIcon
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { generateDefaultWavFilename } from '../utils/audio';

interface PersistentAudioPlayerProps {
  audioUrl: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  onDownloadWav: (customFileName?: string) => void;
  voiceName: string;
  voiceGenderHint?: string;
  selectedStyleName?: string;
  isLooping: boolean;
  onToggleLoop: () => void;
  currentTitle?: string;
}

export const PersistentAudioPlayer: React.FC<PersistentAudioPlayerProps> = ({
  audioUrl,
  isPlaying,
  isLoading,
  onTogglePlay,
  onReplay,
  currentTime,
  duration,
  onSeek,
  playbackRate,
  onChangePlaybackRate,
  volume,
  onChangeVolume,
  onDownloadWav,
  voiceName,
  voiceGenderHint,
  selectedStyleName,
  isLooping,
  onToggleLoop,
  currentTitle = 'Text Input',
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const previousVolume = useRef(volume);

  // Custom .wav file naming feature: nama karakter_style_ddmmyyy (e.g. Achird_FriendlyMale_04112026)
  const getAutoDefaultFilename = () => {
    return generateDefaultWavFilename(voiceName, voiceGenderHint, selectedStyleName);
  };

  const [customFileName, setCustomFileName] = useState<string>(getAutoDefaultFilename);

  // Update default name whenever voice, gender hint, or style changes
  useEffect(() => {
    setCustomFileName(getAutoDefaultFilename());
  }, [voiceName, voiceGenderHint, selectedStyleName]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      onChangeVolume(previousVolume.current || 0.8);
    } else {
      previousVolume.current = volume;
      setIsMuted(true);
      onChangeVolume(0);
    }
  };

  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleDownload = () => {
    if (!audioUrl) return;
    const cleanName =
      customFileName.trim().replace(/\.wav$/i, '') ||
      getAutoDefaultFilename();
    onDownloadWav(cleanName);
  };

  return (
    <div
      id="persistent-audio-player-bar"
      className={`w-full rounded-2xl bg-[#f4eee4]/95 border border-[#e0d6c9] p-4 sm:p-5 backdrop-blur-md shadow-sm transition-all ${
        !audioUrl && !isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col gap-3">
        {/* Scrubber Row */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs font-mono text-stone-500 min-w-[34px] text-right select-none">
            {formatTime(currentTime)}
          </span>

          <div className="relative flex-1 flex items-center h-4 group cursor-pointer">
            <div className="w-full h-1.5 bg-stone-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-800 rounded-full transition-all duration-100"
                style={{ width: `${percent}%` }}
              />
            </div>
            <input
              id="audio-scrubber-range"
              type="range"
              min={0}
              max={duration || 1}
              step={0.05}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              disabled={!audioUrl || isLoading}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          <span className="text-xs font-mono text-stone-500 min-w-[34px] select-none">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Left Controls: Play, Replay, Loop, Voice Pill */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="player-play-btn"
              onClick={onTogglePlay}
              disabled={!audioUrl || isLoading}
              className="w-10 h-10 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-50 flex items-center justify-center transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              id="player-replay-btn"
              onClick={onReplay}
              disabled={!audioUrl || isLoading}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 transition-colors cursor-pointer disabled:opacity-40"
              title="Replay from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="player-loop-toggle"
              onClick={onToggleLoop}
              disabled={!audioUrl || isLoading}
              className={`p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-40 ${
                isLooping
                  ? 'bg-amber-800/15 text-amber-900 font-semibold'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
              }`}
              title={isLooping ? 'Disable loop' : 'Enable continuous loop'}
            >
              <Repeat className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-1.5 ml-2 text-xs text-stone-600 bg-stone-200/60 px-2.5 py-1 rounded-full border border-stone-300/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>{voiceName}</span>
            </div>
          </div>

          {/* Center: Audio Waveform Visualizer */}
          <div className="hidden md:flex items-center justify-center">
            <AudioVisualizer isPlaying={isPlaying} isLoading={isLoading} />
          </div>

          {/* Right Controls: Speed, Volume, and WAV Download Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Speed pills */}
            <div className="flex items-center bg-stone-200/60 p-0.5 rounded-lg text-[11px] font-medium text-stone-600">
              {[0.8, 1, 1.2].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  id={`speed-btn-${rate}x`}
                  onClick={() => onChangePlaybackRate(rate)}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    playbackRate === rate
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'hover:text-stone-900'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Volume slider */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleMute}
                className="p-1.5 text-stone-600 hover:text-stone-900 cursor-pointer transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                id="player-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setIsMuted(val === 0);
                  onChangeVolume(val);
                }}
                className="w-16 h-1 bg-stone-300 rounded-lg cursor-pointer accent-stone-800"
                title="Voice Volume"
              />
            </div>

            {/* Download Button */}
            <button
              type="button"
              id="download-wav-btn"
              onClick={handleDownload}
              disabled={!audioUrl || isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900/10 hover:bg-stone-900/15 text-stone-800 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title={`Download audio as ${customFileName.trim().replace(/\.wav$/i, '')}.wav`}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WAV</span>
            </button>
          </div>
        </div>

        {/* Feature #1: Rename Box on Audio Player Card for save as .wav (nama karakter_style_ddmmyyyy) */}
        <div
          id="wav-rename-section"
          className="mt-1 pt-2.5 border-t border-stone-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-stone-100/70 p-2.5 rounded-xl text-xs"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="font-semibold text-stone-700 shrink-0 flex items-center gap-1.5">
              <FileAudio className="w-3.5 h-3.5 text-amber-800" />
              <span>Save As (.wav):</span>
            </span>

            <div className="relative flex-1 flex items-center min-w-0">
              <input
                id="custom-wav-filename-input"
                type="text"
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
                placeholder="nama karakter_style_ddmmyyy"
                className="w-full px-2.5 py-1.5 pr-14 rounded-lg bg-white border border-stone-300 text-stone-900 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-stone-400 shadow-2xs"
                title="Format: nama karakter_style_ddmmyyy"
              />
              <span className="absolute right-2 text-[11px] font-mono font-bold text-stone-400 pointer-events-none select-none">
                .wav
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end shrink-0">
            <button
              type="button"
              id="reset-wav-filename-btn"
              onClick={() => setCustomFileName(getAutoDefaultFilename())}
              className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer px-1 transition-colors"
              title="Reset ke format default: nama karakter_style_ddmmyyy"
            >
              <ResetIcon className="w-3 h-3" />
              <span>Reset Default</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!audioUrl || isLoading}
              className="text-[11px] font-medium px-3 py-1 rounded-lg bg-stone-900 text-stone-50 hover:bg-stone-800 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Unduh WAV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
