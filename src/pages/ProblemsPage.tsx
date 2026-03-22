"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProblems } from '@/hooks/useProblems';
import Link from 'next/link';
import { Search, Target } from 'lucide-react';

const difficulties = ['All', 'Easy', 'Medium', 'Hard'] as const;

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

const ProblemsPage = () => {
  const { data: problems, isLoading } = useProblems();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string>('All');
  const [aiPicks, setAiPicks] = useState(false);

  const filtered = problems?.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (difficulty !== 'All' && p.difficulty !== difficulty) return false;
    if (aiPicks && !p.aiPriority) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-text-primary">Problems</h1>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md bg-bg-card border border-border text-text-primary font-body text-sm placeholder:text-text-secondary/60 focus:outline-none focus:border-accent-teal transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-md text-xs font-display border transition-colors ${difficulty === d ? 'bg-accent-teal/20 border-accent-teal text-accent-teal' : 'border-border text-text-secondary hover:text-text-primary'
                }`}
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => setAiPicks(!aiPicks)}
            className={`px-3 py-1.5 rounded-md text-xs font-display border flex items-center gap-1 transition-colors ${aiPicks ? 'bg-fire-accent/20 border-fire-accent text-fire-accent' : 'border-border text-text-secondary hover:text-text-primary'
              }`}
          >
            <Target className="w-3 h-3" /> AI Picks
          </button>
        </div>
      </div>

      {aiPicks && (
        <div className="bg-bg-code rounded-lg p-3 border-l-4 border-fire-accent">
          <p className="text-sm font-body text-text-secondary">🎯 Showing AI-selected problems based on your mistake patterns</p>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-bg-card rounded-lg animate-pulse" />
        ))}</div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="bg-bg-card rounded-lg border border-border overflow-hidden">
          <div className="hidden sm:grid grid-cols-[40px_1fr_80px_140px_80px_80px] gap-2 px-4 py-2.5 border-b border-border text-xs font-display text-text-secondary">
            <span>#</span><span>Title</span><span>Difficulty</span><span>Tags</span><span>Accept</span><span>Priority</span>
          </div>
          {filtered?.map(p => (
            <motion.div key={p.id} variants={item}>
              <Link
                href={`/problems/${p.id}`}
                className="grid sm:grid-cols-[40px_1fr_80px_140px_80px_80px] gap-2 px-4 py-3 border-b border-border/50 hover:bg-bg-code/50 hover:border-l-2 hover:border-l-accent-teal transition-all items-center"
              >
                <span className="text-xs font-code text-text-secondary">{p.id}</span>
                <div>
                  <span className="text-sm font-body text-text-primary">{p.title}</span>
                  {p.status === 'solved' && <span className="ml-2 text-accent-teal text-xs">✓</span>}
                </div>
                <span className={`text-xs font-display px-2 py-0.5 rounded w-fit ${p.difficulty === 'Easy' ? 'bg-accent-teal/20 text-accent-teal'
                    : p.difficulty === 'Medium' ? 'bg-fire-accent/20 text-fire-accent'
                      : 'bg-destructive/20 text-destructive'
                  }`}>{p.difficulty}</span>
                <div className="flex gap-1 flex-wrap">
                  {p.tags.slice(0, 2).map((t: string, i: number) => (
                    <span key={i} className="text-xs font-body px-1.5 py-0.5 rounded bg-bg-code text-text-secondary">{t}</span>
                  ))}
                </div>
                <span className="text-xs font-code text-text-secondary">{p.acceptance}%</span>
                <span className="text-xs font-display">
                  {p.aiPriority === 'High' ? '🎯 High' : p.aiPriority === 'Medium' ? '⭐ Med' : '—'}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export const getServerSideProps = async () => ({ props: {} });

export const dynamic = 'force-dynamic';

export default ProblemsPage;
