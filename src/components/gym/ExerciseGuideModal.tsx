import React from 'react';
import { Exercise } from '../../types';
import {
  X,
  Dumbbell,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Zap,
  Target,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ExerciseGuideModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onSelectForWorkout?: (exercise: Exercise) => void;
}

export const ExerciseGuideModal: React.FC<ExerciseGuideModalProps> = ({
  exercise,
  onClose,
  onSelectForWorkout,
}) => {
  if (!exercise) return null;

  const getMuscleBadgeColor = (group: string) => {
    switch (group) {
      case 'Chest':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Back':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Legs':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Shoulders':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Arms':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getMuscleBadgeColor(exercise.muscleGroup)}`}>
                {exercise.muscleGroup}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {exercise.difficulty || 'Pemula'}
              </span>
              {exercise.equipment && (
                <span className="text-[11px] text-slate-400 flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                  <Dumbbell className="w-3 h-3 text-indigo-400" />
                  <span>{exercise.equipment}</span>
                </span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              {exercise.name}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">{exercise.description}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Movement Demonstration Illustration Box */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shadow-lg shadow-indigo-500/10 animate-pulse">
            <Dumbbell className="w-8 h-8" />
          </div>

          <div>
            <div className="text-xs font-bold text-indigo-300 tracking-wider uppercase flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Panduan Gerakan Anatomis & Form Standard</span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto mt-1">
              Fokus pada koneksi pikiran-otot (Mind-Muscle Connection) & kendali beban, bukan ego lifting.
            </p>
          </div>

          {/* Target Muscles Chips */}
          {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
            <div className="pt-2 flex flex-wrap justify-center gap-1.5">
              {exercise.targetMuscles.map((tm, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  🎯 {tm}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Step-by-Step Instructions */}
        {exercise.steps && exercise.steps.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Langkah-Langkah Gerakan (Step-by-Step):</span>
            </h4>
            <div className="space-y-2">
              {exercise.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-slate-950/70 border border-slate-800/90 p-3.5 rounded-xl text-xs text-slate-300 leading-relaxed"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Mistakes to Avoid */}
        {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
          <div className="space-y-2.5 bg-rose-950/20 border border-rose-500/20 p-4 rounded-2xl">
            <h4 className="text-xs font-bold text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Kesalahan Umum yang Harus Dihindari:</span>
            </h4>
            <div className="space-y-1.5">
              {exercise.commonMistakes.map((mistake, idx) => (
                <div key={idx} className="text-xs text-rose-200/90 flex items-start gap-2">
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pro Tips / Form Cues */}
        {exercise.proTips && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-300">Tips Pro / Form Cue Rahasia:</div>
              <p className="text-xs text-amber-100/90 mt-0.5 leading-relaxed">{exercise.proTips}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-800">
          {onSelectForWorkout && (
            <button
              onClick={() => {
                onSelectForWorkout(exercise);
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Gunakan Latihan Ini di Workout Logger</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="py-3 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
