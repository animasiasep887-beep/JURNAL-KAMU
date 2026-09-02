import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Volume2, Plus, Sparkles } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynth';

export const RestTimerWidget: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [totalSeconds, setTotalSeconds] = useState<number>(60);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      try {
        // Play beep sound
        audioSynth.playNotification();
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startRest = (secs: number) => {
    setTotalSeconds(secs);
    setTimeLeft(secs);
    setIsRunning(true);
  };

  const formatSecs = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
          isRunning ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          <Timer className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-200">Rest Timer Antar Set</span>
            {isRunning && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                ISTIRAHAT
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">Jeda waktu istirahat optimal untuk recovery otot.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick presets */}
        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono font-bold">
          {[30, 60, 90, 120].map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => startRest(sec)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                isRunning && totalSeconds === sec
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>

        {/* Current Timer Display & Control */}
        {timeLeft > 0 && (
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-sm font-black font-mono text-amber-400">{formatSecs(timeLeft)}</span>
            <button
              type="button"
              onClick={() => setIsRunning((prev) => !prev)}
              className="text-slate-400 hover:text-white"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(0);
              }}
              className="text-slate-500 hover:text-rose-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
