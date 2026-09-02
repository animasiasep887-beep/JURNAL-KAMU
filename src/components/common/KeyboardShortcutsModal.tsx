import React from 'react';
import { Keyboard, X, Sparkles, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + K', desc: 'Buka Spotlight Search & Command Palette', category: 'Navigasi Global' },
    { key: '?', desc: 'Buka Panduan Shortcut Keyboard ini', category: 'Bantuan' },
    { key: 'T', desc: 'Buka Form Catat Transaksi Pengeluaran Cepat', category: 'Aksi Cepat' },
    { key: 'J', desc: 'Buka Halaman Tulis Jurnal Harian', category: 'Aksi Cepat' },
    { key: 'G', desc: 'Buka Halaman Latihan & Workout Gym', category: 'Aksi Cepat' },
    { key: 'P', desc: 'Buka Focus & Pomodoro Timer', category: 'Aksi Cepat' },
    { key: 'Esc', desc: 'Tutup Modal / Dialog yang sedang terbuka', category: 'Navigasi Global' },
  ];

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>Shortcut Keyboard Cepat</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                  PRO WORKFLOW
                </span>
              </h3>
              <p className="text-xs text-slate-400">Navigasi satset tanpa menyentuh mouse.</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List by Category */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {categories.map((cat) => (
            <div key={cat} className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{cat}</span>
              <div className="space-y-1.5">
                {shortcuts
                  .filter((s) => s.category === cat)
                  .map((s) => (
                    <div
                      key={s.key}
                      className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors"
                    >
                      <span className="text-xs text-slate-300">{s.desc}</span>
                      <kbd className="px-2.5 py-1 bg-slate-800 text-indigo-300 font-mono text-[11px] font-bold rounded-lg border border-slate-700 shadow-inner">
                        {s.key}
                      </kbd>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-between items-center text-xs text-slate-400">
          <span>Tekan tombol <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 font-mono rounded">Esc</kbd> kapan saja untuk keluar</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
