import { useEffect, useState } from "react";
import * as statsApi from "@/api/stats";
import { useAuth } from "@/hooks/useAuth";

// 🔹 generic state type
type State<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

// 🔥 reusable fetch hook
const useFetch = <T>(fn: () => Promise<{ data: T }>, key: string, dependencies: unknown[] = []) => {
  const [state, setState] = useState<State<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await fn();
        if (mounted) {
          setState({
            data: res.data,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (mounted) {
          setState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err : new Error(String(err)),
          });
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [key, ...dependencies]);

  return state;
};

//
// 📊 STATS HOOKS
//

export interface UserStats {
  problemsSolved: number;
  accuracy: number;
  streak: number;
  xp: number;
  hintsUsed?: number;
  hintsEarned?: number;
}

export const useUserStats = () => {
  const { user } = useAuth();
  return useFetch<UserStats>(() => statsApi.getUserStats(), "user-stats", [user?.id]);
};

export interface UserActivity {
  problem: string | { title: string };
  verdict: string;
  language: string;
  timestamp: string;
}

export const useUserActivities = () => {
  const { user } = useAuth();
  return useFetch<UserActivity[]>(() => statsApi.getUserActivities(), "user-activities", [user?.id]);
};

export interface UserProficiency {
  name: string;
  proficiency: number;
}

export const useUserProficiency = () => {
  const { user } = useAuth();
  return useFetch<UserProficiency[]>(() => statsApi.getUserProficiency(), "user-proficiency", [user?.id]);
};

export interface InsightBanner {
  message: string;
  type: string;
}

export const useInsightBanner = () => {
  const { user } = useAuth();
  return useFetch<InsightBanner>(() => statsApi.getInsightBanner(), "insight-banner", [user?.id]);
};

export interface RecommendedProblem {
  id: string | number;
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  aiReason: string;
}

export const useRecommendedProblems = () => {
  const { user } = useAuth();
  return useFetch<RecommendedProblem[]>(() => statsApi.getRecommendedProblems(), "recommended-problems", [user?.id]);
};

export const useDashboardData = () => {
  const stats = useUserStats();
  const activities = useUserActivities();
  const proficiency = useUserProficiency();
  const insights = useInsightBanner();
  const recommended = useRecommendedProblems();

  return {
    stats: stats.data,
    activities: activities.data,
    proficiency: proficiency.data,
    insights: insights.data,
    recommended: recommended.data,

    isLoading:
      stats.isLoading ||
      activities.isLoading ||
      proficiency.isLoading ||
      insights.isLoading ||
      recommended.isLoading,
  };
};