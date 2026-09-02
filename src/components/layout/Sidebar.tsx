import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Wallet,
  Send,
  BookOpen,
  Clock,
  CheckSquare,
  Calendar as CalendarIcon,
  Dumbbell,
  Repeat,
  BarChart3,
  FileText,
  Target,
  Compass,
  Crown,
  Settings,
  ShieldAlert,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { isAdmin } = useAuth();

  const menuSections = [
    {
      title: 'UTAMA & AI',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'finance', label: 'Finance & Wealth', icon: Wallet },
        { id: 'telegram', label: 'Telegram AI Bot', icon: Send, badge: 'Live' },
        { id: 'journal', label: 'Daily Journal & Mood', icon: BookOpen },
      ],
    },
    {
      title: 'PRODUKTIVITAS & FITNESS',
      items: [
        { id: 'activities', label: 'Time Tracking', icon: Clock },
        { id: 'tasks', label: 'Tasks & Planner', icon: CheckSquare },
        { id: 'calendar', label: 'Integrated Calendar', icon: CalendarIcon },
        { id: 'gym', label: 'Gym & Fitness Journal', icon: Dumbbell },
        { id: 'habits', label: 'Habit Matrix', icon: Repeat },
      ],
    },
    {
      title: 'ANALYTICS & MASTER',
      items: [
        { id: 'analytics', label: 'Life Analytics', icon: BarChart3 },
        { id: 'reports', label: 'AI Reports', icon: FileText },
        { id: 'goals', label: 'Goals & Targets', icon: Target },
        { id: 'mylife', label: 'MY LIFE Master Matrix', icon: Compass, highlight: true },
      ],
    },
    {
      title: 'SISTEM & AKUN',
      items: [
        { id: 'membership', label: 'Membership & Tier', icon: Crown },
        { id: 'settings', label: 'Settings & Data', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-slate-950/95 border-r border-slate-800/80 flex-col h-screen sticky top-0 select-none shrink-0 backdrop-blur-2xl z-20">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Personal Life OS Logo"
            className="w-9 h-9 rounded-2xl object-cover shadow-lg shadow-indigo-600/40 ring-1 ring-indigo-500/30 shrink-0"
          />
          <div>
            <h1 className="font-black text-sm text-white tracking-tight flex items-center gap-1.5">
              Personal Life OS
              <span className="text-[9px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded-full">PRO</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Next-Gen Life Operating System</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest px-3 py-1">
              {section.title}
            </div>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 font-bold scale-[1.01]'
                      : (item as any).highlight
                      ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1 rounded-lg ${isActive ? 'bg-white/20 text-white' : (item as any).highlight ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  {(item as any).badge && (
                    <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-extrabold rounded-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {(item as any).badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Admin Panel Section */}
        {isAdmin && (
          <div className="pt-2 space-y-1">
            <div className="text-[9.5px] font-black text-amber-400 uppercase tracking-widest px-3 py-1 flex items-center justify-between">
              <span>ADMIN SAAS SYSTEM</span>
              <ShieldAlert className="w-3 h-3 text-amber-400" />
            </div>
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>Admin Dashboard & User</span>
            </button>
          </div>
        )}
      </nav>

      {/* Footer Telegram Quick Card */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/30 space-y-2">
        <div
          onClick={() => setActiveTab('telegram')}
          className="cursor-pointer p-3 bg-gradient-to-br from-slate-900 to-slate-950 hover:from-slate-850 hover:to-slate-900 border border-sky-500/30 rounded-2xl transition-all flex items-center justify-between shadow-md group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold border border-sky-500/30 group-hover:scale-105 transition-transform">
              <Send className="w-4 h-4" />
            </div>
            <div className="text-[11px]">
              <div className="font-bold text-slate-200">Telegram Bot</div>
              <div className="text-emerald-400 text-[10px] flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live AI Sync
              </div>
            </div>
          </div>
          <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
            OPEN
          </span>
        </div>

        {/* Developer Credit */}
        <a
          href="https://instagram.com/bintangwhales"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-400 hover:text-amber-300 transition-colors"
        >
          <span>Crafted by <strong>Bintang</strong></span>
          <span className="text-indigo-400 font-mono">@bintangwhales</span>
        </a>
      </div>
    </aside>
  );
};
