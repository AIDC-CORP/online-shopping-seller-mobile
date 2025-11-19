import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ProductStatsProps {
  stats: {
    total: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    totalValue: number;
    totalStock: number;
  };
  filterType: 'all' | 'inStock' | 'lowStock' | 'outOfStock';
  onFilterChange: (filter: 'all' | 'inStock' | 'lowStock' | 'outOfStock') => void;
  onRevenuePress: () => void;
  onInventoryPress: () => void;
  urgentItemsCount: number;
}

const ProductStats: React.FC<ProductStatsProps> = ({
  stats,
  filterType,
  onFilterChange,
  onRevenuePress,
  onInventoryPress,
  urgentItemsCount,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(value);
  };

  return (
    <View style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
      {/* Filter Cards Row 1 */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        {/* Total */}
        <TouchableOpacity
          onPress={() => onFilterChange('all')}
          activeOpacity={0.5}
          style={{
            flex: 1,
            backgroundColor: filterType === 'all' ? '#2563eb' : '#eff6ff',
            padding: 8,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: filterType === 'all' ? '#1e40af' : '#dbeafe',
            alignItems: 'center',
          }}
        >
          <Text style={{ 
            fontSize: 9, 
            color: filterType === 'all' ? '#ffffff' : '#3b82f6', 
            fontWeight: '600',
            marginBottom: 2,
          }}>
            Tổng hàng
          </Text>
          <Text style={{ 
            fontSize: 11, 
            fontWeight: 'bold', 
            color: filterType === 'all' ? '#ffffff' : '#1e40af',
          }}>
            {stats.total}
          </Text>
        </TouchableOpacity>

        {/* In Stock */}
        <TouchableOpacity
          onPress={() => onFilterChange('inStock')}
          activeOpacity={0.7}
          style={{
            flex: 1,
            backgroundColor: filterType === 'inStock' ? '#059669' : '#d1fae5',
            padding: 8,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: filterType === 'inStock' ? '#047857' : '#a7f3d0',
            alignItems: 'center',
          }}
        >
          <Text style={{ 
            fontSize: 9, 
            color: filterType === 'inStock' ? '#ffffff' : '#059669', 
            fontWeight: '600',
            marginBottom: 2,
          }}>
            Còn hàng
          </Text>
          <Text style={{ 
            fontSize: 11, 
            fontWeight: 'bold', 
            color: filterType === 'inStock' ? '#ffffff' : '#047857',
          }}>
            {stats.inStock}
          </Text>
        </TouchableOpacity>

        {/* Low Stock */}
        <TouchableOpacity
          onPress={() => onFilterChange('lowStock')}
          activeOpacity={0.7}
          style={{
            flex: 1,
            backgroundColor: filterType === 'lowStock' ? '#d97706' : '#fef3c7',
            padding: 8,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: filterType === 'lowStock' ? '#b45309' : '#fde68a',
            alignItems: 'center',
          }}
        >
          <Text style={{ 
            fontSize: 9, 
            color: filterType === 'lowStock' ? '#ffffff' : '#d97706', 
            fontWeight: '600',
            marginBottom: 2,
          }}>
            ⚠️ Sắp hết
          </Text>
          <Text style={{ 
            fontSize: 11, 
            fontWeight: 'bold', 
            color: filterType === 'lowStock' ? '#ffffff' : '#b45309',
          }}>
            {stats.lowStock}
          </Text>
        </TouchableOpacity>

        {/* Out of Stock */}
        <TouchableOpacity
          onPress={() => onFilterChange('outOfStock')}
          activeOpacity={0.7}
          style={{
            flex: 1,
            backgroundColor: filterType === 'outOfStock' ? '#dc2626' : '#fee2e2',
            padding: 8,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: filterType === 'outOfStock' ? '#b91c1c' : '#fecaca',
            alignItems: 'center',
          }}
        >
          <Text style={{ 
            fontSize: 9, 
            color: filterType === 'outOfStock' ? '#ffffff' : '#dc2626', 
            fontWeight: '600',
            marginBottom: 2,
          }}>
            ❌ Hết hàng
          </Text>
          <Text style={{ 
            fontSize: 11, 
            fontWeight: 'bold', 
            color: filterType === 'outOfStock' ? '#ffffff' : '#b91c1c',
          }}>
            {stats.outOfStock}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Revenue & Inventory Row 2 */}
      <View style={{ flexDirection: 'row', gap: 8, height: 50 }}>
        {/* Revenue */}
        <TouchableOpacity
          onPress={onRevenuePress}
          activeOpacity={0.7}
          style={{
            flex: 1,
            backgroundColor: '#f0fdf4',
            padding: 8,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: '#bbf7d0',
          }}
        >
          <Text style={{ 
            fontSize: 9, 
            color: '#10b981', 
            marginBottom: 2,
            fontWeight: '600'
          }}>
            💰 Doanh thu
          </Text>
          <Text 
            style={{ fontSize: 14, fontWeight: 'bold', color: '#059669' }}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
          >
            {formatCurrency(stats.totalValue)}
          </Text>
        </TouchableOpacity>

        {/* Inventory */}
        <TouchableOpacity
          onPress={onInventoryPress}
          activeOpacity={0.7}
          style={{
            flex: 1,
            backgroundColor: '#eff6ff',
            padding: 8,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: '#bfdbfe',
            position: 'relative',
          }}
        >
          <Text style={{ 
            fontSize: 9, 
            color: '#3b82f6', 
            marginBottom: 2,
            fontWeight: '600'
          }}>
            📦 Tồn kho
          </Text>
          <Text 
            style={{ fontSize: 16, fontWeight: 'bold', color: '#1e40af' }}
          >
            {stats.totalStock}
          </Text>
          
          {/* Urgent Badge */}
          {urgentItemsCount > 0 && (
            <View style={{
              position: 'absolute',
              top: -6,
              right: -6,
              backgroundColor: '#ef4444',
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              paddingHorizontal: 5,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'white',
            }}>
              <Text style={{ 
                fontSize: 10, 
                fontWeight: 'bold', 
                color: 'white',
              }}>
                {urgentItemsCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductStats;
