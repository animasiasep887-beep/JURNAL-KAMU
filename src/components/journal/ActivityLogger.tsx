import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { getTodayString } from '../../utils/formatters';
import {
  Clock,
  Plus,
  CheckCircle2,
  Play,
  Square,
  Sparkles,
  Zap,
  Coffee,
  Briefcase,
  GraduationCap,
  Dumbbell,
  Gamepad2,
  Users,
  Flame,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const ActivityLogger: React.FC = () => {
  const { activities, addActivity } = useData();
  const { showToast } = useNotification();
  const today = getTodayString();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'productive' | 'work' | 'study' | 'gym' | 'rest' | 'entertainment' | 'social' | 'other'>('work');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');

  // Live Focus Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActivityName, setTimerActivityName] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isTimerRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleStartTimer = () => {
    if (!timerActivityName.trim()) {
      showToast('⚠️ Masukkan nama fokus terlebih dahulu!');
      return;
    }
    setIsTimerRunning(true);
  };

  const handleStopAndSaveTimer = () => {
    setIsTimerRunning(false);
    const durationMin = Math.max(1, Math.round(timerSeconds / 60));
    
    const now = new Date();
    const endStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const startObj = new Date(now.getTime() - durationMin * 60000);
    const startStr = `${String(startObj.getHours()).padStart(2, '0')}:${String(startObj.getMinutes()).padStart(2, '0')}`;

    addActivity({
      name: timerActivityName,
      category: 'productive',
      startTime: startStr,
      endTime: endStr,
      durationMinutes: durationMin,
      date: today,
      status: 'completed',
    });

    showToast(`⏱️ Sesi Fokus "${timerActivityName}" (${durationMin} menit) berhasil disimpan!`);
    setTimerSeconds(0);
    setTimerActivityName('');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Calculate duration
    const [h1, m1] = startTime.split(':').map(Number);
    const [h2, m2] = endTime.split(':').map(Number);
    let duration = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (duration <= 0) duration += 24 * 60; // Cross midnight handler

    addActivity({
      name,
      category,
      startTime,
      endTime,
      durationMinutes: Math.max(10, duration),
      date: today,
      status: 'completed',
    });

    showToast(`✅ Aktivitas "${name}" berhasil dicatat!`);
    setName('');
  };

  const todayActivities = activities.filter((a) => a.date === today);

  const totalProductiveMinutes = todayActivities
    .filter((a) => a.category === 'productive' || a.category === 'work' || a.category === 'study' || a.category === 'gym')
    .reduce((sum, a) => sum + a.durationMinutes, 0);

  const totalRestMinutes = todayActivities
    .filter((a) => a.category === 'rest')
    .reduce((sum, a) => sum + a.durationMinutes, 0);

  const totalEntertainmentMinutes = todayActivities
    .filter((a) => a.category === 'entertainment' || a.category === 'social')
    .reduce((sum, a) => sum + a.durationMinutes, 0);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Productivity & Time Engine</span>
          </div>
          <h3 className="font-extrabold text-slate-100 text-lg sm:text-xl flex items-center gap-2 tracking-tight">
            <span>Time Tracking & Activity Journal</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Pantau alokasi waktu kerja fokus, kebugaran gym, istirahat, dan hiburan secara real-time.</p>
        </div>

        {/* Live Active Badge */}
        <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs text-slate-300 font-semibold">{todayActivities.length} Aktivitas Hari Ini</span>
        </div>
      </div>

      {/* Modern Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Waktu Produktif */}
        <div className="relative group bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Zap className="w-4 h-4 text-emerald-400" />
              Waktu Fokus & Kerja
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">FOKUS</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-3 tracking-tight">
            {Math.floor(totalProductiveMinutes / 60)} <span className="text-xs text-emerald-300 font-sans font-normal">Jam</span> {totalProductiveMinutes % 60} <span className="text-xs text-emerald-300 font-sans font-normal">Menit</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Kerja, Belajar, Tugas, Gym
          </div>
        </div>

        {/* Waktu Istirahat */}
        <div className="relative group bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-900 p-5 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Coffee className="w-4 h-4 text-indigo-400" />
              Waktu Istirahat & Recharge
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-mono">REST</span>
          </div>
          <div className="text-2xl font-black text-indigo-400 font-mono mt-3 tracking-tight">
            {Math.floor(totalRestMinutes / 60)} <span className="text-xs text-indigo-300 font-sans font-normal">Jam</span> {totalRestMinutes % 60} <span className="text-xs text-indigo-300 font-sans font-normal">Menit</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Tidur, Makan Siang, Break
          </div>
        </div>

        {/* Waktu Hiburan */}
        <div className="relative group bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 p-5 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              Waktu Hiburan & Sosial
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-mono">LEISURE</span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-3 tracking-tight">
            {Math.floor(totalEntertainmentMinutes / 60)} <span className="text-xs text-amber-300 font-sans font-normal">Jam</span> {totalEntertainmentMinutes % 60} <span className="text-xs text-amber-300 font-sans font-normal">Menit</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Nonton, Gaming, Sosialisasi
          </div>
        </div>
      </div>

      {/* QUICK LIVE STOPWATCH / FOCUS TIMER TOOL */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/30 via-slate-800/40 to-violet-900/30 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold shrink-0">
            <Clock className={`w-5 h-5 ${isTimerRunning ? 'animate-spin text-amber-400' : ''}`} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Quick Focus Stopwatch</span>
              {isTimerRunning && <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] rounded-full animate-pulse">BERJALAN</span>}
            </div>
            <input
              type="text"
              placeholder="Contoh: Coding fitur baru, Baca buku..."
              value={timerActivityName}
              onChange={(e) => setTimerActivityName(e.target.value)}
              disabled={isTimerRunning}
              className="bg-transparent border-b border-slate-700 focus:border-indigo-400 text-xs text-slate-200 py-1 outline-none w-full sm:w-64 placeholder-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-mono text-2xl font-black text-amber-400 bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-800 tracking-wider shadow-inner">
            {formatTimer(timerSeconds)}
          </div>

          {!isTimerRunning ? (
            <button
              type="button"
              onClick={handleStartTimer}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Mulai Fokus</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopAndSaveTimer}
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Selesai & Simpan</span>
            </button>
          )}
        </div>
      </div>

      {/* Manual Input Form */}
      <form onSubmit={handleAdd} className="bg-slate-800/50 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-400" />
          <span>Tambah Catatan Waktu Manual</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nama Aktivitas / Kegiatan</label>
            <input
              type="text"
              placeholder="Contoh: Meeting project klien, Belajar Python, Workout Dada..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Jam Mulai</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Jam Selesai</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2">
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-slate-400">Kategori:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-xl outline-none"
            >
              <option value="work">💼 Pekerjaan</option>
              <option value="study">🎓 Belajar / Kursus</option>
              <option value="gym">🏋️ Gym / Workout</option>
              <option value="productive">⚡ Produktif Lainnya</option>
              <option value="rest">☕ Istirahat / Makan</option>
              <option value="entertainment">🎮 Hiburan / Hobi</option>
              <option value="social">👥 Sosialisasi / Keluarga</option>
            </select>
          </div>

          <button
            type="submit"
            className="py-2.5 px-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Simpan Aktivitas</span>
          </button>
        </div>
      </form>
    </div>
  );
};
