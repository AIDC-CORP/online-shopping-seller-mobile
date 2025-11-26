import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  imageUrl: string;
  sold?: number;
  expiryDate?: string;
  category?: string;
  description?: string;
  importDate?: string;
  status?: string;
}

interface ProductListCardProps {
  item: Product;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

// Helper function
const getDaysUntilExpiry = (expiryDate?: string): number | null => {
  if (!expiryDate) return null;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const ProductListCard: React.FC<ProductListCardProps> = ({ 
  item, 
  onPress, 
  onEdit, 
  onDelete,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelect,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(value);
  };

  const getStockStatus = () => {
    if (item.stock === 0) return { 
      text: '❌ Hết hàng', 
      color: '#ef4444', 
      bg: '#fee2e2',
      icon: '❌'
    };
    if (item.stock < 20) return { 
      text: '⚠️ Sắp hết - Cần nhập hàng!', 
      color: '#f59e0b', 
      bg: '#fef3c7',
      icon: '⚠️'
    };
    return { 
      text: '✅ Còn hàng', 
      color: '#10b981', 
      bg: '#d1fae5',
      icon: '✅'
    };
  };

  const stockStatus = getStockStatus();

  const handlePress = () => {
    if (isSelectionMode && onToggleSelect) {
      onToggleSelect();
    } else {
      onPress();
    }
  };

  return (
    <View style={{
      backgroundColor: isSelected ? '#eff6ff' : 'white',
      marginHorizontal: 12,
      marginVertical: 4,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: isSelected ? 2 : 0,
      borderColor: '#3b82f6',
    }}>
      <View style={{ flexDirection: 'row', padding: 8, alignItems: 'flex-start' }}>
        {/* Checkbox for Selection Mode */}
        {isSelectionMode && (
          <TouchableOpacity 
            onPress={onToggleSelect}
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: isSelected ? '#3b82f6' : '#d1d5db',
              backgroundColor: isSelected ? '#3b82f6' : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
              marginTop: 18,
            }}
          >
            {isSelected && (
              <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>✓</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Product Image */}
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
          <Image 
            source={{ uri: item.imageUrl }} 
            style={{ 
              width: 60, 
              height: 60, 
              borderRadius: 6,
              backgroundColor: '#f3f4f6'
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Product Info */}
        <TouchableOpacity 
          onPress={handlePress}
          activeOpacity={0.7}
          style={{ flex: 1, marginLeft: 10 }}
        >
          {/* Header: Name + Menu */}
          <View style={{ position: 'relative' }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start' 
            }}>
              <Text 
                style={{ 
                  fontSize: 14, 
                  fontWeight: '700', 
                  color: '#1f2937',
                  lineHeight: 16,
                  flex: 1,
                  marginRight: 6,
                }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {!isSelectionMode && (
                <TouchableOpacity 
                  onPress={() => setShowMenu(!showMenu)}
                  style={{ padding: 2 }}
                >
                  <Text style={{ fontSize: 18, color: '#6b7280' }}>⋮</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Quick Actions Menu */}
            {showMenu && (
              <View style={{
                position: 'absolute',
                top: 24,
                right: 0,
                backgroundColor: 'white',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                paddingVertical: 4,
                minWidth: 120,
                zIndex: 1000,
              }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    onEdit();
                  }}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#3b82f6', fontWeight: '500' }}>
                    ✏️ Chỉnh sửa
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    onDelete();
                  }}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#ef4444', fontWeight: '500' }}>
                    🗑️ Xóa
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Price */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: -5 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#10b981' }}>
              {formatCurrency(item.price)}
            </Text>
            <Text style={{ fontSize: 11, color: '#6b7280', marginLeft: 2 }}>
              /{item.unit}
            </Text>
          </View>

          {/* Stock & Sold */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 2 }}>
            <Text style={{ fontSize: 11, color: '#4b5563', fontWeight: '600' }}>
              📦 Tồn: {item.stock}
            </Text>
            {item.sold !== undefined && (
              <Text style={{ fontSize: 11, color: '#059669', fontWeight: '600' }}>
                ✓ Bán: {item.sold}
              </Text>
            )}
          </View>

          {/* Status Badges */}
          <View style={{ flexDirection: 'row', gap: 4, marginTop: 3, flexWrap: 'wrap' }}>
            {/* Stock Status */}
            <View style={{
              backgroundColor: stockStatus.bg,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: stockStatus.color }}>
                {stockStatus.icon}
              </Text>
            </View>

            {/* Expiry Status */}
            {item.stock > 0 && item.expiryDate && (() => {
              const daysLeft = getDaysUntilExpiry(item.expiryDate);
              if (daysLeft === null || daysLeft >= 14) return null;

              let badgeConfig;
              if (daysLeft <= 3) {
                badgeConfig = {
                  icon: '🔴',
                  text: `${daysLeft}d`,
                  bg: '#fee2e2',
                  color: '#dc2626'
                };
              } else if (daysLeft <= 7) {
                badgeConfig = {
                  icon: '🟡',
                  text: `${daysLeft}d`,
                  bg: '#fef3c7',
                  color: '#d97706'
                };
              } else {
                badgeConfig = {
                  icon: '🟢',
                  text: `${daysLeft}d`,
                  bg: '#d1fae5',
                  color: '#059669'
                };
              }

              return (
                <View style={{
                  backgroundColor: badgeConfig.bg,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: badgeConfig.color }}>
                    {badgeConfig.icon} {badgeConfig.text}
                  </Text>
                </View>
              );
            })()}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductListCard;
