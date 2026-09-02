import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Plus,
  Bell,
  Sun,
  Moon,
  Lock,
  Search,
  Shield,
  User as UserIcon,
  Crown,
  ChevronDown,
  LogOut,
  Sparkles,
  Volume2,
  VolumeX,
  Smartphone,
  Download,
} from 'lucide-react';
import { INITIAL_MEMBERSHIP_PLANS } from '../../utils/initialData';
import { audioSynth } from '../../utils/audioSynth';

interface NavbarProps {
  onOpenQuickAction: () => void;
  onOpenNotifications: () => void;
  onSearchSubmit: (query: string) => void;
  onOpenInstallModal?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuickAction,
  onOpenNotifications,
  onSearchSubmit,
  onOpenInstallModal,
  activeTab,
  setActiveTab,
}) => {
  const { currentUser, users, switchUser, lockScreen, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMutedState, setIsMutedState] = useState<boolean>(() => audioSynth.isAudioMuted());

  const plan = INITIAL_MEMBERSHIP_PLANS.find((p) => p.id === currentUser?.membershipPlanId) || INITIAL_MEMBERSHIP_PLANS[0];

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      setActiveTab('search');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-3 md:px-6 flex items-center justify-between transition-colors gap-2">
      {/* Mobile Brand Logo */}
      <div
        onClick={() => setActiveTab('dashboard')}
        className="lg:hidden flex items-center gap-2 cursor-pointer shrink-0"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="hidden xs:inline font-extrabold text-xs text-white">Life OS</span>
      </div>

      {/* Left: Search input / Spotlight trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div
          onClick={() => onSearchSubmit('')}
          className="relative w-full cursor-pointer group"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <div className="w-full bg-slate-900/80 border border-slate-700/80 group-hover:border-indigo-500/60 rounded-2xl pl-10 pr-16 py-2 text-xs md:text-sm text-slate-400 flex items-center justify-between transition-all shadow-inner">
            <span className="truncate">Cari jurnal, pengeluaran, task...</span>
            <span className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono text-indigo-400 font-semibold">
              Ctrl+K
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Install / Download App Button */}
        {onOpenInstallModal && (
          <button
            onClick={onOpenInstallModal}
            title="Download & Install Aplikasi ke HP / Desktop"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-800 text-sky-300 hover:text-sky-200 border border-sky-500/30 rounded-xl text-xs font-bold shadow-md shadow-sky-950/30 transition-all cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}

        {/* Quick Action (+) Button - VVIP Pulsating Shimmer */}
        <button
          onClick={onOpenQuickAction}
          className="relative group overflow-hidden flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-bold text-xs md:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">+ Catat Cepat</span>
        </button>

        {/* Lock Screen PIN button */}
        <button
          onClick={lockScreen}
          title="Kunci Layar (Privacy Mode)"
          className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-all"
        >
          <Lock className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          title="Notification Center"
          className="relative p-2 text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        {/* Sound FX Toggle (Mute / Unmute) */}
        <button
          onClick={() => {
            const isNowMuted = audioSynth.toggleMute();
            setIsMutedState(isNowMuted);
          }}
          title={isMutedState ? 'Suara UI Dimatikan (Muted)' : 'Suara UI Aktif'}
          className={`p-2 rounded-xl border transition-all ${
            isMutedState
              ? 'text-slate-500 bg-slate-900 border-slate-800'
              : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30 shadow-sm'
          }`}
        >
          {isMutedState ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 bg-slate-800/40 hover:bg-slate-800/80 rounded-xl border border-slate-700/40 transition-all"
          >
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/40" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                {currentUser?.name.charAt(0)}
              </div>
            )}
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                {currentUser?.name}
                {isAdmin && <Shield className="w-3 h-3 text-amber-400" />}
              </span>
              <span className="text-[10px] text-indigo-400 font-medium capitalize flex items-center gap-0.5">
                <Crown className="w-2.5 h-2.5" />
                {plan.name}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-scale-in">
              <div className="p-3 bg-slate-800/60 rounded-xl mb-2">
                <div className="font-semibold text-slate-200 text-sm">{currentUser?.name}</div>
                <div className="text-xs text-slate-400">@{currentUser?.username}</div>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[11px] text-indigo-300 font-medium">
                  <Crown className="w-3 h-3 text-amber-400" />
                  {plan.name}
                </div>
              </div>

              {/* User Switcher (Admin Only Tool) */}
              {isAdmin && (
                <>
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Mode Pengembang / Ganti Akun Admin</span>
                  </div>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between transition-colors ${
                        u.id === currentUser?.id ? 'bg-indigo-600/20 text-indigo-300 font-medium' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <UserIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{u.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 capitalize">{u.role}</span>
                    </button>
                  ))}
                  <div className="h-px bg-slate-800 my-2" />
                </>
              )}

              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/10 font-medium rounded-xl flex items-center gap-2 mb-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Panel Dashboard
                </button>
              )}

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-indigo-300 hover:bg-indigo-600/20 font-semibold rounded-xl flex items-center gap-2 mb-1"
              >
                <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                Edit Foto, Nama & Bio
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl flex items-center gap-2 mb-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Pengaturan & Backup Data
              </button>

              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 font-medium rounded-xl flex items-center gap-2 mb-1 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5" />
                + Register Akun Baru
              </button>

              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 font-medium rounded-xl flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar (Logout)
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
