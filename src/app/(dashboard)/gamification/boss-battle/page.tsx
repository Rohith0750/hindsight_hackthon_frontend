"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Sword, Clock, Trophy, Zap, ChevronRight, Skull, Medal } from 'lucide-react';
import Image from 'next/image';
import { Contributor } from '@/lib/types';

import { useBoss } from '@/hooks/useGamification';

export default function BossBattlePage() {
  const { data: boss, isLoading } = useBoss();
  const [attacked, setAttacked] = useState(false);

  if (isLoading || !boss) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal" />
      </div>
    );
  }

  const hpPercent = Math.round((boss.hpRemaining / boss.hp) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary flex items-center gap-2">
            <Sword className="w-6 h-6 text-destructive" />
            Boss Battle
          </h1>
          <p className="text-sm font-body text-text-secondary mt-1">
            A weekly hard problem the whole community fights together
          </p>
        </div>
        <span className="text-xs font-display px-2 py-1 rounded bg-destructive/20 text-destructive border border-destructive/30 animate-pulse">
          LIVE · Week 12
        </span>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Main Boss Card */}
        <div className="space-y-4">
          {/* Boss info */}
          <div className="bg-bg-card rounded-xl border border-destructive/30 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl bg-bg-code border-2 border-destructive/40 flex items-center justify-center text-destructive flex-shrink-0">
                <Skull className="w-12 h-12" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display text-xl font-bold text-text-primary">{boss.name}</h2>
                  <span className="text-xs font-display px-2 py-0.5 rounded bg-destructive/20 text-destructive">
                    {boss.difficulty}
                  </span>
                </div>
                <p className="text-sm font-body text-text-secondary mt-1">{boss.description}</p>

                {/* HP Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-display text-text-secondary">Community HP</span>
                    <span className="text-xs font-display text-destructive font-bold">
                      {boss.hpRemaining} / {boss.hp} remaining
                    </span>
                  </div>
                  <div className="h-4 bg-bg-code rounded-full overflow-hidden border border-border">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: `${hpPercent}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-destructive to-fire-accent rounded-full"
                    />
                  </div>
                  <p className="text-xs font-body text-text-secondary mt-1">
                    {boss.hp - boss.hpRemaining} accepted solutions submitted · {hpPercent}% HP remaining
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Days', value: boss.timeLeft.days },
              { label: 'Hours', value: boss.timeLeft.hours },
              { label: 'Minutes', value: boss.timeLeft.minutes },
            ].map(({ label, value }) => (
              <div key={label} className="bg-bg-card rounded-lg border border-border p-4 text-center">
                <Clock className="w-4 h-4 text-accent-teal mx-auto mb-1" />
                <p className="font-display text-3xl font-bold text-text-primary">{String(value).padStart(2, '0')}</p>
                <p className="text-xs font-body text-text-secondary">{label}</p>
              </div>
            ))}
          </div>

          {/* Problem Card */}
          <div className="bg-bg-code rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-display text-text-secondary mb-1">This Week&apos;s Problem</p>
                <p className="font-display text-sm font-semibold text-text-primary">{boss.problem.title}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {boss.problem.tags.map((t: string) => (
                    <span key={t} className="text-xs font-body px-1.5 py-0.5 rounded bg-bg-card text-text-secondary border border-border">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setAttacked(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-display transition-all ${
                  attacked
                    ? 'bg-accent-teal/20 text-accent-teal border border-accent-teal/40 cursor-default'
                    : 'bg-destructive text-white hover:bg-destructive/80 border border-destructive'
                }`}
              >
                {attacked ? (
                  <>✓ Attacked</>
                ) : (
                  <>
                    <Sword className="w-4 h-4" />
                    Attack!
                  </>
                )}
              </button>
            </div>
            {attacked && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-2 rounded bg-accent-teal/10 border border-accent-teal/20"
              >
                <p className="text-xs font-body text-accent-teal">
                  🎉 Your solution was accepted! You dealt <strong>1 damage</strong> to the boss. Keep attacking!
                </p>
              </motion.div>
            )}
          </div>

          {/* Rewards */}
          <div className="bg-bg-card rounded-lg border border-border p-4">
            <p className="text-xs font-display text-text-secondary mb-3 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-fire-accent" /> Community Rewards (if boss is defeated)
            </p>
            <div className="flex gap-2 flex-wrap">
              {boss.rewards.map((r: string) => (
                <span
                  key={r}
                  className="text-xs font-display px-3 py-1.5 rounded-md bg-fire-accent/10 text-fire-accent border border-fire-accent/20 flex items-center gap-1"
                >
                  <Trophy className="w-3 h-3" /> {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Sidebar */}
        <div className="space-y-4">
          <div className="bg-bg-card rounded-xl border border-border p-4">
            <h3 className="font-display text-sm font-semibold text-text-primary flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-accent-teal" />
              Top Contributors
            </h3>
            <div className="space-y-2">
              {boss.topContributors.map((c: Contributor) => (
                <div
                  key={c.rank}
                  className={`flex items-center gap-3 p-2 rounded-md ${
                    c.isYou ? 'bg-accent-teal/10 border border-accent-teal/20' : 'bg-bg-code'
                  }`}
                >
                  <span className="text-xs font-display text-text-secondary w-4 text-center">
                    {c.rank === 1 ? <Medal className="w-4 h-4 text-yellow-500" /> : c.rank === 2 ? <Medal className="w-4 h-4 text-slate-400" /> : c.rank === 3 ? <Medal className="w-4 h-4 text-amber-600" /> : c.rank}
                  </span>
                  <div className="relative w-7 h-7">
                    <Image src={c.avatar} alt="" fill className="rounded-full border border-border object-cover" />
                  </div>
                  <span className={`text-sm font-body flex-1 ${c.isYou ? 'text-accent-teal font-semibold' : 'text-text-primary'}`}>
                    {c.username}
                  </span>
                  <span className="text-xs font-display text-text-secondary flex items-center gap-1">
                    <Zap className="w-3 h-3 text-fire-accent" />
                    {c.hits}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-xs font-body text-accent-teal hover:text-accent-cyan flex items-center justify-center gap-1 transition-colors">
              View full leaderboard <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-bg-code rounded-lg border border-border p-4">
            <p className="text-xs font-display text-text-primary mb-2">Past Boss Defeats</p>
            {[
              { name: 'The Array Titan', week: 'Week 11', result: 'Defeated 🏆' },
              { name: 'Linked List Hydra', week: 'Week 10', result: 'Defeated 🏆' },
              { name: 'The DP Leviathan', week: 'Week 9', result: 'Survived 💀' },
            ].map(b => (
              <div key={b.week} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-body text-text-primary">{b.name}</p>
                  <span className="text-[10px] bg-bg-card px-1 rounded border border-border text-text-secondary">{b.week}</span>
                </div>
                <span className="text-xs font-display text-text-secondary flex items-center gap-1">
                  {b.result.includes('Defeated') ? <Trophy className="w-3 h-3 text-fire-accent" /> : <Skull className="w-3 h-3 text-text-secondary" />}
                  {b.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
