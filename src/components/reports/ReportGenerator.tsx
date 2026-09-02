import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { generateAIWeeklyReport, generateAIMonthlyReport } from '../../utils/aiAnalystEngine';
import { formatIDR } from '../../utils/formatters';
import { FileText, Sparkles, Download, CheckCircle, AlertTriangle, ArrowRight, Shield, Printer } from 'lucide-react';

export const ReportGenerator: React.FC = () => {
  const { currentUser } = useAuth();
  const { transactions, journals, tasks, workouts, habitLogs } = useData();

  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [isExporting, setIsExporting] = useState(false);

  if (!currentUser) return null;

  const weeklyData = generateAIWeeklyReport(currentUser, transactions, journals, tasks, workouts, habitLogs);
  const monthlyData = generateAIMonthlyReport(currentUser, transactions, journals, tasks, workouts, habitLogs);

  const data = activeTab === 'weekly' ? weeklyData : monthlyData;

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 300);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-6 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 print:hidden">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>AI Personal Analyst & Report Generator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Laporan otomatis mingguan & bulanan dengan rekomendasi AI interaktif.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'weekly' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Weekly Report
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'monthly' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Monthly Report
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" /> Cetak / Export PDF
          </button>
        </div>
      </div>

      {/* Printable Report Header for Official Print */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Personal Life OS - {activeTab === 'weekly' ? 'Weekly Executive Report' : 'Monthly Performance Report'}</h1>
            <p className="text-xs text-slate-600">Pemilik: {currentUser.name} ({currentUser.email}) | Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
          </div>
          <div className="text-right font-mono text-xs font-bold text-slate-800">
            PERIODE: {data.period}
          </div>
        </div>
      </div>

      {/* Report Summary Metric Card */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-800/60 to-slate-800/40 p-5 sm:p-6 rounded-2xl border border-indigo-500/30 space-y-4 print:bg-slate-100 print:text-black print:border-slate-300">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black text-indigo-400 uppercase tracking-widest print:text-indigo-900">
            {activeTab === 'weekly' ? 'Ringkasan Kinerja Mingguan' : 'Ringkasan Kinerja Bulanan'}
          </span>
          <span className="text-xs text-slate-400 font-mono print:text-slate-700">{data.period}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 print:bg-white print:border-slate-200">
            <div className="text-[11px] text-slate-400 print:text-slate-600">Total Pengeluaran</div>
            <div className="text-base sm:text-lg font-bold text-rose-400 font-mono print:text-rose-700">{formatIDR(data.totalExpense)}</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 print:bg-white print:border-slate-200">
            <div className="text-[11px] text-slate-400 print:text-slate-600">Saving Rate</div>
            <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono print:text-emerald-700">{data.savingRatePercentage.toFixed(1)}%</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 print:bg-white print:border-slate-200">
            <div className="text-[11px] text-slate-400 print:text-slate-600">Produktivitas Tugas</div>
            <div className="text-base sm:text-lg font-bold text-indigo-400 font-mono print:text-indigo-700">{data.productivityPercentage}%</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 print:bg-white print:border-slate-200">
            <div className="text-[11px] text-slate-400 print:text-slate-600">Gym / Olahraga</div>
            <div className="text-base sm:text-lg font-bold text-amber-400 font-mono print:text-amber-700">{data.workoutCount} Sesi</div>
          </div>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What Went Well */}
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-3 print:bg-white print:border-slate-300">
          <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2 print:text-emerald-800">
            <CheckCircle className="w-4 h-4" /> Apa Yang Berjalan Sangat Baik
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 print:text-slate-800">
            {data.whatWentWell.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Needs Improvement */}
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-3 print:bg-white print:border-slate-300">
          <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2 print:text-amber-800">
            <AlertTriangle className="w-4 h-4" /> Hal Yang Perlu Ditingkatkan
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 print:text-slate-800">
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
      <div className="bg-indigo-950/20 border border-indigo-500/30 p-5 rounded-2xl space-y-3 print:bg-white print:border-slate-300">
        <h4 className="font-bold text-indigo-300 text-sm flex items-center gap-2 print:text-indigo-900">
          <Sparkles className="w-4 h-4 text-amber-400" /> Rekomendasi Aksi Cerdas (Actionable Advice)
        </h4>
        <div className="space-y-2 text-xs text-slate-200 print:text-slate-800">
          {data.aiRecommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Priorities Next Period */}
      <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-3 print:bg-white print:border-slate-300">
        <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2 print:text-slate-900">
          <ArrowRight className="w-4 h-4 text-indigo-400" /> Prioritas Target Periode Berikutnya
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.priorityNextWeek.map((p, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 print:bg-slate-50 print:text-slate-800 print:border-slate-200">
              <span className="font-bold text-indigo-400 block mb-1">Target #{idx + 1}</span>
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

