import * as SecureStore from 'expo-secure-store';

const PROFILE_URL = process.env.EXPO_PUBLIC_PROFILE_URL || 'http://192.168.1.4:8113';

export interface StoreSettings {
  currency?: 'VND' | 'Dollar';
  language?: 'vietnamese' | 'english';
  time_zone?: string;
  tax_rate?: number;
  shipping_enable?: boolean;
  auto_accept_order?: boolean;
  notification_enable?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class SettingService {
  private async getHeaders(): Promise<HeadersInit> {
    const token = await SecureStore.getItemAsync('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async getStoreSettings(): Promise<ApiResponse<StoreSettings>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${PROFILE_URL}/api/v1/online-shopping/public/profile/store/settings`, {
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
      console.error('[SettingService] Get settings error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async updateStoreSettings(settings: Partial<StoreSettings>): Promise<ApiResponse<any>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${PROFILE_URL}/api/v1/online-shopping/public/profile/store/settings`, {
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
      console.error('[SettingService] Update settings error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
}

export default new SettingService();
