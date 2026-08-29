import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  BookOpen,
  DollarSign,
  Dumbbell,
  CheckSquare,
  Target,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileText,
  Volume2,
  X,
  CreditCard,
  Send,
  Zap,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { audioSynth } from '../../utils/audioSynth';
import { formatIDR } from '../../utils/formatters';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenQuickAction: () => void;
  onOpenZenMode?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenQuickAction,
  onOpenZenMode,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { transactions, journals, tasks, accounts } = useData();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      audioSynth.playClick(0.08);
    }
  }, [isOpen]);

  // Command items
  const navigationItems = useMemo(() => [
    { id: 'nav-dashboard', label: 'Buka Ringkasan (Dashboard)', category: 'Navigasi Halaman', icon: Zap, action: () => onNavigateTab('dashboard'), shortcut: 'D' },
    { id: 'nav-finance', label: 'Buka Manajemen Keuangan & Saldo', category: 'Navigasi Halaman', icon: DollarSign, action: () => onNavigateTab('finance'), shortcut: 'F' },
    { id: 'nav-journal', label: 'Buka Jurnal Harian & Refleksi', category: 'Navigasi Halaman', icon: BookOpen, action: () => onNavigateTab('journal'), shortcut: 'J' },
    { id: 'nav-gym', label: 'Buka Log Latihan Gym & Otot', category: 'Navigasi Halaman', icon: Dumbbell, action: () => onNavigateTab('gym'), shortcut: 'G' },
    { id: 'nav-tasks', label: 'Buka Task Management & To-Do', category: 'Navigasi Halaman', icon: CheckSquare, action: () => onNavigateTab('tasks'), shortcut: 'T' },
    { id: 'nav-goals', label: 'Buka Target & Life Mastery', category: 'Navigasi Halaman', icon: Target, action: () => onNavigateTab('goals'), shortcut: 'M' },
    { id: 'nav-telegram', label: 'Buka Pengaturan & Bot Telegram', category: 'Navigasi Halaman', icon: Send, action: () => onNavigateTab('telegram'), shortcut: 'B' },
  ], [onNavigateTab]);

  const quickActionItems = useMemo(() => [
    {
      id: 'act-expense',
      label: 'Catat Pengeluaran Baru Cepat',
      category: 'Aksi Kilat',
      icon: PlusCircle,
      action: () => { onOpenQuickAction(); },
      badge: 'Cepat',
    },
    {
      id: 'act-zen',
      label: 'Buka Jurnal Mode Zen (Bebas Distraksi + Audio Hujan)',
      category: 'Aksi Kilat',
      icon: Volume2,
      action: () => {
        onNavigateTab('journal');
        if (onOpenZenMode) onOpenZenMode();
      },
      badge: 'Zen',
    },
    {
      id: 'act-export',
      label: 'Buka Pusat Ekspor Data & Laporan',
      category: 'Aksi Kilat',
      icon: FileText,
      action: () => { onNavigateTab('settings'); },
      badge: 'Laporan',
    },
  ], [onOpenQuickAction, onNavigateTab, onOpenZenMode]);

  // Search through live user data (journals, transactions, tasks)
  const dataSearchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: Array<{ id: string; label: string; subLabel: string; category: string; icon: any; action: () => void }> = [];

    // Search Journals
    journals.forEach((j) => {
      if (j.title?.toLowerCase().includes(q) || j.content?.toLowerCase().includes(q)) {
        results.push({
          id: `j-${j.id}`,
          label: j.title || 'Jurnal Tanpa Judul',
          subLabel: `${j.date} • ${j.content?.substring(0, 60)}...`,
          category: 'Hasil Jurnal',
          icon: BookOpen,
          action: () => onNavigateTab('journal'),
        });
      }
    });

    // Search Transactions
    transactions.forEach((tx) => {
      if (tx.description?.toLowerCase().includes(q) || tx.category?.toLowerCase().includes(q)) {
        results.push({
          id: `tx-${tx.id}`,
          label: `${tx.description} (${tx.type === 'income' ? '+' : '-'}${formatIDR(tx.amount)})`,
          subLabel: `${tx.date} • Kategori: ${tx.category} • ${tx.paymentMethod}`,
          category: 'Hasil Transaksi',
          icon: CreditCard,
          action: () => onNavigateTab('finance'),
        });
      }
    });

    // Search Tasks
    tasks.forEach((t) => {
      if (t.title?.toLowerCase().includes(q)) {
        results.push({
          id: `t-${t.id}`,
          label: t.title,
          subLabel: `Status: ${t.status === 'done' ? 'Selesai' : 'Pending'} • Prioritas: ${t.priority || 'Normal'}`,
          category: 'Hasil Task',
          icon: CheckSquare,
          action: () => onNavigateTab('tasks'),
        });
      }
    });

    return results.slice(0, 8);
  }, [query, journals, transactions, tasks, onNavigateTab]);

  // Combine and filter
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      return [...quickActionItems, ...navigationItems];
    }
    const q = query.toLowerCase();
    const matchedActions = quickActionItems.filter((i) => i.label.toLowerCase().includes(q));
    const matchedNav = navigationItems.filter((i) => i.label.toLowerCase().includes(q));
    return [...matchedActions, ...matchedNav, ...dataSearchResults];
  }, [query, quickActionItems, navigationItems, dataSearchResults]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
        audioSynth.playClick(0.04);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
        audioSynth.playClick(0.04);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          audioSynth.playSuccess(0.1);
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl bg-slate-900/95 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden backdrop-blur-2xl flex flex-col transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Header */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Ketik untuk mencari jurnal, pengeluaran, task, atau perintah..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm md:text-base outline-none font-medium"
          />
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">ESC</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
              <p className="text-sm font-medium">Tidak ada hasil yang cocok dengan "{query}"</p>
              <p className="text-xs text-slate-600 mt-1">Coba cari nama toko, kategori, atau nama task.</p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    audioSynth.playSuccess(0.08);
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 border border-indigo-500/40 text-white translate-x-1'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        isSelected ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{cmd.label}</span>
                        {(cmd as any).badge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {(cmd as any).badge}
                          </span>
                        )}
                      </div>
                      {(cmd as any).subLabel ? (
                        <p className="text-xs text-slate-400 truncate mt-0.5">{(cmd as any).subLabel}</p>
                      ) : (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{cmd.category}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    {(cmd as any).shortcut && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {(cmd as any).shortcut}
                      </span>
                    )}
                    {isSelected && <ArrowRight className="w-4 h-4 text-indigo-400 animate-pulse" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-[10px] border border-slate-700">↑↓</span> navigasi
            </span>
            <span className="flex items-center gap-1">
              <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-[10px] border border-slate-700">↵</span> pilih
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spotlight Life OS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
