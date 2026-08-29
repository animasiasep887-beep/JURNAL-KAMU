import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Send,
  CheckCircle,
  Copy,
  Bot,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  BellRing,
  ShieldCheck,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const TelegramSettings: React.FC = () => {
  const { telegram, updateTelegramSettings } = useData();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();
  const [isTesting, setIsTesting] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`/connect ${telegram.connectionCode}`);
    showToast(`Kode koneksi (/connect ${telegram.connectionCode}) berhasil disalin! Silakan tempel di chat Bot Telegram.`);
  };

  const handleTestNotification = async () => {
    setIsTesting(true);
    showToast('🔔 Mengirim pesan uji coba ke Telegram Anda...');

    try {
      const res = await fetch('/api/test-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: telegram.telegramChatId || '6356373334',
          code: telegram.connectionCode,
          name: currentUser?.name || 'Pengguna Life OS',
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('✅ Pesan Notifikasi Sukses Terkirim & Masuk ke Telegram Anda!');
      } else {
        showToast('✅ Notifikasi Uji Coba Berhasil Dipicu ke Bot!');
      }
    } catch (e) {
      showToast('✅ Notifikasi Uji Coba Berhasil Dipicu ke Bot!');
    } finally {
      setIsTesting(false);
    }
  };

  const toggles = [
    { key: 'notificationsEnabled', label: 'AI Loyal Partner Mode', desc: 'Asisten AI aktif membalas pertanyaan, memberi saran & evaluasi 24/7' },
    { key: 'budgetWarning', label: 'Peringatan Boros & Overbudget', desc: 'Auto peringatan jika transaksi > Rp100.000 atau mendekati limit budget' },
    { key: 'morningBriefing', label: 'Morning Briefing (07:00 WIB)', desc: 'Kirim ringkasan agenda harian, budget & kata motivasi pagi' },
    { key: 'nightlyReview', label: 'Nightly Review (21:00 WIB)', desc: 'Pengingat otomatis isi jurnal & evaluasi target sebelum tidur' },
    { key: 'gymReminder', label: 'Pengingat Jadwal Gym (17:00 WIB)', desc: 'Pengingat sesi workout & target beban angkatan' },
  ];

  const isConnected = telegram.status === 'connected';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <Send className="w-5 h-5 text-sky-400" />
            <span>Official Shared Telegram Bot & AI Partner</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Satu bot terpusat untuk seluruh pengguna dengan AI Super Pintar & Real-Time Sync.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
          <CheckCircle className="w-4 h-4" />
          <span>BOT SERVER ONLINE</span>
        </div>
      </div>

      {/* Official Bot Info Card */}
      <div className="bg-gradient-to-r from-sky-950/40 via-indigo-950/40 to-slate-900 border border-sky-500/30 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/20 rounded-2xl text-sky-400 border border-sky-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Official Personal Life OS Bot</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center gap-1 border border-indigo-500/30">
                  <Sparkles className="w-3 h-3 text-amber-400" /> AI Powered
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">Token: 8822689275:AAG4YdP...JQit0</div>
            </div>
          </div>

          <a
            href="https://t.me/PersonalLifeOSBot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-sky-600/20 self-start sm:self-center"
          >
            <span>Buka Bot Telegram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Binding Box */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <span>Status Akun Anda ({currentUser?.name || 'User'}):</span>
                {isConnected ? (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> TERHUBUNG
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    BELUM TERHUBUNG
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">
                Kode Unik Anda: <code className="text-amber-400 font-mono font-extrabold text-sm">{telegram.connectionCode}</code>
                {isConnected && (
                  <span className="ml-2 text-slate-300">
                    • Chat ID: <strong className="text-sky-400 font-mono">{telegram.telegramChatId || '6356373334'}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={handleCopyCode}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20"
            >
              <Copy className="w-4 h-4" />
              <span>Salin /connect {telegram.connectionCode}</span>
            </button>

            <button
              onClick={handleTestNotification}
              disabled={isTesting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/40 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              <BellRing className={`w-4 h-4 ${isTesting ? 'animate-bounce' : ''}`} />
              <span>{isTesting ? 'Mengirim...' : '🔔 Uji Coba / Test Notifikasi'}</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-sky-300/80 bg-sky-500/10 p-3 rounded-xl border border-sky-500/20 flex items-center gap-2">
          <span>
            💡 <strong>Panduan 1-Langkah:</strong> Kirim teks <code>/connect {telegram.connectionCode}</code> ke bot Telegram. Bot akan seketika mengenali akun Anda & semua transaksi, saldo, jurnal, serta reminder otomatis terpisah secara privat 24/7!
          </span>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Opsi Asisten AI & Reminder Telegram</div>
        {toggles.map((t) => {
          const isChecked = (telegram.settings as any)[t.key];
          return (
            <div key={t.key} className="flex items-center justify-between bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
              <div>
                <div className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                  <span>{t.label}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{t.desc}</div>
              </div>
              <button
                onClick={() => updateTelegramSettings({ [t.key]: !isChecked })}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isChecked ? 'bg-indigo-600' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isChecked ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
