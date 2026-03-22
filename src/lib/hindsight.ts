import axios from 'axios';
import type { MistakeEvent, MistakePattern, Insight, Problem, SessionSummary, CoachContext } from './types';
import { MISTAKE_PATTERNS, PROBLEMS } from './mock-data';

// ✅ All hindsight endpoints now served by the consolidated backend
const BACKEND_URL = 'http://localhost:9090/api/v1';

export const hindsightClient = {
  /** Store a mistake after wrong submission */
  storeMistake: async (userId: string, mistake: MistakeEvent): Promise<void> => {
    try {
      await axios.post(`${BACKEND_URL}/hindsight/mistake`, { userId, mistake });
    } catch (err) {
      console.error('[Hindsight] Failed to store mistake:', err);
    }
  },

  /** Retrieve user's mistake patterns */
  getMistakePatterns: async (userId: string): Promise<MistakePattern[]> => {
    try {
      const res = await axios.get(`${BACKEND_URL}/hindsight/patterns/${userId}`);
      return res.data;
    } catch {
      return MISTAKE_PATTERNS;
    }
  },

  /** Get AI-generated insights based on memory */
  getPersonalizedInsights: async (userId: string): Promise<Insight[]> => {
    try {
      const res = await axios.get(`${BACKEND_URL}/hindsight/insights/${userId}`);
      // Backend returns a single insight object — wrap in array for frontend
      const d = res.data;
      if (Array.isArray(d)) return d;
      return [{ id: 'i-1', title: 'Hindsight Insight', description: d.message, severity: d.type === 'positive' ? 'low' : 'medium', actionLabel: 'View Problems', actionLink: '/problems' }];
    } catch {
      return [
        { id: 'i-1', title: 'Binary Search Mastery Needed', description: "You've failed several binary search problems. Focus on boundary conditions.", severity: 'high', actionLabel: 'Practice Now', actionLink: '/problems/3' },
      ];
    }
  },

  /** Get recommended problems based on weak areas */
  getRecommendedProblems: async (_userId: string): Promise<Problem[]> => {
    try {
      const res = await axios.get(`${BACKEND_URL}/stats/problems/recommended`);
      return res.data;
    } catch {
      return PROBLEMS.filter(p => p.aiPriority === 'High').slice(0, 3);
    }
  },

  /** Store a coding session summary */
  storeSession: async (userId: string, session: SessionSummary): Promise<void> => {
    try {
      await axios.post(`${BACKEND_URL}/session/end`, { user_id: userId, ...session });
    } catch (err) {
      console.error('[Hindsight] Failed to store session:', err);
    }
  },

  /** Query memory for AI coach context */
  getCoachContext: async (_userId: string, _problemId: string): Promise<CoachContext> => {
    return {
      recentMistakes: MISTAKE_PATTERNS.slice(0, 3),
      personalizedTips: ['You tend to skip edge cases — check for empty input', 'Your binary search boundaries are often off by one'],
    };
  },
};
