import React from 'react';
import { useData } from '../../context/DataContext';
import { formatIDR } from '../../utils/formatters';
import { Compass, Wallet, Dumbbell, BookOpen, Trophy, Flame, Zap, ShieldCheck } from 'lucide-react';

export const MyLifeMasterDashboard: React.FC = () => {
  const { accounts, workouts, journals, habits } = useData();

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-slate-100 text-xl flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-400" />
            <span>MY LIFE — Master Long-Term Life Dashboard</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Satu dashboard utama untuk melihat seluruh perkembangan hidup secara makro.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Financial Progress */}
        <div className="bg-gradient-to-br from-indigo-950/40 via-slate-800/60 to-slate-800/40 p-5 rounded-2xl border border-indigo-500/30 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-indigo-400">
            <span className="flex items-center gap-1.5"><Wallet className="w-4 h-4" /> Financial Progress</span>
            <span className="text-slate-400">Target 100M</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{formatIDR(totalBalance)}</div>
          <div className="text-xs text-slate-400">Financial Health: <strong className="text-emerald-400">78/100</strong></div>
        </div>

        {/* Gym Progress */}
        <div className="bg-gradient-to-br from-rose-950/40 via-slate-800/60 to-slate-800/40 p-5 rounded-2xl border border-rose-500/30 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-rose-400">
            <span className="flex items-center gap-1.5"><Dumbbell className="w-4 h-4" /> Gym & Fitness</span>
            <span className="text-slate-400">Bench Press PR</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">47.5 kg</div>
          <div className="text-xs text-slate-400">Total Workouts: <strong className="text-rose-400">12 Sesi Bulan Ini</strong></div>
        </div>

        {/* Journal & Habit Streaks */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-800/60 to-slate-800/40 p-5 rounded-2xl border border-emerald-500/30 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-400">
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> Journal & Consistency</span>
            <span className="text-slate-400">Active Streak</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono flex items-center gap-2">
            <span>14 Hari</span>
            <Flame className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
          </div>
          <div className="text-xs text-slate-400">Habit Rate: <strong className="text-emerald-400">82% Completion</strong></div>
        </div>
      </div>
    </div>
  );
};
