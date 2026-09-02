import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { Flame, Shield } from 'lucide-react';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MobileQuickCategoryBar } from './components/layout/MobileQuickCategoryBar';
import { QuickActionModal } from './components/layout/QuickActionModal';
import { NotificationCenter } from './components/layout/NotificationCenter';

import { OverviewCards } from './components/dashboard/OverviewCards';
import { DailyScoreCard } from './components/dashboard/DailyScoreCard';
import { TodayTimeline } from './components/dashboard/TodayTimeline';
import { FinancialSummaryCard } from './components/dashboard/FinancialSummaryCard';
import { WorkoutQuickSummary } from './components/dashboard/WorkoutQuickSummary';

import { AccountManager } from './components/finance/AccountManager';
import { DailyExpenseView } from './components/finance/DailyExpenseView';
import { TransactionList } from './components/finance/TransactionList';
import { BudgetManager } from './components/finance/BudgetManager';
import { MoneyFlowChart } from './components/finance/MoneyFlowChart';
import { NetWorthView } from './components/finance/NetWorthView';
import { FinancialHealthScore } from './components/finance/FinancialHealthScore';
import { FinancialRunwaySimulator } from './components/finance/FinancialRunwaySimulator';
import { SubscriptionDebtTracker } from './components/finance/SubscriptionDebtTracker';

import { TelegramSimulator } from './components/telegram/TelegramSimulator';
import { TelegramSettings } from './components/telegram/TelegramSettings';

import { DailyJournalEditor } from './components/journal/DailyJournalEditor';
import { ActivityLogger } from './components/journal/ActivityLogger';

import { TaskManager } from './components/tasks/TaskManager';
import { PomodoroTimer } from './components/tasks/PomodoroTimer';
import { IntegratedCalendar } from './components/calendar/IntegratedCalendar';

import { ExerciseDatabase } from './components/gym/ExerciseDatabase';
import { WorkoutLogger } from './components/gym/WorkoutLogger';
import { GymProgressCharts } from './components/gym/GymProgressCharts';

import { HabitTrackerGrid } from './components/habits/HabitTrackerGrid';
import { CrossDataCorrelation } from './components/analytics/CrossDataCorrelation';
import { ReportGenerator } from './components/reports/ReportGenerator';
import { GoalManager } from './components/goals/GoalManager';
import { MyLifeMasterDashboard } from './components/goals/MyLifeMasterDashboard';

import { UserProfileSettings } from './components/settings/UserProfileSettings';
import { MembershipPage } from './components/settings/MembershipPage';
import { DataExportBackup } from './components/settings/DataExportBackup';
import { PrivacyModeLock } from './components/settings/PrivacyModeLock';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUserList } from './components/admin/AdminUserList';
import { AdminUserDetailModal } from './components/admin/AdminUserDetailModal';
import { AdminMembershipControl } from './components/admin/AdminMembershipControl';

import { AuthPage } from './pages/AuthPage';
import { UserOnboarding } from './pages/UserOnboarding';
import { User } from './types';
import { formatIDR, calculateJournalStreak, isUserMembershipExpired } from './utils/formatters';
import { TrialExpiredGateModal } from './components/membership/TrialExpiredGateModal';
import { TrialStatusBanner } from './components/membership/TrialStatusBanner';
import { AccountBannedGateModal } from './components/membership/AccountBannedGateModal';

import { CommandPalette } from './components/layout/CommandPalette';
import { FloatingBotWidget } from './components/telegram/FloatingBotWidget';
import { UserLevelCard } from './components/gamification/UserLevelCard';
import { WeeklyLifeReview } from './components/gamification/WeeklyLifeReview';
import { AudioDailyBriefingButton } from './components/dashboard/AudioDailyBriefingButton';
import { SpendingAnomalyAlert } from './components/finance/SpendingAnomalyAlert';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';

const MainLayout: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { transactions, journals, workouts, tasks } = useData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdminUser, setSelectedAdminUser] = useState<User | null>(null);

  const [showShortcuts, setShowShortcuts] = useState(false);

  // Sub-tabs for clean, non-overwhelming navigation
  const [dashboardSubTab, setDashboardSubTab] = useState<'daily' | 'gamification' | 'timeline'>('daily');
  const [financeSubTab, setFinanceSubTab] = useState<'transactions' | 'subs' | 'budgets' | 'simulations'>('transactions');
  const [telegramSubTab, setTelegramSubTab] = useState<'connect' | 'simulator'>('connect');
  const [gymSubTab, setGymSubTab] = useState<'logger' | 'charts' | 'database'>('logger');
  const [journalSubTab, setJournalSubTab] = useState<'editor' | 'activities'>('editor');
  const [tasksSubTab, setTasksSubTab] = useState<'list' | 'pomodoro'>('list');
  const [settingsSubTab, setSettingsSubTab] = useState<'profile' | 'membership' | 'backup'>('profile');

  // Auto scroll to top on tab switch so users immediately see the top header & main action
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, telegramSubTab, financeSubTab, dashboardSubTab, gymSubTab, journalSubTab, tasksSubTab, settingsSubTab]);

  // Global Keyboard Shortcuts (Ctrl+K, ?, J, T, G, P, Esc)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTagName = (document.activeElement?.tagName || '').toLowerCase();
      const isEditing = activeTagName === 'input' || activeTagName === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
        return;
      }

      if (e.key === '?' && !isEditing) {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
        return;
      }

      if (e.key === 'Escape') {
        setShowShortcuts(false);
        setShowCommandPalette(false);
        setShowQuickAction(false);
        return;
      }

      if (!isEditing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key.toLowerCase() === 'j') {
          e.preventDefault();
          setActiveTab('journal');
        } else if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          setShowQuickAction(true);
        } else if (e.key.toLowerCase() === 'g') {
          e.preventDefault();
          setActiveTab('gym');
        } else if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          setActiveTab('tasks');
          setTasksSubTab('pomodoro');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenQuickAction={() => setShowQuickAction(true)}
          onOpenNotifications={() => setShowNotifications(true)}
          onSearchSubmit={(q) => {
            setSearchQuery(q);
            setShowCommandPalette(true);
          }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 pb-28 lg:pb-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-4 md:space-y-6">
          {/* Mobile Quick Category Bar (Swipeable on Mobile) */}
          <MobileQuickCategoryBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            journalStreak={calculateJournalStreak(journals)}
          />

          {/* ⏳ Free Trial 7 Hari Status Banner & Peringatan */}
          <TrialStatusBanner onOpenMembership={() => setActiveTab('membership')} />

          {/* Hero Greeting Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                onClick={() => setActiveTab('settings')}
                title="Klik untuk edit profil & foto"
                className="relative cursor-pointer group"
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full rounded-[14px] object-cover bg-slate-900"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-white text-lg">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {new Date().getHours() < 11 ? 'Selamat Pagi' : new Date().getHours() < 15 ? 'Selamat Siang' : new Date().getHours() < 18 ? 'Selamat Sore' : 'Selamat Malam'}, {currentUser.name}
                  </h2>
                  <span className="text-lg">✨</span>
                </div>

                {currentUser.bio ? (
                  <p className="text-xs text-indigo-300 font-medium italic mt-0.5 max-w-xl line-clamp-1">
                    "{currentUser.bio}"
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                    <span>Hari ini: <strong className="text-slate-200">{transactions.length} transaksi</strong></span>
                    <span>•</span>
                    <span><strong className="text-slate-200">{tasks.filter(t => t.status === 'done').length}/{tasks.length}</strong> to-do selesai</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">Sistem sinkron aktif</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
              <AudioDailyBriefingButton />
              
              <button
                onClick={() => setShowCommandPalette(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <span>Spotlight</span>
                <span className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-indigo-400">Ctrl+K</span>
              </button>

              <button
                onClick={() => setShowShortcuts(true)}
                title="Buka panduan shortcut keyboard"
                className="hidden sm:flex items-center justify-center w-8 h-8 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                ?
              </button>

              <div className="px-3.5 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 rounded-2xl flex items-center gap-2 shadow-sm font-bold text-xs">
                <Flame className="w-4 h-4 text-orange-400 fill-current animate-pulse" />
                <span>{calculateJournalStreak(journals)} Hari Streak</span>
              </div>
            </div>
          </div>

          {/* TAB 1: DASHBOARD UTAMA */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Beginner-Friendly Quick Action Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('finance');
                    setFinanceSubTab('transactions');
                  }}
                  className="p-4 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl text-left transition-all group hover:scale-[1.02] shadow-lg shadow-emerald-950/20"
                >
                  <span className="text-xl sm:text-2xl block mb-1.5 group-hover:scale-110 transition-transform">💰</span>
                  <div className="font-extrabold text-xs sm:text-sm text-white">Catat Uang</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">Pemasukan, pengeluaran & struk</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('journal');
                    setJournalSubTab('editor');
                  }}
                  className="p-4 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 rounded-2xl text-left transition-all group hover:scale-[1.02] shadow-lg shadow-indigo-950/20"
                >
                  <span className="text-xl sm:text-2xl block mb-1.5 group-hover:scale-110 transition-transform">✍️</span>
                  <div className="font-extrabold text-xs sm:text-sm text-white">Tulis Jurnal</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">Refleksi harian & dikte suara</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('tasks');
                    setTasksSubTab('list');
                  }}
                  className="p-4 bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 hover:border-purple-500/60 rounded-2xl text-left transition-all group hover:scale-[1.02] shadow-lg shadow-purple-950/20"
                >
                  <span className="text-xl sm:text-2xl block mb-1.5 group-hover:scale-110 transition-transform">🎯</span>
                  <div className="font-extrabold text-xs sm:text-sm text-white">Target To-Do</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">Tugas & timer fokus kerja</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('gym');
                    setGymSubTab('logger');
                  }}
                  className="p-4 bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 hover:border-rose-500/60 rounded-2xl text-left transition-all group hover:scale-[1.02] shadow-lg shadow-rose-950/20"
                >
                  <span className="text-xl sm:text-2xl block mb-1.5 group-hover:scale-110 transition-transform">🏋️</span>
                  <div className="font-extrabold text-xs sm:text-sm text-white">Latihan Gym</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">Catat set & rest timer</p>
                </button>
              </div>

              {/* Dashboard Sub-Tabs */}
              <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setDashboardSubTab('daily')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    dashboardSubTab === 'daily'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ⚡ Skor & Ringkasan Hari Ini
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardSubTab('gamification')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    dashboardSubTab === 'gamification'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  🎮 Level XP & Refleksi AI
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardSubTab('timeline')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    dashboardSubTab === 'timeline'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ⏱️ Timeline Waktu
                </button>
              </div>

              {dashboardSubTab === 'daily' && (
                <div className="space-y-6 animate-fade-in">
                  <DailyScoreCard />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FinancialSummaryCard onNavigateToFinance={() => {
                      setActiveTab('finance');
                      setFinanceSubTab('transactions');
                    }} />
                    <WorkoutQuickSummary onNavigateToGym={() => {
                      setActiveTab('gym');
                      setGymSubTab('logger');
                    }} />
                  </div>
                </div>
              )}

              {dashboardSubTab === 'gamification' && (
                <div className="space-y-6 animate-fade-in">
                  <UserLevelCard />
                  <OverviewCards />
                  <WeeklyLifeReview />
                </div>
              )}

              {dashboardSubTab === 'timeline' && (
                <div className="space-y-6 animate-fade-in">
                  <TodayTimeline />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FINANCE */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <SpendingAnomalyAlert />

              {/* Finance Sub-Tabs Navigation Bar */}
              <div className="flex flex-wrap bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setFinanceSubTab('transactions')}
                  className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    financeSubTab === 'transactions'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  💳 Transaksi & Dompet
                </button>
                <button
                  type="button"
                  onClick={() => setFinanceSubTab('subs')}
                  className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    financeSubTab === 'subs'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  🔄 Langganan & Hutang
                </button>
                <button
                  type="button"
                  onClick={() => setFinanceSubTab('budgets')}
                  className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    financeSubTab === 'budgets'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  🎯 Anggaran & Skor Sehat
                </button>
                <button
                  type="button"
                  onClick={() => setFinanceSubTab('simulations')}
                  className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    financeSubTab === 'simulations'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  📈 Simulasi & Net Worth
                </button>
              </div>

              {financeSubTab === 'transactions' && (
                <div className="space-y-6 animate-fade-in">
                  <AccountManager />
                  <DailyExpenseView />
                  <TransactionList />
                </div>
              )}

              {financeSubTab === 'subs' && (
                <div className="space-y-6 animate-fade-in">
                  <SubscriptionDebtTracker />
                </div>
              )}

              {financeSubTab === 'budgets' && (
                <div className="space-y-6 animate-fade-in">
                  <FinancialHealthScore />
                  <BudgetManager />
                </div>
              )}

              {financeSubTab === 'simulations' && (
                <div className="space-y-6 animate-fade-in">
                  <FinancialRunwaySimulator />
                  <MoneyFlowChart />
                  <NetWorthView />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TELEGRAM BOT SIMULATOR */}
          {activeTab === 'telegram' && (
            <div className="space-y-6">
              <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setTelegramSubTab('connect')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    telegramSubTab === 'connect'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  📱 Hubungkan Bot & Panduan Satset
                </button>
                <button
                  type="button"
                  onClick={() => setTelegramSubTab('simulator')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    telegramSubTab === 'simulator'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  💬 Live Bot Chat Simulator
                </button>
              </div>

              {telegramSubTab === 'connect' && (
                <div className="space-y-6 animate-fade-in">
                  <TelegramSettings />
                </div>
              )}

              {telegramSubTab === 'simulator' && (
                <div className="space-y-6 animate-fade-in">
                  <TelegramSimulator />
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DAILY JOURNAL */}
          {activeTab === 'journal' && (
            <div className="space-y-6">
              <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setJournalSubTab('editor')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    journalSubTab === 'editor'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ✍️ Tulis Jurnal Harian & Suara
                </button>
                <button
                  type="button"
                  onClick={() => setJournalSubTab('activities')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    journalSubTab === 'activities'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ⏱️ Log Aktivitas Waktu
                </button>
              </div>

              {journalSubTab === 'editor' && (
                <div className="space-y-6 animate-fade-in">
                  <DailyJournalEditor />
                </div>
              )}

              {journalSubTab === 'activities' && (
                <div className="space-y-6 animate-fade-in">
                  <ActivityLogger />
                </div>
              )}
            </div>
          )}

          {/* TAB 5: TIME TRACKING */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <ActivityLogger />
              <TodayTimeline />
            </div>
          )}

          {/* TAB 6: TASKS & PLANNER */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setTasksSubTab('list')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    tasksSubTab === 'list'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  📋 Daftar Tugas & Prioritas
                </button>
                <button
                  type="button"
                  onClick={() => setTasksSubTab('pomodoro')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    tasksSubTab === 'pomodoro'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ⏱️ Focus Timer (Pomodoro & Soundscape)
                </button>
              </div>

              {tasksSubTab === 'list' && (
                <div className="space-y-6 animate-fade-in">
                  <TaskManager />
                </div>
              )}

              {tasksSubTab === 'pomodoro' && (
                <div className="space-y-6 animate-fade-in">
                  <PomodoroTimer />
                </div>
              )}
            </div>
          )}

          {/* TAB 7: INTEGRATED CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <IntegratedCalendar />
            </div>
          )}

          {/* TAB 8: GYM JOURNAL */}
          {activeTab === 'gym' && (
            <div className="space-y-6">
              <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setGymSubTab('logger')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    gymSubTab === 'logger'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  📝 Catat Latihan & Timer
                </button>
                <button
                  type="button"
                  onClick={() => setGymSubTab('charts')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    gymSubTab === 'charts'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  📈 Grafik Progres Beban
                </button>
                <button
                  type="button"
                  onClick={() => setGymSubTab('database')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    gymSubTab === 'database'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  📚 Panduan Gerakan
                </button>
              </div>

              {gymSubTab === 'logger' && (
                <div className="space-y-6 animate-fade-in">
                  <WorkoutLogger />
                </div>
              )}

              {gymSubTab === 'charts' && (
                <div className="space-y-6 animate-fade-in">
                  <GymProgressCharts />
                </div>
              )}

              {gymSubTab === 'database' && (
                <div className="space-y-6 animate-fade-in">
                  <ExerciseDatabase />
                </div>
              )}
            </div>
          )}

          {/* TAB 9: HABIT TRACKER */}
          {activeTab === 'habits' && (
            <div className="space-y-6">
              <HabitTrackerGrid />
            </div>
          )}

          {/* TAB 10: LIFE ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <CrossDataCorrelation />
            </div>
          )}

          {/* TAB 11: AI REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <ReportGenerator />
            </div>
          )}

          {/* TAB 12: GOALS */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              <GoalManager />
            </div>
          )}

          {/* TAB 13: MY LIFE */}
          {activeTab === 'mylife' && (
            <div className="space-y-6">
              <MyLifeMasterDashboard />
            </div>
          )}

          {/* TAB 14: MEMBERSHIP */}
          {activeTab === 'membership' && (
            <div className="space-y-6">
              <MembershipPage />
            </div>
          )}

          {/* TAB 15: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setSettingsSubTab('profile')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    settingsSubTab === 'profile'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  👤 Profil & AI Gemini
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsSubTab('membership')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    settingsSubTab === 'membership'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  👑 Status Paket
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsSubTab('backup')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                    settingsSubTab === 'backup'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  💾 Backup & Ekspor
                </button>
              </div>

              {settingsSubTab === 'profile' && (
                <div className="space-y-6 animate-fade-in">
                  <UserProfileSettings />
                </div>
              )}

              {settingsSubTab === 'membership' && (
                <div className="space-y-6 animate-fade-in">
                  <MembershipPage />
                </div>
              )}

              {settingsSubTab === 'backup' && (
                <div className="space-y-6 animate-fade-in">
                  <DataExportBackup />
                </div>
              )}
            </div>
          )}

          {/* TAB 16: ADMIN PANEL (PROTECTED) */}
          {activeTab === 'admin' && (
            isAdmin ? (
              <div className="space-y-6">
                <AdminDashboard />
                <AdminUserList onSelectUser={(u) => setSelectedAdminUser(u)} />
                <AdminMembershipControl />
              </div>
            ) : (
              <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-8 text-center space-y-4 max-w-md mx-auto my-12">
                <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Akses Ditolak (Restricted Access)</h3>
                <p className="text-xs text-slate-400">
                  Halaman ini hanya dapat diakses oleh Administrator Resmi. Pengguna biasa tidak memiliki izin untuk membuka panel ini.
                </p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            )
          )}

          {/* TAB 17: GLOBAL SEARCH */}
          {activeTab === 'search' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-100 text-lg">Hasil Pencarian untuk "{searchQuery}"</h3>
              <div className="space-y-2">
                {transactions
                  .filter((t) => t.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((t) => (
                    <div key={t.id} className="p-3 bg-slate-800 rounded-xl text-xs flex justify-between">
                      <span>{t.description} ({t.category})</span>
                      <span className="font-mono font-bold">{formatIDR(t.amount)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 📱 Mobile Native Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAction={() => setShowQuickAction(true)}
        journalStreak={calculateJournalStreak(journals)}
      />

      <QuickActionModal isOpen={showQuickAction} onClose={() => setShowQuickAction(false)} />
      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <AdminUserDetailModal user={selectedAdminUser} onClose={() => setSelectedAdminUser(null)} />
      <PrivacyModeLock />

      {/* 🚀 Spotlight Search & Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setShowCommandPalette(false);
        }}
        onOpenQuickAction={() => {
          setShowCommandPalette(false);
          setShowQuickAction(true);
        }}
        onOpenZenMode={() => {
          setActiveTab('journal');
          setShowCommandPalette(false);
        }}
      />

      {/* 🤖 Mini Floating Telegram Bot Status & Live Console */}
      <FloatingBotWidget />

      {/* 🔒 Trial / Membership Expired Gate Screen */}
      {isUserMembershipExpired(currentUser) && <TrialExpiredGateModal />}

      {/* 🚫 Banned / Suspended Account Gate Screen */}
      <AccountBannedGateModal />

      {/* ⌨️ Keyboard Shortcuts Cheat-Sheet Modal */}
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthPage />;
  }

  if (!currentUser.onboardingCompleted) {
    return <UserOnboarding />;
  }

  return (
    <DataProvider>
      <NotificationProvider>
        <MainLayout />
      </NotificationProvider>
    </DataProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
