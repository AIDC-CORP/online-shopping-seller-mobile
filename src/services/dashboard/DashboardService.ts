/**
 * Dashboard Service - Microfrontend Module
 * Handles dashboard statistics and analytics
 */

export interface DashboardStats {
  revenue: number;
  totalOrders: number;
  successfulOrders: number;
  cancelledOrders: number;
  period: 'today' | 'week' | 'month' | 'year';
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  imageUrl: string;
}

class DashboardService {
  private static instance: DashboardService;

  private constructor() {}

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  async getStats(period: string = 'month'): Promise<DashboardStats> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          revenue: 45000000,
          totalOrders: 156,
          successfulOrders: 142,
          cancelledOrders: 14,
          period: 'month',
        });
      }, 500);
    });
  }

  async getTopProducts(limit: number = 5): Promise<TopProduct[]> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'Sản phẩm A',
            sales: 120,
            revenue: 12000000,
            imageUrl: 'https://via.placeholder.com/150',
          },
          {
            id: '2',
            name: 'Sản phẩm B',
            sales: 95,
            revenue: 9500000,
            imageUrl: 'https://via.placeholder.com/150',
          },
        ]);
      }, 500);
    });
  }
}

export default DashboardService.getInstance();
