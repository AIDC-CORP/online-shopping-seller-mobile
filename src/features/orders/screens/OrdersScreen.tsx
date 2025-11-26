import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Order, OrderStatus } from '../types';
import Button from '../../../components/common/button';
import { useOrdersContext } from '../context/OrdersContext';
import { InvoiceModal, RejectReasonModal, OrderCard } from '../components';

const OrdersScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.New);
  const { orders, loading, error, refreshing, refresh, acceptOrder, cancelOrder} = useOrdersContext();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [lastOrderCount, setLastOrderCount] = useState<Record<OrderStatus, number>>({
    [OrderStatus.New]: 0,
    [OrderStatus.Preparing]: 0,
    [OrderStatus.Delivering]: 0,
    [OrderStatus.Completed]: 0,
    [OrderStatus.Cancelled]: 0,
  });
  
  const tabs = [
    OrderStatus.New, 
    OrderStatus.Preparing, 
    OrderStatus.Delivering, 
    OrderStatus.Completed, 
    OrderStatus.Cancelled
  ];

  const filteredOrders = orders.filter(order => order.status === activeTab);
  const router = useRouter();

  // Refresh orders when screen comes into focus (but not on every focus)
  // Only refresh if orders is empty or on manual pull-to-refresh
  useFocusEffect(
    useCallback(() => {
      console.log('[OrdersScreen] Screen focused');
      // Only auto-refresh if we don't have orders yet
      if (orders.length === 0) {
        console.log('[OrdersScreen] No orders, fetching...');
        refresh();
      }
    }, [orders.length, refresh])
  );

  // Count orders by status
  const getOrderCount = (status: OrderStatus) => {
    return orders.filter(order => order.status === status).length;
  };

  // Auto-switch tab when order count changes (order moved between statuses)
  useEffect(() => {
    console.log('[OrdersScreen] useEffect triggered, orders:', orders.map(o => ({ id: o.id.slice(-4), status: o.status })));
    
    const currentCounts = {
      [OrderStatus.New]: getOrderCount(OrderStatus.New),
      [OrderStatus.Preparing]: getOrderCount(OrderStatus.Preparing),
      [OrderStatus.Delivering]: getOrderCount(OrderStatus.Delivering),
      [OrderStatus.Completed]: getOrderCount(OrderStatus.Completed),
      [OrderStatus.Cancelled]: getOrderCount(OrderStatus.Cancelled),
    };

    // Only auto-switch if we have previous counts (not on initial load)
    const hasInitialCounts = Object.values(lastOrderCount).some(count => count > 0);
    
    console.log('[OrdersScreen] Checking for tab switch...', {
      hasInitialCounts,
      current: currentCounts,
      previous: lastOrderCount,
      activeTab,
    });
    
    if (hasInitialCounts) {
      // Check if current active tab lost an order (count decreased)
      const currentTabCount = currentCounts[activeTab];
      const previousTabCount = lastOrderCount[activeTab];
      
      if (currentTabCount < previousTabCount) {
        // Current tab lost an order, find which tab gained an order
        const targetStatus = Object.keys(currentCounts).find((status) => {
          const statusKey = status as OrderStatus;
          return currentCounts[statusKey] > lastOrderCount[statusKey];
        }) as OrderStatus;
        
        if (targetStatus) {
          console.log(`[OrdersScreen] Order moved from ${activeTab} to ${targetStatus}, switching tab...`);
          setActiveTab(targetStatus);
          setLastOrderCount(currentCounts);
          return; // Exit early
        }
      }
      
      // Otherwise, check if any other tab gained orders
      for (const status of Object.keys(currentCounts)) {
        const statusKey = status as OrderStatus;
        const currentCount = currentCounts[statusKey];
        const previousCount = lastOrderCount[statusKey];

        // If count increased in a different tab, switch to that tab
        if (currentCount > previousCount && statusKey !== activeTab) {
          console.log(`[OrdersScreen] Count increased in ${statusKey}: ${previousCount} → ${currentCount}, switching tab...`);
          setActiveTab(statusKey);
          setLastOrderCount(currentCounts);
          return; // Exit after first switch
        }
      }
    }

    // Update last order counts
    setLastOrderCount(currentCounts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  // Handle order card press
  const handleOrderPress = (order: Order) => {
    router.push({
      pathname: '/(main)/order-detail',
      params: { orderId: order.id }
    });
  };

  // Handle accept order
  const handleAcceptOrder = async () => {
    if (selectedOrder) {
      try {
        setActionLoading(true);
        await acceptOrder(selectedOrder.id);
        setActiveTab(OrderStatus.Preparing);
        setSelectedOrder(null);
      } catch (error) {
        console.error('Failed to accept order:', error);
        alert('Không thể xác nhận đơn hàng. Vui lòng thử lại.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Handle reject order with reason
  const handleRejectOrder = async (reason: string) => {
    if (selectedOrder) {
      try {
        setActionLoading(true);
        await cancelOrder(selectedOrder.id, reason);
        setShowRejectModal(false);
        setSelectedOrder(null);
      } catch (error) {
        console.error('Failed to reject order:', error);
        alert('Không thể từ chối đơn hàng. Vui lòng thử lại.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View style={{ backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#1f2937' }}>Đơn hàng</Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>Quản lý đơn hàng của bạn</Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}
        contentContainerStyle={{ gap: 8 }}
      >
        {tabs.map(tab => {
          const count = getOrderCount(tab);
          const isActive = activeTab === tab;
          
          return (
            <Button
              key={tab}
              onPress={() => setActiveTab(tab)}
              variant={isActive ? 'primary' : 'secondary'}
              size="sm"
            >
              {tab} {count > 0 && `(${count})`}
            </Button>
          );
        })}
      </ScrollView>

      {/* Orders List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {loading && !refreshing ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={{ marginTop: 12, color: '#6b7280' }}>Đang tải đơn hàng...</Text>
          </View>
        ) : error ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ color: '#ef4444', fontSize: 16 }}>{error}</Text>
          </View>
        ) : filteredOrders.length === 0 ? (
          <View style={{ paddingVertical: 60, alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📦</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#9ca3af', marginBottom: 4 }}>
              Không có đơn hàng nào
            </Text>
            <Text style={{ fontSize: 14, color: '#9ca3af' }}>
              trong trạng thái này
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => handleOrderPress(order)}
            />
          ))
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Modals */}
      <RejectReasonModal
        visible={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectOrder}
      />

      <InvoiceModal
        order={selectedOrder}
        visible={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </View>
  );
};

export default OrdersScreen;
