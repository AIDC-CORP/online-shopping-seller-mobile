import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { XCircleIcon, PackageIcon, CheckCircleIcon } from '../../../components/icons';

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

// Mini horizontal bar chart for order status
const OrderStatusChart: React.FC<{ success: number; cancelled: number; pending: number }> = ({ success, cancelled, pending }) => {
  const total = success + cancelled + pending;
  const successPercent = (success / total) * 100;
  const cancelledPercent = (cancelled / total) * 100;
  const pendingPercent = (pending / total) * 100;

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden' }}>
        {successPercent > 0 && (
          <View style={{ width: `${successPercent}%`, backgroundColor: '#10b981' }} />
        )}
        {pendingPercent > 0 && (
          <View style={{ width: `${pendingPercent}%`, backgroundColor: '#f59e0b' }} />
        )}
        {cancelledPercent > 0 && (
          <View style={{ width: `${cancelledPercent}%`, backgroundColor: '#ef4444' }} />
        )}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' }} />
          <Text style={{ fontSize: 11, color: '#6b7280' }}>Thành công {successPercent.toFixed(0)}%</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b' }} />
          <Text style={{ fontSize: 11, color: '#6b7280' }}>Chờ {pendingPercent.toFixed(0)}%</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' }} />
          <Text style={{ fontSize: 11, color: '#6b7280' }}>Hủy {cancelledPercent.toFixed(0)}%</Text>
        </View>
      </View>
    </View>
  );
};

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
  
  // Mock data
  const pendingOrders = Math.round(totalOrders * 0.05); // 5% đơn đang xử lý
  const previousTotalOrders = Math.round(totalOrders * 0.88); // Kỳ trước ít hơn 12%
  const orderChange = Math.round(((totalOrders - previousTotalOrders) / previousTotalOrders) * 100);
  const isOrderIncrease = orderChange > 0;
  
  // Lý do hủy đơn (mock)
  const cancelReasons = [
    { reason: 'Khách hàng đổi ý', percent: 40, color: '#ef4444' },
    { reason: 'Không liên lạc được', percent: 30, color: '#f97316' },
    { reason: 'Hết hàng', percent: 20, color: '#fb923c' },
    { reason: 'Khác', percent: 10, color: '#fca5a5' },
  ];
  
  // Trung bình giá trị đơn hàng
  const avgOrderValue = Math.round(revenue / totalOrders);
  
  // Giờ cao điểm đặt hàng (mock)
  const peakHours = [
    { time: '8-12h', orders: Math.round(totalOrders * 0.35) },
    { time: '12-17h', orders: Math.round(totalOrders * 0.25) },
    { time: '17-22h', orders: Math.round(totalOrders * 0.30) },
    { time: '22-8h', orders: Math.round(totalOrders * 0.10) },
  ];
  
  // Thời gian xử lý trung bình (cho success orders)
  const processingTime = {
    average: '2.5 giờ',
    fast: Math.round(successfulOrders * 0.60), // 60% xử lý nhanh (<2h)
    normal: Math.round(successfulOrders * 0.30), // 30% xử lý bình thường (2-4h)
    slow: Math.round(successfulOrders * 0.10), // 10% xử lý chậm (>4h)
  };
  
  // Phương thức giao hàng (cho success orders)
  const shippingMethods = [
    { name: 'Giao hàng tiêu chuẩn', icon: '🚚', percent: 55, color: '#3b82f6' },
    { name: 'Giao hàng nhanh', icon: '⚡', percent: 30, color: '#8b5cf6' },
    { name: 'Giao hàng hỏa tốc', icon: '🚀', percent: 15, color: '#ec4899' },
  ];
  
  // Top sản phẩm bán chạy (cho success orders)
  const topSellingProducts = [
    { name: 'iPhone 14 Pro Max', orders: Math.round(successfulOrders * 0.25), revenue: revenuePerSuccess * 0.35 },
    { name: 'AirPods Pro 2', orders: Math.round(successfulOrders * 0.20), revenue: revenuePerSuccess * 0.22 },
    { name: 'MacBook Air M2', orders: Math.round(successfulOrders * 0.15), revenue: revenuePerSuccess * 0.28 },
  ];

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
            
            {/* So sánh kỳ trước - chỉ hiển thị cho type total */}
            {type === 'total' && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 }}>
                <View style={{ 
                  backgroundColor: isOrderIncrease ? 'rgba(220, 252, 231, 0.3)' : 'rgba(254, 226, 226, 0.3)',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                }}>
                  <Text style={{ 
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: '700',
                  }}>
                    {isOrderIncrease ? '↑' : '↓'} {Math.abs(orderChange)}%
                  </Text>
                </View>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12 }}>
                  so với kỳ trước
                </Text>
              </View>
            )}
          </View>

          {/* Biểu đồ trạng thái đơn hàng - chỉ cho type total */}
          {type === 'total' && (
            <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
              <Text className="text-gray-700 font-semibold mb-3 text-sm">📊 Trạng thái đơn hàng</Text>
              <OrderStatusChart 
                success={successfulOrders} 
                cancelled={cancelledOrders} 
                pending={pendingOrders} 
              />
            </View>
          )}

          {/* Giờ cao điểm - chỉ cho type total */}
          {type === 'total' && (
            <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
              <Text className="text-gray-700 font-semibold mb-3 text-sm">⏰ Giờ cao điểm đặt hàng</Text>
              <View style={{ gap: 10 }}>
                {peakHours.map((item, index) => {
                  const maxOrders = Math.max(...peakHours.map(h => h.orders));
                  const percent = (item.orders / maxOrders) * 100;
                  return (
                    <View key={index}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ fontSize: 13, color: '#4b5563', fontWeight: '500' }}>
                          {item.time}
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#3b82f6' }}>
                          {item.orders} đơn
                        </Text>
                      </View>
                      <View style={{ 
                        height: 6, 
                        backgroundColor: '#f3f4f6', 
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}>
                        <View style={{
                          height: 6,
                          width: `${percent}%`,
                          backgroundColor: '#3b82f6',
                          borderRadius: 3,
                        }} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Trung bình giá trị đơn hàng */}
          {type === 'total' && (
            <View className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-200">
              <Text className="text-emerald-700 font-semibold mb-2 text-sm">💵 Trung bình giá trị đơn</Text>
              <Text className="text-emerald-900 text-3xl font-extrabold">{formatCurrency(avgOrderValue)}</Text>
              <Text className="text-emerald-600 text-xs mt-1">= {formatCurrency(revenue)} ÷ {totalOrders} đơn</Text>
            </View>
          )}

          {/* Lý do hủy đơn - chỉ cho type cancelled */}
          {type === 'cancelled' && (
            <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
              <Text className="text-gray-700 font-semibold mb-3 text-sm">📋 Lý do hủy đơn</Text>
              <View style={{ gap: 10 }}>
                {cancelReasons.map((item, index) => (
                  <View key={index}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={{ fontSize: 13, color: '#4b5563', fontWeight: '500' }}>
                        {item.reason}
                      </Text>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: item.color }}>
                        {item.percent}%
                      </Text>
                    </View>
                    <View style={{ 
                      height: 6, 
                      backgroundColor: '#f3f4f6', 
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}>
                      <View style={{
                        height: 6,
                        width: `${item.percent}%`,
                        backgroundColor: item.color,
                        borderRadius: 3,
                      }} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}


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
            <>
              {/* Thời gian xử lý trung bình */}
              <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                <Text className="text-gray-700 font-semibold mb-3 text-sm">⏱️ Thời gian xử lý đơn hàng</Text>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Trung bình</Text>
                  <Text style={{ fontSize: 28, fontWeight: '800', color: '#6366f1' }}>{processingTime.average}</Text>
                </View>
                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' }} />
                      <Text style={{ fontSize: 12, color: '#4b5563' }}>Nhanh (&lt;2h)</Text>
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#10b981' }}>
                      {processingTime.fast} đơn ({Math.round((processingTime.fast/successfulOrders)*100)}%)
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#3b82f6' }} />
                      <Text style={{ fontSize: 12, color: '#4b5563' }}>Bình thường (2-4h)</Text>
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#3b82f6' }}>
                      {processingTime.normal} đơn ({Math.round((processingTime.normal/successfulOrders)*100)}%)
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b' }} />
                      <Text style={{ fontSize: 12, color: '#4b5563' }}>Chậm (&gt;4h)</Text>
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#f59e0b' }}>
                      {processingTime.slow} đơn ({Math.round((processingTime.slow/successfulOrders)*100)}%)
                    </Text>
                  </View>
                </View>
              </View>

              {/* Phương thức giao hàng */}
              <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                <Text className="text-gray-700 font-semibold mb-3 text-sm">🚚 Phương thức giao hàng</Text>
                <View style={{ gap: 10 }}>
                  {shippingMethods.map((method, index) => (
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

              {/* Top sản phẩm bán chạy */}
              <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                <Text className="text-gray-700 font-semibold mb-3 text-sm">🔥 Top sản phẩm bán chạy</Text>
                <View style={{ gap: 12 }}>
                  {topSellingProducts.map((product, index) => (
                    <View key={index}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
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
                        <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: '#1f2937' }} numberOfLines={1}>
                          {product.name}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 34 }}>
                        <Text style={{ fontSize: 12, color: '#6b7280' }}>
                          {product.orders} đơn
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#10b981' }}>
                          {formatCurrency(product.revenue)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

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
            </>
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
