/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [booting, setBooting] = useState(true);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  useEffect(() => {
    const logs = [
      "INIT_NEURO_KERNEL_V9.9.9...",
      "MOUNTING /dev/sda1... OK",
      "LOADING AUDIO_SUBSYSTEM... OK",
      "BYPASSING SECURITY PROTOCOLS... [WARNING: ILLEGAL OPERATION]",
      "ESTABLISHING NEURAL LINK...",
      "ACCESS GRANTED."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setBootLogs(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 800);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  if (booting) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-cyan)] font-mono p-8 crt relative">
        <div className="noise"></div>
        <div className="flex flex-col gap-2 text-2xl">
          {bootLogs.map((log, idx) => (
            <div key={idx} className={idx === bootLogs.length - 1 ? "text-[var(--color-magenta)] animate-text-jitter" : ""}>
              {'>'} {log}
            </div>
          ))}
          <div className="animate-pulse">{'>'} _</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-cyan)] font-mono relative overflow-hidden flex flex-col crt">
      {/* Background Effects */}
      <div className="noise"></div>
      <div className="crt-flicker"></div>
      
      {/* Header */}
      <header className="w-full p-6 border-b-4 border-[var(--color-magenta)] flex justify-between items-end z-10 bg-black/80 shadow-[0_4px_20px_var(--color-magenta)]">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold glitch" data-text="NEURO_SNAKE_OS">
            NEURO_SNAKE_OS
          </h1>
          <p className="text-[var(--color-magenta)] text-xl tracking-[0.3em] mt-2 animate-pulse">
            // UNAUTHORIZED_ACCESS_DETECTED
          </p>
        </div>
        <div className="hidden md:block text-right text-lg opacity-80">
          <p className="animate-text-jitter">SYS.MEM: 0x00FF4A</p>
          <p className="text-red-500">NET.STAT: SEVERED</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-12 p-4 md:p-8 z-10 relative">
        
        {/* Left/Top Panel: Music Player */}
        <div className="w-full xl:w-1/3 max-w-lg flex-shrink-0">
          <MusicPlayer />
        </div>

        {/* Center/Right Panel: Snake Game */}
        <div className="w-full xl:w-auto flex-1 flex justify-center">
          <SnakeGame />
        </div>

      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-lg opacity-60 z-10 border-t-2 border-[var(--color-cyan)] bg-black/90">
        TERMINAL_ID: 8472-A // END_OF_LINE
      </footer>
    </div>
  );
}
