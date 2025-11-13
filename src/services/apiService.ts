import * as SecureStore from 'expo-secure-store';

const PROFILE_URL = process.env.EXPO_PUBLIC_PROFILE_URL || 'http://192.168.1.13:8113';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private async getHeaders(): Promise<HeadersInit> {
    const token = await SecureStore.getItemAsync('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Store Profile APIs
  async getStoreProfile(): Promise<ApiResponse<any>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${PROFILE_URL}/profile/store`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Failed to fetch store profile',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get store profile error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async createStoreProfile(storeData: {
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    opening_hours?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${PROFILE_URL}/profile/store`, {
        method: 'POST',
        headers,
        body: JSON.stringify(storeData),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Failed to create store profile',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Create store profile error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async updateStoreProfile(updates: {
    name?: string;
    description?: string;
    address?: string;
    phone?: string;
    opening_hours?: string;
    avatar_url?: string;
    cover_image_url?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${PROFILE_URL}/profile/store`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Failed to update store profile',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Update store profile error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Store Settings APIs
  async getStoreSettings(): Promise<ApiResponse<any>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${PROFILE_URL}/profile/store/settings`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Failed to fetch store settings',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get store settings error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async updateStoreSettings(settings: {
    currency?: 'VND' | 'Dollar';
    language?: 'vietnamese' | 'english';
    time_zone?: string;
    tax_rate?: number;
    shipping_enable?: boolean;
    auto_accept_order?: boolean;
    notification_enable?: boolean;
  }): Promise<ApiResponse<any>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${PROFILE_URL}/profile/store/settings`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Failed to update store settings',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Update store settings error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Seller Profile APIs
  async getSellerProfile(): Promise<ApiResponse<any>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${PROFILE_URL}/api/v1/profile/me`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Failed to fetch seller profile',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get seller profile error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async updateSellerProfile(updates: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${PROFILE_URL}/api/v1/profile/me`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Failed to update seller profile',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Update seller profile error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
}

export default new ApiService();
