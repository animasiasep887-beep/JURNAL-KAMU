import React from 'react';
import { AlertCircle, TrendingUp, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatIDR, getTodayString } from '../../utils/formatters';

export const SpendingAnomalyAlert: React.FC = () => {
  const { transactions } = useData();

  const today = getTodayString();
  const expenseToday = transactions
    .filter((t) => t.type === 'expense' && t.date === today)
    .reduce((sum, t) => sum + t.amount, 0);

  // Past expenses for average
  const pastExpenses = transactions
    .filter((t) => t.type === 'expense' && t.date !== today)
    .reduce((sum, t) => sum + t.amount, 0);

  const avgDaily = pastExpenses > 0 ? pastExpenses / 7 : 50000;
  const isHighSpend = expenseToday > avgDaily * 1.5 && expenseToday > 100000;
  const largeSingleTx = transactions.find((t) => t.type === 'expense' && t.date === today && t.amount >= 200000);

  if (!isHighSpend && !largeSingleTx) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 shrink-0 mt-0.5">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-slate-100">AI Spending Radar: Lonjakan Pengeluaran Terdeteksi</h4>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
              ANOMALI SPENDING
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {largeSingleTx ? (
              <span>
                Pengeluaran hari ini mencapai <strong className="text-amber-300 font-mono">{formatIDR(expenseToday)}</strong>, termasuk transaksi besar <strong className="text-white">"{largeSingleTx.description}" ({formatIDR(largeSingleTx.amount)})</strong>.
              </span>
            ) : (
              <span>
                Pengeluaran hari ini (<strong className="text-amber-300 font-mono">{formatIDR(expenseToday)}</strong>) berada di atas rata-rata harian normalmu (<span className="font-mono">{formatIDR(avgDaily)}</span>).
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <span className="text-[11px] text-indigo-300 bg-indigo-950/50 px-3 py-1.5 rounded-xl border border-indigo-500/20">
          💡 Tips: Prioritaskan pos kebutuhan primer
        </span>
      </div>
    </div>
  );
};
