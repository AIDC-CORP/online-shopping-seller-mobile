import { SetupScreen } from '../src/features/setup';
import { useRouter } from 'expo-router';
import type { SetupData } from '../src/features/setup';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SetupService } from '@/services/setup';

export default function Setup() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user already has a store on mount
  useEffect(() => {
    const checkExistingStore = async () => {
      try {
        const hasStore = await SetupService.hasStore();
        
        if (hasStore) {
          console.log('User already has store, redirecting to dashboard');
          router.replace('/(main)/dashboard');
        }
      } catch (error) {
        console.error('Error checking existing store:', error);
        // Continue to setup screen on error
      }
    };

    checkExistingStore();
  }, [router]);

  const handleComplete = async (data: SetupData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      console.log('Creating store profile...');

      // Create store profile with backend API using SetupService
      const storeProfile = await SetupService.createStoreFromSetupData(data);

      console.log('Store created successfully:', storeProfile);

      // Navigate to main app immediately after successful creation
      router.replace('/(main)/dashboard');

      // Show success message after navigation (non-blocking)
      setTimeout(() => {
        Alert.alert(
          'Thành công! 🎉',
          `Cửa hàng "${storeProfile.store_name}" đã được tạo. Chào mừng bạn đến với Green Market!`,
          [{ text: 'OK' }]
        );
      }, 500);

    } catch (error: any) {
      console.error('Failed to create store:', error);
      
      // Show error message
      Alert.alert(
        'Lỗi tạo cửa hàng',
        error.message || 'Không thể tạo cửa hàng. Vui lòng thử lại.',
        [
          { text: 'OK' }
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return <SetupScreen onComplete={handleComplete} isSubmitting={isSubmitting} />;
}
