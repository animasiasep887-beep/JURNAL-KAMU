import React from 'react';
import { useData } from '../../context/DataContext';
import { calculateFinancialHealth } from '../../utils/analyticsEngine';
import { formatIDR } from '../../utils/formatters';
import { ShieldCheck, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

export const FinancialHealthScore: React.FC = () => {
  const { accounts, transactions, budgets } = useData();
  const health = calculateFinancialHealth(accounts, transactions, budgets);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex flex-col items-center justify-center font-mono font-extrabold text-2xl shadow-lg shadow-emerald-600/30">
            {health.score}
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Financial Health Score (78/100)</span>
            </h3>
            <p className="text-xs text-slate-400">Analisis kesehatan finansial berbasis rasio saving, ketaatan budget & dana darurat.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {health.factors.map((f) => (
          <div key={f.name} className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
              <span>{f.name}</span>
              <span className="font-mono font-bold text-emerald-400">{f.score}/100</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 leading-relaxed">{f.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
