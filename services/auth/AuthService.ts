/**
 * Auth Service - Microfrontend Module
 * Handles authentication logic independent of other services
 * Integrates with FastAPI backend auth_service
 */

import * as SecureStore from 'expo-secure-store';
import { httpClient, AUTH_ENDPOINTS } from './config';

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';
  user_role?: string;
}

export interface LoginCredentials {
  username: string; // Backend sử dụng username thay vì email
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

// Backend response types
interface BackendLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
}

interface BackendTokenVerifyResponse {
  is_valid: boolean;
  user_id?: string;
  user_role?: string;
  username?: string;
  email?: string;
}

interface BackendRegisterResponse {
  message: string;
  username: string;
  email: string;
  role: string;
}

export interface RegisterCustomerRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface RegisterAdminSellerRequest {
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'SELLER';
  first_name?: string;
  last_name?: string;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    // TODO: Load tokens from SecureStore/AsyncStorage on init
    this.loadTokensFromStorage();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Load tokens from secure storage on app start
   */
  private async loadTokensFromStorage(): Promise<void> {
    try {
      const accessToken = await SecureStore.getItemAsync('access_token');
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      
      // If tokens exist, verify and get user info
      if (this.accessToken) {
        await this.verifyAndSetUserInfo();
      }
    } catch (error) {
      console.error('Failed to load tokens from storage:', error);
    }
  }

  /**
   * Save tokens to secure storage
   */
  private async saveTokensToStorage(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('access_token', accessToken);
      
      if (refreshToken) {
        await SecureStore.setItemAsync('refresh_token', refreshToken);
      }
      
      this.accessToken = accessToken;
      this.refreshToken = refreshToken || null;
      
      console.log('Tokens saved to storage');
    } catch (error) {
      console.error('Failed to save tokens to storage:', error);
    }
  }

  /**
   * Clear tokens from storage
   */
  private async clearTokensFromStorage(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      
      this.accessToken = null;
      this.refreshToken = null;
      
      console.log('Tokens cleared from storage');
    } catch (error) {
      console.error('Failed to clear tokens from storage:', error);
    }
  }

  /**
   * Login with username and password
   * Calls backend API: POST /auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<BackendLoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        {
          username: credentials.username,
          password: credentials.password,
        }
      );

      const { access_token, refresh_token, token_type, expires_in } = response.data;

      // Save tokens
      await this.saveTokensToStorage(access_token, refresh_token);

      // Verify token and get user info
      await this.verifyAndSetUserInfo();

      if (!this.currentUser) {
        throw new Error('Failed to get user info after login');
      }

      return {
        user: this.currentUser,
        access_token,
        refresh_token,
        token_type,
        expires_in,
      };
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
  }

  /**
   * Verify token and set user info
   * Calls backend API: POST /auth/login-verify
   */
  private async verifyAndSetUserInfo(): Promise<void> {
    if (!this.accessToken) return;

    try {
      const response = await httpClient.post<BackendTokenVerifyResponse>(
        AUTH_ENDPOINTS.VERIFY_TOKEN,
        { token: this.accessToken }
      );

      const { is_valid, user_id, user_role, username, email } = response.data;

      if (is_valid && user_id) {
        this.currentUser = {
          id: user_id,
          username: username || '',
          email: email || '',
          role: (user_role as any) || 'CUSTOMER',
          user_role: user_role,
        };
      } else {
        await this.clearTokensFromStorage();
        this.currentUser = null;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      await this.clearTokensFromStorage();
      this.currentUser = null;
    }
  }

  /**
   * Get current user info from backend
   * Calls backend API: GET /auth/user-info
   */
  async getUserInfo(): Promise<User | null> {
    if (!this.accessToken) return null;

    try {
      const response = await httpClient.get<{
        user_id: string;
        user_role: string;
        username: string;
        email: string;
      }>(AUTH_ENDPOINTS.USER_INFO, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      const { user_id, user_role, username, email } = response.data;

      this.currentUser = {
        id: user_id,
        username,
        email,
        role: (user_role as any) || 'CUSTOMER',
        user_role,
      };

      return this.currentUser;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  }

  /**
   * Register new customer
   * Calls backend API: POST /auth/register-customer
   */
  async registerCustomer(request: RegisterCustomerRequest): Promise<BackendRegisterResponse> {
    try {
      const response = await httpClient.post<BackendRegisterResponse>(
        AUTH_ENDPOINTS.REGISTER_CUSTOMER,
        request
      );

      return response.data;
    } catch (error: any) {
      console.error('Customer registration failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Registration failed.');
    }
  }

  /**
   * Register new admin or seller (requires SUPER_ADMIN role)
   * Calls backend API: POST /auth/register-admin-seller
   */
  async registerAdminSeller(request: RegisterAdminSellerRequest): Promise<BackendRegisterResponse> {
    try {
      const response = await httpClient.post<BackendRegisterResponse>(
        AUTH_ENDPOINTS.REGISTER_ADMIN_SELLER,
        request,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Admin/Seller registration failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Registration failed. You may need SUPER_ADMIN role.');
    }
  }

  /**
   * Logout user
   * Calls backend API: POST /auth/logout
   */
  async logout(): Promise<void> {
    try {
      if (this.refreshToken) {
        await httpClient.post(AUTH_ENDPOINTS.LOGOUT, {
          refresh_token: this.refreshToken,
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local state and storage regardless of API success
      this.currentUser = null;
      await this.clearTokensFromStorage();
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get access token
   */
  getToken(): string | null {
    return this.accessToken;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.currentUser;
  }

  /**
   * Refresh access token using refresh token
   * TODO: Implement if backend supports token refresh endpoint
   */
  async refreshAccessToken(): Promise<string | null> {
    // TODO: Implement token refresh logic
    // This requires a refresh token endpoint from backend
    console.warn('Token refresh not implemented yet');
    return null;
  }
}

export default AuthService.getInstance();
