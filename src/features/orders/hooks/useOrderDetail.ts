import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Order } from '../types';
import { useOrdersContext } from '../context/OrdersContext';
import { useProducts } from '../../products/hooks/useProducts';
import WalletService from '../../../services/wallet/WalletService';

export const useOrderDetail = (orderId: string | string[] | undefined) => {
  const router = useRouter();
  const { orders, getOrderDetail, acceptOrder, cancelOrder, shipOrder, completeOrder } = useOrdersContext();
  const { decreaseStock } = useProducts();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch order detail on mount or get from shared context
  useEffect(() => {
    if (!orderId || typeof orderId !== 'string') {
      setError('Invalid order ID');
      setLoading(false);
      return;
    }

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[useOrderDetail] Looking for order in context:', orderId);
        
        // First, try to find order in shared context (includes local overrides)
        const contextOrder = orders.find(o => o.id === orderId);
        if (contextOrder) {
          console.log('[useOrderDetail] Order found in context:', contextOrder);
          setOrder(contextOrder);
          setLoading(false);
          return;
        }
        
        // If not in context, fetch from API
        console.log('[useOrderDetail] Order not in context, fetching from API...');
        const orderData = await getOrderDetail(orderId);
        console.log('[useOrderDetail] Order data received:', orderData);
        setOrder(orderData);
      } catch (err: any) {
        console.error('[useOrderDetail] Failed to load order:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, orders]); // Re-run when orders change

  const handleAccept = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      await acceptOrder(order.id);
      router.replace('/(main)/orders');
    } catch (error) {
      console.error('Failed to accept order:', error);
      Alert.alert('Lỗi', 'Không thể xác nhận đơn hàng. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      await cancelOrder(order.id, 'Seller rejected');
      router.replace('/(main)/orders');
    } catch (error) {
      console.error('Failed to reject order:', error);
      Alert.alert('Lỗi', 'Không thể từ chối đơn hàng. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShip = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      console.log('[useOrderDetail] handleShip called for order:', order.id);
      
      // Ship order (change to Delivering status)
      await shipOrder(order.id, order.total, order.items);
      console.log('[useOrderDetail] shipOrder completed, waiting for state update...');
      
      // Wait for React state to batch update before navigating
      await new Promise(resolve => setTimeout(resolve, 50));
      
      console.log('[useOrderDetail] Navigating back...');
      router.replace('/(main)/orders');
    } catch (error) {
      console.error('[useOrderDetail] Failed to ship order:', error);
      Alert.alert('Lỗi', 'Không thể giao hàng. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      
      // Step 1: Complete order
      const completeResult = await completeOrder(order.id, order.items);
      
      // Step 2: Decrease stock for products
      let stockMessage = '';
      if (completeResult.itemsForStock && completeResult.itemsForStock.length > 0) {
        const stockResult = await decreaseStock(completeResult.itemsForStock);
        
        if (stockResult.success && stockResult.results) {
          const successItems = stockResult.results.filter(r => r.success);
          const failedItems = stockResult.results.filter(r => !r.success);
          
          stockMessage = '✅ Đã trừ kho hàng:\n';
          successItems.forEach(item => {
            stockMessage += `• ${item.name}: -${item.decreased} (Còn ${item.remaining})\n`;
          });
          
          if (failedItems.length > 0) {
            stockMessage += '\n❌ Lỗi trừ kho:\n';
            failedItems.forEach(item => {
              stockMessage += `• ${item.name}\n`;
            });
          }
        }
      }
      
      // Step 3: Credit wallet
      let walletMessage = '';
      try {
        const transaction = await WalletService.creditOrderAmount(order.id, order.total);
        walletMessage = `\n\n💰 Đã cộng ${order.total.toLocaleString('vi-VN')}đ vào ví\nSố dư mới: ${transaction.balance_after.toLocaleString('vi-VN')}đ`;
      } catch (walletError: any) {
        console.error('[handleComplete] Failed to credit wallet:', walletError);
        walletMessage = `\n\n⚠️ Chưa thể cộng tiền vào ví: ${walletError.message}`;
      }
      
      // Show complete message
      Alert.alert(
        'Hoàn thành đơn hàng', 
        `${stockMessage}${walletMessage}`,
        [{ text: 'OK', onPress: () => router.replace('/(main)/orders') }]
      );
    } catch (error) {
      console.error('Failed to complete order:', error);
      Alert.alert('Lỗi', 'Không thể hoàn thành đơn hàng. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    order,
    loading,
    error,
    actionLoading,
    handleAccept,
    handleReject,
    handleShip,
    handleComplete,
  };
};
