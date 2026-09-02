import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { getTodayString } from '../../utils/formatters';
import { audioSynth } from '../../utils/audioSynth';
import { triggerConfetti } from '../../utils/confetti';
import { JournalEntry } from '../../types';
import {
  BookOpen,
  Smile,
  Zap,
  AlertCircle,
  Save,
  Tag,
  Sparkles,
  PlusCircle,
  Brain,
  Lightbulb,
  Compass,
  CheckCircle2,
  Calendar,
  Eye,
  Heart,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Type,
  Flame,
  CloudRain,
  Wind,
  HelpCircle,
  X,
  Coffee,
  CheckSquare,
  Quote,
  Clock,
  Feather,
  Edit3,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { VoiceJournalButton } from './VoiceJournalButton';

interface DailyJournalEditorProps {
  initialZenMode?: boolean;
}

export const DailyJournalEditor: React.FC<DailyJournalEditorProps> = ({ initialZenMode = false }) => {
  const { journals, saveJournalEntry } = useData();
  const { showToast } = useNotification();
  const today = getTodayString();

  // Ref to form for smooth scrolling
  const editorFormRef = useRef<HTMLFormElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Selected existing journal or null for brand new entry
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
    journals.length > 0 ? journals[0].id : null
  );

  // Active viewing journal modal (for full read mode)
  const [viewingJournal, setViewingJournal] = useState<JournalEntry | null>(null);

  const activeJournal = journals.find((j) => j.id === selectedJournalId);

  const [title, setTitle] = useState(activeJournal?.title || 'Jurnal Refleksi Hari Ini');
  const [content, setContent] = useState(activeJournal?.content || '');
  const [mood, setMood] = useState<number>(activeJournal?.mood || 4);
  const [energy, setEnergy] = useState<number>(activeJournal?.energyLevel || 8);
  const [stress, setStress] = useState<number>(activeJournal?.stressLevel || 3);
  const [gratitude, setGratitude] = useState(activeJournal?.gratitudeText || '');
  const [learned, setLearned] = useState(activeJournal?.learnedText || '');
  const [problems, setProblems] = useState(activeJournal?.problemsText || '');
  const [solutions, setSolutions] = useState(activeJournal?.solutionsText || '');
  const [highlights, setHighlights] = useState(activeJournal?.highlightText || '');
  const [tomorrowPlan, setTomorrowPlan] = useState(activeJournal?.tomorrowPlanText || '');
  const [activeDate, setActiveDate] = useState<string>(activeJournal?.date || today);

  // Zen Mode States
  const [isZenMode, setIsZenMode] = useState<boolean>(initialZenMode);
  const [showZenGuide, setShowZenGuide] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('serif');
  const [ambientSound, setAmbientSound] = useState<'rain' | 'campfire' | 'whitenoise' | null>(null);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.15);

  // Sync state when active journal selection changes
  useEffect(() => {
    if (activeJournal) {
      setTitle(activeJournal.title);
      setContent(activeJournal.content);
      setMood(activeJournal.mood || 4);
      setEnergy(activeJournal.energyLevel || 8);
      setStress(activeJournal.stressLevel || 3);
      setGratitude(activeJournal.gratitudeText || '');
      setLearned(activeJournal.learnedText || '');
      setProblems(activeJournal.problemsText || '');
      setSolutions(activeJournal.solutionsText || '');
      setHighlights(activeJournal.highlightText || '');
      setTomorrowPlan(activeJournal.tomorrowPlanText || '');
      setActiveDate(activeJournal.date);
    }
  }, [selectedJournalId]);

  // Handle ambient sound changes
  useEffect(() => {
    if (ambientSound) {
      audioSynth.startAmbient(ambientSound, ambientVolume);
    } else {
      audioSynth.stopAmbient();
    }
    return () => {
      audioSynth.stopAmbient();
    };
  }, [ambientSound]);

  // Update ambient volume
  useEffect(() => {
    audioSynth.setAmbientVolume(ambientVolume);
  }, [ambientVolume]);

  // Keyboard shortcut inside Zen Mode: Ctrl+S to save, ESC to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZenMode) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        if (showZenGuide) {
          setShowZenGuide(false);
        } else {
          setAmbientSound(null);
          setIsZenMode(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode, showZenGuide, content, title, mood, energy, activeDate]);

  const handleNewJournal = () => {
    audioSynth.playClick();
    setSelectedJournalId(null);
    setTitle('Jurnal Refleksi Baru');
    setContent('');
    setMood(4);
    setEnergy(8);
    setStress(2);
    setGratitude('');
    setLearned('');
    setProblems('');
    setSolutions('');
    setHighlights('');
    setTomorrowPlan('');
    setActiveDate(today);

    // Smooth scroll down to writing form and focus
    setTimeout(() => {
      editorFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      titleInputRef.current?.focus();
    }, 80);

    showToast('✨ Formulir jurnal baru siap ditulis di bawah!');
  };

  const handleOpenExistingJournal = (j: JournalEntry) => {
    audioSynth.playClick(0.06);
    setSelectedJournalId(j.id);
    setViewingJournal(j);
  };

  const handleEditFromModal = (j: JournalEntry) => {
    audioSynth.playClick(0.08);
    setSelectedJournalId(j.id);
    setViewingJournal(null);
    setTimeout(() => {
      editorFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      titleInputRef.current?.focus();
    }, 80);
    showToast(`Memuat jurnal "${j.title}" ke editor.`);
  };

  const handleEditInZenFromModal = (j: JournalEntry) => {
    audioSynth.playClick(0.08);
    setSelectedJournalId(j.id);
    setViewingJournal(null);
    setIsZenMode(true);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) {
      showToast('Isi tulisan jurnal terlebih dahulu!', 'error');
      return;
    }

    saveJournalEntry({
      id: selectedJournalId || undefined,
      date: activeDate,
      title: title.trim() || 'Jurnal Kehidupan',
      content: content.trim(),
      mood: mood as any,
      energyLevel: energy,
      stressLevel: stress,
      motivationLevel: 8,
      gratitudeText: gratitude,
      learnedText: learned || 'Mengevaluasi hari dan konsisten mencatat refleksi diri.',
      problemsText: problems,
      solutionsText: solutions || 'Tetap tenang, atur ritme istirahat, dan melangkah lebih baik esok hari.',
      highlightText: highlights || content.substring(0, 60),
      tomorrowPlanText: tomorrowPlan,
      tags: ['#journal', '#refleksi'],
    });

    audioSynth.playSuccess(0.15);
    triggerConfetti();
    showToast(selectedJournalId ? 'Jurnal berhasil diperbarui! (+15 XP)' : 'Jurnal baru berhasil disimpan! (+25 XP)');
  };

  // Word count & read time helper
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Quick Prompt Injection
  const injectPrompt = (promptHeader: string, promptText: string) => {
    audioSynth.playClick();
    setContent((prev) => {
      const separator = prev.trim() ? '\n\n' : '';
      return prev + `${separator}### ${promptHeader}\n${promptText}`;
    });
  };

  const insertMarkdown = (prefix: string, suffix = '') => {
    audioSynth.playClick();
    setContent((prev) => prev + `\n${prefix} ` + suffix);
  };

  return (
    <div className="space-y-6">
      {/* ========================================== */}
      {/* 📖 JOURNAL DETAIL READER MODAL (CLICK TO VIEW FULL ENTRY) */}
      {/* ========================================== */}
      {viewingJournal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div
            className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-6 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    🗓️ {viewingJournal.date}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Mood: {viewingJournal.mood === 5 ? '🔥 Sangat Baik (5/5)' : viewingJournal.mood === 4 ? '😀 Baik (4/5)' : viewingJournal.mood === 3 ? '🙂 Normal (3/5)' : '😐 Butuh Istirahat'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                  {viewingJournal.title}
                </h3>
              </div>

              <button
                onClick={() => setViewingJournal(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content Body */}
            <div className="space-y-4">
              <div className="p-4 sm:p-5 bg-slate-950/70 border border-slate-800/90 rounded-2xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Isi Catatan & Curahan Hati:</span>
                </h4>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                  {viewingJournal.content}
                </p>
              </div>

              {/* Gratitude & Learned sections */}
              {(viewingJournal.gratitudeText || viewingJournal.learnedText) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {viewingJournal.gratitudeText && (
                    <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-1">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        <span>Hal yang Disyukuri:</span>
                      </span>
                      <p className="text-xs text-slate-200">{viewingJournal.gratitudeText}</p>
                    </div>
                  )}

                  {viewingJournal.learnedText && (
                    <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-2xl space-y-1">
                      <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                        <Brain className="w-3.5 h-3.5" />
                        <span>Pelajaran Berharga:</span>
                      </span>
                      <p className="text-xs text-slate-200">{viewingJournal.learnedText}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Problems & Solutions (AI Insights) */}
              {(viewingJournal.problemsText || viewingJournal.solutionsText) && (
                <div className="p-4 bg-purple-950/30 border border-purple-500/30 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Evaluasi & Rekomendasi Solusi AI:</span>
                  </span>
                  {viewingJournal.problemsText && (
                    <p className="text-xs text-slate-300">
                      <strong>Kendala:</strong> {viewingJournal.problemsText}
                    </p>
                  )}
                  {viewingJournal.solutionsText && (
                    <p className="text-xs text-slate-300">
                      <strong>Solusi yang Disarankan:</strong> {viewingJournal.solutionsText}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons in Reader */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-mono">
                Energi: {viewingJournal.energyLevel || 8}/10 • Stres: {viewingJournal.stressLevel || 3}/10
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEditInZenFromModal(viewingJournal)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-all"
                >
                  <Feather className="w-3.5 h-3.5" />
                  <span>Edit di Mode Zen</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleEditFromModal(viewingJournal)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Jurnal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 🧘‍♂️ ULTRA-PREMIUM ZEN MODE FULLSCREEN OVERLAY */}
      {/* ========================================== */}
      {isZenMode && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col backdrop-blur-3xl animate-fade-in overflow-hidden select-text">
          {/* Ambient Background Gradient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/30 via-slate-950 to-slate-950 pointer-events-none" />

          {/* Zen Mode Header Bar */}
          <header className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-md">
                  <Feather className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-extrabold text-white">Mode Zen Menulis</h2>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      FOKUS TOTAL
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {wordCount} Kata • {content.length} Karakter • ~{readTimeMinutes} menit baca
                  </p>
                </div>
              </div>

              {/* Panduan Button on Mobile */}
              <button
                type="button"
                onClick={() => setShowZenGuide(true)}
                className="md:hidden flex items-center gap-1 text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1.5 rounded-xl border border-indigo-500/20"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Panduan</span>
              </button>
            </div>

            {/* Controls Bar: Typography, Ambient Sound, Guide, Save, Exit */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Panduan & Cara Pakai Button */}
              <button
                type="button"
                onClick={() => setShowZenGuide((prev) => !prev)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all"
                title="Buka Cara Pakai & Tips Menulis Zen"
              >
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>Cara Pakai</span>
              </button>

              {/* Typography Picker */}
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    audioSynth.playClick();
                    setFontFamily('sans');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-sans transition-all ${
                    fontFamily === 'sans' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sans
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioSynth.playClick();
                    setFontFamily('serif');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-serif transition-all ${
                    fontFamily === 'serif' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Serif
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioSynth.playClick();
                    setFontFamily('mono');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono transition-all ${
                    fontFamily === 'mono' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mono
                </button>
              </div>

              {/* Ambient Noise Selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    audioSynth.playClick();
                    setAmbientSound(ambientSound === 'rain' ? null : 'rain');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                    ambientSound === 'rain' ? 'bg-blue-600 text-white font-bold shadow-md animate-pulse' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Putar Suara Hujan Rileks"
                >
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Hujan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    audioSynth.playClick();
                    setAmbientSound(ambientSound === 'campfire' ? null : 'campfire');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                    ambientSound === 'campfire' ? 'bg-amber-600 text-white font-bold shadow-md animate-pulse' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Putar Suara Api Unggun"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Api Unggun</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    audioSynth.playClick();
                    setAmbientSound(ambientSound === 'whitenoise' ? null : 'whitenoise');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                    ambientSound === 'whitenoise' ? 'bg-purple-600 text-white font-bold shadow-md animate-pulse' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Putar Suara White Noise"
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>White Noise</span>
                </button>

                {ambientSound && (
                  <input
                    type="range"
                    min="0.02"
                    max="0.4"
                    step="0.01"
                    value={ambientVolume}
                    onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 ml-1.5"
                    title="Volume Suara"
                  />
                )}
              </div>

              {/* Action: Save & Exit */}
              <button
                type="button"
                onClick={() => handleSave()}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Simpan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  audioSynth.playClick();
                  setAmbientSound(null);
                  setIsZenMode(false);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-xl border border-slate-700 transition-all"
                title="Keluar dari Mode Zen (Esc)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </header>

          {/* Guide Modal / Overlay when "Cara Pakai" is clicked */}
          {showZenGuide && (
            <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-scale-up">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-600 text-white">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">Panduan & Cara Menulis Mode Zen</h3>
                  </div>
                  <button
                    onClick={() => setShowZenGuide(false)}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-start gap-3">
                    <CloudRain className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">1. Suara Ambien Menenangkan:</strong>
                      <p className="text-slate-400 mt-0.5">Klik tombol <em>Hujan</em>, <em>Api Unggun</em>, atau <em>White Noise</em> di atas untuk memutar audio fokus santai tanpa membuka tab lain.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">2. Inspirasi Ide Cepat:</strong>
                      <p className="text-slate-400 mt-0.5">Jika bingung ingin menulis apa, klik tombol prompt di bawah judul (misal: <em>Hal yang Disyukuri</em> atau <em>Pelajaran Hari Ini</em>).</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-start gap-3">
                    <Type className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">3. Ganti Font & Mood:</strong>
                      <p className="text-slate-400 mt-0.5">Pilih font <em>Serif</em> untuk nuansa buku/novel klasik, <em>Sans</em> untuk modern, serta pilih emoji mood harimu.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-start gap-3">
                    <Save className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">4. Shortcut Keyboard Cepat:</strong>
                      <p className="text-slate-400 mt-0.5">Tekan <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded text-indigo-300">Ctrl + S</kbd> untuk simpan seketika, dan <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded text-indigo-300">ESC</kbd> untuk keluar.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowZenGuide(false)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Saya Mengerti, Mulai Menulis ✍️
                </button>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* ZEN CANVAS NOTEBOOK CARD (COZY & STRUCTURED) */}
          {/* ========================================== */}
          <div className="relative z-10 flex-1 overflow-y-auto px-3 sm:px-6 py-6 md:py-8 flex justify-center">
            <div className="w-full max-w-4xl bg-slate-900/80 border border-slate-800/90 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl flex flex-col space-y-6">
              
              {/* Top Context Bar (Date, Mood, Energy inside Zen Mode) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                {/* Date Picker */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <input
                    type="date"
                    value={activeDate}
                    onChange={(e) => setActiveDate(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-xl outline-none font-mono"
                  />
                </div>

                {/* Mood Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Mood:</span>
                  <div className="flex gap-1.5">
                    {[
                      { val: 5, emoji: '🔥', label: 'Semangat' },
                      { val: 4, emoji: '😀', label: 'Baik' },
                      { val: 3, emoji: '🙂', label: 'Normal' },
                      { val: 2, emoji: '😐', label: 'Lelah' },
                      { val: 1, emoji: '😞', label: 'Stres' },
                    ].map((m) => (
                      <button
                        key={m.val}
                        type="button"
                        onClick={() => {
                          audioSynth.playClick();
                          setMood(m.val);
                        }}
                        className={`px-2 py-1 rounded-xl text-xs border transition-all ${
                          mood === m.val
                            ? 'bg-indigo-600 border-indigo-500 text-white scale-110 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                        title={m.label}
                      >
                        <span>{m.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ketik judul refleksi atau tema hari ini..."
                  className={`w-full bg-transparent text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 placeholder-slate-600 outline-none border-b border-transparent focus:border-indigo-500/40 pb-2 transition-colors ${
                    fontFamily === 'serif' ? 'font-serif tracking-normal' : fontFamily === 'mono' ? 'font-mono' : 'font-sans'
                  }`}
                />
              </div>

              {/* Quick Writing Inspirations (Anti-Writer's Block Toolbar) */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Inspirasi Cepat (Klik untuk menyisipkan panduan topik):</span>
                  </span>
                  <span className="hidden sm:inline text-slate-500">Pilih salah satu jika bingung mau nulis apa</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => injectPrompt('Hal yang Disyukuri Hari Ini 🙏', '• 1. \n• 2. \n• 3. ')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>Hal yang Disyukuri</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => injectPrompt('Pelajaran & Insight Hari Ini 🧠', 'Pengalaman berharga yang saya pelajari hari ini adalah: ')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Brain className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Pelajaran Hari Ini</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => injectPrompt('Target & Prioritas Besok 🎯', '• Prioritas 1: \n• Prioritas 2: \n• Prioritas 3: ')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Rencana Besok</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => injectPrompt('Evaluasi Diri & Solusi 💡', 'Tantangan yang dihadapi: \nSolusi yang akan dilakukan: ')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Evaluasi & Solusi</span>
                  </button>
                </div>
              </div>

              {/* Main Writing Textarea */}
              <div className="flex-1 flex flex-col space-y-2">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Mulai tuliskan perasaanmu, pengalaman berharga, kendala yang dihadapi, atau sekadar curahan isi hati di sini..."
                  rows={14}
                  className={`w-full flex-1 bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 sm:p-6 text-base sm:text-lg leading-relaxed text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500/50 resize-y transition-colors ${
                    fontFamily === 'serif'
                      ? 'font-serif leading-loose tracking-wide'
                      : fontFamily === 'mono'
                      ? 'font-mono text-sm'
                      : 'font-sans'
                  }`}
                  autoFocus
                />
              </div>

              {/* Bottom Canvas Footer Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tersimpan di memori</span>
                  </span>
                  <span>•</span>
                  <span>{wordCount} Kata ditulis</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowZenGuide(true)}
                    className="hover:text-indigo-300 flex items-center gap-1 underline"
                  >
                    <span>Butuh Bantuan?</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave()}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    Simpan Jurnal (+25 XP)
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* STANDARD JURNAL EDITOR VIEW */}
      {/* ========================================== */}
      {/* Journal Archive & Switcher Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span>Daftar Riwayat Jurnal & Pembelajaran Hidup</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Klik catatan jurnal di bawah untuk membaca riwayat lengkap dan melihat solusi AI.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                audioSynth.playClick();
                setIsZenMode(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600 hover:to-purple-600 text-indigo-300 hover:text-white border border-indigo-500/40 font-bold text-xs rounded-xl shadow-md transition-all group"
            >
              <Feather className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" />
              <span>Mode Zen</span>
            </button>

            <button
              type="button"
              onClick={handleNewJournal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all self-start sm:self-auto cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Tulis Jurnal Baru</span>
            </button>
          </div>
        </div>

        {/* Journal Badges Carousel */}
        {journals.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            Belum ada catatan jurnal. Tulis jurnal pertama Anda di bawah atau via Telegram Bot!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {journals.map((j, idx) => {
              const isSelected = selectedJournalId === j.id;
              return (
                <div
                  key={j.id || idx}
                  onClick={() => handleOpenExistingJournal(j)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-500/10 scale-[1.01]'
                      : 'bg-slate-950/70 border-slate-800/90 hover:border-indigo-500/50 hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                        {j.date}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Mood: {j.mood === 5 ? '🔥' : j.mood === 4 ? '😀' : j.mood === 3 ? '🙂' : '😐'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold mt-2.5 text-white truncate group-hover:text-indigo-300 transition-colors">
                      {j.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      "{j.content}"
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-indigo-400 font-semibold group-hover:text-indigo-300">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka & Baca Jurnal</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Editor & AI Coaching Form */}
      <form
        ref={editorFormRef}
        onSubmit={handleSave}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-100 text-base md:text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>
                {selectedJournalId ? '📝 Edit & Evaluasi Jurnal Terpilih' : '✨ Tulis Catatan Jurnal Baru'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Refleksikan pikiran, kendala, dan syukur hari ini untuk menjaga kesehatan mental.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={activeDate}
              onChange={(e) => setActiveDate(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl outline-none font-mono"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Jurnal</span>
            </button>
          </div>
        </div>

        {/* Mood & Sliders Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Mood Hari Ini</label>
            <div className="flex gap-2">
              {[
                { val: 5, emoji: '🔥', text: 'Sangat Baik' },
                { val: 4, emoji: '😀', text: 'Baik' },
                { val: 3, emoji: '🙂', text: 'Normal' },
                { val: 2, emoji: '😐', text: 'Lelah' },
                { val: 1, emoji: '😞', text: 'Stres' },
              ].map((m) => (
                <button
                  key={m.val}
                  type="button"
                  onClick={() => {
                    audioSynth.playClick();
                    setMood(m.val);
                  }}
                  className={`flex-1 py-2 rounded-xl text-center border transition-all ${
                    mood === m.val ? 'bg-indigo-600 border-indigo-500 text-white scale-105 shadow-md' : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
                  }`}
                  title={m.text}
                >
                  <span className="text-base">{m.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Tingkat Energi</span>
              <span className="text-indigo-400 font-mono">{energy}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Tingkat Beban / Stres</span>
              <span className="text-purple-400 font-mono">{stress}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stress}
              onChange={(e) => setStress(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>

        {/* Title & Content */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Judul Refleksi</label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Refleksi Akhir Pekan & Rencana Minggu Depan"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Isi Jurnal / Curahan Pikiran</label>
              <div className="flex items-center gap-2">
                <VoiceJournalButton
                  onTranscript={(speechText) => {
                    setContent((prev) => (prev ? `${prev} ${speechText}` : speechText));
                    showToast('🎙️ Suara berhasil dikonversi ke teks!', 'success');
                  }}
                  label="Dikte Suara"
                />
                <button
                  type="button"
                  onClick={() => insertMarkdown('###')}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 hover:text-white"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('- [ ]')}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 hover:text-white"
                >
                  Todo
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('>')}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 hover:text-white"
                >
                  Quote
                </button>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="Ceritakan harimu secara bebas... Apa yang membuatmu bersyukur? Adakah masalah yang dihadapi?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Guided Prompts (Gratitude, Learnings, Next Plan) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <label className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              <span>Hal yang Disyukuri Hari Ini</span>
            </label>
            <input
              type="text"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="Kesehatan, obrolan seru, kopi enak..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <label className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span>Pelajaran / Insight Hari Ini</span>
            </label>
            <input
              type="text"
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
              placeholder="Jangan menunda tugas penting, tidur tepat waktu..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
