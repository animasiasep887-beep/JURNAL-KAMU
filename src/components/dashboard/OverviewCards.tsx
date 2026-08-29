import React from 'react';
import { useData } from '../../context/DataContext';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Flame,
  Dumbbell,
  Smile,
  Zap,
  CreditCard,
  ArrowUpRight,
  Sparkles,
  PieChart,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { formatIDR, formatCompactIDR, getTodayString, calculateJournalStreak } from '../../utils/formatters';

export const OverviewCards: React.FC = () => {
  const { accounts, transactions, workouts, journals, tasks } = useData();

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const cashBalance = accounts.filter((a) => a.type === 'cash').reduce((sum, a) => sum + a.balance, 0);
  const bankBalance = accounts.filter((a) => a.type === 'bank').reduce((sum, a) => sum + a.balance, 0);
  const ewalletBalance = accounts.filter((a) => a.type === 'ewallet').reduce((sum, a) => sum + a.balance, 0);

  const monthlyIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const remainingMoney = monthlyIncome - monthlyExpense;

  const today = getTodayString();
  const todaySpent = transactions
    .filter((t) => t.date === today && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayTasks = tasks.filter((t) => t.dueDate === today);
  const completedTasks = todayTasks.filter((t) => t.status === 'done');
  const taskPercent = todayTasks.length > 0 ? Math.round((completedTasks.length / todayTasks.length) * 100) : 100;

  const lastWorkout = workouts[0];
  const todayJournals = journals.filter((j) => j.date === today);
  const latestTodayJournal = todayJournals[0];
  const streak = calculateJournalStreak(journals);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Total Balance Card - VVIP Luxury Indigo Gold Glow */}
      <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-slate-950/95 border border-indigo-500/30 hover:border-indigo-400/70 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/10">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-indigo-400" />
            <span>Total Saldo Bersih</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
            AKTIF
          </span>
        </div>
        <div className="mt-3 font-black text-2xl md:text-3xl text-white tracking-tight font-mono">
          {formatIDR(totalBalance)}
        </div>
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tunai: <strong className="text-slate-200 font-mono">{formatCompactIDR(cashBalance)}</strong></span>
          <span>Bank: <strong className="text-indigo-300 font-mono">{formatCompactIDR(bankBalance)}</strong></span>
          <span>E-Wallet: <strong className="text-slate-200 font-mono">{formatCompactIDR(ewalletBalance)}</strong></span>
        </div>
      </div>

      {/* 2. Monthly Expense Card - Rose Ruby Glow */}
      <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-950/95 border border-rose-500/25 hover:border-rose-400/60 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-rose-500/10">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-500/15 rounded-full blur-3xl group-hover:bg-rose-500/25 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            <span>Pengeluaran Bulan Ini</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
            OUTFLOW
          </span>
        </div>
        <div className="mt-3 font-black text-2xl md:text-3xl text-rose-400 font-mono tracking-tight">
          -{formatIDR(monthlyExpense)}
        </div>
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-emerald-400 flex items-center gap-1 font-bold font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            +{formatCompactIDR(monthlyIncome)}
          </span>
          <span className="text-slate-400">
            Sisa: <strong className="text-indigo-300 font-mono">{formatCompactIDR(remainingMoney)}</strong>
          </span>
        </div>
      </div>

      {/* 3. Today's Spent Card - Amber Gold Glow */}
      <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-950/95 border border-amber-500/25 hover:border-amber-400/60 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/10">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/15 rounded-full blur-3xl group-hover:bg-amber-500/25 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>Pengeluaran Hari Ini</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
            HARI INI
          </span>
        </div>
        <div className="mt-3 font-black text-2xl md:text-3xl text-amber-300 font-mono tracking-tight">
          {formatIDR(todaySpent)}
        </div>
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Status Budget: <strong className="text-emerald-400 font-bold">Terkontrol Aman ✅</strong></span>
        </div>
      </div>

      {/* 4. Gym & Journal Holistic Card - Emerald Flame Glow */}
      <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-950/95 border border-emerald-500/25 hover:border-emerald-400/60 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/10">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/15 rounded-full blur-3xl group-hover:bg-emerald-500/25 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kebugaran & Mental</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
            HOLISTIC
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <div>
            <div className="text-sm font-black text-slate-100">{lastWorkout?.workoutType || 'Workout Rutin'}</div>
            <div className="text-[11px] text-emerald-400 font-extrabold mt-0.5 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-orange-400" />
              <span>{streak} Hari Journal Streak 🔥</span>
            </div>
          </div>
          <div className="text-3xl p-2 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
            {latestTodayJournal ? (latestTodayJournal.mood === 5 ? '🔥' : (latestTodayJournal.mood === 3 ? '🙂' : '😀')) : '😀'}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Sesi Gym: <strong className="text-slate-200 font-mono">12x Bulan Ini</strong></span>
          <span className="text-indigo-300 font-medium">{todayJournals.length} Jurnal Hari Ini</span>
        </div>
      </div>

    </div>
  );
};
