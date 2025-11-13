import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { mockOrders } from '../../../common/data/mockData';
import { Order, OrderStatus } from '../../../common/types';
import Button from '../../../components/common/button';
import { XCircleIcon, UserIcon } from '../../../components/icons';

// Modal Hóa đơn
const InvoiceModal: React.FC<{
  order: Order | null;
  visible: boolean;
  onClose: () => void;
}> = ({ order, visible, onClose }) => {
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
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Khách hàng:</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 4 }}>
                  {order.customerName}
                </Text>
                <Text style={{ fontSize: 12, color: '#4b5563' }}>
                  📞 0987 654 321{'\n'}
                  📍 123 Đường ABC, Phường X, Quận Y, TP.HCM
                </Text>
              </View>
            </View>

            {/* Items Table */}
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 12 }}>
                Chi tiết đơn hàng
              </Text>
              
              {/* Table Header */}
              <View style={{ 
                flexDirection: 'row', 
                backgroundColor: '#f3f4f6', 
                padding: 10, 
                borderRadius: 6,
                marginBottom: 8
              }}>
                <Text style={{ flex: 2, fontSize: 11, fontWeight: '700', color: '#374151' }}>Sản phẩm</Text>
                <Text style={{ flex: 1, fontSize: 11, fontWeight: '700', color: '#374151', textAlign: 'center' }}>SL</Text>
                <Text style={{ flex: 1, fontSize: 11, fontWeight: '700', color: '#374151', textAlign: 'right' }}>Đơn giá</Text>
                <Text style={{ flex: 1, fontSize: 11, fontWeight: '700', color: '#374151', textAlign: 'right' }}>Thành tiền</Text>
              </View>

              {/* Table Rows */}
              {itemsWithPrice.map((item, index) => (
                <View 
                  key={index} 
                  style={{ 
                    flexDirection: 'row', 
                    paddingVertical: 12,
                    borderBottomWidth: index < itemsWithPrice.length - 1 ? 1 : 0,
                    borderBottomColor: '#f3f4f6'
                  }}
                >
                  <Text style={{ flex: 2, fontSize: 13, color: '#1f2937' }} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 13, color: '#4b5563', textAlign: 'center' }}>
                    {item.quantity}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 12, color: '#6b7280', textAlign: 'right' }}>
                    {formatCurrency(item.unitPrice)}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: '#1f2937', textAlign: 'right' }}>
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
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }}>
                  {formatCurrency(subtotal)}
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 13, color: '#6b7280' }}>Phí vận chuyển:</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: discount > 0 ? '#10b981' : '#1f2937' }}>
                  {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                </Text>
              </View>

              {discount > 0 && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 13, color: '#6b7280' }}>Giảm giá:</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#ef4444' }}>
                    -{formatCurrency(discount)}
                  </Text>
                </View>
              )}

              <View style={{ height: 1, backgroundColor: '#d1d5db', marginVertical: 12 }} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937' }}>Tổng cộng:</Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#10b981' }}>
                  {formatCurrency(total)}
                </Text>
              </View>
            </View>

            {/* Footer Note */}
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', lineHeight: 16 }}>
                Cảm ơn quý khách đã mua hàng!{'\n'}
                Hóa đơn này được tạo tự động bởi hệ thống
              </Text>
              <View style={{ 
                marginTop: 12,
                paddingVertical: 6,
                paddingHorizontal: 12,
                backgroundColor: '#f3f4f6',
                borderRadius: 6
              }}>
                <Text style={{ fontSize: 10, color: '#6b7280' }}>
                  🕐 In lúc: {currentDate}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb', gap: 10 }}>
            <Button onPress={onClose} variant="primary" size="md" fullWidth>
              🖨️ In hóa đơn
            </Button>
            <Button onPress={onClose} variant="secondary" size="md" fullWidth>
              Đóng
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Modal chi tiết đơn hàng
const OrderDetailModal: React.FC<{ 
  order: Order | null; 
  visible: boolean; 
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
  onShowInvoice: () => void;
}> = ({ order, visible, onClose, onAccept, onReject, onShowInvoice }) => {
  if (!order) return null;

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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 16, width: '100%', maxHeight: '90%' }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#1f2937' }}>Chi tiết đơn hàng</Text>
            <TouchableOpacity onPress={onClose}>
              <XCircleIcon className="h-6 w-6" color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 500 }} contentContainerStyle={{ padding: 20 }}>
            {/* Order ID & Status */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1f2937' }}>Đơn #{order.id}</Text>
              <View style={{ backgroundColor: statusColors.bg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                <Text style={{ color: statusColors.text, fontSize: 13, fontWeight: '700' }}>
                  {order.status}
                </Text>
              </View>
            </View>

            {/* Customer Info */}
            <View style={{ backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 12 }}>👤 Thông tin khách hàng</Text>
              <View style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <UserIcon className="h-4 w-4" color="#6b7280" />
                  <Text style={{ fontSize: 14, color: '#4b5563' }}>{order.customerName}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>📞</Text>
                  <Text style={{ fontSize: 14, color: '#4b5563' }}>0987 654 321</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>📍</Text>
                  <Text style={{ fontSize: 14, color: '#4b5563', flex: 1 }}>123 Đường ABC, Phường X, Quận Y, TP.HCM</Text>
                </View>
              </View>
            </View>

            {/* Order Items */}
            <View style={{ backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 12 }}>📦 Sản phẩm đặt hàng</Text>
              {order.items.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: index < order.items.length - 1 ? 1 : 0, borderBottomColor: '#e5e7eb' }}>
                  <Text style={{ fontSize: 14, color: '#4b5563', flex: 1 }}>{item.name}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }}>x{item.quantity}</Text>
                </View>
              ))}
            </View>

            {/* Payment Info */}
            <View style={{ backgroundColor: '#ecfdf5', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#a7f3d0', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 14, color: '#065f46' }}>Thành tiền:</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#065f46' }}>{formatCurrency(order.total)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 14, color: '#065f46' }}>Phí vận chuyển:</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#065f46' }}>Miễn phí</Text>
              </View>
              <View style={{ height: 1, backgroundColor: '#a7f3d0', marginVertical: 8 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#065f46' }}>Tổng thanh toán:</Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#10b981' }}>{formatCurrency(order.total)}</Text>
              </View>
            </View>

            {/* Time */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: '#9ca3af' }}>⏰ Thời gian đặt hàng:</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#6b7280' }}>{order.timestamp}</Text>
            </View>

            {/* View Invoice Button */}
            <TouchableOpacity
              onPress={onShowInvoice}
              style={{
                backgroundColor: '#f0fdf4',
                borderWidth: 1,
                borderColor: '#86efac',
                borderRadius: 10,
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <Text style={{ fontSize: 18 }}>🧾</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#16a34a' }}>
                Xem hóa đơn chi tiết
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Action Buttons */}
          {order.status === OrderStatus.New && (
            <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6', gap: 10 }}>
              <Button onPress={onAccept} variant="primary" size="md" fullWidth>
               Xác nhận đơn hàng
              </Button>
              <Button onPress={onReject} variant="danger" size="md" fullWidth>
               Từ chối đơn hàng
              </Button>
            </View>
          )}

          {order.status === OrderStatus.Preparing && (
            <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' }}>
              <Button onPress={onClose} variant="primary" size="md" fullWidth>
                🚚 Giao hàng
              </Button>
            </View>
          )}

          {(order.status === OrderStatus.Delivering || order.status === OrderStatus.Completed || order.status === OrderStatus.Cancelled) && (
            <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' }}>
              <Button onPress={onClose} variant="secondary" size="md" fullWidth>
                Đóng
              </Button>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

// Modal lý do từ chối
const RejectReasonModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}> = ({ visible, onClose, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const predefinedReasons = [
    'Hết hàng',
    'Không liên lạc được khách hàng',
    'Địa chỉ giao hàng quá xa',
    'Khách hàng yêu cầu hủy',
    'Khác',
  ];

  const handleConfirm = () => {
    const reason = selectedReason === 'Khác' ? customReason : selectedReason;
    if (reason.trim()) {
      onConfirm(reason);
      setSelectedReason('');
      setCustomReason('');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 16, width: '100%', maxWidth: 400 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1f2937' }}>Lý do từ chối</Text>
            <TouchableOpacity onPress={onClose}>
              <XCircleIcon className="h-6 w-6" color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
              Vui lòng chọn lý do từ chối đơn hàng này:
            </Text>

            {/* Predefined Reasons */}
            <View style={{ gap: 10, marginBottom: 16 }}>
              {predefinedReasons.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  onPress={() => setSelectedReason(reason)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 14,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: selectedReason === reason ? '#ef4444' : '#e5e7eb',
                    backgroundColor: selectedReason === reason ? '#fee2e2' : 'white',
                  }}
                >
                  <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: selectedReason === reason ? '#ef4444' : '#d1d5db',
                    backgroundColor: selectedReason === reason ? '#ef4444' : 'white',
                    marginRight: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {selectedReason === reason && (
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'white' }} />
                    )}
                  </View>
                  <Text style={{ fontSize: 14, color: selectedReason === reason ? '#991b1b' : '#4b5563', fontWeight: selectedReason === reason ? '600' : '400' }}>
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Reason Input */}
            {selectedReason === 'Khác' && (
              <View style={{ marginBottom: 16 }}>
                <TextInput
                  value={customReason}
                  onChangeText={setCustomReason}
                  placeholder="Nhập lý do khác..."
                  multiline
                  numberOfLines={3}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 14,
                    textAlignVertical: 'top',
                    backgroundColor: '#f9fafb',
                  }}
                />
              </View>
            )}

            {/* Buttons */}
            <View style={{ gap: 10 }}>
              <Button
                onPress={handleConfirm}
                variant="danger"
                size="md"
                fullWidth
                disabled={!selectedReason || (selectedReason === 'Khác' && !customReason.trim())}
              >
                Xác nhận từ chối
              </Button>
              <Button onPress={onClose} variant="secondary" size="md" fullWidth>
                Hủy bỏ
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const OrderCard: React.FC<{ order: Order; onPress: () => void }> = ({ order, onPress }) => {
  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.New: return 'bg-blue-100';
      case OrderStatus.Preparing: return 'bg-yellow-100';
      case OrderStatus.Delivering: return 'bg-indigo-100';
      case OrderStatus.Completed: return 'bg-emerald-100';
      case OrderStatus.Cancelled: return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };
  const getStatusTextStyle = (status: OrderStatus) => {
     switch (status) {
      case OrderStatus.New: return 'text-blue-800';
      case OrderStatus.Preparing: return 'text-yellow-800';
      case OrderStatus.Delivering: return 'text-indigo-800';
      case OrderStatus.Completed: return 'text-emerald-800';
      case OrderStatus.Cancelled: return 'text-red-800';
      default: return 'text-gray-800';
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <View className="bg-white p-4 rounded-xl shadow-md mb-3">
      {/* Header - Order ID & Status */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-800">Đơn #{order.id}</Text>
          <Text className="text-sm text-gray-600 mt-0.5">{order.customerName}</Text>
        </View>
        <View className={`px-3 py-1.5 rounded-full ${getStatusStyle(order.status)}`}>
          <Text className={`text-xs font-bold ${getStatusTextStyle(order.status)}`}>
            {order.status}
          </Text>
        </View>
      </View>

      {/* Order Items */}
      <View className="bg-gray-50 p-3 rounded-lg mb-3">
        <Text className="text-sm text-gray-700 leading-5">
          {order.items.map(item => `${item.quantity} x ${item.name}`).join(', ')}
        </Text>
      </View>

      {/* Footer - Time & Total */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-xs text-gray-500">{order.timestamp}</Text>
        <Text className="text-base font-bold text-emerald-600">{formatCurrency(order.total)}</Text>
      </View>

    </View>
    </TouchableOpacity>
  );
};

const OrdersScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.New);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
  const tabs = [
    OrderStatus.New, 
    OrderStatus.Preparing, 
    OrderStatus.Delivering, 
    OrderStatus.Completed, 
    OrderStatus.Cancelled
  ];

  const filteredOrders = orders.filter(order => order.status === activeTab);

  // Count orders by status
  const getOrderCount = (status: OrderStatus) => {
    return orders.filter(order => order.status === status).length;
  };

  // Handle order card press
  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Handle accept order
  const handleAcceptOrder = () => {
    if (selectedOrder) {
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: OrderStatus.Preparing }
          : order
      ));
      setShowDetailModal(false);
      setActiveTab(OrderStatus.Preparing); // Chuyển sang tab Đang chuẩn bị
      setSelectedOrder(null);
    }
  };

  // Handle show reject modal
  const handleShowRejectModal = () => {
    setShowDetailModal(false);
    setShowRejectModal(true);
  };

  // Handle reject order with reason
  const handleRejectOrder = (reason: string) => {
    if (selectedOrder) {
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: OrderStatus.Cancelled }
          : order
      ));
      setShowRejectModal(false);
      setSelectedOrder(null);
      console.log(`Đơn ${selectedOrder.id} bị từ chối. Lý do: ${reason}`);
    }
  };

  // Handle show invoice
  const handleShowInvoice = () => {
    setShowDetailModal(false);
    setShowInvoiceModal(true);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Đơn hàng</Text>
      </View>

      {/* Tab Navigation */}
      <View style={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        >
        {tabs.map((tab) => {
          const count = getOrderCount(tab);
          const isActive = activeTab === tab;
          return (
            <View
              key={tab}
              style={{
                marginRight: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => setActiveTab(tab)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: isActive ? '#10b981' : '#f3f4f6',
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: isActive ? '#10b981' : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isActive ? 0.3 : 0,
                  shadowRadius: 4,
                  elevation: isActive ? 4 : 0,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: isActive ? 'white' : '#374151',
                  includeFontPadding: false,
                  textAlignVertical: 'center',
                }}>
                  {tab}
                </Text>
                {count > 0 && (
                  <View style={{
                    marginLeft: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 12,
                    backgroundColor: isActive ? 'white' : '#10b981',
                    minWidth: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: isActive ? '#10b981' : 'white',
                      includeFontPadding: false,
                    }}>
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onPress={() => handleOrderPress(order)}
            />
          ))
        ) : (
          <View className="items-center justify-center mt-20">
            <Text className="text-gray-400 text-base">Không có đơn hàng nào</Text>
            <Text className="text-gray-400 text-sm mt-1">trong trạng thái này</Text>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <OrderDetailModal
        order={selectedOrder}
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedOrder(null);
        }}
        onAccept={handleAcceptOrder}
        onReject={handleShowRejectModal}
        onShowInvoice={handleShowInvoice}
      />

      <RejectReasonModal
        visible={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectOrder}
      />

      <InvoiceModal
        order={selectedOrder}
        visible={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          setShowDetailModal(true);
        }}
      />
    </View>
  );
};

export default OrdersScreen;