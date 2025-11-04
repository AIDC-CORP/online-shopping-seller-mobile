import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { mockDashboardStats, mockProducts } from '../../shared/data/mockData';
import { ChartBarIcon, PackageIcon, CheckCircleIcon, XCircleIcon } from '../../shared/components/icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type PeriodType = 'today' | 'week' | 'month';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; iconBgColor: string; iconColor: string }> = ({ title, value, icon, iconBgColor, iconColor }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm flex-row items-center space-x-3 flex-1">
    <View className={`p-3 rounded-full ${iconBgColor}`}>
      {icon}
    </View>
    <View className="flex-1">
      <Text className="text-xs text-gray-600 font-medium">{title}</Text>
      <Text className="text-lg font-bold text-gray-900 mt-0.5">{value}</Text>
    </View>
  </View>
);

const DashboardScreen: React.FC = () => {
  const [stats] = useState(mockDashboardStats);
  const [topProducts] = useState(mockProducts.slice(0, 4));
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const periodOptions: { key: PeriodType; label: string }[] = [
    { key: 'today', label: 'Hôm nay' },
    { key: 'week', label: 'Tuần này' },
    { key: 'month', label: 'Tháng này' },
  ];

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50/50">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
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
            <View className="flex-row space-x-4">
              <View className="flex-1 space-y-4">
                 <StatCard 
                   title="Doanh thu" 
                   value={formatCurrency(stats.revenue).replace(/\s/g, '')} 
                   icon={<ChartBarIcon className="h-5 w-5" color="#047857" />} 
                   iconBgColor="bg-emerald-200" 
                   iconColor="#047857"
                 />
                 <StatCard 
                   title="Thành công" 
                   value={stats.successfulOrders.toString()} 
                   icon={<CheckCircleIcon className="h-5 w-5" color="#4338ca" />} 
                   iconBgColor="bg-indigo-200" 
                   iconColor="#4338ca"
                 />
              </View>
              <View className="flex-1 space-y-4">
                <StatCard 
                  title="Tổng đơn" 
                  value={stats.totalOrders.toString()} 
                  icon={<PackageIcon className="h-5 w-5" color="#1d4ed8" />} 
                  iconBgColor="bg-blue-200" 
                  iconColor="#1d4ed8"
                />
                <StatCard 
                  title="Đã hủy" 
                  value={stats.cancelledOrders.toString()} 
                  icon={<XCircleIcon className="h-5 w-5" color="#b91c1c" />} 
                  iconBgColor="bg-red-200" 
                  iconColor="#b91c1c"
                />
              </View>
            </View>
          </View>

          <View>
            <Text className="text-lg font-bold text-gray-700 mb-4">Sản phẩm bán chạy</Text>
            <View className="space-y-3">
              {topProducts.map((product) => (
                <View key={product.id} className="bg-white p-3 rounded-lg shadow-sm flex-row items-center space-x-4">
                  <Image source={{ uri: product.imageUrl }} className="w-16 h-16 rounded-md" />
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-700">{product.name}</Text>
                    <Text className="text-sm text-gray-500">{formatCurrency(product.price)} / {product.unit}</Text>
                  </View>
                  <Text className="text-lg font-bold text-emerald-600">{product.stock * 3} <Text className="text-sm font-normal text-gray-500">đã bán</Text></Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;