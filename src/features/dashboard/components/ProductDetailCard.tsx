import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { XCircleIcon, PackageIcon, CheckCircleIcon } from '@/src/components/icons';
import { Product } from '@/src/shared/types';

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
          </View>

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
