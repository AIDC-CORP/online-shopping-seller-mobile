import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { mockDashboardStatsByPeriod } from '../../../shared/data/mockData';
import { ChartBarIcon, PackageIcon, CheckCircleIcon, XCircleIcon } from '@/src/components/icons';
import { Product } from '../../../shared/types';
import { RevenueDetailCard } from '../components/RevenueDetailCard';
import { OrdersDetailCard } from '../components/OrdersDetailCard';
import { ProductDetailCard } from '../components/ProductDetailCard';

type PeriodType = 'today' | 'week' | 'month';

const StatCard: React.FC<{ 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  iconBgColor: string; 
  iconColor: string;
  onPress?: () => void;
}> = ({ title, value, icon, iconBgColor, iconColor, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm flex-row items-center space-x-3 flex-1"
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View className={`p-3 rounded-full ${iconBgColor}`}>
      {icon}
    </View>
    <View className="flex-1">
      <Text className="text-xs text-gray-600 font-medium">{title}</Text>
      <Text 
        className="text-lg font-bold text-gray-900 mt-0.5"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value}
      </Text>
    </View>
  </TouchableOpacity>
);

const DashboardScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [showRevenueDetail, setShowRevenueDetail] = useState(false);
  const [showOrdersDetail, setShowOrdersDetail] = useState<'total' | 'success' | 'cancelled' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Lấy data theo period
  const currentData = mockDashboardStatsByPeriod[selectedPeriod];
  const stats = {
    revenue: currentData.revenue,
    totalOrders: currentData.totalOrders,
    successfulOrders: currentData.successfulOrders,
    cancelledOrders: currentData.cancelledOrders,
  };
  const topProducts = currentData.topProducts;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getPeriodText = () => {
    return selectedPeriod === 'today' ? 'Hôm nay' : 
           selectedPeriod === 'week' ? 'Tuần này' : 'Tháng này';
  };

  const periodOptions: { key: PeriodType; label: string }[] = [
    { key: 'today', label: 'Hôm nay' },
    { key: 'week', label: 'Tuần này' },
    { key: 'month', label: 'Tháng này' },
  ];

  return (
    <View className="flex-1 bg-gray-50/50">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
        <View className="space-y-6">
          <Text className="text-2xl font-bold text-gray-800">Lên kế hoạch bán hàng</Text>

          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-700">Tổng quan</Text>
              
              {/* Period Selector */}
              <View className="flex-row gap-2">
                {periodOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => setSelectedPeriod(option.key)}
                    className={`px-3 py-1.5 rounded-lg ${
                      selectedPeriod === option.key ? 'bg-emerald-500' : 'bg-white'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        selectedPeriod === option.key ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ flex: 1, gap: 16 }}>
                 <StatCard 
                   title="Doanh thu" 
                   value={formatCurrency(stats.revenue).replace(/\s/g, '').replace('₫', ' ₫')} 
                   icon={<ChartBarIcon className="h-5 w-5" color="#047857" />} 
                   iconBgColor="bg-emerald-200" 
                   iconColor="#047857"
                   onPress={() => setShowRevenueDetail(true)}
                 />
                 <StatCard 
                   title="Thành công" 
                   value={stats.successfulOrders.toString()} 
                   icon={<CheckCircleIcon className="h-5 w-5" color="#4338ca" />} 
                   iconBgColor="bg-indigo-200" 
                   iconColor="#4338ca"
                   onPress={() => setShowOrdersDetail('success')}
                 />
              </View>
              <View style={{ flex: 1, gap: 16 }}>
                <StatCard 
                  title="Tổng đơn" 
                  value={stats.totalOrders.toString()} 
                  icon={<PackageIcon className="h-5 w-5" color="#1d4ed8" />} 
                  iconBgColor="bg-blue-200" 
                  iconColor="#1d4ed8"
                  onPress={() => setShowOrdersDetail('total')}
                />
                <StatCard 
                  title="Đã hủy" 
                  value={stats.cancelledOrders.toString()} 
                  icon={<XCircleIcon className="h-5 w-5" color="#b91c1c" />} 
                  iconBgColor="bg-red-200" 
                  iconColor="#b91c1c"
                  onPress={() => setShowOrdersDetail('cancelled')}
                />
              </View>
            </View>
          </View>

          <View>
            <Text className="text-lg font-bold text-gray-700 mb-4">Sản phẩm bán chạy</Text>
            <View className="space-y-3">
              {topProducts.map((product: Product) => (
                <TouchableOpacity 
                  key={product.id} 
                  onPress={() => setSelectedProduct(product)}
                  className="bg-white p-3 rounded-lg shadow-sm flex-row items-center space-x-4"
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: product.imageUrl }} className="w-16 h-16 rounded-md" />
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">{product.name}</Text>
                    <Text className="text-sm text-gray-500 mt-0.5">{formatCurrency(product.price)} / {product.unit}</Text>
                    <Text className="text-xs text-gray-400 mt-1">Tồn kho: {product.stock} {product.unit}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-emerald-600">{product.sold || 0}</Text>
                    <Text className="text-xs text-gray-500">đã bán</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      {showRevenueDetail && (
        <RevenueDetailCard
          revenue={stats.revenue}
          totalOrders={stats.totalOrders}
          successfulOrders={stats.successfulOrders}
          cancelledOrders={stats.cancelledOrders}
          periodText={getPeriodText()}
          formatCurrency={formatCurrency}
          onClose={() => setShowRevenueDetail(false)}
        />
      )}

      {showOrdersDetail && (
        <OrdersDetailCard
          totalOrders={stats.totalOrders}
          successfulOrders={stats.successfulOrders}
          cancelledOrders={stats.cancelledOrders}
          revenue={stats.revenue}
          periodText={getPeriodText()}
          formatCurrency={formatCurrency}
          onClose={() => setShowOrdersDetail(null)}
          type={showOrdersDetail}
        />
      )}

      {selectedProduct && (
        <ProductDetailCard
          product={selectedProduct}
          formatCurrency={formatCurrency}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </View>
  );
};

export default DashboardScreen;