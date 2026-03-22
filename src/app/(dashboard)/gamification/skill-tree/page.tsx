"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  CheckCircle,
  Circle,
  ChevronRight,
  Star,
  BookOpen,
  Database,
  Folder,
  Link as LinkIcon,
  Layers,
  Search,
  Trees,
  Network,
  SortAsc,
  Puzzle,
  LucideIcon
} from 'lucide-react';

import { useSkillTree } from '@/hooks/useGamification';
import { SkillNode } from '@/lib/types';

const ICON_MAP: Record<string, LucideIcon> = {
  Package: Database,
  Folder: Folder,
  Link: LinkIcon,
  BookOpen: Layers,
  Search: Search,
  TreePalm: Trees,
  Trees: Trees,
  Network: Network,
  Hammer: SortAsc,
  Puzzle: Puzzle
};

const STATUS_CONFIG = {
  mastered: { label: 'Mastered', color: 'text-accent-teal', bg: 'bg-accent-teal/20', border: 'border-accent-teal/50', icon: CheckCircle },
  'in-progress': { label: 'In Progress', color: 'text-fire-accent', bg: 'bg-fire-accent/20', border: 'border-fire-accent/50', icon: Circle },
  available: { label: 'Available', color: 'text-badge-blue', bg: 'bg-badge-blue/20', border: 'border-badge-blue/50', icon: BookOpen },
  locked: { label: 'Locked', color: 'text-text-secondary', bg: 'bg-bg-code', border: 'border-border', icon: Lock },
};

const TIER_LABELS = ['Fundamentals', 'Data Structures', 'Advanced Logic', 'System Design', 'Mastery'];

export default function SkillTreePage() {
  const { data: skillTree, isLoading } = useSkillTree();
  const [selected, setSelected] = useState<SkillNode | null>(null);

  if (isLoading || !skillTree) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal" />
      </div>
    );
  }

  const tiers = TIER_LABELS.map((label, idx) => ({
    label,
    nodes: skillTree.filter(n => n.tier === idx),
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary flex items-center gap-2">
            <Star className="w-6 h-6 text-fire-accent" />
            Skill Tree
          </h1>
          <p className="text-sm font-body text-text-secondary mt-1">
            Unlock advanced topics only after mastering the fundamentals
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-display text-text-secondary">Overall Mastery</p>
          <p className="font-display text-lg font-bold text-accent-teal">
            {skillTree.filter((n: SkillNode) => n.status === 'mastered').length}/{skillTree.length} topics
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Tree */}
        <div className="space-y-6">
          {tiers.map((tier, tierIdx) => (
            <div key={tier.label}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-display text-text-secondary px-2 py-0.5 rounded bg-bg-code border border-border">
                  Tier {tierIdx}
                </span>
                <span className="text-xs font-display text-text-primary">{tier.label}</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {tierIdx > 0 && (
                <div className="flex justify-center mb-2">
                  <div className="w-px h-4 bg-border" />
                </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tier.nodes.map(node => {
                  const cfg = STATUS_CONFIG[node.status];
                  const pct = Math.round((node.xpEarned / node.xpRequired) * 100);
                  return (
                    <motion.button
                      key={node.id}
                      whileHover={{ scale: node.status === 'locked' ? 1 : 1.02 }}
                      whileTap={{ scale: node.status === 'locked' ? 1 : 0.98 }}
                      onClick={() => node.status !== 'locked' && setSelected(node)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${cfg.bg} ${cfg.border} ${
                        node.status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'
                      } ${selected?.id === node.id ? 'ring-2 ring-accent-cyan ring-offset-2 ring-offset-bg-main' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-12 h-12 rounded-xl bg-bg-code border-2 border-border flex items-center justify-center text-accent-teal mb-2 group-hover:border-accent-teal/50 transition-colors">
                          {node.icon && ICON_MAP[node.icon] ? (
                            (() => {
                              const Icon = ICON_MAP[node.icon];
                              return <Icon className="w-6 h-6" />;
                            })()
                          ) : (
                            <Database className="w-6 h-6" />
                          )}
                        </div>
                        <cfg.icon className={`w-4 h-4 ${cfg.color} mt-1`} />
                      </div>
                      <p className="font-display text-sm font-semibold text-text-primary">{node.title}</p>
                      <p className="text-xs font-body text-text-secondary mt-1">{node.problemCount} problems</p>

                      {/* XP bar */}
                      <div className="mt-2">
                        <div className="h-1.5 bg-bg-code rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              node.status === 'mastered' ? 'bg-accent-teal' : 'bg-fire-accent'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-xs font-code text-text-secondary mt-1">{node.xpEarned}/{node.xpRequired} XP</p>
                      </div>

                      <span className={`text-xs font-display mt-2 inline-block ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="space-y-4">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-bg-card rounded-xl border border-border p-5"
            >
              <div className="text-3xl mb-2">{selected.icon}</div>
              <h3 className="font-display text-base font-bold text-text-primary">{selected.title}</h3>
              <span className={`text-xs font-display mt-1 inline-block px-2 py-0.5 rounded ${STATUS_CONFIG[selected.status].bg} ${STATUS_CONFIG[selected.status].color}`}>
                {STATUS_CONFIG[selected.status].label}
              </span>
              <p className="text-sm font-body text-text-secondary mt-3">{selected.description}</p>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-body">
                  <span className="text-text-secondary">XP Progress</span>
                  <span className="text-text-primary">{selected.xpEarned} / {selected.xpRequired}</span>
                </div>
                <div className="h-2 bg-bg-code rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-teal rounded-full transition-all"
                    style={{ width: `${Math.round((selected.xpEarned / selected.xpRequired) * 100)}%` }}
                  />
                </div>
              </div>

              {selected.prerequisites.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-display text-text-secondary mb-1">Prerequisites</p>
                  <div className="flex gap-1 flex-wrap">
                    {selected.prerequisites.map(p => {
                      const prereq = skillTree.find((n: SkillNode) => n.id === p);
                      if (!prereq) return null;
                      const Icon = prereq.icon && ICON_MAP[prereq.icon] ? ICON_MAP[prereq.icon] : Database;
                      return (
                        <span key={p} className="text-xs font-body px-2 py-0.5 rounded bg-bg-code border border-border text-text-secondary flex items-center gap-1">
                          <Icon className="w-3 h-3" /> {prereq.title}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <button className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-md bg-accent-teal text-bg-main text-sm font-display font-semibold hover:bg-accent-teal/80 transition-colors">
                Practice Problems <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <div className="bg-bg-card rounded-xl border border-border p-5 text-center">
              <Star className="w-8 h-8 text-text-secondary mx-auto mb-2" />
              <p className="text-sm font-body text-text-secondary">Select an unlocked skill node to see details</p>
            </div>
          )}

          {/* Legend */}
          <div className="bg-bg-code rounded-lg border border-border p-4">
            <p className="text-xs font-display text-text-primary mb-3">Legend</p>
            <div className="space-y-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2">
                  <cfg.icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                  <span className="text-xs font-body text-text-secondary">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
