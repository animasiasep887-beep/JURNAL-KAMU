import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Apple, Sparkles, X, CheckCircle2, ShieldCheck, Share, PlusSquare, ArrowRight, Zap } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynth';

interface PWAInstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallPromptModal: React.FC<PWAInstallPromptModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');
  const [isInstalledSuccess, setIsInstalledSuccess] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);
    if (isIosDevice) {
      setActiveTab('ios');
    }

    // Detect standalone PWA mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(Boolean(isStandaloneMode));

    // Listen for beforeinstallprompt on Android / Chromium
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPWAInstallPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    audioSynth.playClick(0.08);
    const promptEvent = deferredPrompt || (window as any).deferredPWAInstallPrompt;

    if (promptEvent) {
      promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalledSuccess(true);
        audioSynth.playSuccess(0.15);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setActiveTab('ios');
    } else {
      // Fallback for Android Chrome
      alert('Untuk menginstall di Android: Buka menu titik tiga (⋮) di pojok kanan atas browser, lalu pilih "Install Aplikasi" atau "Tambahkan ke Layar Utama".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Top App Store Style Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/40 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <img
              src="/logo.png"
              alt="Personal Life OS App Logo"
              className="w-16 h-16 rounded-2xl object-cover shadow-xl shadow-indigo-600/40 ring-1 ring-white/20 shrink-0"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Personal Life OS</h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  OFFICIAL APP
                </span>
              </div>
              <p className="text-xs text-slate-300">Executive Finance, Daily Journal, Gym & AI Partner</p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                <span className="text-amber-400 font-bold">★ 5.0 (PWA App)</span>
                <span>•</span>
                <span>Ukuran: &lt; 2 MB</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Offline Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Device Switcher Tabs */}
        <div className="p-5 space-y-5">
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('android')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'android'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Android / Play Store Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ios')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'ios'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>iOS / iPhone & iPad</span>
            </button>
          </div>

          {/* TAB 1: ANDROID GUIDE & 1-CLICK INSTALL */}
          {activeTab === 'android' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Instalasi Instan 1-Klik</h4>
                    <p className="text-[11px] text-slate-400">Pasang langsung ke layar utama Android Anda seperti aplikasi Play Store.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/30 transition-all shrink-0 cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>
              </div>

              {/* Step by step Android Guide */}
              <div className="space-y-2.5 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Panduan Langkah Android:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] flex items-center justify-center">1</span>
                    <strong className="text-slate-200 block">Buka di Chrome</strong>
                    <p className="text-[11px] text-slate-400">Buka link web di Google Chrome Android.</p>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] flex items-center justify-center">2</span>
                    <strong className="text-slate-200 block">Klik Install App</strong>
                    <p className="text-[11px] text-slate-400">Tekan tombol Install di atas atau banner otomatis.</p>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] flex items-center justify-center">3</span>
                    <strong className="text-slate-200 block">Buka dari HP</strong>
                    <p className="text-[11px] text-slate-400">Ikon aplikasi Life OS langsung siap digunakan.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: iOS / IPHONE / IPAD GUIDE */}
          {activeTab === 'ios' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2.5 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Panduan 3 Langkah iPhone / Safari:</span>
                
                <div className="space-y-2">
                  <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-indigo-500/30 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </div>
                    <div>
                      <strong className="text-white flex items-center gap-1.5">
                        <span>Tekan Tombol Bagikan / Share</span>
                        <Share className="w-4 h-4 text-sky-400" />
                      </strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Di browser Safari iPhone Anda, klik ikon <strong>Share (persegi dengan panah ke atas)</strong> di bagian bawah layar.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-indigo-500/30 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </div>
                    <div>
                      <strong className="text-white flex items-center gap-1.5">
                        <span>Pilih "Add to Home Screen"</span>
                        <PlusSquare className="w-4 h-4 text-indigo-400" />
                      </strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Gulir ke bawah pada menu pop-up, lalu pilih opsi <strong>"Add to Home Screen"</strong> (atau <em>Tambahkan ke Layar Utama</em>).
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-indigo-500/30 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </div>
                    <div>
                      <strong className="text-white flex items-center gap-1.5">
                        <span>Tekan "Add" di Pojok Kanan Atas</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Tekan <strong>"Add" / "Tambah"</strong>. Selesai! Aplikasi Personal Life OS kini terpasang di iPhone Anda dengan tampilan layar penuh native tanpa bilah browser.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Value Advantages Badge List */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Akses Cepat dari Home Screen</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bebas Kuota & Super Ringan</span>
            </span>
            <span className="flex items-center gap-1.5 text-purple-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Tampilan Layar Penuh (No Browser Bar)</span>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
