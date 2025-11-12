import { useState, useEffect, useCallback } from 'react';
import catalogService from '../services/catalogService';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  category?: string;
  images?: string[];
  sku?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (params?: {
    skip?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    const response = await catalogService.getProducts(params);
    
    if (response.success && response.data) {
      setProducts(response.data);
    } else {
      setError(response.error || 'Failed to fetch products');
    }
    
    setIsLoading(false);
  }, []);

  const createProduct = useCallback(async (productData: {
    name: string;
    description?: string;
    price: number;
    stock_quantity: number;
    category?: string;
    images?: string[];
    sku?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    const response = await catalogService.createProduct(productData);
    
    if (response.success && response.data) {
      // Add new product to list
      setProducts(prev => [response.data, ...prev]);
      setIsLoading(false);
      return { success: true, data: response.data };
    } else {
      setError(response.error || 'Failed to create product');
      setIsLoading(false);
      return { success: false, error: response.error };
    }
  }, []);

  const updateProduct = useCallback(async (
    productId: string,
    updates: {
      name?: string;
      description?: string;
      price?: number;
      stock_quantity?: number;
      category?: string;
      images?: string[];
      is_active?: boolean;
    }
  ) => {
    setIsLoading(true);
    setError(null);
    
    const response = await catalogService.updateProduct(productId, updates);
    
    if (response.success && response.data) {
      // Update product in list
      setProducts(prev => 
        prev.map(p => p.id === productId ? response.data : p)
      );
      setIsLoading(false);
      return { success: true, data: response.data };
    } else {
      setError(response.error || 'Failed to update product');
      setIsLoading(false);
      return { success: false, error: response.error };
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    setIsLoading(true);
    setError(null);
    
    const response = await catalogService.deleteProduct(productId);
    
    if (response.success) {
      // Remove product from list
      setProducts(prev => prev.filter(p => p.id !== productId));
      setIsLoading(false);
      return { success: true };
    } else {
      setError(response.error || 'Failed to delete product');
      setIsLoading(false);
      return { success: false, error: response.error };
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
