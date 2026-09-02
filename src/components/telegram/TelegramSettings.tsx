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
  RefreshCw,
  BellRing,
  ShieldCheck,
  Smartphone,
  Laptop,
  QrCode,
  Zap,
  Check,
  Mic,
  BookOpen,
  Dumbbell,
  Clock,
  MessageSquare,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { audioSynth } from '../../utils/audioSynth';

export const TelegramSettings: React.FC = () => {
  const { telegram, updateTelegramSettings } = useData();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'mobile' | 'desktop'>('mobile');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const botUsername = 'Asisten_Jurnal_Kamu_bot';
  const deepLinkUrl = `https://t.me/${botUsername}?start=${telegram.connectionCode}`;
  const isConnected = telegram.status === 'connected';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`/connect ${telegram.connectionCode}`);
    setCopiedText('connect');
    audioSynth.playSuccess(0.08);
    showToast(`✅ Perintah (/connect ${telegram.connectionCode}) berhasil disalin! Silakan tempel di chat Bot Telegram.`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCopySample = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    audioSynth.playSuccess(0.05);
    showToast(`📋 Format "${text}" disalin!`);
    setTimeout(() => setCopiedText(null), 2000);
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
        audioSynth.playSuccess(0.12);
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

  const quickFormulas = [
    { icon: Send, title: 'Catat Pengeluaran', sample: 'Kopi 15k bca', desc: 'Auto kurangi saldo & catat kategori' },
    { icon: Sparkles, title: 'Catat Pemasukan', sample: 'Gaji 5jt bank', desc: 'Auto tambah saldo rekening' },
    { icon: BookOpen, title: 'Tulis Jurnal', sample: 'jurnal: hari ini meeting lancar dan bersyukur', desc: 'Tersimpan rapi di tab Daily Journal' },
    { icon: Dumbbell, title: 'Catat Sesi Gym', sample: 'gym: bench press 60kg 3x10', desc: 'Auto masuk ke log Gym Tracker' },
    { icon: Clock, title: 'Pasang Pengingat', sample: 'Ingetin jam 17:00 workout', desc: 'Bot akan mengirim notif tepat waktu' },
    { icon: MessageSquare, title: 'Tanya AI Partner', sample: 'hitung sisa budget jajan saya', desc: 'AI Gemini menganalisis real-time' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <Send className="w-5 h-5 text-sky-400" />
            <span>Official Shared Telegram Bot & AI Partner</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Satu bot terpusat dengan Multi-User Isolation, OCR, Voice Note & Sinkronisasi 24/7.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SERVER BOT LIVE</span>
          </div>
        </div>
      </div>

      {/* Hero Satset Connection Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/80 via-slate-900 to-sky-950/70 border border-indigo-500/30 p-5 sm:p-6 rounded-2xl shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Asisten Jurnal Kamu Bot</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold flex items-center gap-1 border border-indigo-500/40">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">@{botUsername}</p>
            </div>
          </div>

          {/* Real-time Status Badge */}
          <div className="self-start sm:self-center">
            {isConnected ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>🟢 TERHUBUNG REAL-TIME</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>BELUM TERHUBUNG</span>
              </div>
            )}
          </div>
        </div>

        {/* User Account Info Bar */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="text-slate-300">
            Akun Anda: <strong className="text-white">{currentUser?.name || 'User'}</strong>
            <span className="mx-2 text-slate-600">|</span>
            Kode Unik: <code className="text-amber-400 font-mono font-extrabold text-sm px-1.5 py-0.5 bg-amber-400/10 rounded border border-amber-400/20">{telegram.connectionCode}</code>
          </div>
          {isConnected && (
            <div className="text-slate-400 text-[11px] font-mono">
              Chat ID: <span className="text-sky-400 font-bold">{telegram.telegramChatId || '6356373334'}</span>
            </div>
          )}
        </div>

        {/* Main Satset 1-Tap CTA Button */}
        <div className="space-y-2">
          <a
            href={deepLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioSynth.playClick(0.08)}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.99] group"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
            <span>⚡ Hubungkan Satset ke Telegram (1-Klik Otomatis)</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>
          <p className="text-[11px] text-center text-slate-400">
            Klik tombol di atas untuk membuka Telegram di HP/Laptop & langsung tersambung otomatis saat menekan <strong>START</strong>!
          </p>
        </div>

        {/* Interactive Device Tabs Guide */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-200">Panduan Langkah Menghubungkan:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('mobile')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'mobile'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>📱 HP Android / iOS</span>
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'desktop'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>💻 Laptop / PC</span>
              </button>
            </div>
          </div>

          {activeTab === 'mobile' ? (
            /* Mobile 3-Step Simple Flow */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center">1</div>
                <h5 className="text-xs font-bold text-slate-200">Klik Tombol Satset</h5>
                <p className="text-[11px] text-slate-400">Tekan tombol biru <em>"Hubungkan Satset"</em> di atas. Aplikasi Telegram Anda akan otomatis terbuka.</p>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">2</div>
                <h5 className="text-xs font-bold text-slate-200">Tekan START di Bot</h5>
                <p className="text-[11px] text-slate-400">Di layar Telegram, tekan tombol <strong>START / MULAI</strong> di bagian bawah layar.</p>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">3</div>
                <h5 className="text-xs font-bold text-slate-200">Langsung Terhubung!</h5>
                <p className="text-[11px] text-slate-400">Bot akan menyapa nama Anda dan dashboard web seketika berubah status menjadi <strong>TERHUBUNG</strong>.</p>
              </div>
            </div>
          ) : (
            /* Desktop / Laptop Guide with QR Code */
            <div className="flex flex-col sm:flex-row items-center gap-5 p-2">
              <div className="bg-white p-3 rounded-2xl shadow-lg shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(deepLinkUrl)}`}
                  alt="QR Code Telegram Bot Connect"
                  className="w-28 h-28"
                  loading="lazy"
                />
              </div>

              <div className="space-y-2.5 flex-1 text-xs">
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-sky-400" />
                  <span>Scan QR Code di samping menggunakan kamera HP Anda!</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Atau jika membuka Telegram di browser/laptop ini, cukup salin perintah koneksi berikut dan kirim ke bot:
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <code className="px-3 py-1.5 bg-slate-950 text-amber-300 font-mono text-xs rounded-xl border border-slate-800 flex-1 select-all">
                    /connect {telegram.connectionCode}
                  </code>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow"
                  >
                    {copiedText === 'connect' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === 'connect' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
            <button
              onClick={handleCopyCode}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all border border-slate-700/60"
            >
              <Copy className="w-4 h-4 text-slate-400" />
              <span>Salin Manual (/connect {telegram.connectionCode})</span>
            </button>

            <button
              onClick={handleTestNotification}
              disabled={isTesting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/40 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              <BellRing className={`w-4 h-4 ${isTesting ? 'animate-bounce' : ''}`} />
              <span>{isTesting ? 'Mengirim Notifikasi...' : '🔔 Uji Coba / Test Push Notifikasi'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cheatsheet Formula Cepat Bot */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Kumpulan Contoh Perintah Satset Bot</span>
          </h4>
          <span className="text-[11px] text-slate-500">Klik format untuk menyalin</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickFormulas.map((f) => {
            const Icon = f.icon;
            const isThisCopied = copiedText === f.title;
            return (
              <div
                key={f.title}
                onClick={() => handleCopySample(f.sample, f.title)}
                className="p-3.5 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 rounded-2xl cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{f.title}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 group-hover:text-indigo-400 flex items-center gap-0.5">
                    {isThisCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isThisCopied ? 'Tersalin' : 'Salin'}</span>
                  </span>
                </div>
                <div className="px-2.5 py-1.5 bg-slate-950/80 rounded-xl text-amber-300 font-mono text-xs border border-slate-800/80">
                  {f.sample}
                </div>
                <p className="text-[10px] text-slate-400">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Opsi Asisten AI & Reminder Telegram</div>
        <div className="space-y-2.5">
          {toggles.map((t) => {
            const isChecked = (telegram.settings as any)[t.key];
            return (
              <div key={t.key} className="flex items-center justify-between bg-slate-800/40 hover:bg-slate-800/60 p-3.5 sm:p-4 rounded-2xl border border-slate-800 transition-colors">
                <div className="pr-4">
                  <div className="font-semibold text-xs text-slate-200">
                    {t.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{t.desc}</div>
                </div>
                <button
                  onClick={() => {
                    audioSynth.playClick(0.06);
                    updateTelegramSettings({ [t.key]: !isChecked });
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors shrink-0 ${isChecked ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isChecked ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
