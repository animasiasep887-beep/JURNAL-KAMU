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
  Eye,
  EyeOff,
  Mail,
  Phone,
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioSynth.playClick();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      if (isRegister) {
        if (!name.trim() || !username.trim() || !email.trim() || !pass.trim()) {
          setErrorMsg('Mohon lengkapi Nama Lengkap, Username, Email & Password!');
          setLoading(false);
          return;
        }
        register(name.trim(), username.trim(), email.trim(), whatsapp.trim());
        audioSynth.playSuccess();
      } else {
        const ok = login(email.trim(), pass);
        if (!ok) {
          setErrorMsg('Email atau Username tidak cocok dengan password yang terdaftar!');
          audioSynth.playClick(0.2);
        } else {
          audioSynth.playSuccess();
        }
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-5%] left-[-10%] w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-indigo-600/20 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-10%] w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] bg-purple-600/20 rounded-full blur-[110px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute top-[35%] right-[10%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-amber-500/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1 font-mono">
                JURNALKAMU<span className="text-indigo-400">.COM</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 tracking-wider block font-semibold">
                PERSONAL LIFE OPERATING SYSTEM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioSynth.playClick();
                setIsRegister(false);
                setErrorMsg('');
              }}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-xl transition-all ${
                !isRegister ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => {
                audioSynth.playClick();
                setIsRegister(true);
                setErrorMsg('');
              }}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-xl transition-all ${
                isRegister ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-200 hover:text-white'
              }`}
            >
              Daftar
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center w-full max-w-lg lg:max-w-none">
          
          {/* Left Column (Desktop Hero Showcase / Hidden on Mobile Form Focus) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-sm">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Gen Personal Life OS & AI Partner</span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.2]">
                Satu Tempat untuk <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">Mengontrol Kehidupan</span>, Finansial & Mental Anda.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tingkatkan produktivitas, stabilitas mental, kebugaran fisik, dan kedisiplinan keuangan Anda dengan integrasi bot kecerdasan buatan Telegram 24/7.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-sm space-y-1.5 hover:border-indigo-500/40 transition-all">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <Bot className="w-4 h-4" />
                  <span>Multimodal Telegram AI Bot</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Scan nota struk, kirim voice note, atau chat santai untuk catat transaksi, jurnal & gym seketika.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-sm space-y-1.5 hover:border-emerald-500/40 transition-all">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <TrendingUp className="w-4 h-4" />
                  <span>AI Financial Runway & Budget</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Simulator ketahanan kas, meteran budget visual, serta ekspor spreadsheet Excel / CSV rapi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-sm space-y-1.5 hover:border-purple-500/40 transition-all">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                  <BookOpen className="w-4 h-4" />
                  <span>Distraction-Free Zen Journal</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Mode tulis bebas distraksi dengan pemutar suara ambien hujan (*Lofi Rain*) & prompt anti-stuck.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-sm space-y-1.5 hover:border-amber-500/40 transition-all">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <CheckSquare className="w-4 h-4" />
                  <span>Kanban Planner & Gym OS</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Manajemen tugas Kanban board dengan Pomodoro focus timer dan pelacak latihan angkatan beban.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Data Pribadi Terenkripsi</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <Smartphone className="w-4 h-4" />
                <span>Installable di Android & iOS (PWA)</span>
              </span>
            </div>
          </div>

          {/* Right Column: Premium Auth Card Form */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-slate-900/95 border border-slate-800/90 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-2xl relative space-y-5 sm:space-y-6">
              
              {/* Form Switcher Tabs */}
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
                  🔑 Masuk (Login)
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
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ✨ Daftar Baru
                </button>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {isRegister ? 'Buat Akun Life OS' : 'Masuk ke Akun Anda'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRegister
                    ? 'Daftar sekarang & nikmati akses Pro Trial 7 Hari gratis.'
                    : 'Gunakan email atau username terdaftar Anda.'}
                </p>
              </div>

              {/* Error Notification */}
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-bold animate-fade-in">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {isRegister && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Nama Lengkap</label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Contoh: Bintang Mas"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-100 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Username Unik</label>
                      <div className="relative">
                        <span className="text-slate-500 text-xs font-mono font-bold absolute left-3.5 top-1/2 -translate-y-1/2">@</span>
                        <input
                          type="text"
                          placeholder="bintang_mas"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-slate-100 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp (Opsional)</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="+6281234567890"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-100 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email atau Username</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="bintang@gmail.com atau bintang"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-100 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-slate-100 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-3 active:scale-98"
                >
                  <span>{loading ? 'Memproses...' : isRegister ? '🚀 Daftar & Mulai Gratis' : '🔓 Masuk Ke Dashboard'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="pt-2 text-center text-[10.5px] text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enkripsi Multi-User Terisolasi & Akses Bot Telegram</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 px-4 sm:px-8 py-3.5 text-center text-[11px] text-slate-500">
        <p>© 2026 JurnalKamu.com — Executive Personal Life OS & Multimodal AI Partner. Created by Bintang.</p>
      </footer>
    </div>
  );
};
