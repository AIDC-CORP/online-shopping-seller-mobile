import { SetupScreen } from '@/src/features/setup';
import { useRouter } from 'expo-router';
import type { SetupData } from '@/src/features/setup/screens/SetupScreen';

export default function Setup() {
  const router = useRouter();

  const handleComplete = (data: SetupData) => {
    // TODO: Save setup data to backend/storage
    console.log('Setup completed with data:', data);
    
    // Mock: Save isSetupCompleted flag
    // In real app: API call to save user data
    
    // Navigate to main app
    router.replace('/(main)/dashboard');
  };

  return <SetupScreen onComplete={handleComplete} />;
}
