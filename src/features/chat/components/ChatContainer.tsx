import React, { useState } from 'react';
import { ChatScreen, ChatDetailScreen } from '../index';

/**
 * ChatContainer - Demo component showing both ChatScreen and ChatDetailScreen
 * 
 * Usage in your app:
 * 1. Import: import { ChatScreen } from '@/src/features/chat';
 * 2. Use in navigation or as a tab screen
 */
const ChatContainer: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  if (selectedChatId) {
    return (
      <ChatDetailScreen
        chatId={selectedChatId}
        onBack={() => setSelectedChatId(null)}
      />
    );
  }

  return <ChatScreen />;
};

export default ChatContainer;
