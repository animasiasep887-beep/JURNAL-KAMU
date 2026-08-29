import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, CheckCircle2, Wallet, Send, Dumbbell, Repeat, Bell, ShieldCheck } from 'lucide-react';

export const UserOnboarding: React.FC = () => {
  const { currentUser, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);

  const steps = [
    { num: 1, title: 'Profile Setup', icon: Sparkles },
    { num: 2, title: 'Finance Accounts', icon: Wallet },
    { num: 3, title: 'Monthly Budget', icon: ShieldCheck },
    { num: 4, title: 'Telegram Integration', icon: Send },
    { num: 5, title: 'Daily Habits', icon: Repeat },
    { num: 6, title: 'Gym Preferences', icon: Dumbbell },
    { num: 7, title: 'Notifications', icon: Bell },
    { num: 8, title: 'Done!', icon: CheckCircle2 },
  ];

  const handleNext = () => {
    if (step < 8) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6">
        {/* Progress header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Sparkles className="w-5 h-5" />
            <span>Welcome to Personal Life OS Setup</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Step {step} of 8</span>
        </div>

        {/* Steps indicator */}
        <div className="flex gap-1">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s.num <= step ? 'bg-indigo-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="py-6 space-y-4">
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Halo {currentUser?.name}! 👋</h2>
              <p className="text-xs text-slate-400">Mari atur sistem kehidupan pribadi Anda dalam beberapa langkah sederhana.</p>
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 text-xs">
                Timezone: <strong>Asia/Jakarta</strong> • Currency: <strong>IDR (Rp)</strong>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Akun Penyimpanan Uang 💳</h2>
              <p className="text-xs text-slate-400">Sistem otomatis menyiapkan akun standar (Cash, BCA, GoPay, Tabungan).</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Atur Budget Makanan & Transport 📊</h2>
              <p className="text-xs text-slate-400">Target budget standar makanan Rp1.200.000 / bulan.</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Integrasi Telegram Bot 🤖</h2>
              <p className="text-xs text-slate-400">Ketik <code>Kopi 10k</code> di Telegram untuk langsung tercatat di web dashboard.</p>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Kebiasaan Pagi & Malam 🔥</h2>
              <p className="text-xs text-slate-400">Streak tracker diatur untuk Bangun 06:00, Belajar 1 jam, dan Journaling.</p>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Workout & Gym Preferences 🏋️</h2>
              <p className="text-xs text-slate-400">Log beban & repetisi Bench Press, Lat Pulldown, Squat siap digunakan.</p>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Morning Briefing & Nightly Review 🔔</h2>
              <p className="text-xs text-slate-400">Notifikasi otomatis diatur pukul 07:00 WIB dan 21:00 WIB.</p>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-3 text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h2 className="text-2xl font-extrabold text-slate-100">Setup Selesai! 🎉</h2>
              <p className="text-xs text-slate-400">Sistem Personal Operating System Anda siap digunakan.</p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30"
          >
            <span>{step === 8 ? 'Buka Dashboard Utama' : 'Lanjut'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
