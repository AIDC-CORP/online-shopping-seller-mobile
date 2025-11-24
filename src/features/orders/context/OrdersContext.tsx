/**
 * Orders Context - Share orders state across all order-related screens
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useOrders as useOrdersHook } from '../hooks/useOrders';
import { Order, OrderStatus } from '../types';

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
  acceptOrder: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string, reason: string) => Promise<void>;
  shipOrder: (
    orderId: string,
    orderTotal: number,
    orderItems: { product_id?: string; name: string; quantity: number }[]
  ) => Promise<{ success: boolean }>;
  completeOrder: (
    orderId: string,
    orderItems: { product_id?: string; name: string; quantity: number }[]
  ) => Promise<{ itemsForStock: { product_id: string; name: string; quantity: number }[] }>;
  getOrderDetail: (orderId: string) => Promise<Order>;
  resetLocalOverrides: () => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ordersHook = useOrdersHook();

  return (
    <OrdersContext.Provider value={ordersHook}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrdersContext = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrdersContext must be used within OrdersProvider');
  }
  return context;
};
