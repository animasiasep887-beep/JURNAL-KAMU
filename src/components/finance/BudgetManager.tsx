import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatIDR } from '../../utils/formatters';
import { audioSynth } from '../../utils/audioSynth';
import {
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  Receipt,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

export const BudgetManager: React.FC = () => {
  const { budgets, transactions, setBudgetLimit } = useData();
  const [editingCategory, setEditingCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !newLimit) return;
    setBudgetLimit(editingCategory, parseFloat(newLimit));
    audioSynth.playSuccess(0.1);
    setEditingCategory('');
    setNewLimit('');
  };

  const categories = [
    { name: 'Makanan & Minuman', icon: Utensils, defaultLimit: 1500000, color: 'from-amber-500 to-orange-500' },
    { name: 'Transportasi', icon: Car, defaultLimit: 600000, color: 'from-blue-500 to-cyan-500' },
    { name: 'Belanja & Kebutuhan', icon: ShoppingBag, defaultLimit: 1000000, color: 'from-purple-500 to-indigo-500' },
    { name: 'Hiburan & Hobi', icon: Gamepad2, defaultLimit: 500000, color: 'from-pink-500 to-rose-500' },
    { name: 'Tagihan & Utilitas', icon: Receipt, defaultLimit: 800000, color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Visual Budget Meter & Pembatas Kategori</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Kontrol pengeluaran per kategori & dapatkan peringatan otomatis jika mendekati limit bulanan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((catObj) => {
          const cat = catObj.name;
          const Icon = catObj.icon;
          const budgetObj = budgets.find((b) => b.category === cat);
          const limit = budgetObj?.monthlyLimit || catObj.defaultLimit;
          const spent = transactions
            .filter((t) => t.type === 'expense' && t.category === cat)
            .reduce((sum, t) => sum + t.amount, 0);

          const remaining = limit - spent;
          const percentage = Math.min(100, Math.round((spent / limit) * 100));

          const isOver = spent > limit;
          const isWarning = percentage >= 80 && !isOver;

          return (
            <div
              key={cat}
              className={`bg-slate-950/70 border p-5 rounded-2xl space-y-3.5 transition-all group ${
                isOver
                  ? 'border-rose-500/50 bg-rose-950/10'
                  : isWarning
                  ? 'border-amber-500/50 bg-amber-950/10'
                  : 'border-slate-800/90 hover:border-indigo-500/40'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-100">{cat}</span>
                </div>
                <button
                  onClick={() => {
                    audioSynth.playClick();
                    setEditingCategory(cat);
                    setNewLimit(String(limit));
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 transition-colors"
                >
                  Ubah Limit
                </button>
              </div>

              <div className="flex justify-between items-baseline text-xs">
                <span className="text-slate-400">
                  Terpakai: <strong className="text-white font-mono">{formatIDR(spent)}</strong>
                </span>
                <span className="text-slate-400">
                  Limit: <strong className="text-slate-300 font-mono">{formatIDR(limit)}</strong>
                </span>
              </div>

              {/* Glowing Interactive Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isOver
                        ? 'bg-gradient-to-r from-rose-600 to-red-500 shadow-md shadow-rose-600/50 animate-pulse'
                        : isWarning
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-md shadow-amber-500/40'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/40'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                  <span className="font-semibold text-slate-300">{percentage}% Digunakan</span>
                  <span className={remaining >= 0 ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                    {remaining >= 0 ? `Sisa: ${formatIDR(remaining)}` : `Minus: ${formatIDR(Math.abs(remaining))}`}
                  </span>
                </div>
              </div>

              {/* Warning badges */}
              {isWarning && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>⚠️ Pengeluaran sudah mendekati batas ({percentage}%)!</span>
                </div>
              )}

              {isOver && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>🔴 Budget terlampaui sebesar {formatIDR(Math.abs(remaining))}! Rem jajan dulu!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingCategory && (
        <form onSubmit={handleSave} className="bg-slate-950/80 p-5 rounded-2xl border border-indigo-500/40 space-y-3 animate-scale-up">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Atur Limit Budget Bulanan: {editingCategory}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              placeholder="Masukkan batas budget dalam Rp"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-xs font-mono outline-none focus:border-indigo-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Simpan Target
              </button>
              <button
                type="button"
                onClick={() => setEditingCategory('')}
                className="px-3 py-2.5 bg-slate-800 text-slate-400 hover:text-white text-xs rounded-xl"
              >
                Batal
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
