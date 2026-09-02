// ==========================================
// PERSONAL LIFE OS - CORE TYPES & DOMAIN MODELS
// ==========================================

export type Role = 'user' | 'admin' | 'super_admin';
export type AccountStatus = 'active' | 'inactive' | 'suspended' | 'banned' | 'pending_verification' | 'expired_membership';
export type MembershipPlanId = 'free' | 'monthly' | 'semi_annual' | 'yearly' | 'lifetime' | 'basic' | 'premium' | 'custom';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  whatsapp?: string;
  role: Role;
  status: AccountStatus;
  avatarUrl?: string;
  bio?: string; // Deskripsi diri / bio tentang user
  timezone: string;
  currency: string;
  membershipPlanId: MembershipPlanId;
  membershipStartDate: string; // ISO date
  membershipExpiryDate: string; // ISO date
  onboardingCompleted: boolean;
  pinCode?: string; // Privacy mode lock PIN
  createdAt: string;
  lastSeenAt: string;
}

export interface MembershipPlan {
  id: MembershipPlanId;
  name: string;
  priceFormatted: string;
  priceMonthly: number;
  durationDays: number;
  features: string[];
  limits: {
    aiAnalysis: boolean;
    advancedReports: boolean;
    telegramBot: boolean;
    gymModule: boolean;
    customCategories: boolean;
  };
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'cash' | 'bank' | 'ewallet' | 'savings' | 'investment' | 'business';
  balance: number;
  accountNumber?: string;
  notes?: string;
  isActive: boolean;
  updatedAt: string;
}

export type TransactionType = 'expense' | 'income' | 'transfer' | 'saving' | 'investment';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  subcategory?: string;
  description: string;
  sourceAccountId: string;
  targetAccountId?: string; // For transfer, saving, investment
  paymentMethod?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  timestamp: string; // ISO
  location?: string;
  receiptUrl?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'expense' | 'income';
  icon?: string;
  color?: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  monthlyLimit: number;
  period: string; // e.g., "2026-08"
}

export type MoodRating = 5 | 4 | 3 | 2 | 1; // 5=Sangat baik, 4=Baik, 3=Biasa, 2=Kurang baik, 1=Buruk

export interface JournalEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: MoodRating;
  energyLevel: number; // 1-10
  stressLevel: number; // 1-10
  motivationLevel: number; // 1-10
  gratitudeText?: string;
  learnedText?: string;
  problemsText?: string;
  solutionsText?: string;
  highlightText?: string;
  evaluationText?: string;
  tomorrowPlanText?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  name: string;
  category: 'productive' | 'work' | 'study' | 'gym' | 'rest' | 'entertainment' | 'social' | 'other';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  status: 'completed' | 'in_progress' | 'cancelled';
  location?: string;
  notes?: string;
}

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  reminderTime?: string; // ISO
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly';
  checklist: Subtask[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: 'Chest' | 'Back' | 'Shoulders' | 'Legs' | 'Arms' | 'Core' | 'Cardio';
  description?: string;
  equipment?: string;
  difficulty?: 'Pemula' | 'Menengah' | 'Mahir';
  targetMuscles?: string[];
  steps?: string[];
  commonMistakes?: string[];
  proTips?: string;
  animationType?: string;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  rpe?: number; // 1-10 Rate of Perceived Exertion
  restSeconds?: number;
}

export interface WorkoutExerciseLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
  durationMinutes: number;
  workoutType: string; // e.g., "Chest + Triceps", "Leg Day"
  muscleGroups: string[];
  exerciseLogs: WorkoutExerciseLog[];
  notes?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  category: string;
  frequency: 'daily' | 'weekly';
  targetDaysPerWeek?: number;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  type: 'finance' | 'gym' | 'personal' | 'career';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string; // YYYY-MM-DD
  milestones: { id: string; title: string; completed: boolean }[];
  status: 'in_progress' | 'achieved' | 'paused';
  createdAt: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category: 'journal' | 'gym' | 'finance' | 'tasks' | 'habits';
  unlockedAt?: string; // ISO date if unlocked
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'reminder' | 'budget_warning' | 'task_deadline' | 'workout_reminder' | 'daily_review' | 'weekly_report' | 'achievement' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface TelegramIntegration {
  id: string;
  userId: string;
  telegramUserId?: string;
  telegramChatId?: string;
  telegramUsername?: string;
  status: 'connected' | 'not_connected' | 'error';
  connectionCode: string;
  connectedAt?: string;
  lastMessageAt?: string;
  settings: {
    notificationsEnabled: boolean;
    morningBriefing: boolean;
    morningBriefingTime: string; // e.g. "07:00"
    nightlyReview: boolean;
    nightlyReviewTime: string; // e.g. "21:00"
    expenseConfirmation: boolean;
    budgetWarning: boolean;
    taskReminder: boolean;
    gymReminder: boolean;
    membershipWarning: boolean;
    weeklyReport: boolean;
  };
}

export interface SystemAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetUserId?: string;
  targetUserName?: string;
  metadata?: string;
  timestamp: string;
}

export interface SubscriptionHistoryItem {
  id: string;
  userId: string;
  planId: MembershipPlanId;
  planName: string;
  startDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'extended' | 'cancelled';
  activatedBy: string; // Admin name or 'System'
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  bonusDays: number;
  expiryDate: string;
  maxUsage: number;
  usageCount: number;
  status: 'active' | 'disabled';
}

export interface Referral {
  id: string;
  referrerUserId: string;
  referredUserId: string;
  code: string;
  status: 'pending' | 'rewarded';
  createdAt: string;
}

export interface RecurringSubscription {
  id: string;
  userId: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  billingDay: number; // 1-31
  category: string;
  paymentMethod?: string;
  icon?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

export interface DebtItem {
  id: string;
  userId: string;
  type: 'payable' | 'receivable'; // payable = hutang saya, receivable = orang lain hutang ke saya
  personName: string;
  amount: number;
  paidAmount: number;
  dueDate?: string; // YYYY-MM-DD
  notes?: string;
  status: 'unpaid' | 'partial' | 'settled';
  createdAt: string;
  updatedAt: string;
}

export interface PersonalReward {
  id: string;
  userId: string;
  title: string;
  costCoins: number;
  icon: string;
  description?: string;
  isClaimed?: boolean;
  claimedAt?: string;
  createdAt: string;
}

export interface PomodoroLog {
  id: string;
  userId: string;
  taskTitle: string;
  durationMinutes: number;
  type: 'focus' | 'short_break' | 'long_break';
  completedAt: string;
}

export interface AISettings {
  geminiApiKey: string;
  isGeminiActive: boolean;
  customCoachPersona?: string;
}

