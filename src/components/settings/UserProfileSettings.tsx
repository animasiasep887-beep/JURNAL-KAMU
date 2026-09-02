import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { callGeminiAPI } from '../../utils/aiAnalystEngine';
import {
  User as UserIcon,
  Camera,
  Upload,
  Lock,
  Sparkles,
  Check,
  Image,
  FileText,
  Mail,
  Phone,
  Crown,
  Shield,
  Save,
  Trash2,
  Key,
  Bot,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
];

const BIO_TAG_SUGGESTIONS = [
  '🚀 Focused on Self-Growth',
  '💰 Financial Freedom Journey',
  '🏋️ Gym & Fitness Enthusiast',
  '💻 Software Engineer & Builder',
  '📖 Life Learner & Journaling',
  '🎯 1% Better Everyday',
];

export const UserProfileSettings: React.FC = () => {
  const { currentUser, updateProfile, isAdmin } = useAuth();
  const { aiSettings, updateAISettings } = useData();
  const { showToast } = useNotification();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp || '');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Gemini BYOK AI States
  const [geminiKey, setGeminiKey] = useState(aiSettings?.geminiApiKey || '');
  const [coachPersona, setCoachPersona] = useState(aiSettings?.customCoachPersona || 'Bijak, Empatis, Tegas, dan Solutif');
  const [isTestingAI, setIsTestingAI] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!currentUser) return null;

  const handleTestGemini = async () => {
    if (!geminiKey.trim()) {
      showToast('Masukkan API Key Gemini terlebih dahulu!', 'warning');
      return;
    }

    setIsTestingAI(true);
    setTestResult(null);
    try {
      const reply = await callGeminiAPI(geminiKey.trim(), 'Katakan halo singkat 1 kalimat kepada pengguna Personal Life OS!');
      setTestResult(reply);
      updateAISettings({ geminiApiKey: geminiKey.trim(), isGeminiActive: true, customCoachPersona: coachPersona });
      showToast('🎉 Koneksi Gemini 2.0 Flash Berhasil 100%!', 'success');
    } catch (e: any) {
      setTestResult(`Gagal: ${e.message}`);
      showToast(`⚠️ Gagal menghubungkan ke Gemini: ${e.message}`, 'error');
    } finally {
      setIsTestingAI(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('⚠️ Ukuran foto maksimal 2MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setAvatarUrl(base64);
        showToast('📷 Foto profil siap disimpan!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (url: string) => {
    setAvatarUrl(url);
    showToast('✨ Avatar preset dipilih!');
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    showToast('🗑️ Foto profil direset ke inisial.');
  };

  const handleAddBioTag = (tag: string) => {
    if (!bio.includes(tag)) {
      setBio((prev) => (prev ? `${prev} • ${tag}` : tag));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('⚠️ Nama lengkap tidak boleh kosong!');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl || undefined,
        whatsapp: whatsapp.trim() || undefined,
      });
      updateAISettings({
        geminiApiKey: geminiKey.trim(),
        isGeminiActive: geminiKey.trim().length > 10,
        customCoachPersona: coachPersona.trim(),
      });
      setIsSaving(false);
      showToast('🎉 Profil & Pengaturan Gemini AI berhasil diperbarui!');
    }, 400);
  };

  return (
    <div className="relative overflow-hidden bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-2xl space-y-6">
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold mb-2">
            <UserIcon className="w-3.5 h-3.5" />
            <span>Pengaturan Akun & Identitas</span>
          </div>
          <h3 className="font-black text-slate-100 text-lg md:text-xl tracking-tight">
            Profil Pribadi & Bio
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Perbarui foto profil, nama lengkap, dan ceritakan tentang diri Anda untuk pengalaman personal yang maksimal.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-mono font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>@{currentUser.username}</span>
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Avatar & Photo Upload */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
          <div className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4 text-indigo-400" />
            <span>Foto Profil Pengguna</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar Preview */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-400 p-1 shadow-xl shadow-indigo-600/20">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Foto Profil"
                    className="w-full h-full rounded-[22px] object-cover bg-slate-900"
                  />
                ) : (
                  <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center font-black text-white text-3xl">
                    {name.charAt(0) || currentUser.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Upload trigger overlay button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Ganti Foto dari Galeri / Kamera"
                className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg border-2 border-slate-900 transition-all active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Avatar Controls & Preset Picker */}
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Foto dari File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlField(!showUrlField)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <Image className="w-3.5 h-3.5 inline mr-1" />
                  <span>Gunakan URL Gambar</span>
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                    <span>Hapus Foto</span>
                  </button>
                )}
              </div>

              {/* URL input field if toggled */}
              {showUrlField && (
                <div className="flex gap-2 pt-1 animate-fade-in">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrlInput.trim()) {
                        setAvatarUrl(customUrlInput.trim());
                        setCustomUrlInput('');
                        setShowUrlField(false);
                        showToast('🖼️ URL gambar diterapkan!');
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                  >
                    Terapkan
                  </button>
                </div>
              )}

              {/* Preset Avatar Selection */}
              <div>
                <div className="text-[11px] text-slate-400 mb-1.5">Atau pilih avatar estetik siap pakai:</div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset}
                      alt={`Preset ${idx + 1}`}
                      onClick={() => handleApplyPreset(preset)}
                      className={`w-9 h-9 rounded-xl object-cover cursor-pointer border-2 transition-all hover:scale-110 ${
                        avatarUrl === preset ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Section 2: Name & Locked Username */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Editable Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              Nama Lengkap <span className="text-emerald-400 font-normal">(Bisa Diubah)</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Bintang Mas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-4 py-3 text-slate-100 text-xs font-semibold outline-none transition-colors shadow-inner"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">Nama ini yang akan ditampilkan di header dan laporan AI.</p>
          </div>

          {/* LOCKED Read-Only Username */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
              <span>Username Unik</span>
              <span className="text-rose-400 text-[10px] font-bold flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                <Lock className="w-3 h-3" />
                Terkunci (Permanen)
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={`@${currentUser.username}`}
                disabled
                className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 text-xs font-mono font-bold cursor-not-allowed outline-none select-none opacity-80"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Username digunakan sebagai identitas akun unik & Bot Telegram.</p>
          </div>

        </div>

        {/* Section 3: Bio & Deskripsi Diri */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Deskripsi Diri / Bio (Tentang Dirinya)</span>
            </label>
            <span className="text-[11px] font-mono text-slate-500">{bio.length}/300 Karakter</span>
          </div>

          <textarea
            rows={3}
            maxLength={300}
            placeholder="Tuliskan tentang diri Anda, fokus saat ini, atau tujuan hidup Anda (contoh: Software Engineer | Fokus nabung dana darurat & rutin workout 4x seminggu 🚀)..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 rounded-2xl p-4 text-slate-100 text-xs leading-relaxed outline-none transition-colors shadow-inner"
          />

          {/* Quick Bio Tag Chips */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] text-slate-400">Inspirasi tagline cepat (klik untuk menambahkan):</div>
            <div className="flex flex-wrap gap-1.5">
              {BIO_TAG_SUGGESTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddBioTag(tag)}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-700 hover:border-indigo-500/40 text-[11px] font-medium rounded-xl transition-all active:scale-95 cursor-pointer"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: WhatsApp Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nomor WhatsApp (Untuk Notifikasi & Konfirmasi)</span>
            </label>
            <input
              type="text"
              placeholder="+6281234567890"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-100 text-xs outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Email Terdaftar</span>
            </label>
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-400 text-xs cursor-not-allowed outline-none"
            />
          </div>
        </div>

        {/* Section 5: Google Gemini 2.0 / 1.5 Flash Integration (BYOK) */}
        <div className="bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 border border-indigo-500/30 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <span>Google Gemini AI Engine (BYOK)</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    aiSettings?.isGeminiActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {aiSettings?.isGeminiActive ? 'ONLINE 2.0 FLASH' : 'STANDBY (RULE-BASED)'}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">Hubungkan API Key Gemini gratis untuk AI Life Coach & OCR Struk.</p>
              </div>
            </div>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium self-start sm:self-auto"
            >
              <span>Dapatkan API Key Gratis di Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Google Gemini API Key</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTestGemini}
                  disabled={isTestingAI}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
                >
                  {isTestingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                  <span>Test Koneksi</span>
                </button>
              </div>
            </div>

            {testResult && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1 animate-fade-in">
                <span className="font-bold text-indigo-300 block">Respon Live Gemini AI:</span>
                <p className="text-slate-300 italic">"{testResult}"</p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Karakter / Persona AI Life Coach</label>
              <input
                type="text"
                value={coachPersona}
                onChange={(e) => setCoachPersona(e.target.value)}
                placeholder="Contoh: Bijak, Berorientasi pada Disiplin, Hangat dan Memotivasi"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-black text-xs rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan Perubahan...' : 'Simpan Profil & Bio'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
