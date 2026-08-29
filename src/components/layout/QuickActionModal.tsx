import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { X, Wallet, BookOpen, Clock, CheckSquare, Dumbbell, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { getTodayString, getNowTimeString } from '../../utils/formatters';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose }) => {
  const { accounts, addTransaction, saveJournalEntry, addTask, addActivity, addWorkoutLog } = useData();
  const { showToast } = useNotification();
  const [activeType, setActiveType] = useState<'expense' | 'income' | 'journal' | 'task' | 'activity' | 'workout'>('expense');

  // Expense/Income Form State
  const [amount, setAmount] = useState('');
  const [item, setItem] = useState('');
  const [category, setCategory] = useState('Makanan & Minuman');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Journal Form State
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState<number>(5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = getTodayString();
    const nowTime = getNowTimeString();

    if (activeType === 'expense' || activeType === 'income') {
      const numAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
      if (!numAmount || !item.trim()) {
        showToast('Mohon isi nominal dan nama item!', 'error');
        return;
      }

      addTransaction({
        type: activeType,
        amount: numAmount,
        category: activeType === 'income' ? 'Pemasukan' : category,
        description: item,
        sourceAccountId: accountId || accounts[0]?.id || 'acc-1',
        paymentMethod: accounts.find((a) => a.id === accountId)?.name || 'Cash',
        date: today,
        time: nowTime,
        timestamp: new Date().toISOString(),
        tags: ['#quickaction'],
      });

      showToast(`Berhasil mencatat ${activeType === 'expense' ? 'Pengeluaran' : 'Pemasukan'} Rp${numAmount.toLocaleString('id-ID')}!`);
    } else if (activeType === 'task') {
      if (!taskTitle.trim()) {
        showToast('Mohon isi judul task!', 'error');
        return;
      }
      addTask({
        title: taskTitle,
        priority: taskPriority,
        status: 'todo',
        category: 'Personal',
        dueDate: today,
        checklist: [],
        tags: ['#task'],
      });
      showToast('Task baru berhasil ditambahkan!');
    } else if (activeType === 'journal') {
      if (!journalContent.trim()) {
        showToast('Isi jurnal harian terlebih dahulu!', 'error');
        return;
      }
      saveJournalEntry({
        date: today,
        title: `Jurnal ${today}`,
        content: journalContent,
        mood: journalMood as any,
        energyLevel: 8,
        stressLevel: 3,
        motivationLevel: 8,
        tags: ['#journal'],
      });
      showToast('Jurnal harian tersimpan!');
    }

    onClose();
    // Reset Form
    setAmount('');
    setItem('');
    setTaskTitle('');
    setJournalContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>⚡ Quick Action</span>
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-xl">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 bg-slate-800/60 rounded-xl mb-5">
          {[
            { id: 'expense', label: 'Pengeluaran', icon: ArrowDownLeft, color: 'text-rose-400' },
            { id: 'income', label: 'Pemasukan', icon: ArrowUpRight, color: 'text-emerald-400' },
            { id: 'task', label: 'Task', icon: CheckSquare, color: 'text-amber-400' },
            { id: 'journal', label: 'Journal', icon: BookOpen, color: 'text-indigo-400' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveType(tab.id as any)}
                className={`py-2 px-1 rounded-lg text-[11px] font-semibold flex flex-col items-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {(activeType === 'expense' || activeType === 'income') && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 15000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 font-mono focus:ring-2 focus:ring-indigo-500 outline-none text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Item / Deskripsi</label>
                <input
                  type="text"
                  placeholder="Contoh: Kopi Kenangan, Ayam Geprek"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {activeType === 'expense' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Makanan & Minuman">Makanan & Minuman</option>
                    <option value="Transportasi">Transportasi</option>
                    <option value="Belanja & Kebutuhan">Belanja & Kebutuhan</option>
                    <option value="Tagihan & Utilitas">Tagihan & Utilitas</option>
                    <option value="Kesehatan & Fitnes">Kesehatan & Fitnes</option>
                    <option value="Hiburan & Hobi">Hiburan & Hobi</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Akun Sumber / Tujuan</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} — Rp{acc.balance.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {activeType === 'task' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Judul Task / Kegaiatan</label>
                <input
                  type="text"
                  placeholder="Contoh: Selesaikan Laporan SaaS"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Prioritas</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'high', label: '🔴 High' },
                    { val: 'medium', label: '🟡 Medium' },
                    { val: 'low', label: '🟢 Low' },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setTaskPriority(p.val as any)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        taskPriority === p.val
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeType === 'journal' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Mood Hari Ini</label>
                <div className="flex justify-between gap-2 p-2 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                  {[
                    { val: 5, emoji: '😀', label: 'Sangat Baik' },
                    { val: 4, emoji: '🙂', label: 'Baik' },
                    { val: 3, emoji: '😐', label: 'Biasa' },
                    { val: 2, emoji: '😕', label: 'Kurang' },
                    { val: 1, emoji: '😞', label: 'Buruk' },
                  ].map((m) => (
                    <button
                      key={m.val}
                      type="button"
                      onClick={() => setJournalMood(m.val)}
                      className={`flex-1 py-2 rounded-xl flex flex-col items-center transition-all ${
                        journalMood === m.val ? 'bg-indigo-600 text-white scale-105' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <span className="text-[10px] font-medium mt-1">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Catatan Jurnal / Highlight</label>
                <textarea
                  rows={4}
                  placeholder="Apa yang terjadi hari ini? Apa yang dipelajari?"
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-100 placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
