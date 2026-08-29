import React, { useState } from 'react';
import {
  LayoutDashboard,
  Wallet,
  BookOpen,
  Dumbbell,
  Menu,
  Plus,
  X,
  CheckSquare,
  Repeat,
  Target,
  Send,
  Calendar,
  BarChart3,
  FileText,
  Compass,
  Crown,
  Settings,
  ShieldAlert,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickAction: () => void;
  journalStreak: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickAction,
  journalStreak,
}) => {
  const { isAdmin } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'journal', label: 'Jurnal', icon: BookOpen, badge: journalStreak > 0 ? `${journalStreak}🔥` : undefined },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
  ];

  const allFeatures = [
    {
      category: 'Keuangan & Aset',
      items: [
        { id: 'finance', label: 'Manajemen Keuangan', icon: Wallet, desc: 'Rekening, Cashflow & Budget', color: 'from-emerald-600 to-teal-600' },
      ],
    },
    {
      category: 'Mental, Refleksi & Waktu',
      items: [
        { id: 'journal', label: 'Daily Journal & Mood', icon: BookOpen, desc: 'Refleksi, Curhat & Solusi AI', color: 'from-purple-600 to-indigo-600' },
        { id: 'activities', label: 'Time Tracking', icon: Clock, desc: 'Catat jam produktif harian', color: 'from-blue-600 to-cyan-600' },
        { id: 'analytics', label: 'Life Analytics', icon: BarChart3, desc: 'Korelasi data & mental score', color: 'from-pink-600 to-rose-600' },
        { id: 'reports', label: 'AI Weekly & Monthly Reports', icon: FileText, desc: 'Laporan evaluasi otomatis AI', color: 'from-violet-600 to-purple-600' },
      ],
    },
    {
      category: 'Kebugaran & Kebiasaan',
      items: [
        { id: 'gym', label: 'Gym & Fitness Journal', icon: Dumbbell, desc: 'Catat beban, repetisi & set', color: 'from-rose-600 to-orange-600' },
        { id: 'habits', label: 'Habit Tracker Matrix', icon: Repeat, desc: 'Disiplin 7-day habit matrix', color: 'from-amber-600 to-yellow-600' },
      ],
    },
    {
      category: 'Produktivitas & Masa Depan',
      items: [
        { id: 'tasks', label: 'Tasks & Planner', icon: CheckSquare, desc: 'To-do list & checklist harian', color: 'from-indigo-600 to-blue-600' },
        { id: 'calendar', label: 'Integrated Calendar', icon: Calendar, desc: 'Kalender multi-aktivitas', color: 'from-teal-600 to-emerald-600' },
        { id: 'goals', label: 'Life Goals & Targets', icon: Target, desc: 'Target tabungan & hidup', color: 'from-cyan-600 to-blue-600' },
        { id: 'mylife', label: 'MY LIFE Master Matrix', icon: Compass, desc: 'Pusat komando hidup menyeluruh', color: 'from-amber-500 to-rose-500', highlight: true },
      ],
    },
    {
      category: 'Koneksi & Pengaturan',
      items: [
        { id: 'telegram', label: 'Telegram Bot Server', icon: Send, desc: 'Live Bot Sync & AI Partner', color: 'from-sky-500 to-blue-600', badge: 'Live' },
        { id: 'membership', label: 'Membership & Tier', icon: Crown, desc: 'Status paket & fitur Pro', color: 'from-amber-600 to-yellow-600' },
        { id: 'settings', label: 'Pengaturan & Backup Data', icon: Settings, desc: 'Export JSON, PIN & Theme', color: 'from-slate-600 to-slate-700' },
      ],
    },
  ];

  if (isAdmin) {
    allFeatures.push({
      category: 'Admin Control Center',
      items: [
        { id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert, desc: 'Kelola semua user & SaaS', color: 'from-red-600 to-rose-700' },
      ],
    });
  }

  const handleSelectFeature = (id: string) => {
    setActiveTab(id);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* 📱 NATIVE GLASSMORPHISM BOTTOM NAVIGATION BAR (MOBILE ONLY) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-1.5 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-around relative">
          {/* Tab 1: Home */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'dashboard'
                ? 'text-indigo-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'dashboard' ? 'bg-indigo-500/20 shadow-sm shadow-indigo-500/30' : ''}`}>
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">Home</span>
          </button>

          {/* Tab 2: Finance */}
          <button
            onClick={() => setActiveTab('finance')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'finance'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'finance' ? 'bg-emerald-500/20 shadow-sm shadow-emerald-500/30' : ''}`}>
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">Finance</span>
          </button>

          {/* CENTER FLOATING ACTION BUTTON (+) */}
          <div className="relative -top-5 flex flex-col items-center">
            <button
              onClick={onOpenQuickAction}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 active:scale-95 transition-all border-2 border-slate-950 ring-2 ring-indigo-500/30"
              title="Catat Cepat Cepat"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
            <span className="text-[9px] font-bold text-indigo-300 mt-1 tracking-tight">Catat</span>
          </div>

          {/* Tab 3: Journal */}
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
              activeTab === 'journal'
                ? 'text-purple-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl relative ${activeTab === 'journal' ? 'bg-purple-500/20 shadow-sm shadow-purple-500/30' : ''}`}>
              <BookOpen className="w-5 h-5" />
              {journalStreak > 0 && (
                <span className="absolute -top-1 -right-2 text-[9px] font-bold px-1 rounded-full bg-amber-500 text-slate-950 font-mono animate-pulse">
                  {journalStreak}🔥
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Jurnal</span>
          </button>

          {/* Tab 4: More / All Menu */}
          <button
            onClick={() => setShowMoreMenu(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
              showMoreMenu || !['dashboard', 'finance', 'journal', 'gym'].includes(activeTab)
                ? 'text-amber-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl ${showMoreMenu || !['dashboard', 'finance', 'journal', 'gym'].includes(activeTab) ? 'bg-amber-500/20 shadow-sm shadow-amber-500/30' : ''}`}>
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">Semua</span>
          </button>
        </div>
      </div>

      {/* 📱 ULTRA-PREMIUM BOTTOM SHEET "SEMUA MENU & FITUR" */}
      {showMoreMenu && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setShowMoreMenu(false)}
          />

          <div className="relative z-10 w-full max-h-[85vh] bg-slate-900 border-t border-indigo-500/30 rounded-t-[32px] p-5 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
            {/* Grabber handle */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl text-white shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Semua Fitur Personal Life OS</h3>
                  <p className="text-[11px] text-slate-400">Pilih modul yang ingin Anda buka</p>
                </div>
              </div>

              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Features Category Grid */}
            <div className="flex-1 overflow-y-auto py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
              {allFeatures.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    {cat.category}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.items.map((item) => {
                      const Icon = item.icon;
                      const isItemActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectFeature(item.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                            isItemActive
                              ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-indigo-500 shadow-md scale-[1.01]'
                              : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-sm`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold ${isItemActive ? 'text-white' : 'text-slate-200'}`}>
                                  {item.label}
                                </span>
                                {(item as any).badge && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                                    {(item as any).badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick close button */}
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-2xl transition-colors"
              >
                Tutup Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
