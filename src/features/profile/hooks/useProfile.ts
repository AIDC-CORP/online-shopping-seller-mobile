import { useState, useEffect, useCallback } from 'react';
import apiService from '../../../services/apiService';

export interface SellerProfile {
  id?: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const response = await apiService.getSellerProfile();
    
    if (response.success && response.data) {
      setProfile(response.data);
    } else {
      setError(response.error || 'Failed to fetch profile');
    }
    
    setIsLoading(false);
  }, []);

  const updateProfile = useCallback(async (updates: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    const response = await apiService.updateSellerProfile(updates);
    
    if (response.success && response.data) {
      setProfile(response.data);
      setIsLoading(false);
      return { success: true };
    } else {
      setError(response.error || 'Failed to update profile');
      setIsLoading(false);
      return { success: false, error: response.error };
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
  };
};
