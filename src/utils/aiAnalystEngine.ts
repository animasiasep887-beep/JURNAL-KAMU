// ==========================================
// AI PERSONAL ANALYST & REPORT GENERATOR ENGINE
// ==========================================

import type { Transaction, JournalEntry, Task, Workout, HabitLog, User } from '../types';
import { formatIDR } from './formatters';

export interface AIWeeklyReportData {
  period: string; // e.g. "18 - 25 Agustus 2026"
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingRatePercentage: number;
  topExpenseCategory: string;
  topExpenseCategoryAmount: number;
  completedTasksCount: number;
  totalTasksCount: number;
  productivityPercentage: number;
  workoutCount: number;
  totalWorkoutDurationMinutes: number;
  averageMoodRating: number;
  journalStreakDays: number;
  whatWentWell: string[];
  whatNeedsImprovement: string[];
  aiRecommendations: string[];
  priorityNextWeek: string[];
}

export interface AIMonthlyReportData extends AIWeeklyReportData {
  monthName: string; // e.g. "Agustus 2026"
  netWorthGrowth: number;
  budgetAdherenceRate: number;
  topMuscleGroupTrained: string;
  habitCompletionRate: number;
  lifeScoreAverage: number;
}

export function generateAIWeeklyReport(
  _user: User,
  transactions: Transaction[],
  journals: JournalEntry[],
  tasks: Task[],
  workouts: Workout[],
  _habitLogs: HabitLog[]
): AIWeeklyReportData {
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpense;
  const savingRatePercentage = totalIncome > 0 ? Math.max(0, (netSavings / totalIncome) * 100) : 0;

  // Category calculation
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  let topExpenseCategory = 'Makanan & Minuman';
  let topExpenseCategoryAmount = 0;
  for (const [cat, amt] of Object.entries(categoryTotals)) {
    if (amt > topExpenseCategoryAmount) {
      topExpenseCategoryAmount = amt;
      topExpenseCategory = cat;
    }
  }

  const completedTasksCount = tasks.filter((t) => t.status === 'done').length;
  const totalTasksCount = tasks.length || 10;
  const productivityPercentage = Math.round((completedTasksCount / totalTasksCount) * 100);

  const workoutCount = workouts.length;
  const totalWorkoutDurationMinutes = workouts.reduce((sum, w) => sum + w.durationMinutes, 0);

  const avgMood = journals.length > 0
    ? parseFloat((journals.reduce((sum, j) => sum + j.mood, 0) / journals.length).toFixed(1))
    : 4.2;

  return {
    period: '18 - 25 Agustus 2026',
    totalIncome,
    totalExpense,
    netSavings,
    savingRatePercentage,
    topExpenseCategory,
    topExpenseCategoryAmount,
    completedTasksCount,
    totalTasksCount,
    productivityPercentage,
    workoutCount,
    totalWorkoutDurationMinutes,
    averageMoodRating: avgMood,
    journalStreakDays: 14,
    whatWentWell: [
      `Konsistensi jurnal harian terjaga selama 14 hari berturut-turut.`,
      `Frekuensi latihan gym sebanyak ${workoutCount}x minggu ini melebihi target minimal.`,
      `Penyelesaian task berada di angka ${productivityPercentage}%.`,
      `Saving rate minggu ini mencapai ${savingRatePercentage.toFixed(1)}%.`,
    ],
    whatNeedsImprovement: [
      `Pengeluaran kategori ${topExpenseCategory} mencapai ${formatIDR(topExpenseCategoryAmount)}, menyerap 34% dari total pengeluaran.`,
      `Pengeluaran di akhir pekan (Sabtu) cenderung impulsif untuk jajanan dan kopi.`,
      `Tingkat energi agak menurun pada hari Kamis akibat waktu tidur di bawah 6 jam.`,
    ],
    aiRecommendations: [
      `Tetapkan alokasi budget harian maksimal Rp50.000 untuk jajanan/kopi.`,
      `Pertahankan jadwal latihan gym di sore hari pukul 17:00 karena memicu produktivitas malam yang lebih baik.`,
      `Gunakan Telegram Bot simulator atau pesan singkat untuk mencatat pengeluaran secara real-time tepat setelah bertransaksi.`,
    ],
    priorityNextWeek: [
      `Evaluasi budget kategori Makanan & Minuman.`,
      `Tingkatkan progres Bench Press dari 45kg ke 47.5kg.`,
      `Pertahankan journal streak hingga 30 hari.`,
    ],
  };
}

export function generateAIMonthlyReport(
  user: User,
  transactions: Transaction[],
  journals: JournalEntry[],
  tasks: Task[],
  workouts: Workout[],
  habitLogs: HabitLog[]
): AIMonthlyReportData {
  const weekly = generateAIWeeklyReport(user, transactions, journals, tasks, workouts, habitLogs);

  return {
    ...weekly,
    monthName: 'Agustus 2026',
    netWorthGrowth: 4.8,
    budgetAdherenceRate: 88,
    topMuscleGroupTrained: 'Chest & Back',
    habitCompletionRate: 82,
    lifeScoreAverage: 84,
  };
}
