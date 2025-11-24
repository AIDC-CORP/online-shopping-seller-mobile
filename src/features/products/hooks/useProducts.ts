import { useState, useEffect, useCallback } from 'react';
import { ProductsService } from '../../../services';
import { useStore } from '../../store/hooks/useStore';
import type { Product } from '../../../services/products/types';

export const useProducts = () => {
  const { storeProfile } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (params?: {
    skip?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => {
    if (!storeProfile?.id) {
      console.warn('[useProducts] No store ID available');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const productsList = await ProductsService.getProducts(storeProfile.id, params?.category);
      setProducts(productsList);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch products';
      setError(errorMessage);
      console.error('[useProducts] Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [storeProfile?.id]);

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
    
    const response = await ProductsService.createProduct(productData);
    
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
    
    const response = await ProductsService.updateProduct(productId, updates);
    
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
    
    const response = await ProductsService.deleteProduct(productId);
    
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

  /**
   * Decrease stock quantity for multiple products (when completing an order)
   */
  const decreaseStock = useCallback(async (items: Array<{ product_id: string; quantity: number; name: string }>) => {
    console.log('[useProducts] decreaseStock called with items:', items);
    
    if (!storeProfile?.id) {
      console.error('[useProducts] No storeId available, cannot decrease stock');
      return { 
        success: false, 
        error: 'Store profile not loaded',
        results: items.map(item => ({
          name: item.name,
          decreased: 0,
          remaining: 0,
          success: false,
          error: 'Store profile not loaded'
        }))
      };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = [];
      
      for (const item of items) {
        console.log(`[useProducts] Processing item: ${item.name} (${item.product_id})`);
        
        // Fetch current product from API to get latest stock
        const currentProduct = await ProductsService.getProductById(item.product_id, storeProfile.id);
        
        if (!currentProduct) {
          console.error(`[useProducts] Failed to fetch product ${item.product_id}: Product not found`);
          results.push({
            name: item.name,
            decreased: 0,
            remaining: 0,
            success: false,
            error: 'Product not found'
          });
          continue;
        }
        const newStock = Math.max(0, currentProduct.stock - item.quantity);
        console.log(`[useProducts] Current stock: ${currentProduct.stock}, Decrease: ${item.quantity}, New stock: ${newStock}`);
        
        // Update product stock
        try {
          const updatedProduct = await ProductsService.updateProduct(item.product_id, {
            quantity: newStock
          });
          
          console.log(`[useProducts] Successfully updated stock for ${item.name}`);
          console.log(`[useProducts] Updated product:`, JSON.stringify(updatedProduct, null, 2));
          console.log(`[useProducts] Stock field value:`, updatedProduct.stock);
          
          // Update local state
          setProducts(prev => 
            prev.map(p => p.id === item.product_id ? updatedProduct : p)
          );
          results.push({
            name: item.name,
            decreased: item.quantity,
            remaining: updatedProduct.stock,
            success: true
          });
        } catch (updateError: any) {
          console.error(`[useProducts] Failed to update stock for ${item.name}:`, updateError);
          results.push({
            name: item.name,
            decreased: 0,
            remaining: currentProduct.stock,
            success: false,
            error: updateError.message || 'Failed to update'
          });
        }
      }
      
      console.log('[useProducts] decreaseStock completed. Results:', results);
      setIsLoading(false);
      return { success: true, results };
    } catch (err: any) {
      console.error('[useProducts] decreaseStock error:', err);
      setError(err.message || 'Failed to decrease stock');
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  }, [storeProfile?.id]);

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
    decreaseStock,
  };
};
