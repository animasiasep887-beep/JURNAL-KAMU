import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Send, Bot, User as UserIcon, Check, X, Sparkles, RefreshCw } from 'lucide-react';

export const TelegramSimulator: React.FC = () => {
  const { telegramMessages, sendTelegramMessage, confirmTelegramTransaction, cancelTelegramTransaction } = useData();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [telegramMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendTelegramMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickCommand = (cmd: string) => {
    sendTelegramMessage(cmd);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col h-[650px] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold shadow-lg shadow-sky-500/10">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <span>Telegram Bot Simulator (Real-time Input)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-xs text-slate-400">Ketik pesan singkat atau command untuk langsung tersambung ke dashboard.</p>
          </div>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 scrollbar-none">
        {[
          'Kopi 10k',
          'Makan ayam 25k bank',
          'Bensin 30k cash',
          'Gaji 3jt bank',
          'Transfer 500k bank tabungan',
          '/balance',
          '/today',
          '/tasks',
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleQuickCommand(cmd)}
            className="px-3 py-1 bg-slate-800/80 hover:bg-slate-700 text-sky-300 text-xs font-mono rounded-xl border border-slate-700/60 whitespace-nowrap transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Message Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-4">
        {telegramMessages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div key={msg.id} className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
              {isBot && (
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  isBot
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md'
                    : 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                }`}
              >
                {msg.text}

                {/* Interactive Confirmation Buttons */}
                {msg.interactiveButtons && msg.interactiveButtons.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex gap-2">
                    {msg.interactiveButtons.map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => {
                          if (btn.action === 'confirm') confirmTelegramTransaction(btn.payload || msg.id);
                          if (btn.action === 'cancel') cancelTelegramTransaction(msg.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-md ${
                          btn.style === 'primary'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                            : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Ketik transaksi Telegram (contoh: Kopi 10k, Makan 25k)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-sky-600/30 flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span>Kirim</span>
        </button>
      </form>
    </div>
  );
};
