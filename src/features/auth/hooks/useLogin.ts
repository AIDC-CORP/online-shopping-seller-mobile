import { useState } from 'react';

interface UseLoginResult {
  login: (email: string, password: string) => Promise<boolean>;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    // Validate input
    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return false;
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    setIsLoading(true);
    setError('');

    try {
      // Mock login - simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any valid email/password
      // In production, replace with actual API call
      if (email && password) {
        // Success - could save token to AsyncStorage here
        // await AsyncStorage.setItem('authToken', 'mock-token');
        setIsLoading(false);
        return true;
      } else {
        setError('Đăng nhập thất bại');
        setIsLoading(false);
        return false;
      }
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra, vui lòng thử lại');
      setIsLoading(false);
      return false;
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
