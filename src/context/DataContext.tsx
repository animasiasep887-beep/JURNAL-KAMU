import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import type {
  Account,
  Transaction,
  Budget,
  JournalEntry,
  Activity,
  Task,
  Exercise,
  Workout,
  Habit,
  HabitLog,
  Goal,
  Achievement,
  TelegramIntegration,
  SystemAuditLog,
  SubscriptionHistoryItem,
  Coupon,
  MembershipPlanId,
} from '../types';
import type { TelegramBotMessage, ParsedTelegramExpense } from '../types/telegram';
import { storage } from '../utils/storage';
import {
  INITIAL_TELEGRAM_INTEGRATION,
  INITIAL_RECURRING_SUBSCRIPTIONS,
  INITIAL_DEBTS,
  INITIAL_REWARDS,
  INITIAL_AI_SETTINGS,
} from '../utils/initialData';
import { useAuth } from './AuthContext';
import { parseTelegramMessage } from '../utils/telegramParser';
import { getTodayString } from '../utils/formatters';

function getUserConnectionCode(userId: string): string {
  if (userId === 'user-bintang') return 'A7K92P';
  if (userId === 'user-reza') return 'RZ882P';
  if (userId === 'user-admin') return 'AD990X';
  
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  let val = Math.abs(hash);
  for (let i = 0; i < 6; i++) {
    code += chars[val % chars.length];
    val = Math.floor(val / chars.length) + (i * 7);
  }
  return code;
}

export interface DataContextType {
  // Accounts
  accounts: Account[];
  addAccount: (acc: Omit<Account, 'id' | 'userId' | 'updatedAt'>) => void;
  updateAccount: (id: string, updated: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, updated: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Budgets
  budgets: Budget[];
  addBudget: (b: Omit<Budget, 'id' | 'userId'>) => void;
  updateBudget: (id: string, updated: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  setBudgetLimit: (category: string, monthlyLimit: number) => void;

  // Journals
  journals: JournalEntry[];
  saveJournal: (j: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  saveJournalEntry: (j: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;

  // Activities
  activities: Activity[];
  addActivity: (a: Omit<Activity, 'id' | 'userId'>) => void;
  deleteActivity: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (t: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updated: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  // Workouts
  workouts: Workout[];
  addWorkout: (w: Omit<Workout, 'id' | 'userId' | 'createdAt'>) => void;
  addWorkoutLog: (w: Omit<Workout, 'id' | 'userId' | 'createdAt'>) => void;
  deleteWorkout: (id: string) => void;

  // Habits
  habits: Habit[];
  habitLogs: HabitLog[];
  addHabit: (h: Omit<Habit, 'id' | 'userId' | 'createdAt'> | string, category?: string) => void;
  deleteHabit: (id: string, name?: string) => void;
  toggleHabit: (habitId: string, date: string) => void;
  toggleHabitLog: (habitId: string, date: string) => void;

  // Goals
  goals: Goal[];
  addGoal: (g: Omit<Goal, 'id' | 'userId'>) => void;
  updateGoal: (id: string, updated: Partial<Goal>) => void;
  updateGoalProgress: (goalId: string, progress: number) => void;

  // Achievements
  achievements: Achievement[];

  // Telegram Integration
  telegram: TelegramIntegration;
  telegramMessages: TelegramBotMessage[];
  sendTelegramMessage: (text: string) => Promise<string>;
  updateTelegramSettings: (settings: Partial<TelegramIntegration['settings']>) => void;
  confirmTelegramTransaction: (messageIdOrParsed: any) => void;
  cancelTelegramTransaction: (messageId: string) => void;

  // Subscriptions & Coupons
  subscriptionHistory: SubscriptionHistoryItem[];
  coupons: Coupon[];
  applyCoupon: (code: string) => Coupon | null;
  addSubscriptionHistory: (item: Omit<SubscriptionHistoryItem, 'id' | 'createdAt'>) => void;

  // Admin Controls
  adminActivateMembership: (targetUserId: string, planId: MembershipPlanId, bonusDays?: number, isManual?: boolean) => void;
  adminCreateCoupon: (code: string | any, discount?: number, bonusDays?: number, maxUsage?: number) => void;

  // System Audit
  auditLogs: SystemAuditLog[];
  addAuditLog: (action: string, details?: string) => void;

  // Recurring Subscriptions
  recurringSubs: import('../types').RecurringSubscription[];
  addRecurringSub: (sub: Omit<import('../types').RecurringSubscription, 'id' | 'userId' | 'createdAt'>) => void;
  updateRecurringSub: (id: string, updated: Partial<import('../types').RecurringSubscription>) => void;
  deleteRecurringSub: (id: string) => void;

  // Debts & Receivables
  debts: import('../types').DebtItem[];
  addDebt: (debt: Omit<import('../types').DebtItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateDebt: (id: string, updated: Partial<import('../types').DebtItem>) => void;
  deleteDebt: (id: string) => void;
  recordDebtPayment: (id: string, paymentAmount: number) => void;

  // Personal Rewards Gamification Shop
  rewards: import('../types').PersonalReward[];
  addReward: (reward: Omit<import('../types').PersonalReward, 'id' | 'userId' | 'createdAt'>) => void;
  claimReward: (id: string) => boolean;
  deleteReward: (id: string) => void;

  // Pomodoro Focus Tracker
  pomodoroLogs: import('../types').PomodoroLog[];
  logPomodoroSession: (session: Omit<import('../types').PomodoroLog, 'id' | 'userId' | 'completedAt'>) => void;

  // AI BYOK Settings
  aiSettings: import('../types').AISettings;
  updateAISettings: (settings: Partial<import('../types').AISettings>) => void;

  // Cloud & Telegram Server Sync
  syncWithServer: () => Promise<boolean>;
  isSyncing: boolean;
  lastSyncedAt: string | null;

  // Fast Bulk Exporter / Backup
  exportAllData: () => string;
  exportBackup: () => string;
  restoreBackup: (jsonString: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, users, updateProfile, adminUpdateUser, adminUpdateUserStatus } = useAuth();
  const userId = currentUser?.id || 'user-bintang';

  // Base state for multi-user
  const [allAccounts, setAllAccounts] = useState<Account[]>(() => storage.getAccounts());
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(() => storage.getTransactions());
  const [allBudgets, setAllBudgets] = useState<Budget[]>(() => storage.getBudgets());
  const [allJournals, setAllJournals] = useState<JournalEntry[]>(() => storage.getJournals());
  const [allActivities, setAllActivities] = useState<Activity[]>(() => storage.getActivities());
  const [allTasks, setAllTasks] = useState<Task[]>(() => storage.getTasks());
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>(() => storage.getWorkouts());
  const [allHabits, setAllHabits] = useState<Habit[]>(() => storage.getHabits());
  const [allHabitLogs, setAllHabitLogs] = useState<HabitLog[]>(() => storage.getHabitLogs());
  const [allGoals, setAllGoals] = useState<Goal[]>(() => storage.getGoals());
  const [allAchievements, setAllAchievements] = useState<Achievement[]>(() => storage.getAchievements());

  const [telegramMessages, setTelegramMessages] = useState<TelegramBotMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: '👋 Halo! Saya asisten AI Personal Life OS Anda. Anda bisa mencatat transaksi (contoh: "Kopi 10k"), jurnal, atau jadwal gym langsung dari Telegram.',
      timestamp: new Date().toISOString(),
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() => storage.getAuditLogs());
  const [coupons, setCoupons] = useState<Coupon[]>(() => storage.getCoupons());
  const [subscriptions, setSubscriptions] = useState<SubscriptionHistoryItem[]>(() => storage.getSubscriptions());

  const [allRecurringSubs, setAllRecurringSubs] = useState<import('../types').RecurringSubscription[]>(() => {
    const s = storage.getRecurringSubscriptions();
    return s && s.length > 0 ? s : INITIAL_RECURRING_SUBSCRIPTIONS;
  });

  const [allDebts, setAllDebts] = useState<import('../types').DebtItem[]>(() => {
    const d = storage.getDebts();
    return d && d.length > 0 ? d : INITIAL_DEBTS;
  });

  const [allRewards, setAllRewards] = useState<import('../types').PersonalReward[]>(() => {
    const r = storage.getRewards();
    return r && r.length > 0 ? r : INITIAL_REWARDS;
  });

  const [allPomodoroLogs, setAllPomodoroLogs] = useState<import('../types').PomodoroLog[]>(() => storage.getPomodoroLogs());
  const [aiSettings, setAiSettings] = useState<import('../types').AISettings>(() => storage.getAISettings() || INITIAL_AI_SETTINGS);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Persistence effects
  useEffect(() => storage.setAccounts(allAccounts), [allAccounts]);
  useEffect(() => storage.setTransactions(allTransactions), [allTransactions]);
  useEffect(() => storage.setBudgets(allBudgets), [allBudgets]);
  useEffect(() => storage.setJournals(allJournals), [allJournals]);
  useEffect(() => storage.setActivities(allActivities), [allActivities]);
  useEffect(() => storage.setTasks(allTasks), [allTasks]);
  useEffect(() => storage.setWorkouts(allWorkouts), [allWorkouts]);
  useEffect(() => storage.setHabits(allHabits), [allHabits]);
  useEffect(() => storage.setHabitLogs(allHabitLogs), [allHabitLogs]);
  useEffect(() => storage.setGoals(allGoals), [allGoals]);
  useEffect(() => storage.setAchievements(allAchievements), [allAchievements]);
  useEffect(() => storage.setAuditLogs(auditLogs), [auditLogs]);
  useEffect(() => storage.setCoupons(coupons), [coupons]);
  useEffect(() => storage.setSubscriptions(subscriptions), [subscriptions]);
  useEffect(() => storage.setRecurringSubscriptions(allRecurringSubs), [allRecurringSubs]);
  useEffect(() => storage.setDebts(allDebts), [allDebts]);
  useEffect(() => storage.setRewards(allRewards), [allRewards]);
  useEffect(() => storage.setPomodoroLogs(allPomodoroLogs), [allPomodoroLogs]);
  useEffect(() => storage.setAISettings(aiSettings), [aiSettings]);

  const [dbBindings, setDbBindings] = useState<Record<string, any>>({});

  const lastBindingsJson = useRef<string>('');

  // Live Real-Time Sync with Real Telegram Bot Server /api/db (Polled safely without render flood)
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/db');
        if (res.ok) {
          const dbData = await res.json();
          if (dbData.bindings) {
            const newBindingsJson = JSON.stringify(dbData.bindings);
            if (newBindingsJson !== lastBindingsJson.current) {
              lastBindingsJson.current = newBindingsJson;
              setDbBindings(dbData.bindings);
            }
          }

          // 1. Sync incoming transactions
          if (dbData.transactions && Array.isArray(dbData.transactions)) {
            setAllTransactions((prev) => {
              const existingIds = new Set(prev.map((t) => t.id));
              const newTxs = dbData.transactions.filter((t: Transaction) => !existingIds.has(t.id));
              if (newTxs.length > 0) {
                try {
                  // Play gentle audio notification for incoming transaction
                  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                  if (AudioCtx) {
                    const c = new AudioCtx();
                    const osc = c.createOscillator();
                    const g = c.createGain();
                    osc.frequency.setValueAtTime(600, c.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.1);
                    g.gain.setValueAtTime(0.08, c.currentTime);
                    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
                    osc.connect(g);
                    g.connect(c.destination);
                    osc.start();
                    osc.stop(c.currentTime + 0.16);
                  }
                } catch (e) {}

                newTxs.forEach((tx: Transaction) => {
                  setAllAccounts((accs) =>
                    accs.map((a) => {
                      if (a.id === tx.sourceAccountId || a.type === 'cash') {
                        const delta = tx.type === 'income' ? tx.amount : -tx.amount;
                        return { ...a, balance: Math.max(0, a.balance + delta) };
                      }
                      return a;
                    })
                  );
                });
                return [...newTxs, ...prev];
              }
              return prev;
            });
          }

          // 2. Sync incoming journals from Telegram
          if (dbData.journals && Array.isArray(dbData.journals)) {
            setAllJournals((prev) => {
              const existingIds = new Set(prev.map((j) => j.id));
              const newJournals = dbData.journals.filter((j: JournalEntry) => !existingIds.has(j.id));
              if (newJournals.length > 0) {
                return [...newJournals, ...prev];
              }
              return prev;
            });
          }

          // 3. Sync incoming tasks from Telegram
          if (dbData.tasks && Array.isArray(dbData.tasks)) {
            setAllTasks((prev) => {
              const existingIds = new Set(prev.map((t) => t.id));
              const newTasks = dbData.tasks.filter((t: Task) => !existingIds.has(t.id));
              if (newTasks.length > 0) {
                return [...newTasks, ...prev];
              }
              return prev;
            });
          }

          // 4. Sync incoming workouts from Telegram
          if (dbData.workouts && Array.isArray(dbData.workouts)) {
            setAllWorkouts((prev) => {
              const existingIds = new Set(prev.map((w) => w.id));
              const newWorkouts = dbData.workouts.filter((w: Workout) => !existingIds.has(w.id));
              if (newWorkouts.length > 0) {
                return [...newWorkouts, ...prev];
              }
              return prev;
            });
          }
        }
      } catch (e) {
        // Silent polling catch
      }
    }, 2000);

    return () => clearInterval(syncInterval);
  }, []);

  // Multi-Tenant Telegram Integration Filtered & Generated per user with Live Binding Detection
  const userTelegram: TelegramIntegration = useMemo(() => {
    const code = getUserConnectionCode(userId);
    const matchingEntries = Object.entries(dbBindings).filter(
      ([_, val]: [string, any]) =>
        (val.code && val.code.toUpperCase() === code.toUpperCase()) ||
        val.userId === userId
    );

    // Pick the most recent connection or real chatId
    const boundEntry = matchingEntries.length > 0
      ? matchingEntries.sort((a, b) => {
          const tA = new Date(a[1].connectedAt || 0).getTime();
          const tB = new Date(b[1].connectedAt || 0).getTime();
          return tB - tA;
        })[0]
      : null;

    const isConnected = !!boundEntry;
    const chatId = boundEntry ? boundEntry[0] : '';

    return {
      id: `tg-${userId}`,
      userId,
      telegramUserId: chatId,
      telegramChatId: chatId,
      telegramUsername: (boundEntry && (boundEntry[1] as any).username) || '',
      status: isConnected ? 'connected' : 'not_connected',
      connectionCode: code,
      settings: INITIAL_TELEGRAM_INTEGRATION.settings,
    };
  }, [userId, dbBindings]);

  // Multi-Tenant Filtered Data per user (Memoized to prevent render loops)
  const currentCode = useMemo(() => getUserConnectionCode(userId), [userId]);

  const userAccounts = useMemo(
    () => allAccounts.filter((a) => a.userId === userId || (a as any).code === currentCode),
    [allAccounts, userId, currentCode]
  );

  const userTransactions = useMemo(
    () => allTransactions.filter((t) => t.userId === userId || (t as any).code === currentCode),
    [allTransactions, userId, currentCode]
  );

  const userBudgets = useMemo(
    () => allBudgets.filter((b) => b.userId === userId || (b as any).code === currentCode),
    [allBudgets, userId, currentCode]
  );

  const userJournals = useMemo(
    () => allJournals.filter((j) => j.userId === userId || (j as any).code === currentCode),
    [allJournals, userId, currentCode]
  );

  const userActivities = useMemo(
    () => allActivities.filter((a) => a.userId === userId || (a as any).code === currentCode),
    [allActivities, userId, currentCode]
  );

  const userTasks = useMemo(
    () => allTasks.filter((t) => t.userId === userId || (t as any).code === currentCode),
    [allTasks, userId, currentCode]
  );

  const userWorkouts = useMemo(
    () => allWorkouts.filter((w) => w.userId === userId || (w as any).code === currentCode),
    [allWorkouts, userId, currentCode]
  );

  const userHabits = useMemo(
    () => allHabits.filter((h) => h.userId === userId || (h as any).code === currentCode),
    [allHabits, userId, currentCode]
  );

  const userGoals = useMemo(
    () => allGoals.filter((g) => g.userId === userId || (g as any).code === currentCode),
    [allGoals, userId, currentCode]
  );

  const userHabitLogs = useMemo(
    () => allHabitLogs.filter((hl) => hl.userId === userId),
    [allHabitLogs, userId]
  );

  const lastSummaryJson = useRef<string>('');

  // Push active user summary to server for smart bot responses (Lightweight & Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const totalBalance = userAccounts.reduce((sum, a) => sum + a.balance, 0);
        const today = getTodayString();
        const todaySpent = userTransactions
          .filter((t) => t.date === today && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        const payload = {
          userId,
          code: currentCode,
          name: currentUser?.name || (currentCode === 'AD990X' ? 'Admin System' : 'User'),
          totalBalance,
          accounts: userAccounts.map((a) => ({ name: a.name, balance: a.balance })),
          todaySpent,
          todayTasksCount: userTasks.length,
          completedTasksCount: userTasks.filter((t) => t.status === 'done').length,
          tasks: userTasks.slice(0, 5).map((t) => ({ title: t.title, status: t.status })),
          goals: userGoals.slice(0, 5).map((g) => g.title),
          habits: userHabits.slice(0, 5).map((h) => h.name),
          recentWorkouts: userWorkouts.slice(0, 3).map((w) => `${(w as any).name || (w as any).exerciseName || 'Latihan'} (${w.date})`),
          recentJournals: userJournals.slice(0, 5).map((j) => ({ date: j.date, title: j.title, mood: j.mood, highlight: j.highlightText })),
        };

        const payloadStr = JSON.stringify(payload);
        if (payloadStr === lastSummaryJson.current) return;
        lastSummaryJson.current = payloadStr;

        fetch('/api/sync-user-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payloadStr,
        }).catch(() => {});
      } catch (e) {}
    }, 1000);

    return () => clearTimeout(timer);
  }, [userId, currentCode, userAccounts, userTransactions, userTasks, userGoals, userHabits, userWorkouts, userJournals, currentUser?.name]);

  // Accounts CRUD
  const addAccount = (acc: Omit<Account, 'id' | 'userId' | 'updatedAt'>) => {
    const newAcc: Account = {
      ...acc,
      id: `acc-${Date.now()}`,
      userId,
      updatedAt: new Date().toISOString(),
    };
    setAllAccounts((prev) => [...prev, newAcc]);
  };

  const updateAccount = (id: string, updated: Partial<Account>) => {
    setAllAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated, updatedAt: new Date().toISOString() } : a))
    );
  };

  const deleteAccount = (id: string) => {
    setAllAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  // Transactions CRUD
  const addTransaction = (tx: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      userId,
      timestamp: tx.timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAllTransactions((prev) => [newTx, ...prev]);

    // Update account balance
    setAllAccounts((prev) =>
      prev.map((a) => {
        if (a.id === tx.sourceAccountId) {
          const delta = tx.type === 'income' ? tx.amount : -tx.amount;
          return { ...a, balance: Math.max(0, a.balance + delta), updatedAt: new Date().toISOString() };
        }
        return a;
      })
    );
  };

  const updateTransaction = (id: string, updated: Partial<Transaction>) => {
    setAllTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated, updatedAt: new Date().toISOString() } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setAllTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Budgets CRUD
  const addBudget = (b: Omit<Budget, 'id' | 'userId'>) => {
    const newB: Budget = {
      ...b,
      id: `b-${Date.now()}`,
      userId,
    };
    setAllBudgets((prev) => [...prev, newB]);
  };

  const updateBudget = (id: string, updated: Partial<Budget>) => {
    setAllBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
  };

  const deleteBudget = (id: string) => {
    setAllBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const setBudgetLimit = (category: string, monthlyLimit: number) => {
    setAllBudgets((prev) => {
      const idx = prev.findIndex((b) => b.userId === userId && b.category === category);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], monthlyLimit };
        return updated;
      }
      return [...prev, { id: `b-${Date.now()}`, userId, category, monthlyLimit, spent: 0, period: 'monthly' }];
    });
  };

  // Journals CRUD
  const saveJournal = (j: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    setAllJournals((prev) => {
      if (j.id) {
        const existingIdx = prev.findIndex((item) => item.id === j.id);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            ...j,
            updatedAt: new Date().toISOString(),
          };
          return updated;
        }
      }
      const newJ: JournalEntry = {
        ...j,
        id: j.id || `j-${Date.now()}`,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return [newJ, ...prev];
    });
  };

  const saveJournalEntry = saveJournal;

  // Activities CRUD
  const addActivity = (a: Omit<Activity, 'id' | 'userId'>) => {
    const newA: Activity = {
      ...a,
      id: `act-${Date.now()}`,
      userId,
    };
    setAllActivities((prev) => [...prev, newA]);
  };

  const deleteActivity = (id: string) => {
    setAllActivities((prev) => prev.filter((a) => a.id !== id));
  };

  // Tasks CRUD
  const addTask = (t: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newT: Task = {
      ...t,
      id: `task-${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAllTasks((prev) => [newT, ...prev]);
  };

  const updateTask = (id: string, updated: Partial<Task>) => {
    setAllTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTask = (id: string) => {
    setAllTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setAllTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === 'done' ? 'todo' : 'done',
              completedAt: t.status === 'done' ? undefined : new Date().toISOString(),
            }
          : t
      )
    );
  };

  const toggleTaskStatus = toggleTask;

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.checklist) {
          const updatedChecklist = t.checklist.map((item) =>
            item.id === subtaskId ? { ...item, completed: !item.completed } : item
          );
          const allCompleted = updatedChecklist.every((item) => item.completed);
          return {
            ...t,
            checklist: updatedChecklist,
            status: allCompleted ? 'done' : t.status === 'done' ? 'in_progress' : t.status,
            completedAt: allCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  // Workouts CRUD
  const addWorkout = (w: Omit<Workout, 'id' | 'userId' | 'createdAt'>) => {
    const newW: Workout = {
      ...w,
      id: `w-${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
    };
    setAllWorkouts((prev) => [newW, ...prev]);
  };

  const addWorkoutLog = addWorkout;

  const deleteWorkout = (id: string) => {
    setAllWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  // Habits CRUD
  const addHabit = (h: Omit<Habit, 'id' | 'userId' | 'createdAt'> | string, category = 'Kesehatan') => {
    let newH: Habit;
    if (typeof h === 'string') {
      newH = {
        id: `h-${Date.now()}`,
        userId,
        name: h,
        category: category,
        frequency: 'daily',
        createdAt: new Date().toISOString(),
      };
    } else {
      newH = {
        ...h,
        id: `h-${Date.now()}`,
        userId,
        createdAt: new Date().toISOString(),
      };
    }
    setAllHabits((prev) => [...prev, newH]);
  };

  const deleteHabit = (id: string, _name?: string) => {
    setAllHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHabit = (habitId: string, date: string) => {
    setAllHabitLogs((prev) => {
      const idx = prev.findIndex((log) => log.habitId === habitId && log.date === date);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          completed: !updated[idx].completed,
        };
        return updated;
      } else {
        const newLog: HabitLog = {
          id: `hl-${Date.now()}`,
          userId,
          habitId,
          date,
          completed: true,
        };
        return [...prev, newLog];
      }
    });
  };

  const toggleHabitLog = toggleHabit;

  // Goals CRUD
  const addGoal = (g: Omit<Goal, 'id' | 'userId'>) => {
    const newG: Goal = {
      ...g,
      id: `g-${Date.now()}`,
      userId,
    };
    setAllGoals((prev) => [...prev, newG]);
  };

  const updateGoal = (id: string, updated: Partial<Goal>) => {
    setAllGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updated } : g)));
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setAllGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentValue: progress } : g))
    );
  };

  // Telegram Simulator & Live Bot Sending
  const sendTelegramMessage = async (text: string): Promise<string> => {
    const parsed = parseTelegramMessage(text);
    const today = getTodayString();

    const userMsg: TelegramBotMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
      parsedTransaction: parsed.isTransaction ? parsed : undefined,
    };

    setTelegramMessages((prev) => [...prev, userMsg]);

    let reply = `🤖 Saya mengerti pesan Anda: "${text}"`;
    if (parsed.isTransaction) {
      reply = `✅ Transaksi berhasil dikenali: ${parsed.item} (Rp${parsed.amount.toLocaleString('id-ID')}) kategori ${parsed.category}. Klik tombol di bawah untuk simpan otomatis.`;
    }

    const botMsg: TelegramBotMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'bot',
      text: reply,
      timestamp: new Date().toISOString(),
      parsedTransaction: parsed.isTransaction ? parsed : undefined,
      interactiveButtons: parsed.isTransaction
        ? [
            { label: '✅ Simpan Transaksi', action: 'confirm', payload: parsed, style: 'primary' },
            { label: '❌ Batalkan', action: 'cancel', style: 'danger' },
          ]
        : undefined,
    };

    setTimeout(() => {
      setTelegramMessages((prev) => [...prev, botMsg]);
    }, 300);

    return reply;
  };

  const confirmTelegramTransaction = (messageIdOrParsed: any) => {
    const today = getTodayString();
    let parsed: any = messageIdOrParsed;
    let targetMsgId: string | null = null;

    if (typeof messageIdOrParsed === 'string') {
      targetMsgId = messageIdOrParsed;
      const msg = telegramMessages.find((m) => m.id === messageIdOrParsed);
      if (msg && msg.parsedTransaction) {
        parsed = msg.parsedTransaction;
      }
    } else if (messageIdOrParsed && messageIdOrParsed.item) {
      parsed = messageIdOrParsed;
    }

    if (parsed && parsed.item) {
      addTransaction({
        type: parsed.type || 'expense',
        amount: parsed.amount || 0,
        category: parsed.category || 'Lain-lain',
        description: parsed.item,
        sourceAccountId: userAccounts[0]?.id || 'acc-1',
        paymentMethod: parsed.accountType === 'bank' ? 'Bank BCA' : parsed.accountType === 'ewallet' ? 'GoPay' : 'Cash',
        date: today,
        time: '12:00:00',
        timestamp: new Date().toISOString(),
        tags: ['#telegram'],
      });

      // Update the simulator message bubble
      setTelegramMessages((prev) =>
        prev.map((m) => {
          if (m.id === targetMsgId || (m.parsedTransaction && m.parsedTransaction.item === parsed.item)) {
            return {
              ...m,
              text: `✅ Transaksi "${parsed.item}" (Rp${parsed.amount.toLocaleString('id-ID')}) BERHASIL DISIMPAN ke Keuangan! 💳`,
              interactiveButtons: [],
            };
          }
          return m;
        })
      );
    }
  };

  const cancelTelegramTransaction = (messageId: string) => {
    setTelegramMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          return {
            ...m,
            text: '❌ Pencatatan transaksi dibatalkan.',
            interactiveButtons: [],
          };
        }
        return m;
      })
    );
  };

  const updateTelegramSettings = (_settings: Partial<TelegramIntegration['settings']>) => {
    // Updates settings
  };

  // Subscriptions & Coupons
  const applyCoupon = (code: string): Coupon | null => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.status === 'active');
    if (found) {
      if (found.maxUsage && found.usageCount >= found.maxUsage) {
        return null;
      }
      return found;
    }
    return null;
  };

  const addSubscriptionHistory = (item: Omit<SubscriptionHistoryItem, 'id' | 'createdAt'>) => {
    const newItem: SubscriptionHistoryItem = {
      ...item,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSubscriptions((prev) => [newItem, ...prev]);
  };

  // Admin Controls
  const adminActivateMembership = (targetUserId: string, planId: MembershipPlanId, bonusDays = 30, _isManual = true) => {
    const expDate = bonusDays === 36500 ? '2099-12-31' : new Date(Date.now() + bonusDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    adminUpdateUser(targetUserId, {
      membershipPlanId: planId,
      membershipExpiryDate: expDate,
      status: 'active',
    });
    
    let planLabel = 'Paket 1 Bulan (10k)';
    if (planId === 'lifetime') planLabel = 'Lifetime VIP (100k)';
    else if (planId === 'yearly') planLabel = 'Paket 1 Tahun (50k)';
    else if (planId === 'semi_annual') planLabel = 'Paket 6 Bulan (35k)';
    else if (planId === 'free') planLabel = 'Free Trial 7 Hari';

    addSubscriptionHistory({
      userId: targetUserId,
      planId,
      planName: planLabel,
      startDate: getTodayString(),
      expiryDate: expDate,
      status: 'active',
      activatedBy: currentUser?.name || 'Admin',
    });
    addAuditLog('Admin Activated Membership', `Plan ${planLabel} (${bonusDays}d) activated for user ${targetUserId}`);
  };

  const adminCreateCoupon = (codeOrData: any, discount = 30, bonusDays = 7, maxUsage = 100) => {
    let newCoupon: Coupon;
    if (typeof codeOrData === 'string') {
      newCoupon = {
        id: `cp-${Date.now()}`,
        code: codeOrData.toUpperCase(),
        discountPercentage: discount,
        bonusDays: bonusDays,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        maxUsage: maxUsage,
        usageCount: 0,
        status: 'active',
      };
    } else {
      newCoupon = {
        ...codeOrData,
        id: `cp-${Date.now()}`,
        usageCount: 0,
      };
    }
    setCoupons((prev) => [newCoupon, ...prev]);
    addAuditLog('Admin Created Coupon', `Coupon code ${newCoupon.code} created`);
  };

  // Audit Log
  const addAuditLog = (action: string, details?: string) => {
    const newLog: SystemAuditLog = {
      id: `log-${Date.now()}`,
      adminId: currentUser?.id || 'admin',
      adminName: currentUser?.name || 'Admin System',
      action,
      metadata: details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Filtered user slices
  const userRecurringSubs = useMemo(() => allRecurringSubs.filter((s) => s.userId === userId || !s.userId), [allRecurringSubs, userId]);
  const userDebts = useMemo(() => allDebts.filter((d) => d.userId === userId || !d.userId), [allDebts, userId]);
  const userRewards = useMemo(() => allRewards.filter((r) => r.userId === userId || !r.userId), [allRewards, userId]);
  const userPomodoroLogs = useMemo(() => allPomodoroLogs.filter((p) => p.userId === userId || !p.userId), [allPomodoroLogs, userId]);

  // Recurring Subscriptions Handlers
  const addRecurringSub = (sub: Omit<import('../types').RecurringSubscription, 'id' | 'userId' | 'createdAt'>) => {
    const newSub: import('../types').RecurringSubscription = {
      ...sub,
      id: `sub-${Date.now()}`,
      userId,
      createdAt: getTodayString(),
    };
    setAllRecurringSubs((prev) => [newSub, ...prev]);
  };

  const updateRecurringSub = (id: string, updated: Partial<import('../types').RecurringSubscription>) => {
    setAllRecurringSubs((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteRecurringSub = (id: string) => {
    setAllRecurringSubs((prev) => prev.filter((s) => s.id !== id));
  };

  // Debts & Receivables Handlers
  const addDebt = (debt: Omit<import('../types').DebtItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newDebt: import('../types').DebtItem = {
      ...debt,
      id: `debt-${Date.now()}`,
      userId,
      createdAt: getTodayString(),
      updatedAt: new Date().toISOString(),
    };
    setAllDebts((prev) => [newDebt, ...prev]);
  };

  const updateDebt = (id: string, updated: Partial<import('../types').DebtItem>) => {
    setAllDebts((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated, updatedAt: new Date().toISOString() } : d)));
  };

  const deleteDebt = (id: string) => {
    setAllDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const recordDebtPayment = (id: string, paymentAmount: number) => {
    setAllDebts((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const newPaid = Math.min(d.amount, (d.paidAmount || 0) + paymentAmount);
          const newStatus = newPaid >= d.amount ? 'settled' : 'partial';
          return { ...d, paidAmount: newPaid, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return d;
      })
    );
  };

  // Rewards Gamification Handlers
  const addReward = (reward: Omit<import('../types').PersonalReward, 'id' | 'userId' | 'createdAt'>) => {
    const newReward: import('../types').PersonalReward = {
      ...reward,
      id: `rew-${Date.now()}`,
      userId,
      isClaimed: false,
      createdAt: getTodayString(),
    };
    setAllRewards((prev) => [newReward, ...prev]);
  };

  const claimReward = (id: string): boolean => {
    let claimed = false;
    setAllRewards((prev) =>
      prev.map((r) => {
        if (r.id === id && !r.isClaimed) {
          claimed = true;
          return { ...r, isClaimed: true, claimedAt: new Date().toISOString() };
        }
        return r;
      })
    );
    return claimed;
  };

  const deleteReward = (id: string) => {
    setAllRewards((prev) => prev.filter((r) => r.id !== id));
  };

  // Pomodoro Focus Handlers
  const logPomodoroSession = (session: Omit<import('../types').PomodoroLog, 'id' | 'userId' | 'completedAt'>) => {
    const newLog: import('../types').PomodoroLog = {
      ...session,
      id: `pom-${Date.now()}`,
      userId,
      completedAt: new Date().toISOString(),
    };
    setAllPomodoroLogs((prev) => [newLog, ...prev]);
  };

  // AI Settings
  const updateAISettings = (settings: Partial<import('../types').AISettings>) => {
    setAiSettings((prev) => {
      const updated = { ...prev, ...settings };
      storage.setAISettings(updated);
      return updated;
    });
  };

  // Cloud & Telegram Server Bidirectional Sync
  const syncWithServer = async (): Promise<boolean> => {
    setIsSyncing(true);
    try {
      const payload = {
        userId,
        transactions: allTransactions,
        journals: allJournals,
        tasks: allTasks,
        workouts: allWorkouts,
      };

      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.merged) {
          if (Array.isArray(result.merged.transactions)) setAllTransactions(result.merged.transactions);
          if (Array.isArray(result.merged.journals)) setAllJournals(result.merged.journals);
          if (Array.isArray(result.merged.tasks)) setAllTasks(result.merged.tasks);
          if (Array.isArray(result.merged.workouts)) setAllWorkouts(result.merged.workouts);
        }
        setLastSyncedAt(new Date().toLocaleTimeString('id-ID'));
        setIsSyncing(false);
        return true;
      }
    } catch (e) {
      console.warn('Silent sync fallback to local storage:', e);
    }
    setIsSyncing(false);
    return false;
  };

  // Fast Export / Backup
  const exportAllData = (): string => {
    const data = {
      accounts: userAccounts,
      transactions: userTransactions,
      budgets: userBudgets,
      journals: userJournals,
      activities: userActivities,
      tasks: userTasks,
      workouts: userWorkouts,
      habits: userHabits,
      goals: userGoals,
      recurringSubs: userRecurringSubs,
      debts: userDebts,
      rewards: userRewards,
      aiSettings,
    };
    return JSON.stringify(data, null, 2);
  };

  const exportBackup = () => storage.exportFullBackupJSON();
  const restoreBackup = (jsonString: string) => storage.restoreBackupJSON(jsonString);

  return (
    <DataContext.Provider
      value={{
        accounts: userAccounts,
        addAccount,
        updateAccount,
        deleteAccount,

        transactions: userTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,

        budgets: userBudgets,
        addBudget,
        updateBudget,
        deleteBudget,
        setBudgetLimit,

        journals: userJournals,
        saveJournal,
        saveJournalEntry,

        activities: userActivities,
        addActivity,
        deleteActivity,

        tasks: userTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        toggleTaskStatus,
        toggleSubtask,

        workouts: userWorkouts,
        addWorkout,
        addWorkoutLog,
        deleteWorkout,

        habits: userHabits,
        habitLogs: userHabitLogs,
        addHabit,
        deleteHabit,
        toggleHabit,
        toggleHabitLog,

        goals: userGoals,
        addGoal,
        updateGoal,
        updateGoalProgress,

        achievements: allAchievements,

        telegram: userTelegram,
        telegramMessages,
        sendTelegramMessage,
        updateTelegramSettings,
        confirmTelegramTransaction,
        cancelTelegramTransaction,

        subscriptionHistory: subscriptions,
        coupons,
        applyCoupon,
        addSubscriptionHistory,

        adminActivateMembership,
        adminCreateCoupon,

        auditLogs,
        addAuditLog,

        recurringSubs: userRecurringSubs,
        addRecurringSub,
        updateRecurringSub,
        deleteRecurringSub,

        debts: userDebts,
        addDebt,
        updateDebt,
        deleteDebt,
        recordDebtPayment,

        rewards: userRewards,
        addReward,
        claimReward,
        deleteReward,

        pomodoroLogs: userPomodoroLogs,
        logPomodoroSession,

        aiSettings,
        updateAISettings,

        syncWithServer,
        isSyncing,
        lastSyncedAt,

        exportAllData,
        exportBackup,
        restoreBackup,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
