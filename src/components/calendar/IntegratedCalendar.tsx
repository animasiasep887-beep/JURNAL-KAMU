import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { getTodayString, formatDateIndonesian, formatIDR } from '../../utils/formatters';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Dumbbell, Wallet, CheckSquare, BookOpen, RotateCcw } from 'lucide-react';

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const IntegratedCalendar: React.FC = () => {
  const { transactions, workouts, tasks, journals } = useData();

  const todayStr = getTodayString();
  const todayDate = new Date(todayStr);

  const [currentYear, setCurrentYear] = useState<number>(todayDate.getFullYear() || 2026);
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.getMonth() || 7); // 0-indexed (7 = Agustus)
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleResetToday = () => {
    setCurrentYear(todayDate.getFullYear());
    setCurrentMonth(todayDate.getMonth());
    setSelectedDate(todayStr);
  };

  // Calendar days computation
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon...
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const daysArray: (string | null)[] = [];
  // Empty slots before 1st day of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }
  // Days 1..N
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    daysArray.push(`${currentYear}-${monthStr}-${dayStr}`);
  }

  // Selected date details
  const selectedDateTxs = transactions.filter((t) => t.date === selectedDate);
  const selectedDateWorkouts = workouts.filter((w) => w.date === selectedDate);
  const selectedDateTasks = tasks.filter((t) => t.dueDate === selectedDate);
  const selectedDateJournals = journals.filter((j) => j.date === selectedDate);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Calendar Header with Dynamic Month Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            <span>Integrated Master Calendar</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Gabungan Task, Workout, Expense, & Journal dalam satu kalender interaktif.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-medium text-slate-400 mr-2">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Expense</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Gym</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Journal</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Task</span>
          </div>

          {/* Month Switch Controls */}
          <div className="flex items-center bg-slate-800 border border-slate-700/80 rounded-2xl p-1 shadow-inner">
            <button
              onClick={handlePrevMonth}
              title="Bulan Sebelumnya"
              className="p-1.5 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 text-xs font-extrabold text-slate-100 font-mono min-w-[130px] text-center">
              {MONTH_NAMES_ID[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              title="Bulan Berikutnya"
              className="p-1.5 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleResetToday}
            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-xl flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Hari Ini
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
          <div key={d} className="text-center text-xs font-bold text-slate-400 py-2 uppercase tracking-wider">
            {d}
          </div>
        ))}

        {daysArray.map((dStr, idx) => {
          if (!dStr) {
            return <div key={`empty-${idx}`} className="h-20 bg-slate-900/30 rounded-2xl border border-slate-900" />;
          }

          const dayNum = parseInt(dStr.split('-')[2], 10);
          const hasTx = transactions.some((t) => t.date === dStr);
          const hasWorkout = workouts.some((w) => w.date === dStr);
          const hasJournal = journals.some((j) => j.date === dStr);
          const hasTask = tasks.some((t) => t.dueDate === dStr);
          const isSelected = selectedDate === dStr;
          const isToday = dStr === todayStr;

          return (
            <button
              key={dStr}
              onClick={() => setSelectedDate(dStr)}
              className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-20 ${
                isSelected
                  ? 'bg-indigo-600/30 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg'
                  : isToday
                  ? 'bg-slate-800/80 border-amber-500/50 ring-1 ring-amber-500/30'
                  : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold font-mono ${isSelected ? 'text-indigo-300' : isToday ? 'text-amber-300' : 'text-slate-200'}`}>
                  {dayNum}
                </span>
                {isToday && (
                  <span className="text-[9px] font-bold px-1 rounded bg-amber-500/20 text-amber-300">
                    Hari Ini
                  </span>
                )}
              </div>

              <div className="flex gap-1 flex-wrap mt-1">
                {hasTx && <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" title="Expense" />}
                {hasWorkout && <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm" title="Workout" />}
                {hasJournal && <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" title="Journal" />}
                {hasTask && <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm" title="Task" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Date Detail Drawer */}
      <div className="bg-slate-800/50 border border-slate-700/60 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Aktivitas Pada Tanggal: {formatDateIndonesian(selectedDate)}</span>
          </div>
          <span className="text-xs font-mono text-indigo-400 font-semibold">{selectedDate}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Finance Section */}
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Wallet className="w-4 h-4" /> Pengeluaran & Transaksi ({selectedDateTxs.length})
            </div>
            {selectedDateTxs.length === 0 ? (
              <div className="text-xs text-slate-500 italic">Tidak ada transaksi.</div>
            ) : (
              selectedDateTxs.map((t) => (
                <div key={t.id} className="text-xs text-slate-300 flex justify-between py-1 border-b border-slate-800/60">
                  <span className="truncate pr-1">• {t.description}</span>
                  <span className="font-mono text-amber-400 font-bold shrink-0">{formatIDR(t.amount)}</span>
                </div>
              ))
            )}
          </div>

          {/* Gym Section */}
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4" /> Workout Gym ({selectedDateWorkouts.length})
            </div>
            {selectedDateWorkouts.length === 0 ? (
              <div className="text-xs text-slate-500 italic">Tidak ada sesi gym.</div>
            ) : (
              selectedDateWorkouts.map((w) => (
                <div key={w.id} className="text-xs text-slate-300 py-1">
                  <div className="font-semibold text-rose-300">• {w.workoutType}</div>
                  <div className="text-[11px] text-slate-400">{w.exerciseLogs.length} latihan • {w.durationMinutes} menit</div>
                </div>
              ))
            )}
          </div>

          {/* Tasks Section */}
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4" /> To-Do Tasks ({selectedDateTasks.length})
            </div>
            {selectedDateTasks.length === 0 ? (
              <div className="text-xs text-slate-500 italic">Tidak ada task.</div>
            ) : (
              selectedDateTasks.map((t) => (
                <div key={t.id} className="text-xs text-slate-300 py-1 flex items-center gap-1.5">
                  <span className={t.status === 'done' ? 'text-emerald-400' : 'text-amber-400'}>
                    {t.status === 'done' ? '✅' : '🔴'}
                  </span>
                  <span className={t.status === 'done' ? 'line-through text-slate-500' : ''}>{t.title}</span>
                </div>
              ))
            )}
          </div>

          {/* Journal Section */}
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> Daily Journal</span>
              <span className="text-[10px] font-mono text-slate-400">({selectedDateJournals.length} Jurnal)</span>
            </div>
            {selectedDateJournals.length > 0 ? (
              <div className="space-y-2 divide-y divide-slate-800">
                {selectedDateJournals.map((j) => (
                  <div key={j.id} className="text-xs text-slate-300 pt-1.5 first:pt-0 space-y-1">
                    <div className="font-semibold text-emerald-300">"{j.title}"</div>
                    <div className="text-[11px] text-slate-400 line-clamp-2">"{j.content}"</div>
                    <div className="text-[10px] text-amber-400 font-semibold">
                      Mood: {j.mood === 5 ? '🔥 Sangat Baik' : (j.mood === 3 ? '🙂 Normal' : '😀 Baik')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">Belum ada jurnal harian.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
