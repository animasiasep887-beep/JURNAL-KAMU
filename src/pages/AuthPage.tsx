import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  User as UserIcon,
  Lock,
  ArrowRight,
  Bot,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Smartphone,
  KeyRound,
  TrendingUp,
  BookOpen,
  Dumbbell,
  CheckSquare,
  Award,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

export const AuthPage: React.FC = () => {
  const { login, register, switchUser, users } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioSynth.playClick();
    setErrorMsg('');

    if (isRegister) {
      if (!name.trim() || !username.trim() || !email.trim()) {
        setErrorMsg('Mohon lengkapi Nama Lengkap, Username, dan Email!');
        return;
      }
      register(name.trim(), username.trim(), email.trim(), whatsapp.trim());
      audioSynth.playSuccess();
    } else {
      const ok = login(email.trim(), pass);
      if (!ok) {
        setErrorMsg('Email atau Username tidak cocok dengan password!');
      } else {
        audioSynth.playSuccess();
      }
    }
  };

  const handleQuickDemoLogin = (userId: string) => {
    audioSynth.playClick();
    switchUser(userId);
    audioSynth.playSuccess(0.15);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 font-mono">
                JURNALKAMU<span className="text-indigo-400">.COM</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider block font-semibold">
                PERSONAL LIFE OPERATING SYSTEM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                audioSynth.playClick();
                setIsRegister(false);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                !isRegister ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => {
                audioSynth.playClick();
                setIsRegister(true);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                isRegister ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-200 hover:text-white'
              }`}
            >
              Daftar Gratis
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
          
          {/* Left Column: Product Showcase & Value Proposition */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-sm">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>The Next-Generation AI Life OS & Partner</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Satu Tempat untuk <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">Mengontrol Kehidupan</span>, Finansial & Mental Anda.
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Tingkatkan produktivitas, stabilitas mental, kebugaran fisik, dan kedisiplinan keuangan Anda dengan integrasi bot kecerdasan buatan Telegram 24/7.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-sm space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <Bot className="w-4 h-4" />
                  <span>Multimodal Telegram AI Bot</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Scan nota struk, kirim voice note, atau chat santai untuk catat transaksi, jurnal & gym seketika.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-sm space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <TrendingUp className="w-4 h-4" />
                  <span>AI Financial Runway & Budget</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Simulator ketahanan kas, meteran budget visual, serta ekspor spreadsheet Excel / CSV rapi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-sm space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                  <BookOpen className="w-4 h-4" />
                  <span>Distraction-Free Zen Journal</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Mode tulis bebas distraksi dengan pemutar suara ambien hujan (*Lofi Rain*) & prompt anti-stuck.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-sm space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <CheckSquare className="w-4 h-4" />
                  <span>Kanban Planner & Gym OS</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Manajemen tugas Kanban board dengan Pomodoro focus timer dan pelacak latihan angkatan beban.
                </p>
              </div>
            </div>

            {/* Quick 1-Click Demo Accounts */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Coba Akses Cepat 1-Klik (Demo):</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Tanpa Password</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('user-bintang')}
                  className="py-2 px-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/60 border border-indigo-500/40 text-xs font-bold text-indigo-200 hover:text-white transition-all text-center"
                >
                  ⭐ Bintang (User)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('user-admin')}
                  className="py-2 px-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/40 text-xs font-bold text-amber-200 hover:text-white transition-all text-center"
                >
                  🛡️ Admin System
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('user-reza')}
                  className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all text-center"
                >
                  👤 Reza (User)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card Form */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative space-y-6">
              
              {/* Form Tab Switcher */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    audioSynth.playClick();
                    setIsRegister(false);
                    setErrorMsg('');
                  }}
                  className={`py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                    !isRegister
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Masuk (Login)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioSynth.playClick();
                    setIsRegister(true);
                    setErrorMsg('');
                  }}
                  className={`py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                    isRegister
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Daftar Akun Baru
                </button>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {isRegister ? 'Buat Akun Life OS' : 'Selamat Datang Kembali'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRegister
                    ? 'Daftar sekarang dan dapatkan akses Pro Trial 7 Hari gratis.'
                    : 'Masukkan kredensial akun Anda untuk membuka dashboard.'}
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-bold animate-fade-in">
                  ⚠️ {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        placeholder="Contoh: Bintang Mas"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Username Unik</label>
                      <input
                        type="text"
                        placeholder="bintang_mas"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Nomor WhatsApp (Opsional)</label>
                      <input
                        type="text"
                        placeholder="+6281234567890"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email / Username</label>
                  <input
                    type="text"
                    placeholder="bintang@gmail.com atau bintang"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  <span>{isRegister ? '🚀 Daftar & Mulai Gratis' : '🔓 Masuk Ke Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Enkripsi Multi-Tenant & Keamanan Data Terisolasi</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500">
        <p>© 2026 JurnalKamu.com — The Executive Life OS & Telegram AI Partner. Crafted by Bintang.</p>
      </footer>
    </div>
  );
};
