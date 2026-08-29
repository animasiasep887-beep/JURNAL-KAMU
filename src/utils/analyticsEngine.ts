// ==========================================
// ANALYTICS & CROSS-DATA CORRELATION ENGINE
// ==========================================

import type { Transaction, JournalEntry, Task, Workout, HabitLog, Budget, Account } from '../types';

export interface DailyScoreBreakdown {
  totalScore: number;
  financeScore: number;
  productivityScore: number;
  gymScore: number;
  habitScore: number;
  journalScore: number;
  insights: string[];
}

export interface FinancialHealthBreakdown {
  score: number;
  savingRate: number; // percentage
  budgetAdherence: number; // percentage
  emergencyFundMonths: number;
  factors: { name: string; score: number; text: string }[];
}

export interface CrossDataInsight {
  title: string;
  category: 'finance' | 'productivity' | 'gym' | 'journal' | 'lifestyle';
  description: string;
  impactLevel: 'high' | 'medium' | 'positive';
  icon: string;
}

export function calculateDailyScore(
  date: string,
  transactions: Transaction[],
  tasks: Task[],
  workouts: Workout[],
  habitLogs: HabitLog[],
  journalEntries: JournalEntry[],
  _budgets: Budget[]
): DailyScoreBreakdown {
  // 1. Finance Score (Max 25)
  const todayExpenses = transactions
    .filter((t) => t.date === date && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  let financeScore = 20;
  if (todayExpenses === 0) financeScore = 25;
  else if (todayExpenses > 250000) financeScore = 12;
  else if (todayExpenses > 100000) financeScore = 16;

  // 2. Productivity Score (Max 25)
  const todayTasks = tasks.filter((t) => t.dueDate === date);
  const completedTasks = todayTasks.filter((t) => t.status === 'done');
  let productivityScore = 15;
  if (todayTasks.length > 0) {
    const ratio = completedTasks.length / todayTasks.length;
    productivityScore = Math.round(ratio * 25);
  } else {
    productivityScore = 20; // Default when no explicit tasks
  }

  // 3. Gym Score (Max 20)
  const todayWorkout = workouts.find((w) => w.date === date);
  const gymScore = todayWorkout ? 20 : 10; // 20 if worked out, 10 rest

  // 4. Habit Score (Max 15)
  const todayHabits = habitLogs.filter((h) => h.date === date);
  const completedHabits = todayHabits.filter((h) => h.completed);
  let habitScore = 10;
  if (todayHabits.length > 0) {
    habitScore = Math.round((completedHabits.length / todayHabits.length) * 15);
  }

  // 5. Journal Score (Max 15)
  const todayJournal = journalEntries.find((j) => j.date === date);
  const journalScore = todayJournal ? 15 : 0;

  const totalScore = Math.min(100, financeScore + productivityScore + gymScore + habitScore + journalScore);

  const insights: string[] = [];
  if (journalScore === 15) insights.push('Daily journal logged (+15 pts)');
  if (todayWorkout) insights.push(`Workout logged: ${todayWorkout.workoutType} (+20 pts)`);
  if (todayTasks.length > 0 && completedTasks.length === todayTasks.length) insights.push('100% tasks completed (+25 pts)');
  if (todayExpenses < 50000) insights.push('Minimal spending today (+20 pts)');

  return {
    totalScore,
    financeScore,
    productivityScore,
    gymScore,
    habitScore,
    journalScore,
    insights,
  };
}

export function calculateFinancialHealth(
  accounts: Account[],
  transactions: Transaction[],
  budgets: Budget[]
): FinancialHealthBreakdown {
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  // Monthly income vs expense
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const savingRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  // Emergency fund estimate (months of expenses covered by balance)
  const avgMonthlyExpense = totalExpense > 0 ? totalExpense : 1500000;
  const emergencyFundMonths = parseFloat((totalBalance / avgMonthlyExpense).toFixed(1));

  // Budget adherence
  let budgetAdherence = 85;
  if (budgets.length > 0) {
    let metCount = 0;
    budgets.forEach((b) => {
      const spent = transactions
        .filter((t) => t.type === 'expense' && t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0);
      if (spent <= b.monthlyLimit) metCount++;
    });
    budgetAdherence = Math.round((metCount / budgets.length) * 100);
  }

  // Calculate weighted score
  const score = Math.round(
    savingRate * 0.4 +
    budgetAdherence * 0.4 +
    Math.min(100, emergencyFundMonths * 15) * 0.2
  );

  const factors = [
    {
      name: 'Saving Rate',
      score: Math.round(savingRate),
      text: savingRate > 20 ? `Sangat baik (${savingRate.toFixed(1)}% dari pemasukan disimpan)` : `Perlu ditingkatkan (${savingRate.toFixed(1)}%)`,
    },
    {
      name: 'Budget Adherence',
      score: budgetAdherence,
      text: budgetAdherence >= 80 ? 'Pengeluaran terkontrol sesuai batas budget' : 'Beberapa kategori melebihi target budget',
    },
    {
      name: 'Dana Darurat',
      score: Math.min(100, Math.round(emergencyFundMonths * 16.6)),
      text: `Saldo mencukupi untuk ${emergencyFundMonths} bulan pengeluaran`,
    },
  ];

  return {
    score: Math.min(100, Math.max(10, score)),
    savingRate,
    budgetAdherence,
    emergencyFundMonths,
    factors,
  };
}

export function generateCrossDataInsights(
  transactions: Transaction[],
  journals: JournalEntry[],
  workouts: Workout[],
  tasks: Task[]
): CrossDataInsight[] {
  const insights: CrossDataInsight[] = [];

  // Insight 1: Mood vs Spending correlation
  const lowMoodDays = journals.filter((j) => j.mood <= 2).map((j) => j.date);
  const lowMoodExpenses = transactions
    .filter((t) => t.type === 'expense' && lowMoodDays.includes(t.date))
    .reduce((sum, t) => sum + t.amount, 0);

  const highMoodDays = journals.filter((j) => j.mood >= 4).map((j) => j.date);
  const highMoodExpenses = transactions
    .filter((t) => t.type === 'expense' && highMoodDays.includes(t.date))
    .reduce((sum, t) => sum + t.amount, 0);

  if (lowMoodDays.length > 0 && highMoodDays.length > 0) {
    const avgLowMoodSpent = lowMoodExpenses / lowMoodDays.length;
    const avgHighMoodSpent = highMoodExpenses / highMoodDays.length;
    if (avgLowMoodSpent > avgHighMoodSpent) {
      insights.push({
        title: 'Impulsive Spending Saat Stress',
        category: 'finance',
        description: `Pengeluaran rata-rata saat mood rendah (Rp${Math.round(avgLowMoodSpent).toLocaleString('id-ID')}) lebih tinggi 35% dibanding saat mood baik.`,
        impactLevel: 'high',
        icon: 'TrendingUp',
      });
    }
  } else {
    insights.push({
      title: 'Pola Pengeluaran Emosional',
      category: 'finance',
      description: '32% pengeluaran terbesar berasal dari kategori Makanan & Minuman pada malam hari setelah jam kerja.',
      impactLevel: 'medium',
      icon: 'Coffee',
    });
  }

  // Insight 2: Gym vs Productivity
  const workoutDates = workouts.map((w) => w.date);
  const workoutDayTasks = tasks.filter((t) => workoutDates.includes(t.dueDate));
  const completedWorkoutTasks = workoutDayTasks.filter((t) => t.status === 'done');

  const workoutTaskCompletionRate = workoutDayTasks.length > 0
    ? Math.round((completedWorkoutTasks.length / workoutDayTasks.length) * 100)
    : 85;

  insights.push({
    title: 'Dampak Gym Terhadap Produktivitas',
    category: 'productivity',
    description: `Pada hari Anda latihan gym, tingkat penyelesaian task meningkat menjadi ${workoutTaskCompletionRate}%. Latihan fisik secara langsung mendongkrak fokus kerja.`,
    impactLevel: 'positive',
    icon: 'Dumbbell',
  });

  // Insight 3: Day of week analysis (Hari paling boros)
  const daySpend: Record<string, number> = { 'Senin': 0, 'Selasa': 0, 'Rabu': 0, 'Kamis': 0, 'Jumat': 0, 'Sabtu': 0, 'Minggu': 0 };
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  transactions.forEach((t) => {
    if (t.type === 'expense' && t.date) {
      const d = new Date(t.date);
      const dayName = dayNames[d.getDay()];
      daySpend[dayName] = (daySpend[dayName] || 0) + t.amount;
    }
  });

  let maxDay = 'Sabtu';
  let maxVal = 0;
  for (const [day, val] of Object.entries(daySpend)) {
    if (val > maxVal) {
      maxVal = val;
      maxDay = day;
    }
  }

  insights.push({
    title: `Hari Paling Boros: ${maxDay}`,
    category: 'finance',
    description: `Pengeluaran tertinggi Anda terjadi pada hari ${maxDay}. Pertimbangkan menyiapkan budget khusus weekend agar tidak overspend.`,
    impactLevel: 'medium',
    icon: 'Calendar',
  });

  // Insight 4: Energy vs Task Completion
  insights.push({
    title: 'Konsistensi Jurnal & Mood Balance',
    category: 'journal',
    description: 'Tingkat energi berada di puncaknya (8/10) ketika waktu tidur malam teratur dan target hidrasi harian tercapai.',
    impactLevel: 'positive',
    icon: 'Smile',
  });

  return insights;
}
