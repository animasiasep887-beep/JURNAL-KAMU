import React from 'react';
import { useData } from '../../context/DataContext';
import { formatIDR } from '../../utils/formatters';
import { Target, Trophy, Plus, CheckCircle, Circle } from 'lucide-react';

export const GoalManager: React.FC = () => {
  const { goals, updateGoalProgress } = useData();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <span>Manajemen Target & Goal Hidup (Short & Long Term)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Target keuangan, gym, dan personal beserta milestone & persentase progres.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((g) => {
          const percentage = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));

          return (
            <div key={g.id} className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md uppercase">
                  {g.type}
                </span>
                <span className="text-[11px] text-slate-400">Deadline: {g.deadline}</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-sm">{g.title}</h4>
                <div className="text-xs text-slate-400 mt-1">
                  Progres: <strong className="text-slate-200">{g.type === 'finance' ? formatIDR(g.currentValue) : `${g.currentValue} ${g.unit}`}</strong> / {g.type === 'finance' ? formatIDR(g.targetValue) : `${g.targetValue} ${g.unit}`}
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold mb-1">
                  <span className="text-indigo-400">{percentage}% Tercapai</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-1 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-slate-400">Milestones:</div>
                {g.milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 text-xs text-slate-300">
                    {m.completed ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5 text-slate-600" />}
                    <span className={m.completed ? 'line-through text-slate-500' : ''}>{m.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
