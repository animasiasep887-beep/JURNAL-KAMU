import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Users, Crown, Send, ShieldAlert, Activity, CheckCircle, Clock } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users } = useAuth();
  const { telegram, auditLogs } = useData();

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const premiumUsers = users.filter((u) => u.membershipPlanId === 'premium').length;
  const basicUsers = users.filter((u) => u.membershipPlanId === 'basic').length;
  const freeUsers = users.filter((u) => u.membershipPlanId === 'free').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="font-extrabold text-slate-100 text-xl">Admin SaaS Operating Panel</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Kelola seluruh pengguna, aktivasi WhatsApp membership, bot Telegram, dan kesehatan sistem.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          System Healthy
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Total Pengguna SaaS</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-100 mt-2">{totalUsers}</div>
          <div className="text-[11px] text-emerald-400 mt-2">{activeUsers} Pengguna Aktif</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Active Users Now</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">12</div>
          <div className="text-[11px] text-slate-400 mt-2">Aktivitas dalam 5 menit terakhir</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Membership Premium</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-300 mt-2">{premiumUsers}</div>
          <div className="text-[11px] text-slate-400 mt-2">{basicUsers} Basic • {freeUsers} Free</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Telegram Connected</span>
            <Send className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-sky-400 mt-2">870</div>
          <div className="text-[11px] text-emerald-400 mt-2">Delivery Rate 99.4%</div>
        </div>
      </div>
    </div>
  );
};
