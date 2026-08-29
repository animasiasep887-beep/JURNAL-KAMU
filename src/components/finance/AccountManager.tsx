import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatIDR } from '../../utils/formatters';
import { Wallet, Plus, Building2, Smartphone, Landmark, PiggyBank, TrendingUp, Briefcase } from 'lucide-react';

export const AccountManager: React.FC = () => {
  const { accounts, addAccount } = useData();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'cash' | 'bank' | 'ewallet' | 'savings' | 'investment' | 'business'>('bank');
  const [balance, setBalance] = useState('');
  const [accNum, setAccNum] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addAccount({
      name,
      type,
      balance: parseFloat(balance) || 0,
      accountNumber: accNum || undefined,
      isActive: true,
    });
    setShowModal(false);
    setName('');
    setBalance('');
    setAccNum('');
  };

  const getAccountIcon = (t: string) => {
    switch (t) {
      case 'cash': return Wallet;
      case 'bank': return Building2;
      case 'ewallet': return Smartphone;
      case 'savings': return PiggyBank;
      case 'investment': return TrendingUp;
      default: return Briefcase;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-400" />
            <span>Akun & Tempat Menyimpan Uang</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Kelola cash, bank, e-wallet, tabungan, dan dana investasi secara terpusat.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const Icon = getAccountIcon(acc.type);
          return (
            <div key={acc.id} className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-sm">{acc.name}</div>
                    <div className="text-[11px] text-slate-400 capitalize">{acc.type} {acc.accountNumber ? `• ${acc.accountNumber}` : ''}</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-baseline justify-between">
                <span className="text-[11px] text-slate-400">Saldo saat ini:</span>
                <span className="font-mono font-extrabold text-base text-slate-100">{formatIDR(acc.balance)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-slate-100 text-lg mb-4">Tambah Akun Keuangan Baru</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Akun / Bank</label>
                <input
                  type="text"
                  placeholder="Contoh: Bank BCA Tabungan, GoPay Utama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Jenis Akun</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="cash">Tunai / Cash</option>
                  <option value="bank">Bank Account</option>
                  <option value="ewallet">E-Wallet (GoPay, OVO, Dana)</option>
                  <option value="savings">Tabungan Khusus</option>
                  <option value="investment">Dana Investasi</option>
                  <option value="business">Dana Bisnis</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Saldo Awal (Rp)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-slate-400">Batal</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
