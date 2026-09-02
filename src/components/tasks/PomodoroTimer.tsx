import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { triggerConfetti } from '../../utils/confetti';
import { audioSynth } from '../../utils/audioSynth';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  CheckCircle2,
  CloudRain,
  Coffee,
  Headphones,
  Music,
  Bell,
} from 'lucide-react';

export const PomodoroTimer: React.FC = () => {
  const { tasks, logPomodoroSession } = useData();
  const { showToast } = useNotification();

  const [mode, setMode] = useState<'focus' | 'short_break' | 'long_break'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);

  // Soundscape state
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'lofi' | 'binaural'>('none');
  const ambientAudioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodesRef = useRef<any[]>([]);

  // Duration settings
  const durations = {
    focus: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  const switchMode = (newMode: 'focus' | 'short_break' | 'long_break') => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsRunning(false);
  };

  // Timer countdown
  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleSessionComplete();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Dynamic Browser Tab Title Effect
  useEffect(() => {
    if (isRunning) {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      const timeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;
      const modeLabel = mode === 'focus' ? 'Fokus Kerja' : 'Istirahat';
      document.title = `⏱️ (${timeFormatted}) ${modeLabel} • Life OS`;
    } else {
      document.title = 'Personal Life OS & AI Partner';
    }

    return () => {
      document.title = 'Personal Life OS & AI Partner';
    };
  }, [isRunning, timeLeft, mode]);

  // Handle session finished
  const handleSessionComplete = () => {
    try {
      audioSynth.playSuccess();
    } catch (e) {}

    if (mode === 'focus') {
      const task = tasks.find((t) => t.id === selectedTaskId);
      const taskTitle = task ? task.title : 'Sesi Fokus Mandiri';
      logPomodoroSession({
        taskTitle,
        durationMinutes: 25,
        type: 'focus',
      });
      setCompletedSessionsCount((prev) => prev + 1);
      triggerConfetti();
      showToast(`🎯 Sesi Fokus Selesai! Kerja bagus! Ambil istirahat sejenak 5 menit.`, 'success');
      switchMode('short_break');
    } else {
      showToast(`☕ Waktu istirahat selesai! Siap untuk sesi fokus berikutnya?`, 'info');
      switchMode('focus');
    }
  };

  // Web Audio Synth Ambient Sound Engine
  const startAmbientSound = (type: 'rain' | 'lofi' | 'binaural') => {
    stopAmbientSound();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      ambientAudioCtxRef.current = ctx;

      if (type === 'binaural') {
        // Binaural Alpha Beats (210Hz + 220Hz -> 10Hz beat)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc1.frequency.setValueAtTime(216, ctx.currentTime);
        osc2.frequency.setValueAtTime(226, ctx.currentTime);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        ambientNodesRef.current = [osc1, osc2, gain];
      } else if (type === 'rain') {
        // Pink/Brown noise generator simulation for gentle rainfall
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.95 * b1 + white * 0.05;
          b2 = 0.9 * b2 + white * 0.05;
          output[i] = (b0 + b1 + b2) * 0.15;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        whiteNoise.start();
        ambientNodesRef.current = [whiteNoise, filter, gain];
      } else if (type === 'lofi') {
        // Lofi chord drone generator
        const freqs = [130.81, 164.81, 196.0, 246.94]; // Cmaj7 warm chord
        const nodes: any[] = [];
        const mainGain = ctx.createGain();
        mainGain.gain.setValueAtTime(0.03, ctx.currentTime);

        freqs.forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          osc.connect(mainGain);
          osc.start();
          nodes.push(osc);
        });

        mainGain.connect(ctx.destination);
        nodes.push(mainGain);
        ambientNodesRef.current = nodes;
      }
      setAmbientSound(type);
    } catch (e) {
      console.warn('Ambient audio error:', e);
    }
  };

  const stopAmbientSound = () => {
    try {
      ambientNodesRef.current.forEach((n) => {
        if (n.stop) n.stop();
        if (n.disconnect) n.disconnect();
      });
      if (ambientAudioCtxRef.current && ambientAudioCtxRef.current.state !== 'closed') {
        ambientAudioCtxRef.current.close();
      }
    } catch (e) {}
    ambientNodesRef.current = [];
    ambientAudioCtxRef.current = null;
    setAmbientSound('none');
  };

  const formatMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-slate-100 text-base sm:text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Focus & Pomodoro Timer</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
              {completedSessionsCount} Sesi Selesai
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tingkatkan konsentrasi belajar & kerja dengan ritme 25m fokus + 5m istirahat.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => switchMode('focus')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              mode === 'focus' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fokus (25m)
          </button>
          <button
            onClick={() => switchMode('short_break')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              mode === 'short_break' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Break (5m)
          </button>
          <button
            onClick={() => switchMode('long_break')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              mode === 'long_break' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Long (15m)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Big Timer Display */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center p-6 bg-slate-950/60 border border-slate-800/80 rounded-3xl space-y-5">
          {/* Linked Task Selector */}
          <div className="w-full max-w-sm">
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="">🎯 Pilih Tugas yang sedang dikerjakan...</option>
              {tasks
                .filter((t) => t.status !== 'done')
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.priority.toUpperCase()})
                  </option>
                ))}
            </select>
          </div>

          {/* Clock Display with Glow */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-xl">
              {formatMinutes(timeLeft)}
            </div>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  mode === 'focus' ? 'bg-indigo-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                setTimeLeft(durations[mode]);
                setIsRunning(false);
              }}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl border border-slate-700 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsRunning((prev) => !prev)}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm text-white shadow-xl transition-all active:scale-95 cursor-pointer ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/40'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Jeda Fokus</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Mulai Fokus</span>
                </>
              )}
            </button>

            <button
              onClick={handleSessionComplete}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl border border-slate-700 transition-colors"
              title="Lewati / Selesaikan Sesi"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient Soundscapes Engine */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-indigo-400" />
              <span>Ambient Focus Soundscape</span>
            </h4>
            {ambientSound !== 'none' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <p className="text-[11px] text-slate-400">Suara frekuensi relaksasi untuk meredam kebisingan sekitar.</p>

          <div className="space-y-2">
            <button
              onClick={() => (ambientSound === 'rain' ? stopAmbientSound() : startAmbientSound('rain'))}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                ambientSound === 'rain'
                  ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 shadow'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-indigo-400" />
                <span>Suara Hujan & Gerimis (Rain)</span>
              </div>
              <span>{ambientSound === 'rain' ? 'Sedang Putar' : 'Putar'}</span>
            </button>

            <button
              onClick={() => (ambientSound === 'lofi' ? stopAmbientSound() : startAmbientSound('lofi'))}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                ambientSound === 'lofi'
                  ? 'bg-purple-950/60 border-purple-500 text-purple-300 shadow'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                <span>Lofi Ambient Harmony (Chords)</span>
              </div>
              <span>{ambientSound === 'lofi' ? 'Sedang Putar' : 'Putar'}</span>
            </button>

            <button
              onClick={() => (ambientSound === 'binaural' ? stopAmbientSound() : startAmbientSound('binaural'))}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                ambientSound === 'binaural'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Binaural Alpha Waves (432Hz)</span>
              </div>
              <span>{ambientSound === 'binaural' ? 'Sedang Putar' : 'Putar'}</span>
            </button>

            {ambientSound !== 'none' && (
              <button
                onClick={stopAmbientSound}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <VolumeX className="w-3.5 h-3.5" /> Matikan Suara Ambient
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
