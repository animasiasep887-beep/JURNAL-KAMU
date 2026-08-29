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

import { TelegramSimulator } from './components/telegram/TelegramSimulator';
import { TelegramSettings } from './components/telegram/TelegramSettings';

import { DailyJournalEditor } from './components/journal/DailyJournalEditor';
import { ActivityLogger } from './components/journal/ActivityLogger';

import { TaskManager } from './components/tasks/TaskManager';
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

const MainLayout: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { transactions, journals, workouts, tasks } = useData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdminUser, setSelectedAdminUser] = useState<User | null>(null);

  // Global Ctrl+K / Cmd+K listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
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

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                onClick={() => setShowCommandPalette(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <span>Spotlight</span>
                <span className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-indigo-400">Ctrl+K</span>
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
              {/* Gamification Level Card */}
              <UserLevelCard />
              
              <OverviewCards />
              <DailyScoreCard />
              
              {/* Weekly AI Life Review */}
              <WeeklyLifeReview />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TodayTimeline />
                </div>
                <div className="space-y-6">
                  <FinancialSummaryCard onNavigateToFinance={() => setActiveTab('finance')} />
                  <WorkoutQuickSummary onNavigateToGym={() => setActiveTab('gym')} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCE */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <AccountManager />
              <FinancialRunwaySimulator />
              <FinancialHealthScore />
              <DailyExpenseView />
              <TransactionList />
              <BudgetManager />
              <MoneyFlowChart />
              <NetWorthView />
            </div>
          )}

          {/* TAB 3: TELEGRAM BOT SIMULATOR */}
          {activeTab === 'telegram' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TelegramSimulator />
              </div>
              <div>
                <TelegramSettings />
              </div>
            </div>
          )}

          {/* TAB 4: DAILY JOURNAL */}
          {activeTab === 'journal' && (
            <div className="space-y-6">
              <DailyJournalEditor />
              <ActivityLogger />
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
              <TaskManager />
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
              <WorkoutLogger />
              <GymProgressCharts />
              <ExerciseDatabase />
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
              <UserProfileSettings />
              <MembershipPage />
              <DataExportBackup />
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
