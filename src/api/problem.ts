import apiClient from "@/lib/apiClient";

export const getProblems = async () => {
  const res = await apiClient.get("/problem");
  return res.data;
};

export const getProblemById = async (slug: string) => {
  if (!slug || slug === "undefined") {
    console.error("getProblemById called with invalid slug:", slug);
    return null;
  }
  const res = await apiClient.get(`/problem/${slug}`);
  return res.data;
};