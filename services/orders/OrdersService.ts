/**
 * Orders Service - Microfrontend Module
 * Handles order management independently
 */

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  items: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

class OrdersService {
  private static instance: OrdersService;

  private constructor() {}

  static getInstance(): OrdersService {
    if (!OrdersService.instance) {
      OrdersService.instance = new OrdersService();
    }
    return OrdersService.instance;
  }

  async getOrders(status?: OrderStatus): Promise<Order[]> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockOrders: Order[] = [
          {
            id: 'ORD001',
            customerName: 'Nguyễn Văn A',
            items: 3,
            total: 450000,
            status: 'pending',
            createdAt: new Date(),
          },
          {
            id: 'ORD002',
            customerName: 'Trần Thị B',
            items: 2,
            total: 320000,
            status: 'processing',
            createdAt: new Date(),
          },
        ];
        
        if (status) {
          resolve(mockOrders.filter(order => order.status === status));
        } else {
          resolve(mockOrders);
        }
      }, 500);
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: orderId,
          customerName: 'Nguyễn Văn A',
          items: 3,
          total: 450000,
          status,
          createdAt: new Date(),
        });
      }, 500);
    });
  }
}

export default OrdersService.getInstance();
