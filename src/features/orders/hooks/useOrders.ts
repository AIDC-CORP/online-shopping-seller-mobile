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
    customerName: apiOrder.shipping_address?.recipient_name || 'Chưa có thông tin',
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
      product_id: item.product_id,
    })) || [],
  };
};

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [mockOrdersState, setMockOrdersState] = useState<Record<string, OrderStatus>>({
    'mock-preparing-order-001': OrderStatus.Preparing,
    'mock-delivery-order-001': OrderStatus.Delivering,
  });
  // Store local status overrides (since backend doesn't support ship/complete yet)
  const [localStatusOverrides, setLocalStatusOverrides] = useState<Record<string, OrderStatus>>({});
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
        page_limit: 100,
      });

      console.log('[useOrders] API response:', response);

      // Backend list endpoint doesn't include shipping_address & items_snapshot
      // Need to fetch detail for each order to get full data
      const ordersWithDetails = await Promise.all(
        response.data.map(async (order) => {
          try {
            // Fetch full order detail
            const detailOrder = await OrdersService.getOrderById(order.order_id);
            return transformApiOrder(detailOrder);
          } catch (error) {
            console.error(`[useOrders] Failed to fetch detail for order ${order.order_id}:`, error);
            // Fallback to incomplete data
            return transformApiOrder(order);
          }
        })
      );

      console.log('[useOrders] Transformed orders with details:', ordersWithDetails);
      
      // Apply local status overrides (for ship/complete actions until backend supports)
      console.log('[useOrders] Applying local status overrides:', localStatusOverrides);
      const ordersWithOverrides = ordersWithDetails.map(order => {
        const currentOverride = localStatusOverrides[order.id];
        if (currentOverride) {
          console.log(`[useOrders] Overriding order ${order.id}: ${order.status} → ${currentOverride}`);
          return { ...order, status: currentOverride };
        }
        return order;
      });
      
      console.log('[useOrders] Final orders with overrides:', ordersWithOverrides);
      setOrders(ordersWithOverrides);

      // Update pagination info
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
   * Ship order (Preparing -> Completed) - TEMPORARY: Skip "Delivering" status
   * TODO: Change to (Preparing -> Delivering) when shipping service is ready
   */
  const shipOrder = useCallback(async (
    orderId: string, 
    orderTotal: number,
    orderItems: { product_id?: string; name: string; quantity: number }[],
    onStockDecreased?: (results: { name: string; decreased: number; remaining: number; success: boolean }[]) => void
  ) => {
    console.log('[useOrders] shipOrder called for:', orderId);
    
    // Store override so it persists across refreshes
    setLocalStatusOverrides(prev => {
      const newOverrides = { ...prev, [orderId]: OrderStatus.Delivering };
      console.log('[useOrders] Updated localStatusOverrides:', newOverrides);
      return newOverrides;
    });
    
    // Optimistically update local state (temporary until backend supports)
    setOrders((prevOrders) => {
      const updated = prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: OrderStatus.Delivering } : order
      );
      console.log('[useOrders] Updated orders state:', updated.map(o => ({ id: o.id.slice(-4), status: o.status })));
      return updated;
    });
    
    console.log('[useOrders] shipOrder completed');
    // Return success (no items needed for shipOrder anymore)
    return { success: true };
  }, []);

  /**
   * Complete order (Delivering -> Completed)
   * TODO: Backend doesn't support this yet, manual status update for now
   */
  const completeOrder = useCallback(async (
    orderId: string,
    orderItems: { product_id?: string; name: string; quantity: number }[]
  ) => {
    console.log('[useOrders] Marking order as completed:', orderId);
    
    // Return items info for stock decrease
    const itemsForStock = orderItems
      .filter(item => item.product_id) // Only items with product_id
      .map(item => ({
        product_id: item.product_id!,
        name: item.name,
        quantity: item.quantity
      }));
    
    // Store override so it persists across refreshes
    setLocalStatusOverrides(prev => ({ ...prev, [orderId]: OrderStatus.Completed }));
    // Optimistically update local state (temporary until backend supports)
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: OrderStatus.Completed } : order
      )
    );
    
    // Return items for caller to decrease stock
    return { itemsForStock };
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

  /**
   * Reset all local status overrides (for testing)
   */
  const resetLocalOverrides = useCallback(() => {
    console.log('[useOrders] Clearing all local status overrides');
    setLocalStatusOverrides({});
    // Refresh to get backend status
    refresh();
  }, [refresh]);

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
    resetLocalOverrides, // Export for testing
    pagination, // Export pagination for future use
  };
};
