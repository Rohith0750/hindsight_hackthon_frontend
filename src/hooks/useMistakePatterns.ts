import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export const useMistakePatterns = (userId: string) =>
  useQuery({ queryKey: ['insights', userId], queryFn: () => api.getInsights(userId), enabled: !!userId });
