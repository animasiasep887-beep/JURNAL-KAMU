// ==========================================
// PERSISTENT STORAGE MANAGER (LOCALSTORAGE & BACKUP)
// ==========================================

import type {
  User,
  Account,
  Transaction,
  Budget,
  JournalEntry,
  Activity,
  Task,
  Workout,
  Habit,
  HabitLog,
  Goal,
  Achievement,
  TelegramIntegration,
  SystemAuditLog,
  Coupon,
  SubscriptionHistoryItem,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_JOURNALS,
  INITIAL_ACTIVITIES,
  INITIAL_TASKS,
  INITIAL_WORKOUTS,
  INITIAL_HABITS,
  INITIAL_HABIT_LOGS,
  INITIAL_GOALS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_TELEGRAM_INTEGRATION,
  INITIAL_AUDIT_LOGS,
  INITIAL_COUPONS,
  INITIAL_SUBSCRIPTION_HISTORY,
} from './initialData';

const KEYS = {
  USERS: 'lifeos_users',
  CURRENT_USER_ID: 'lifeos_current_user_id',
  ACCOUNTS: 'lifeos_accounts',
  TRANSACTIONS: 'lifeos_transactions',
  BUDGETS: 'lifeos_budgets',
  JOURNALS: 'lifeos_journals',
  ACTIVITIES: 'lifeos_activities',
  TASKS: 'lifeos_tasks',
  WORKOUTS: 'lifeos_workouts',
  HABITS: 'lifeos_habits',
  HABIT_LOGS: 'lifeos_habit_logs',
  GOALS: 'lifeos_goals',
  ACHIEVEMENTS: 'lifeos_achievements',
  TELEGRAM: 'lifeos_telegram',
  AUDIT_LOGS: 'lifeos_audit_logs',
  COUPONS: 'lifeos_coupons',
  SUBSCRIPTIONS: 'lifeos_subscriptions',
  PIN_LOCKED: 'lifeos_pin_locked',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage`, e);
  }
}

export const storage = {
  getUsers: (): User[] => getItem(KEYS.USERS, INITIAL_USERS),
  setUsers: (users: User[]) => setItem(KEYS.USERS, users),

  getCurrentUserId: (): string => getItem(KEYS.CURRENT_USER_ID, 'user-bintang'),
  setCurrentUserId: (id: string) => setItem(KEYS.CURRENT_USER_ID, id),

  getAccounts: (): Account[] => getItem(KEYS.ACCOUNTS, INITIAL_ACCOUNTS),
  setAccounts: (accs: Account[]) => setItem(KEYS.ACCOUNTS, accs),

  getTransactions: (): Transaction[] => getItem(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS),
  setTransactions: (txs: Transaction[]) => setItem(KEYS.TRANSACTIONS, txs),

  getBudgets: (): Budget[] => getItem(KEYS.BUDGETS, INITIAL_BUDGETS),
  setBudgets: (b: Budget[]) => setItem(KEYS.BUDGETS, b),

  getJournals: (): JournalEntry[] => getItem(KEYS.JOURNALS, INITIAL_JOURNALS),
  setJournals: (j: JournalEntry[]) => setItem(KEYS.JOURNALS, j),

  getActivities: (): Activity[] => getItem(KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
  setActivities: (act: Activity[]) => setItem(KEYS.ACTIVITIES, act),

  getTasks: (): Task[] => getItem(KEYS.TASKS, INITIAL_TASKS),
  setTasks: (t: Task[]) => setItem(KEYS.TASKS, t),

  getWorkouts: (): Workout[] => getItem(KEYS.WORKOUTS, INITIAL_WORKOUTS),
  setWorkouts: (w: Workout[]) => setItem(KEYS.WORKOUTS, w),

  getHabits: (): Habit[] => getItem(KEYS.HABITS, INITIAL_HABITS),
  setHabits: (h: Habit[]) => setItem(KEYS.HABITS, h),

  getHabitLogs: (): HabitLog[] => getItem(KEYS.HABIT_LOGS, INITIAL_HABIT_LOGS),
  setHabitLogs: (hl: HabitLog[]) => setItem(KEYS.HABIT_LOGS, hl),

  getGoals: (): Goal[] => getItem(KEYS.GOALS, INITIAL_GOALS),
  setGoals: (g: Goal[]) => setItem(KEYS.GOALS, g),

  getAchievements: (): Achievement[] => getItem(KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS),
  setAchievements: (ach: Achievement[]) => setItem(KEYS.ACHIEVEMENTS, ach),

  getTelegram: (): TelegramIntegration => getItem(KEYS.TELEGRAM, INITIAL_TELEGRAM_INTEGRATION),
  setTelegram: (tg: TelegramIntegration) => setItem(KEYS.TELEGRAM, tg),

  getAuditLogs: (): SystemAuditLog[] => getItem(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS),
  setAuditLogs: (logs: SystemAuditLog[]) => setItem(KEYS.AUDIT_LOGS, logs),

  getCoupons: (): Coupon[] => getItem(KEYS.COUPONS, INITIAL_COUPONS),
  setCoupons: (c: Coupon[]) => setItem(KEYS.COUPONS, c),

  getSubscriptions: (): SubscriptionHistoryItem[] => getItem(KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTION_HISTORY),
  setSubscriptions: (sub: SubscriptionHistoryItem[]) => setItem(KEYS.SUBSCRIPTIONS, sub),

  getPinLocked: (): boolean => getItem(KEYS.PIN_LOCKED, false),
  setPinLocked: (locked: boolean) => setItem(KEYS.PIN_LOCKED, locked),

  exportFullBackupJSON: () => {
    const backup = {
      users: storage.getUsers(),
      accounts: storage.getAccounts(),
      transactions: storage.getTransactions(),
      budgets: storage.getBudgets(),
      journals: storage.getJournals(),
      activities: storage.getActivities(),
      tasks: storage.getTasks(),
      workouts: storage.getWorkouts(),
      habits: storage.getHabits(),
      habitLogs: storage.getHabitLogs(),
      goals: storage.getGoals(),
      achievements: storage.getAchievements(),
      telegram: storage.getTelegram(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  restoreBackupJSON: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.users) storage.setUsers(data.users);
      if (data.accounts) storage.setAccounts(data.accounts);
      if (data.transactions) storage.setTransactions(data.transactions);
      if (data.budgets) storage.setBudgets(data.budgets);
      if (data.journals) storage.setJournals(data.journals);
      if (data.activities) storage.setActivities(data.activities);
      if (data.tasks) storage.setTasks(data.tasks);
      if (data.workouts) storage.setWorkouts(data.workouts);
      if (data.habits) storage.setHabits(data.habits);
      if (data.habitLogs) storage.setHabitLogs(data.habitLogs);
      if (data.goals) storage.setGoals(data.goals);
      return true;
    } catch (e) {
      console.error('Failed to restore backup JSON', e);
      return false;
    }
  },
};
