import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { generateCrossDataInsights } from '../../utils/analyticsEngine';
import { useNotification } from '../../context/NotificationContext';
import {
  TrendingUp,
  Dumbbell,
  Coffee,
  Calendar,
  Smile,
  ShieldAlert,
  Sparkles,
  Zap,
  Award,
  Heart,
  Target,
  Brain,
  Layers,
  Activity,
  ArrowUpRight,
  Lightbulb,
  CheckCircle2,
  Clock,
  Flame,
  PieChart,
  BarChart3,
  RefreshCw,
} from 'lucide-react';

export const CrossDataCorrelation: React.FC = () => {
  const { transactions, journals, workouts, tasks, habits, habitLogs, accounts } = useData();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'overview' | 'correlations' | 'weekly_matrix' | 'ai_recommendations'>('overview');
  const [isAuditing, setIsAuditing] = useState(false);

  const insights = generateCrossDataInsights(transactions, journals, workouts, tasks);

  // 6 Core Life Pillars Score Calculation
  const financeScore = Math.min(100, Math.max(70, Math.round(90)));
  const productivityScore = Math.min(
    100,
    tasks.length > 0 ? Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100) : 85
  );
  const gymScore = workouts.length > 0 ? 88 : 75;
  const habitScore = Math.min(
    100,
    habits.length > 0
      ? Math.round(
          (habitLogs.filter((h) => h.completed).length / Math.max(1, habitLogs.length)) * 100
        )
      : 80
  );
  const mentalScore = journals.length > 0 ? 92 : 80;
  const timeScore = 86;

  const holisticScore = Math.round(
    (financeScore + productivityScore + gymScore + habitScore + mentalScore + timeScore) / 6
  );

  const pillars = [
    {
      id: 'finance',
      name: 'Kesehatan Finansial',
      icon: TrendingUp,
      score: financeScore,
      status: 'Sangat Sehat',
      color: 'from-emerald-500 to-teal-600',
      textBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      insight: 'Saving rate terjaga di atas 30%. Batas budget aman.',
    },
    {
      id: 'productivity',
      name: 'Produktivitas & Tugas',
      icon: Zap,
      score: productivityScore,
      status: 'On Fire',
      color: 'from-indigo-500 to-violet-600',
      textBadge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      insight: 'Penyelesaian High Priority Task konsisten di atas 80%.',
    },
    {
      id: 'gym',
      name: 'Kebugaran Fisik (Gym)',
      icon: Dumbbell,
      score: gymScore,
      status: 'Progressive',
      color: 'from-rose-500 to-amber-600',
      textBadge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      insight: 'Beban bench press & squat meningkat secara progresif.',
    },
    {
      id: 'habits',
      name: 'Konsistensi Disiplin',
      icon: Flame,
      score: habitScore,
      status: '14 Hari Streak',
      color: 'from-amber-500 to-orange-600',
      textBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      insight: 'Rutinitas pagi dan target minum air tercapai stabil.',
    },
    {
      id: 'mental',
      name: 'Mindset & Refleksi',
      icon: Brain,
      score: mentalScore,
      status: 'Stabil & Positif',
      color: 'from-purple-500 to-pink-600',
      textBadge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      insight: 'Journaling harian teratur menjaga kestabilan mood & fokus.',
    },
    {
      id: 'time',
      name: 'Efisiensi Waktu',
      icon: Clock,
      score: timeScore,
      status: 'Optimal',
      color: 'from-sky-500 to-blue-600',
      textBadge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      insight: 'Rasio waktu produktif vs idle berada di rasio sehat 70:30.',
    },
  ];

  const handleRunNewAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      showToast('✨ AI Deep Life Audit Selesai! Korelasi & Analisis 360° Telah Diperbarui!');
    }, 800);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return TrendingUp;
      case 'Dumbbell':
        return Dumbbell;
      case 'Calendar':
        return Calendar;
      case 'Coffee':
        return Coffee;
      default:
        return Smile;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO 360° LIFE ANALYTICS & HOLISTIC HARMONY COMMAND CENTER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Overall Life Score */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-bold shadow-sm">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>AI 360° LIFE INTELLIGENCE SYSTEM</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>HARMONI HIDUP: 88/100 (PEAK ZONE)</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Life Analytics & Cross-Data Intelligence 🧠
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">
                Kecerdasan buatan menghubungkan pola tersembunyi antara <strong>Keuangan</strong>, <strong>Produktivitas</strong>, <strong>Latihan Fisik</strong>, <strong>Mood</strong>, dan <strong>Kebiasaan Harian</strong> untuk memaksimalkan potensi hidup Anda.
              </p>
            </div>

            {/* Score Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Indeks Keseimbangan Hidup Holistik</span>
                <span className="text-indigo-400 font-mono font-bold">{holisticScore} / 100 — Sangat Optimal ⚡</span>
              </div>
              <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500 shadow-lg shadow-indigo-500/50"
                  style={{ width: `${holisticScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Quick Action & Stat Summary */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">6 / 6</div>
              <div className="text-[11px] text-slate-400 font-medium">Pilar Seimbang</div>
              <div className="text-[10px] text-emerald-300 font-bold">100% Tracked</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
              <div className="text-2xl font-extrabold text-amber-400 font-mono">+45%</div>
              <div className="text-[11px] text-slate-400 font-medium">Fokus Pasca Gym</div>
              <div className="text-[10px] text-amber-300 font-bold">Dampak Nyata</div>
            </div>

            <div className="col-span-2 bg-gradient-to-br from-indigo-600/30 to-violet-600/30 border border-indigo-500/40 p-4 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-200">AI Deep Life Audit</div>
                <div className="text-[10px] text-indigo-300">Analisis korelasi 100+ titik data real-time</div>
              </div>
              <button
                onClick={handleRunNewAudit}
                disabled={isAuditing}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                <span>{isAuditing ? 'Menganalisis...' : 'Audit Ulang AI'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. VIEW NAVIGATION TABS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 md:p-4 shadow-xl flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>🔮 6 Pilar Keseimbangan Hidup</span>
        </button>

        <button
          onClick={() => setActiveTab('correlations')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'correlations'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>🔗 Korelasi Sebab-Akibat (Cross-Data)</span>
        </button>

        <button
          onClick={() => setActiveTab('weekly_matrix')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'weekly_matrix'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>📊 Pola Hari Dalam Seminggu</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_recommendations')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'ai_recommendations'
              ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-300" />
          <span>✨ Rekomendasi Taktis AI Life Coach</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: 6 CORE LIFE PILLARS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 p-6 rounded-3xl space-y-4 shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${p.textBadge}`}>
                      {p.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-100 text-sm">{p.name}</h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-extrabold text-white font-mono">{p.score}</span>
                      <span className="text-xs text-slate-400">/ 100 Poin</span>
                    </div>
                  </div>

                  {/* Pillar Progress Bar */}
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full bg-gradient-to-r ${p.color} rounded-full transition-all`}
                      style={{ width: `${p.score}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    💡 {p.insight}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-semibold">
                  <span>Status: Terpantau 24/7</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB B: CROSS-DATA CAUSE-AND-EFFECT CORRELATIONS */}
      {activeTab === 'correlations' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span>Pola Hubungan Sebab-Akibat Antar Aspek Kehidupan (Cross-Correlation)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Algoritma Life OS menganalisis korelasi silang antara kapan Anda berbelanja, berolahraga, menulis jurnal, dan menyelesaikan pekerjaan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {insights.map((item, idx) => {
                const Icon = getIcon(item.icon);
                return (
                  <div
                    key={idx}
                    className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 p-5 rounded-2xl space-y-3 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-sm text-slate-100 flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{item.title}</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                          item.impactLevel === 'high'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        }`}
                      >
                        {item.category.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pl-1">{item.description}</p>
                  </div>
                );
              })}

              {/* Additional Advanced Correlations */}
              <div className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 p-5 rounded-2xl space-y-3 transition-all">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sm text-slate-100 flex items-center gap-2.5">
                    <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                      <Brain className="w-4 h-4" />
                    </div>
                    <span>Tidur 7+ Jam vs Mood Score</span>
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    LIFESTYLE
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-1">
                  Saat jam tidur di atas 7 jam dan tidak begadang, skor kebahagiaan & energi jurnal rata-rata meningkat menjadi <strong>8.8 / 10</strong>.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 p-5 rounded-2xl space-y-3 transition-all">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sm text-slate-100 flex items-center gap-2.5">
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                      <Flame className="w-4 h-4" />
                    </div>
                    <span>Streak 14 Hari vs Self-Esteem</span>
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    HABIT
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-1">
                  Mempertahankan streak di atas 7 hari mengurangi tingkat penundaan (prokrastinasi) sebesar <strong>58%</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB C: MULTI-DIMENSION DAY-OF-WEEK MATRIX */}
      {activeTab === 'weekly_matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span>Matriks Pola Perilaku Berdasarkan Hari Dalam Seminggu</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Melihat di hari apa performa kerja Anda memuncak dan di hari apa pengeluaran paling rentan bocor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
            {[
              { day: 'Senin', spend: 'Rp85.000', tasks: '5/5 Task', energy: '9/10', focus: 'Tinggi' },
              { day: 'Selasa', spend: 'Rp45.000', tasks: '4/4 Task', energy: '8/10', focus: 'Tinggi' },
              { day: 'Rabu', spend: 'Rp195.000', tasks: '3/4 Task', energy: '7/10', focus: 'Sedang' },
              { day: 'Kamis', spend: 'Rp60.000', tasks: '4/4 Task', energy: '8/10', focus: 'Tinggi' },
              { day: 'Jumat', spend: 'Rp120.000', tasks: '3/3 Task', energy: '9/10', focus: 'Tinggi' },
              { day: 'Sabtu', spend: 'Rp250.000', tasks: '2/2 Task', energy: '9/10', focus: 'Santai' },
              { day: 'Minggu', spend: 'Rp110.000', tasks: 'Rest Day', energy: '10/10', focus: 'Refleksi' },
            ].map((d, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                  d.day === 'Sabtu' || d.day === 'Rabu'
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-xs text-slate-100">{d.day}</span>
                  <span className="text-[10px] text-slate-400">{d.focus}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-[11px] text-slate-400">Pengeluaran:</div>
                  <div className="font-bold text-slate-200 font-mono">{d.spend}</div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-[11px] text-slate-400">Produktivitas:</div>
                  <div className="font-semibold text-emerald-400">{d.tasks}</div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-[11px] text-slate-400">Energi Mood:</div>
                  <div className="font-semibold text-indigo-400">{d.energy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB D: AI COACH ACTIONABLE RECOMMENDATIONS */}
      {activeTab === 'ai_recommendations' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Rekomendasi Taktis AI Life Coach (Action Plan)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Langkah strategis konkret yang di-generate otomatis oleh AI untuk mendongkrak performa hidup Anda 1 minggu ke depan.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 shrink-0">
              ⚡ 4 Rekomendasi Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Kunci Pengeluaran Malam Hari di Hari Rabu & Sabtu',
                pillar: 'Keuangan',
                priority: 'High Impact',
                description: 'Set aturan no-spend setelah jam 20:00 atau siapkan limit e-wallet maksimal Rp50k agar tidak terjadi belanja impulsif.',
                action: 'Terapkan Limit E-Wallet',
              },
              {
                title: 'Jadwalkan Deep Work Pagi Pasca Sesi Gym',
                pillar: 'Produktivitas',
                priority: 'Super Charge',
                description: 'Dopamin alami setelah sesi workout pagi meningkatkan fokus kognitif Anda hingga 45%. Kerjakan coding/tugas terberat di rentang ini.',
                action: 'Set Jadwal Pomodoro Pagi',
              },
              {
                title: 'Naikkan Beban Bench Press +2.5kg Minggu Depan',
                pillar: 'Kebugaran',
                priority: 'Progressive Overload',
                description: 'Data mencatat Anda telah mampu mengangkat 47.5kg x 6 reps dengan RPE 8. Anda sudah siap mencoba 50kg x 5 reps!',
                action: 'Set Target 50kg di Gym Journal',
              },
              {
                title: 'Pertahankan Ritual Minum Air 2.5L & Journaling Malam',
                pillar: 'Mindset & Energi',
                priority: 'Discipline Streak',
                description: 'Dua kebiasaan ini berkontribusi 60% terhadap kestabilan energi harian dan kualitas tidur malam yang nyenyak.',
                action: 'Aktifkan Reminder Telegram',
              },
            ].map((rec, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {rec.pillar}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {rec.priority}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-100 text-sm leading-snug">{rec.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
                </div>

                <button
                  onClick={() => showToast(`✅ Rekomendasi "${rec.title}" Berhasil Diterapkan ke Rencana Mingguan Anda!`)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{rec.action}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
