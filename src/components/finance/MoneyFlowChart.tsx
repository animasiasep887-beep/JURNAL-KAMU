import React from 'react';
import { useData } from '../../context/DataContext';
import { formatIDR } from '../../utils/formatters';
import { ArrowRight, Wallet, ArrowDownRight, TrendingUp } from 'lucide-react';

export const MoneyFlowChart: React.FC = () => {
  const { transactions, accounts } = useData();

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalSavings = transactions.filter((t) => t.type === 'transfer' || t.type === 'saving').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span>Money Flow Visualizer — Alur Masuk & Keluar Uang</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Uang Masuk → Disimpan Di Mana → Digunakan Untuk Apa.</p>
        </div>
      </div>

      {/* Flow Nodes Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-center">
        {/* Node 1: Pemasukan */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-5 rounded-2xl text-center space-y-2">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">1. Pemasukan (Source)</div>
          <div className="text-xl font-extrabold text-white font-mono">{formatIDR(totalIncome)}</div>
          <div className="text-[11px] text-slate-400">Gaji, Freelance & Omset</div>
        </div>

        {/* Arrow 1 */}
        <div className="hidden md:flex justify-center text-slate-600">
          <ArrowRight className="w-6 h-6 animate-pulse" />
        </div>

        {/* Node 2: Akun Penyimpanan */}
        <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl text-center space-y-2">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">2. Akun Penyimpanan</div>
          <div className="text-sm font-semibold text-slate-200">{accounts.length} Akun Terhubung</div>
          <div className="text-[11px] text-slate-400">Cash, BCA, Mandiri, GoPay</div>
        </div>

        {/* Node 3: Pengeluaran & Tabungan */}
        <div className="bg-rose-950/40 border border-rose-500/30 p-5 rounded-2xl text-center space-y-2">
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">3. Alokasi Akhir</div>
          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-slate-400">Pengeluaran:</span>
            <span className="font-mono text-rose-400 font-bold">{formatIDR(totalExpense)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Tabungan / Investasi:</span>
            <span className="font-mono text-emerald-400 font-bold">{formatIDR(totalSavings)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
