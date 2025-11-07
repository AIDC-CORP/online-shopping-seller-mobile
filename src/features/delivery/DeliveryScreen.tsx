import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Image, Linking } from 'react-native';
import { mockDeliveries } from '../../shared/data/mockData';
import { Delivery, DeliveryStatus, DeliveryPartner } from '../../shared/types';

// Status colors
const getStatusColor = (status: DeliveryStatus) => {
  switch (status) {
    case DeliveryStatus.Pending: return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
    case DeliveryStatus.PickedUp: return { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' };
    case DeliveryStatus.InTransit: return { bg: '#e0e7ff', text: '#3730a3', border: '#6366f1' };
    case DeliveryStatus.Delivering: return { bg: '#ddd6fe', text: '#5b21b6', border: '#8b5cf6' };
    case DeliveryStatus.Delivered: return { bg: '#d1fae5', text: '#065f46', border: '#10b981' };
    case DeliveryStatus.Failed: return { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' };
    case DeliveryStatus.Returned: return { bg: '#f3f4f6', text: '#374151', border: '#6b7280' };
  }
};

// Partner icons
const getPartnerIcon = (partner: DeliveryPartner) => {
  switch (partner) {
    case DeliveryPartner.GrabExpress: return '🚗';
    case DeliveryPartner.GoJek: return '🏍️';
    case DeliveryPartner.Ninja: return '📦';
    case DeliveryPartner.GHTK: return '🚚';
    case DeliveryPartner.GHN: return '🚛';
    case DeliveryPartner.ViettelPost: return '📮';
    case DeliveryPartner.JT: return '📫';
    case DeliveryPartner.SelfDelivery: return '🛵';
  }
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Format date time
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Delivery Card Component
const DeliveryCard: React.FC<{ 
  delivery: Delivery; 
  onPress: () => void;
}> = ({ delivery, onPress }) => {
  const statusColors = getStatusColor(delivery.status);
  const partnerIcon = getPartnerIcon(delivery.partner);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text style={{ fontSize: 18 }}>{partnerIcon}</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', flex: 1 }}>
              {delivery.trackingNumber}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: '#6b7280' }}>
            Đơn hàng #{delivery.orderId}
          </Text>
        </View>
        
        <View
          style={{
            backgroundColor: statusColors.bg,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: statusColors.border,
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: statusColors.text }}>
            {delivery.status}
          </Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={{ 
        backgroundColor: '#f9fafb', 
        padding: 12, 
        borderRadius: 8, 
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#10b981'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }}>
            👤 {delivery.customerName}
          </Text>
        </View>
        <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
          📞 {delivery.customerPhone}
        </Text>
        <Text style={{ fontSize: 13, color: '#6b7280' }}>
          📍 {delivery.deliveryAddress.address}, {delivery.deliveryAddress.district}
        </Text>
      </View>

      {/* Driver Info (if assigned) */}
      {delivery.driver && (
        <View style={{ 
          backgroundColor: '#ecfdf5', 
          padding: 12, 
          borderRadius: 8, 
          marginBottom: 12,
          borderLeftWidth: 3,
          borderLeftColor: '#059669'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#065f46', marginBottom: 4 }}>
                🏍️ Tài xế: {delivery.driver.name}
              </Text>
              <Text style={{ fontSize: 12, color: '#059669' }}>
                {delivery.driver.vehicleNumber} • ⭐ {delivery.driver.rating}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${delivery.driver!.phone}`)}
              style={{
                backgroundColor: '#10b981',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>📞 Gọi</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Shipping Info */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
            Phí vận chuyển
          </Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#10b981' }}>
            {formatCurrency(delivery.shippingFee)}
          </Text>
        </View>
        
        {delivery.codAmount && (
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
              Thu hộ (COD)
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#f59e0b' }}>
              {formatCurrency(delivery.codAmount)}
            </Text>
          </View>
        )}
      </View>

      {/* Time Info */}
      <View style={{ 
        marginTop: 12, 
        paddingTop: 12, 
        borderTopWidth: 1, 
        borderTopColor: '#f3f4f6' 
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            Tạo: {formatDateTime(delivery.createdAt)}
          </Text>
          {delivery.estimatedDeliveryTime && (
            <Text style={{ fontSize: 12, color: '#6b7280' }}>
              Dự kiến: {formatDateTime(delivery.estimatedDeliveryTime)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Delivery Detail Modal
const DeliveryDetailModal: React.FC<{
  delivery: Delivery | null;
  visible: boolean;
  onClose: () => void;
}> = ({ delivery, visible, onClose }) => {
  if (!delivery) return null;

  const statusColors = getStatusColor(delivery.status);
  const partnerIcon = getPartnerIcon(delivery.partner);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View style={{ 
          backgroundColor: 'white', 
          borderTopLeftRadius: 24, 
          borderTopRightRadius: 24,
          maxHeight: '90%',
        }}>
          {/* Header */}
          <View style={{ 
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#f3f4f6'
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Text style={{ fontSize: 24 }}>{partnerIcon}</Text>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#1f2937' }}>
                    {delivery.trackingNumber}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>
                  Đơn hàng #{delivery.orderId}
                </Text>
              </View>
              
              <TouchableOpacity onPress={onClose}>
                <Text style={{ fontSize: 28, color: '#9ca3af' }}>×</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={{ maxHeight: 600 }}>
            <View style={{ padding: 20 }}>
              {/* Current Status */}
              <View
                style={{
                  backgroundColor: statusColors.bg,
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 20,
                  borderWidth: 2,
                  borderColor: statusColors.border,
                }}
              >
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '700', 
                  color: statusColors.text,
                  textAlign: 'center'
                }}>
                  {delivery.status}
                </Text>
              </View>

              {/* Customer Information */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 12 }}>
                  📦 Thông tin giao hàng
                </Text>
                <View style={{ 
                  backgroundColor: '#f9fafb', 
                  padding: 16, 
                  borderRadius: 12,
                  gap: 10
                }}>
                  <View>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Khách hàng</Text>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1f2937' }}>
                      {delivery.customerName}
                    </Text>
                  </View>
                  
                  <View>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Số điện thoại</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1f2937' }}>
                        {delivery.customerPhone}
                      </Text>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:${delivery.customerPhone}`)}
                        style={{
                          backgroundColor: '#10b981',
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 6,
                        }}
                      >
                        <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>📞 Gọi</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Địa chỉ giao hàng</Text>
                    <Text style={{ fontSize: 14, color: '#1f2937', lineHeight: 20 }}>
                      {delivery.deliveryAddress.address}
                      {delivery.deliveryAddress.ward && `, ${delivery.deliveryAddress.ward}`}
                      {`, ${delivery.deliveryAddress.district}`}
                      {`, ${delivery.deliveryAddress.city}`}
                    </Text>
                  </View>

                  {delivery.notes && (
                    <View>
                      <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Ghi chú</Text>
                      <Text style={{ fontSize: 14, color: '#f59e0b', fontStyle: 'italic' }}>
                        {delivery.notes}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Driver Information */}
              {delivery.driver && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 12 }}>
                    🏍️ Thông tin tài xế
                  </Text>
                  <View style={{ 
                    backgroundColor: '#ecfdf5', 
                    padding: 16, 
                    borderRadius: 12,
                    gap: 10
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 12, color: '#065f46', marginBottom: 4 }}>Tài xế</Text>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#065f46' }}>
                          {delivery.driver.name}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 12, color: '#065f46', marginBottom: 4 }}>Đánh giá</Text>
                        <Text style={{ fontSize: 15, fontWeight: '700', color: '#10b981' }}>
                          ⭐ {delivery.driver.rating}
                        </Text>
                      </View>
                    </View>

                    <View>
                      <Text style={{ fontSize: 12, color: '#065f46', marginBottom: 4 }}>Số điện thoại</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#065f46' }}>
                          {delivery.driver.phone}
                        </Text>
                        <TouchableOpacity
                          onPress={() => Linking.openURL(`tel:${delivery.driver!.phone}`)}
                          style={{
                            backgroundColor: '#10b981',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 6,
                          }}
                        >
                          <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>📞 Gọi</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {delivery.driver.vehicleNumber && (
                      <View>
                        <Text style={{ fontSize: 12, color: '#065f46', marginBottom: 4 }}>Biển số xe</Text>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#065f46' }}>
                          {delivery.driver.vehicleNumber}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Shipping Details */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 12 }}>
                  💰 Chi phí vận chuyển
                </Text>
                <View style={{ 
                  backgroundColor: '#f9fafb', 
                  padding: 16, 
                  borderRadius: 12,
                  gap: 12
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, color: '#6b7280' }}>Phí vận chuyển</Text>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#10b981' }}>
                      {formatCurrency(delivery.shippingFee)}
                    </Text>
                  </View>

                  {delivery.codAmount && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 14, color: '#6b7280' }}>Thu hộ (COD)</Text>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#f59e0b' }}>
                        {formatCurrency(delivery.codAmount)}
                      </Text>
                    </View>
                  )}

                  {delivery.weight && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 14, color: '#6b7280' }}>Khối lượng</Text>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#6b7280' }}>
                        {delivery.weight} kg
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Tracking History */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 12 }}>
                  📍 Lịch sử vận chuyển
                </Text>
                <View style={{ gap: 12 }}>
                  {delivery.trackingHistory.map((point, index) => {
                    const isLast = index === delivery.trackingHistory.length - 1;
                    const pointColors = getStatusColor(point.status);
                    
                    return (
                      <View key={index} style={{ flexDirection: 'row', gap: 12 }}>
                        {/* Timeline */}
                        <View style={{ alignItems: 'center' }}>
                          <View style={{
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            backgroundColor: pointColors.border,
                            borderWidth: 3,
                            borderColor: isLast ? pointColors.border : '#e5e7eb',
                          }} />
                          {!isLast && (
                            <View style={{
                              width: 2,
                              flex: 1,
                              backgroundColor: '#e5e7eb',
                              marginVertical: 4,
                            }} />
                          )}
                        </View>

                        {/* Content */}
                        <View style={{ flex: 1, paddingBottom: isLast ? 0 : 16 }}>
                          <View style={{
                            backgroundColor: isLast ? pointColors.bg : '#f9fafb',
                            padding: 12,
                            borderRadius: 8,
                            borderLeftWidth: 3,
                            borderLeftColor: pointColors.border,
                          }}>
                            <Text style={{ 
                              fontSize: 14, 
                              fontWeight: '700', 
                              color: isLast ? pointColors.text : '#1f2937',
                              marginBottom: 4
                            }}>
                              {point.status}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
                              {formatDateTime(point.timestamp)}
                            </Text>
                            {point.location && (
                              <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
                                📍 {point.location}
                              </Text>
                            )}
                            {point.note && (
                              <Text style={{ fontSize: 13, color: '#9ca3af', fontStyle: 'italic' }}>
                                {point.note}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Failure Reason */}
              {delivery.failureReason && (
                <View style={{ 
                  backgroundColor: '#fee2e2', 
                  padding: 16, 
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#ef4444',
                  marginBottom: 20
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#991b1b', marginBottom: 6 }}>
                    ⚠️ Lý do giao hàng thất bại
                  </Text>
                  <Text style={{ fontSize: 14, color: '#991b1b' }}>
                    {delivery.failureReason}
                  </Text>
                </View>
              )}

              {/* Proof of Delivery */}
              {delivery.proofOfDelivery && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 12 }}>
                    📸 Ảnh chứng nhận giao hàng
                  </Text>
                  <Image
                    source={{ uri: delivery.proofOfDelivery }}
                    style={{ 
                      width: '100%', 
                      height: 200, 
                      borderRadius: 12,
                      backgroundColor: '#f3f4f6'
                    }}
                    resizeMode="cover"
                  />
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={{ 
            padding: 20, 
            borderTopWidth: 1, 
            borderTopColor: '#f3f4f6',
            gap: 12
          }}>
            {delivery.status === DeliveryStatus.Failed && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#f59e0b',
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={() => {
                  // Handle reschedule delivery
                  alert('Chức năng hẹn giao lại đang được phát triển');
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
                  🔄 Hẹn giao lại
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: '#f3f4f6',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#6b7280', fontSize: 16, fontWeight: '600' }}>
                Đóng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Main Delivery Screen
const DeliveryScreen: React.FC = () => {
  const [deliveries] = useState<Delivery[]>(mockDeliveries);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | DeliveryStatus>('all');

  // Filter deliveries by status
  const filteredDeliveries = activeTab === 'all' 
    ? deliveries 
    : deliveries.filter(d => d.status === activeTab);

  // Count by status
  const getStatusCount = (status: DeliveryStatus) => {
    return deliveries.filter(d => d.status === status).length;
  };

  // Tabs
  const tabs: { key: 'all' | DeliveryStatus; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: DeliveryStatus.Pending, label: 'Chờ lấy' },
    { key: DeliveryStatus.InTransit, label: 'Đang vận chuyển' },
    { key: DeliveryStatus.Delivering, label: 'Đang giao' },
    { key: DeliveryStatus.Delivered, label: 'Đã giao' },
    { key: DeliveryStatus.Failed, label: 'Thất bại' },
  ];

  const handleDeliveryPress = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowDetailModal(true);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">🚚 Quản lý giao hàng</Text>
        <Text className="text-sm text-gray-600 mt-1">
          {deliveries.length} đơn giao hàng
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        >
          {tabs.map((tab) => {
            const count = tab.key === 'all' ? deliveries.length : getStatusCount(tab.key as DeliveryStatus);
            const isActive = activeTab === tab.key;
            
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: isActive ? '#10b981' : '#f3f4f6',
                  marginRight: 8,
                  shadowColor: isActive ? '#10b981' : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isActive ? 0.3 : 0,
                  shadowRadius: 4,
                  elevation: isActive ? 4 : 0,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: isActive ? 'white' : '#374151',
                  }}>
                    {tab.label}
                  </Text>
                  {count > 0 && (
                    <View style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 12,
                      backgroundColor: isActive ? 'white' : '#10b981',
                      minWidth: 24,
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: isActive ? '#10b981' : 'white',
                      }}>
                        {count}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Deliveries List */}
      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredDeliveries.length > 0 ? (
          filteredDeliveries.map(delivery => (
            <DeliveryCard 
              key={delivery.id} 
              delivery={delivery} 
              onPress={() => handleDeliveryPress(delivery)}
            />
          ))
        ) : (
          <View className="items-center justify-center mt-20">
            <Text className="text-6xl mb-4">📭</Text>
            <Text className="text-gray-400 text-base">Không có đơn giao hàng nào</Text>
            <Text className="text-gray-400 text-sm mt-1">trong trạng thái này</Text>
          </View>
        )}
      </ScrollView>

      {/* Detail Modal */}
      <DeliveryDetailModal
        delivery={selectedDelivery}
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedDelivery(null);
        }}
      />
    </View>
  );
};

export default DeliveryScreen;
