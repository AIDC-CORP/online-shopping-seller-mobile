import React from 'react';
import { router } from 'expo-router';
import { LoginScreen } from '../../src/features/auth';
import { useAuth } from '../../src/context/AuthContext';
import { SetupService } from '../../src/services/setup';

export default function Login() {
  const { setUser } = useAuth();

  const handleLogin = async (userData?: any) => {
    // Set user in context
    setUser({
      id: userData?.id || '1',
      email: userData?.email || 'seller@example.com',
      name: userData?.name || 'Test Seller',
      isSetupCompleted: false, // Will check via API
    });

    try {
      // Check if user already has a store
      const hasStore = await SetupService.hasStore();
      
      if (hasStore) {
        console.log('User already has store, redirecting to dashboard');
        router.replace('/(main)/dashboard' as any);
      } else {
        console.log('User does not have store, redirecting to setup');
        router.replace('/setup');
      }
    } catch (error) {
      console.error('Error checking store status:', error);
      // Default to setup on error
      router.replace('/setup');
    }
  };

  return <LoginScreen onLogin={handleLogin} />;
}
