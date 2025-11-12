import { useState } from 'react';
import { AuthService } from '../../../../services';
import SetupService from '../../../../services/setup/SetupService';

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  isSetupCompleted: boolean;
  role?: string;
}

interface UseLoginResult {
  login: (username: string, password: string) => Promise<User | null>;
  isLoading: boolean;
  error: string;
  clearError: () => void;
}

/**
 * Custom hook xử lý logic đăng nhập
 * Tích hợp với backend AuthService API
 * 
 * @example
 * const { login, isLoading, error } = useLogin();
 * 
 * const handleLogin = async () => {
 *   const user = await login(username, password);
 *   if (user) {
 *     // Navigate to home
 *   }
 * };
 */
export const useLogin = (): UseLoginResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (username: string, password: string): Promise<User | null> => {
    // Validate input
    if (!username || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      return null;
    }

    // Username validation (minimum 3 characters)
    if (username.length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự');
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
      // Call backend API through AuthService
      const response = await AuthService.login({
        username: username.trim(),
        password: password.trim(),
      });

      // Get user info from AuthService
      const backendUser = response.user;
      
      // Check if user is SELLER or ADMIN (only these roles can access seller app)
      if (backendUser.role !== 'SELLER' && backendUser.role !== 'ADMIN' && backendUser.role !== 'SUPER_ADMIN') {
        setError('Bạn không có quyền truy cập ứng dụng Seller Hub');
        await AuthService.logout(); // Logout if wrong role
        setIsLoading(false);
        return null;
      }
      
      // Check if user has completed store setup by checking if store profile exists
      let isSetupCompleted = false;
      try {
        await SetupService.getStoreProfile();
        isSetupCompleted = true; // Store exists, setup is completed
        console.log('Store profile exists, user has completed setup');
      } catch (error: any) {
        // Store not found (404) or other errors
        if (error.message?.includes('Store not found')) {
          isSetupCompleted = false; // Store doesn't exist, need to setup
          console.log('Store profile not found, user needs to complete setup');
        } else {
          // Other errors (network, etc.) - assume setup not completed to be safe
          isSetupCompleted = false;
          console.warn('Failed to check store profile:', error);
        }
      }
      
      // Transform backend user to app user format
      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        username: backendUser.username,
        name: backendUser.name || backendUser.username,
        isSetupCompleted: isSetupCompleted,
        role: backendUser.role,
      };
      
      console.log('Login successful:', user);
      
      setIsLoading(false);
      return user;
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra tên đăng nhập và mật khẩu';
      setError(errorMessage);
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
