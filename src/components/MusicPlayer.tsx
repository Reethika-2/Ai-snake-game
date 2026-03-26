import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "TRK_01: ALIEN_BREATH",
    url: "https://actions.google.com/sounds/v1/science_fiction/alien_breath.ogg",
    duration: "0:15"
  },
  {
    id: 2,
    title: "TRK_02: SCI_FI_DRONE",
    url: "https://actions.google.com/sounds/v1/science_fiction/sci_fi_drone.ogg",
    duration: "0:22"
  },
  {
    id: 3,
    title: "TRK_03: ENGINE_CORE",
    url: "https://actions.google.com/sounds/v1/science_fiction/spaceship_engine.ogg",
    duration: "0:30"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  // ASCII Progress Bar
  const totalBlocks = 20;
  const filledBlocks = Math.floor((progress / 100) * totalBlocks) || 0;
  const asciiProgress = '[' + '#'.repeat(filledBlocks) + '-'.repeat(Math.max(0, totalBlocks - filledBlocks)) + ']';

  return (
    <div className="w-full border-glitch bg-[#020202] p-8 flex flex-col gap-6 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-magenta)] animate-pulse"></div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex flex-col gap-2">
        <div className="text-xl text-[var(--color-magenta)] tracking-widest uppercase animate-text-jitter">
          {'>'}{'>'} AUDIO_CORE_ACTIVE
        </div>
        <div className="text-3xl glitch text-[var(--color-cyan)] truncate" data-text={currentTrack.title}>
          {currentTrack.title}
        </div>
      </div>

      {/* ASCII Progress Bar */}
      <div className="font-mono text-2xl text-[var(--color-cyan)] tracking-widest whitespace-pre">
        {asciiProgress} {Math.round(progress).toString().padStart(3, '0')}%
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-y-2 border-[#333] py-6">
        <div className="flex items-center gap-6">
          <button onClick={prevTrack} className="text-[var(--color-cyan)] hover:text-[var(--color-magenta)] hover:scale-110 transition-all">
            <SkipBack size={36} />
          </button>
          
          <button 
            onClick={togglePlay} 
            className="w-16 h-16 flex items-center justify-center border-2 border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-magenta)] hover:border-[var(--color-magenta)] hover:text-black transition-all shadow-[0_0_15px_var(--color-cyan)]"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
          </button>
          
          <button onClick={nextTrack} className="text-[var(--color-cyan)] hover:text-[var(--color-magenta)] hover:scale-110 transition-all">
            <SkipForward size={36} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-[var(--color-magenta)] hover:text-[var(--color-cyan)] transition-colors"
          >
            {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-[var(--color-cyan)] bg-[#111] h-2 outline-none appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Track List */}
      <div className="flex flex-col gap-3">
        {TRACKS.map((track, idx) => (
          <div 
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(idx);
              setIsPlaying(true);
            }}
            className={`
              flex justify-between items-center p-3 cursor-pointer text-xl border border-transparent
              ${idx === currentTrackIndex 
                ? 'bg-[var(--color-cyan)] text-black font-bold shadow-[0_0_10px_var(--color-cyan)]' 
                : 'text-gray-500 hover:text-[var(--color-magenta)] hover:border-[var(--color-magenta)]'}
            `}
          >
            <span className="truncate pr-4">{idx === currentTrackIndex ? '> ' : ''}{track.title}</span>
            <span className="opacity-80">{track.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
