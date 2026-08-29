import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatIDR } from '../../utils/formatters';
import { audioSynth } from '../../utils/audioSynth';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Zap,
  DollarSign,
  Calculator,
  Calendar,
  PiggyBank,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  Compass,
} from 'lucide-react';

export const FinancialRunwaySimulator: React.FC = () => {
  const { accounts, transactions } = useData();

  // Total Liquid Wealth
  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  // Average 30-day expense estimation
  const expenseTxs = transactions.filter((t) => t.type === 'expense');
  const totalSpent = expenseTxs.reduce((sum, t) => sum + t.amount, 0);
  const monthlyBurnRate = totalSpent > 0 ? Math.max(totalSpent, 1500000) : 2500000;

  // Runway in Months
  const runwayMonths = totalBalance > 0 ? (totalBalance / monthlyBurnRate).toFixed(1) : '0';
  const runwayNum = parseFloat(runwayMonths);

  // Simulator Slider State
  const [weeklySavings, setWeeklySavings] = useState<number>(200000);
  const [includeInvestmentReturn, setIncludeInvestmentReturn] = useState<boolean>(true);

  const annualInterestRate = 0.07; // 7% per year conservative mutual fund/dividend

  // Projections
  const calcAccumulation = (years: number) => {
    const totalWeeks = years * 52;
    const rawSavings = weeklySavings * totalWeeks;
    if (!includeInvestmentReturn) return rawSavings;

    // Compound interest formula: A = P * ((1 + r/n)^(nt) - 1) / (r/n)
    const monthlyDeposit = (weeklySavings * 52) / 12;
    const r = annualInterestRate / 12;
    const n = years * 12;
    const futureVal = monthlyDeposit * ((Math.pow(1 + r, n) - 1) / r);
    return Math.round(futureVal);
  };

  const proj6Months = Math.round(calcAccumulation(0.5));
  const proj1Year = Math.round(calcAccumulation(1));
  const proj3Years = Math.round(calcAccumulation(3));
  const proj5Years = Math.round(calcAccumulation(5));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>AI Financial Runway & Wealth Simulator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis ketahanan dana darurat dan simulasi proyeksi akumulasi kekayaan di masa depan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            KAS AKTIF: {formatIDR(totalBalance)}
          </span>
        </div>
      </div>

      {/* 1. RUNWAY METRICS & EMERGENCY CUSHION TIER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Runway Months Meter */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-500/40 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Financial Runway (Ketahanan Kas)</span>
            </span>
            <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">
              Tanpa Pemasukan
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">
              {runwayMonths}
            </span>
            <span className="text-sm font-bold text-slate-400">Bulan Bertahan</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Berdasarkan estimasi pengeluaran bulanan <strong className="text-slate-200">{formatIDR(monthlyBurnRate)}/bln</strong>.
          </div>
        </div>

        {/* Emergency Cushion Status */}
        <div
          className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
            runwayNum >= 6
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : runwayNum >= 3
              ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Status Dana Darurat</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40">
              {runwayNum >= 6 ? 'AMAN TINGGI' : runwayNum >= 3 ? 'STANDAR' : 'PERLU DITAMBAH'}
            </span>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white">
              {runwayNum >= 6
                ? '🛡️ Benteng Finansial Kokoh'
                : runwayNum >= 3
                ? '⚖️ Finansial Cukup Terjaga'
                : '⚠️ Rawan Jika Ada Darurat'}
            </h4>
            <p className="text-xs mt-1 text-slate-300 leading-relaxed">
              {runwayNum >= 6
                ? 'Tabungan likuid Anda sangat aman untuk menopang kebutuhan hidup lebih dari setengah tahun!'
                : runwayNum >= 3
                ? 'Cukup aman, namun idealnya ditingkatkan hingga minimal 6 bulan pengeluaran rutin.'
                : 'Tingkatkan tabungan kas darurat untuk mengantisipasi pengeluaran tak terduga.'}
            </p>
          </div>
        </div>

        {/* AI Financial Strategy Advice */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
            <Compass className="w-4 h-4" />
            <span>Rekomendasi Alokasi AI</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Gunakan rumus <strong>50/30/20</strong>: 50% Kebutuhan Pokok, 30% Keinginan/Hobi, dan <strong>20% Tabungan/Investasi Rutin</strong> agar Runway Anda naik setiap bulan.
          </p>

          <div className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disiplin mencatat di Telegram Bot</span>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE SAVINGS ACCUMULATION SIMULATOR */}
      <div className="p-6 bg-slate-950/80 border border-indigo-500/30 rounded-3xl space-y-6 shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Simulasi Akumulasi Penghematan Mingguan</h4>
              <p className="text-xs text-slate-400">Geser slider di bawah untuk melihat potensi uang yang terkumpul.</p>
            </div>
          </div>

          {/* Toggle Investasi vs Tabungan Murni */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => {
                audioSynth.playClick();
                setIncludeInvestmentReturn(false);
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                !includeInvestmentReturn ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kas Murni
            </button>
            <button
              type="button"
              onClick={() => {
                audioSynth.playClick();
                setIncludeInvestmentReturn(true);
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                includeInvestmentReturn ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Investasi (+7%/thn)</span>
            </button>
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-300">
              Jika saya menyisihkan / berhemat per minggu:
            </span>
            <span className="text-xl sm:text-2xl font-black text-indigo-400 font-mono bg-indigo-950/40 px-3.5 py-1 rounded-xl border border-indigo-500/30 self-start sm:self-auto">
              {formatIDR(weeklySavings)} <span className="text-xs font-normal text-slate-400">/ minggu</span>
            </span>
          </div>

          <input
            type="range"
            min="50000"
            max="2000000"
            step="50000"
            value={weeklySavings}
            onChange={(e) => {
              setWeeklySavings(parseInt(e.target.value, 10));
            }}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[100000, 200000, 350000, 500000, 1000000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  audioSynth.playClick();
                  setWeeklySavings(preset);
                }}
                className={`px-3 py-1 rounded-xl text-xs border transition-all ${
                  weeklySavings === preset
                    ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {formatIDR(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* Projection Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          {/* 6 Months */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>6 Bulan</span>
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-base sm:text-lg font-bold text-white font-mono">
              {formatIDR(proj6Months)}
            </div>
            <p className="text-[10px] text-slate-500">26 minggu konsisten</p>
          </div>

          {/* 1 Year */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/40 space-y-1 shadow-md shadow-indigo-950/20">
            <div className="text-[11px] text-indigo-300 font-bold flex items-center justify-between">
              <span>1 Tahun</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-base sm:text-lg font-black text-white font-mono">
              {formatIDR(proj1Year)}
            </div>
            <p className="text-[10px] text-indigo-400 font-medium">🎯 Target Dana Tahunan</p>
          </div>

          {/* 3 Years */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>3 Tahun</span>
              <PiggyBank className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-base sm:text-lg font-bold text-white font-mono">
              {formatIDR(proj3Years)}
            </div>
            <p className="text-[10px] text-emerald-400 font-mono">+{includeInvestmentReturn ? 'Return Majemuk' : 'Tabungan Murni'}</p>
          </div>

          {/* 5 Years */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/40 space-y-1 shadow-md shadow-emerald-950/20">
            <div className="text-[11px] text-emerald-300 font-bold flex items-center justify-between">
              <span>5 Tahun</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-300 font-mono">
              {formatIDR(proj5Years)}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Kekayaan Masa Depan</p>
          </div>
        </div>
      </div>
    </div>
  );
};
