// Mock API Service for Seller Hub App

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class MockApiService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Auth
  async login(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    await this.delay(1000);
    if (email && password) {
      return {
        success: true,
        data: { token: 'mock-jwt-token-12345' },
      };
    }
    return {
      success: false,
      error: 'Invalid credentials',
    };
  }

  async logout(): Promise<ApiResponse<null>> {
    await this.delay(500);
    return { success: true };
  }

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<any>> {
    await this.delay(800);
    return {
      success: true,
      data: {
        revenue: 15000000,
        totalOrders: 120,
        successfulOrders: 95,
        cancelledOrders: 25,
      },
    };
  }

  // Orders
  async getOrders(): Promise<ApiResponse<any[]>> {
    await this.delay(1000);
    return {
      success: true,
      data: [], // Add mock orders here
    };
  }

  async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<null>> {
    await this.delay(800);
    return { success: true };
  }

  // Products
  async getProducts(): Promise<ApiResponse<any[]>> {
    await this.delay(1000);
    return {
      success: true,
      data: [], // Add mock products here
    };
  }

  async createProduct(product: any): Promise<ApiResponse<any>> {
    await this.delay(1200);
    return {
      success: true,
      data: { ...product, id: `p${Date.now()}` },
    };
  }

  // Store
  async getStoreInfo(): Promise<ApiResponse<any>> {
    await this.delay(800);
    return {
      success: true,
      data: {
        name: 'Cửa hàng của tôi',
        description: 'Chuyên cung cấp sản phẩm chất lượng cao',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '0123456789',
        openingHours: '8:00 - 22:00',
      },
    };
  }
}

export default new MockApiService();
