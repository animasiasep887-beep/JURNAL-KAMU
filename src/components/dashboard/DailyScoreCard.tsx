import React from 'react';
import { useData } from '../../context/DataContext';
import { calculateDailyScore } from '../../utils/analyticsEngine';
import { getTodayString } from '../../utils/formatters';
import { Zap, Award, CheckCircle, TrendingUp, Sparkles, Brain, ShieldCheck } from 'lucide-react';

export const DailyScoreCard: React.FC = () => {
  const { transactions, tasks, workouts, habitLogs, journals, budgets } = useData();
  const today = getTodayString();

  const scoreData = calculateDailyScore(today, transactions, tasks, workouts, habitLogs, journals, budgets);

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'S+', title: 'GODLIKE PERFORMANCE', color: 'text-amber-300 from-amber-500 to-yellow-400' };
    if (score >= 80) return { grade: 'A', title: 'EXCELLENT DISCIPLINE', color: 'text-emerald-300 from-emerald-500 to-teal-400' };
    if (score >= 70) return { grade: 'B', title: 'SOLID PROGRESS', color: 'text-indigo-300 from-indigo-500 to-violet-400' };
    return { grade: 'C', title: 'NEEDS MOMENTUM', color: 'text-rose-300 from-rose-500 to-orange-400' };
  };

  const gradeInfo = getScoreGrade(scoreData.totalScore);

  return (
    <div className="relative group overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900/90 to-indigo-950/40 border border-slate-800/80 hover:border-indigo-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300">
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Futuristic Circular HUD Score */}
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center">
            {/* Outer Glowing Ring */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-400 p-1 shadow-xl shadow-indigo-600/30 flex items-center justify-center animate-spin-slow">
              <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center p-2">
                <span className="text-3xl font-black text-white font-mono tracking-tight leading-none">
                  {scoreData.totalScore}
                </span>
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest mt-0.5">
                  SCORE
                </span>
              </div>
            </div>
            {/* Grade Badge */}
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] shadow-md">
              {gradeInfo.grade}
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-extrabold mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{gradeInfo.title}</span>
            </div>
            <h2 className="font-black text-slate-100 text-lg sm:text-xl tracking-tight">
              Life OS Daily Holistic Telemetry
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-sm leading-relaxed">
              Algoritma AI mengevaluasi korelasi keuangan, task selesai, konsistensi gym, habit, dan refleksi mental Anda secara transparan.
            </p>
          </div>
        </div>

        {/* Right: Factor Progress Bars with Holographic Meters */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/90 shadow-inner">
          {[
            { label: 'Finance', score: scoreData.financeScore, max: 25, color: 'from-emerald-500 to-teal-400', icon: '💰' },
            { label: 'Task & Work', score: scoreData.productivityScore, max: 25, color: 'from-indigo-500 to-blue-400', icon: '⚡' },
            { label: 'Gym & Body', score: scoreData.gymScore, max: 20, color: 'from-rose-500 to-orange-400', icon: '🏋️' },
            { label: 'Habit Matrix', score: scoreData.habitScore, max: 15, color: 'from-amber-500 to-yellow-400', icon: '🔁' },
            { label: 'Journal Mental', score: scoreData.journalScore, max: 15, color: 'from-purple-500 to-violet-400', icon: '🧠' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col justify-between p-1.5 rounded-xl hover:bg-slate-900/60 transition-colors">
              <div className="flex justify-between items-center text-[11px] mb-1.5">
                <span className="text-slate-300 font-bold text-[10.5px] flex items-center gap-1">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                <span className="text-slate-200 font-mono font-extrabold text-[11px]">{item.score}/{item.max}</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700 shadow-sm`}
                  style={{ width: `${Math.max(8, (item.score / item.max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Insights Ticker */}
      {scoreData.insights.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center gap-2 text-xs text-indigo-300">
          <Brain className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium truncate">{scoreData.insights.join(' • ')}</span>
        </div>
      )}
    </div>
  );
};
