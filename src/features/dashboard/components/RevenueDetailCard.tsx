import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { XCircleIcon, ChartBarIcon } from '@/src/components/icons';

interface RevenueDetailCardProps {
  revenue: number;
  totalOrders: number;
  successfulOrders: number;
  cancelledOrders: number;
  periodText: string;
  formatCurrency: (value: number) => string;
  onClose: () => void;
}

export const RevenueDetailCard: React.FC<RevenueDetailCardProps> = ({
  revenue,
  totalOrders,
  successfulOrders,
  cancelledOrders,
  periodText,
  formatCurrency,
  onClose,
}) => {
  const avgPerOrder = Math.round(revenue / totalOrders);
  const successRate = Math.round((successfulOrders / totalOrders) * 100);

  return (
    <View className="absolute inset-0 bg-black/50 justify-center items-center px-4 z-50">
      <View className="bg-white rounded-2xl w-full shadow-xl max-h-[90%]">
        {/* Header */}
        <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
          <View className="flex-row items-center space-x-3">
            <View className="bg-emerald-100 p-2.5 rounded-full">
              <ChartBarIcon className="h-6 w-6" color="#047857" />
            </View>
            <Text className="text-xl font-bold text-gray-800">Chi tiết Doanh thu</Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-1">
            <XCircleIcon className="h-6 w-6" color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="px-5 py-4" showsVerticalScrollIndicator={false}>
          {/* Period Badge */}
          <View className="bg-emerald-50 px-4 py-2 rounded-lg mb-4 self-start">
            <Text className="text-emerald-700 font-semibold text-sm">📅 {periodText}</Text>
          </View>

          {/* Main Revenue */}
          <View className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 mb-4 shadow-md">
            <Text className="text-emerald-500 text-sm font-medium mb-1">Tổng doanh thu</Text>
            <Text className="text-black text-4xl font-extrabold">{formatCurrency(revenue)}</Text>
          </View>

          {/* Stats Grid */}
          <View className="space-y-3">
            {/* Average per order */}
            <View className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between">
              <View>
                <Text className="text-gray-600 text-sm mb-1">Trung bình mỗi đơn</Text>
                <Text className="text-gray-900 text-2xl font-extrabold">{formatCurrency(avgPerOrder)}</Text>
              </View>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-700 font-semibold text-xs">AVG</Text>
              </View>
            </View>

            {/* Total Orders */}
            <View className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between">
              <View>
                <Text className="text-gray-600 text-sm mb-1">Tổng số đơn hàng</Text>
                <Text className="text-gray-900 text-2xl font-extrabold">{totalOrders} đơn</Text>
              </View>
              <View className="bg-purple-100 px-3 py-1 rounded-full">
                <Text className="text-purple-700 font-semibold text-xs">100%</Text>
              </View>
            </View>

            {/* Success Orders */}
            <View className="bg-green-50 rounded-xl p-4 flex-row items-center justify-between border border-green-200">
              <View className="flex-1">
                <Text className="text-green-700 text-sm mb-1">✅ Đơn thành công</Text>
                <Text className="text-green-900 text-2xl font-extrabold">{successfulOrders} đơn</Text>
              </View>
              <View className="bg-green-200 px-3 py-1 rounded-full">
                <Text className="text-green-800 font-bold text-xs">{successRate}%</Text>
              </View>
            </View>

            {/* Cancelled Orders */}
            <View className="bg-red-50 rounded-xl p-4 flex-row items-center justify-between border border-red-200">
              <View className="flex-1">
                <Text className="text-red-700 text-sm mb-1">❌ Đơn bị hủy</Text>
                <Text className="text-red-900 text-2xl font-extrabold">{cancelledOrders} đơn</Text>
              </View>
              <View className="bg-red-200 px-3 py-1 rounded-full">
                <Text className="text-red-800 font-bold text-xs">{Math.round((cancelledOrders / totalOrders) * 100)}%</Text>
              </View>
            </View>
          </View>

          {/* Insight */}
          <View className="bg-blue-50 rounded-xl p-4 mt-4 border border-blue-200">
            <Text className="text-blue-900 font-semibold mb-2">💡 Phân tích</Text>
            <Text className="text-blue-700 text-sm leading-5">
              Tỷ lệ thành công {successRate}% cho thấy hiệu suất kinh doanh {successRate >= 80 ? 'rất tốt' : successRate >= 60 ? 'khá tốt' : 'cần cải thiện'}. 
              {cancelledOrders > totalOrders * 0.1 && ' Nên xem xét giảm tỷ lệ hủy đơn để tăng doanh thu.'}
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="p-4 border-t border-gray-100">
          <TouchableOpacity
            onPress={onClose}
            className="bg-emerald-500 py-3 rounded-xl active:bg-emerald-600"
          >
            <Text className="text-white text-center font-bold">Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
