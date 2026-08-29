import React from 'react';
import { useData } from '../../context/DataContext';
import { Dumbbell, Trophy, ArrowRight } from 'lucide-react';

export const WorkoutQuickSummary: React.FC<{ onNavigateToGym: () => void }> = ({ onNavigateToGym }) => {
  const { workouts } = useData();
  const lastWorkout = workouts[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-rose-400" />
            <span>Gym & Workout Progress</span>
          </h3>
          <button onClick={onNavigateToGym} className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold">
            Gym Journal <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {lastWorkout ? (
          <div className="bg-gradient-to-br from-rose-950/30 via-slate-800/60 to-slate-800/40 border border-rose-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">{lastWorkout.workoutType}</span>
              <span className="text-[10px] text-slate-400 font-mono">{lastWorkout.date}</span>
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-100">
              {lastWorkout.exerciseLogs.length} Latihan • {lastWorkout.durationMinutes} Menit
            </div>

            <div className="mt-3 space-y-1 text-xs text-slate-300">
              {lastWorkout.exerciseLogs.slice(0, 2).map((log) => (
                <div key={log.id} className="flex justify-between items-center text-[11px] bg-slate-900/60 p-2 rounded-lg">
                  <span className="font-medium text-slate-200">{log.exerciseName}</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {Math.max(...log.sets.map((s) => s.weightKg))} kg max
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">Belum ada data workout.</div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-medium">
          <Trophy className="w-4 h-4" />
          <span>PR Bench Press: 47.5 kg</span>
        </div>
        <span className="text-slate-400">Total: 12 Sesi</span>
      </div>
    </div>
  );
};
