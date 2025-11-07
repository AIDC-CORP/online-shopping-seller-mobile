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

// Mini bar chart component
const MiniBarChart: React.FC<{ data: number[] }> = ({ data }) => {
  const maxValue = Math.max(...data);
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 60, gap: 4 }}>
      {data.map((value, index) => {
        const height = (value / maxValue) * 60;
        return (
          <View key={index} style={{ flex: 1, alignItems: 'center' }}>
            <View
              style={{
                width: '100%',
                height: height || 5,
                backgroundColor: '#10b981',
                borderRadius: 4,
                opacity: 0.8,
              }}
            />
            <Text style={{ fontSize: 9, color: '#6b7280', marginTop: 4 }}>
              T{index + 1}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

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
  
  // Mock data cho biểu đồ 7 ngày
  const weeklyRevenue = [12500000, 15300000, 18200000, 14800000, 21000000, 19500000, 24600000];
  
  // Tính % so với kỳ trước (mock)
  const previousRevenue = revenue * 0.85; // Giả sử kỳ trước thấp hơn 15%
  const changePercent = Math.round(((revenue - previousRevenue) / previousRevenue) * 100);
  const isIncrease = changePercent > 0;
  
  // Top sản phẩm đóng góp doanh thu (mock)
  const topProducts = [
    { name: 'iPhone 12 Pro Max', revenue: revenue * 0.35 },
    { name: 'AirPods Pro', revenue: revenue * 0.25 },
    { name: 'MacBook Air M2', revenue: revenue * 0.20 },
  ];
  
  // Phương thức thanh toán (mock)
  const paymentMethods = [
    { name: 'COD', icon: '💵', percent: 45, color: '#10b981' },
    { name: 'Chuyển khoản', icon: '🏦', percent: 35, color: '#3b82f6' },
    { name: 'Ví điện tử', icon: '💳', percent: 20, color: '#8b5cf6' },
  ];

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
            
            {/* So sánh kỳ trước */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 }}>
              <View style={{ 
                backgroundColor: isIncrease ? '#dcfce7' : '#fee2e2',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}>
                <Text style={{ 
                  color: isIncrease ? '#16a34a' : '#dc2626',
                  fontSize: 12,
                  fontWeight: '700',
                }}>
                  {isIncrease ? '↑' : '↓'} {Math.abs(changePercent)}%
                </Text>
              </View>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>
                so với kỳ trước
              </Text>
            </View>
          </View>

          {/* Biểu đồ doanh thu 7 ngày */}
          <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
            <Text className="text-gray-700 font-semibold mb-3 text-sm">📊 Doanh thu 7 ngày qua</Text>
            <MiniBarChart data={weeklyRevenue} />
          </View>

          {/* Top sản phẩm */}
          <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
            <Text className="text-gray-700 font-semibold mb-3 text-sm">🏆 Top sản phẩm đóng góp</Text>
            <View style={{ gap: 10 }}>
              {topProducts.map((product, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#d1d5db' : '#c2410c',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#1f2937' }} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                      {formatCurrency(product.revenue)} ({Math.round((product.revenue / revenue) * 100)}%)
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Phương thức thanh toán */}
          <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
            <Text className="text-gray-700 font-semibold mb-3 text-sm">💰 Phương thức thanh toán</Text>
            <View style={{ gap: 10 }}>
              {paymentMethods.map((method, index) => (
                <View key={index}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontSize: 16 }}>{method.icon}</Text>
                      <Text style={{ fontSize: 13, color: '#4b5563', fontWeight: '500' }}>
                        {method.name}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: method.color }}>
                      {method.percent}%
                    </Text>
                  </View>
                  {/* Progress bar */}
                  <View style={{ 
                    height: 6, 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}>
                    <View style={{
                      height: 6,
                      width: `${method.percent}%`,
                      backgroundColor: method.color,
                      borderRadius: 3,
                    }} />
                  </View>
                </View>
              ))}
            </View>
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
