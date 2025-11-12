/**
 * Auth Module Exports
 * Centralized exports for authentication service
 */

// Export AuthService
export { default as AuthService } from './AuthService';

// Export types from AuthService
export type {
  User,
  LoginCredentials,
  AuthResponse,
  RegisterCustomerRequest,
  RegisterAdminSellerRequest,
} from './AuthService';

// Export config
export { API_CONFIG, AUTH_ENDPOINTS, buildApiUrl, httpClient } from './config';
