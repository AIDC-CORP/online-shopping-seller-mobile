import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { XCircleIcon, PackageIcon, CheckCircleIcon } from '../../../components/icons';
import { Product } from '../../../shared/types';

interface ProductDetailCardProps {
  product: Product;
  formatCurrency: (value: number) => string;
  onClose: () => void;
}

export const ProductDetailCard: React.FC<ProductDetailCardProps> = ({
  product,
  formatCurrency,
  onClose,
}) => {
  const totalValue = product.price * (product.sold || 0);
  const stockStatus = product.stock > 50 ? 'Còn nhiều' : product.stock > 20 ? 'Còn vừa' : product.stock > 0 ? 'Sắp hết' : 'Hết hàng';
  const stockColor = product.stock > 50 ? 'text-green-700 bg-green-100' : product.stock > 20 ? 'text-blue-700 bg-blue-100' : product.stock > 0 ? 'text-orange-700 bg-orange-100' : 'text-red-700 bg-red-100';
  
  // Mock data cho analytics
  const previousSold = Math.round((product.sold || 0) * 0.82); // Kỳ trước bán ít hơn 18%
  const salesChange = product.sold && previousSold ? Math.round(((product.sold - previousSold) / previousSold) * 100) : 0;
  const isSalesIncrease = salesChange > 0;
  
  // Doanh số 7 ngày qua (mock)
  const weeklySales = [8, 12, 15, 10, 18, 14, 23]; // Số lượng bán mỗi ngày
  const maxDailySales = Math.max(...weeklySales);
  
  // Tỷ lệ tồn kho
  const inventoryTurnover = product.sold && product.stock ? ((product.sold / (product.stock + product.sold)) * 100).toFixed(1) : '0';
  
  // Đánh giá sản phẩm (mock)
  const productRating = {
    average: 4.5,
    total: Math.round((product.sold || 0) * 0.3), // 30% khách hàng đánh giá
    distribution: [
      { stars: 5, percent: 60 },
      { stars: 4, percent: 25 },
      { stars: 3, percent: 10 },
      { stars: 2, percent: 3 },
      { stars: 1, percent: 2 },
    ]
  };

  return (
    <View className="absolute inset-0 bg-black/50 justify-center items-center px-4 z-50">
      <View className="bg-white rounded-2xl w-full shadow-xl max-h-[90%]">
        {/* Header */}
        <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
          <Text className="text-xl font-bold text-gray-800 flex-1 pr-2">Chi tiết Sản phẩm</Text>
          <TouchableOpacity onPress={onClose} className="p-1">
            <XCircleIcon className="h-6 w-6" color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="px-5 py-4" showsVerticalScrollIndicator={false}>
          {/* Product Image */}
          <View className="items-center mb-4">
            <Image 
              source={{ uri: product.imageUrl }} 
              className="w-40 h-40 rounded-2xl shadow-md"
              resizeMode="cover"
            />
          </View>

          {/* Product Name */}
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <Text className="text-gray-600 text-xs mb-1">Tên sản phẩm</Text>
            <Text className="text-gray-900 text-xl font-bold">{product.name}</Text>
          </View>

          {/* Price & Unit */}
          <View className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 mb-4 shadow-md">
            <Text className="text-emerald-500 text-sm font-medium mb-1">Giá bán</Text>
            <View className="flex-row items-end">
              <Text className=" text-4xl font-extrabold">{formatCurrency(product.price)}</Text>
              <Text className="text-emerald-500 text-lg ml-2 mb-1.5">/ {product.unit}</Text>
            </View>
            
            {/* So sánh doanh số kỳ trước */}
            {product.sold && product.sold > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 }}>
                <View style={{ 
                  backgroundColor: isSalesIncrease ? 'rgba(220, 252, 231, 0.3)' : 'rgba(254, 226, 226, 0.3)',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                }}>
                  <Text style={{ 
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: '700',
                  }}>
                    {isSalesIncrease ? '↑' : '↓'} {Math.abs(salesChange)}%
                  </Text>
                </View>
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 12 }}>
                  doanh số vs kỳ trước
                </Text>
              </View>
            )}
          </View>

          {/* Biểu đồ doanh số 7 ngày */}
          {product.sold && product.sold > 0 && (
            <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
              <Text className="text-gray-700 font-semibold mb-3 text-sm">📊 Doanh số 7 ngày qua</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 60, gap: 4 }}>
                {weeklySales.map((value, index) => {
                  const height = (value / maxDailySales) * 60;
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
            </View>
          )}

          {/* Tỷ lệ luân chuyển kho */}
          {product.stock > 0 && (
            <View className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
              <Text className="text-blue-700 font-semibold mb-2 text-sm">🔄 Tỷ lệ luân chuyển kho</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                <Text className="text-blue-900 text-3xl font-extrabold">{inventoryTurnover}%</Text>
                <Text style={{ color: '#3b82f6', fontSize: 12, marginBottom: 6 }}>
                  đã bán / (tồn + đã bán)
                </Text>
              </View>
              <Text style={{ color: '#3b82f6', fontSize: 11, marginTop: 4 }}>
                {parseFloat(inventoryTurnover) > 70 ? '✅ Sản phẩm tiêu thụ rất tốt' : 
                 parseFloat(inventoryTurnover) > 40 ? '📈 Sản phẩm bán ổn định' : 
                 '⚠️ Cần tăng cường marketing'}
              </Text>
            </View>
          )}

          {/* Đánh giá sản phẩm */}
          {product.sold && product.sold > 10 && (
            <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text className="text-gray-700 font-semibold text-sm">⭐ Đánh giá khách hàng</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 24, fontWeight: '700', color: '#f59e0b' }}>
                    {productRating.average}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>
                    ({productRating.total} đánh giá)
                  </Text>
                </View>
              </View>
              <View style={{ gap: 6 }}>
                {productRating.distribution.map((item, index) => (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 11, color: '#6b7280', width: 50 }}>
                      {item.stars} sao
                    </Text>
                    <View style={{ 
                      flex: 1, 
                      height: 6, 
                      backgroundColor: '#f3f4f6', 
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}>
                      <View style={{
                        height: 6,
                        width: `${item.percent}%`,
                        backgroundColor: '#f59e0b',
                        borderRadius: 3,
                      }} />
                    </View>
                    <Text style={{ fontSize: 11, color: '#6b7280', width: 35, textAlign: 'right' }}>
                      {item.percent}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}


          {/* Stats Grid */}
          <View className="flex-row space-x-3 mb-4">
            {/* Stock */}
            <View className="flex-1 bg-purple-50 rounded-xl p-4 border border-purple-200">
              <View className="flex-row items-center mb-2">
                <PackageIcon className="h-4 w-4 mr-1" color="#7c3aed" />
                <Text className="text-purple-600 text-xs font-medium">Tồn kho</Text>
              </View>
              <Text className="text-purple-900 text-3xl font-extrabold">{product.stock}</Text>
              <Text className="text-purple-600 text-xs mt-1">{product.unit}</Text>
            </View>

            {/* Sold */}
            <View className="flex-1 bg-green-50 rounded-xl p-4 border border-green-200">
              <View className="flex-row items-center mb-2">
                <CheckCircleIcon className="h-4 w-4 mr-1" color="#16a34a" />
                <Text className="text-green-600 text-xs font-medium">Đã bán</Text>
              </View>
              <Text className="text-green-900 text-3xl font-extrabold">{product.sold || 0}</Text>
              <Text className="text-green-600 text-xs mt-1">{product.unit}</Text>
            </View>
          </View>

          {/* Stock Status */}
          <View className={`${stockColor} rounded-xl p-3 mb-4`}>
            <Text className={`${stockColor.split(' ')[0]} text-sm font-semibold text-center`}>
              📦 {stockStatus}
            </Text>
          </View>

          {/* Revenue */}
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <Text className="text-gray-600 text-sm mb-2">Doanh thu từ sản phẩm này</Text>
            <Text className="text-gray-900 text-3xl font-extrabold">{formatCurrency(totalValue)}</Text>
            <Text className="text-gray-500 text-xs mt-1">= {product.sold || 0} {product.unit} × {formatCurrency(product.price)}</Text>
          </View>

          {/* Analysis */}
          <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <Text className="text-blue-900 font-semibold mb-2">📊 Phân tích</Text>
            <Text className="text-blue-700 text-sm leading-5">
              {product.sold && product.sold > 100 ? 
                '🔥 Sản phẩm bán rất chạy! Nên tăng tồn kho để đáp ứng nhu cầu.' : 
                product.sold && product.sold > 50 ?
                '✨ Sản phẩm có sức tiêu thụ tốt. Duy trì chất lượng và marketing.' :
                '💡 Sản phẩm cần được quảng bá nhiều hơn để tăng doanh số.'
              }
              {product.stock < 20 && '\n⚠️ Tồn kho sắp hết, cần nhập thêm hàng!'}
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
