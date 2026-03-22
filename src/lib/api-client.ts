import axios from 'axios';
import type { Problem, MistakePattern, Insight, LearningPathNode, Submission, SkillNode, StreakActivity, Boss } from './types';
import { LEARNING_PATH_NODES, BOSS_DATA, SKILL_TREE_DATA, STREAK_ACTIVITY, SUBMISSIONS } from './mock-data';
import { hindsightClient } from './hindsight';

// ✅ Single consolidated backend at port 9090
const MAIN_API = process.env.NEXT_PUBLIC_API_URL ?? 'https://hindsight-hackthon-backend.onrender.com/api/v1';

const mainClient = axios.create({ baseURL: MAIN_API });

// Attach JWT to all requests
const addAuth = (config: any) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};
mainClient.interceptors.request.use(addAuth);

export const api = {
  // ─── Problems ───────────────────────────────────────────────────────────────
  getProblems: async (): Promise<Problem[]> => {
    const res = await mainClient.get('/problem');
    return res.data;
  },

  getProblem: async (id: string): Promise<Problem | undefined> => {
    const res = await mainClient.get(`/problem/${id}`);
    return res.data;
  },

  // ─── Session ────────────────────────────────────────────────────────────────
  startSession: async (userId: string, problemId: string, title: string, topic: string) => {
    try {
      return mainClient.post('/session/start', { user_id: userId, problem_id: problemId, problem_title: title, topic });
    } catch { return null; }
  },

  endSession: async (userId: string, data: any) => {
    try {
      return mainClient.post('/session/end', { user_id: userId, ...data });
    } catch { return null; }
  },

  // ─── Hint Gate ──────────────────────────────────────────────────────────────
  requestHintGate: async (userId: string, title: string, topic: string) => {
    const res = await mainClient.post('/hint/request', { user_id: userId, problem_title: title, topic });
    return res.data;
  },

  submitHintAnswer: async (userId: string, questionIndex: number, answer: string) => {
    const res = await mainClient.post('/hint/answer', { user_id: userId, question_index: questionIndex, answer });
    return res.data;
  },

  // ─── Code Execution ─────────────────────────────────────────────────────────
  runCode: async (code: string, language: string): Promise<any> => {
    const res = await mainClient.post('/code/run', { code, language });
    return res.data;
  },

  // Full judge: runs all test cases, stores result, updates XP
  submitCode: async (problemId: string, code: string, language: string, userId?: string, isDryRun?: boolean): Promise<any> => {
    const res = await mainClient.post('/submission/judge', {
      user_id: userId || 'guest',
      problem_id: problemId,
      code,
      language,
      is_dry_run: isDryRun,
    });
    return res.data;
  },

  getSubmissions: async (userId?: string): Promise<Submission[]> => {
    try {
      const url = userId ? `/submission/user/${userId}` : '/submission';
      const res = await mainClient.get(url);
      return res.data;
    } catch {
      return SUBMISSIONS;
    }
  },

  // ─── AI Coach Chat ───────────────────────────────────────────────────────────
  sendCoachMessage: async (message: string, problemId: string, userId: string, history: any[] = []): Promise<any> => {
    const res = await mainClient.post('/chat/message', {
      user_id: userId, message, conversation_history: history, problem_id: problemId,
    });
    return res.data;
  },

  // ─── Hindsight AI Insights ───────────────────────────────────────────────────
  getInsights: async (userId: string): Promise<{ patterns: MistakePattern[]; insights: Insight[] }> => {
    const [patterns, insights] = await Promise.all([
      hindsightClient.getMistakePatterns(userId),
      hindsightClient.getPersonalizedInsights(userId),
    ]);
    return { patterns, insights };
  },

  // ─── Streak Activity (heatmap) ───────────────────────────────────────────────
  getStreakActivity: async (_userId: string): Promise<StreakActivity[]> => {
    try {
      const res = await mainClient.get('/stats/streak-activity');
      return res.data;
    } catch { return STREAK_ACTIVITY; }
  },

  // ─── Gamification (fallback to mocks — not used) ─────────────────────────────
  getLearningPath: async (): Promise<LearningPathNode[]> => {
    return LEARNING_PATH_NODES;
  },

  getBoss: async (): Promise<Boss> => {
    return BOSS_DATA;
  },

  getSkillTree: async (): Promise<SkillNode[]> => {
    return SKILL_TREE_DATA;
  },
};
