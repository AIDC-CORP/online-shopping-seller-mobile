import { useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isSetupCompleted: boolean;
}

interface UseLoginResult {
  login: (email: string, password: string) => Promise<User | null>;
  isLoading: boolean;
  error: string;
  clearError: () => void;
}

/**
 * Custom hook xử lý logic đăng nhập
 * 
 * @example
 * const { login, isLoading, error } = useLogin();
 * 
 * const handleLogin = async () => {
 *   const success = await login(email, password);
 *   if (success) {
 *     // Navigate to home
 *   }
 * };
 */
export const useLogin = (): UseLoginResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (email: string, password: string): Promise<User | null> => {
    // Validate input
    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu');
      return null;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return null;
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return null;
    }

    setIsLoading(true);
    setError('');

    try {
      // Mock login - simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock: Check if user needs setup based on email
      // Email with "new" = needs setup, otherwise already setup
      const needsSetup = email.includes('new');
      
      // Mock user data from API
      const user: User = {
        id: 'u1',
        email: email,
        name: 'Người bán mới',
        isSetupCompleted: !needsSetup, // false if email contains "new"
      };
      
      // Success - could save token to AsyncStorage here
      // await AsyncStorage.setItem('authToken', 'mock-token');
      // await AsyncStorage.setItem('userId', user.id);
      
      setIsLoading(false);
      return user;
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra, vui lòng thử lại');
      setIsLoading(false);
      return null;
    }
  };

  const clearError = () => {
    setError('');
  };

  return {
    login,
    isLoading,
    error,
    clearError,
  };
};

export default useLogin;
