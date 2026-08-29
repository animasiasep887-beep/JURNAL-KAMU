import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Habit } from '../../types';
import { getTodayString, calculateJournalStreak } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';
import {
  Repeat,
  Plus,
  Flame,
  CheckCircle2,
  Circle,
  Trophy,
  Sparkles,
  Zap,
  Calendar,
  Layers,
  Trash2,
  Check,
  TrendingUp,
  Award,
  Sun,
  Droplet,
  BookOpen,
  Dumbbell,
  Moon,
  Activity,
  Heart,
} from 'lucide-react';

export const HabitTrackerGrid: React.FC = () => {
  const { habits, habitLogs, journals, addHabit, toggleHabitLog, deleteHabit } = useData();
  const { showToast } = useNotification();
  const today = getTodayString();
  const currentStreak = calculateJournalStreak(journals);

  // View Mode: 'matrix' | 'cards' | 'heatmap'
  const [viewMode, setViewMode] = useState<'matrix' | 'cards' | 'heatmap'>('matrix');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Form State
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Kesehatan');
  const [showAddForm, setShowAddForm] = useState(false);

  // 7 Days Range (Monday to Sunday or last 7 days)
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
    return days[d.getDay()];
  };

  // Stats calculation
  const totalHabits = habits.length;
  const completedTodayCount = habits.filter((h) =>
    habitLogs.some((hl) => hl.habitId === h.id && hl.date === today && hl.completed)
  ).length;
  const todayProgressPercent = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;

  const categories = ['All', 'Kesehatan', 'Disiplin', 'Produktif', 'Refleksi', 'Mindset'];

  const filteredHabits = habits.filter((h) => {
    if (selectedCategory !== 'All' && h.category !== selectedCategory) return false;
    return true;
  });

  const handleToggle = (habitId: string, date: string, habitName: string) => {
    const wasCompleted = habitLogs.some((hl) => hl.habitId === habitId && hl.date === date && hl.completed);
    toggleHabitLog(habitId, date);

    if (!wasCompleted) {
      showToast(`🔥 Habit "${habitName}" Tercatat! +30 XP! Konsistensi membentuk juara! 💪`);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim(), newHabitCategory);
    setNewHabitName('');
    setShowAddForm(false);
    showToast(`✨ Habit Baru "${newHabitName}" Berhasil Ditambahkan!`);
  };

  const handleAddPreset = (name: string, category: string) => {
    addHabit(name, category);
    showToast(`✨ Habit Preset "${name}" Ditambahkan!`);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Kesehatan':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Disiplin':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Produktif':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Refleksi':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Mindset':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // 30 Days Heatmap Generator
  const heatmapDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dStr = d.toISOString().split('T')[0];
    const completedOnDay = habits.filter((h) =>
      habitLogs.some((hl) => hl.habitId === h.id && hl.date === dStr && hl.completed)
    ).length;
    const intensity = totalHabits > 0 ? completedOnDay / totalHabits : 0;
    return { date: dStr, count: completedOnDay, intensity };
  });

  return (
    <div className="space-y-6">
      {/* 1. HERO HABIT MASTERY & STREAK COMMAND CENTER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Streak & Daily Motivation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold shadow-sm">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{currentStreak} HARI STREAK DISIPLIN 🔥</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>ATOMIC HABITS MASTER</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Habit Mastery & Daily Discipline ⚡
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">
                {todayProgressPercent === 100
                  ? '👑 PERFECT DAY! Semua kebiasaan harian telah selesai 100%! Kamu sedang bertransformasi menjadi versi terbaik!'
                  : todayProgressPercent >= 60
                  ? '🔥 Konsistensi luar biasa! Tinggal sedikit lagi untuk mencapai 100% disiplin hari ini!'
                  : '🌱 "Perubahan kecil 1% setiap hari menghasilkan lompatan 37x lipat dalam 1 tahun." — James Clear'}
              </p>
            </div>

            {/* Today Consistency Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Target Disiplin Hari Ini ({today})</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {completedTodayCount} / {totalHabits} Habit Selesai ({todayProgressPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-500 shadow-lg shadow-emerald-500/50"
                  style={{ width: `${Math.min(100, Math.max(5, todayProgressPercent))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Key Stats */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                {completedTodayCount}/{totalHabits}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Selesai Hari Ini</div>
              <div className="text-[10px] text-emerald-300 font-bold">{todayProgressPercent}% Rate</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
              <div className="text-2xl font-extrabold text-amber-400 font-mono">14 Hari</div>
              <div className="text-[11px] text-slate-400 font-medium">Streak Terpanjang</div>
              <div className="text-[10px] text-amber-300 font-bold">Unstoppable 🔥</div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 p-4 rounded-2xl text-center flex flex-col justify-center items-center">
              <div className="text-2xl font-extrabold text-indigo-300 font-mono">+{completedTodayCount * 30}</div>
              <div className="text-[11px] text-slate-300 font-medium">XP Hari Ini</div>
              <div className="text-[10px] text-emerald-400 font-bold">+30 XP/Habit</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ATOMIC HABIT PRESET QUICK ADD BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Template Rutinitas Atomic Habits (1-Klik Tambah):</span>
          </span>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-all shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{showAddForm ? 'Tutup Form' : 'Buat Custom Habit'}</span>
          </button>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2">
          {[
            { name: '🌅 Bangun Pagi Jam 06:00', cat: 'Disiplin' },
            { name: '💧 Minum Air 2.5 Liter', cat: 'Kesehatan' },
            { name: '🏋️ Workout / Gym 45 Mnt', cat: 'Kesehatan' },
            { name: '📚 Baca Buku 20 Halaman', cat: 'Produktif' },
            { name: '✍️ Catat Jurnal & Refleksi', cat: 'Refleksi' },
            { name: '📵 No HP 30 Mnt Pagi', cat: 'Mindset' },
            { name: '🌙 Tidur Cukup 7+ Jam', cat: 'Kesehatan' },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleAddPreset(preset.name, preset.cat)}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-medium transition-all hover:border-emerald-500/40 active:scale-95 flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-emerald-400" />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Custom Habit Form */}
        {showAddForm && (
          <form onSubmit={handleAdd} className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2.5 animate-fade-in">
            <input
              type="text"
              placeholder="Ketik nama kebiasaan baru (contoh: Meditasi 10 menit)..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <select
              value={newHabitCategory}
              onChange={(e) => setNewHabitCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none font-semibold"
            >
              <option value="Kesehatan">Kesehatan</option>
              <option value="Disiplin">Disiplin</option>
              <option value="Produktif">Produktif</option>
              <option value="Refleksi">Refleksi</option>
              <option value="Mindset">Mindset</option>
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Simpan Habit</span>
            </button>
          </form>
        )}
      </div>

      {/* 3. VIEW CONTROLS & CATEGORY FILTER TABS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'matrix' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Matrix 7 Hari</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'cards' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kartu Habit</span>
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'heatmap' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Heatmap 30 Hari</span>
          </button>
        </div>

        {/* Right: Category Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat === 'All' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN VIEWS */}

      {/* VIEW A: WEEKLY MATRIX TRACKER (ULTRA RICH GLOWING MATRIX) */}
      {viewMode === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400">
                  <th className="py-3 px-4 font-bold">Nama Kebiasaan</th>
                  <th className="py-3 px-3 text-center font-bold">Streak</th>
                  {dates.map((d) => {
                    const isToday = d === today;
                    return (
                      <th
                        key={d}
                        className={`py-3 px-2 text-center font-bold ${
                          isToday ? 'text-emerald-400 bg-emerald-500/10 rounded-t-xl' : 'text-slate-400'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-mono">{getDayName(d)}</div>
                        <div className="text-xs font-mono">{d.substring(8, 10)}</div>
                      </th>
                    );
                  })}
                  <th className="py-3 px-3 text-center font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredHabits.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-slate-500 text-xs">
                      Belum ada kebiasaan di kategori ini. Tambahkan habit baru di atas!
                    </td>
                  </tr>
                ) : (
                  filteredHabits.map((h) => {
                    return (
                      <tr
                        key={h.id}
                        className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="py-4 px-4">
                          <div className="font-extrabold text-xs text-slate-100 group-hover:text-emerald-300 transition-colors">
                            {h.name}
                          </div>
                          <span
                            className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryColor(
                              h.category
                            )}`}
                          >
                            {h.category}
                          </span>
                        </td>

                        <td className="py-4 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold rounded-lg shadow-sm">
                            <Flame className="w-3.5 h-3.5 fill-amber-400" />
                            14 Hari
                          </span>
                        </td>

                        {dates.map((d) => {
                          const isCompleted = habitLogs.some(
                            (hl) => hl.habitId === h.id && hl.date === d && hl.completed
                          );
                          const isToday = d === today;

                          return (
                            <td
                              key={d}
                              className={`py-4 px-2 text-center ${isToday ? 'bg-emerald-500/5' : ''}`}
                            >
                              <button
                                onClick={() => handleToggle(h.id, d, h.name)}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all mx-auto ${
                                  isCompleted
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 scale-105'
                                    : 'border-2 border-slate-700 hover:border-emerald-400 hover:bg-emerald-500/10 bg-slate-950'
                                }`}
                                title={`${h.name} - ${d} (${isCompleted ? 'Selesai' : 'Belum'})`}
                              >
                                {isCompleted ? (
                                  <Check className="w-4 h-4 stroke-[3]" />
                                ) : (
                                  <span className="text-[10px] text-slate-600 font-mono">
                                    {d.substring(8, 10)}
                                  </span>
                                )}
                              </button>
                            </td>
                          );
                        })}

                        <td className="py-4 px-3 text-center">
                          <button
                            onClick={() => deleteHabit(h.id)}
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                            title="Hapus Habit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW B: RICH HABIT CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHabits.map((h) => {
            const isTodayCompleted = habitLogs.some(
              (hl) => hl.habitId === h.id && hl.date === today && hl.completed
            );
            const completedCount7Days = dates.filter((d) =>
              habitLogs.some((hl) => hl.habitId === h.id && hl.date === d && hl.completed)
            ).length;
            const weekPercentage = Math.round((completedCount7Days / 7) * 100);

            return (
              <div
                key={h.id}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-3xl space-y-4 shadow-xl hover:shadow-emerald-500/5 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                        h.category
                      )}`}
                    >
                      {h.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 font-mono">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" /> 14 Hari Streak
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-100 text-sm">{h.name}</h4>

                  {/* 7-day mini progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                      <span>Konsistensi 7 Hari</span>
                      <span className="text-emerald-400 font-mono">{weekPercentage}% ({completedCount7Days}/7 Hari)</span>
                    </div>
                    <div className="flex gap-1">
                      {dates.map((d) => {
                        const isDone = habitLogs.some(
                          (hl) => hl.habitId === h.id && hl.date === d && hl.completed
                        );
                        return (
                          <div
                            key={d}
                            className={`h-2 flex-1 rounded-full transition-all ${
                              isDone ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-800'
                            }`}
                            title={`${d}: ${isDone ? 'Selesai' : 'Belum'}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 1-Click Today Action Button */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggle(h.id, today, h.name)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                      isTodayCompleted
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isTodayCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-4 h-4" />}
                    <span>{isTodayCompleted ? 'Selesai Hari Ini (+30 XP)' : 'Tandai Selesai Hari Ini'}</span>
                  </button>

                  <button
                    onClick={() => deleteHabit(h.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW C: 30-DAY GITHUB-STYLE CONSISTENCY HEATMAP */}
      {viewMode === 'heatmap' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Peta Konsistensi Disiplin 30 Hari Terakhir (Habit Heatmap)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Semakin hijau terang kotaknya, semakin banyak kebiasaan yang kamu selesaikan pada hari tersebut!
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span>Kurang</span>
              <div className="w-3 h-3 rounded bg-slate-800" />
              <div className="w-3 h-3 rounded bg-emerald-950" />
              <div className="w-3 h-3 rounded bg-emerald-700" />
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <div className="w-3 h-3 rounded bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              <span>Sempurna</span>
            </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-2">
            {heatmapDays.map((hd) => {
              const bg =
                hd.intensity >= 0.8
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/40'
                  : hd.intensity >= 0.5
                  ? 'bg-emerald-500 text-white font-semibold'
                  : hd.intensity >= 0.2
                  ? 'bg-emerald-800 text-emerald-100'
                  : hd.count > 0
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-950 text-slate-600 border border-slate-800';

              return (
                <div
                  key={hd.date}
                  className={`p-2.5 rounded-xl text-center space-y-1 transition-transform hover:scale-110 cursor-pointer ${bg}`}
                  title={`${hd.date}: ${hd.count} / ${totalHabits} habit selesai`}
                >
                  <div className="text-[10px] font-mono">{hd.date.substring(8, 10)}</div>
                  <div className="text-[9px] opacity-80">{Math.round(hd.intensity * 100)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
