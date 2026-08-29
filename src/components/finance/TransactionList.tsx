import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatIDR, formatDateIndonesian } from '../../utils/formatters';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Trash2, Tag, ListFilter } from 'lucide-react';

export const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction } = useData();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <ListFilter className="w-5 h-5 text-indigo-400" />
            <span>Master Tabel Transaksi (Pemasukan, Pengeluaran & Transfer)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Semua riwayat transaksi tercatat dapat difilter & dicari secara lengkap.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari deskripsi, kategori, #tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs pl-9 pr-4 py-2 rounded-xl outline-none"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl outline-none"
          >
            <option value="all">Semua Jenis</option>
            <option value="income">Pemasukan (+)</option>
            <option value="expense">Pengeluaran (-)</option>
            <option value="transfer">Transfer / Saving (↔)</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400">
              <th className="py-3 px-4">Tanggal & Waktu</th>
              <th className="py-3 px-4">Deskripsi Transaksi</th>
              <th className="py-3 px-3">Kategori</th>
              <th className="py-3 px-3">Jenis</th>
              <th className="py-3 px-4 text-right">Nominal</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500 text-xs">
                  Tidak ada transaksi yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              filtered.map((t) => {
                const isIncome = t.type === 'income';
                const isTransfer = t.type === 'transfer' || t.type === 'saving' || t.type === 'investment';

                return (
                  <tr key={t.id} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-xs text-slate-200">{t.date}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{t.time.substring(0, 5)} WIB</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-xs text-slate-100">
                      {t.description}
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-300">
                      {t.category}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        isIncome
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isTransfer
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-extrabold text-sm ${
                      isIncome ? 'text-emerald-400' : isTransfer ? 'text-sky-300' : 'text-rose-400'
                    }`}>
                      {isIncome ? '+' : isTransfer ? '↔ ' : '-'}{formatIDR(t.amount)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
