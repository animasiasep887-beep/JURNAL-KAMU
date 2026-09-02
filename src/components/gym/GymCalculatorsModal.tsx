import React, { useState } from 'react';
import { Calculator, Dumbbell, Scale, X, Sparkles, Check, ArrowRight } from 'lucide-react';

interface GymCalculatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GymCalculatorsModal: React.FC<GymCalculatorsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'plate' | '1rm'>('plate');

  // Plate Calculator State
  const [targetWeight, setTargetWeight] = useState<number>(60);
  const [barWeight, setBarWeight] = useState<number>(20);

  // 1RM Calculator State
  const [liftWeight, setLiftWeight] = useState<number>(80);
  const [reps, setReps] = useState<number>(5);

  if (!isOpen) return null;

  // Calculate Plates on each side
  const calculatePlates = () => {
    const weightPerSide = Math.max(0, (targetWeight - barWeight) / 2);
    let remaining = weightPerSide;
    const plateDenominations = [25, 20, 15, 10, 5, 2.5, 1.25];
    const platesUsed: { weight: number; count: number }[] = [];

    plateDenominations.forEach((plate) => {
      if (remaining >= plate) {
        const count = Math.floor(remaining / plate);
        platesUsed.push({ weight: plate, count });
        remaining = Number((remaining % plate).toFixed(2));
      }
    });

    return { weightPerSide, platesUsed, leftover: remaining };
  };

  const { weightPerSide, platesUsed, leftover } = calculatePlates();

  // 1RM Brzycki formula: weight / (1.0278 - (0.0278 * reps))
  const oneRepMax = reps === 1 ? liftWeight : Math.round(liftWeight * (1 + reps / 30));

  const percentages = [
    { pct: 100, reps: 1, label: '100% 1RM' },
    { pct: 95, reps: 2, label: '95% (~2 Reps)' },
    { pct: 90, reps: 4, label: '90% (~4 Reps)' },
    { pct: 85, reps: 6, label: '85% (~6 Reps)' },
    { pct: 80, reps: 8, label: '80% (~8 Reps)' },
    { pct: 75, reps: 10, label: '75% (~10 Reps)' },
    { pct: 70, reps: 12, label: '70% (~12 Reps)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-base sm:text-lg">Kalkulator Gym & Barbell</h3>
              <p className="text-xs text-slate-400">Plate Barbell Calculator & 1RM Estimator.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('plate')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'plate' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Plate Calculator
              </button>
              <button
                onClick={() => setActiveTab('1rm')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === '1rm' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                1RM Estimator
              </button>
            </div>

            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: PLATE CALCULATOR */}
        {activeTab === 'plate' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Target Total Beban (kg)</label>
                <input
                  type="number"
                  step="2.5"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Berat Barbell Olympic (kg)</label>
                <select
                  value={barWeight}
                  onChange={(e) => setBarWeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                >
                  <option value="20">20 kg (Standar Pria Olympic)</option>
                  <option value="15">15 kg (Standar Wanita / Crossfit)</option>
                  <option value="10">10 kg (Bar Pendek / EZ Curl)</option>
                </select>
              </div>
            </div>

            {/* Visual Plate Barbell Representation */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Beban per sisi (kiri & kanan):</span>
                <span className="text-amber-400 font-mono font-bold text-sm">{weightPerSide} kg / sisi</span>
              </div>

              {/* Plates breakdown */}
              {platesUsed.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">Piringan yang dipasang di satu sisi:</span>
                  <div className="flex flex-wrap gap-2">
                    {platesUsed.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-3 py-2 bg-indigo-950/60 border border-indigo-500/40 rounded-xl text-xs font-mono font-bold text-indigo-300"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-sans">
                          {p.count}x
                        </span>
                        <span>{p.weight} kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">Target beban sama dengan atau di bawah berat barbell kosong.</div>
              )}

              {leftover > 0 && (
                <div className="text-[11px] text-amber-400/80">
                  *Sisa {leftover} kg tidak dapat dibagi pas dengan plate terkecil (1.25 kg).
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: 1RM ESTIMATOR */}
        {activeTab === '1rm' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Beban Angkatan Terakhir (kg)</label>
                <input
                  type="number"
                  step="2.5"
                  value={liftWeight}
                  onChange={(e) => setLiftWeight(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Jumlah Repetisi (Reps)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={reps}
                  onChange={(e) => setReps(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Estimated 1RM Result Banner */}
            <div className="bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-950 border border-amber-500/30 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 block">Estimasi 1 Rep Max (1RM) Anda:</span>
                <span className="text-3xl font-black text-amber-400 font-mono">{oneRepMax} kg</span>
              </div>
              <span className="px-3 py-1.5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30">
                Formula Brzycki
              </span>
            </div>

            {/* Percentage Table for Training */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">Panduan Persentase Beban Latihan:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {percentages.map((p) => {
                  const targetKg = Math.round((oneRepMax * p.pct) / 100);
                  return (
                    <div key={p.pct} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1">
                      <div className="text-[11px] text-slate-500 font-medium">{p.label}</div>
                      <div className="text-sm font-black font-mono text-white">{targetKg} kg</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Tutup Kalkulator
          </button>
        </div>
      </div>
    </div>
  );
};
