/**
 * Store Service - Microfrontend Module
 * Handles store profile and settings management
 * Integrates with backend Profile Service API
 */

import { httpClient } from '../auth/config';
import { PROFILE_ENDPOINTS } from './config/apiConfig';

export interface StoreProfile {
  id: string;
  seller_id: string;
  store_name: string;
  name: string; // Alias for store_name for backward compatibility
  description: string;
  avatar: string;
  logo: string; // Alias for avatar for backward compatibility
  cover?: string;
  address: string;
  phone: string;
  email?: string;
  isActive?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StoreSettings {
  currency: string;
  language: string;
  timezone: string;
  taxRate: number;
  shippingEnabled: boolean;
}

// Backend request/response types
interface BackendStoreResponse {
  id: string;
  seller_id: string;
  store_name: string;
  phone: string;
  address: string;
  avatar: string;
  cover?: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface StoreCreateRequest {
  store_name: string;
  phone: string;
  address: string;
  avatar: string;
  cover?: string;
  description: string;
}

interface StoreUpdateRequest {
  store_name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  cover?: string;
  description?: string;
}

class StoreService {
  private static instance: StoreService;

  private constructor() {}

  static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  /**
   * Transform backend response to app format
   */
  private transformStoreResponse(backendStore: BackendStoreResponse): StoreProfile {
    return {
      id: backendStore.id,
      seller_id: backendStore.seller_id,
      store_name: backendStore.store_name,
      name: backendStore.store_name, // Alias for backward compatibility
      description: backendStore.description,
      avatar: backendStore.avatar,
      logo: backendStore.avatar, // Alias for backward compatibility
      cover: backendStore.cover,
      address: backendStore.address,
      phone: backendStore.phone,
      isActive: true, // Default value
      created_at: backendStore.created_at,
      updated_at: backendStore.updated_at,
    };
  }

  /**
   * Get store profile của seller hiện tại
   * Calls: GET /profile/store
   */
  async getStoreProfile(): Promise<StoreProfile> {
    try {
      const response = await httpClient.get<BackendStoreResponse>(
        PROFILE_ENDPOINTS.GET_MY_STORE
      );
      
      return this.transformStoreResponse(response.data);
    } catch (error: any) {
      console.error('Failed to get store profile:', error);
      
      // If store not found (404), return null hoặc throw
      if (error.response?.status === 404) {
        throw new Error('Store not found. Please create your store first.');
      }
      
      throw new Error(error.response?.data?.detail || 'Failed to get store profile');
    }
  }

  /**
   * Create store profile (chỉ seller chưa có store)
   * Calls: POST /profile/store
   */
  async createStoreProfile(data: {
    store_name: string;
    phone: string;
    address: string;
    avatar: string;
    cover?: string;
    description: string;
  }): Promise<StoreProfile> {
    try {
      const request: StoreCreateRequest = {
        store_name: data.store_name,
        phone: data.phone,
        address: data.address,
        avatar: data.avatar,
        cover: data.cover,
        description: data.description,
      };

      const response = await httpClient.post<BackendStoreResponse>(
        PROFILE_ENDPOINTS.CREATE_STORE,
        request
      );

      return this.transformStoreResponse(response.data);
    } catch (error: any) {
      console.error('Failed to create store:', error);
      throw new Error(error.response?.data?.detail || 'Failed to create store');
    }
  }

  /**
   * Update store profile
   * Calls: PATCH /profile/store
   */
  async updateStoreProfile(updates: {
    store_name?: string;
    phone?: string;
    address?: string;
    avatar?: string;
    cover?: string;
    description?: string;
  }): Promise<StoreProfile> {
    try {
      // Validate: ít nhất 1 field để update
      const hasUpdates = Object.values(updates).some(value => value !== undefined && value !== null);
      if (!hasUpdates) {
        throw new Error('No fields to update');
      }

      const request: StoreUpdateRequest = {
        store_name: updates.store_name,
        phone: updates.phone,
        address: updates.address,
        avatar: updates.avatar,
        cover: updates.cover,
        description: updates.description,
      };

      const response = await httpClient.patch<BackendStoreResponse>(
        PROFILE_ENDPOINTS.UPDATE_MY_STORE,
        request
      );

      return this.transformStoreResponse(response.data);
    } catch (error: any) {
      console.error('Failed to update store:', error);
      throw new Error(error.response?.data?.detail || 'Failed to update store');
    }
  }

  /**
   * Get store settings (mock - chưa có API backend)
   * TODO: Implement backend API for store settings
   */
  async getStoreSettings(): Promise<StoreSettings> {
    // Mock implementation - backend chưa có API này
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          currency: 'VND',
          language: 'vi',
          timezone: 'Asia/Ho_Chi_Minh',
          taxRate: 10,
          shippingEnabled: true,
        });
      }, 500);
    });
  }

  /**
   * Update store settings (mock - chưa có API backend)
   * TODO: Implement backend API for store settings
   */
  async updateStoreSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    // Mock implementation - backend chưa có API này
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          currency: 'VND',
          language: 'vi',
          timezone: 'Asia/Ho_Chi_Minh',
          taxRate: 10,
          shippingEnabled: true,
          ...updates,
        });
      }, 500);
    });
  }

  /**
   * Upload file (avatar hoặc cover)
   * Calls: POST /profile/upload-file
   */
  async uploadFile(file: File | Blob, uploadType: 'avatar' | 'cover'): Promise<{
    bucket: string;
    object_name: string;
    size: number;
    content_type: string;
    url: string;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_type', uploadType);

      const response = await httpClient.post(
        PROFILE_ENDPOINTS.UPLOAD_FILE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to upload file:', error);
      throw new Error(error.response?.data?.detail || 'Failed to upload file');
    }
  }
}

export default StoreService.getInstance();
