import React from 'react';
import { User, AccountStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import {
  X,
  Crown,
  Shield,
  Phone,
  Mail,
  Ban,
  PauseCircle,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Calendar,
} from 'lucide-react';

interface AdminUserDetailModalProps {
  user: User | null;
  onClose: () => void;
}

export const AdminUserDetailModal: React.FC<AdminUserDetailModalProps> = ({ user, onClose }) => {
  const { adminUpdateUserStatus, adminDeleteUser, currentUser: loggedInAdmin } = useAuth();
  const { addAuditLog } = useData();
  const { showToast } = useNotification();

  if (!user) return null;

  const isSelf = loggedInAdmin?.id === user.id;

  const handleStatusChange = (status: AccountStatus, label: string) => {
    adminUpdateUserStatus(user.id, status);
    addAuditLog(`Admin Changed User Status`, `Changed @${user.username} status to ${status}`);
    showToast(`Status user @${user.username} berhasil diubah ke: ${label}!`);
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun @${user.username} secara permanen?`)) {
      adminDeleteUser(user.id);
      addAuditLog(`Admin Deleted User`, `Deleted user @${user.username}`);
      showToast(`Akun @${user.username} berhasil dihapus dari sistem.`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">{user.name}</h3>
              <div className="text-xs text-slate-400">@{user.username} • ID: <span className="font-mono">{user.id}</span></div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Details Grid */}
        <div className="space-y-2.5 text-xs text-slate-300 bg-slate-850 p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email:</span>
            <span className="font-semibold text-slate-200">{user.email}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> WhatsApp:</span>
            <span className="font-semibold text-slate-200">{user.whatsapp || 'Tidak diisi'}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1.5"><Crown className="w-3.5 h-3.5" /> Plan Membership:</span>
            <span className="font-bold text-amber-300 uppercase font-mono">{user.membershipPlanId}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Masa Berlaku:</span>
            <span className="font-mono font-bold text-indigo-300">{user.membershipExpiryDate}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Role:</span>
            <span className="font-semibold text-emerald-400 capitalize">{user.role}</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-slate-400">Status Akun Saat Ini:</span>
            <span className={`font-bold uppercase px-2 py-0.5 rounded-md text-[10px] ${
              user.status === 'banned'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : user.status === 'suspended' || user.status === 'inactive'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {user.status}
            </span>
          </div>
        </div>

        {/* ADMIN MODERATION CONTROLS */}
        {!isSelf && (
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-slate-300">Kontrol Moderasi Akun:</div>
            
            <div className="grid grid-cols-3 gap-2">
              {/* Activate / Unban */}
              <button
                onClick={() => handleStatusChange('active', 'Aktif (Normal)')}
                className="py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aktifkan</span>
              </button>

              {/* Suspend / Nonaktifkan */}
              <button
                onClick={() => handleStatusChange('suspended', 'Nonaktif (Suspended)')}
                className="py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <PauseCircle className="w-3.5 h-3.5" />
                <span>Nonaktifkan</span>
              </button>

              {/* Ban Akun */}
              <button
                onClick={() => handleStatusChange('banned', 'Banned (Diblokir)')}
                className="py-2 px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Ban Akun</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={handleDelete}
                className="w-full py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Akun Pengguna Secara Permanen</span>
              </button>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors">
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
