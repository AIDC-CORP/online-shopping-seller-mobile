/**
 * Delete Product Operations
 * Handles deleting products
 */

import { httpClient } from '../../auth/config';
import { CATALOG_ENDPOINTS } from '../config';
import { ProductDeleteResponse } from '../types';

/**
 * Delete single product
 * Calls: DELETE /catalog/products
 */
export async function deleteProduct(productId: string): Promise<void> {
  try {
    await httpClient.delete(CATALOG_ENDPOINTS.DELETE_PRODUCTS, {
      data: {
        product_ids: [productId],
      },
    });
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    
    const errorDetail = error.response?.data?.detail;
    if (errorDetail) {
      throw new Error(errorDetail);
    }
    
    throw new Error('Failed to delete product');
  }
}

/**
 * Delete multiple products
 * Calls: DELETE /catalog/products
 */
export async function deleteProducts(productIds: string[]): Promise<ProductDeleteResponse> {
  try {
    if (productIds.length === 0) {
      throw new Error('No product IDs provided');
    }

    const response = await httpClient.delete<ProductDeleteResponse>(
      CATALOG_ENDPOINTS.DELETE_PRODUCTS,
      {
        data: {
          product_ids: productIds,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Failed to delete products:', error);
    
    const errorDetail = error.response?.data?.detail;
    if (errorDetail) {
      throw new Error(errorDetail);
    }
    
    throw new Error('Failed to delete products');
  }
}

/**
 * Delete all products by category
 * Lấy danh sách products theo category, sau đó xóa
 */
export async function deleteProductsByCategory(
  storeId: string,
  category: string
): Promise<ProductDeleteResponse> {
  try {
    // Import getProducts để lấy danh sách
    const { getProducts } = await import('./getProducts');
    
    const products = await getProducts(storeId, category);
    const productIds = products.map(p => p.id);
    
    if (productIds.length === 0) {
      return {
        deleted_count: 0,
        deleted_ids: [],
        not_found_ids: [],
      };
    }
    
    return await deleteProducts(productIds);
  } catch (error) {
    console.error('Failed to delete products by category:', error);
    throw error;
  }
}

/**
 * Soft delete - Update status to OUT_OF_STOCK thay vì xóa thật
 * Recommendation: Nên dùng soft delete thay vì hard delete
 */
export async function softDeleteProduct(productId: string): Promise<void> {
  try {
    const { updateStatus } = await import('./updateProduct');
    const { ProductStatus } = await import('../config');
    
    await updateStatus(productId, ProductStatus.OUT_OF_STOCK);
  } catch (error) {
    console.error('Failed to soft delete product:', error);
    throw error;
  }
}
