import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, KeyRound, Shield, Sparkles } from 'lucide-react';

export const PrivacyModeLock: React.FC = () => {
  const { isPinLocked, unlockScreen, currentUser } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isPinLocked) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockScreen(pin);
    if (!success) {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-8 shadow-2xl text-center space-y-6 animate-scale-in">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="font-extrabold text-slate-100 text-xl">Layar Terkunci (Privacy Mode)</h2>
          <p className="text-xs text-slate-400 mt-1">Masukkan PIN 4 digit untuk membuka Personal Life OS milik @{currentUser?.username}.</p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            maxLength={4}
            placeholder="• • • •"
            value={pin}
            onChange={(e) => {
              setError(false);
              setPin(e.target.value);
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-slate-100 text-center font-mono font-extrabold text-2xl tracking-widest outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {error && <div className="text-xs text-rose-400 font-semibold">PIN salah! Coba default PIN (1234).</div>}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-indigo-600/30"
          >
            Buka Kunci Layar
          </button>
        </form>
      </div>
    </div>
  );
};
