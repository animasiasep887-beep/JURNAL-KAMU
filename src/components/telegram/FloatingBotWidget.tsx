import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { audioSynth } from '../../utils/audioSynth';
import {
  Send,
  Bot,
  Sparkles,
  X,
  CheckCircle2,
  Minimize2,
  Copy,
  ExternalLink,
  ChevronDown,
  MessageSquare,
  Zap,
} from 'lucide-react';

export const FloatingBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  const { currentUser } = useAuth();
  const { telegramMessages, sendTelegramMessage } = useData();
  const { showToast } = useNotification();

  const userCode = currentUser?.id === 'user-bintang' ? 'A7K92P' : currentUser?.id === 'user-reza' ? 'RZ882P' : 'AD990X';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || isSending) return;

    const text = inputMsg;
    setInputMsg('');
    setIsSending(true);
    audioSynth.playClick(0.08);

    try {
      await sendTelegramMessage(text);
      audioSynth.playSuccess(0.1);
    } catch (e) {
      showToast('Gagal mengirim pesan simulasi', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(userCode);
    audioSynth.playSuccess(0.08);
    showToast(`Kode koneksi ${userCode} disalin!`, 'success');
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      {/* Expanded Widget Floating Card */}
      {isOpen ? (
        <div className="w-[340px] sm:w-[380px] h-[480px] bg-slate-900/95 border border-indigo-500/40 rounded-3xl shadow-2xl shadow-indigo-500/20 backdrop-blur-2xl flex flex-col overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-900/80 to-purple-900/60 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Life OS AI Bot</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">ONLINE</span>
                </h4>
                <p className="text-[10px] text-slate-300 font-mono">Kode Akun: {userCode}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={copyCode}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                title="Salin Kode Koneksi"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  audioSynth.playClick(0.05);
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="px-3.5 py-2 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Voice Note & OCR Ready</span>
            </span>
            <a
              href={`https://t.me/PersonalLifeOSBot?start=${userCode}`}
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Buka Bot Telegram</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
            {telegramMessages.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-600 opacity-50" />
                <p className="text-xs">Belum ada aktivitas chat bot.</p>
                <p className="text-[10px] text-slate-600">Coba ketik "Kopi 15k" atau "jurnal: hari ini produktif"</p>
              </div>
            ) : (
              telegramMessages.slice(-6).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-2.5 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    <p className="text-[11px] whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Chat Box */}
          <form onSubmit={handleSend} className="p-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Tes bot (e.g. Makan 35k)..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim() || isSending}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl shadow-md transition-all flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        /* Collapsed Floating Pill */
        <button
          onClick={() => {
            audioSynth.playClick(0.08);
            setIsOpen(true);
          }}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-900 border border-indigo-500/40 hover:border-indigo-500 text-slate-200 rounded-full shadow-xl shadow-indigo-500/10 backdrop-blur-xl group transition-all transform hover:scale-105"
        >
          <div className="relative">
            <Bot className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
          </div>
          <span className="text-xs font-bold text-slate-100">Telegram Bot</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            LIVE
          </span>
        </button>
      )}
    </div>
  );
};
