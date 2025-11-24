/**
 * Get Products Operations
 * Handles fetching products from API
 */

import { httpClient } from '../../auth/config';
import { CATALOG_ENDPOINTS } from '../config';
import {
  Product,
  PaginatedProductResponse,
  transformProductResponse,
} from '../types';

/**
 * Get products by store ID với pagination
 * Calls: GET /catalog/products/{store_id}
 */
export async function getProductsByStoreId(
  storeId: string,
  page: number = 1,
  pageLimit: number = 20
): Promise<{
  products: Product[];
  total: number;
  page: number;
  pageLimit: number;
  totalPages: number;
}> {
  try {
    const response = await httpClient.get<PaginatedProductResponse>(
      `${CATALOG_ENDPOINTS.GET_PRODUCTS_BY_STORE}/${storeId}`,
      {
        params: {
          page,
          page_limit: pageLimit,
        },
      }
    );

    const products = response.data.items.map(item => transformProductResponse(item));

    return {
      products,
      total: response.data.total,
      page: response.data.page,
      pageLimit: response.data.page_limit,
      totalPages: response.data.total_pages,
    };
  } catch (error: any) {
    console.error('Failed to get products by store:', error);
    throw new Error(error.response?.data?.detail || 'Failed to get products');
  }
}

/**
 * Get products (wrapper cho getProductsByStoreId)
 * Lấy products của store hiện tại, có thể filter by category
 */
export async function getProducts(storeId: string, category?: string): Promise<Product[]> {
  try {
    const result = await getProductsByStoreId(storeId, 1, 100);
    
    // Filter by category nếu có
    if (category) {
      return result.products.filter(p => p.category === category);
    }
    
    return result.products;
  } catch (error) {
    console.error('Failed to get products:', error);
    throw error;
  }
}

/**
 * Get product by ID
 * Workaround: Backend chưa có endpoint riêng, fetch all và filter
 */
export async function getProductById(productId: string, storeId?: string): Promise<Product | null> {
  try {
    // Nếu không có storeId, không thể fetch
    if (!storeId) {
      console.warn('[getProductById] No storeId provided, cannot fetch product');
      return null;
    }
    
    // Fetch all products và tìm theo ID
    const products = await getProducts(storeId);
    const product = products.find(p => p.id === productId);
    
    return product || null;
  } catch (error) {
    console.error('[getProductById] Failed to get product:', error);
    return null;
  }
}
