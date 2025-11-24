import { useState, useEffect, useCallback, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import ChatService from '../../../services/chat/ChatService';
import { ChatMessage, SendMessageRequest } from '../../../services/chat/types';

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ChatService.getMessages(conversationId);
      setMessages(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // Initialize WebSocket
  const connectWebSocket = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        console.error('[useChat] No access token found');
        return;
      }

      const ws = ChatService.createWebSocket(conversationId, token);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[useChat] WebSocket connected for conversation:', conversationId);
      };

      ws.onmessage = (event) => {
        try {
          console.log('[Seller WebSocket] Received message:', event.data);
          const wsMessage = JSON.parse(event.data);
          
          // Only add messages from customer (not our own echoed messages)
          const senderType = wsMessage.senderType || wsMessage.sender_type;
          if (senderType === 'customer') {
            const newMessage: ChatMessage = {
              id: wsMessage.id,
              senderId: wsMessage.senderId || wsMessage.sender_id,
              senderType: 'customer',
              text: wsMessage.text,
              attachments: wsMessage.attachments,
              timestamp: wsMessage.timestamp || wsMessage.created_at || new Date().toISOString(),
            };
            console.log('[Seller WebSocket] Adding customer message:', newMessage);
            setMessages((prev) => [...prev, newMessage]);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };
    } catch (err) {
      console.error('Error connecting WebSocket:', err);
    }
  }, [conversationId]);

  // Send message
  const sendMessage = useCallback(async (text: string, attachments?: any[]) => {
    if (!text.trim() && !attachments?.length) return;

    try {
      setSending(true);
      const message: SendMessageRequest = {
        type: 'message',
        text: text.trim(),
        attachments,
      };

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log('[useChat] Sending message via WebSocket:', message);
        ChatService.sendWebSocketMessage(wsRef.current, message);
      } else {
        const state = wsRef.current?.readyState;
        console.error('[useChat] WebSocket not ready. State:', state);
        throw new Error(`WebSocket not connected (state: ${state})`);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  }, []);

  // Initialize
  useEffect(() => {
    fetchMessages();
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [fetchMessages, connectWebSocket]);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    refetch: fetchMessages,
  };
}
