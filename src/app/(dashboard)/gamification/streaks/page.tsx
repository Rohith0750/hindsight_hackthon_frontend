"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Snowflake, Calendar, CheckCircle, Trophy, Zap, Info, Star } from 'lucide-react';

import { useStreaks } from '@/hooks/useGamification';
import { StreakActivity } from '@/lib/types';

import { useUserStats } from '@/hooks/useStats';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_FREEZE_CARDS = 5;

const MILESTONES = [
  { days: 7, label: '7-Day Streak', icon: Flame, achieved: true },
  { days: 14, label: '14-Day Streak', icon: Zap, achieved: true },
  { days: 30, label: '30-Day Streak', icon: Star, achieved: false },
  { days: 100, label: '100-Day Streak', icon: Trophy, achieved: false },
];

export default function StreaksPage() {
  const { data: activityData, isLoading: activityLoading } = useStreaks();
  const activity = activityData as any;
  const { data: statsData, isLoading: statsLoading } = useUserStats();
  const [freezeConfirm, setFreezeConfirm] = useState(false);
  const [cardsUsed, setCardsUsed] = useState(0);

  const stats = statsData as any;
  const CURRENT_STREAK = stats?.streak || 0;
  const LONGEST_STREAK = stats?.longestStreak || 0;
  const FREEZE_CARDS = stats?.freezeCards || 0;
  const TODAY = new Date();

  if (activityLoading || statsLoading || !activity) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal" />
      </div>
    );
  }

  const remainingFreezeCards = FREEZE_CARDS - cardsUsed;

  function handleUseFreeze() {
    if (remainingFreezeCards > 0) {
      setCardsUsed(c => c + 1);
      setFreezeConfirm(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary flex items-center gap-2">
            <Flame className="w-6 h-6 text-fire-accent" />
            Daily Coding Streaks
          </h1>
          <p className="text-sm font-body text-text-secondary mt-1">
            Keep your streak alive with freeze cards — just like Duolingo
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 rounded-lg bg-fire-accent/10 border border-fire-accent/30">
            <p className="font-display text-2xl font-bold text-fire-accent flex items-center gap-1 justify-center">
              <Flame className="w-5 h-5" />
              {CURRENT_STREAK}
            </p>
            <p className="text-xs font-body text-text-secondary">day streak</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-5">
          {/* Streak stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Current Streak', value: `${CURRENT_STREAK} days`, color: 'text-fire-accent', icon: Flame },
              { label: 'Longest Streak', value: `${LONGEST_STREAK} days`, color: 'text-accent-teal', icon: Trophy },
              { label: 'Freeze Cards', value: `${remainingFreezeCards} / ${MAX_FREEZE_CARDS}`, color: 'text-badge-blue', icon: Snowflake },
              { label: 'Total Days Coded', value: '89', color: 'text-text-primary', icon: Zap },
            ].map(s => (
              <div key={s.label} className="bg-bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <p className={`font-display text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
                <p className="text-xs font-body text-text-secondary">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Calendar heatmap */}
          <div className="bg-bg-card rounded-xl border border-border p-5">
            <h3 className="font-display text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-teal" />
              Activity — Last 5 Weeks
            </h3>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEK_DAYS.map(d => (
                <p key={d} className="text-center text-xs font-body text-text-secondary">{d}</p>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Padding for first week */}
              {Array.from({ length: new Date(activity[0].date).getDay() }).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {activity.map((day: StreakActivity, i: number) => {
                const dayDate = new Date(day.date);
                const isToday = dayDate.toDateString() === TODAY.toDateString();
                let bg = 'bg-bg-code';
                if (day.frozen) bg = 'bg-badge-blue/30';
                else if (day.solved >= 3) bg = 'bg-accent-teal';
                else if (day.solved === 2) bg = 'bg-accent-teal/60';
                else if (day.solved === 1) bg = 'bg-accent-teal/30';
                return (
                  <div
                    key={i}
                    title={`${dayDate.toDateString()}: ${day.frozen ? '❄️ Frozen' : `${day.solved} solved`}`}
                    className={`aspect-square rounded-sm ${bg} ${isToday ? 'ring-2 ring-fire-accent ring-offset-1 ring-offset-bg-card' : ''} cursor-pointer transition-transform hover:scale-110`}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="text-xs font-body text-text-secondary">Less</span>
              {['bg-bg-code', 'bg-accent-teal/30', 'bg-accent-teal/60', 'bg-accent-teal'].map(c => (
                <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
              <span className="text-xs font-body text-text-secondary">More</span>
              <div className="flex items-center gap-1 ml-2">
                <div className="w-3 h-3 rounded-sm bg-badge-blue/30" />
                <span className="text-xs font-body text-badge-blue">Frozen</span>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-bg-card rounded-xl border border-border p-5">
            <h3 className="font-display text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-fire-accent" />
              Streak Milestones
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {MILESTONES.map(m => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.days}
                    className={`p-4 rounded-lg border-2 transition-all ${m.achieved
                      ? 'border-fire-accent/50 bg-fire-accent/10'
                      : 'border-border bg-bg-code opacity-60'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${m.achieved ? 'bg-fire-accent/20 text-fire-accent' : 'bg-bg-main text-text-secondary'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="font-display text-sm font-semibold text-text-primary">{m.label}</p>
                    {m.achieved ? (
                      <p className="text-xs font-body text-accent-teal mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Achieved!
                      </p>
                    ) : (
                      <p className="text-xs font-body text-text-secondary mt-1">
                        {m.days - CURRENT_STREAK} more days
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Freeze Card Panel */}
        <div className="space-y-4">
          <div className="bg-bg-card rounded-xl border border-border p-5">
            <h3 className="font-display text-sm font-semibold text-text-primary flex items-center gap-2 mb-2">
              <Snowflake className="w-4 h-4 text-badge-blue" />
              Freeze Cards
            </h3>
            <p className="text-xs font-body text-text-secondary mb-4">
              A Freeze Card protects your streak on a day you can&apos;t code. Use them wisely!
            </p>

            {/* Card display */}
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {Array.from({ length: MAX_FREEZE_CARDS }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-md flex items-center justify-center text-lg border transition-all ${i < remainingFreezeCards
                    ? 'bg-badge-blue/20 border-badge-blue/40'
                    : 'bg-bg-code border-border opacity-40'
                    }`}
                >
                  {i < remainingFreezeCards ? <Snowflake className="w-5 h-5 text-badge-blue" /> : <div className="w-1 h-1 rounded-full bg-border" />}
                </div>
              ))}
            </div>

            <p className="text-xs font-body text-text-secondary text-center mb-4">
              {remainingFreezeCards} of {MAX_FREEZE_CARDS} freeze cards remaining
            </p>

            {!freezeConfirm ? (
              <button
                onClick={() => setFreezeConfirm(true)}
                disabled={remainingFreezeCards === 0}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-display transition-colors ${remainingFreezeCards > 0
                  ? 'bg-badge-blue/20 border border-badge-blue/40 text-badge-blue hover:bg-badge-blue/30'
                  : 'bg-bg-code border border-border text-text-secondary cursor-not-allowed'
                  }`}
              >
                <Snowflake className="w-4 h-4" />
                Use Freeze Card Today
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <p className="text-xs font-body text-text-secondary text-center">
                  Protect today&apos;s streak?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleUseFreeze}
                    className="flex-1 py-2 rounded-md bg-badge-blue text-white text-xs font-display hover:bg-badge-blue/80 transition-colors"
                  >
                    Confirm <Snowflake className="w-3.5 h-3.5 inline ml-1" />
                  </button>
                  <button
                    onClick={() => setFreezeConfirm(false)}
                    className="flex-1 py-2 rounded-md bg-bg-code border border-border text-text-secondary text-xs font-display hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* How to earn more */}
          <div className="bg-bg-code rounded-lg border border-border p-4">
            <p className="text-xs font-display text-text-primary flex items-center gap-1 mb-3">
              <Zap className="w-3.5 h-3.5 text-fire-accent" />
              Earn More Freeze Cards
            </p>
            {[
              { action: 'Solve 3 problems in a day', reward: '+1 card' },
              { action: 'Reach a 7-day milestone', reward: '+1 card' },
              { action: 'Defeat the weekly boss', reward: '+3 cards' },
            ].map(e => (
              <div key={e.action} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <p className="text-xs font-body text-text-secondary">{e.action}</p>
                <span className="text-xs font-display text-badge-blue">{e.reward}</span>
              </div>
            ))}
          </div>

          <div className="bg-bg-code rounded-lg border border-border p-4">
            <p className="text-xs font-display text-text-primary flex items-center gap-1 mb-2">
              <Info className="w-3.5 h-3.5 text-text-secondary" />
              Daily Goal
            </p>
            <p className="text-2xl font-display font-bold text-text-primary">1 problem / day</p>
            <p className="text-xs font-body text-text-secondary mt-1">Solve at least 1 problem today to keep your streak alive.</p>
            <div className="mt-3 h-2 bg-bg-main rounded-full overflow-hidden">
              <div className="h-full w-full bg-fire-accent rounded-full" />
            </div>
            <p className="text-xs font-body text-accent-teal mt-1">✓ Done today!</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
