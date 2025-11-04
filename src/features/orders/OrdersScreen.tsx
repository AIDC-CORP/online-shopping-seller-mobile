import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { mockOrders } from '../../shared/data/mockData';
import { Order, OrderStatus } from '../../shared/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui/button';

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
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

      {/* Action Buttons */}
      {order.status === OrderStatus.New && (
        <View className="border-t border-gray-100 pt-3">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button
                onPress={() => console.log('Reject order', order.id)}
                variant="danger"
                size="md"
                fullWidth
              >
                Từ chối
              </Button>
            </View>
            <View className="flex-1">
              <Button
                onPress={() => console.log('Accept order', order.id)}
                variant="primary"
                size="md"
                fullWidth
              >
                Xác nhận
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const OrdersScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.New);
  const tabs = [
    OrderStatus.New, 
    OrderStatus.Preparing, 
    OrderStatus.Delivering, 
    OrderStatus.Completed, 
    OrderStatus.Cancelled
  ];

  const filteredOrders = mockOrders.filter(order => order.status === activeTab);

  // Count orders by status
  const getOrderCount = (status: OrderStatus) => {
    return mockOrders.filter(order => order.status === status).length;
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Đơn hàng</Text>
      </View>

      {/* Tab Navigation */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-200"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        {tabs.map((tab) => {
          const count = getOrderCount(tab);
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`px-4 py-2 mr-2 rounded-lg ${
                isActive ? 'bg-emerald-500' : 'bg-gray-100'
              }`}
              style={isActive ? { 
                shadowColor: '#10b981',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              } : undefined}
            >
              <View className="flex-row items-center">
                <Text className={`text-sm font-semibold ${
                  isActive ? 'text-white' : 'text-gray-700'
                }`}>
                  {tab}
                </Text>
                {count > 0 && (
                  <View className={`ml-2 px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white' : 'bg-emerald-500'
                  }`}>
                    <Text className={`text-xs font-bold ${
                      isActive ? 'text-emerald-600' : 'text-white'
                    }`}>
                      {count}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Orders List */}
      <ScrollView 
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => <OrderCard key={order.id} order={order} />)
        ) : (
          <View className="items-center justify-center mt-20">
            <Text className="text-gray-400 text-base">Không có đơn hàng nào</Text>
            <Text className="text-gray-400 text-sm mt-1">trong trạng thái này</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrdersScreen;