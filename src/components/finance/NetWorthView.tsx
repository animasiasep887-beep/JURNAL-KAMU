import React from 'react';
import { useData } from '../../context/DataContext';
import { formatIDR } from '../../utils/formatters';
import { DollarSign, TrendingUp, Landmark, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const NetWorthView: React.FC = () => {
  const { accounts } = useData();

  const totalAssets = accounts.reduce((sum, a) => sum + a.balance, 0);
  const liabilities = 0; // No debt logged currently
  const netWorth = totalAssets - liabilities;

  const mockNetWorthTrend = [
    { date: 'Mei 2026', netWorth: 24000000 },
    { date: 'Jun 2026', netWorth: 28500000 },
    { date: 'Jul 2026', netWorth: 34000000 },
    { date: 'Agt 2026', netWorth: netWorth },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-400" />
            <span>Kekayaan Bersih — Net Worth Tracking</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Total Aset (Cash, Bank, E-wallet, Tabungan, Investasi) dikurangi Kewajiban.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-tr from-indigo-900/40 to-slate-800 p-5 rounded-2xl border border-indigo-500/30">
          <div className="text-xs text-indigo-300 font-semibold uppercase">Total Net Worth</div>
          <div className="text-2xl font-extrabold font-mono text-white mt-2">{formatIDR(netWorth)}</div>
          <div className="text-[11px] text-emerald-400 mt-2 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +4.8% Pertumbuhan Bulan Ini
          </div>
        </div>

        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Aset</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-2">{formatIDR(totalAssets)}</div>
        </div>

        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase">Kewajiban / Hutang</div>
          <div className="text-2xl font-extrabold font-mono text-slate-300 mt-2">{formatIDR(liabilities)}</div>
        </div>
      </div>

      <div className="h-48 w-full pt-4">
        <div className="text-xs font-bold text-slate-400 mb-2">Tren Perkembangan Net Worth</div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockNetWorthTrend}>
            <defs>
              <linearGradient id="networthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `Rp${v / 1000000}M`} />
            <Tooltip formatter={(val: any) => formatIDR(Number(val))} />
            <Area type="monotone" dataKey="netWorth" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#networthGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
