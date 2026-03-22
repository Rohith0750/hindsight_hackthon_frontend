import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useAuth } from './useAuth';

export const useSubmissions = (problemId?: string) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['submissions', user?.id, problemId],
        queryFn: async () => {
            const all = await api.getSubmissions(user?.id || '');
            if (problemId) {
                return all.filter((s: any) => s.problemId === problemId || s.problem_id === problemId);
            }
            return all;
        },
        enabled: !!user?.id,
    });
};
