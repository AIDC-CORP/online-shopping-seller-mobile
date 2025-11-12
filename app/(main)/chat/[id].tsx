import { ChatDetailScreen } from '../../../src/features/chat';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ChatDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleBack = () => {
    // Always go back to chat list, not dashboard
    router.replace('/(main)/chat');
  };

  return (
    <ChatDetailScreen 
      chatId={id} 
      onBack={handleBack} 
    />
  );
}
