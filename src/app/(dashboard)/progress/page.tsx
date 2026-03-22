"use client";

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useMistakePatterns } from "@/hooks/useMistakePatterns";
import { useUserProficiency, useUserStats } from "@/hooks/useStats";
import { useSubmissions } from "@/hooks/useSubmissions";
import {
  Trophy,
  Flame,
  TrendingUp,
  Lightbulb,
  Star,
  ChevronDown,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import Link from "next/link";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function ProgressPage() {
  const { user } = useAuth();
  const { data: insightsData, isLoading: insightsLoading } = useMistakePatterns(user?.id || "");
  const { data: proficiencyData } = useUserProficiency();
  const { data: statsData } = useUserStats();
  const { data: pastSubmissions } = useSubmissions();

  const insights = insightsData as any;
  const proficiency = proficiencyData as any;
  const stats = statsData as any;

  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);

  const radarData =
    (proficiency || []).map((l: any) => ({
      subject: l.name || l.language,
      value: l.proficiency || l.solved,
      fullMark: 100,
    })) || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">My Progress</h1>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { icon: Trophy, label: 'Solved', value: stats?.problemsSolved || 0, color: 'text-accent-teal' },
          { icon: Flame, label: 'Streak', value: stats?.streak || 0, color: 'text-fire-accent' },
          { icon: TrendingUp, label: 'Accuracy', value: `${stats?.accuracy || 0}%`, color: 'text-accent-cyan' },
          { icon: Lightbulb, label: 'Hints Used', value: stats?.hintsUsed || 0, color: 'text-yellow-400' },
          { icon: Star, label: 'Hints Earned', value: stats?.hintsEarned || 0, color: 'text-purple-400' },
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mistake Patterns */}
        <motion.div variants={item} className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-semibold text-text-primary">Recurring Mistake Patterns</h2>
            <span className="text-xs font-body px-2 py-0.5 rounded bg-accent-teal/20 text-accent-teal">Hindsight Memory</span>
          </div>
          {insightsLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-bg-card rounded-lg animate-pulse" />)}</div>
          ) : (
            (insights?.patterns || []).map((p: any) => (
              <div key={p._id || p.id} className="bg-bg-card rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedPattern(expandedPattern === p.id ? null : p.id)}
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${p.severity === 'high' ? 'bg-fire-accent' : p.severity === 'medium' ? 'bg-accent-cyan' : 'bg-accent-teal'}`} />
                    <span className="text-sm font-body text-text-primary">{p.name}</span>
                    <span className="text-xs font-display px-1.5 py-0.5 rounded bg-fire-accent/20 text-fire-accent">{p.frequency}x</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${expandedPattern === p.id ? 'rotate-180' : ''}`} />
                </button>
                {expandedPattern === p.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-4 pb-4 border-t border-border pt-3">
                    <div className="flex gap-1 mb-2">
                      {(p.trend || []).map((v: number, i: number) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-bg-code rounded-sm" style={{ height: `${Math.max(v * 12, 4)}px` }}>
                            <div className="w-full h-full bg-fire-accent/60 rounded-sm" />
                          </div>
                          <span className="text-[9px] text-text-secondary">W{i + 1}</span>
                        </div>
                      ))}
                    </div>
                    {p.relatedProblems && p.relatedProblems[0] && (
                      <Link
                        href={`/problems/${p.relatedProblems[0]}`}
                        className="text-xs font-display text-accent-teal hover:underline"
                      >
                        Practice related problems →
                      </Link>
                    )}
                  </motion.div>
                )}
              </div>
            ))
          )}
        </motion.div>

        {/* Radar Chart */}
        <motion.div variants={item} className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-text-primary">Language Proficiency</h2>
          <div className="bg-bg-card rounded-lg border border-border p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(210 30% 18%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(210 22% 62%)', fontSize: 12, fontFamily: 'DM Sans' }} />
                <Radar name="Proficiency" dataKey="value" stroke="hsl(168 72% 42%)" fill="hsl(168 72% 42%)" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Report */}
          <h2 className="font-display text-lg font-semibold text-text-primary mt-4">AI Report Card</h2>
          <div className="grid gap-3">
            {(insights?.insights || []).map((i: any) => (
              <div key={i._id || i.id} className="bg-bg-code rounded-lg p-4 border border-border">
                <p className="text-sm font-display text-text-primary">{i.title}</p>
                <p className="text-xs font-body text-text-secondary mt-1">{i.description}</p>
                {i.actionLink && (
                  <Link href={i.actionLink} className="text-xs font-display text-accent-teal hover:underline mt-2 inline-block">
                    {i.actionLabel} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Submission Timeline */}
      <motion.div variants={item}>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-3">Submission History</h2>
        <div className="relative pl-6 space-y-4">
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
          {!pastSubmissions || pastSubmissions.length === 0 ? (
            <p className="text-sm text-text-secondary">No submissions found.</p>
          ) : (
            (pastSubmissions || []).slice(0, 10).map((s: any) => (
              <div key={s._id || s.id} className="relative flex items-start gap-3">
                <div className={`absolute left-[-16px] w-3 h-3 rounded-full border-2 ${s.verdict === 'accepted' || s.verdict === 'Accepted' ? 'bg-accent-teal border-accent-teal' : 'bg-fire-accent border-fire-accent'
                  }`} />
                <div>
                  <p className="text-sm font-body text-text-primary">{s.problemTitle || s.problem}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-display ${s.verdict === 'accepted' || s.verdict === 'Accepted' ? 'text-accent-teal' : 'text-fire-accent'}`}>{s.verdict}</span>
                    <span className="text-xs font-body text-text-secondary">{s.language}</span>
                    <span className="text-xs font-body text-text-secondary">{new Date(s.createdAt || s.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
