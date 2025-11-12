/**
 * HTTP Client Configuration
 * Axios instance với interceptors cho authentication và error handling
 */

import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from './apiConfig';

// Tạo axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Thêm token vào header
httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Lấy token từ SecureStore
      const token = await SecureStore.getItemAsync('access_token');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`);
    } catch (error) {
      console.error('[HTTP] Failed to get token from storage:', error);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('[HTTP Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Xử lý response và errors
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[HTTP Response] ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    console.error('[HTTP Response Error]', error.response?.status, error.message);
    
    // Xử lý lỗi 401 - Token expired
    if (error.response?.status === 401) {
      console.log('[Auth] Token expired, need to refresh or re-login');
      
      // Option 1: Try to refresh token
      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (refreshToken) {
          // TODO: Implement token refresh logic
          console.log('[Auth] Attempting to refresh token...');
        } else {
          // Clear tokens if no refresh token available
          await SecureStore.deleteItemAsync('access_token');
          await SecureStore.deleteItemAsync('refresh_token');
        }
      } catch (storageError) {
        console.error('[Auth] Failed to handle expired token:', storageError);
      }
      
      // Option 2: Redirect to login (implement navigation service)
      // NavigationService.navigate('Login');
    }
    
    // Xử lý lỗi 403 - Forbidden
    if (error.response?.status === 403) {
      console.log('[Auth] Access forbidden - insufficient permissions');
    }
    
    // Xử lý lỗi network
    if (!error.response) {
      console.error('[Network Error] Unable to reach server');
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;
