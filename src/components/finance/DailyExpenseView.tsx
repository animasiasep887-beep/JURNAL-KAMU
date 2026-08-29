import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatIDR, formatDateIndonesian, getTodayString } from '../../utils/formatters';
import { Calendar, CreditCard, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Tag, Trash2, Plus, Filter, Wallet } from 'lucide-react';

export const DailyExpenseView: React.FC = () => {
  const { transactions, deleteTransaction } = useData();
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');

  // Transactions on selected date
  const dateTxs = transactions.filter((t) => t.date === selectedDate);

  // Financial summary metrics on selected date
  const dayIncome = dateTxs.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const dayExpense = dateTxs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netCashflow = dayIncome - dayExpense;

  // Filtered transactions for display list
  const filteredTxs = dateTxs.filter((t) => {
    if (typeFilter === 'all') return true;
    if (typeFilter === 'income') return t.type === 'income';
    if (typeFilter === 'expense') return t.type === 'expense';
    if (typeFilter === 'transfer') return t.type === 'transfer' || t.type === 'saving' || t.type === 'investment';
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Section Header & Date Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-400" />
            <span>Detail Transaksi & Cashflow Harian</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Lacak seluruh Pemasukan (+), Pengeluaran (-), dan Transfer (↔) secara lengkap per tanggal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400 hidden sm:block" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
          />
        </div>
      </div>

      {/* Metrics Row: Income, Expense, Net Cashflow */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income Card */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" /> Pemasukan Hari Ini
            </div>
            <div className="text-xl font-extrabold font-mono text-emerald-300 mt-1">
              +{formatIDR(dayIncome)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            +
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="bg-rose-950/30 border border-rose-500/30 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-rose-400 flex items-center gap-1">
              <ArrowDownLeft className="w-4 h-4" /> Pengeluaran Hari Ini
            </div>
            <div className="text-xl font-extrabold font-mono text-rose-300 mt-1">
              -{formatIDR(dayExpense)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            -
          </div>
        </div>

        {/* Net Cashflow Card */}
        <div className="bg-indigo-950/30 border border-indigo-500/30 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-300">Net Cashflow Hari Ini</div>
            <div className={`text-xl font-extrabold font-mono mt-1 ${netCashflow >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
              {netCashflow >= 0 ? '+' : ''}{formatIDR(netCashflow)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
            NET
          </div>
        </div>
      </div>

      {/* Filter Tabs & Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>Riwayat Transaksi</span>
          <span className="text-[11px] font-normal text-slate-400">({formatDateIndonesian(selectedDate)})</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 overflow-x-auto">
          {[
            { id: 'all', label: 'Semua', count: dateTxs.length },
            { id: 'income', label: 'Pemasukan (+)', count: dateTxs.filter((t) => t.type === 'income').length, color: 'text-emerald-400' },
            { id: 'expense', label: 'Pengeluaran (-)', count: dateTxs.filter((t) => t.type === 'expense').length, color: 'text-rose-400' },
            { id: 'transfer', label: 'Transfer (↔)', count: dateTxs.filter((t) => t.type === 'transfer' || t.type === 'saving').length, color: 'text-sky-400' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                typeFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${typeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-900 text-slate-400'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Item List */}
      <div className="space-y-2">
        {filteredTxs.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs bg-slate-800/20 rounded-2xl border border-slate-800">
            Belum ada transaksi {typeFilter !== 'all' ? typeFilter : ''} pada tanggal ini.
          </div>
        ) : (
          filteredTxs.map((t) => {
            const isIncome = t.type === 'income';
            const isTransfer = t.type === 'transfer' || t.type === 'saving' || t.type === 'investment';

            return (
              <div
                key={t.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  isIncome
                    ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
                    : isTransfer
                    ? 'bg-sky-950/20 border-sky-500/30 hover:border-sky-500/50'
                    : 'bg-slate-800/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl font-bold ${
                    isIncome
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isTransfer
                      ? 'bg-sky-500/20 text-sky-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {isIncome ? <ArrowUpRight className="w-4 h-4" /> : isTransfer ? <ArrowRightLeft className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                      <span>{t.description}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                        isIncome
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isTransfer
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {t.type}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-semibold text-indigo-400">{t.time.substring(0, 5)} WIB</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-slate-500" />
                        {t.category}
                      </span>
                      <span>•</span>
                      <span>{t.paymentMethod || 'Cash'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`font-mono font-extrabold text-sm ${
                    isIncome
                      ? 'text-emerald-400'
                      : isTransfer
                      ? 'text-sky-300'
                      : 'text-rose-400'
                  }`}>
                    {isIncome ? '+' : isTransfer ? '↔ ' : '-'}{formatIDR(t.amount)}
                  </div>
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    title="Hapus Transaksi"
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
