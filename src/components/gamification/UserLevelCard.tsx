import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { calculateJournalStreak } from '../../utils/formatters';
import { Trophy, Flame, Zap, Award, Sparkles, Star, ChevronRight, Gift, Share2 } from 'lucide-react';
import { RewardShopModal } from './RewardShopModal';
import { ShareableCardModal } from './ShareableCardModal';

export const UserLevelCard: React.FC = () => {
  const { journals, workouts, tasks, transactions } = useData();
  const { currentUser } = useAuth();

  const [showRewardShop, setShowRewardShop] = useState(false);
  const [showStoryCard, setShowStoryCard] = useState(false);

  const streak = useMemo(() => calculateJournalStreak(journals), [journals]);

  const { totalXP, level, progressToNext, nextLevelXP, currentLevelBaseXP, rankTitle, badgeColor } = useMemo(() => {
    const journalXP = (journals || []).length * 25;
    const workoutXP = (workouts || []).length * 20;
    const taskXP = (tasks || []).filter((t) => t.status === 'done').length * 15;
    const txXP = (transactions || []).length * 10;
    const streakBonus = streak * 30;

    const xp = journalXP + workoutXP + taskXP + txXP + streakBonus;

    let lvl = 1;
    let base = 0;
    let next = 150;

    const tiers = [
      { lvl: 1, max: 150, title: 'Novice Habit Builder', color: 'from-slate-500 to-slate-700' },
      { lvl: 2, max: 350, title: 'Consistent Explorer', color: 'from-emerald-500 to-teal-700' },
      { lvl: 3, max: 650, title: 'Productivity Warrior', color: 'from-blue-500 to-indigo-700' },
      { lvl: 4, max: 1050, title: 'Discipline Master', color: 'from-purple-500 to-violet-700' },
      { lvl: 5, max: 1600, title: 'Life Architect', color: 'from-amber-500 to-orange-700' },
      { lvl: 6, max: 2400, title: 'Zen Grandmaster', color: 'from-rose-500 to-pink-700' },
      { lvl: 7, max: 999999, title: 'Immortal Life OS Titan', color: 'from-yellow-400 via-amber-500 to-purple-600' },
    ];

    for (let i = 0; i < tiers.length; i++) {
      if (xp < tiers[i].max || i === tiers.length - 1) {
        lvl = tiers[i].lvl;
        base = i === 0 ? 0 : tiers[i - 1].max;
        next = tiers[i].max;
        break;
      }
    }

    const currentTier = tiers.find((t) => t.lvl === lvl) || tiers[0];
    const range = next - base;
    const progress = Math.min(100, Math.max(0, Math.round(((xp - base) / range) * 100)));

    return {
      totalXP: xp,
      level: lvl,
      progressToNext: progress,
      nextLevelXP: next,
      currentLevelBaseXP: base,
      rankTitle: currentTier.title,
      badgeColor: currentTier.color,
    };
  }, [journals, workouts, tasks, transactions, streak]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl group hover:border-indigo-500/40 transition-all">
      {/* Background glow ambient */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* User Info & Level Badge */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${badgeColor} p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center`}>
              <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">LVL</span>
                <span className="text-xl font-extrabold text-white leading-none">{level}</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 rounded-full border-2 border-slate-900 text-white shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-100 text-base md:text-lg">{currentUser?.name || 'Life OS Member'}</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {rankTitle}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Total XP: <strong className="text-indigo-400 font-mono">{totalXP.toLocaleString()} XP</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {streak} Hari Streak
              </span>
            </p>
          </div>
        </div>

        {/* Progress Bar & Actions */}
        <div className="flex-1 max-w-md w-full space-y-3">
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-slate-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span>Progress Level {level + 1}</span>
              </span>
              <span className="text-slate-400 font-mono">{progressToNext}%</span>
            </div>

            {/* Glowing Animated Bar */}
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-indigo-500/50 transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>{totalXP} XP</span>
              <span>Target: {nextLevelXP} XP</span>
            </div>
          </div>

          {/* Action Buttons: XP Shop & Share Story */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowRewardShop(true)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>XP Reward Shop</span>
            </button>

            <button
              type="button"
              onClick={() => setShowStoryCard(true)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Share Story Card</span>
            </button>
          </div>
        </div>
      </div>

      <RewardShopModal isOpen={showRewardShop} onClose={() => setShowRewardShop(false)} />
      <ShareableCardModal isOpen={showStoryCard} onClose={() => setShowStoryCard(false)} />
    </div>
  );
};
