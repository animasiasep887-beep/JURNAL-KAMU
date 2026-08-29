import React, { useState } from 'react';
import { EXERCISE_DATABASE } from '../../utils/initialData';
import { Exercise } from '../../types';
import { ExerciseGuideModal } from './ExerciseGuideModal';
import {
  Dumbbell,
  Search,
  BookOpen,
  Sparkles,
  ChevronRight,
  Flame,
  Target,
  Zap,
} from 'lucide-react';

interface ExerciseDatabaseProps {
  onSelectExerciseForWorkout?: (exercise: Exercise) => void;
}

export const ExerciseDatabase: React.FC<ExerciseDatabaseProps> = ({
  onSelectExerciseForWorkout,
}) => {
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [activeGuideExercise, setActiveGuideExercise] = useState<Exercise | null>(null);

  const muscles = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'];

  const filtered = EXERCISE_DATABASE.filter((ex) => {
    if (selectedMuscle !== 'All' && ex.muscleGroup !== selectedMuscle) return false;
    if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getMuscleBadgeColor = (group: string) => {
    switch (group) {
      case 'Chest':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Back':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Legs':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Shoulders':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Arms':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
                <span>Database Latihan Workout & Panduan Gerakan</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Beginner Friendly ✨
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Panduan lengkap langkah demi langkah, target otot, kesalahan umum, dan tips form untuk mencegah cedera.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama latihan / otot..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Muscle Group Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {muscles.map((m) => {
          const count = m === 'All' ? EXERCISE_DATABASE.length : EXERCISE_DATABASE.filter((e) => e.muscleGroup === m).length;
          return (
            <button
              key={m}
              onClick={() => setSelectedMuscle(m)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedMuscle === m
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{m === 'All' ? 'Semua Otot' : m}</span>
              <span className="text-[10px] opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className="group bg-slate-950/70 p-5 rounded-2xl border border-slate-800 hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-500/5 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-extrabold text-slate-100 text-sm group-hover:text-rose-300 transition-colors">
                  {ex.name}
                </h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-md shrink-0 ${getMuscleBadgeColor(ex.muscleGroup)}`}>
                  {ex.muscleGroup}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {ex.description}
              </p>

              {/* Equipment & Difficulty */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-semibold bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                  {ex.difficulty || 'Pemula'}
                </span>
                {ex.equipment && (
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    🛠️ {ex.equipment}
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Action: Open Guide Modal */}
            <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveGuideExercise(ex)}
                className="flex-1 py-2 px-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Panduan Gerakan & Form</span>
              </button>

              {onSelectExerciseForWorkout && (
                <button
                  onClick={() => onSelectExerciseForWorkout(ex)}
                  className="p-2 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 rounded-xl transition-colors"
                  title="Gunakan di Workout Logger"
                >
                  <Zap className="w-4 h-4 fill-current" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Guide Modal */}
      {activeGuideExercise && (
        <ExerciseGuideModal
          exercise={activeGuideExercise}
          onClose={() => setActiveGuideExercise(null)}
          onSelectForWorkout={onSelectExerciseForWorkout}
        />
      )}
    </div>
  );
};
