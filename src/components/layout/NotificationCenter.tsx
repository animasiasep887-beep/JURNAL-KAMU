import React, { useState } from 'react';
import { X, Bell, AlertTriangle, Dumbbell, Wallet, CheckCircle, Award, Sparkles, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { audioSynth } from '../../utils/audioSynth';
import { requestNotificationPermission, sendLocalNotification } from '../../utils/pwaNotification';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { budgets, transactions, workouts, achievements } = useData();
  const { showToast } = useNotification();
  const [hasPermission, setHasPermission] = useState<boolean>(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  if (!isOpen) return null;

  // Generate dynamic system alerts
  const todayTxs = transactions.filter((t) => t.type === 'expense');
  const todaySpent = todayTxs.reduce((sum, t) => sum + t.amount, 0);

  const handleEnableNotification = async () => {
    audioSynth.playClick();
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      audioSynth.playSuccess(0.15);
      showToast('🎉 Izin notifikasi native web berhasil diaktifkan!');
      sendLocalNotification('🔔 Personal Life OS Terhubung!', {
        body: 'Notifikasi sistem dan pengingat AI aktif. Anda akan menerima reminder streak harian & peringatan budget.',
      });
    } else {
      showToast('Izin notifikasi tidak diberikan atau ditolak browser.', 'warning');
    }
  };

  const handleSendTestNotification = () => {
    audioSynth.playClick();
    sendLocalNotification('✨ Pengingat Jurnal & Habit Siang', {
      body: 'Waktunya istirahat sejenak! Jangan lupa catat pengeluaran makan siang dan minum air 500ml bro.',
    });
    showToast('Notifikasi tes berhasil dikirim!');
  };

  const alerts = [
    {
      id: 'n-1',
      icon: AlertTriangle,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: 'Peringatan Budget Makanan',
      message: 'Pengeluaran makanan telah mencapai 75% dari budget bulanan.',
      time: '10 menit yang lalu',
    },
    {
      id: 'n-2',
      icon: Dumbbell,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      title: 'Jadwal Gym Hari Ini',
      message: 'Jadwal latihan Chest + Triceps jam 17:00 WIB. Jangan lupa pemanasan!',
      time: '1 jam yang lalu',
    },
    {
      id: 'n-3',
      icon: Award,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: 'Achievement Unlocked!',
      message: '🏆 14 Day Journal Streak! Selamat atas konsistensi Anda.',
      time: 'Hari ini 08:00 WIB',
    },
    {
      id: 'n-4',
      icon: Wallet,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      title: 'Telegram Sync Status',
      message: `Total pengeluaran tercatat hari ini: Rp${todaySpent.toLocaleString('id-ID')}`,
      time: 'Real-time',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col shadow-2xl animate-slide-left space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-100 text-base">Pusat Notifikasi & AI Alerts</h2>
              <span className="text-[10px] text-slate-400">Peringatan Real-Time & Rekomendasi</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PWA Native Notification Prompt Card */}
        <div className="p-4 bg-gradient-to-r from-indigo-950/50 via-purple-950/40 to-slate-900 border border-indigo-500/40 rounded-2xl space-y-2.5 shadow-md">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white">Notifikasi Native Browser / HP (PWA)</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              hasPermission ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {hasPermission ? 'AKTIF' : 'NONAKTIF'}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Aktifkan agar Life OS dapat memunculkan notifikasi langsung di layar HP/Desktop saat AI memberi insight atau pengingat streak jurnal.
          </p>
          <div className="flex gap-2 pt-1">
            {!hasPermission ? (
              <button
                type="button"
                onClick={handleEnableNotification}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                🔔 Izinkan Notifikasi Sistem
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendTestNotification}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-bold text-xs rounded-xl border border-indigo-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Notifikasi Tes</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Alerts List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {alerts.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className={`p-4 rounded-2xl border ${item.color} flex items-start gap-3 transition-all hover:scale-[1.01]`}>
                <div className="p-2 rounded-xl bg-slate-900/60">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-200 text-xs">{item.title}</h3>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Telegram Bot & PWA Live</span>
          </span>
          <button onClick={onClose} className="text-indigo-400 hover:underline font-semibold cursor-pointer">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
