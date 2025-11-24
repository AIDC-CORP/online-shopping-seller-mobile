/**
 * Orders Service - Seller App
 * Handles order management for sellers
 * Integrates with Order Service API
 */

import { httpClient } from '../auth/config';

const ORDER_BASE_URL = process.env.EXPO_PUBLIC_ORDER_URL || 'http://192.168.1.4:8203';
const API_PREFIX = '/api/v1/online-shopping/public'; // Order service uses /public root path

export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItem {
  product_id: string;
  name_at_purchase: string;
  price_at_purchase: number;
  quantity: number;
  image_url?: string;
}

export interface ShippingAddress {
  recipient_name: string;
  phone: string;
  address: string;
}

export interface Order {
  order_id: string;
  user_id: string;
  store_id?: string;
  status: OrderStatus;
  total_price: number;
  original_amount?: number;
  discount_amount?: number;
  voucher_code?: string;
  created_at: string;
  updated_at?: string;
  shipping_address: ShippingAddress;
  payment_id?: string;
  items_snapshot: OrderItem[];
}

export interface PaginatedOrdersResponse {
  data: Order[];
  pagination: {
    total_items: number;
    current_page: number;
    total_pages: number;
    limit: number;
  };
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

  /**
   * Get all orders for seller (using new seller endpoint)
   */
  async getOrders(params: {
    page?: number;
    page_limit?: number;
    status?: OrderStatus;
  } = {}): Promise<PaginatedOrdersResponse> {
    try {
      const { page = 1, page_limit = 20, status } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: page_limit.toString(), // Backend uses 'limit' not 'page_limit'
      });

      if (status) {
        queryParams.append('status', status);
      }

      console.log('[OrdersService] Getting orders for seller');
      const response = await httpClient.get(
        `${ORDER_BASE_URL}${API_PREFIX}/orders/seller/orders?${queryParams.toString()}`
      );
      
      console.log('[OrdersService] Orders fetched:', response.data);
      
      // Transform backend pagination format to match expected format
      const backendData = response.data;
      return {
        data: backendData.data || [],
        pagination: {
          total_items: backendData.pagination?.total_items || 0,
          current_page: backendData.pagination?.current_page || page,
          total_pages: backendData.pagination?.total_pages || 1,
          limit: backendData.pagination?.limit || page_limit,
        },
      };
    } catch (error: any) {
      console.error('[OrdersService] Failed to get orders:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get orders');
    }
  }

  /**
   * Get order by ID (for seller)
   */
  async getOrderById(orderId: string): Promise<Order> {
    try {
      console.log('[OrdersService] Getting order by ID:', orderId);
      const response = await httpClient.get(
        `${ORDER_BASE_URL}${API_PREFIX}/orders/seller/orders/${orderId}`
      );
      
      console.log('[OrdersService] Order found:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[OrdersService] Failed to get order:', error);
      if (error.response?.status === 404) {
        throw new Error('Order not found');
      }
      if (error.response?.status === 403) {
        throw new Error('Bạn không có quyền xem đơn hàng này');
      }
      throw new Error(error.response?.data?.detail || 'Failed to get order');
    }
  }

  /**
   * Confirm order (seller accepts order)
   * POST /orders/{order_id}/confirm
   */
  async confirmOrder(orderId: string): Promise<Order> {
    try {
      console.log('[OrdersService] Confirming order:', orderId);
      const response = await httpClient.post(
        `${ORDER_BASE_URL}${API_PREFIX}/orders/${orderId}/confirm`
      );
      
      console.log('[OrdersService] Order confirmed:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[OrdersService] Failed to confirm order:', error);
      throw new Error(error.response?.data?.detail || 'Failed to confirm order');
    }
  }

  /**
   * Reject order (seller rejects order)
   * POST /orders/{order_id}/reject
   */
  async rejectOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      console.log('[OrdersService] Rejecting order:', orderId, 'Reason:', reason);
      const response = await httpClient.post(
        `${ORDER_BASE_URL}${API_PREFIX}/orders/${orderId}/reject`,
        { reason } // Send reason in body if backend supports it
      );
      
      console.log('[OrdersService] Order rejected:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[OrdersService] Failed to reject order:', error);
      throw new Error(error.response?.data?.detail || 'Failed to reject order');
    }
  }
}

export default OrdersService.getInstance();
