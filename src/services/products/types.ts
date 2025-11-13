/**
 * Product Types & Interfaces
 * Shared types cho Products Service
 */

import { ProductCategory, ProductUnit, ProductStatus } from './config';

// Frontend Product Interface
export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
  imageUrls: string[] | null;
  unit: string;
  status: string;
  import_date: string | null;
  expiration_date: string | null;
  created_at?: string;
  updated_at?: string;
}

// Backend Response Types
export interface BackendProductResponse {
  id: string;
  store_id: string;
  product_name: string;
  description: string | null;
  price: number;
  quantity: number;
  category: string;
  image_urls: string[] | null;
  unit: string;
  status: string;
  import_date: string | null;
  expiration_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProductResponse {
  items: BackendProductResponse[];
  total: number;
  page: number;
  page_limit: number;
  total_pages: number;
}

// Request Types
export interface ProductCreateRequest {
  product_name: string;
  description?: string;
  price: number;
  quantity: number;
  category: ProductCategory;
  image_urls?: string[];
  unit: ProductUnit;
  status?: ProductStatus;
  import_date?: string;
  expiration_date?: string;
}

export interface ProductUpdateRequest {
  product_name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  category?: ProductCategory;
  image_urls?: string[];
  unit?: ProductUnit;
  status?: ProductStatus;
  import_date?: string;
  expiration_date?: string;
}

export interface ProductDeleteResponse {
  deleted_count: number;
  deleted_ids: string[];
  not_found_ids: string[];
}

// Transform function
export function transformProductResponse(backendProduct: BackendProductResponse): Product {
  return {
    id: backendProduct.id,
    store_id: backendProduct.store_id,
    name: backendProduct.product_name,
    description: backendProduct.description,
    price: backendProduct.price,
    stock: backendProduct.quantity,
    category: backendProduct.category,
    imageUrl: backendProduct.image_urls?.[0] || null,
    imageUrls: backendProduct.image_urls,
    unit: backendProduct.unit,
    status: backendProduct.status,
    import_date: backendProduct.import_date,
    expiration_date: backendProduct.expiration_date,
    created_at: backendProduct.created_at,
    updated_at: backendProduct.updated_at,
  };
}
