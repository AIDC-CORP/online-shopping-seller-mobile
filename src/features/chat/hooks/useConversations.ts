import { useState, useEffect, useCallback } from 'react';
import ChatService from '../services/chat/ChatService';
import { ChatConversation } from '../services/chat/types';

export function useConversations() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ChatService.getConversations();
      console.log('[useConversations] Fetched conversations:', data);
      console.log('[useConversations] Conversations count:', data.length);
      setConversations(data);
    } catch (err: any) {
      console.error('[useConversations] Error fetching conversations:', err);
      setError(err?.response?.data?.detail || 'Failed to load conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
  };
}
