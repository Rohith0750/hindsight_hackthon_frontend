import { useEffect, useState } from "react";
import * as statsApi from "@/api/stats";
import { useAuth } from "@/hooks/useAuth";

// 🔹 generic state type
type State<T> = {
  data: T | null;
  isLoading: boolean;
  error: any;
};

// 🔥 reusable fetch hook
const useFetch = <T,>(fn: () => Promise<any>, key: string, dependencies: any[] = []) => {
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
            error: err,
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

export const useUserStats = () => {
  const { user } = useAuth();
  return useFetch(() => statsApi.getUserStats(user?.id || ""), "user-stats", [user?.id]);
};

export const useUserActivities = () => {
  const { user } = useAuth();
  return useFetch(() => statsApi.getUserActivities(user?.id || ""), "user-activities", [user?.id]);
};

export const useUserProficiency = () => {
  const { user } = useAuth();
  return useFetch(() => statsApi.getUserProficiency(user?.id || ""), "user-proficiency", [user?.id]);
};

export const useInsightBanner = () => {
  const { user } = useAuth();
  return useFetch(() => statsApi.getInsightBanner(user?.id || ""), "insight-banner", [user?.id]);
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
  return useFetch<RecommendedProblem[]>(() => statsApi.getRecommendedProblems(user?.id || ""), "recommended-problems", [user?.id]);
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