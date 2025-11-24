import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Order, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.New:
        return { bg: '#dbeafe', text: '#1e40af', icon: '🆕', label: 'Mới' };
      case OrderStatus.Preparing:
        return { bg: '#fef3c7', text: '#92400e', icon: '📦', label: 'Đang chuẩn bị' };
      case OrderStatus.Delivering:
        return { bg: '#e0e7ff', text: '#3730a3', icon: '🚚', label: 'Đang giao' };
      case OrderStatus.Completed:
        return { bg: '#d1fae5', text: '#065f46', icon: '✅', label: 'Hoàn thành' };
      case OrderStatus.Cancelled:
        return { bg: '#fee2e2', text: '#991b1b', icon: '❌', label: 'Đã hủy' };
      default: 
        return { bg: '#f3f4f6', text: '#374151', icon: '📋', label: status };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={{
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
      }}>
        {/* Header with Status Badge */}
        <View style={{
          backgroundColor: statusConfig.bg,
          paddingHorizontal: 14,
          paddingVertical: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: statusConfig.text }}>
              Đơn #
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: statusConfig.text, opacity: 0.8, marginLeft: 2 }}>
              {order.id.slice(0, 20)}...
            </Text>
          </View>
          <View style={{
            backgroundColor: 'white',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}>
            <Text style={{ fontSize: 11 }}>{statusConfig.icon}</Text>
            <Text style={{
              fontSize: 11,
              fontWeight: '700',
              color: statusConfig.text,
            }}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* Card Content */}
        <View style={{ padding: 14 }}>
          {/* Customer Info */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#10b981',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}>
              <Text style={{ fontSize: 18, color: 'white', fontWeight: '700' }}>
                {order.customerName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1f2937' }}>
                {order.customerName}
              </Text>
              <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                Khách hàng
              </Text>
            </View>
          </View>

          {/* Order Items Summary */}
          <View style={{
            backgroundColor: '#f9fafb',
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: '#e5e7eb',
          }}>
            <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
              📦 Sản phẩm ({order.itemCount} món):
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', lineHeight: 18 }}>
              {order.items.map(item => `${item.name}(${item.quantity})`).join(', ')}
            </Text>
          </View>

          {/* Footer: Time & Total */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <View>
              <Text style={{ fontSize: 11, color: '#9ca3af' }}>⏰ {order.timestamp}</Text>
            </View>
            <View style={{
              backgroundColor: '#ecfdf5',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#a7f3d0',
            }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#10b981' }}>
                {formatCurrency(order.total)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
