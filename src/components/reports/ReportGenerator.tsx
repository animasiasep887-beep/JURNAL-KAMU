import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { generateAIWeeklyReport, generateAIMonthlyReport } from '../../utils/aiAnalystEngine';
import { formatIDR } from '../../utils/formatters';
import { FileText, Sparkles, Download, CheckCircle, AlertTriangle, ArrowRight, Shield } from 'lucide-react';

export const ReportGenerator: React.FC = () => {
  const { currentUser } = useAuth();
  const { transactions, journals, tasks, workouts, habitLogs } = useData();

  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');

  if (!currentUser) return null;

  const weeklyData = generateAIWeeklyReport(currentUser, transactions, journals, tasks, workouts, habitLogs);
  const monthlyData = generateAIMonthlyReport(currentUser, transactions, journals, tasks, workouts, habitLogs);

  const data = activeTab === 'weekly' ? weeklyData : monthlyData;

  const handleExportPDF = () => {
    alert(`Downloading ${activeTab.toUpperCase()} Report PDF...`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>AI Personal Analyst & Report Generator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Laporan otomatis mingguan & bulanan dengan rekomendasi AI interaktif.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Weekly Report
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Monthly Report
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Report Header Card */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-800/60 to-slate-800/40 p-6 rounded-2xl border border-indigo-500/30 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            {activeTab === 'weekly' ? 'How Was My Week?' : 'How Was My Month?'}
          </span>
          <span className="text-xs text-slate-400 font-mono">{data.period}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div>
            <div className="text-xs text-slate-400">Total Pengeluaran</div>
            <div className="text-lg font-bold text-rose-400 font-mono">{formatIDR(data.totalExpense)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Saving Rate</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">{data.savingRatePercentage.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Produktivitas</div>
            <div className="text-lg font-bold text-indigo-400 font-mono">{data.productivityPercentage}%</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Gym Sesi</div>
            <div className="text-lg font-bold text-amber-400 font-mono">{data.workoutCount} Sesi</div>
          </div>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What Went Well */}
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Apa Yang Berjalan Sangat Baik
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {data.whatWentWell.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Needs Improvement */}
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Hal Yang Perlu Ditingkatkan
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {data.whatNeedsImprovement.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-indigo-950/20 border border-indigo-500/30 p-5 rounded-2xl space-y-3">
        <h4 className="font-bold text-indigo-300 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Rekomendasi AI Personal Analyst
        </h4>
        <div className="space-y-2 text-xs text-slate-200">
          {data.aiRecommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
