import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatIDR } from '../../utils/formatters';

export const AudioDailyBriefingButton: React.FC = () => {
  const { currentUser } = useAuth();
  const { transactions, tasks, journals } = useData();

  const [isPlaying, setIsPlaying] = useState(false);
  const [synthSupported, setSynthSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSynthSupported(false);
    }
  }, []);

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const playBriefing = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      stopAudio();
      return;
    }

    window.speechSynthesis.cancel();

    const hours = new Date().getHours();
    const timeGreeting = hours < 11 ? 'Selamat pagi' : hours < 15 ? 'Selamat siang' : hours < 18 ? 'Selamat sore' : 'Selamat malam';
    const pendingTasks = tasks.filter((t) => t.status !== 'done').length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const totalTransactionsToday = transactions.length;

    const briefingText = `${timeGreeting}, ${currentUser?.name || 'Kawan'}. Selamat datang di Personal Life O S. Hari ini kamu memiliki ${pendingTasks} tugas yang menunggu diselesaikan, dan ${completedTasks} tugas telah tuntas. Terpantau ada ${totalTransactionsToday} catatan transaksi. Tetap konsisten, jaga fokus, dan raih kemenangan kecil setiap hari. Semangat beraktivitas!`;

    const utterance = new SpeechSynthesisUtterance(briefingText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!synthSupported) return null;

  return (
    <button
      type="button"
      onClick={playBriefing}
      title={isPlaying ? 'Hentikan Audio Briefing' : 'Dengarkan Audio Briefing Pagi (AI)'}
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
        isPlaying
          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
          : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-200 border border-indigo-500/30'
      }`}
    >
      {isPlaying ? (
        <>
          <Radio className="w-3.5 h-3.5 text-rose-400 animate-spin" />
          <span>Hentikan Briefing</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Dengarkan Briefing AI</span>
        </>
      )}
    </button>
  );
};
