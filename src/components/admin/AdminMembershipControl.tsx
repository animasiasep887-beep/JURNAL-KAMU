import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { MembershipPlanId } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { Crown, CheckCircle2, Ticket, ShieldAlert } from 'lucide-react';

export const AdminMembershipControl: React.FC = () => {
  const { users } = useAuth();
  const { adminActivateMembership, adminCreateCoupon, coupons, auditLogs } = useData();
  const { showToast } = useNotification();

  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || '');
  const [planId, setPlanId] = useState<MembershipPlanId>('monthly');
  const [durationDays, setDurationDays] = useState(30);

  const handlePlanChange = (pId: MembershipPlanId) => {
    setPlanId(pId);
    if (pId === 'monthly') setDurationDays(30);
    else if (pId === 'semi_annual') setDurationDays(180);
    else if (pId === 'yearly') setDurationDays(365);
    else if (pId === 'lifetime') setDurationDays(36500);
    else if (pId === 'free') setDurationDays(7);
  };

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(30);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    adminActivateMembership(selectedUserId, planId, durationDays, true);
    const u = users.find((x) => x.id === selectedUserId);
    showToast(`Membership ${planId.toUpperCase()} (+${durationDays === 36500 ? 'Lifetime' : `${durationDays} Hari`}) berhasil diaktifkan untuk ${u?.name}!`);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    adminCreateCoupon(couponCode, couponDiscount, 7);
    showToast(`Kupon promo ${couponCode.toUpperCase()} berhasil dibuat!`);
    setCouponCode('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span>Aktivasi Membership Manual (WhatsApp Flow) & Kupon</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Gunakan form ini untuk mengaktifkan paket pembayaran manual dari WhatsApp.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Aktivasi */}
        <form onSubmit={handleActivate} className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-slate-200">Aktivasi / Perpanjang Membership User Sesuai Paket</div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Pilih Pengguna</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs px-3 py-2.5 rounded-xl outline-none"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} (@{u.username}) — Plan: {u.membershipPlanId}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Paket Membership</label>
            <select
              value={planId}
              onChange={(e) => handlePlanChange(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs px-3 py-2.5 rounded-xl outline-none"
            >
              <option value="monthly">Paket 1 Bulan (Rp10k - 30 Hari)</option>
              <option value="semi_annual">Paket 6 Bulan (Rp35k - 180 Hari)</option>
              <option value="yearly">Paket 1 Tahun (Rp50k - 365 Hari)</option>
              <option value="lifetime">Lifetime VIP (Rp100k - Selamanya)</option>
              <option value="free">Free Trial 7 Hari</option>
              <option value="custom">Custom Plan Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Durasi Tambahan (Hari)</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[7, 30, 180, 365, 36500].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDurationDays(d)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    durationDays === d ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  {d === 36500 ? 'Lifetime' : `+${d}h`}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-indigo-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-amber-600/20"
          >
            Aktifkan / Extend Membership
          </button>
        </form>

        {/* Form Kupon */}
        <form onSubmit={handleCreateCoupon} className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-slate-200">Buat Kode Kupon / Promo</div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Kode Kupon</label>
            <input
              type="text"
              placeholder="Contoh: PROMO30"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs px-3 py-2.5 rounded-xl outline-none uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Diskon (%)</label>
            <input
              type="number"
              value={couponDiscount}
              onChange={(e) => setCouponDiscount(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs px-3 py-2.5 rounded-xl outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/30"
          >
            Buat Kupon Baru
          </button>

          <div className="pt-2 text-xs text-slate-400">
            Kupon Aktif: {coupons.map((c) => `${c.code} (${c.discountPercentage}%)`).join(', ')}
          </div>
        </form>
      </div>

      {/* Audit Logs */}
      <div className="space-y-2 pt-4 border-t border-slate-800">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Log Tindakan Admin</div>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="text-[11px] bg-slate-800/30 p-2 rounded-xl flex justify-between text-slate-300">
              <span><strong>{log.adminName}</strong>: {log.action} ({log.metadata})</span>
              <span className="font-mono text-slate-500">{log.timestamp.substring(0, 10)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
