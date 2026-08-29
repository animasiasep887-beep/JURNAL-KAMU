import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { getTodayString, formatTimeHHMM } from '../../utils/formatters';
import { JournalEntry } from '../../types';
import {
  Clock,
  CreditCard,
  Dumbbell,
  BookOpen,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Smile,
  Sparkles,
  Zap,
  Tag,
  Eye,
  X,
  Heart,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  Check,
  Brain,
  Compass,
  MessageSquare,
} from 'lucide-react';

export const TodayTimeline: React.FC = () => {
  const { activities, transactions, workouts, journals, tasks } = useData();
  const today = getTodayString();

  // Selected date state (defaults to today)
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'solution'>('content');

  // Quick Date Helpers
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterday = yesterdayObj.toISOString().split('T')[0];

  const twoDaysAgoObj = new Date();
  twoDaysAgoObj.setDate(twoDaysAgoObj.getDate() - 2);
  const twoDaysAgo = twoDaysAgoObj.toISOString().split('T')[0];

  // Filter events for the selectedDate
  const dateActivities = activities.filter((a) => a.date === selectedDate);
  const dateExpenses = transactions.filter((t) => t.date === selectedDate);
  const dateWorkouts = workouts.filter((w) => w.date === selectedDate);
  const dateJournals = journals.filter((j) => j.date === selectedDate);
  const dateTasks = tasks.filter((t) => t.dueDate === selectedDate);

  const timelineItems: {
    time: string;
    title: string;
    type: 'activity' | 'expense' | 'gym' | 'journal' | 'task';
    details: string;
    icon: any;
    color: string;
    journalData?: JournalEntry;
  }[] = [];

  dateActivities.forEach((a) => {
    timelineItems.push({
      time: a.startTime || '08:00',
      title: a.name,
      type: 'activity',
      details: `Kategori: ${a.category.toUpperCase()} • Durasi: ${a.durationMinutes} menit`,
      icon: Clock,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    });
  });

  dateExpenses.forEach((t) => {
    timelineItems.push({
      time: t.time ? t.time.substring(0, 5) : '12:00',
      title: `${t.type === 'income' ? '🟢 Pemasukan' : '🔴 Pengeluaran'}: ${t.description} — Rp${t.amount.toLocaleString('id-ID')}`,
      type: 'expense',
      details: `Akun: ${t.paymentMethod || 'Cash'} • Kategori: ${t.category}`,
      icon: CreditCard,
      color: t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    });
  });

  dateWorkouts.forEach((w) => {
    timelineItems.push({
      time: w.startTime || '17:00',
      title: `Workout Gym: ${w.workoutType}`,
      type: 'gym',
      details: `${w.exerciseLogs.length} Variasi Latihan • ${w.durationMinutes} Menit • Target Beban Tercapai`,
      icon: Dumbbell,
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    });
  });

  dateTasks.forEach((t) => {
    timelineItems.push({
      time: t.dueTime || '16:00',
      title: `Tugas: ${t.title}`,
      type: 'task',
      details: `Prioritas: ${t.priority.toUpperCase()} • Status: ${t.status === 'done' ? '✅ Selesai' : '⏳ Belum'}`,
      icon: CheckCircle2,
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    });
  });

  dateJournals.forEach((j, index) => {
    let jTime = '21:00';
    if (j.createdAt) {
      try {
        const d = new Date(j.createdAt);
        const hours = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        jTime = `${hours}:${mins}`;
      } catch (e) {}
    } else {
      jTime = `20:${String(index * 15).padStart(2, '0')}`;
    }

    timelineItems.push({
      time: jTime,
      title: `Jurnal & Refleksi: "${j.title}"`,
      type: 'journal',
      details: `Mood: ${j.mood >= 4 ? '😀 Sangat Baik' : (j.mood === 3 ? '🙂 Normal / Butuh Istirahat' : '😕 Butuh Refleksi')} • Energi: ${j.energyLevel || 8}/10`,
      icon: BookOpen,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      journalData: j,
    });
  });

  // Sort timeline chronologically
  timelineItems.sort((a, b) => a.time.localeCompare(b.time));

  const totalDaySpending = dateExpenses
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const getMoodEmoji = (mood?: number) => {
    if (!mood) return '😀';
    if (mood === 5) return '🔥 Sangat Semangat';
    if (mood === 4) return '😀 Bahagia & Produktif';
    if (mood === 3) return '🙂 Butuh Istirahat / Stabil';
    if (mood === 2) return '😐 Lelah & Kurang Fokus';
    return '😞 Stres / Bad Day';
  };

  // Generate dynamic contextual solution if empty
  const getAISolution = (j: JournalEntry) => {
    if (j.solutionsText && j.solutionsText.length > 5) return j.solutionsText;
    const lower = (j.content + ' ' + j.title).toLowerCase();
    if (lower.includes('ketiduran') || lower.includes('ditinggal') || lower.includes('lelah') || lower.includes('capek')) {
      return 'Prioritaskan pemulihan fisik: Jadwalkan ulang agenda sosial dengan santai, atur alarm 15 menit sebelum tidur, dan luangkan waktu relaksasi tanpa rasa bersalah.';
    }
    if (lower.includes('gym') || lower.includes('olahraga') || lower.includes('sehat')) {
      return 'Lanjutkan konsistensi: Penuhi nutrisi protein setelah workout, hidrasi 2.5L air, dan lakukan peregangan ringan agar otot tidak kaku esok hari.';
    }
    return 'Evaluasi rutinitas harian, prioritaskan 1 tugas terpenting di pagi hari, dan luangkan 10 menit untuk meditasi atau jurnaling refleksi.';
  };

  const getAILearning = (j: JournalEntry) => {
    if (j.learnedText && j.learnedText.length > 5) return j.learnedText;
    const lower = (j.content + ' ' + j.title).toLowerCase();
    if (lower.includes('ketiduran') || lower.includes('ditinggal') || lower.includes('bete') || lower.includes('nyesel')) {
      return 'Tubuh memiliki batasan alami. Ketika tubuh menuntut istirahat, mendengarkannya adalah bentuk self-care yang sehat, bukan kegagalan.';
    }
    if (lower.includes('gym') || lower.includes('olahraga')) {
      return 'Kemenangan kecil seperti berolahraga secara konsisten membentuk disiplin jangka panjang dan memperkuat ketahanan mental.';
    }
    return 'Setiap momen yang dicatat adalah kesempatan emas untuk mengenali pola diri dan bertumbuh lebih matang.';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-base md:text-lg flex items-center gap-2">
                <span>Timeline Aktivitas & Riwayat Harian</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Multi-Journal & AI Insights 📖
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cek seluruh rekap aktivitas, pengeluaran, gym, dan buka semua catatan jurnal untuk belajar dari pengalaman hidup.
              </p>
            </div>
          </div>
        </div>

        {/* Date Filter & Datepicker */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedDate(today)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDate === today
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setSelectedDate(yesterday)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDate === yesterday
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Kemarin
          </button>
          <button
            onClick={() => setSelectedDate(twoDaysAgo)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDate === twoDaysAgo
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            2 Hari Lalu
          </button>

          {/* Custom Date Input */}
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Selected Date Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
        <div className="space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">Tanggal Dipilih:</span>
          <div className="text-xs font-extrabold text-white font-mono">{selectedDate}</div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">Total Aktivitas:</span>
          <div className="text-xs font-extrabold text-indigo-400 font-mono">{timelineItems.length} Catatan</div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">Pengeluaran Hari Itu:</span>
          <div className="text-xs font-extrabold text-amber-400 font-mono">Rp{totalDaySpending.toLocaleString('id-ID')}</div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">Status Jurnal:</span>
          <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
            {dateJournals.length > 0 ? `✅ ${dateJournals.length} Jurnal Tercatat` : 'Belum Ditulis'}
          </div>
        </div>
      </div>

      {/* ALL JOURNALS CARDS SECTION (IF RECORDED ON THIS DATE) */}
      {dateJournals.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Daftar Catatan Jurnal & Refleksi ({dateJournals.length} Entri):</span>
            </h4>
            <span className="text-[11px] text-slate-400">Klik kartu untuk membuka solusi & evaluasi AI</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dateJournals.map((journal, idx) => (
              <div
                key={journal.id || idx}
                onClick={() => {
                  setSelectedJournal(journal);
                  setActiveTab('content');
                }}
                className="group relative overflow-hidden bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/30 hover:from-purple-900/50 hover:to-indigo-900/40 border border-purple-500/30 hover:border-purple-400/60 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-mono font-bold flex items-center justify-center border border-purple-500/30">
                      #{idx + 1}
                    </span>
                    <h5 className="text-sm font-extrabold text-white group-hover:text-purple-200 transition-colors">
                      {journal.title}
                    </h5>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {getMoodEmoji(journal.mood)}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 bg-slate-950/50 p-3 rounded-xl border border-purple-500/10 my-3">
                  "{journal.content}"
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Energi: <strong className="text-amber-400">{journal.energyLevel || 8}/10</strong></span>
                    {journal.createdAt && (
                      <span className="font-mono text-[10px] text-indigo-300">
                        {new Date(journal.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJournal(journal);
                      setActiveTab('solution');
                    }}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all shadow-sm"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>Lihat Solusi AI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Timeline List */}
      {timelineItems.length === 0 ? (
        <div className="bg-gradient-to-b from-slate-950 to-slate-900/60 border border-slate-800/80 rounded-2xl p-8 sm:p-10 text-center space-y-4 shadow-inner">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/5">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-100">Belum ada rekaman aktivitas pada tanggal {selectedDate}</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              Mulai catat aktivitas harian Anda, bagikan curhat melalui Jurnal Refleksi, atau kirim chat cepat ke <strong>Telegram AI Bot</strong> untuk sinkronisasi otomatis!
            </p>
          </div>
        </div>
      ) : (
        <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {timelineItems.map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  if (item.journalData) {
                    setSelectedJournal(item.journalData);
                    setActiveTab('content');
                  }
                }}
                className={`relative group flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950/80 hover:bg-slate-800/80 p-4 rounded-2xl border border-slate-800/90 hover:border-indigo-500/40 transition-all gap-2 ${
                  item.journalData ? 'cursor-pointer' : ''
                }`}
              >
                <div className="absolute -left-6 top-5 w-3 h-3 rounded-full bg-slate-900 border-2 border-indigo-500 group-hover:scale-125 transition-transform" />

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                        {item.time} WIB
                      </span>
                      <span className="text-xs font-bold text-slate-100">{item.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{item.details}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  {item.journalData && (
                    <span className="text-[10px] text-purple-300 font-semibold flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      <Eye className="w-3 h-3" /> Buka Detail
                    </span>
                  )}
                  <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border shrink-0 ${item.color}`}>
                    {item.type.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL JOURNAL DETAIL & AI SOLUTION MODAL */}
      {selectedJournal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                    REFLEKSI JURNAL • {selectedJournal.date}
                  </span>
                  {selectedJournal.createdAt && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(selectedJournal.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-extrabold text-white">{selectedJournal.title}</h3>
                <p className="text-xs text-slate-400">
                  Mood: <strong className="text-slate-200">{getMoodEmoji(selectedJournal.mood)}</strong> • Energi: <strong className="text-amber-400">{selectedJournal.energyLevel || 8}/10</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedJournal(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs between Story & AI Solutions */}
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-2.5 text-xs font-extrabold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === 'content'
                    ? 'text-purple-400 border-purple-500 bg-purple-500/10'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Cerita & Pengalaman</span>
              </button>
              <button
                onClick={() => setActiveTab('solution')}
                className={`flex-1 py-2.5 text-xs font-extrabold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === 'solution'
                    ? 'text-indigo-400 border-indigo-500 bg-indigo-500/10'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>Tanggapan & Solusi AI ✨</span>
              </button>
            </div>

            {/* Tab 1: Story Content */}
            {activeTab === 'content' && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-300">Isi Jurnal & Refleksi:</span>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800 whitespace-pre-line">
                    "{selectedJournal.content}"
                  </p>
                </div>

                {selectedJournal.gratitudeText && (
                  <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-2xl space-y-1">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hal yang Disyukuri Hari Itu:</span>
                    </span>
                    <p className="text-xs text-emerald-100/90">{selectedJournal.gratitudeText}</p>
                  </div>
                )}

                {selectedJournal.problemsText && (
                  <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-2xl space-y-1">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Kendala / Masalah yang Dirasakan:</span>
                    </span>
                    <p className="text-xs text-amber-100/90">{selectedJournal.problemsText}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: AI Solution & Learning Advisor */}
            {activeTab === 'solution' && (
              <div className="space-y-4 animate-fade-in">
                {/* 1. AI Analysis & Learning Insight */}
                <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-extrabold text-indigo-300 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-indigo-400" />
                    <span>1. Evaluasi & Hikmah Pembelajaran (Growth Mindset):</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-indigo-500/20">
                    {getAILearning(selectedJournal)}
                  </p>
                </div>

                {/* 2. Concrete Actionable Solution */}
                <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>2. Rekomendasi Solusi Praktis & Langkah Nyata:</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-emerald-500/20">
                    {getAISolution(selectedJournal)}
                  </p>
                </div>

                {/* 3. Affirmation & Tough Love Advice */}
                <div className="bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30 p-4 rounded-2xl flex items-start gap-3">
                  <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-purple-200 leading-relaxed">
                    <strong>Pesan AI Partner:</strong> Jangan pernah merasa bersalah saat tubuh membutuhkan istirahat atau ketika rencana tidak berjalan 100% sempurna. Jadikan catatan ini sebagai kompas untuk memperbaiki jadwal esok hari!
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer with Multi-Journal Navigation */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Pindah Jurnal ({dateJournals.length} total):</span>
                <div className="flex gap-1 ml-1">
                  {dateJournals.map((j, i) => (
                    <button
                      key={j.id || i}
                      onClick={() => setSelectedJournal(j)}
                      className={`w-6 h-6 rounded-lg text-xs font-mono font-bold transition-all ${
                        selectedJournal.id === j.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab(activeTab === 'content' ? 'solution' : 'content')}
                  className="py-2 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-500/30 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activeTab === 'content' ? 'Buka Solusi AI' : 'Lihat Cerita Asli'}</span>
                </button>
                <button
                  onClick={() => setSelectedJournal(null)}
                  className="py-2 px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
