/**
 * Create Product Operations
 * Handles creating new products
 */

import { httpClient } from '../../auth/config';
import { CATALOG_ENDPOINTS } from '../config';
import {
  Product,
  ProductCreateRequest,
  BackendProductResponse,
  transformProductResponse,
} from '../types';

/**
 * Create product
 * Calls: POST /catalog/products/{store_id}
 */
export async function createProduct(
  storeId: string,
  product: ProductCreateRequest
): Promise<Product> {
  try {
    console.log('[createProduct] Creating product for store:', storeId);
    console.log('[createProduct] Product data:', product);
    console.log('[createProduct] Endpoint:', `${CATALOG_ENDPOINTS.CREATE_PRODUCT}/${storeId}`);
    
    const response = await httpClient.post<BackendProductResponse>(
      `${CATALOG_ENDPOINTS.CREATE_PRODUCT}/${storeId}`,
      product
    );

    console.log('[createProduct] Success! Response:', response.data);
    return transformProductResponse(response.data);
  } catch (error: any) {
    console.error('Failed to create product:', error);
    console.error('Error response:', error.response?.data);
    
    // Parse error message
    const errorDetail = error.response?.data?.detail;
    if (errorDetail) {
      if (typeof errorDetail === 'string') {
        throw new Error(errorDetail);
      } else if (Array.isArray(errorDetail)) {
        // Validation errors từ Pydantic
        const messages = errorDetail.map((e: any) => e.msg).join(', ');
        throw new Error(`Validation error: ${messages}`);
      }
    }
    
    throw new Error('Failed to create product');
  }
}

/**
 * Create multiple products (batch)
 * Note: Backend chưa hỗ trợ batch create, implement bằng cách gọi nhiều lần
 */
export async function createProducts(
  storeId: string,
  products: ProductCreateRequest[]
): Promise<Product[]> {
  try {
    const createdProducts: Product[] = [];
    
    for (const product of products) {
      const created = await createProduct(storeId, product);
      createdProducts.push(created);
    }
    
    return createdProducts;
  } catch (error) {
    console.error('Failed to create products:', error);
    throw error;
  }
}
