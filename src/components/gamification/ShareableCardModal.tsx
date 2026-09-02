import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { calculateJournalStreak, formatIDR } from '../../utils/formatters';
import { Share2, Download, Sparkles, X, Flame, Trophy, CheckCircle, Shield } from 'lucide-react';

interface ShareableCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareableCardModal: React.FC<ShareableCardModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { journals, tasks, workouts } = useData();

  const [aspectRatio, setAspectRatio] = useState<'story' | 'square'>('story');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen || !currentUser) return null;

  const streak = calculateJournalStreak(journals);
  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const workoutSessions = workouts.length;

  // Draw card on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = aspectRatio === 'story' ? 1080 : 1080;
    const height = aspectRatio === 'story' ? 1920 : 1080;

    canvas.width = width;
    canvas.height = height;

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#1e1b4b');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Glowing Orbs
    const orb1 = ctx.createRadialGradient(200, 300, 10, 200, 300, 400);
    orb1.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
    orb1.addColorStop(1, 'rgba(99, 102, 241, 0)');
    ctx.fillStyle = orb1;
    ctx.fillRect(0, 0, width, height);

    const orb2 = ctx.createRadialGradient(850, 1400, 10, 850, 1400, 500);
    orb2.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
    orb2.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = orb2;
    ctx.fillRect(0, 0, width, height);

    // 2. Header Branding
    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('✨ PERSONAL LIFE OS • JURNAL KAMU', 100, 160);

    // 3. User Info Header
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 68px sans-serif';
    ctx.fillText(currentUser.name, 100, 260);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 34px sans-serif';
    ctx.fillText('Mastering Life, Discipline & Mindset', 100, 320);

    // 4. Streak Highlight Hero Box
    const boxY = aspectRatio === 'story' ? 440 : 400;
    const boxH = aspectRatio === 'story' ? 460 : 320;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(100, boxY, width - 200, boxH, 40);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 130px sans-serif';
    ctx.fillText(`🔥 ${streak} HARI`, 160, boxY + 180);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('JOURNALING & HABIT STREAK', 160, boxY + 260);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '400 32px sans-serif';
    ctx.fillText('Konsistensi tanpa henti membangun kebiasaan pemenang.', 160, boxY + 340);

    // 5. Metric Stat Cards
    const statsY = aspectRatio === 'story' ? 960 : 760;
    const cardW = (width - 240) / 2;
    const cardH = 220;

    // Stat 1: Tasks Done
    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(100, statsY, cardW, cardH, 30);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('TASKS SELESAI', 140, statsY + 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 70px sans-serif';
    ctx.fillText(`${doneTasks} Tugas`, 140, statsY + 160);

    // Stat 2: Gym Sessions
    ctx.beginPath();
    ctx.roundRect(100 + cardW + 40, statsY, cardW, cardH, 30);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('GYM & FITNESS', 140 + cardW + 40, statsY + 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 70px sans-serif';
    ctx.fillText(`${workoutSessions} Sesi`, 140 + cardW + 40, statsY + 160);

    // 6. Motivation Quote (Story Mode Only)
    if (aspectRatio === 'story') {
      const quoteY = 1260;
      ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.beginPath();
      ctx.roundRect(100, quoteY, width - 200, 320, 35);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#c7d2fe';
      ctx.font = 'italic 36px sans-serif';
      ctx.fillText('"Disiplin adalah jembatan antara tujuan', 160, quoteY + 100);
      ctx.fillText('dan pencapaian nyata setiap hari."', 160, quoteY + 160);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('— Level: Master Mindset Architect', 160, quoteY + 240);
    }

    // 7. Footer
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`Generated by Personal Life OS • ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}`, 100, height - 100);
  }, [aspectRatio, currentUser, streak, doneTasks, workoutSessions]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `LifeOS-Streak-${currentUser.username}-${aspectRatio}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 text-white flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Shareable Story Card Generator</h3>
              <p className="text-xs text-slate-400">Bagikan pencapaian & streak konsistensi ke Instagram / WhatsApp.</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-5 space-y-4">
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setAspectRatio('story')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                aspectRatio === 'story' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              📱 9:16 Story (Instagram / WA)
            </button>
            <button
              type="button"
              onClick={() => setAspectRatio('square')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                aspectRatio === 'square' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              🖼️ 1:1 Square Post
            </button>
          </div>

          {/* Canvas Preview Container */}
          <div className="flex justify-center bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-h-96 w-auto rounded-xl shadow-2xl border border-slate-800 object-contain"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-slate-800 bg-slate-900/50">
          <span className="text-xs text-slate-400">Format PNG Kualitas Tinggi (1080p)</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-amber-600 hover:from-indigo-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Gambar Story</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
