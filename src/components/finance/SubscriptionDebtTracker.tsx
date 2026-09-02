import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { formatIDR } from '../../utils/formatters';
import { RecurringSubscription, DebtItem } from '../../types';
import {
  CreditCard,
  Repeat,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  DollarSign,
  UserCheck,
  Check,
  X,
  Tv,
  Music,
  Cloud,
  Dumbbell,
  ShieldAlert,
} from 'lucide-react';

export const SubscriptionDebtTracker: React.FC = () => {
  const {
    recurringSubs,
    addRecurringSub,
    updateRecurringSub,
    deleteRecurringSub,
    debts,
    addDebt,
    deleteDebt,
    recordDebtPayment,
  } = useData();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'subs' | 'debts'>('subs');

  // Subscriptions Modal State
  const [showSubModal, setShowSubModal] = useState(false);
  const [subName, setSubName] = useState('');
  const [subAmount, setSubAmount] = useState<number>(50000);
  const [subCycle, setSubCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [subDay, setSubDay] = useState<number>(1);
  const [subCategory, setSubCategory] = useState('Hiburan');
  const [subNotes, setSubNotes] = useState('');

  // Debts Modal State
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [debtType, setDebtType] = useState<'payable' | 'receivable'>('receivable');
  const [personName, setPersonName] = useState('');
  const [debtAmount, setDebtAmount] = useState<number>(100000);
  const [debtDueDate, setDebtDueDate] = useState('');
  const [debtNotes, setDebtNotes] = useState('');

  // Payment Settlement Modal
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState<DebtItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Calculations
  const totalMonthlySubs = recurringSubs
    .filter((s) => s.isActive)
    .reduce((sum, s) => sum + (s.billingCycle === 'monthly' ? s.amount : s.amount / 12), 0);

  const totalReceivable = debts
    .filter((d) => d.type === 'receivable' && d.status !== 'settled')
    .reduce((sum, d) => sum + (d.amount - d.paidAmount), 0);

  const totalPayable = debts
    .filter((d) => d.type === 'payable' && d.status !== 'settled')
    .reduce((sum, d) => sum + (d.amount - d.paidAmount), 0);

  const handleCreateSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || subAmount <= 0) {
      showToast('Mohon isi nama dan nominal langganan.', 'error');
      return;
    }

    addRecurringSub({
      name: subName.trim(),
      amount: subAmount,
      billingCycle: subCycle,
      billingDay: subDay,
      category: subCategory,
      isActive: true,
      notes: subNotes.trim(),
    });

    showToast(`✅ Langganan ${subName} berhasil ditambahkan!`, 'success');
    setShowSubModal(false);
    setSubName('');
    setSubAmount(50000);
  };

  const handleCreateDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim() || debtAmount <= 0) {
      showToast('Mohon isi nama orang dan nominal uang.', 'error');
      return;
    }

    addDebt({
      type: debtType,
      personName: personName.trim(),
      amount: debtAmount,
      paidAmount: 0,
      dueDate: debtDueDate || undefined,
      notes: debtNotes.trim(),
      status: 'unpaid',
    });

    showToast(`✅ Catatan ${debtType === 'receivable' ? 'piutang' : 'hutang'} berhasil disimpan!`, 'success');
    setShowDebtModal(false);
    setPersonName('');
    setDebtAmount(100000);
  };

  const handleRecordPayment = () => {
    if (!selectedDebtForPayment || paymentAmount <= 0) return;
    recordDebtPayment(selectedDebtForPayment.id, paymentAmount);
    showToast(`✅ Pembayaran sebesar ${formatIDR(paymentAmount)} berhasil dicatat!`, 'success');
    setSelectedDebtForPayment(null);
    setPaymentAmount(0);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Tab Switcher & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-slate-100 text-base sm:text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            <span>Langganan Rutin & Catatan Hutang/Piutang</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Pantau pengeluaran berulang bulanan serta pinjaman aktif.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('subs')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'subs' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Langganan ({recurringSubs.length})
            </button>
            <button
              onClick={() => setActiveTab('debts')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'debts' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hutang / Piutang ({debts.filter((d) => d.status !== 'settled').length})
            </button>
          </div>

          {activeTab === 'subs' ? (
            <button
              onClick={() => setShowSubModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Langganan
            </button>
          ) : (
            <button
              onClick={() => setShowDebtModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Catatan
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: RECURRING SUBSCRIPTIONS */}
      {activeTab === 'subs' && (
        <div className="space-y-4">
          {/* Summary Banner */}
          <div className="bg-gradient-to-r from-indigo-950/40 to-slate-800/40 p-4 sm:p-5 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Total Beban Langganan / Bulan</span>
              <span className="text-2xl font-black text-indigo-300 font-mono">{formatIDR(totalMonthlySubs)}</span>
            </div>
            <div className="text-xs text-slate-400">
              <span className="text-emerald-400 font-bold">{recurringSubs.filter((s) => s.isActive).length} aktif</span> •{' '}
              <span>{recurringSubs.filter((s) => !s.isActive).length} nonaktif</span>
            </div>
          </div>

          {/* List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {recurringSubs.map((sub) => (
              <div
                key={sub.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  sub.isActive
                    ? 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    : 'bg-slate-950/30 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-100 text-sm truncate">{sub.name}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-indigo-300">{sub.category}</span>
                      <span>•</span>
                      <span>Debet tgl {sub.billingDay}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-100 block">{formatIDR(sub.amount)}</span>
                    <span className="text-[10px] text-slate-500 font-medium">/{sub.billingCycle === 'monthly' ? 'bln' : 'thn'}</span>
                  </div>

                  <button
                    onClick={() => updateRecurringSub(sub.id, { isActive: !sub.isActive })}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${
                      sub.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}
                    title={sub.isActive ? 'Klik untuk jeda langganan' : 'Klik untuk aktifkan langganan'}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteRecurringSub(sub.id)}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 flex items-center justify-center transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DEBTS & RECEIVABLES */}
      {activeTab === 'debts' && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Piutang (Uang Saya di Orang Lain)
                </span>
              </div>
              <span className="text-2xl font-black text-emerald-300 font-mono">{formatIDR(totalReceivable)}</span>
            </div>

            <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-rose-400 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" /> Hutang (Kewajiban Bayar Saya)
                </span>
              </div>
              <span className="text-2xl font-black text-rose-300 font-mono">{formatIDR(totalPayable)}</span>
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {debts.map((debt) => {
              const remaining = debt.amount - (debt.paidAmount || 0);
              const isSettled = debt.status === 'settled' || remaining <= 0;

              return (
                <div
                  key={debt.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSettled ? 'bg-slate-950/40 border-slate-900 opacity-60' : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        debt.type === 'receivable'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {debt.type === 'receivable' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-100 text-sm">{debt.personName}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            debt.type === 'receivable' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {debt.type === 'receivable' ? 'Piutang' : 'Hutang'}
                        </span>
                        {isSettled && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                            Lunas
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {debt.notes || 'Tanpa catatan'} {debt.dueDate ? `• Jatuh tempo: ${debt.dueDate}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-400">Sisa: <strong className="text-white font-mono">{formatIDR(remaining)}</strong></div>
                      <div className="text-[10px] text-slate-500">Total: {formatIDR(debt.amount)}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isSettled && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDebtForPayment(debt);
                            setPaymentAmount(remaining);
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all"
                        >
                          Bayar / Cicil
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteDebt(debt.id)}
                        className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 flex items-center justify-center transition-colors"
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
      )}

      {/* MODAL: ADD SUBSCRIPTION */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleCreateSub} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Tambah Langganan Berulang</h3>
              <button type="button" onClick={() => setShowSubModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Nama Layanan</label>
              <input
                type="text"
                placeholder="Contoh: Netflix / Spotify / iCloud / Gym"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  value={subAmount}
                  onChange={(e) => setSubAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Tanggal Debet (1-31)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={subDay}
                  onChange={(e) => setSubDay(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Siklus</label>
                <select
                  value={subCycle}
                  onChange={(e: any) => setSubCycle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="monthly">Bulanan</option>
                  <option value="yearly">Tahunan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Kategori</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="Hiburan">Hiburan</option>
                  <option value="Utilitas">Utilitas</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Produktivitas">Produktivitas</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowSubModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30"
              >
                Simpan Langganan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD DEBT / RECEIVABLE */}
      {showDebtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleCreateDebt} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Tambah Catatan Hutang / Piutang</h3>
              <button type="button" onClick={() => setShowDebtModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Jenis Catatan</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDebtType('receivable')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    debtType === 'receivable'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Piutang (Dia Berhutang ke Saya)
                </button>
                <button
                  type="button"
                  onClick={() => setDebtType('payable')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    debtType === 'payable'
                      ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Hutang (Saya Berhutang)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Nama Orang / Pihak</label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso / Bank BCA"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  value={debtAmount}
                  onChange={(e) => setDebtAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Jatuh Tempo (Opsional)</label>
                <input
                  type="date"
                  value={debtDueDate}
                  onChange={(e) => setDebtDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Catatan Keperluan</label>
              <input
                type="text"
                placeholder="Contoh: Talangan servis laptop"
                value={debtNotes}
                onChange={(e) => setDebtNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowDebtModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30"
              >
                Simpan Catatan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: RECORD PAYMENT */}
      {selectedDebtForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-sm">Catat Pembayaran / Pelunasan</h3>
            <p className="text-xs text-slate-400">
              Pihak: <strong>{selectedDebtForPayment.personName}</strong>
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Nominal Pembayaran (Rp)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedDebtForPayment(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRecordPayment}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
              >
                Konfirmasi Bayar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
