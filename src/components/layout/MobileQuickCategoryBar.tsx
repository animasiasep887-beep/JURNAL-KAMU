import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  BookOpen,
  Dumbbell,
  CheckSquare,
  Repeat,
  Calendar,
  Compass,
  Send,
  Sparkles,
} from 'lucide-react';

interface MobileQuickCategoryBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  journalStreak: number;
  onOpenInstallModal?: () => void;
}

export const MobileQuickCategoryBar: React.FC<MobileQuickCategoryBarProps> = ({
  activeTab,
  setActiveTab,
  journalStreak,
  onOpenInstallModal,
}) => {
  const quickPills = [
    { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard, color: 'text-indigo-400' },
    { id: 'finance', label: 'Keuangan', icon: Wallet, color: 'text-emerald-400' },
    { id: 'journal', label: 'Jurnal', icon: BookOpen, color: 'text-purple-400', badge: journalStreak > 0 ? `${journalStreak}🔥` : undefined },
    { id: 'gym', label: 'Gym Log', icon: Dumbbell, color: 'text-rose-400' },
    { id: 'tasks', label: 'To-Do', icon: CheckSquare, color: 'text-blue-400' },
    { id: 'habits', label: 'Habits', icon: Repeat, color: 'text-amber-400' },
    { id: 'calendar', label: 'Kalender', icon: Calendar, color: 'text-teal-400' },
    { id: 'mylife', label: 'MY LIFE', icon: Compass, color: 'text-amber-400', highlight: true },
    { id: 'telegram', label: 'AI Bot', icon: Send, color: 'text-sky-400', badge: 'Live' },
  ];

  return (
    <div className="lg:hidden w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-2 px-1 min-w-max">
        {onOpenInstallModal && (
          <button
            type="button"
            onClick={onOpenInstallModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-300 border border-sky-500/40 shadow-sm shrink-0 animate-pulse"
          >
            <span>📲 Install App</span>
          </button>
        )}

        {quickPills.map((pill) => {
          const Icon = pill.icon;
          const isActive = activeTab === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setActiveTab(pill.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 scale-[1.02]'
                  : pill.highlight
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : pill.color}`} />
              <span>{pill.label}</span>
              {pill.badge && (
                <span className="text-[9px] px-1 py-0.2 rounded-md bg-amber-400/20 text-amber-300 font-mono">
                  {pill.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
