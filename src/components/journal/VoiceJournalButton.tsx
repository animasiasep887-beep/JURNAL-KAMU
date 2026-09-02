import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceJournalButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  label?: string;
}

export const VoiceJournalButton: React.FC<VoiceJournalButtonProps> = ({
  onTranscript,
  className = '',
  label = 'Bicara / Voice Note',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'id-ID';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech Recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      alert('Browser Anda belum mendukung Speech-to-Text API. Silakan gunakan Google Chrome atau Microsoft Edge.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start speech recognition', e);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
        isListening
          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse'
          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
      } ${className}`}
      title={isListening ? 'Klik untuk berhenti merekam suara' : 'Mulai dikte suara (Voice Journaling)'}
    >
      {isListening ? (
        <>
          <MicOff className="w-3.5 h-3.5 text-white animate-bounce" />
          <span>Merekam Suara... (Bicara)</span>
          <span className="w-2 h-2 rounded-full bg-rose-300 animate-ping" />
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5 text-indigo-400" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
