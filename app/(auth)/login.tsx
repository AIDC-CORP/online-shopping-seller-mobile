import React from 'react';
import { router } from 'expo-router';
import LoginScreen from '@/src/features/auth/LoginScreen';

export default function Login() {
  const handleLogin = () => {
    router.replace('/(main)/dashboard' as any);
  };

  return <LoginScreen onLogin={handleLogin} />;
}
