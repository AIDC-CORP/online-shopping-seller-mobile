/**
 * Update Product Operations
 * Handles updating existing products
 */

import { httpClient } from '../../auth/config';
import { CATALOG_ENDPOINTS, ProductStatus } from '../config';
import {
  Product,
  ProductUpdateRequest,
  BackendProductResponse,
  transformProductResponse,
} from '../types';

/**
 * Update product
 * Calls: PATCH /catalog/products/{product_id}
 */
export async function updateProduct(
  productId: string,
  updates: ProductUpdateRequest
): Promise<Product> {
  try {
    // Validate: ít nhất 1 field để update
    const hasUpdates = Object.values(updates).some(value => value !== undefined);
    if (!hasUpdates) {
      throw new Error('No fields to update');
    }

    const response = await httpClient.patch<BackendProductResponse>(
      `${CATALOG_ENDPOINTS.UPDATE_PRODUCT}/${productId}`,
      updates
    );

    return transformProductResponse(response.data);
  } catch (error: any) {
    console.error('Failed to update product:', error);
    
    const errorDetail = error.response?.data?.detail;
    if (errorDetail) {
      throw new Error(errorDetail);
    }
    
    throw new Error('Failed to update product');
  }
}

/**
 * Update product stock/quantity
 * Shortcut method cho việc update chỉ quantity
 */
export async function updateStock(productId: string, quantity: number): Promise<Product> {
  try {
    if (quantity < 0) {
      throw new Error('Quantity must be >= 0');
    }
    
    return await updateProduct(productId, { quantity });
  } catch (error) {
    console.error('Failed to update stock:', error);
    throw error;
  }
}

/**
 * Update product status
 * Shortcut method cho việc update chỉ status
 */
export async function updateStatus(
  productId: string,
  status: ProductStatus
): Promise<Product> {
  try {
    return await updateProduct(productId, { status });
  } catch (error) {
    console.error('Failed to update status:', error);
    throw error;
  }
}

/**
 * Update product price
 * Shortcut method cho việc update chỉ price
 */
export async function updatePrice(productId: string, price: number): Promise<Product> {
  try {
    if (price < 0) {
      throw new Error('Price must be >= 0');
    }
    
    return await updateProduct(productId, { price });
  } catch (error) {
    console.error('Failed to update price:', error);
    throw error;
  }
}

/**
 * Update product images
 * Shortcut method cho việc update chỉ image_urls
 */
export async function updateImages(
  productId: string,
  imageUrls: string[]
): Promise<Product> {
  try {
    if (imageUrls.length > 5) {
      throw new Error('Maximum 5 images allowed');
    }
    
    return await updateProduct(productId, { image_urls: imageUrls });
  } catch (error) {
    console.error('Failed to update images:', error);
    throw error;
  }
}

/**
 * Batch update products
 * Update nhiều products cùng lúc với cùng một field
 */
export async function batchUpdateProducts(
  updates: { productId: string; data: ProductUpdateRequest }[]
): Promise<Product[]> {
  try {
    const updatedProducts: Product[] = [];
    
    for (const { productId, data } of updates) {
      const updated = await updateProduct(productId, data);
      updatedProducts.push(updated);
    }
    
    return updatedProducts;
  } catch (error) {
    console.error('Failed to batch update products:', error);
    throw error;
  }
}
