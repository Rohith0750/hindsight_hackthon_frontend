"use client";

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useStats';
import Link from 'next/link';
import { Brain, Flame, Zap, Trophy, TrendingUp, ArrowRight } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const DashboardPage = () => {
  const { user } = useAuth();
  const {
    stats,
    activities,
    proficiency,
    insights,
    recommended,
    isLoading
  } = useDashboardData() as any;

  const xpPercent = user?.xp ? (user.xp % 1000) / 10 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-teal"></div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 p-4">
      {/* Stats Row */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Trophy, label: 'Problems Solved', value: stats?.problemsSolved ?? 0, color: 'text-accent-teal' },
          { icon: Flame, label: 'Day Streak', value: stats?.streak ?? 0, color: 'text-fire-accent' },
          { icon: TrendingUp, label: 'Accuracy', value: `${stats?.accuracy ?? 0}%`, color: 'text-accent-cyan' },
          { icon: Zap, label: 'XP', value: (stats?.xp ?? 0).toLocaleString(), color: 'text-badge-blue' },
        ].map(s => (
          <div key={s.label} className="bg-bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs font-body text-text-secondary">{s.label}</span>
            </div>
            <p className="font-display text-2xl font-bold text-text-primary">{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* XP Bar */}
      <motion.div variants={item} className="bg-bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-display text-text-primary">{user?.level || 'Beginner'}</span>
          <span className="text-xs font-body text-text-secondary">{user?.xp || 0} XP</span>
        </div>
        <div className="h-2 bg-bg-code rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-accent-teal to-accent-cyan rounded-full"
          />
        </div>
      </motion.div>

      {/* AI Insight Banner */}
      {insights && (
        <motion.div variants={item} className="bg-bg-code rounded-lg p-5 border-l-4 border-fire-accent flex items-start gap-4">
          <Brain className="w-6 h-6 text-fire-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-display text-sm font-semibold text-text-primary">AI Insight</p>
            <p className="font-body text-sm text-text-secondary mt-1">{insights.message}</p>
            <Link href="/problems" className="inline-flex items-center gap-1 mt-3 text-sm font-display text-accent-teal hover:underline">
              View All Problems <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-6">
          {/* Recommended */}
          <motion.div variants={item}>
            <h2 className="font-display text-lg font-semibold text-text-primary mb-3">🎯 Recommended For You</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {(recommended || []).map((p: any) => (
                <Link key={p.id} href={`/problems/${p.slug}`} className="bg-bg-card rounded-lg p-4 border border-border hover:border-accent-teal/40 transition-all hover:translate-x-0.5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-display px-2 py-0.5 rounded ${p.difficulty === 'Easy' ? 'bg-accent-teal/20 text-accent-teal'
                      : p.difficulty === 'Medium' ? 'bg-fire-accent/20 text-fire-accent'
                        : 'bg-destructive/20 text-destructive'
                      }`}>{p.difficulty}</span>
                    <span className="text-xs text-fire-accent font-display">🎯 {p.aiPriority}</span>
                  </div>
                  <h3 className="font-display text-sm font-semibold text-text-primary">{p.title}</h3>
                  <p className="text-xs font-body text-text-secondary mt-1 line-clamp-2">{p.aiReason}</p>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={item}>
            <h2 className="font-display text-lg font-semibold text-text-primary mb-3">Recent Activity</h2>
            <div className="bg-bg-card rounded-lg border border-border divide-y divide-border">
              {(activities || []).length === 0 ? (
                <p className="p-4 text-sm text-text-secondary">No recent activity found.</p>
              ) : (
                (activities || []).map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${s.verdict === 'accepted' ? 'bg-accent-teal' : 'bg-fire-accent'}`} />
                      <span className="text-sm font-body text-text-primary">{s.problem}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-display ${s.verdict === 'accepted' ? 'text-accent-teal' : 'text-fire-accent'}`}>{s.verdict}</span>
                      <span className="text-xs font-body text-text-secondary">{s.language}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Streak */}
          <motion.div variants={item} className="bg-bg-card rounded-lg p-4 border border-border text-center">
            <div className="text-4xl animate-flicker mb-2">🔥</div>
            <p className="font-display text-3xl font-bold text-fire-accent">{stats?.streak ?? 0}</p>
            <p className="text-xs font-body text-text-secondary">Day Streak</p>
          </motion.div>

          {/* Languages */}
          <motion.div variants={item} className="bg-bg-card rounded-lg p-4 border border-border">
            <h3 className="font-display text-sm font-semibold text-text-primary mb-3">Languages</h3>
            <div className="space-y-3">
              {(proficiency || []).map((l: any) => (
                <div key={l.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-body text-text-secondary">{l.name}</span>
                    <span className="text-xs font-display text-text-primary">{l.proficiency}%</span>
                  </div>
                  <div className="h-1.5 bg-bg-code rounded-full overflow-hidden">
                    <div className="h-full bg-accent-teal rounded-full" style={{ width: `${l.proficiency}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export const dynamic = 'force-dynamic';

export default DashboardPage;
