/**
 * Setup Service API Configuration
 * Endpoints cho Store Creation và First-time Onboarding
 */

const PROFILE_BASE_URL = process.env.EXPO_PUBLIC_PROFILE_URL || 'http://192.168.1.13:8113';

export const SETUP_ENDPOINTS = {
  // Store Management
  CREATE_STORE: `${PROFILE_BASE_URL}/api/v1/online-shopping/public/profile/store`,
  GET_MY_STORE: `${PROFILE_BASE_URL}/api/v1/online-shopping/public/profile/store`,
  UPDATE_MY_STORE: `${PROFILE_BASE_URL}/api/v1/online-shopping/public/profile/store`,
  
  // File Upload
  UPLOAD_FILE: `${PROFILE_BASE_URL}/api/v1/online-shopping/public/profile/upload-file`,
} as const;
