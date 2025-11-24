import { useState, useEffect, useCallback } from 'react';
import { StoreService } from '../../../services';

export interface StoreProfile {
  id?: string;
  seller_id?: string;
  store_name: string;
  description?: string;
  address?: string;
  phone?: string;
  avatar?: string;
  cover?: string;
  created_at?: string;
  updated_at?: string;
}

export const useStore = () => {
  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStoreProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await StoreService.getStoreProfile();
      setStoreProfile(data);
    } catch (err: any) {
      console.error('[useStore] Error fetching store profile:', err);
      setError(err.message || 'Failed to fetch store profile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createStore = useCallback(async (storeData: {
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    opening_hours?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await StoreService.createStoreProfile({
        store_name: storeData.name,
        phone: storeData.phone || '',
        address: storeData.address || '',
        avatar: '',
        description: storeData.description || '',
      });
      setStoreProfile(data);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create store';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStore = useCallback(async (updates: {
    name?: string;
    description?: string;
    address?: string;
    phone?: string;
    opening_hours?: string;
    avatar_url?: string;
    cover_image_url?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await StoreService.updateStoreProfile({
        store_name: updates.name,
        description: updates.description,
        address: updates.address,
        phone: updates.phone,
        avatar: updates.avatar_url,
        cover: updates.cover_image_url,
      });
      setStoreProfile(data);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update store';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStoreProfile();
  }, [fetchStoreProfile]);

  return {
    storeProfile,
    isLoading,
    error,
    fetchStoreProfile,
    createStore,
    updateStore,
  };
};
