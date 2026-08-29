import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { User, MembershipPlanId, AccountStatus } from '../../types';
import {
  Search,
  Filter,
  Shield,
  Crown,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Eye,
  Zap,
  Flame,
  Rocket,
  Package,
  Ban,
  PauseCircle,
  ShieldAlert,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const AdminUserList: React.FC<{ onSelectUser: (u: User) => void }> = ({ onSelectUser }) => {
  const { users, adminUpdateUserStatus, currentUser: loggedInAdmin } = useAuth();
  const { adminActivateMembership, addAuditLog } = useData();
  const { showToast } = useNotification();

  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = users.filter((u) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const isExpired = u.role !== 'admin' && u.membershipExpiryDate && todayStr > u.membershipExpiryDate;

    if (statusFilter !== 'all') {
      if (statusFilter === 'banned' && u.status !== 'banned') return false;
      if (statusFilter === 'suspended' && u.status !== 'suspended' && u.status !== 'inactive') return false;
      if (statusFilter === 'active' && (u.status === 'banned' || u.status === 'suspended' || u.status === 'inactive' || isExpired)) return false;
      if (statusFilter === 'expired' && !isExpired) return false;
    }

    if (planFilter !== 'all') {
      if (planFilter === 'lifetime' && u.membershipPlanId !== 'lifetime' && u.membershipPlanId !== 'custom') return false;
      if (planFilter === 'yearly' && u.membershipPlanId !== 'yearly') return false;
      if (planFilter === 'semi_annual' && u.membershipPlanId !== 'semi_annual') return false;
      if (planFilter === 'monthly' && u.membershipPlanId !== 'monthly' && u.membershipPlanId !== 'basic') return false;
      if (planFilter === 'free' && u.membershipPlanId !== 'free') return false;
    }

    if (search) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.whatsapp && u.whatsapp.includes(q))
      );
    }
    return true;
  });

  const handleToggleStatus = (user: User, newStatus: AccountStatus, label: string) => {
    adminUpdateUserStatus(user.id, newStatus);
    addAuditLog(`Admin Changed User Status`, `Changed @${user.username} status to ${newStatus}`);
    showToast(`Status akun @${user.username} berhasil diubah ke: ${label}!`);
  };

  const getPlanBadge = (planId: string) => {
    switch (planId) {
      case 'lifetime':
      case 'custom':
        return { label: 'Lifetime VIP (100k)', icon: Crown, style: 'bg-amber-500/10 text-amber-300 border-amber-500/30 font-extrabold' };
      case 'yearly':
        return { label: 'Paket 1 Tahun (50k)', icon: Flame, style: 'bg-violet-500/10 text-violet-300 border-violet-500/30 font-bold' };
      case 'semi_annual':
        return { label: 'Paket 6 Bulan (35k)', icon: Rocket, style: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 font-bold' };
      case 'monthly':
      case 'basic':
        return { label: 'Paket 1 Bulan (10k)', icon: Package, style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 font-semibold' };
      case 'free':
      default:
        return { label: 'Free Trial (7 Hari)', icon: Clock, style: 'bg-slate-800 text-slate-300 border-slate-700 font-medium' };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>Manajemen Pengguna SaaS & Moderasi (User List)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Cari, filter, kontrol status aktivasi paket (10k, 35k, 50k, 100k), dan Ban / Nonaktifkan akun pengguna.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, username, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs pl-9 pr-4 py-2 rounded-xl outline-none w-48 sm:w-56"
            />
          </div>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl outline-none"
          >
            <option value="all">Semua Paket</option>
            <option value="lifetime">Lifetime VIP (100k)</option>
            <option value="yearly">Paket 1 Tahun (50k)</option>
            <option value="semi_annual">Paket 6 Bulan (35k)</option>
            <option value="monthly">Paket 1 Bulan (10k)</option>
            <option value="free">Free Trial (7 Hari)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="active">🟢 Status Aktif</option>
            <option value="banned">🚫 Banned (Diblokir)</option>
            <option value="suspended">⏸️ Nonaktif (Suspended)</option>
            <option value="expired">🔴 Trial Expired</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400">
              <th className="py-3 px-4">Pengguna</th>
              <th className="py-3 px-3">Plan Membership</th>
              <th className="py-3 px-3">Status Akun</th>
              <th className="py-3 px-3">Expiry Date</th>
              <th className="py-3 px-3">Moderasi (Ban/Nonaktif)</th>
              <th className="py-3 px-4 text-right">Aktivasi Paket</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const todayStr = new Date().toISOString().split('T')[0];
              const isExpired = u.role !== 'admin' && u.membershipExpiryDate && todayStr > u.membershipExpiryDate;
              const isFreeTrial = u.membershipPlanId === 'free';
              const badge = getPlanBadge(u.membershipPlanId);
              const BadgeIcon = badge.icon;
              const isSelf = loggedInAdmin?.id === u.id;

              return (
                <tr key={u.id} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors">
                  {/* User info */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-xs text-slate-200">{u.name}</div>
                    <div className="text-[11px] text-slate-400">@{u.username} • {u.email}</div>
                  </td>

                  {/* Plan Badge */}
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${badge.style}`}>
                      <BadgeIcon className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3">
                    {u.status === 'banned' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-md">
                        <Ban className="w-3.5 h-3.5" />
                        Banned (Diblokir)
                      </span>
                    ) : u.status === 'suspended' || u.status === 'inactive' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                        <PauseCircle className="w-3.5 h-3.5" />
                        Nonaktif
                      </span>
                    ) : isExpired ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                        <XCircle className="w-3.5 h-3.5" />
                        Trial Expired
                      </span>
                    ) : isFreeTrial ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        Trial Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aktif
                      </span>
                    )}
                  </td>

                  {/* Expiry Date */}
                  <td className="py-3 px-3 font-mono text-xs text-slate-300">
                    {u.membershipExpiryDate}
                  </td>

                  {/* Moderation Actions (Ban / Nonaktifkan / Aktifkan) */}
                  <td className="py-3 px-3 space-x-1 whitespace-nowrap">
                    {!isSelf && (
                      <>
                        {u.status === 'banned' ? (
                          <button
                            onClick={() => handleToggleStatus(u, 'active', 'Aktif (Unban)')}
                            title="Buka Blokir (Unban)"
                            className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-lg transition-colors"
                          >
                            <CheckCircle2 className="w-3 h-3 inline mr-1" />
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(u, 'banned', 'Banned (Diblokir)')}
                            title="Ban Akun Pengguna"
                            className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[10px] font-bold rounded-lg transition-colors"
                          >
                            <Ban className="w-3 h-3 inline mr-1" />
                            Ban
                          </button>
                        )}

                        {u.status === 'suspended' ? (
                          <button
                            onClick={() => handleToggleStatus(u, 'active', 'Aktif')}
                            title="Aktifkan Akun"
                            className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-lg transition-colors"
                          >
                            Aktifkan
                          </button>
                        ) : u.status !== 'banned' ? (
                          <button
                            onClick={() => handleToggleStatus(u, 'suspended', 'Nonaktif')}
                            title="Nonaktifkan Akun Sementara"
                            className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-semibold rounded-lg transition-colors"
                          >
                            Nonaktif
                          </button>
                        ) : null}
                      </>
                    )}
                  </td>

                  {/* Membership Activation Actions */}
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {/* Activate Lifetime VIP */}
                    <button
                      onClick={() => {
                        adminActivateMembership(u.id, 'lifetime', 36500, true);
                        showToast(`👑 Lifetime VIP (100k) diaktifkan untuk @${u.username}!`);
                      }}
                      title="Aktifkan Lifetime VIP (Rp100k - Selamanya)"
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 text-[11px] font-extrabold rounded-lg transition-colors shadow-sm"
                    >
                      +Lifetime (100k)
                    </button>

                    {/* Activate 1 Tahun */}
                    <button
                      onClick={() => {
                        adminActivateMembership(u.id, 'yearly', 365, true);
                        showToast(`🔥 Paket 1 Tahun (50k) diaktifkan untuk @${u.username}!`);
                      }}
                      title="Aktifkan 1 Tahun (+365 Hari - Rp50k)"
                      className="px-2.5 py-1 bg-violet-500/20 hover:bg-violet-500/40 text-violet-300 border border-violet-500/30 text-[11px] font-bold rounded-lg transition-colors"
                    >
                      +1 Thn (50k)
                    </button>

                    {/* Activate 6 Bulan */}
                    <button
                      onClick={() => {
                        adminActivateMembership(u.id, 'semi_annual', 180, true);
                        showToast(`🚀 Paket 6 Bulan (35k) diaktifkan untuk @${u.username}!`);
                      }}
                      title="Aktifkan 6 Bulan (+180 Hari - Rp35k)"
                      className="px-2.5 py-1 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold rounded-lg transition-colors"
                    >
                      +6 Bln (35k)
                    </button>

                    {/* Activate 1 Bulan */}
                    <button
                      onClick={() => {
                        adminActivateMembership(u.id, 'monthly', 30, true);
                        showToast(`🟢 Paket 1 Bulan (10k) diaktifkan untuk @${u.username}!`);
                      }}
                      title="Aktifkan 1 Bulan (+30 Hari - Rp10k)"
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold rounded-lg transition-colors"
                    >
                      +1 Bln (10k)
                    </button>

                    {/* Extend Trial */}
                    <button
                      onClick={() => {
                        adminActivateMembership(u.id, 'free', 7, true);
                        showToast(`⏳ Trial 7 hari diperpanjang untuk @${u.username}!`);
                      }}
                      title="Perpanjang Trial (+7 Hari)"
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-semibold rounded-lg transition-colors"
                    >
                      +Trial (7h)
                    </button>

                    <button
                      onClick={() => onSelectUser(u)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-lg"
                      title="Lihat Detail & Moderasi"
                    >
                      <Eye className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
