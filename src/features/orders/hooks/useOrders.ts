/**
 * Custom hook for managing orders with real API integration
 * Transforms backend API response to UI-friendly format
 */

import { useState, useEffect, useCallback } from 'react';
import OrdersService, { Order as ApiOrder, OrderStatus as ApiOrderStatus } from '../../../services/orders/OrdersService';
import { Order, OrderStatus } from '../types';

/**
 * Map API status to UI status (Vietnamese)
 */
const mapApiStatusToUi = (apiStatus: ApiOrderStatus): OrderStatus => {
  const statusMap: Record<ApiOrderStatus, OrderStatus> = {
    'PENDING': OrderStatus.New,
    'PAID': OrderStatus.New,
    'PROCESSING': OrderStatus.Preparing,
    'SHIPPED': OrderStatus.Delivering,
    'DELIVERED': OrderStatus.Completed,
    'CANCELLED': OrderStatus.Cancelled,
    'REFUNDED': OrderStatus.Cancelled,
  };
  // Handle PENDING_PAYMENT separately as it's not in the API type
  if (apiStatus === 'PENDING_PAYMENT' as any) {
    return OrderStatus.New;
  }
  return statusMap[apiStatus] || OrderStatus.New;
};

/**
 * Transform API order to UI order
 */
const transformApiOrder = (apiOrder: ApiOrder): Order => {
  return {
    id: apiOrder.order_id,
    customerName: apiOrder.shipping_address?.recipient_name || 'Khách hàng',
    phone: apiOrder.shipping_address?.phone,
    address: apiOrder.shipping_address?.address,
    itemCount: apiOrder.items_snapshot?.length || 0,
    total: apiOrder.total_price,
    status: mapApiStatusToUi(apiOrder.status),
    timestamp: new Date(apiOrder.created_at).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
    items: apiOrder.items_snapshot?.map((item) => ({
      name: item.name_at_purchase,
      quantity: item.quantity,
    })) || [],
  };
};

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  /**
   * Fetch orders from API
   */
  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      console.log('[useOrders] Fetching orders from API');

      const response = await OrdersService.getOrders({
        page: 1,
        page_limit: 100, // Get all orders for now
      });

      console.log('[useOrders] API response:', response);

      // Transform API orders to UI format
      const transformedOrders = response.data.map(transformApiOrder);

      console.log('[useOrders] Transformed orders:', transformedOrders);
      setOrders(transformedOrders);

      // Update pagination info (for future use)
      if (response.pagination) {
        setPagination({
          currentPage: response.pagination.current_page,
          totalPages: response.pagination.total_pages,
          totalItems: response.pagination.total_items,
        });
      }
    } catch (err: any) {
      console.error('[useOrders] Failed to fetch orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Refresh orders (pull-to-refresh)
   */
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
  }, [fetchOrders]);

  /**
   * Accept order (New -> Preparing)
   * Backend: POST /orders/{order_id}/confirm
   */
  const acceptOrder = useCallback(async (orderId: string) => {
    try {
      console.log('[useOrders] Accepting order:', orderId);

      // Call backend confirm endpoint
      await OrdersService.confirmOrder(orderId);

      // Optimistically update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: OrderStatus.Preparing } : order
        )
      );

      console.log('[useOrders] Order accepted successfully');
    } catch (err: any) {
      console.error('[useOrders] Failed to accept order:', err);
      throw new Error(err.message || 'Failed to accept order');
    }
  }, []);

  /**
   * Cancel/Reject order (Any status -> Cancelled)
   * Backend: POST /orders/{order_id}/reject
   */
  const cancelOrder = useCallback(async (orderId: string, reason: string) => {
    try {
      console.log('[useOrders] Cancelling order:', orderId, 'Reason:', reason);

      // Call backend reject endpoint
      await OrdersService.rejectOrder(orderId, reason);

      // Optimistically update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: OrderStatus.Cancelled } : order
        )
      );

      console.log('[useOrders] Order cancelled successfully');
    } catch (err: any) {
      console.error('[useOrders] Failed to cancel order:', err);
      throw new Error(err.message || 'Failed to cancel order');
    }
  }, []);

  /**
   * Ship order (Preparing -> Delivering)
   * TODO: Backend doesn't support this yet, manual status update for now
   */
  const shipOrder = useCallback(async (orderId: string) => {
    console.warn('[useOrders] Ship order not implemented in backend yet');
    // Optimistically update local state (temporary until backend supports)
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: OrderStatus.Delivering } : order
      )
    );
  }, []);

  /**
   * Complete order (Delivering -> Completed)
   * TODO: Backend doesn't support this yet, manual status update for now
   */
  const completeOrder = useCallback(async (orderId: string) => {
    console.warn('[useOrders] Complete order not implemented in backend yet');
    // Optimistically update local state (temporary until backend supports)
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: OrderStatus.Completed } : order
      )
    );
  }, []);

  /**
   * Get order detail by ID
   */
  const getOrderDetail = useCallback(async (orderId: string): Promise<Order> => {
    try {
      console.log('[useOrders] Getting order detail for ID:', orderId);
      const apiOrder = await OrdersService.getOrderById(orderId);
      const transformed = transformApiOrder(apiOrder);
      return transformed;
    } catch (err: any) {
      console.error('[useOrders] Failed to get order detail:', err);
      throw new Error(err.message || 'Failed to load order detail');
    }
  }, []);

  /**
   * Fetch orders on mount
   */
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refreshing,
    refresh,
    getOrderDetail, // Export new method
    acceptOrder,
    cancelOrder,
    shipOrder,
    completeOrder,
    pagination, // Export pagination for future use
  };
};
