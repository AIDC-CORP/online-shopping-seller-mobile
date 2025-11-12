import { useState, useEffect } from 'react';
import { SetupService } from '../../services';

/**
 * Hook để lấy storeId của seller hiện tại
 * Sử dụng SetupService.getStoreProfile() để lấy thông tin store
 */
export const useStoreId = () => {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchStoreId = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const storeProfile = await SetupService.getStoreProfile();
        
        if (mounted) {
          setStoreId(storeProfile.id);
        }
      } catch (err: any) {
        console.error('[useStoreId] Failed to get store ID:', err);
        if (mounted) {
          setError(err.message || 'Failed to get store ID');
          setStoreId(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStoreId();

    return () => {
      mounted = false;
    };
  }, []);

  return { storeId, isLoading, error };
};
