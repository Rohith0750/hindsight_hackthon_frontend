import { useState, useCallback } from 'react';
import type { ChatMessage, CoachResponse } from '@/lib/types';
import { api } from '@/lib/api-client';

export const useAICoach = (problemId: string, userId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'ai', content: `👋 Hey! I've reviewed your history for this problem. Based on your past mistakes, I have some tips ready. What would you like help with?`, timestamp: new Date().toISOString() },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string): Promise<CoachResponse | undefined> => {
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    try {
      const res = await api.sendCoachMessage(content, problemId, userId);
      // Handle hint gate redirect case
      const replyText = res.message || res.response || res.data?.message || '🤔 I had trouble responding. Please try again.';
      const aiMsg: ChatMessage = { id: `ai-${Date.now()}`, role: 'ai', content: replyText, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, aiMsg]);
      return res;
    } catch (err) {
      console.error('Coach Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [problemId, userId]);

  return { messages, sendMessage, isLoading };
};
