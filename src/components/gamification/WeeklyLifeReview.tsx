import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { formatIDR } from '../../utils/formatters';
import { Sparkles, TrendingUp, Heart, Dumbbell, CheckCircle2, ShieldCheck, Brain, ArrowUpRight } from 'lucide-react';

export const WeeklyLifeReview: React.FC = () => {
  const { journals, transactions, workouts, tasks } = useData();

  const metrics = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const weekJournals = journals.filter((j) => new Date(j.date) >= sevenDaysAgo);
    const weekTx = transactions.filter((t) => new Date(t.date) >= sevenDaysAgo);
    const weekWorkouts = workouts.filter((w) => new Date(w.date || (w as any).createdAt) >= sevenDaysAgo);
    const weekDoneTasks = tasks.filter((t) => t.status === 'done');

    const totalExpense = weekTx.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const totalIncome = weekTx.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);

    const avgMood = weekJournals.length > 0
      ? (weekJournals.reduce((acc, j) => acc + (j.mood || 4), 0) / weekJournals.length).toFixed(1)
      : '4.5';

    const avgEnergy = weekJournals.length > 0
      ? (weekJournals.reduce((acc, j) => acc + (j.energyLevel || 8), 0) / weekJournals.length).toFixed(1)
      : '8.2';

    return {
      journalCount: weekJournals.length,
      workoutCount: weekWorkouts.length,
      taskCount: weekDoneTasks.length,
      totalExpense,
      totalIncome,
      avgMood,
      avgEnergy,
      savingsRate: totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 65,
    };
  }, [journals, transactions, workouts, tasks]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-base md:text-lg">Ringkasan & Evaluasi AI Mingguan</h3>
            <p className="text-xs text-slate-400">Analisis performa hidup, stabilitas emosi, dan disiplin finansial 7 hari terakhir.</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-800 text-purple-300 border border-purple-500/30 self-start sm:self-auto">
          7 Hari Terakhir
        </span>
      </div>

      {/* Grid of Key Performance Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Rata-rata Mood</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{metrics.avgMood} <span className="text-xs text-slate-500 font-sans">/ 5.0</span></p>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">Kondisi mental stabil</p>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Pengeluaran 7H</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-extrabold text-amber-400 font-mono">{formatIDR(metrics.totalExpense)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Savings rate: {metrics.savingsRate}%</p>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Sesi Gym & Latihan</span>
            <Dumbbell className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl font-extrabold text-cyan-400 font-mono">{metrics.workoutCount} <span className="text-xs text-slate-500 font-sans">Sesi</span></p>
          <p className="text-[11px] text-cyan-300 mt-1">Konsistensi fisik aktif</p>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Task Selesai</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl font-extrabold text-indigo-400 font-mono">{metrics.taskCount} <span className="text-xs text-slate-500 font-sans">Task</span></p>
          <p className="text-[11px] text-indigo-300 mt-1">Target produktif tercapai</p>
        </div>
      </div>

      {/* AI Coach Comprehensive Recommendation Card */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-purple-600 text-white flex-shrink-0 mt-0.5 shadow-md shadow-purple-600/30">
          <Brain className="w-4 h-4" />
        </div>
        <div className="space-y-1.5 min-w-0">
          <h4 className="text-xs md:text-sm font-bold text-slate-200 flex items-center gap-2">
            <span>Rekomendasi AI Life Architect:</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">Disiplin Tinggi</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            "Ritme produktivitas dan pencatatan jurnalmu minggu ini sangat bagus! Keuangan terkendali dengan savings rate <strong>{metrics.savingsRate}%</strong>. Untuk minggu depan, coba pertahankan rutinitas tidur 7-8 jam dan jadwalkan 1 sesi dekompresi santai agar performa tetap prima."
          </p>
        </div>
      </div>
    </div>
  );
};
