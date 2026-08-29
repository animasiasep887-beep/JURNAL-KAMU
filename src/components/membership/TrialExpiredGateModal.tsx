import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Lock,
  ShieldCheck,
  Crown,
  MessageCircle,
  CheckCircle,
  Sparkles,
  RefreshCw,
  LogOut,
  Zap,
  ArrowRight,
  Star,
} from 'lucide-react';

export const TrialExpiredGateModal: React.FC = () => {
  const { currentUser, logout, switchUser, users } = useAuth();
  const [selectedPlanId, setSelectedPlanId] = useState<'monthly' | 'semi_annual' | 'yearly' | 'lifetime'>('yearly');
  const [isChecking, setIsChecking] = useState(false);

  if (!currentUser) return null;

  const plans = [
    {
      id: 'monthly' as const,
      name: 'Paket 1 Bulan',
      price: 'Rp10.000',
      period: '/ bulan',
      badge: null,
      desc: '30 Hari Full Akses Seluruh Fitur',
      color: 'border-slate-700',
    },
    {
      id: 'semi_annual' as const,
      name: 'Paket 6 Bulan',
      price: 'Rp35.000',
      period: '/ 6 bln',
      badge: 'Hemat 42%',
      desc: '180 Hari Full Akses (~Rp5.800/bln)',
      color: 'border-indigo-500/40',
    },
    {
      id: 'yearly' as const,
      name: 'Paket 1 Tahun',
      price: 'Rp50.000',
      period: '/ tahun',
      badge: 'Super Hemat 58% 🔥',
      desc: '365 Hari Full Akses (~Rp4.100/bln)',
      color: 'border-violet-500/50',
    },
    {
      id: 'lifetime' as const,
      name: 'Lifetime VIP',
      price: 'Rp100.000',
      period: 'Sekali Bayar',
      badge: 'Best Value 👑',
      desc: 'Akses Penuh Selamanya Tanpa Biaya Bulanan',
      color: 'border-amber-500/60',
    },
  ];

  const handleWhatsAppChat = (planId: typeof selectedPlanId) => {
    const selected = plans.find((p) => p.id === planId) || plans[2];
    const message = `Halo Admin Personal Life OS! 🌟\n\nSaya ingin aktivasi membership:\n\n👤 *Nama:* ${currentUser.name}\n🔑 *Username:* @${currentUser.username}\n🆔 *User ID:* ${currentUser.id}\n📧 *Email:* ${currentUser.email}\n💎 *Paket Pilihan:* ${selected.name} (${selected.price} ${selected.period})\n\nMohon info rekening Bank Transfer / QRIS / E-Wallet untuk aktivasi instan. Terima kasih! 🙏`;
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/6281234567890?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  const handleRefreshStatus = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      window.location.reload();
    }, 800);
  };

  const currentSelected = plans.find((p) => p.id === selectedPlanId) || plans[2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl p-5 md:p-8 shadow-2xl shadow-amber-500/10 space-y-5 my-6">
        
        {/* HEADER & ICON */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/40 rounded-3xl text-amber-400 shadow-xl shadow-amber-500/20">
            <Lock className="w-8 h-8 md:w-9 md:h-9 text-amber-400" />
          </div>

          <div>
            <span className="text-[10px] font-bold px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full uppercase tracking-wider">
              Masa Free Trial 7 Hari Telah Selesai
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mt-1.5">
              Pilih Paket Membership untuk Melanjutkan Akses ✨
            </h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
              Halo <strong className="text-white">{currentUser.name}</strong>, semua paket mendapatkan <strong>100% Full Akses</strong> ke seluruh modul, AI & Bot!
            </p>
          </div>
        </div>

        {/* 🛡️ DATA 100% SAFE ASSURANCE BOX */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-950/40 via-slate-850 to-slate-900 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-300">
              Data & Catatan Anda 100% Aman & Tidak Dihapus!
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Semua riwayat transaksi keuangan, catatan curhat jurnal, program gym, dan to-do list Anda tetap tersimpan utuh di cloud.
            </p>
          </div>
        </div>

        {/* 4 AFFORDABLE PRICING TIERS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plans.map((p) => {
            const isSelected = selectedPlanId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlanId(p.id)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-950/80 via-slate-850 to-slate-900 border-amber-400 ring-2 ring-amber-500/40 shadow-xl'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {p.badge && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-extrabold text-[9px] rounded-full uppercase shadow-sm">
                    {p.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <h4 className="font-bold text-slate-100 text-xs md:text-sm">{p.name}</h4>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </div>

                  <div className="text-base md:text-lg font-extrabold text-amber-300 font-mono">
                    {p.price} <span className="text-[10px] text-slate-400 font-sans">{p.period}</span>
                  </div>

                  <p className="text-[10px] text-slate-300 mt-1">{p.desc}</p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-emerald-400 font-semibold">
                  <span>✓ 100% Full Akses All Fitur</span>
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                    {isSelected ? 'Terpilih ✓' : 'Klik Pilih'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* PRIMARY CTA: WHATSAPP ACTIVATION */}
        <div className="space-y-2">
          <button
            onClick={() => handleWhatsAppChat(selectedPlanId)}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs md:text-sm font-extrabold rounded-2xl shadow-xl shadow-emerald-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Aktivasi via WhatsApp: {currentSelected.name} ({currentSelected.price})</span>
          </button>
          <p className="text-[10px] text-center text-slate-400">
            Aktivasi langsung diproses oleh Admin dalam 1-3 menit setelah konfirmasi.
          </p>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-800 text-xs text-slate-400">
          <button
            onClick={handleRefreshStatus}
            disabled={isChecking}
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors text-[11px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{isChecking ? 'Mengecek status...' : 'Cek Status Ulang'}</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1 hover:text-rose-400 transition-colors text-xs font-semibold text-slate-300 ml-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
