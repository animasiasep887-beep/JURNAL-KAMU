import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Ban, PauseCircle, MessageCircle, LogOut, RefreshCw } from 'lucide-react';

export const AccountBannedGateModal: React.FC = () => {
  const { currentUser, logout, switchUser, users } = useAuth();
  const [isChecking, setIsChecking] = useState(false);

  if (!currentUser) return null;
  if (currentUser.status !== 'banned' && currentUser.status !== 'suspended' && currentUser.status !== 'inactive') {
    return null;
  }

  const isBanned = currentUser.status === 'banned';

  const handleWhatsAppContact = () => {
    const reason = isBanned ? 'banned' : 'dinonaktifkan';
    const message = `Halo Admin Personal Life OS,\n\nAkun saya terdeteksi status: ${reason.toUpperCase()}.\n\n👤 Nama: ${currentUser.name}\n🔑 Username: @${currentUser.username}\n🆔 ID: ${currentUser.id}\n📧 Email: ${currentUser.email}\n\nMohon bantuannya untuk verifikasi/pengaktifan kembali. Terima kasih!`;
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/6281234567890?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  const handleRefresh = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      window.location.reload();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl shadow-rose-500/10 space-y-5 text-center">
        
        <div className="inline-flex p-4 bg-rose-500/20 border border-rose-500/40 rounded-3xl text-rose-400 shadow-xl shadow-rose-500/20 animate-pulse">
          {isBanned ? <Ban className="w-10 h-10" /> : <PauseCircle className="w-10 h-10" />}
        </div>

        <div>
          <span className="text-[10px] font-bold px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full uppercase tracking-wider">
            {isBanned ? 'Akses Akun Diblokir (Banned)' : 'Akun Dinonaktifkan Sementara'}
          </span>
          <h2 className="text-xl font-extrabold text-white tracking-tight mt-2">
            {isBanned ? 'Akun Anda Telah Dibanned' : 'Akun Anda Dinonaktifkan'}
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Halo <strong className="text-white">{currentUser.name}</strong>, akses ke akun Personal Life OS Anda saat ini telah {isBanned ? 'diblokir' : 'dinonaktifkan'} oleh Administrator.
          </p>
        </div>

        <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 text-[11px] text-slate-300 text-left space-y-1">
          <div className="font-bold text-slate-200">Keterangan:</div>
          <p className="text-slate-400">
            {isBanned
              ? 'Akun Anda diblokir dari sistem web dan bot Telegram. Jika Anda merasa ini kesalahan, silakan hubungi Admin.'
              : 'Akun Anda dalam status nonaktif sementara. Hubungi Admin untuk aktivasi ulang akun Anda.'}
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleWhatsAppContact}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hubungi Admin via WhatsApp</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isChecking}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{isChecking ? 'Mengecek status...' : 'Cek Status Akun Lagi'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
          <span className="text-[11px] text-slate-500">Personal Life OS Security</span>

          <button
            onClick={logout}
            className="flex items-center gap-1 hover:text-rose-400 transition-colors text-xs font-semibold ml-auto text-slate-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
