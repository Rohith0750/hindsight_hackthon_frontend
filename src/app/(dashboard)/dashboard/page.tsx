"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  useUserStats,
  useInsightBanner,
  useUserActivities,
  useRecommendedProblems,
} from "@/hooks/useStats";
import Link from "next/link";
import {
  Brain,
  Flame,
  Zap,
  Trophy,
  TrendingUp,
} from "lucide-react";

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { user } = useAuth();

  // ✅ API hooks
  const { data: stats } = useUserStats();
  const { data: insights } = useInsightBanner();
  const { data: activities } = useUserActivities();
  const { data: recommended } = useRecommendedProblems();

  // ✅ fallback (safe)
  const profile = stats || {
    problemsSolved: 0,
    accuracy: 0,
    streak: 0,
    languages: [],
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* 🔥 Stats Row */}
      <motion.div
        variants={item}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            icon: Trophy,
            label: "Problems Solved",
            value: profile.problemsSolved,
            color: "text-accent-teal",
          },
          {
            icon: Flame,
            label: "Day Streak",
            value: profile.streak,
            color: "text-fire-accent",
          },
          {
            icon: TrendingUp,
            label: "Accuracy",
            value: `${profile.accuracy || 0}%`,
            color: "text-accent-cyan",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-bg-card rounded-lg p-4 border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-text-secondary">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* 🤖 AI Insight */}
      {insights && (
        <motion.div
          variants={item}
          className="bg-bg-code rounded-lg p-5 border-l-4 border-fire-accent flex gap-4"
        >
          <Brain className="w-6 h-6 text-fire-accent" />
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {insights.message}
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          {/* 🔥 Recommended */}
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold mb-3">
              Recommended For You
            </h2>

            {recommended?.length === 0 ? (
              <p className="text-sm text-text-secondary">
                No recommendations yet. Solve more problems 🚀
              </p>
            ) : (
              <div className="grid sm:grid-cols-3 gap-4">
                {recommended?.slice(0, 3).map((p: any) => (
                  <Link
                    key={p.id}
                    href={`/problems/${p.slug}`} // ✅ slug fix
                    className="bg-bg-card p-4 border rounded-lg hover:border-accent-teal/40 transition"
                  >
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-fire-accent/20 text-fire-accent">
                        {p.difficulty}
                      </span>
                      <span className="text-xs flex items-center gap-1 text-fire-accent">
                        <Zap className="w-3 h-3" /> High
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold">{p.title}</h3>

                    <p className="text-xs text-text-secondary mt-1">
                      {p.aiReason || "Recommended for you"}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* 📊 Recent Activity */}
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold mb-3">
              Recent Activity
            </h2>

            <div className="bg-bg-card border rounded-lg divide-y">
              {activities?.slice(0, 5).map((s: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between px-4 py-3"
                >
                  <div className="flex gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        s.verdict === "accepted"
                          ? "bg-accent-teal"
                          : "bg-fire-accent"
                      }`}
                    />
                    <span className="text-sm">{s.problem}</span> {/* ✅ FIX */}
                  </div>

                  <div className="flex gap-3">
                    <span className="text-xs">{s.verdict}</span>
                    <span className="text-xs text-text-secondary">
                      {s.language}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* 🔥 Streak */}
          <motion.div
            variants={item}
            className="bg-bg-card p-4 border rounded-lg text-center"
          >
            <Flame className="w-10 h-10 text-fire-accent mx-auto" />
            <p className="text-3xl font-bold text-fire-accent">
              {profile.streak}
            </p>
            <p className="text-xs text-text-secondary">Day Streak</p>
          </motion.div>

          {/* 💻 Languages */}
          <motion.div
            variants={item}
            className="bg-bg-card p-4 border rounded-lg"
          >
            <h3 className="text-sm font-semibold mb-3">Languages</h3>

            {profile.languages?.map((l: any) => (
              <div key={l.name} className="mb-2">
                <div className="flex justify-between text-xs">
                  <span>{l.name}</span>
                  <span>{l.proficiency}%</span>
                </div>
                <div className="h-1.5 bg-bg-code rounded">
                  <div
                    className="h-full bg-accent-teal"
                    style={{ width: `${l.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}