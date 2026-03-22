"use client";

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useState } from 'react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } };

const LearningPathPage = () => {
  const { data: nodes, isLoading } = useQuery({ queryKey: ['learning-path'], queryFn: api.getLearningPath });
  const [selected, setSelected] = useState<string | null>(null);
  const selectedNode = nodes?.find(n => n.id === selected);

  if (isLoading) return <div className="flex items-center justify-center h-96"><div className="w-8 h-8 border-2 border-accent-teal border-t-transparent rounded-full animate-spin" /></div>;

  const completedCount = nodes?.filter(n => n.status === 'completed').length || 0;
  const totalCount = nodes?.length || 1;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Your AI-Customized Learning Path</h1>
          <span className="text-xs font-body px-2 py-0.5 rounded bg-badge-blue/20 text-badge-blue mt-1 inline-block">Personalized for you</span>
        </div>
        <div className="text-right">
          <p className="font-display text-sm text-text-secondary">{completedCount}/{totalCount} completed</p>
          <div className="w-32 h-2 bg-bg-code rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-accent-teal rounded-full" style={{ width: `${(completedCount / totalCount) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Path visualization */}
        <div className="bg-bg-card rounded-lg border border-border p-6 relative min-h-[600px]">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {nodes?.map(node =>
              node.connections.map(connId => {
                const target = nodes.find(n => n.id === connId);
                if (!target) return null;
                return (
                  <line
                    key={`${node.id}-${connId}`}
                    x1={`${node.x}%`} y1={`${node.y}%`}
                    x2={`${target.x}%`} y2={`${target.y}%`}
                    stroke="hsl(210 30% 18%)"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                );
              })
            )}
          </svg>
          <motion.div variants={container} initial="hidden" animate="show" className="relative" style={{ zIndex: 1 }}>
            {nodes?.map(node => (
              <motion.button
                key={node.id}
                variants={item}
                onClick={() => setSelected(node.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-display border-2 transition-all ${
                  node.status === 'completed'
                    ? 'bg-accent-teal border-accent-teal text-bg-main'
                    : node.status === 'current'
                    ? 'bg-bg-code border-accent-teal text-accent-teal animate-pulse-glow'
                    : 'bg-bg-code border-border text-text-secondary'
                } ${selected === node.id ? 'ring-2 ring-accent-cyan ring-offset-2 ring-offset-bg-card' : ''}`}>
                  {node.status === 'completed' ? '✓' : node.status === 'current' ? '→' : '🔒'}
                </div>
                <span className={`text-[10px] font-body whitespace-nowrap ${
                  node.status === 'locked' ? 'text-text-secondary/60' : 'text-text-secondary'
                }`}>{node.title}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {selectedNode ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-bg-card rounded-lg border border-border p-4">
              <h3 className="font-display text-sm font-semibold text-text-primary">{selectedNode.title}</h3>
              <span className={`text-xs font-display mt-1 inline-block px-2 py-0.5 rounded ${
                selectedNode.status === 'completed' ? 'bg-accent-teal/20 text-accent-teal'
                : selectedNode.status === 'current' ? 'bg-accent-cyan/20 text-accent-cyan'
                : 'bg-bg-code text-text-secondary'
              }`}>{selectedNode.status}</span>
              <p className="text-xs font-body text-text-secondary mt-2">
                {selectedNode.problemIds.length} problem{selectedNode.problemIds.length !== 1 ? 's' : ''} in this topic
              </p>
            </motion.div>
          ) : (
            <div className="bg-bg-card rounded-lg border border-border p-4 text-center">
              <p className="text-xs font-body text-text-secondary">Click a node to see details</p>
            </div>
          )}

          <div className="bg-bg-code rounded-lg border border-border p-4">
            <p className="text-xs font-display text-text-primary mb-2">Estimated Completion</p>
            <p className="font-display text-lg font-bold text-accent-teal">~3 weeks</p>
            <p className="text-xs font-body text-text-secondary mt-1">Based on your current pace of 2.5 problems/day</p>
          </div>

          <div>
            <p className="text-xs font-display text-text-primary mb-2">Alternative Paths</p>
            {['Speed Run: Arrays → DP', 'Interview Prep: Top 50', 'Deep Dive: Graph Theory'].map(path => (
              <div key={path} className="bg-bg-card rounded-lg border border-border p-3 mb-2 hover:border-accent-teal/40 transition-colors cursor-pointer">
                <p className="text-xs font-body text-text-secondary">{path}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const getServerSideProps = async () => ({ props: {} });

export const dynamic = 'force-dynamic';

export default LearningPathPage;
