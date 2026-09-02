import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_MEMBERSHIP_PLANS } from '../../utils/initialData';
import { Crown, CheckCircle, MessageCircle, Sparkles, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';

export const MembershipPage: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const currentPlan = INITIAL_MEMBERSHIP_PLANS.find((p) => p.id === currentUser.membershipPlanId) || INITIAL_MEMBERSHIP_PLANS[0];

  const handleWhatsAppChat = (plan: typeof INITIAL_MEMBERSHIP_PLANS[0]) => {
    const message = `Halo Admin Personal Life OS! 🌟\n\nSaya ingin aktivasi / perpanjang paket membership.\n\n👤 *Nama:* ${currentUser.name}\n🔑 *Username:* @${currentUser.username}\n📧 *Email:* ${currentUser.email}\n💎 *Paket Pilihan:* ${plan.name} (${plan.priceFormatted})\n\nMohon rekening / QRIS untuk pembayarannya. Terima kasih! 🙏`;
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/6285869299537?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-xl text-slate-950 shadow-md">
              <Crown className="w-5 h-5 font-bold" />
            </div>
            <h3 className="font-extrabold text-slate-100 text-lg sm:text-xl tracking-tight">
              Membership & Langganan SaaS
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Semua paket mendapatkan <strong>100% Full Akses</strong> ke seluruh modul, AI Analyst, dan Bot Telegram. Pilih durasi sesuai kebutuhan Anda!
          </p>
        </div>

        {/* Current Status Pill */}
        <div className="p-3 bg-gradient-to-tr from-amber-950/60 via-slate-800 to-slate-900 border border-amber-500/30 rounded-2xl flex items-center gap-3 self-start md:self-auto">
          <Crown className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-100">
              Paket Aktif: <span className="text-amber-300 capitalize">{currentPlan.name}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Masa Berlaku: <strong className="text-slate-200 font-mono">{currentUser.membershipExpiryDate}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Activation Flow Banner */}
      <div className="bg-gradient-to-r from-slate-850 via-slate-800 to-slate-850 p-4 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">
              Pembayaran Cepat & Aktivasi Instan via WhatsApp Admin
            </div>
            <p className="text-[11px] text-slate-400">
              Mendukung Transfer BCA, Mandiri, BRI, QRIS, GoPay, OVO, Dana & ShopeePay.
            </p>
          </div>
        </div>
        <button
          onClick={() => handleWhatsAppChat(currentPlan)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 shrink-0 transition-all active:scale-95"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Chat Admin WhatsApp</span>
        </button>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {INITIAL_MEMBERSHIP_PLANS.map((plan) => {
          const isCurrent = currentUser.membershipPlanId === plan.id;
          const isBestValue = plan.id === 'lifetime';
          const isPopular = plan.id === 'yearly';

          return (
            <div
              key={plan.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                isCurrent
                  ? 'bg-gradient-to-b from-indigo-950/70 via-slate-850 to-slate-900 border-indigo-500 ring-2 ring-indigo-500/40 shadow-xl'
                  : isBestValue
                  ? 'bg-gradient-to-b from-amber-950/50 via-slate-850 to-slate-900 border-amber-500/50 hover:border-amber-400 shadow-lg'
                  : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70'
              }`}
            >
              {/* Badges */}
              {isBestValue && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-extrabold text-[9px] rounded-full uppercase shadow-sm">
                  Best Value 👑
                </div>
              )}
              {isPopular && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-extrabold text-[9px] rounded-full uppercase shadow-sm">
                  Hemat 58% 🔥
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-extrabold text-slate-100 text-sm">{plan.name}</h4>
                </div>

                <div className="text-lg font-extrabold text-amber-300 font-mono my-2.5">
                  {plan.priceFormatted}
                </div>

                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold mb-3">
                  <Zap className="w-3 h-3" />
                  <span>100% Full Akses Fitur</span>
                </div>

                <ul className="space-y-2 text-[11px] text-slate-300 my-2">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleWhatsAppChat(plan)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 mt-4 ${
                  isCurrent
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    : isBestValue
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <span>{isCurrent ? 'Perpanjang Paket' : 'Pilih Paket Ini'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* 🌟 DEVELOPER SHOWCASE / KREATOR RESMI */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900/95 via-indigo-950/60 to-slate-900/95 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-0.5 shadow-xl shadow-indigo-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-amber-300 text-xl">
                ⭐
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[9px] font-black rounded-md">
              DEV
            </span>
          </div>

          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-extrabold mb-1">
              <span>👑 CREATED & DEVELOPED BY</span>
            </div>
            <h4 className="text-base font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <span>Bintang</span>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">Siswa SMA & Tech Creator</span>
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Dirancang dari nol dengan kecerdasan AI mutakhir untuk membantu Anda meraih kebebasan finansial, kebugaran fisik, dan kejernihan pikiran dalam satu ekosistem!
            </p>
          </div>
        </div>

        <a
          href="https://instagram.com/bintangwhales"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-pink-600/30 flex items-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <span>📸 Follow IG @bintangwhales</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
