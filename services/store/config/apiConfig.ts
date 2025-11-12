/**
 * Profile/Store API Configuration
 * Endpoints cho Profile và Store service
 */

// Endpoints cho Profile Service
export const PROFILE_ENDPOINTS = {
  // User Profile
  GET_MY_PROFILE: '/api/v1/online-shopping/protected/profile/user',
  CREATE_MY_PROFILE: '/api/v1/online-shopping/protected/profile/user',
  UPDATE_MY_PROFILE: '/api/v1/online-shopping/protected/profile/user',
  
  // Member Profile
  CREATE_MEMBERS: '/api/v1/online-shopping/protected/profile/members',
  UPDATE_MEMBER: '/api/v1/online-shopping/protected/profile/members', // /{member_id}
  DELETE_MEMBERS: '/api/v1/online-shopping/protected/profile/members',
  
  // File Upload
  UPLOAD_FILE: '/api/v1/online-shopping/protected/profile/upload-file',
  
  // Store Profile (Seller only)
  CREATE_STORE: '/api/v1/online-shopping/protected/profile/store',
  GET_MY_STORE: '/api/v1/online-shopping/protected/profile/store',
  UPDATE_MY_STORE: '/api/v1/online-shopping/protected/profile/store',
  GET_ALL_STORES: '/api/v1/online-shopping/protected/profile/stores', // Admin only
};
