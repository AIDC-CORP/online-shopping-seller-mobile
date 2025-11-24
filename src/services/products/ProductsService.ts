/**
 * Products Service - Microfrontend Module
 * Handles product catalog management
 * Integrates with Catalog Service API
 * 
 * Architecture: Singleton pattern với operations tách riêng
 */

import { ProductStatus } from './config';
import type { Product, ProductCreateRequest, ProductUpdateRequest, ProductDeleteResponse } from './types';
import * as operations from './operations';

class ProductsService {
  private static instance: ProductsService;

  private constructor() {}

  static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  // ========== GET Operations ==========

  /**
   * Get products by store ID với pagination
   * @param storeId - UUID của store
   * @param page - Số trang (bắt đầu từ 1)
   * @param pageLimit - Số items mỗi trang
   */
  async getProductsByStoreId(
    storeId: string,
    page: number = 1,
    pageLimit: number = 20
  ) {
    return operations.getProductsByStoreId(storeId, page, pageLimit);
  }

  /**
   * Get products của store, có thể filter theo category
   * @param storeId - UUID của store
   * @param category - Tên category (optional)
   */
  async getProducts(storeId: string, category?: string): Promise<Product[]> {
    return operations.getProducts(storeId, category);
  }

  /**
   * Get product by ID
   * Workaround: Backend chưa có endpoint, fetch all và filter
   * @param productId - UUID của product
   * @param storeId - UUID của store (required)
   */
  async getProductById(productId: string, storeId?: string): Promise<Product | null> {
    return operations.getProductById(productId, storeId);
  }

  // ========== CREATE Operations ==========

  /**
   * Create single product
   * @param storeId - UUID của store
   * @param product - Product data
   */
  async addProduct(storeId: string, product: ProductCreateRequest): Promise<Product> {
    return operations.createProduct(storeId, product);
  }

  /**
   * Create multiple products (batch)
   * @param storeId - UUID của store
   * @param products - Array of product data
   */
  async addProducts(storeId: string, products: ProductCreateRequest[]): Promise<Product[]> {
    return operations.createProducts(storeId, products);
  }

  // ========== UPDATE Operations ==========

  /**
   * Update product
   * @param productId - UUID của product
   * @param updates - Fields to update
   */
  async updateProduct(productId: string, updates: ProductUpdateRequest): Promise<Product> {
    return operations.updateProduct(productId, updates);
  }

  /**
   * Update product stock/quantity
   * @param productId - UUID của product
   * @param quantity - New quantity
   */
  async updateStock(productId: string, quantity: number): Promise<Product> {
    return operations.updateStock(productId, quantity);
  }

  /**
   * Update product status
   * @param productId - UUID của product
   * @param status - New status
   */
  async updateStatus(productId: string, status: ProductStatus): Promise<Product> {
    return operations.updateStatus(productId, status);
  }

  /**
   * Update product price
   * @param productId - UUID của product
   * @param price - New price
   */
  async updatePrice(productId: string, price: number): Promise<Product> {
    return operations.updatePrice(productId, price);
  }

  /**
   * Update product images
   * @param productId - UUID của product
   * @param imageUrls - Array of image URLs (max 5)
   */
  async updateImages(productId: string, imageUrls: string[]): Promise<Product> {
    return operations.updateImages(productId, imageUrls);
  }

  /**
   * Batch update products
   * @param updates - Array of {productId, data}
   */
  async batchUpdateProducts(
    updates: { productId: string; data: ProductUpdateRequest }[]
  ): Promise<Product[]> {
    return operations.batchUpdateProducts(updates);
  }

  // ========== DELETE Operations ==========

  /**
   * Delete single product (hard delete)
   * @param productId - UUID của product
   */
  async deleteProduct(productId: string): Promise<void> {
    return operations.deleteProduct(productId);
  }

  /**
   * Delete multiple products (hard delete)
   * @param productIds - Array of product UUIDs
   */
  async deleteProducts(productIds: string[]): Promise<ProductDeleteResponse> {
    return operations.deleteProducts(productIds);
  }

  /**
   * Delete all products by category
   * @param storeId - UUID của store
   * @param category - Category name
   */
  async deleteProductsByCategory(storeId: string, category: string): Promise<ProductDeleteResponse> {
    return operations.deleteProductsByCategory(storeId, category);
  }

  /**
   * Soft delete - Update status to DISCONTINUED
   * Recommendation: Nên dùng thay vì hard delete
   * @param productId - UUID của product
   */
  async softDeleteProduct(productId: string): Promise<void> {
    return operations.softDeleteProduct(productId);
  }

  // ========== EXCEL Operations ==========

  /**
   * Import products from Excel file
   * @param storeId - UUID của store
   * @param formData - FormData with Excel file
   */
  async importProductsFromExcel(storeId: string, formData: FormData): Promise<{
    success_count: number;
    error_count: number;
    errors: Array<{ row: number | string; error: string }>;
    message: string;
  }> {
    return operations.importProductsFromExcel(storeId, formData);
  }

  /**
   * Get Excel template download URL
   */
  getExcelTemplateUrl(): string {
    return operations.getExcelTemplateUrl();
  }
}

export default ProductsService.getInstance();
