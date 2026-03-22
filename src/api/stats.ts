import apiClient from "@/lib/apiClient";

// 🔐 User Stats — requires auth token (sent by apiClient interceptor)
export const getUserStats = async (_userId: string) => {
  try {
    const res = await apiClient.get("/stats/user/stats");
    return res;
  } catch (err) {
    return { data: { problemsSolved: 0, accuracy: 0, streak: 0, xp: 0 } };
  }
};

export const getInsightBanner = async (_userId: string) => {
  try {
    const res = await apiClient.get("/stats/insights/banner");
    return res;
  } catch {
    return { data: { message: "Keep coding to unlock AI insights!", type: "hint" } };
  }
};

export const getUserActivities = async (_userId: string) => {
  try {
    const res = await apiClient.get("/stats/user/activities");
    return res;
  } catch {
    return { data: [] };
  }
};

export const getUserProficiency = async (_userId: string) => {
  try {
    const res = await apiClient.get("/stats/user/proficiency");
    return res;
  } catch {
    return { data: [] };
  }
};

export const getRecommendedProblems = async (_userId: string) => {
  try {
    const res = await apiClient.get("/stats/problems/recommended");
    return res;
  } catch {
    // Fallback: fetch all problems and return high-priority ones
    try {
      const res = await apiClient.get("/problem");
      const problems = res.data || [];
      const recommended = problems.slice(0, 3).map((p: any) => ({
        id: p._id || p.id,
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        aiPriority: "High",
        aiReason: "Based on your current level",
      }));
      return { data: recommended };
    } catch {
      return { data: [] };
    }
  }
};