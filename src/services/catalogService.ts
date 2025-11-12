import * as SecureStore from 'expo-secure-store';

const CATALOG_URL = process.env.EXPO_PUBLIC_CATALOG_URL || 'http://192.168.1.13:8115';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ProductCreateData {
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  category?: string;
  images?: string[];
  sku?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
}

export interface ProductUpdateData {
  name?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  category?: string;
  images?: string[];
  is_active?: boolean;
}

class CatalogService {
  private async getHeaders(): Promise<HeadersInit> {
    const token = await SecureStore.getItemAsync('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Product APIs
  async getProducts(params?: {
    skip?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<ApiResponse<any[]>> {
    try {
      const headers = await this.getHeaders();
      const queryParams = new URLSearchParams();
      
      if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
      if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);

      const response = await fetch(
        `${CATALOG_URL}/api/v1/products?${queryParams.toString()}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Failed to fetch products',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get products error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async getProductById(productId: string): Promise<ApiResponse<any>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${CATALOG_URL}/api/v1/products/${productId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Failed to fetch product',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get product error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async createProduct(productData: ProductCreateData): Promise<ApiResponse<any>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${CATALOG_URL}/api/v1/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Failed to create product',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Create product error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async updateProduct(
    productId: string,
    updates: ProductUpdateData
  ): Promise<ApiResponse<any>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${CATALOG_URL}/api/v1/products/${productId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Failed to update product',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Update product error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async deleteProduct(productId: string): Promise<ApiResponse<any>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${CATALOG_URL}/api/v1/products/${productId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Failed to delete product',
        };
      }

      return {
        success: true,
        data: { message: 'Product deleted successfully' },
      };
    } catch (error) {
      console.error('Delete product error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Categories
  async getCategories(): Promise<ApiResponse<any[]>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${CATALOG_URL}/api/v1/categories`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.detail || 'Failed to fetch categories',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get categories error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
}

export default new CatalogService();
