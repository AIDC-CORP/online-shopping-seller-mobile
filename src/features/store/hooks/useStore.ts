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
    
    const response = await StoreService.getStoreProfile();
    
    if (response.success && response.data) {
      setStoreProfile(response.data);
    } else {
      setError(response.error || 'Failed to fetch store profile');
    }
    
    setIsLoading(false);
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
    
    const response = await StoreService.createStoreProfile(storeData);
    
    if (response.success && response.data) {
      setStoreProfile(response.data);
      setIsLoading(false);
      return { success: true };
    } else {
      setError(response.error || 'Failed to create store');
      setIsLoading(false);
      return { success: false, error: response.error };
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
    
    const response = await StoreService.updateStoreProfile(updates);
    
    if (response.success && response.data) {
      setStoreProfile(response.data);
      setIsLoading(false);
      return { success: true };
    } else {
      setError(response.error || 'Failed to update store');
      setIsLoading(false);
      return { success: false, error: response.error };
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
