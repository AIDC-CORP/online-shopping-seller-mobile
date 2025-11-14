import { useState, useEffect } from 'react';
import { settingService, StoreSettings } from '../../../services/setting';

// Default settings
const DEFAULT_SETTINGS: StoreSettings = {
  currency: 'VND',
  language: 'vietnamese',
  time_zone: 'Asia/Ho_Chi_Minh',
  tax_rate: 10,
  shipping_enable: true,
  auto_accept_order: false,
  notification_enable: true,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await settingService.getStoreSettings();
      
      if (response.success && response.data) {
        // Merge API data with default settings to ensure all fields exist
        setSettings({
          ...DEFAULT_SETTINGS,
          ...response.data,
        });
      } else {
        // Use default settings if API fails (including auth errors)
        console.warn('[useSettings] Using default settings:', response.error);
        setSettings(DEFAULT_SETTINGS);
        
        // Set error only for non-auth errors
        if (response.error && !response.error.includes('token')) {
          setError(response.error);
        }
      }
    } catch (err) {
      console.warn('[useSettings] Error loading settings, using defaults:', err);
      setSettings(DEFAULT_SETTINGS);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<boolean> => {
    // Update local state immediately for better UX
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await settingService.updateStoreSettings(newSettings);
      
      if (response.success) {
        return true;
      } else {
        console.warn('[useSettings] Update failed:', response.error);
        // Keep local changes even if API fails
        return true;
      }
    } catch (err) {
      console.warn('[useSettings] Update error:', err);
      // Keep local changes even if API fails
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    loadSettings,
    updateSettings,
  };
};
