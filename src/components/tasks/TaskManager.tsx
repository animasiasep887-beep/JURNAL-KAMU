import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Task, TaskPriority } from '../../types';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  Trophy,
  Flame,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Clock,
  Layers,
  ListFilter,
  ChevronDown,
  ChevronUp,
  Award,
  AlertCircle,
  Star,
  Check,
} from 'lucide-react';
import { getTodayString } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';

export const TaskManager: React.FC = () => {
  const { tasks, addTask, updateTask, toggleTaskStatus, toggleSubtask, deleteTask } = useData();
  const { showToast } = useNotification();

  // View Mode: list | kanban | matrix
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'matrix'>('list');

  // Filter & Search
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Task Form
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [category, setCategory] = useState('Kerja & SaaS');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [dueTime, setDueTime] = useState('17:00');
  const [customSubtask, setCustomSubtask] = useState('');
  const [tempChecklist, setTempChecklist] = useState<string[]>([]);
  const [showAdvancedAdd, setShowAdvancedAdd] = useState(false);

  // Expanded Tasks for Checklist
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Pomodoro Focus Mode
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(false);
  const [pomoTask, setPomoTask] = useState<string>('');
  const [pomoSessionsCompleted, setPomoSessionsCompleted] = useState(2);

  // XP & Gamification State (Saved in LocalStorage)
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('lifeos_task_xp');
    return saved ? parseInt(saved, 10) : 350;
  });

  const level = Math.floor(xp / 200) + 1;
  const currentLevelXp = xp % 200;
  const xpNeeded = 200;
  const progressPercent = Math.round((currentLevelXp / xpNeeded) * 100);

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Pomodoro Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (isPomoRunning && pomoSeconds > 0) {
      timer = setInterval(() => {
        setPomoSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomoSeconds === 0) {
      setIsPomoRunning(false);
      setPomoSessionsCompleted((prev) => prev + 1);
      setXp((prev) => {
        const n = prev + 50;
        localStorage.setItem('lifeos_task_xp', String(n));
        return n;
      });
      showToast('🎉 Sesi Pomodoro Selesai! +50 XP didapatkan! Istirahat 5 menit ya bro!');
      setPomoSeconds(25 * 60);
    }
    return () => clearInterval(timer);
  }, [isPomoRunning, pomoSeconds]);

  const formatPomoTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleToggleTask = (task: Task) => {
    const isNowDone = task.status !== 'done';
    toggleTaskStatus(task.id);

    if (isNowDone) {
      const earnedXp = task.priority === 'high' ? 100 : task.priority === 'medium' ? 60 : 40;
      setXp((prev) => {
        const nextXp = prev + earnedXp;
        localStorage.setItem('lifeos_task_xp', String(nextXp));
        return nextXp;
      });
      showToast(`🔥 Task Selesai! Kamu dapat +${earnedXp} XP! Tetap on fire! 💪`);
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string, isCompleted: boolean) => {
    toggleSubtask(taskId, subtaskId);
    if (!isCompleted) {
      setXp((prev) => {
        const next = prev + 25;
        localStorage.setItem('lifeos_task_xp', String(next));
        return next;
      });
      showToast('🎯 Subtask Selesai! +25 XP didapatkan! 🎉');
    }
  };

  const handleAddSubtaskToForm = () => {
    if (!customSubtask.trim()) return;
    setTempChecklist([...tempChecklist, customSubtask.trim()]);
    setCustomSubtask('');
  };

  const handleAISmartBreakdown = () => {
    if (!title.trim()) {
      showToast('Ketik judul task terlebih dahulu sebelum AI memecah subtask!');
      return;
    }
    const t = title.toLowerCase();
    let generated: string[] = [];
    if (t.includes('coding') || t.includes('fitur') || t.includes('web') || t.includes('aplikasi') || t.includes('saas')) {
      generated = ['1. Buat arsitektur & komponen UI', '2. Integrasi state & pipeline data', '3. Testing responsivitas & deployment'];
    } else if (t.includes('gym') || t.includes('workout') || t.includes('latihan')) {
      generated = ['1. Pemanasan dinamis 10 menit', '2. Latihan inti 3-4 sets target beban', '3. Cooldown & minum air 1 Liter'];
    } else if (t.includes('buku') || t.includes('baca') || t.includes('belajar') || t.includes('pr')) {
      generated = ['1. Siapkan materi & timer 25 menit', '2. Fokus baca/tulis tanpa distraksi HP', '3. Catat poin kesimpulan di jurnal'];
    } else if (t.includes('keuangan') || t.includes('budget') || t.includes('gaji')) {
      generated = ['1. Rekap total pemasukan & saldo', '2. Pisahkan pos tabungan & operasional', '3. Set batas limit pengeluaran mingguan'];
    } else {
      generated = [`1. Riset & persiapan ${title}`, `2. Eksekusi tahap utama ${title}`, `3. Evaluasi & checklist penyelesaian`];
    }
    setTempChecklist(generated);
    showToast('✨ AI Smart Breakdown: 3 Subtask otomatis berhasil dibuat!');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      priority,
      status: 'todo',
      category,
      dueDate,
      dueTime,
      checklist: tempChecklist.map((st, i) => ({
        id: `st-${Date.now()}-${i}`,
        title: st,
        completed: false,
      })),
      tags: [`#${category.toLowerCase().replace(/\s+/g, '')}`, `#${priority}`],
    });

    setTitle('');
    setTempChecklist([]);
    setShowAdvancedAdd(false);
    showToast('🚀 Task Baru Berhasil Ditambahkan!');
  };

  // Filter Logic
  const filteredTasks = tasks.filter((t) => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterStatus === 'active' && t.status === 'done') return false;
    if (filterStatus === 'done' && t.status !== 'done') return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const categories = ['All', 'Kerja & SaaS', 'Kesehatan & Gym', 'Keuangan', 'Self Improvement', 'Pribadi'];

  return (
    <div className="space-y-6">
      {/* 1. GAMIFIED PRODUCTIVITY & XP COMMAND CENTER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Level & Progress */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold shadow-sm">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>LEVEL {level} : PRODUCTIVITY BEAST</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold">
                <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
                <span>14 HARI STREAK 🔥</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Productivity & Task Command Center ⚡
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-1">
                {completionRate === 100
                  ? '🎉 SEMUA TASK SELESAI! Kamu luar biasa hari ini, siap panen hasil!'
                  : completionRate >= 50
                  ? '🔥 GASKEUN BRO! Tinggal sedikit lagi untuk mencapai target 100% hari ini!'
                  : '💪 Mulai hari dengan eksekusi High Priority Task pertama kamu sekarang!'}
              </p>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">XP Progress Menuju Level {level + 1}</span>
                <span className="text-indigo-400 font-mono font-bold">{currentLevelXp} / {xpNeeded} XP ({progressPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400 rounded-full transition-all duration-500 shadow-lg shadow-indigo-500/50"
                  style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Quick Stats & Pomodoro Launch Button */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
              <div className="text-2xl font-extrabold text-indigo-400 font-mono">{completedTasks}/{totalTasks}</div>
              <div className="text-[11px] text-slate-400 font-medium">Task Selesai</div>
              <div className="text-[10px] text-emerald-400 font-bold">{completionRate}% Selesai</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
              <div className="text-2xl font-extrabold text-amber-400 font-mono">+{xp}</div>
              <div className="text-[11px] text-slate-400 font-medium">Total XP</div>
              <div className="text-[10px] text-amber-300 font-bold">Top 5% User</div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-indigo-600/30 to-violet-600/30 border border-indigo-500/40 p-4 rounded-2xl text-center flex flex-col justify-center items-center">
              <button
                onClick={() => setShowPomodoro(!showPomodoro)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{showPomodoro ? 'Tutup Pomo' : 'Mode Fokus'}</span>
              </button>
              <span className="text-[10px] text-indigo-300 mt-1.5 font-medium">{pomoSessionsCompleted} Sesi Selesai</span>
            </div>
          </div>
        </div>

        {/* POMODORO DEEP WORK FOCUS TIMER MODAL/DRAWER */}
        {showPomodoro && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-950/60 p-6 rounded-2xl border border-indigo-500/20 animate-fade-in">
            <div className="md:col-span-4 text-center space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Pomodoro Focus Timer</span>
              </div>
              <div className="text-5xl font-extrabold text-white font-mono tracking-tight drop-shadow-md">
                {formatPomoTime(pomoSeconds)}
              </div>
              <div className="text-xs text-indigo-400 font-medium">
                {isPomoRunning ? '🔥 Sesi Deep Work Berlangsung...' : '⏸️ Timer Siap Dimulai'}
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Pilih Task Yang Sedang Dikerjakan:</label>
              <select
                value={pomoTask}
                onChange={(e) => setPomoTask(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Bebas / Focus Mode Umum --</option>
                {tasks.filter((t) => t.status !== 'done').map((t) => (
                  <option key={t.id} value={t.title}>{t.title} ({t.priority.toUpperCase()})</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                💡 Setiap 25 menit fokus penuh bernilai <strong>+50 XP</strong>. Hilangkan notifikasi & fokus ke 1 hal!
              </p>
            </div>

            <div className="md:col-span-3 flex flex-col gap-2">
              <button
                onClick={() => setIsPomoRunning(!isPomoRunning)}
                className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isPomoRunning
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                {isPomoRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPomoRunning ? 'Jeda Timer' : 'Mulai Fokus (25 Mnt)'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPomoRunning(false);
                  setPomoSeconds(25 * 60);
                }}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset 25:00</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. TASK CREATION BAR & AI SMART BREAKDOWN */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              placeholder="Ketik task baru kamu di sini... (contoh: Selesaikan coding landing page)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500"
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold px-3.5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="high">🔴 High (+100 XP)</option>
              <option value="medium">🟡 Medium (+60 XP)</option>
              <option value="low">🟢 Low (+40 XP)</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3.5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Kerja & SaaS">💼 Kerja & SaaS</option>
              <option value="Kesehatan & Gym">🏋️ Kesehatan & Gym</option>
              <option value="Keuangan">💰 Keuangan</option>
              <option value="Self Improvement">📚 Self Improvement</option>
              <option value="Pribadi">🏠 Pribadi</option>
            </select>

            <button
              type="button"
              onClick={handleAISmartBreakdown}
              className="px-4 py-3 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95"
              title="AI Otomatis Pecah Menjadi 3 Subtasks"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">✨ AI Pecah Subtask</span>
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Tambah Task</span>
            </button>
          </div>

          {/* Checklist Preview if AI or User generated */}
          {tempChecklist.length > 0 && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/30 space-y-2">
              <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Checklist Subtask yang Akan Disimpan:</span>
              </div>
              <div className="space-y-1">
                {tempChecklist.map((st, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                    <span>{st}</span>
                    <button
                      type="button"
                      onClick={() => setTempChecklist(tempChecklist.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* 3. VIEW CONTROLS & FILTER TABS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'matrix' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Matrix Prioritas</span>
          </button>
        </div>

        {/* Right: Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${filterStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Semua ({tasks.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${filterStatus === 'active' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              Aktif ({tasks.filter((t) => t.status !== 'done').length})
            </button>
            <button
              onClick={() => setFilterStatus('done')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${filterStatus === 'done' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
            >
              Selesai ({tasks.filter((t) => t.status === 'done').length})
            </button>
          </div>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl outline-none"
          >
            <option value="all">Semua Prioritas</option>
            <option value="high">🔴 High Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>
        </div>
      </div>

      {/* 4. MAIN TASK VIEWS */}

      {/* VIEW A: LIST VIEW (RICH INTERACTIVE ACCORDION WITH CHECKLIST) */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">Tidak ada task yang cocok dengan filter</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Semua task pada filter ini sudah beres atau belum dibuat. Tambahkan task baru sekarang!</p>
            </div>
          ) : (
            filteredTasks.map((t) => {
              const isDone = t.status === 'done';
              const isExpanded = expandedTaskId === t.id;
              const hasChecklist = t.checklist && t.checklist.length > 0;
              const checklistDone = hasChecklist ? t.checklist.filter((c) => c.completed).length : 0;
              const checklistTotal = hasChecklist ? t.checklist.length : 0;
              const checklistPercent = checklistTotal > 0 ? Math.round((checklistDone / checklistTotal) * 100) : 0;

              return (
                <div
                  key={t.id}
                  className={`group bg-slate-900 border rounded-2xl p-4 md:p-5 transition-all duration-300 shadow-lg ${
                    isDone
                      ? 'border-slate-800/60 bg-slate-900/40 opacity-75'
                      : t.priority === 'high'
                      ? 'border-rose-500/30 hover:border-rose-500/60 hover:shadow-rose-500/5'
                      : t.priority === 'medium'
                      ? 'border-amber-500/30 hover:border-amber-500/60'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 flex-1">
                      {/* Interactive Checkbox */}
                      <button
                        onClick={() => handleToggleTask(t)}
                        className="mt-0.5 text-slate-500 hover:scale-125 transition-transform shrink-0"
                        title={isDone ? 'Tandai Belum Selesai' : 'Tandai Selesai (+XP)'}
                      >
                        {isDone ? (
                          <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-scale-in">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-lg border-2 border-slate-600 hover:border-indigo-400 bg-slate-950 transition-colors" />
                        )}
                      </button>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            className={`font-bold text-sm leading-snug transition-all ${
                              isDone ? 'line-through text-slate-500 font-normal' : 'text-slate-100'
                            }`}
                          >
                            {t.title}
                          </h4>

                          {/* Priority Pill */}
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              t.priority === 'high'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : t.priority === 'medium'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {t.priority}
                          </span>

                          {/* Category Badge */}
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                            {t.category}
                          </span>

                          {/* XP Badge */}
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            +{t.priority === 'high' ? '100' : t.priority === 'medium' ? '60' : '40'} XP
                          </span>
                        </div>

                        {t.description && (
                          <p className="text-xs text-slate-400 leading-relaxed">{t.description}</p>
                        )}

                        {/* Meta: Due Date & Checklist Progress */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                          {t.dueDate && (
                            <div className="flex items-center gap-1 text-slate-400">
                              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                              <span>{t.dueDate} {t.dueTime && `• ${t.dueTime}`}</span>
                            </div>
                          )}

                          {hasChecklist && (
                            <button
                              onClick={() => setExpandedTaskId(isExpanded ? null : t.id)}
                              className="flex items-center gap-1.5 text-indigo-400 hover:underline font-semibold"
                            >
                              <span>Checklist: {checklistDone}/{checklistTotal} ({checklistPercent}%)</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {!isDone && (
                        <button
                          onClick={() => {
                            setPomoTask(t.title);
                            setShowPomodoro(true);
                            setIsPomoRunning(true);
                            showToast(`⏱️ Mode Fokus dimulai untuk task: ${t.title}`);
                          }}
                          className="px-2.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                          title="Mulai Sesi Pomodoro untuk task ini"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span className="hidden sm:inline">Fokus</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteTask(t.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Hapus Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Subtask Checklist */}
                  {hasChecklist && isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-800 space-y-2.5 bg-slate-950/70 p-3.5 rounded-2xl border border-indigo-500/20">
                      <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Subtasks Milestones ({checklistDone}/{checklistTotal}):</span>
                        </span>
                        <span className="text-indigo-400 font-mono font-bold">{checklistPercent}% Selesai</span>
                      </div>
                      <div className="space-y-1.5">
                        {t.checklist.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => handleToggleSubtask(t.id, c.id, c.completed)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                              c.completed
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                                : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 text-slate-200 hover:bg-slate-850'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 flex-1">
                              <div
                                className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                                  c.completed
                                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                                    : 'border-2 border-slate-600 hover:border-indigo-400 bg-slate-950'
                                }`}
                              >
                                {c.completed && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className={`text-xs ${c.completed ? 'line-through text-slate-500' : 'font-medium'}`}>
                                {c.title}
                              </span>
                            </div>

                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${c.completed ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                              {c.completed ? '✓ +25 XP' : '+25 XP'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW B: KANBAN BOARD VIEW (MODERN 3-COLUMN BOARD) */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: To Do */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400 shadow-md shadow-amber-400/50" />
                <h4 className="font-bold text-slate-100 text-sm">TO DO (BELUM MULAI)</h4>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-950 px-2.5 py-0.5 rounded-full text-amber-400 border border-amber-500/20">
                {tasks.filter((t) => t.status === 'todo').length}
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {tasks.filter((t) => t.status === 'todo').length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                  Tidak ada task to-do.
                </div>
              ) : (
                tasks.filter((t) => t.status === 'todo').map((t) => (
                  <div key={t.id} className="bg-slate-950 border border-slate-800/90 hover:border-amber-500/40 p-4 rounded-2xl space-y-3 transition-all group shadow-md">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-slate-100 leading-snug">{t.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        t.priority === 'high' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : t.priority === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {t.priority === 'high' ? '🔴 High' : t.priority === 'medium' ? '🟡 Med' : '🟢 Low'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                      <span className="text-slate-500">{t.category}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            updateTask(t.id, { status: 'in_progress' });
                            showToast(`🚀 Memulai pengerjaan: ${t.title}`);
                          }}
                          className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-[10px] font-bold transition-all"
                        >
                          ▶️ Kerjakan
                        </button>
                        <button
                          onClick={() => handleToggleTask(t)}
                          className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-[10px] font-bold transition-all"
                        >
                          ✓ Selesai
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: In Progress / High Priority */}
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-5 space-y-4 shadow-xl shadow-indigo-950/20 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-400 shadow-md shadow-indigo-400/50 animate-pulse" />
                <h4 className="font-bold text-slate-100 text-sm">IN PROGRESS (FOKUS)</h4>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-950 px-2.5 py-0.5 rounded-full text-indigo-400 border border-indigo-500/30">
                {tasks.filter((t) => t.status === 'in_progress').length}
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {tasks.filter((t) => t.status === 'in_progress').length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                  Belum ada task yang sedang dikerjakan.
                </div>
              ) : (
                tasks.filter((t) => t.status === 'in_progress').map((t) => (
                  <div key={t.id} className="bg-slate-950 border border-indigo-500/40 p-4 rounded-2xl space-y-3 shadow-lg shadow-indigo-500/10">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-white leading-snug">{t.title}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        +100 XP
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                      <button
                        onClick={() => {
                          setPomoTask(t.title);
                          setShowPomodoro(true);
                          setIsPomoRunning(true);
                          showToast(`⏱️ Mode Pomodoro dimulai untuk: ${t.title}`);
                        }}
                        className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 text-[10px]"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Pomodoro</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            updateTask(t.id, { status: 'todo' });
                            showToast(`Task dikembalikan ke To Do.`);
                          }}
                          className="px-2 py-1 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-[10px] font-semibold"
                        >
                          ⏸️ Tunda
                        </button>
                        <button
                          onClick={() => handleToggleTask(t)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold shadow-md shadow-emerald-600/30 transition-all"
                        >
                          ✓ Selesaikan
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50" />
                <h4 className="font-bold text-slate-100 text-sm">DONE (SELESAI)</h4>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-950 px-2.5 py-0.5 rounded-full text-emerald-400 border border-emerald-500/20">
                {tasks.filter((t) => t.status === 'done').length}
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {tasks.filter((t) => t.status === 'done').length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                  Belum ada task selesai.
                </div>
              ) : (
                tasks.filter((t) => t.status === 'done').map((t) => (
                  <div key={t.id} className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl space-y-2 group hover:border-emerald-500/30 transition-all">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-medium text-slate-400 line-through leading-snug">{t.title}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-900">
                      <span className="text-emerald-400 font-mono font-bold">✓ XP Diklaim</span>
                      <button
                        onClick={() => {
                          updateTask(t.id, { status: 'todo' });
                          showToast(`Task "${t.title}" dibuka kembali.`);
                        }}
                        className="text-slate-400 hover:text-indigo-300 font-medium underline"
                      >
                        Buka Lagi
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW C: EISENHOWER MATRIX */}
      {viewMode === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Q1: Urgent & Important (Do First) */}
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-5 space-y-3 shadow-lg shadow-rose-500/5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <div className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg"><Flame className="w-4 h-4" /></div>
              <div>
                <h4 className="text-xs font-bold text-rose-300">1. PENTING & MENDESAK (DO FIRST)</h4>
                <p className="text-[10px] text-slate-400">Kerjakan langsung sekarang tanpa tunda</p>
              </div>
            </div>
            <div className="space-y-2">
              {tasks.filter((t) => t.priority === 'high' && t.status !== 'done').map((t) => (
                <div key={t.id} className="p-3 bg-slate-950 border border-rose-500/20 rounded-xl flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{t.title}</span>
                  <button onClick={() => handleToggleTask(t)} className="text-slate-500 hover:text-emerald-400"><Circle className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Q2: Important & Not Urgent (Schedule) */}
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-5 space-y-3 shadow-lg shadow-indigo-500/5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg"><Calendar className="w-4 h-4" /></div>
              <div>
                <h4 className="text-xs font-bold text-indigo-300">2. PENTING & TIDAK MENDESAK (SCHEDULE)</h4>
                <p className="text-[10px] text-slate-400">Jadwalkan di kalender untuk pertumbuhan jangka panjang</p>
              </div>
            </div>
            <div className="space-y-2">
              {tasks.filter((t) => t.priority === 'medium' && t.status !== 'done').map((t) => (
                <div key={t.id} className="p-3 bg-slate-950 border border-indigo-500/20 rounded-xl flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{t.title}</span>
                  <button onClick={() => handleToggleTask(t)} className="text-slate-500 hover:text-emerald-400"><Circle className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Q3: Not Important & Urgent (Delegate/Quick) */}
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg"><Zap className="w-4 h-4" /></div>
              <div>
                <h4 className="text-xs font-bold text-amber-300">3. QUICK WINS / RUTINITAS</h4>
                <p className="text-[10px] text-slate-400">Selesaikan cepat dalam waktu 5-10 menit</p>
              </div>
            </div>
            <div className="space-y-2">
              {tasks.filter((t) => t.priority === 'low' && t.status !== 'done').map((t) => (
                <div key={t.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-300">{t.title}</span>
                  <button onClick={() => handleToggleTask(t)} className="text-slate-500 hover:text-emerald-400"><Circle className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Q4: Completed Archive */}
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 space-y-3 opacity-80">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg"><Award className="w-4 h-4" /></div>
              <div>
                <h4 className="text-xs font-bold text-emerald-300">4. COMPLETED TROPHY ROOM</h4>
                <p className="text-[10px] text-slate-400">Kumpulan prestasi task yang telah kamu tuntaskan</p>
              </div>
            </div>
            <div className="space-y-2">
              {tasks.filter((t) => t.status === 'done').slice(0, 4).map((t) => (
                <div key={t.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex justify-between items-center text-xs line-through text-slate-500">
                  <span>{t.title}</span>
                  <span className="text-emerald-400 font-bold text-[10px]">DONE ✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
