import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User as UserIcon, Lock, ArrowRight, Bot, ShieldCheck, CheckCircle2, Zap, Smartphone, KeyRound } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
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
    setErrorMsg('');

    if (isRegister) {
      if (!name || !username || !email) {
        setErrorMsg('Mohon isi nama lengkap, username, dan email!');
        return;
      }
      register(name, username, email, whatsapp);
    } else {
      const ok = login(email, pass);
      if (!ok) {
        setErrorMsg('Email atau Username tidak ditemukan!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 text-slate-100 font-sans">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: SaaS Brand & Value Highlights */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Personal Life OS & Management Portal</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Kontrol Kehidupan & Keuangan Anda Dalam Satu Dashboard 🚀
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sistem operasi kehidupan pribadi yang menggabungkan Keuangan, Telegram AI Assistant, Gym Journal, Productivity Tracker, dan Analisis Kehidupan.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mt-0.5">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Shared Telegram AI Bot 24/7</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Catat pengeluaran, pemasukan, & jadwal gym dari Telegram real-time.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">100% Multi-Tenant Data Isolation</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Setiap akun pengguna memiliki kode unik & data tersimpan pribadi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800/80">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMsg('');
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
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
                setIsRegister(true);
                setErrorMsg('');
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                isRegister
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ✨ Registrasi Akun Baru
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              {isRegister ? 'Buat Akun Personal OS' : 'Selamat Datang Kembali'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isRegister
                ? 'Isi formulir di bawah untuk mendaftar akun baru & gratis trial 7 hari!'
                : 'Masukkan email atau username Anda untuk mengakses dashboard.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center font-semibold animate-pulse">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="Contoh: Bintang Mas"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Username Unik</label>
                  <input
                    type="text"
                    placeholder="bintang_mas"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nomor WhatsApp (Opsional)</label>
                  <input
                    type="text"
                    placeholder="+6281234567890"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email / Username</label>
              <input
                type="text"
                placeholder="bintang@gmail.com atau bintang"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>{isRegister ? '🚀 Registrasi & Mulai Gunakan' : '🔓 Masuk Ke Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-500">
            🔒 Keamanan & Data Terisolasi 100% dengan Enkripsi Multi-User
          </div>

        </div>
      </div>
    </div>
  );
};
