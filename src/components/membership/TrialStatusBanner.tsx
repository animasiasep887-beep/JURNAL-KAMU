import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTrialDaysRemaining } from '../../utils/formatters';
import { Sparkles, Clock, AlertTriangle, MessageCircle, Crown, ChevronRight } from 'lucide-react';

interface TrialStatusBannerProps {
  onOpenMembership: () => void;
}

export const TrialStatusBanner: React.FC<TrialStatusBannerProps> = ({ onOpenMembership }) => {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role === 'admin' || currentUser.role === 'super_admin') {
    return null;
  }

  const isFreeTrial = currentUser.membershipPlanId === 'free';
  const daysLeft = getTrialDaysRemaining(currentUser.membershipExpiryDate);

  if (!isFreeTrial) return null;

  const isUrgent = daysLeft <= 2;

  const handleWhatsAppChat = () => {
    const message = `Halo Admin Personal Life OS, masa trial akun saya tersisa ${daysLeft} hari.\n\nSaya ingin aktivasi membership:\nUsername: @${currentUser.username}\nEmail: ${currentUser.email}`;
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/6285869299537?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div
      className={`w-full rounded-2xl p-3 sm:p-4 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg ${
        isUrgent
          ? 'bg-gradient-to-r from-rose-950/80 via-amber-950/70 to-slate-900 border-amber-500/40 shadow-amber-500/10 animate-pulse'
          : 'bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border-indigo-500/30'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-xl shrink-0 ${
            isUrgent ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
          }`}
        >
          {isUrgent ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-xs sm:text-sm font-extrabold text-white">
              {isUrgent ? `⚠️ Peringatan: Masa Free Trial Tersisa ${daysLeft} Hari Lagi!` : `✨ Free Trial 7 Hari (Akses Penuh Seluruh Fitur)`}
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {daysLeft > 0 ? `${daysLeft} Hari Tersisa` : 'Hari Terakhir'}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5">
            {isUrgent
              ? 'Upgrade membership sekarang untuk menghindari jeda akses saat trial berakhir. Data Anda dijamin aman!'
              : 'Anda menikmati full akses fitur AI, Bot Telegram, Keuangan, Jurnal & Gym selama masa percobaan 1 minggu.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
        <button
          onClick={handleWhatsAppChat}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all active:scale-95"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Aktivasi via WA</span>
        </button>

        <button
          onClick={onOpenMembership}
          className="flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
        >
          <span>Lihat Paket</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
