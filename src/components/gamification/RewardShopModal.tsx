import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { triggerConfetti } from '../../utils/confetti';
import { audioSynth } from '../../utils/audioSynth';
import { calculateJournalStreak } from '../../utils/formatters';
import {
  Gift,
  Coins,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  X,
  Coffee,
  Gamepad2,
  Film,
  BookOpen,
  Utensils,
  PartyPopper,
} from 'lucide-react';

interface RewardShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RewardShopModal: React.FC<RewardShopModalProps> = ({ isOpen, onClose }) => {
  const { rewards, addReward, claimReward, deleteReward, journals, tasks } = useData();
  const { showToast } = useNotification();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState<number>(200);
  const [newCategory, setNewCategory] = useState('Food & Drink');
  const [newDesc, setNewDesc] = useState('');

  if (!isOpen) return null;

  // Calculate earned total user coins (Streak * 50 + Completed Tasks * 20)
  const streak = calculateJournalStreak(journals);
  const doneTasksCount = tasks.filter((t) => t.status === 'done').length;
  const totalEarnedCoins = streak * 50 + doneTasksCount * 25 + 250;
  const spentCoins = rewards.filter((r) => r.isClaimed).reduce((sum, r) => sum + r.costCoins, 0);
  const currentAvailableCoins = Math.max(0, totalEarnedCoins - spentCoins);

  const handleClaim = (rewardId: string, cost: number, title: string) => {
    if (currentAvailableCoins < cost) {
      showToast(`Koin XP Anda (${currentAvailableCoins}) belum cukup untuk reward "${title}" (Butuh ${cost} Koin). Selesaikan lebih banyak task & jurnal!`, 'warning');
      return;
    }

    const success = claimReward(rewardId);
    if (success) {
      try {
        audioSynth.playSuccess();
      } catch (e) {}
      triggerConfetti();
      showToast(`🎉 Selamat! Anda berhasil menukar reward "${title}"! Nikmati self-reward Anda! ☕🎁`, 'success');
    }
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newCost <= 0) return;

    addReward({
      title: newTitle.trim(),
      costCoins: newCost,
      icon: 'Gift',
      category: newCategory,
      description: newDesc.trim() || 'Hadiah spesial atas konsistensi hidup',
    });

    showToast(`✅ Hadiah baru "${newTitle}" berhasil ditambahkan ke tokomu!`, 'success');
    setNewTitle('');
    setNewCost(200);
    setNewDesc('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-base sm:text-lg flex items-center gap-2">
                <span>Personal Reward & XP Shop</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  GAMIFICATION
                </span>
              </h3>
              <p className="text-xs text-slate-400">Tukarkan koin konsistensi dengan self-reward impianmu.</p>
            </div>
          </div>

          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-5 sm:p-6 space-y-6">
          <div className="bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-950 border border-amber-500/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                <Coins className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Saldo Koin XP Tersedia</span>
                <div className="text-3xl font-black text-amber-300 font-mono flex items-center gap-1.5">
                  <span>{currentAvailableCoins}</span>
                  <span className="text-sm font-sans font-bold text-amber-400/80">Koin XP</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Reward Sendiri</span>
              </button>
            </div>
          </div>

          {/* Add Reward Form */}
          {showAddForm && (
            <form onSubmit={handleCreateReward} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 animate-fade-in">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Tambah Self-Reward Kustom Baru
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nama Reward</label>
                  <input
                    type="text"
                    placeholder="Contoh: Beli Kopi Boba / Beli Sepatu Baru"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Harga Koin XP</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Deskripsi / Syarat</label>
                <input
                  type="text"
                  placeholder="Contoh: Boleh dinikmati setelah selesai 10 to-do list minggu ini"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-400 text-xs rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg"
                >
                  Simpan Hadiah
                </button>
              </div>
            </form>
          )}

          {/* Reward Items Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Daftar Pilihan Hadiah:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {rewards.map((rew) => {
                const canAfford = currentAvailableCoins >= rew.costCoins;

                return (
                  <div
                    key={rew.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      rew.isClaimed
                        ? 'bg-slate-950/40 border-slate-900 opacity-60'
                        : canAfford
                        ? 'bg-slate-950 border-amber-500/30 hover:border-amber-500/60 shadow-md shadow-amber-950/20'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-white text-sm">{rew.title}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono font-bold text-xs border border-amber-500/30 shrink-0">
                          {rew.costCoins} XP
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rew.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500">{rew.category || 'Hadiah'}</span>

                      <div className="flex items-center gap-2">
                        {rew.isClaimed ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Sudah Ditukar
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleClaim(rew.id, rew.costCoins, rew.title)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              canAfford
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            Tukar Sekarang
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteReward(rew.id)}
                          className="text-slate-600 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
