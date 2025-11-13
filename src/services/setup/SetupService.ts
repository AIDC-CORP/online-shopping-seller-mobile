/**
 * Setup Service - Microfrontend Module
 * Handles first-time seller onboarding and store creation
 * Integrates with backend Profile Service API
 */

import { httpClient } from '../auth/config';
import { SETUP_ENDPOINTS } from './config/apiConfig';
import type {
  StoreProfile,
  StoreCreateRequest,
  StoreUpdateRequest,
  BackendStoreResponse,
  FileUploadResponse,
  SetupFormData,
} from './types';
import { transformStoreResponse, transformSetupDataToStoreRequest } from './types';

class SetupService {
  private static instance: SetupService;

  private constructor() {}

  static getInstance(): SetupService {
    if (!SetupService.instance) {
      SetupService.instance = new SetupService();
    }
    return SetupService.instance;
  }

  // ==========================================================================
  // Store Profile Management
  // ==========================================================================

  /**
   * Get store profile của seller hiện tại
   * Calls: GET /profile/store
   * @throws Error if store not found (404) or other errors
   */
  async getStoreProfile(): Promise<StoreProfile> {
    try {
      const response = await httpClient.get<BackendStoreResponse>(
        SETUP_ENDPOINTS.GET_MY_STORE
      );
      
      return transformStoreResponse(response.data);
    } catch (error: any) {
      console.error('[SetupService] Failed to get store profile:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Store not found. Please create your store first.');
      }
      
      throw new Error(error.response?.data?.detail || 'Failed to get store profile');
    }
  }

  /**
   * Create store profile (first-time setup)
   * Calls: POST /profile/store
   * @param data Store creation data
   * @returns Created store profile
   * @throws Error if seller already has store or other errors
   */
  async createStoreProfile(data: StoreCreateRequest): Promise<StoreProfile> {
    try {
      console.log('[SetupService] Creating store profile...', data);

      const response = await httpClient.post<BackendStoreResponse>(
        SETUP_ENDPOINTS.CREATE_STORE,
        data
      );

      const storeProfile = transformStoreResponse(response.data);
      console.log('[SetupService] Store created successfully:', storeProfile);

      return storeProfile;
    } catch (error: any) {
      console.error('[SetupService] Failed to create store:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Bạn đã có cửa hàng rồi. Không thể tạo thêm.');
      }
      
      throw new Error(error.response?.data?.detail || 'Failed to create store');
    }
  }

  /**
   * Create store from setup form data
   * High-level method that transforms UI data to API request
   * @param formData Data from setup screen form
   * @returns Created store profile
   */
  async createStoreFromSetupData(formData: SetupFormData): Promise<StoreProfile> {
    const request = transformSetupDataToStoreRequest(formData);
    return this.createStoreProfile(request);
  }

  /**
   * Update store profile
   * Calls: PATCH /profile/store
   * @param updates Partial update data
   * @returns Updated store profile
   * @throws Error if no fields to update or other errors
   */
  async updateStoreProfile(updates: StoreUpdateRequest): Promise<StoreProfile> {
    try {
      // Validate: ít nhất 1 field để update
      const hasUpdates = Object.values(updates).some(
        value => value !== undefined && value !== null && value !== ''
      );
      
      if (!hasUpdates) {
        throw new Error('No fields to update');
      }

      console.log('[SetupService] Updating store profile...', updates);

      const response = await httpClient.patch<BackendStoreResponse>(
        SETUP_ENDPOINTS.UPDATE_MY_STORE,
        updates
      );

      const storeProfile = transformStoreResponse(response.data);
      console.log('[SetupService] Store updated successfully:', storeProfile);

      return storeProfile;
    } catch (error: any) {
      console.error('[SetupService] Failed to update store:', error);
      throw new Error(error.response?.data?.detail || 'Failed to update store');
    }
  }

  // ==========================================================================
  // File Upload
  // ==========================================================================

  /**
   * Upload file (avatar or cover image)
   * Calls: POST /profile/upload-file
   * @param file File or Blob to upload
   * @param uploadType Type of upload ('avatar' or 'cover')
   * @returns Upload result with URL
   * @throws Error if upload fails
   */
  async uploadFile(
    file: File | Blob,
    uploadType: 'avatar' | 'cover'
  ): Promise<FileUploadResponse> {
    try {
      console.log(`[SetupService] Uploading ${uploadType}...`);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_type', uploadType);

      const response = await httpClient.post<FileUploadResponse>(
        SETUP_ENDPOINTS.UPLOAD_FILE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(`[SetupService] ${uploadType} uploaded successfully:`, response.data.url);
      return response.data;
    } catch (error: any) {
      console.error(`[SetupService] Failed to upload ${uploadType}:`, error);
      throw new Error(error.response?.data?.detail || `Failed to upload ${uploadType}`);
    }
  }

  // ==========================================================================
  // Helper Methods
  // ==========================================================================

  /**
   * Check if seller already has a store
   * @returns true if store exists, false otherwise
   */
  async hasStore(): Promise<boolean> {
    try {
      await this.getStoreProfile();
      return true;
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return false;
      }
      throw error;
    }
  }
}

export default SetupService.getInstance();
