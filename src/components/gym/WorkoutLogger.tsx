import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { EXERCISE_DATABASE } from '../../utils/initialData';
import { WorkoutSet, WorkoutExerciseLog, Exercise } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { getTodayString } from '../../utils/formatters';
import { ExerciseGuideModal } from './ExerciseGuideModal';
import { GymCalculatorsModal } from './GymCalculatorsModal';
import {
  Dumbbell,
  Plus,
  Trash2,
  Save,
  Trophy,
  BookOpen,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  Flame,
  CheckCircle2,
  Calculator,
} from 'lucide-react';

export const WorkoutLogger: React.FC = () => {
  const { addWorkoutLog } = useData();
  const { showToast } = useNotification();

  const [workoutType, setWorkoutType] = useState('Chest + Triceps');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [selectedExerciseId, setSelectedExerciseId] = useState(EXERCISE_DATABASE[0].id);
  const [activeGuideModal, setActiveGuideModal] = useState<Exercise | null>(null);

  // Rest Timer State
  const [restSeconds, setRestSeconds] = useState(90);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showCalculators, setShowCalculators] = useState(false);

  // Sets logging state
  const [sets, setSets] = useState<WorkoutSet[]>([
    { id: 's-1', setNumber: 1, reps: 10, weightKg: 40, rpe: 7 },
    { id: 's-2', setNumber: 2, reps: 8, weightKg: 45, rpe: 8 },
    { id: 's-3', setNumber: 3, reps: 6, weightKg: 47.5, rpe: 9 },
  ]);

  const currentExercise = EXERCISE_DATABASE.find((e) => e.id === selectedExerciseId) || EXERCISE_DATABASE[0];

  // Rest Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isRestTimerRunning && restSeconds > 0) {
      interval = setInterval(() => {
        setRestSeconds((prev) => prev - 1);
      }, 1000);
    } else if (restSeconds === 0 && isRestTimerRunning) {
      setIsRestTimerRunning(false);
      showToast('🔔 Waktu Istirahat Selesai! Saatnya gas set berikutnya! 💪');
    }
    return () => clearInterval(interval);
  }, [isRestTimerRunning, restSeconds]);

  const startRestTimer = (seconds = 90) => {
    setRestSeconds(seconds);
    setIsRestTimerRunning(true);
    setShowRestTimer(true);
    showToast(`⏱️ Istirahat ${seconds} detik dimulai! Tarik napas & minum air.`);
  };

  const addSet = () => {
    const nextSetNumber = sets.length + 1;
    const lastSet = sets[sets.length - 1] || { reps: 10, weightKg: 40, rpe: 8 };
    setSets([
      ...sets,
      {
        id: `s-${Date.now()}`,
        setNumber: nextSetNumber,
        reps: lastSet.reps,
        weightKg: lastSet.weightKg,
        rpe: lastSet.rpe,
      },
    ]);
    startRestTimer(90);
  };

  const updateSet = (idx: number, field: keyof WorkoutSet, val: number) => {
    const updated = [...sets];
    updated[idx] = { ...updated[idx], [field]: val };
    setSets(updated);
  };

  const deleteSet = (idx: number) => {
    setSets(sets.filter((_, i) => i !== idx));
  };

  const handleApplyPresetRoutine = (type: string, exId: string) => {
    setWorkoutType(type);
    setSelectedExerciseId(exId);
    setSets([
      { id: `s-${Date.now()}-1`, setNumber: 1, reps: 12, weightKg: 30, rpe: 7 },
      { id: `s-${Date.now()}-2`, setNumber: 2, reps: 10, weightKg: 35, rpe: 8 },
      { id: `s-${Date.now()}-3`, setNumber: 3, reps: 8, weightKg: 40, rpe: 9 },
    ]);
    showToast(`✨ Template Rutinitas (${type}) Berhasil Diterapkan!`);
  };

  const handleSaveWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const exObj = EXERCISE_DATABASE.find((e) => e.id === selectedExerciseId) || EXERCISE_DATABASE[0];

    const exerciseLog: WorkoutExerciseLog = {
      id: `el-${Date.now()}`,
      exerciseId: exObj.id,
      exerciseName: exObj.name,
      muscleGroup: exObj.muscleGroup,
      sets,
    };

    addWorkoutLog({
      date: getTodayString(),
      startTime: '17:00',
      durationMinutes,
      workoutType,
      muscleGroups: [exObj.muscleGroup],
      exerciseLogs: [exerciseLog],
    });

    showToast(`🎉 Sesi Workout (${workoutType}) Berhasil Disimpan! Progressive Overload Terpantau! 🔥`);
  };

  return (
    <form onSubmit={handleSaveWorkout} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-rose-400 rounded-xl">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
                <span>Catat Sesi Workout & Sets / Reps</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md">
                  Progressive Overload 📈
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Catat beban (kg), repetisi, dan manfaatkan panduan gerakan agar latihan efektif dan bebas cedera.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCalculators(true)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            <span>Kalkulator Plate & 1RM</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRestTimer(!showRestTimer)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Timer className="w-4 h-4" />
            <span>Rest Timer</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Workout</span>
          </button>
        </div>
      </div>

      <GymCalculatorsModal isOpen={showCalculators} onClose={() => setShowCalculators(false)} />

      {/* Beginner Helper Tip Banner */}
      <div className="p-3.5 bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/20 rounded-2xl flex items-start gap-3 text-xs text-indigo-200">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-indigo-300">💡 Cara Mudah Mengisi Bagi Pemula:</span>
          <p className="text-[11px] text-slate-400">
            Pilih nama gerakan di bawah. Jika belum tahu cara melakukannya, klik tombol <strong>"📖 Panduan Gerakan"</strong> untuk melihat langkah eksekusi & tips posisi badan yang benar.
          </p>
        </div>
      </div>

      {/* Preset Split Templates */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">⚡ Template Rutinitas Cepat (1-Klik):</span>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '🏋️ Chest & Triceps Day', type: 'Chest + Triceps', exId: 'ex-1' },
            { label: '💪 Back & Biceps Day', type: 'Back + Biceps', exId: 'ex-4' },
            { label: '🦵 Heavy Leg Day', type: 'Leg Day', exId: 'ex-6' },
            { label: '🛡️ Shoulders & Arms', type: 'Shoulders & Arms', exId: 'ex-8' },
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPresetRoutine(preset.type, preset.exId)}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-all hover:border-slate-700 active:scale-95"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rest Timer Drawer */}
      {showRestTimer && (
        <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-300">Rest Timer Antar Set:</div>
              <div className="text-2xl font-extrabold text-white font-mono">{restSeconds} Detik</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[60, 90, 120].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => startRestTimer(sec)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                {sec}s
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsRestTimerRunning(!isRestTimerRunning)}
              className={`p-2 rounded-xl text-xs font-bold ${
                isRestTimerRunning ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {isRestTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRestTimerRunning(false);
                setRestSeconds(90);
              }}
              className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-4">
          <label className="block text-xs font-bold text-slate-300 mb-1.5">Tipe Sesi Latihan</label>
          <input
            type="text"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            placeholder="Contoh: Chest + Triceps"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="md:col-span-5">
          <label className="block text-xs font-bold text-slate-300 mb-1.5">Pilih Latihan</label>
          <div className="flex gap-2">
            <select
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs font-semibold outline-none focus:ring-2 focus:ring-rose-500"
            >
              {EXERCISE_DATABASE.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.muscleGroup})
                </option>
              ))}
            </select>

            {/* View Movement Guide Button */}
            <button
              type="button"
              onClick={() => setActiveGuideModal(currentExercise)}
              className="px-3.5 py-2.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
              title="Lihat Contoh Gerakan & Panduan Form"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Panduan</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-slate-300 mb-1.5">Durasi Latihan (Menit)</label>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs font-mono outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Sets Table */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
          <span className="flex items-center gap-2">
            <span>Daftar Set: {currentExercise.name}</span>
            <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              {currentExercise.muscleGroup}
            </span>
          </span>
          <button
            type="button"
            onClick={addSet}
            className="px-3 py-1.5 bg-rose-600/10 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl flex items-center gap-1 text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" /> Tambah Set (+Rest)
          </button>
        </div>

        <div className="space-y-2.5">
          {sets.map((s, idx) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all"
            >
              <span className="font-extrabold text-xs text-rose-400 font-mono w-16">
                SET {s.setNumber}
              </span>

              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Beban:</span>
                  <input
                    type="number"
                    value={s.weightKg}
                    onChange={(e) => updateSet(idx, 'weightKg', parseFloat(e.target.value) || 0)}
                    className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs font-mono font-bold outline-none text-center focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="text-xs text-slate-400 font-bold">kg</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Reps:</span>
                  <input
                    type="number"
                    value={s.reps}
                    onChange={(e) => updateSet(idx, 'reps', parseInt(e.target.value) || 0)}
                    className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs font-mono font-bold outline-none text-center focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="text-xs text-slate-400 font-bold">reps</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteSet(idx)}
                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                title="Hapus Set"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Guide Modal Trigger */}
      {activeGuideModal && (
        <ExerciseGuideModal
          exercise={activeGuideModal}
          onClose={() => setActiveGuideModal(null)}
        />
      )}
    </form>
  );
};
