import { useEffect, useState } from "react";
import { getProblems, getProblemById } from "@/api/problem";
import type { Problem } from "@/lib/types";

// 🔥 get all problems
export const useProblems = () => {
  const [data, setData] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await getProblems();

        const formatted = (res as (Problem & { _id?: string })[]).map((p) => ({
          ...p,
          id: p.id || p._id || '',
          slug: p.slug || p.id || p._id || '', // Ensure slug exists
        }));

        setData(formatted);
      } catch (err) {
        console.error("Error fetching problems", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  return { data, isLoading };
};


export const useProblem = (slug: string) => {
  const [data, setData] = useState<Problem | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug || slug === "undefined") {
      console.log("❌ slug missing or undefined string");
      return;
    }

    const fetch = async () => {
      setIsLoading(true);
      console.log("🔥 API CALL:", slug);
      const res = await getProblemById(slug);
      setData(res || undefined);
      setIsLoading(false);
    };

    fetch();
  }, [slug]);

  return { data, isLoading };
};