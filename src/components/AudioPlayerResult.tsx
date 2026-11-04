import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Download,
  RotateCcw,
  Repeat,
  Volume2,
  VolumeX,
  FileAudio,
  Sparkles
} from 'lucide-react';
import { Voice } from '../data/voices';
import { generateDefaultWavFilename, getSpeechStyleSlug } from '../utils/audio';

interface AudioPlayerResultProps {
  audioUrl: string | null;
  voice: Voice;
  text: string;
  stylePrompt?: string;
  isGenerating: boolean;
  modelName?: string;
  onRegenerate: () => void;
}

export const AudioPlayerResult: React.FC<AudioPlayerResultProps> = ({
  audioUrl,
  voice,
  text,
  stylePrompt,
  isGenerating,
  modelName = 'gemini-3.1-flash-tts-preview',
  onRegenerate,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Editable filename state
  const [fileName, setFileName] = useState(() =>
    generateDefaultWavFilename(voice.name, stylePrompt, voice.styleTag)
  );

  // Update default filename whenever audio or voice or style changes
  useEffect(() => {
    setFileName(generateDefaultWavFilename(voice.name, stylePrompt, voice.styleTag));
  }, [audioUrl, voice.name, stylePrompt, voice.styleTag]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.loop = isLooping;
    }
  }, [audioUrl, playbackRate, isLooping]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleEnded = () => {
    if (!isLooping) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleResetFileName = () => {
    setFileName(generateDefaultWavFilename(voice.name, stylePrompt, voice.styleTag));
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const rawName = fileName.trim();
    const cleanBaseName =
      rawName.replace(/\.wav$/i, '') ||
      generateDefaultWavFilename(voice.name, stylePrompt, voice.styleTag);

    const safeName = cleanBaseName.replace(/[/\\?%*:|"<>]/g, '_');
    const fullFileName = `${safeName}.wav`;

    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = fullFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full bg-[#faf6ee] rounded-3xl border border-[#ebe3d5] p-4 sm:p-5 shadow-xs flex flex-col gap-3 transition-all">
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Top Scrubber & Timers (Matching image_01dbe5f0.png: 0:00 ───── 0:13) */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
          <span>{formatTime(currentTime)}</span>
          <div className="flex-1 mx-3">
            <input
              type="range"
              min={0}
              max={duration || 13}
              step={0.05}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-stone-200/90 rounded-lg appearance-none cursor-pointer accent-stone-800 focus:outline-hidden"
            />
          </div>
          <span>{formatTime(duration || 13)}</span>
        </div>
      </div>

      {/* Main Controls Row (Matching image_01dbe5f0.png) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Left: Play / Replay / Loop / Voice Pill */}
        <div className="flex items-center gap-2">
          {/* Circular Black Play Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
            title={isGenerating ? 'Sedang membuat suara...' : isPlaying ? 'Jeda' : 'Putar Audio'}
          >
            {isGenerating ? (
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Replay */}
          <button
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
                if (!isPlaying) togglePlay();
              }
            }}
            className="w-8 h-8 rounded-lg hover:bg-stone-200/60 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Putar ulang dari awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Loop */}
          <button
            type="button"
            onClick={() => setIsLooping(!isLooping)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              isLooping ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-stone-200/60 text-stone-500'
            }`}
            title="Ulang terus menerus (Loop)"
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>

          {/* Voice Pill with Green Dot (Matching image_01dbe5f0.png: • Kore) */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 border border-stone-200/80 text-stone-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>{voice.name}</span>
          </span>
        </div>

        {/* Center: Oval Capsule with Dots Visualizer (Matching image_01dbe5f0.png) */}
        <div className="hidden md:flex items-center gap-1 px-5 py-2 rounded-full bg-white/70 border border-stone-200/70 shadow-2xs">
          {[...Array(21)].map((_, i) => (
            <span
              key={i}
              className={`w-1 h-1 rounded-full transition-all ${
                isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>

        {/* Right: Speed Pills + Volume + Save As Input Format */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Speed Pills: 0.8x, 1x, 1.2x */}
          <div className="flex items-center gap-1 bg-stone-200/50 p-0.5 rounded-xl text-xs">
            {[0.8, 1, 1.2].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => {
                  setPlaybackRate(rate);
                  if (audioRef.current) audioRef.current.playbackRate = rate;
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  playbackRate === rate
                    ? 'bg-stone-900 text-white font-bold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Volume Control */}
          <div className="hidden lg:flex items-center gap-1 text-stone-600">
            <button
              type="button"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className="p-1 hover:text-stone-900 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                if (audioRef.current) audioRef.current.volume = val;
                setIsMuted(val === 0);
              }}
              className="w-12 h-1 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-stone-800"
            />
          </div>

          {/* Item 3: Format Input Save As (nama profil_Speech Style_ddmmyyy) */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 shadow-2xs focus-within:ring-2 focus-within:ring-amber-500 transition-all">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="nama profil_Speech Style_ddmmyyyy"
                className="w-38 sm:w-48 bg-transparent text-xs font-mono text-stone-800 focus:outline-hidden"
                title="Input nama file untuk disimpan"
              />
              <span className="text-[10px] font-mono text-stone-400 shrink-0 select-none">.wav</span>
            </div>

            {/* Tombol WAV Download (Matching image_01dbe5f0.png) */}
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold border border-stone-300 shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
              title={`Simpan ${fileName.trim().replace(/\.wav$/i, '') || 'Voice'}.wav`}
            >
              <Download className="w-3.5 h-3.5 text-stone-700" />
              <span>WAV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
