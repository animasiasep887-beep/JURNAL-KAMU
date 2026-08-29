import React from 'react';
import { useData } from '../../context/DataContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatIDR } from '../../utils/formatters';
import { Wallet, ArrowRight } from 'lucide-react';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

export const FinancialSummaryCard: React.FC<{ onNavigateToFinance: () => void }> = ({ onNavigateToFinance }) => {
  const { transactions } = useData();

  // Aggregate category spend
  const categoryMap: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const chartData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Kategori Pengeluaran Bulan Ini</span>
          </h3>
          <button onClick={onNavigateToFinance} className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold">
            Lihat Keuangan <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {chartData.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">Belum ada data pengeluaran.</div>
        ) : (
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                  {chartData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => formatIDR(Number(val))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
        {chartData.slice(0, 3).map((item, idx) => (
          <div key={item.name} className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
              <span className="text-slate-300 font-medium">{item.name}</span>
            </div>
            <span className="font-mono text-slate-100 font-semibold">{formatIDR(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
