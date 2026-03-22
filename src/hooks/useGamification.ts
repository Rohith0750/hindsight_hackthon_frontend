import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export const useBoss = () => 
  useQuery({ queryKey: ['boss'], queryFn: api.getBoss });

export const useSkillTree = () => 
  useQuery({ queryKey: ['skill-tree'], queryFn: api.getSkillTree });

export const useStreaks = () => 
  useQuery({ queryKey: ['streaks'], queryFn: api.getStreakActivity });
