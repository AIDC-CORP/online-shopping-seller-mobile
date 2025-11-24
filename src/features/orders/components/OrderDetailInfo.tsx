import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Order, OrderStatus } from '../types';

interface OrderDetailInfoProps {
  order: Order;
}

export const OrderDetailInfo: React.FC<OrderDetailInfoProps> = ({ order }) => {
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

  const statusColors = getStatusStyle(order.status);

  return (
    <>
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
    </>
  );
};

const styles = StyleSheet.create({
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
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
