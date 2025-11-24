import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Order } from '../types';
import { XCircleIcon } from '../../../components/icons';

interface InvoiceModalProps {
  order: Order | null;
  visible: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, visible, onClose }) => {
  if (!order) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const currentDate = new Date().toLocaleDateString('vi-VN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Mock prices for items (trong thực tế sẽ lấy từ database)
  const itemsWithPrice = order.items.map((item, idx) => ({
    ...item,
    unitPrice: [45000, 15000, 250000, 450000, 80000, 35000][idx] || 50000,
  }));

  const subtotal = itemsWithPrice.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const shippingFee = 0;
  const discount = 0;
  const total = subtotal + shippingFee - discount;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 16, width: '100%', maxWidth: 400, maxHeight: '90%' }}>
          {/* Header */}
          <View style={{ 
            backgroundColor: '#10b981', 
            borderTopLeftRadius: 16, 
            borderTopRightRadius: 16,
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <View>
              <Text style={{ fontSize: 22, fontWeight: '800', color: 'white' }}>HÓA ĐƠN</Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>#{order.id}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <XCircleIcon className="h-6 w-6" color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 550 }}>
            {/* Store Info */}
            <View style={{ padding: 20, borderBottomWidth: 2, borderBottomColor: '#e5e7eb', borderStyle: 'dashed' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 4 }}>
                Cửa hàng Thực phẩm Sạch GreenFarm
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280', lineHeight: 18 }}>
                📍 123 Đường ABC, Phường X, Quận Y, TP.HCM{'\n'}
                📞 0987 654 321{'\n'}
                📧 greenfarm@example.com
              </Text>
            </View>

            {/* Invoice Info */}
            <View style={{ padding: 20, backgroundColor: '#f9fafb' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Ngày lập:</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#1f2937' }}>{currentDate}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Mã đơn hàng:</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#10b981' }}>#{order.id}</Text>
                </View>
              </View>
              
              {/* Customer Info */}
              <View style={{ 
                backgroundColor: 'white', 
                borderRadius: 8, 
                padding: 12,
                borderWidth: 1,
                borderColor: '#e5e7eb'
              }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Thông tin khách hàng:</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 4 }}>{order.customerName}</Text>
                {order.phone && <Text style={{ fontSize: 12, color: '#4b5563' }}>📱 {order.phone}</Text>}
                {order.address && <Text style={{ fontSize: 12, color: '#4b5563', marginTop: 2 }}>📍 {order.address}</Text>}
              </View>
            </View>

            {/* Items */}
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 12 }}>
                Chi tiết sản phẩm:
              </Text>
              
              {itemsWithPrice.map((item, index) => (
                <View 
                  key={index}
                  style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                    borderBottomWidth: index < itemsWithPrice.length - 1 ? 1 : 0,
                    borderBottomColor: '#f3f4f6'
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#1f2937' }}>{item.name}</Text>
                    <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                      {formatCurrency(item.unitPrice)} × {item.quantity}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#10b981' }}>
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Summary */}
            <View style={{ 
              padding: 20, 
              backgroundColor: '#f9fafb',
              borderTopWidth: 2,
              borderTopColor: '#e5e7eb',
              borderStyle: 'dashed'
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 13, color: '#6b7280' }}>Tạm tính:</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#4b5563' }}>{formatCurrency(subtotal)}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 13, color: '#6b7280' }}>Phí vận chuyển:</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#10b981' }}>Miễn phí</Text>
              </View>
              
              {discount > 0 && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 13, color: '#6b7280' }}>Giảm giá:</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#ef4444' }}>-{formatCurrency(discount)}</Text>
                </View>
              )}
              
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: '#d1d5db'
              }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937' }}>Tổng cộng:</Text>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#10b981' }}>{formatCurrency(total)}</Text>
              </View>
            </View>

            {/* Footer */}
            <View style={{ padding: 20, backgroundColor: '#ecfdf5' }}>
              <Text style={{ fontSize: 12, color: '#059669', textAlign: 'center', fontStyle: 'italic' }}>
                Cảm ơn quý khách đã tin tưởng sử dụng dịch vụ!
              </Text>
              <Text style={{ fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 8 }}>
                Hóa đơn được tạo tự động bởi hệ thống
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
