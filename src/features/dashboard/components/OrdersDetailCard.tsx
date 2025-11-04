import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { XCircleIcon, PackageIcon, CheckCircleIcon } from '@/src/components/icons';

interface OrdersDetailCardProps {
  totalOrders: number;
  successfulOrders: number;
  cancelledOrders: number;
  revenue: number;
  periodText: string;
  formatCurrency: (value: number) => string;
  onClose: () => void;
  type: 'total' | 'success' | 'cancelled';
}

export const OrdersDetailCard: React.FC<OrdersDetailCardProps> = ({
  totalOrders,
  successfulOrders,
  cancelledOrders,
  revenue,
  periodText,
  formatCurrency,
  onClose,
  type,
}) => {
  const successRate = Math.round((successfulOrders / totalOrders) * 100);
  const cancelRate = Math.round((cancelledOrders / totalOrders) * 100);
  const revenuePerSuccess = Math.round((revenue * successfulOrders) / totalOrders);
  const lostRevenue = Math.round((revenue * cancelledOrders) / totalOrders);

  const getTitle = () => {
    switch (type) {
      case 'total': return 'Tổng đơn hàng';
      case 'success': return 'Đơn thành công';
      case 'cancelled': return 'Đơn đã hủy';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'total': return <PackageIcon className="h-6 w-6" color="#1d4ed8" />;
      case 'success': return <CheckCircleIcon className="h-6 w-6" color="#4338ca" />;
      case 'cancelled': return <XCircleIcon className="h-6 w-6" color="#b91c1c" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'total': return 'bg-blue-100';
      case 'success': return 'bg-indigo-100';
      case 'cancelled': return 'bg-red-100';
    }
  };

  const getMainColor = () => {
    switch (type) {
      case 'total': return 'from-blue-800 to-blue-900';
      case 'success': return 'from-indigo-500 to-indigo-600';
      case 'cancelled': return 'from-red-500 to-red-600';
    }
  };

  const getMainValue = () => {
    switch (type) {
      case 'total': return totalOrders;
      case 'success': return successfulOrders;
      case 'cancelled': return cancelledOrders;
    }
  };

  return (
    <View className="absolute inset-0 bg-black/50 justify-center items-center px-4 z-50">
      <View className="bg-white rounded-2xl w-full shadow-xl max-h-[90%]">
        {/* Header */}
        <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
          <View className="flex-row items-center space-x-3">
            <View className={`${getBgColor()} p-2.5 rounded-full`}>
              {getIcon()}
            </View>
            <Text className="text-xl font-bold text-gray-800">{getTitle()}</Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-1">
            <XCircleIcon className="h-6 w-6" color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="px-5 py-4" showsVerticalScrollIndicator={false}>
          {/* Period Badge */}
          <View className={`${type === 'cancelled' ? 'bg-red-50' : type === 'success' ? 'bg-indigo-50' : 'bg-blue-50'} px-4 py-2 rounded-lg mb-4 self-start`}>
            <Text className={`${type === 'cancelled' ? 'text-red-700' : type === 'success' ? 'text-indigo-700' : 'text-blue-700'} font-semibold text-sm`}>📅 {periodText}</Text>
          </View>

          {/* Main Count */}
          <View className={`bg-gradient-to-br ${getMainColor()} rounded-xl p-5 mb-4 shadow-md`}>
            <Text className={`${type === 'cancelled' ? 'text-red-100' : type === 'success' ? 'text-indigo-100' : 'text-blue-100'} text-blue-600 font-extrabold mb-1`}>
              {type === 'total' ? 'Tổng số đơn hàng' : type === 'success' ? 'Số đơn thành công' : 'Số đơn bị hủy'}
            </Text>
            <Text className="text-4xl font-extrabold">{getMainValue()} đơn</Text>
          </View>

          {/* Stats based on type */}
          {type === 'total' && (
            <View className="space-y-3">
              {/* Success breakdown */}
              <View className="bg-green-50 rounded-xl p-4 border border-green-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-green-700 font-semibold">✅ Đơn thành công</Text>
                  <View className="bg-green-200 px-3 py-1 rounded-full">
                    <Text className="text-green-800 font-bold text-xs">{successRate}%</Text>
                  </View>
                </View>
                <Text className="text-green-900 text-3xl font-extrabold">{successfulOrders} đơn</Text>
                <Text className="text-green-600 text-sm mt-1">Doanh thu: {formatCurrency(revenuePerSuccess)}</Text>
              </View>

              {/* Cancelled breakdown */}
              <View className="bg-red-50 rounded-xl p-4 border border-red-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-red-700 font-semibold">❌ Đơn bị hủy</Text>
                  <View className="bg-red-200 px-3 py-1 rounded-full">
                    <Text className="text-red-800 font-bold text-xs">{cancelRate}%</Text>
                  </View>
                </View>
                <Text className="text-red-900 text-3xl font-extrabold">{cancelledOrders} đơn</Text>
                <Text className="text-red-600 text-sm mt-1">Mất: ~{formatCurrency(lostRevenue)}</Text>
              </View>

              {/* Total Revenue */}
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-600 text-sm mb-1">Tổng doanh thu</Text>
                <Text className="text-gray-900 text-2xl font-extrabold">{formatCurrency(revenue)}</Text>
              </View>
            </View>
          )}

          {type === 'success' && (
            <View className="space-y-3">
              <View className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                <Text className="text-indigo-600 text-sm mb-1">Tỷ lệ thành công</Text>
                <Text className="text-indigo-900 text-4xl font-extrabold">{successRate}%</Text>
              </View>

              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-gray-600 text-sm mb-1">Doanh thu ước tính</Text>
                <Text className="text-gray-900 text-2xl font-extrabold">{formatCurrency(revenuePerSuccess)}</Text>
              </View>

              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-gray-600 text-sm mb-1">Tổng đơn hàng</Text>
                <Text className="text-gray-900 text-2xl font-extrabold">{totalOrders} đơn</Text>
              </View>
            </View>
          )}

          {type === 'cancelled' && (
            <View className="space-y-3">
              <View className="bg-red-50 rounded-xl p-4 border border-red-200">
                <Text className="text-red-600 text-sm mb-1">Tỷ lệ hủy đơn</Text>
                <Text className="text-red-900 text-4xl font-extrabold">{cancelRate}%</Text>
              </View>

              <View className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <Text className="text-orange-600 text-sm mb-1">Doanh thu bị mất</Text>
                <Text className="text-orange-900 text-2xl font-extrabold">~{formatCurrency(lostRevenue)}</Text>
              </View>

              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-gray-600 text-sm mb-1">Tổng đơn hàng</Text>
                <Text className="text-gray-900 text-2xl font-extrabold">{totalOrders} đơn</Text>
              </View>
            </View>
          )}

          {/* Insight */}
          <View className={`${type === 'cancelled' ? 'bg-orange-50 border-orange-200' : type === 'success' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} rounded-xl p-4 mt-4 border`}>
            <Text className={`${type === 'cancelled' ? 'text-orange-900' : type === 'success' ? 'text-green-900' : 'text-blue-900'} font-semibold mb-2`}>💡 Phân tích</Text>
            <Text className={`${type === 'cancelled' ? 'text-orange-700' : type === 'success' ? 'text-green-700' : 'text-blue-700'} text-sm leading-5`}>
              {type === 'total' && `Với ${totalOrders} đơn hàng, tỷ lệ thành công đạt ${successRate}%. ${cancelRate > 15 ? 'Nên tìm hiểu nguyên nhân hủy đơn để cải thiện.' : 'Tỷ lệ hủy đơn ở mức chấp nhận được.'}`}
              {type === 'success' && `Tỷ lệ thành công ${successRate}% ${successRate >= 85 ? 'rất xuất sắc!' : successRate >= 70 ? 'ở mức tốt.' : 'cần được cải thiện.'} Tiếp tục duy trì chất lượng dịch vụ.`}
              {type === 'cancelled' && `Tỷ lệ hủy ${cancelRate}% ${cancelRate > 15 ? 'khá cao, cần xem xét lại quy trình xử lý đơn hàng, chất lượng sản phẩm và dịch vụ chăm sóc khách hàng.' : 'ở mức chấp nhận được. Tiếp tục theo dõi và cải thiện.'}`}
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="p-4 border-t border-gray-100">
          <TouchableOpacity
            onPress={onClose}
            className={`${type === 'cancelled' ? 'bg-red-500 active:bg-red-600' : type === 'success' ? 'bg-indigo-500 active:bg-indigo-600' : 'bg-blue-500 active:bg-blue-600'} py-3 rounded-xl`}
          >
            <Text className="text-white text-center font-bold">Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
