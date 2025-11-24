import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Order, OrderStatus } from '../types';
import Button from '../../../components/common/button';
import { useOrders } from '../hooks/useOrders';

const OrderDetailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { getOrderDetail, acceptOrder, cancelOrder, shipOrder } = useOrders();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch order detail on mount
  useEffect(() => {
    const orderId = params.orderId;
    
    if (!orderId || typeof orderId !== 'string') {
      setError('Invalid order ID');
      setLoading(false);
      return;
    }

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[OrderDetailScreen] Fetching order detail for ID:', orderId);
        const orderData = await getOrderDetail(orderId);
        console.log('[OrderDetailScreen] Order data received:', orderData);
        setOrder(orderData);
      } catch (err: any) {
        console.error('[OrderDetailScreen] Failed to load order:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.orderId]); // Only depend on orderId string value

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.New: return { bg: '#dbeafe', text: '#1e40af' };
      case OrderStatus.Preparing: return { bg: '#fef3c7', text: '#92400e' };
      case OrderStatus.Delivering: return { bg: '#e0e7ff', text: '#3730a3' };
      case OrderStatus.Completed: return { bg: '#d1fae5', text: '#065f46' };
      case OrderStatus.Cancelled: return { bg: '#fee2e2', text: '#991b1b' };
    }
  };

  const handleAccept = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      await acceptOrder(order.id);
      router.back();
    } catch (error) {
      console.error('Failed to accept order:', error);
      alert('Không thể xác nhận đơn hàng. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      await cancelOrder(order.id, 'Seller rejected');
      router.back();
    } catch (error) {
      console.error('Failed to reject order:', error);
      alert('Không thể từ chối đơn hàng. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShip = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      await shipOrder(order.id);
      router.back();
    } catch (error) {
      console.error('Failed to ship order:', error);
      alert('Không thể chuyển trạng thái giao hàng. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error || 'Không tìm thấy đơn hàng'}</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>← Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColors = getStatusStyle(order.status);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📋 Chi tiết đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Order ID & Status */}
        <View style={styles.orderHeader}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.orderIdLabel}>Mã đơn hàng</Text>
            <Text style={styles.orderId} numberOfLines={1} ellipsizeMode="middle">
              {order.id}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {order.status}
            </Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👤 Thông tin khách hàng</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tên:</Text>
            <Text style={styles.infoValue}>{order.customerName || 'Chưa cập nhật'}</Text>
          </View>
          
          {order.phone ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📞 SĐT:</Text>
              <Text style={styles.infoValue}>{order.phone}</Text>
            </View>
          ) : null}
          
          {order.address ? (
            <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
              <Text style={styles.infoLabel}>📍 Địa chỉ:</Text>
              <Text style={[styles.infoValue, { flex: 1 }]}>{order.address}</Text>
            </View>
          ) : null}
        </View>

        {/* Order Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📦 Sản phẩm đặt hàng ({order.items.length} món)</Text>
          {order.items.length > 0 ? (
            order.items.map((item, index) => (
              <View 
                key={index} 
                style={[
                  styles.itemRow,
                  index < order.items.length - 1 && styles.itemBorder
                ]}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>×{item.quantity}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Chưa có thông tin sản phẩm</Text>
          )}
        </View>

        {/* Payment Info */}
        <View style={styles.paymentCard}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Thành tiền:</Text>
            <Text style={styles.paymentValue}>{formatCurrency(order.total)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Phí vận chuyển:</Text>
            <Text style={styles.paymentValue}>Miễn phí</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.paymentRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
          </View>
        </View>

        {/* Time */}
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>⏰ Thời gian đặt hàng:</Text>
          <Text style={styles.timeValue}>{order.timestamp}</Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {order.status === OrderStatus.New && (
        <View style={styles.actionBar}>
          <Button onPress={handleAccept} variant="primary" size="md" fullWidth disabled={actionLoading}>
            {actionLoading ? 'Đang xử lý...' : '✅ Xác nhận đơn hàng'}
          </Button>
          <Button onPress={handleReject} variant="danger" size="md" fullWidth disabled={actionLoading}>
            ❌ Từ chối đơn hàng
          </Button>
        </View>
      )}

      {order.status === OrderStatus.Preparing && (
        <View style={styles.actionBar}>
          <Button onPress={handleShip} variant="primary" size="md" fullWidth disabled={actionLoading}>
            {actionLoading ? 'Đang xử lý...' : '🚚 Giao hàng'}
          </Button>
        </View>
      )}

      {(order.status === OrderStatus.Delivering || order.status === OrderStatus.Completed || order.status === OrderStatus.Cancelled) && (
        <View style={styles.actionBar}>
          <Button onPress={() => router.back()} variant="secondary" size="md" fullWidth>
            Đóng
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20, 
    paddingVertical: 16,
    minHeight: 80,
    maxHeight: 80,
    backgroundColor: '#10b981', 
    borderBottomLeftRadius: 24, 
    borderBottomRightRadius: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 5, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderIdLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  infoIcon: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  itemName: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  paymentCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#065f46',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065f46',
  },
  divider: {
    height: 1,
    backgroundColor: '#a7f3d0',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065f46',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 13,
    color: '#9ca3af',
  },
  timeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  actionBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 10,
    backgroundColor: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  backLink: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
  },
});

export default OrderDetailScreen;
