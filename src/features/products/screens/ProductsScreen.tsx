import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Image, Modal, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Product, Combo, Voucher } from '../../../shared/types';
import { PlusIcon, XCircleIcon } from '../../../components/icons';
import AddProduct from '../components/AddProduct';
import AddOptionMenu from '../components/AddOptionMenu';
import AddCombo from '../components/AddCombo';
import AddVoucher from '../components/AddVoucher';
import { SafeAreaView } from 'react-native-safe-area-context';
import PromotionsScreen from '../../promotions/screens/PromotionsScreen';
import FloatingButton from '../../../components/ui/FloatingButton';
import { useStoreId } from '../../../hooks/useStoreId';
import { ProductsService, ProductCategory, ProductUnit, ProductStatus } from '../../../../services';

// List Layout Card Component
const ProductListCard: React.FC<{ 
  item: Product; 
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ item, onPress, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
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

  return (
    <View style={{
      backgroundColor: 'white',
      marginHorizontal: 12,
      marginVertical: 4,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    }}>
      <View style={{ flexDirection: 'row', padding: 8, alignItems: 'flex-start' }}>
        {/* Product Image - Left */}
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
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

        {/* Product Info - Right */}
        <TouchableOpacity 
          onPress={onPress}
          activeOpacity={0.7}
          style={{ flex: 1, marginLeft: 10 }}
        >
          {/* Header: Tên sản phẩm + Menu */}
          <View style={{ position: 'relative' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
              <TouchableOpacity 
                onPress={() => setShowMenu(!showMenu)}
                style={{ padding: 2 }}
              >
                <Text style={{ fontSize: 18, color: '#6b7280' }}>⋮</Text>
              </TouchableOpacity>
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
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#3b82f6', fontWeight: '500' }}>✏️ Chỉnh sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    onDelete();
                  }}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#ef4444', fontWeight: '500' }}>🗑️ Xóa</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* 2. Giá */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: -5 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#10b981' }}>
              {formatCurrency(item.price)}
            </Text>
            <Text style={{ fontSize: 11, color: '#6b7280', marginLeft: 2 }}>
              /{item.unit}
            </Text>
          </View>

          {/* 3. Thông tin cơ bản - Stock & Sold */}
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

          {/* 4. Thông tin chi tiết - Badges */}
          <View style={{ flexDirection: 'row', gap: 4, marginTop: 3, flexWrap: 'wrap' }}>
            {/* Stock Status Badge */}
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

            {/* Expiry Status Badge */}
            {item.stock > 0 && item.expiryDate && (() => {
              const daysLeft = getDaysUntilExpiry(item.expiryDate);
              if (daysLeft === null) return null;

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
                // Only show badge for items with < 14 days
                if (daysLeft >= 14) return null;
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

const ProductDetailModal: React.FC<{ 
  product: Product | null; 
  visible: boolean; 
  onClose: () => void;
  onUpdate: (productId: string, updates: Partial<Product>) => void;
  onDelete: (productId: string) => void;
}> = ({ product, visible, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrice, setEditedPrice] = useState('');
  const [editedStock, setEditedStock] = useState('');
  const [editedSold, setEditedSold] = useState('');
  const [editedUnit, setEditedUnit] = useState('');
  const [editedExpiryDate, setEditedExpiryDate] = useState('');
  const [editedImportDate, setEditedImportDate] = useState('');

  React.useEffect(() => {
    if (product) {
      setEditedPrice(product.price.toString());
      setEditedStock(product.stock.toString());
      setEditedSold((product.sold || 0).toString());
      setEditedUnit(product.unit);
      setEditedExpiryDate(product.expiryDate || '');
      setEditedImportDate(product.importDate || '');
    }
  }, [product]);

  if (!product) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Hết hàng', color: 'text-red-600', bg: 'bg-red-100' };
    if (stock < 20) return { text: 'Sắp hết hàng', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: 'Còn hàng', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const handleSave = () => {
    const updates: Partial<Product> = {
      price: parseFloat(editedPrice) || product.price,
      stock: parseInt(editedStock) || product.stock,
      sold: parseInt(editedSold) || product.sold || 0,
      unit: editedUnit || product.unit,
      expiryDate: editedExpiryDate || undefined,
      importDate: editedImportDate || undefined,
    };
    onUpdate(product.id, updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPrice(product.price.toString());
    setEditedStock(product.stock.toString());
    setEditedSold((product.sold || 0).toString());
    setEditedUnit(product.unit);
    setEditedExpiryDate(product.expiryDate || '');
    setEditedImportDate(product.importDate || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(product.id);
    onClose();
  };

  const currentPrice = isEditing ? parseFloat(editedPrice) || product.price : product.price;
  const currentStock = isEditing ? parseInt(editedStock) || product.stock : product.stock;
  const currentSold = isEditing ? parseInt(editedSold) || product.sold || 0 : product.sold || 0;
  const currentUnit = isEditing ? editedUnit : product.unit;

  const stockStatus = getStockStatus(currentStock);
  const totalValue = currentPrice * currentSold;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          paddingHorizontal: 16, 
          paddingVertical: 12,
          paddingTop: 40,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        }}>
          <Text 
            style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: '#1f2937',
              flex: 1,
              marginRight: 12,
            }}
            numberOfLines={1}
          >
            Chi tiết sản phẩm
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {!isEditing ? (
              <>
                <TouchableOpacity 
                  onPress={() => setIsEditing(true)}
                  style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#3b82f6', borderRadius: 8 }}
                >
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                  <XCircleIcon className="h-6 w-6" color="#6B7280" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  onPress={handleCancel}
                  style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#6b7280', borderRadius: 8 }}
                >
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSave}
                  style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#10b981', borderRadius: 8 }}
                >
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>Lưu</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Product Image */}
          <Image 
            source={{ uri: product.imageUrl }} 
            style={{ width: '100%', height: 200 }}
            resizeMode="cover"
          />

          {/* Content */}
          <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
            {/* Product Name */}
            <Text 
              style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: '#1f2937', 
                marginBottom: 10,
                lineHeight: 24,
              }}
              numberOfLines={2}
            >
              {product.name}
            </Text>

            {/* Stock Status Badge */}
            <View className={`px-3 py-1.5 rounded-lg self-start mb-3 ${stockStatus.bg}`}>
              <Text className={`text-xs font-bold ${stockStatus.color}`} numberOfLines={1}>
                📦 {stockStatus.text}
              </Text>
            </View>

            {/* Price */}
            <View style={{ backgroundColor: '#d1fae5', borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: '#059669', marginBottom: 4 }}>Giá bán</Text>
              {isEditing ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <TextInput
                    value={editedPrice}
                    onChangeText={setEditedPrice}
                    keyboardType="numeric"
                    style={{
                      flex: 1,
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#047857',
                      backgroundColor: 'white',
                      borderRadius: 6,
                      padding: 10,
                      borderWidth: 2,
                      borderColor: '#10b981',
                    }}
                    placeholder="Giá"
                  />
                  <Text style={{ fontSize: 14, color: '#059669' }}>/</Text>
                  <TextInput
                    value={editedUnit}
                    onChangeText={setEditedUnit}
                    style={{
                      width: 60,
                      fontSize: 14,
                      color: '#047857',
                      backgroundColor: 'white',
                      borderRadius: 6,
                      padding: 8,
                      borderWidth: 2,
                      borderColor: '#10b981',
                    }}
                    placeholder="Đơn vị"
                  />
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', maxWidth: '100%' }}>
                  <Text 
                    style={{ 
                      fontSize: 20, 
                      fontWeight: 'bold', 
                      color: '#047857',
                      flexShrink: 1,
                      maxWidth: '75%',
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {formatCurrency(currentPrice)}
                  </Text>
                  <Text 
                    style={{ fontSize: 13, color: '#059669', marginLeft: 4, flexShrink: 0 }}
                    numberOfLines={1}
                  >
                    / {currentUnit}
                  </Text>
                </View>
              )}
            </View>

            {/* Stats Grid */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
              {/* Stock */}
              <View style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: 10, padding: 10, minWidth: 0 }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 3 }} numberOfLines={1}>Tồn kho</Text>
                {isEditing ? (
                  <TextInput
                    value={editedStock}
                    onChangeText={setEditedStock}
                    keyboardType="numeric"
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#1f2937',
                      backgroundColor: 'white',
                      borderRadius: 6,
                      padding: 6,
                      borderWidth: 2,
                      borderColor: '#3b82f6',
                      marginBottom: 3,
                    }}
                    placeholder="Số lượng"
                  />
                ) : (
                  <Text 
                    style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {currentStock}
                  </Text>
                )}
                <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }} numberOfLines={1}>{currentUnit}</Text>
              </View>

              {/* Sold */}
              <View style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: 10, padding: 10, minWidth: 0 }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 3 }} numberOfLines={1}>Đã bán</Text>
                {isEditing ? (
                  <TextInput
                    value={editedSold}
                    onChangeText={setEditedSold}
                    keyboardType="numeric"
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#1f2937',
                      backgroundColor: 'white',
                      borderRadius: 6,
                      padding: 6,
                      borderWidth: 2,
                      borderColor: '#3b82f6',
                      marginBottom: 3,
                    }}
                    placeholder="Đã bán"
                  />
                ) : (
                  <Text 
                    style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {currentSold}
                  </Text>
                )}
                <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }} numberOfLines={1}>{currentUnit}</Text>
              </View>
            </View>

            {/* Revenue */}
            {currentSold > 0 && (
              <View style={{ backgroundColor: '#f3f4f6', borderRadius: 10, padding: 12, marginBottom: 12 }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }} numberOfLines={1}>
                  Doanh thu từ sản phẩm này
                </Text>
                <Text 
                  style={{ 
                    fontSize: 20, 
                    fontWeight: 'bold', 
                    color: '#1f2937',
                  }}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  minimumFontScale={0.6}
                >
                  {formatCurrency(totalValue)}
                </Text>
                <Text 
                  style={{ fontSize: 10, color: '#6b7280', marginTop: 3 }}
                  numberOfLines={2}
                >
                  = {currentSold} {currentUnit} × {formatCurrency(currentPrice)}
                </Text>
              </View>
            )}

            {/* Expiry Date Info */}
            {(product.expiryDate || product.importDate || isEditing) && (
              <View style={{ 
                backgroundColor: '#fef3c7', 
                borderRadius: 10, 
                padding: 12, 
                marginBottom: 12,
                borderLeftWidth: 3,
                borderLeftColor: '#f59e0b',
              }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#d97706', marginBottom: 8 }}>
                  📅 Thông tin hạn sử dụng
                </Text>
                <View style={{ gap: 8 }}>
                  {/* Import Date */}
                  <View>
                    <Text style={{ color: '#92400e', fontSize: 11, marginBottom: 3 }}>Ngày nhập hàng:</Text>
                    {isEditing ? (
                      <TextInput
                        value={editedImportDate}
                        onChangeText={setEditedImportDate}
                        placeholder="YYYY-MM-DD"
                        style={{
                          fontSize: 13,
                          color: '#78350f',
                          backgroundColor: 'white',
                          borderRadius: 6,
                          padding: 8,
                          borderWidth: 2,
                          borderColor: '#f59e0b',
                        }}
                      />
                    ) : (
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#78350f' }}>
                        {product.importDate ? new Date(product.importDate).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
                      </Text>
                    )}
                  </View>

                  {/* Expiry Date */}
                  <View>
                    <Text style={{ color: '#92400e', fontSize: 11, marginBottom: 3 }}>Ngày hết hạn:</Text>
                    {isEditing ? (
                      <TextInput
                        value={editedExpiryDate}
                        onChangeText={setEditedExpiryDate}
                        placeholder="YYYY-MM-DD"
                        style={{
                          fontSize: 13,
                          color: '#78350f',
                          backgroundColor: 'white',
                          borderRadius: 6,
                          padding: 8,
                          borderWidth: 2,
                          borderColor: '#f59e0b',
                        }}
                      />
                    ) : (
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#78350f' }}>
                        {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
                      </Text>
                    )}
                  </View>

                  {/* Days Left */}
                  {!isEditing && product.expiryDate && (() => {
                    const daysLeft = getDaysUntilExpiry(product.expiryDate);
                    if (daysLeft === null) return null;
                    
                    let statusConfig;
                    if (daysLeft <= 3) {
                      statusConfig = { icon: '🔴', text: 'CẦN BÁN GẤP', color: '#dc2626' };
                    } else if (daysLeft <= 7) {
                      statusConfig = { icon: '🟡', text: 'GẦN HẾT HẠN', color: '#f59e0b' };
                    } else {
                      statusConfig = { icon: '🟢', text: 'TƯƠI MỚI', color: '#10b981' };
                    }

                    return (
                      <View style={{ 
                        backgroundColor: 'white', 
                        padding: 8, 
                        borderRadius: 6,
                        marginTop: 4,
                      }}>
                        <Text style={{ fontSize: 12, color: '#92400e', marginBottom: 3 }}>
                          Thời gian còn lại:
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={{ fontSize: 18, fontWeight: 'bold', color: statusConfig.color }}>
                            {statusConfig.icon} {daysLeft} ngày
                          </Text>
                          <Text style={{ fontSize: 10, fontWeight: '600', color: statusConfig.color }}>
                            {statusConfig.text}
                          </Text>
                        </View>
                      </View>
                    );
                  })()}
                </View>
              </View>
            )}

            {/* Product Info */}
            <View style={{ backgroundColor: '#eff6ff', borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e40af', marginBottom: 6 }}>
                📊 Thông tin chi tiết
              </Text>
              <View style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <Text style={{ color: '#1e3a8a', fontSize: 12 }}>ID sản phẩm:</Text>
                  <Text 
                    style={{ color: '#1e3a8a', fontSize: 12, fontWeight: '600', flexShrink: 1 }}
                    numberOfLines={1}
                  >
                    {product.id}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <Text style={{ color: '#1e3a8a', fontSize: 12 }}>Đơn vị:</Text>
                  <Text 
                    style={{ color: '#1e3a8a', fontSize: 12, fontWeight: '600', flexShrink: 1 }}
                    numberOfLines={1}
                  >
                    {currentUnit}
                  </Text>
                </View>
                {currentStock < 20 && currentStock > 0 && (
                  <Text style={{ color: '#f59e0b', fontSize: 11, marginTop: 4, flexWrap: 'wrap' }}>
                    ⚠️ Tồn kho sắp hết, cần nhập thêm hàng!
                  </Text>
                )}
                {currentStock === 0 && (
                  <Text style={{ color: '#ef4444', fontSize: 11, marginTop: 4, flexWrap: 'wrap' }}>
                    🚫 Sản phẩm đã hết hàng!
                  </Text>
                )}
              </View>
            </View>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={handleDelete}
              style={{
                backgroundColor: '#fee2e2',
                borderRadius: 10,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#fecaca',
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, marginRight: 6 }}>🗑️</Text>
              <Text 
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#ef4444',
                }}
                numberOfLines={1}
              >
                Xóa sản phẩm này
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

type FilterType = 'all' | 'inStock' | 'lowStock' | 'outOfStock';
type SortType = 'default' | 'expiryDate' | 'stock' | 'price' | 'name' | 'sold';

// Helper function to calculate days until expiry
const getDaysUntilExpiry = (expiryDate?: string): number | null => {
  if (!expiryDate) return null;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const ProductsScreen: React.FC = () => {
  // Get store ID
  const { storeId, isLoading: isLoadingStoreId } = useStoreId();
  
  // Main tab toggle between Products and Promotions
  const [activeMainTab, setActiveMainTab] = useState<'products' | 'promotions'>('products');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCombo, setIsAddingCombo] = useState(false);
  const [isAddingVoucher, setIsAddingVoucher] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showRevenueDetail, setShowRevenueDetail] = useState(false);
  const [showInventoryDetail, setShowInventoryDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('default');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    if (!storeId) return;
    
    try {
      setIsLoadingProducts(true);
      console.log('[ProductsScreen] Fetching products for storeId:', storeId);
      
      const result = await ProductsService.getProductsByStoreId(storeId, 1, 100);
      
      console.log('[ProductsScreen] Fetched products:', result.products.length);
      
      // Transform API Product to UI Product
      const uiProducts: Product[] = result.products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || undefined,
        category: p.category,
        price: p.price,
        stock: p.stock,
        unit: p.unit,
        imageUrl: p.imageUrl || '',
        expiryDate: p.expiration_date || undefined,
        importDate: p.import_date || undefined,
        sold: 0, // Backend không có field này
      }));
      
      setProducts(uiProducts);
    } catch (error: any) {
      console.error('[ProductsScreen] Failed to fetch products:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsLoadingProducts(false);
    }
  }, [storeId]);

  // Load products when component mounts or storeId changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = useCallback(async (newProductData: Omit<Product, 'id'>) => {
    try {
      // Check if storeId is available
      if (!storeId) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin cửa hàng. Vui lòng đăng nhập lại.');
        return;
      }
      
      // Transform UI data to API format
      const productCreateRequest = {
        product_name: newProductData.name,
        description: newProductData.description || '',
        price: newProductData.price,
        quantity: newProductData.stock,
        category: (newProductData.category || 'vegetables') as ProductCategory,
        image_urls: newProductData.imageUrl ? [newProductData.imageUrl] : [],
        unit: newProductData.unit as ProductUnit,
        status: ProductStatus.IN_STOCK,
        import_date: newProductData.importDate,
        expiration_date: newProductData.expiryDate,
      };
      
      console.log('[ProductsScreen] Creating product with storeId:', storeId);
      console.log('[ProductsScreen] Product data:', productCreateRequest);
      
      // Call API
      const createdProduct = await ProductsService.addProduct(storeId, productCreateRequest);
      
      console.log('[ProductsScreen] Product created successfully:', createdProduct);
      
      // Transform backend response to UI format
      const uiProduct: Product = {
        id: createdProduct.id,
        name: createdProduct.name,
        description: createdProduct.description || undefined,
        category: createdProduct.category,
        price: createdProduct.price,
        stock: createdProduct.stock,
        unit: createdProduct.unit,
        imageUrl: createdProduct.imageUrl || '',
        expiryDate: createdProduct.expiration_date || undefined,
        importDate: createdProduct.import_date || undefined,
      };
      
      // Add to products list
      setProducts(prevProducts => [uiProduct, ...prevProducts]);
      setIsAddingProduct(false);
      
      Alert.alert('Thành công', `Đã thêm sản phẩm "${newProductData.name}"`);
    } catch (error: any) {
      console.error('[ProductsScreen] Failed to add product:', error);
      Alert.alert('Lỗi', error.message || 'Không thể thêm sản phẩm. Vui lòng thử lại.');
    }
  }, [storeId]);

  const handleAddCombo = useCallback((newComboData: Omit<Combo, 'id' | 'createdAt'>) => {
    setIsAddingCombo(false);
    alert(`✅ Đã tạo combo "${newComboData.name}" thành công!`);
  }, []);

  const handleAddVoucher = useCallback((newVoucherData: Omit<Voucher, 'id' | 'usedCount' | 'createdAt'>) => {
    setIsAddingVoucher(false);
    alert(`✅ Đã tạo voucher "${newVoucherData.code}" thành công!`);
  }, []);

  const handleUpdateProduct = useCallback(async (productId: string, updates: Partial<Product>) => {
    try {
      console.log('[ProductsScreen] Updating product:', productId, updates);
      
      // Transform UI updates to API format
      const apiUpdates: any = {};
      if (updates.name !== undefined) apiUpdates.product_name = updates.name;
      if (updates.description !== undefined) apiUpdates.description = updates.description;
      if (updates.price !== undefined) apiUpdates.price = updates.price;
      if (updates.stock !== undefined) apiUpdates.quantity = updates.stock;
      if (updates.category !== undefined) apiUpdates.category = updates.category;
      if (updates.unit !== undefined) apiUpdates.unit = updates.unit;
      if (updates.expiryDate !== undefined) apiUpdates.expiration_date = updates.expiryDate;
      if (updates.importDate !== undefined) apiUpdates.import_date = updates.importDate;
      if (updates.imageUrl !== undefined) apiUpdates.image_urls = [updates.imageUrl];
      
      // Call API
      await ProductsService.updateProduct(productId, apiUpdates);
      
      // Update local state
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId
            ? { ...product, ...updates }
            : product
        )
      );
      
      // Update selectedProduct để UI hiển thị ngay
      setSelectedProduct(prev => 
        prev && prev.id === productId 
          ? { ...prev, ...updates } 
          : prev
      );
      
      console.log('[ProductsScreen] Product updated successfully');
    } catch (error: any) {
      console.error('[ProductsScreen] Failed to update product:', error);
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật sản phẩm. Vui lòng thử lại.');
    }
  }, []);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    try {
      console.log('[ProductsScreen] Deleting product:', productId);
      
      // Call API
      await ProductsService.deleteProduct(productId);
      
      // Update local state
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      setProductToDelete(null);
      setSelectedProduct(null);
      
      console.log('[ProductsScreen] Product deleted successfully');
      Alert.alert('Thành công', 'Đã xóa sản phẩm');
    } catch (error: any) {
      console.error('[ProductsScreen] Failed to delete product:', error);
      Alert.alert('Lỗi', error.message || 'Không thể xóa sản phẩm. Vui lòng thử lại.');
    }
  }, []);

  // Quick Edit Handler
  const handleQuickEdit = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  // Calculate stats
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 20).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * (p.sold || 0)), 0),
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    totalSold: products.reduce((sum, p) => sum + (p.sold || 0), 0),
    inventoryValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  };

  // All sold products sorted by revenue
  const soldProducts = [...products]
    .filter(p => (p.sold || 0) > 0)
    .sort((a, b) => (b.price * (b.sold || 0)) - (a.price * (a.sold || 0)));

  // Filter & Search & Sort products
  let filteredProducts = products
    // 1. Filter by stock status
    .filter(product => {
      switch (filterType) {
        case 'inStock':
          return product.stock > 20;
        case 'lowStock':
          return product.stock > 0 && product.stock < 20;
        case 'outOfStock':
          return product.stock === 0;
        default:
          return true;
      }
    })
    // 2. Search by name
    .filter(product => {
      if (!searchQuery.trim()) return true;
      return product.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // 3. Sort
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortType) {
      case 'expiryDate':
        const daysA = getDaysUntilExpiry(a.expiryDate);
        const daysB = getDaysUntilExpiry(b.expiryDate);
        if (daysA === null) return 1;
        if (daysB === null) return -1;
        return daysA - daysB; // Ascending: sắp hết hạn lên đầu
      case 'stock':
        return a.stock - b.stock; // Ascending: ít hàng lên đầu
      case 'price':
        return b.price - a.price; // Descending: giá cao xuống thấp
      case 'name':
        return a.name.localeCompare(b.name, 'vi'); // A-Z
      case 'sold':
        return (b.sold || 0) - (a.sold || 0); // Descending: bán chạy lên đầu
      default:
        return 0;
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Count urgent items for badge
  const urgentItemsCount = products.filter(p => {
    const daysLeft = getDaysUntilExpiry(p.expiryDate);
    return p.stock > 0 && daysLeft !== null && daysLeft <= 3;
  }).length;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Main Tab Toggle Header */}
      <View style={{
        backgroundColor: 'white',
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#f3f4f6',
      }}>
        <TouchableOpacity
          onPress={() => setActiveMainTab('products')}
          style={{
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: 3,
            borderBottomColor: activeMainTab === 'products' ? '#10b981' : 'transparent',
            backgroundColor: activeMainTab === 'products' ? '#ecfdf5' : 'white',
          }}
        >
          <Text style={{
            fontSize: 16,
            fontWeight: '700',
            color: activeMainTab === 'products' ? '#10b981' : '#6b7280',
          }}>
            📦 Sản phẩm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveMainTab('promotions')}
          style={{
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: 3,
            borderBottomColor: activeMainTab === 'promotions' ? '#10b981' : 'transparent',
            backgroundColor: activeMainTab === 'promotions' ? '#ecfdf5' : 'white',
          }}
        >
          <Text style={{
            fontSize: 16,
            fontWeight: '700',
            color: activeMainTab === 'promotions' ? '#10b981' : '#6b7280',
          }}>
            🎁 Giảm giá
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Content */}
      {activeMainTab === 'products' ? (
        <>
          {/* Stats Header with Horizontal Scroll */}
          <View style={{
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
      }}>
        {/* Search Bar & Sort */}
        <View style={{ 
          flexDirection: 'row', 
          paddingHorizontal: 12, 
          paddingTop: 12, 
          paddingBottom: 8,
          gap: 8,
          alignItems: 'center',
        }}>
          {/* Search Input */}
          <View style={{ 
            flex: 1, 
            flexDirection: 'row', 
            alignItems: 'center',
            backgroundColor: '#f3f4f6',
            borderRadius: 8,
            paddingHorizontal: 10,
            height: 38,
          }}>
            <Text style={{ fontSize: 16, color: '#9ca3af', marginRight: 6 }}>🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tìm sản phẩm..."
              placeholderTextColor="#9ca3af"
              style={{
                flex: 1,
                fontSize: 14,
                color: '#1f2937',
                padding: 0,
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Sort Button */}
          <TouchableOpacity
            onPress={() => setShowSortMenu(!showSortMenu)}
            style={{
              backgroundColor: sortType !== 'default' ? '#dbeafe' : '#f3f4f6',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              height: 38,
            }}
          >
            <Text style={{ fontSize: 16 }}>⇅</Text>
            <Text style={{ 
              fontSize: 13, 
              fontWeight: '600', 
              color: sortType !== 'default' ? '#2563eb' : '#6b7280',
            }}>
              {sortType !== 'default' ? 'ON' : 'Sort'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sort Menu Dropdown */}
        {showSortMenu && (
          <View style={{
            backgroundColor: 'white',
            marginHorizontal: 12,
            marginBottom: 8,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }}>
            {[
              { type: 'default' as SortType, label: '🔄 Mặc định', icon: '' },
              { type: 'expiryDate' as SortType, label: '📅 Sắp hết hạn', icon: '🔴' },
              { type: 'stock' as SortType, label: '📦 Tồn kho thấp', icon: '⚠️' },
              { type: 'sold' as SortType, label: '🔥 Bán chạy', icon: '⭐' },
              { type: 'price' as SortType, label: '💰 Giá cao → thấp', icon: '' },
              { type: 'name' as SortType, label: '🔤 Tên A-Z', icon: '' },
            ].map((option, index, array) => (
              <TouchableOpacity
                key={option.type}
                onPress={() => {
                  setSortType(option.type);
                  setShowSortMenu(false);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderBottomWidth: index < array.length - 1 ? 1 : 0,
                  borderBottomColor: '#f3f4f6',
                  backgroundColor: sortType === option.type ? '#eff6ff' : 'transparent',
                }}
              >
                <Text style={{ 
                  fontSize: 13, 
                  color: sortType === option.type ? '#2563eb' : '#1f2937',
                  fontWeight: sortType === option.type ? '600' : '400',
                }}>
                  {option.label}
                </Text>
                {sortType === option.type && (
                  <Text style={{ fontSize: 14, color: '#2563eb' }}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Compact Stats Grid - 2 rows */}
        <View style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
          {/* Row 1: Filter Cards */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            {/* Total Products */}
            <TouchableOpacity
              onPress={() => setFilterType('all')}
              activeOpacity={0.5}
              style={{
                flex: 1,
                backgroundColor: filterType === 'all' ? '#2563eb' : '#eff6ff',
                padding: 8,
                borderRadius: 8,
                borderWidth: 1.5,
                borderColor: filterType === 'all' ? '#1e40af' : '#dbeafe',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ 
                fontSize: 9, 
                color: filterType === 'all' ? '#ffffff' : '#3b82f6', 
                fontWeight: '600',
                marginRight: 4,
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
              onPress={() => setFilterType('inStock')}
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: filterType === 'inStock' ? '#059669' : '#d1fae5',
                padding: 8,
                borderRadius: 8,
                borderWidth: 1.5,
                borderColor: filterType === 'inStock' ? '#047857' : '#a7f3d0',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ 
                fontSize: 9, 
                color: filterType === 'inStock' ? '#ffffff' : '#059669', 
                fontWeight: '600',
                marginRight: 4,
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
              onPress={() => setFilterType('lowStock')}
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: filterType === 'lowStock' ? '#d97706' : '#fef3c7',
                padding: 8,
                borderRadius: 8,
                borderWidth: 1.5,
                borderColor: filterType === 'lowStock' ? '#b45309' : '#fde68a',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ 
                fontSize: 9, 
                color: filterType === 'lowStock' ? '#ffffff' : '#d97706', 
                fontWeight: '600',
                marginRight: 4,
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
              onPress={() => setFilterType('outOfStock')}
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: filterType === 'outOfStock' ? '#dc2626' : '#fee2e2',
                padding: 8,
                borderRadius: 8,
                borderWidth: 1.5,
                borderColor: filterType === 'outOfStock' ? '#b91c1c' : '#fecaca',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ 
                fontSize: 9, 
                color: filterType === 'outOfStock' ? '#ffffff' : '#dc2626', 
                fontWeight: '600',
                marginRight: 4,
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

          {/* Row 2: Revenue & Stock */}
          <View style={{ flexDirection: 'row', gap: 8,height: 50}}>
            {/* Total Revenue - Clickable */}
            <TouchableOpacity
              onPress={() => setShowRevenueDetail(true)}
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

            {/* Total Stock - Clickable with Badge */}
            <TouchableOpacity
              onPress={() => setShowInventoryDetail(true)}
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

        {/* Active Filter Indicator - Compact */}
        {filterType !== 'all' && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: '#f9fafb',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
          }}>
            <Text style={{ fontSize: 11, color: '#6b7280', fontWeight: '600' }}>
              {
                filterType === 'inStock' ? '✅ Còn hàng' :
                filterType === 'lowStock' ? '⚠️ Sắp hết' :
                '❌ Hết hàng'
              } • {filteredProducts.length} SP
            </Text>
            <TouchableOpacity 
              onPress={() => setFilterType('all')}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                backgroundColor: '#e5e7eb',
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 10, color: '#374151', fontWeight: '600' }}>
                ✕ Xóa
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {isLoadingProducts || isLoadingStoreId ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 12 }}>
            Đang tải sản phẩm...
          </Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>📦</Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 }}>
            {searchQuery || filterType !== 'all' 
              ? 'Không tìm thấy sản phẩm' 
              : 'Chưa có sản phẩm nào'}
          </Text>
          <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>
            {searchQuery || filterType !== 'all'
              ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              : 'Nhấn nút + để thêm sản phẩm đầu tiên'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <ProductListCard 
              item={item} 
              onPress={() => setSelectedProduct(item)}
              onEdit={() => handleQuickEdit(item)}
              onDelete={() => setProductToDelete(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 100 }}
        />
      )}
      <View style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 10 }}>
        <FloatingButton
          onPress={() => setShowAddMenu(true)}
          icon={<PlusIcon width={24} height={24} stroke="white" />}
        />
      </View>

      {/* Add Option Menu */}
      <AddOptionMenu
        visible={showAddMenu}
        onClose={() => setShowAddMenu(false)}
        onSelectProduct={() => setIsAddingProduct(true)}
        onSelectCombo={() => setIsAddingCombo(true)}
        onSelectVoucher={() => setIsAddingVoucher(true)}
        showProduct={true}
        showCombo={false}
        showVoucher={false}
      />

      <Modal
        visible={isAddingProduct}
        animationType="slide"
        onRequestClose={() => setIsAddingProduct(false)}
        transparent={false}
        statusBarTranslucent={false}
      >
        <AddProduct
          onClose={() => setIsAddingProduct(false)}
          onAddProduct={handleAddProduct}
        />
      </Modal>

      {/* Add Combo Modal */}
      <AddCombo
        visible={isAddingCombo}
        onClose={() => setIsAddingCombo(false)}
        onAddCombo={handleAddCombo}
        products={products}
      />

      {/* Add Voucher Modal */}
      <AddVoucher
        visible={isAddingVoucher}
        onClose={() => setIsAddingVoucher(false)}
        onAddVoucher={handleAddVoucher}
      />

      <ProductDetailModal
        product={selectedProduct}
        visible={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onUpdate={handleUpdateProduct}
        onDelete={(productId) => {
          setSelectedProduct(null);
          setProductToDelete(products.find(p => p.id === productId) || null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={!!productToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setProductToDelete(null)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 400,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}>
            {/* Icon */}
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#fee2e2',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 32 }}>🗑️</Text>
            </View>

            {/* Title */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              Xóa sản phẩm?
            </Text>

            {/* Product Info */}
            {productToDelete && (
              <View style={{
                backgroundColor: '#f3f4f6',
                borderRadius: 12,
                padding: 12,
                marginBottom: 16,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: 4,
                  textAlign: 'center',
                }}>
                  {productToDelete.name}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280',
                  textAlign: 'center',
                }}>
                  Tồn kho: {productToDelete.stock} {productToDelete.unit}
                </Text>
              </View>
            )}

            {/* Warning */}
            <Text style={{
              fontSize: 14,
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: 24,
            }}>
              Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa sản phẩm này không?
            </Text>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setProductToDelete(null)}
                style={{
                  flex: 1,
                  backgroundColor: '#f3f4f6',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#4b5563',
                }}>
                  Hủy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => productToDelete && handleDeleteProduct(productToDelete.id)}
                style={{
                  flex: 1,
                  backgroundColor: '#ef4444',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: 'white',
                }}>
                  Xóa
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Inventory Detail Modal */}
      <Modal
        visible={showInventoryDetail}
        animationType="slide"
        onRequestClose={() => setShowInventoryDetail(false)}
        transparent={false}
      >
        <SafeAreaView className="flex-1 bg-white">
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            paddingTop: 40,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#1f2937',
            }}>
              📦 Chi tiết Tồn kho
            </Text>
            <TouchableOpacity onPress={() => setShowInventoryDetail(false)}>
              <XCircleIcon className="h-6 w-6" color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {/* Critical Alert - Urgent Items */}
            {(() => {
              const urgentItems = products.filter(p => {
                const daysLeft = getDaysUntilExpiry(p.expiryDate);
                return p.stock > 0 && daysLeft !== null && daysLeft <= 3;
              });
              
              if (urgentItems.length > 0) {
                return (
                  <View style={{
                    backgroundColor: '#fef2f2',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 20,
                    borderLeftWidth: 4,
                    borderLeftColor: '#ef4444',
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontSize: 24, marginRight: 8 }}>🚨</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#dc2626', flex: 1 }}>
                        CẢNH BÁO: {urgentItems.length} sản phẩm cần bán gấp!
                      </Text>
                    </View>
                    <Text style={{ fontSize: 13, color: '#991b1b', lineHeight: 18 }}>
                      Các sản phẩm này sẽ hết hạn trong 3 ngày tới. Vui lòng ưu tiên bán hoặc giảm giá ngay!
                    </Text>
                  </View>
                );
              }
              return null;
            })()}

            {/* Summary Stats */}
            <View style={{ gap: 12, marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {/* Total Inventory Value */}
                <View style={{
                  flex: 1,
                  backgroundColor: '#eff6ff',
                  borderRadius: 12,
                  padding: 14,
                  borderLeftWidth: 3,
                  borderLeftColor: '#3b82f6',
                }}>
                  <Text style={{ fontSize: 11, color: '#2563eb', marginBottom: 4, fontWeight: '600' }}>
                    💰 Giá trị kho
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1e40af' }}>
                    {formatCurrency(stats.inventoryValue)}
                  </Text>
                </View>

                {/* Total Items in Stock */}
                <View style={{
                  flex: 1,
                  backgroundColor: '#f0fdf4',
                  borderRadius: 12,
                  padding: 14,
                  borderLeftWidth: 3,
                  borderLeftColor: '#10b981',
                }}>
                  <Text style={{ fontSize: 11, color: '#059669', marginBottom: 4, fontWeight: '600' }}>
                    📦 Tổng tồn
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#047857' }}>
                    {stats.totalStock}
                  </Text>
                </View>
              </View>

              {/* Expiry Status Distribution */}
              <View style={{
                backgroundColor: '#fef3c7',
                borderRadius: 12,
                padding: 14,
                borderLeftWidth: 3,
                borderLeftColor: '#f59e0b',
              }}>
                <Text style={{ fontSize: 12, color: '#d97706', marginBottom: 8, fontWeight: '600' }}>
                  📊 Phân loại theo hạn sử dụng
                </Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  {(() => {
                    const inStockProducts = products.filter(p => p.stock > 0);
                    const urgentCount = inStockProducts.filter(p => {
                      const daysLeft = getDaysUntilExpiry(p.expiryDate);
                      return daysLeft !== null && daysLeft <= 3;
                    }).length;
                    const nearCount = inStockProducts.filter(p => {
                      const daysLeft = getDaysUntilExpiry(p.expiryDate);
                      return daysLeft !== null && daysLeft > 3 && daysLeft <= 7;
                    }).length;
                    const freshCount = inStockProducts.filter(p => {
                      const daysLeft = getDaysUntilExpiry(p.expiryDate);
                      return daysLeft !== null && daysLeft > 7;
                    }).length;

                    return (
                      <>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 10, color: '#b45309' }}>🔴 Gấp (≤3 ngày)</Text>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#dc2626' }}>
                            {urgentCount}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 10, color: '#b45309' }}>🟡 Gần (4-7 ngày)</Text>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#f59e0b' }}>
                            {nearCount}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 10, color: '#b45309' }}>🟢 Tươi ({'>'}7 ngày)</Text>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}>
                            {freshCount}
                          </Text>
                        </View>
                      </>
                    );
                  })()}
                </View>
              </View>
            </View>

            {/* Products by Expiry Status */}
            {(['urgent', 'near', 'fresh'] as const).map(status => {
              const statusConfigs = {
                urgent: {
                  title: '🔴 CẦN BÁN GẤP (≤3 ngày)',
                  bg: '#fef2f2',
                  border: '#fecaca',
                  textColor: '#dc2626',
                  badgeBg: '#fee2e2',
                  filter: (p: Product) => {
                    const daysLeft = getDaysUntilExpiry(p.expiryDate);
                    return p.stock > 0 && daysLeft !== null && daysLeft <= 3;
                  }
                },
                near: {
                  title: '🟡 GẦN HẾT HẠN (4-7 ngày)',
                  bg: '#fefce8',
                  border: '#fef3c7',
                  textColor: '#d97706',
                  badgeBg: '#fef3c7',
                  filter: (p: Product) => {
                    const daysLeft = getDaysUntilExpiry(p.expiryDate);
                    return p.stock > 0 && daysLeft !== null && daysLeft > 3 && daysLeft <= 7;
                  }
                },
                fresh: {
                  title: '🟢 TƯƠI MỚI ({">"}7 ngày)',
                  bg: '#f0fdf4',
                  border: '#d1fae5',
                  textColor: '#059669',
                  badgeBg: '#d1fae5',
                  filter: (p: Product) => {
                    const daysLeft = getDaysUntilExpiry(p.expiryDate);
                    return p.stock > 0 && daysLeft !== null && daysLeft > 7;
                  }
                }
              };

              const statusConfig = statusConfigs[status];
              const filteredProducts = products.filter(statusConfig.filter);

              if (filteredProducts.length === 0) return null;

              return (
                <View key={status} style={{ marginBottom: 20 }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: statusConfig.textColor,
                    }}>
                      {statusConfig.title}
                    </Text>
                    <View style={{
                      backgroundColor: statusConfig.badgeBg,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 10,
                    }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: statusConfig.textColor }}>
                        {filteredProducts.length} SP
                      </Text>
                    </View>
                  </View>

                  {filteredProducts.map(product => {
                    const daysLeft = getDaysUntilExpiry(product.expiryDate);
                    const inventoryValue = product.price * product.stock;

                    return (
                      <TouchableOpacity
                        key={product.id}
                        onPress={() => {
                          setShowInventoryDetail(false);
                          setTimeout(() => setSelectedProduct(product), 300);
                        }}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: 10,
                          padding: 12,
                          marginBottom: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: statusConfig.border,
                        }}
                      >
                        <Image
                          source={{ uri: product.imageUrl }}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 8,
                            backgroundColor: '#f3f4f6',
                            marginRight: 12,
                          }}
                        />

                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: '700',
                              color: '#1f2937',
                              marginBottom: 4,
                            }}
                            numberOfLines={2}
                          >
                            {product.name}
                          </Text>

                          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
                            <Text style={{ fontSize: 11, color: '#6b7280' }}>
                              Tồn: <Text style={{ fontWeight: '600', color: statusConfig.textColor }}>
                                {product.stock} {product.unit}
                              </Text>
                            </Text>
                            {daysLeft !== null && (
                              <Text style={{ fontSize: 11, color: '#6b7280' }}>
                                • Còn: <Text style={{ fontWeight: '600', color: statusConfig.textColor }}>
                                  {daysLeft} ngày
                                </Text>
                              </Text>
                            )}
                          </View>

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>
                              {formatCurrency(product.price)}/{product.unit}
                            </Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151' }}>
                              💰 {formatCurrency(inventoryValue)}
                            </Text>
                          </View>

                          {product.expiryDate && (
                            <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 3 }}>
                              HSD: {new Date(product.expiryDate).toLocaleDateString('vi-VN')}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}

            {/* No products with expiry dates */}
            {products.every(p => !p.expiryDate) && (
              <View style={{
                padding: 40,
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: 12,
              }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>📦</Text>
                <Text style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center' }}>
                  Chưa có thông tin hạn sử dụng cho sản phẩm
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Revenue Detail Modal */}
      <Modal
        visible={showRevenueDetail}
        animationType="slide"
        onRequestClose={() => setShowRevenueDetail(false)}
        transparent={false}
      >
        <SafeAreaView className="flex-1 bg-white">
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            paddingTop: 40,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#1f2937',
            }}>
              Chi tiết Doanh thu & Tồn kho
            </Text>
            <TouchableOpacity onPress={() => setShowRevenueDetail(false)}>
              <XCircleIcon className="h-6 w-6" color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {/* Summary Cards */}
            <View style={{ gap: 12, marginBottom: 20 }}>
              {/* Total Revenue */}
              <View style={{
                backgroundColor: '#f0fdf4',
                borderRadius: 12,
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor: '#10b981',
              }}>
                <Text style={{ fontSize: 13, color: '#059669', marginBottom: 6, fontWeight: '600' }}>
                  💰 Tổng Doanh Thu
                </Text>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#047857', marginBottom: 4 }}>
                  {formatCurrency(stats.totalValue)}
                </Text>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                  Từ {stats.totalSold} sản phẩm đã bán
                </Text>
              </View>

              {/* Inventory Value */}
              <View style={{
                backgroundColor: '#eff6ff',
                borderRadius: 12,
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor: '#3b82f6',
              }}>
                <Text style={{ fontSize: 13, color: '#2563eb', marginBottom: 6, fontWeight: '600' }}>
                  📦 Giá Trị Tồn Kho
                </Text>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1e40af', marginBottom: 4 }}>
                  {formatCurrency(stats.inventoryValue)}
                </Text>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                  {stats.totalStock} sản phẩm trong kho
                </Text>
              </View>

              {/* Average Stats */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{
                  flex: 1,
                  backgroundColor: '#fef3c7',
                  borderRadius: 12,
                  padding: 12,
                }}>
                  <Text style={{ fontSize: 11, color: '#d97706', marginBottom: 4 }}>
                    Trung bình/SP
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#b45309' }}>
                    {formatCurrency(stats.totalValue / (stats.totalSold || 1))}
                  </Text>
                </View>
                <View style={{
                  flex: 1,
                  backgroundColor: '#f3f4f6',
                  borderRadius: 12,
                  padding: 12,
                }}>
                  <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>
                    Tỷ lệ bán
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#374151' }}>
                    {((stats.totalSold / (stats.totalSold + stats.totalStock)) * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>

            {/* All Sold Products List */}
            <View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#1f2937',
                }}>
                  📋 Sản Phẩm Đã Bán
                </Text>
                <View style={{
                  backgroundColor: '#dbeafe',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 12,
                }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#1e40af' }}>
                    {soldProducts.length} SP
                  </Text>
                </View>
              </View>

              {soldProducts.length > 0 ? (
                soldProducts.map((product, index) => {
                  const revenue = product.price * (product.sold || 0);
                  const percentOfTotal = stats.totalValue > 0 
                    ? ((revenue / stats.totalValue) * 100).toFixed(1) 
                    : '0';
                  
                  return (
                    <View
                      key={product.id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        padding: 12,
                        marginBottom: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                      }}
                    >
                      {/* Rank & Image */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                        <View style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: index < 3 ? '#fbbf24' : '#e5e7eb',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 8,
                        }}>
                          <Text style={{
                            fontSize: 11,
                            fontWeight: 'bold',
                            color: index < 3 ? 'white' : '#6b7280',
                          }}>
                            {index + 1}
                          </Text>
                        </View>
                        <Image
                          source={{ uri: product.imageUrl }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 6,
                            backgroundColor: '#f3f4f6',
                          }}
                        />
                      </View>

                      {/* Product Info */}
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: '700',
                            color: '#1f2937',
                            marginBottom: 3,
                          }}
                          numberOfLines={2}
                        >
                          {product.name}
                        </Text>
                        
                        {/* Stats Row */}
                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
                          <Text style={{ fontSize: 11, color: '#6b7280' }}>
                            Bán: <Text style={{ fontWeight: '600', color: '#059669' }}>
                              {product.sold} {product.unit}
                            </Text>
                          </Text>
                          <Text style={{ fontSize: 11, color: '#6b7280' }}>
                            Giá: <Text style={{ fontWeight: '600' }}>
                              {formatCurrency(product.price)}
                            </Text>
                          </Text>
                        </View>

                        {/* Revenue Row */}
                        <View style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                        }}>
                          <Text style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#10b981',
                          }}>
                            💰 {formatCurrency(revenue)}
                          </Text>
                          <View style={{
                            backgroundColor: '#f0fdf4',
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}>
                            <Text style={{ fontSize: 10, fontWeight: '600', color: '#059669' }}>
                              {percentOfTotal}%
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={{
                  padding: 40,
                  alignItems: 'center',
                  backgroundColor: '#f9fafb',
                  borderRadius: 12,
                }}>
                  <Text style={{ fontSize: 48, marginBottom: 12 }}>📊</Text>
                  <Text style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center' }}>
                    Chưa có sản phẩm nào được bán
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
        </>
      ) : (
        /* Promotions Screen */
        <PromotionsScreen />
      )}
    </View>
  );
};

export default ProductsScreen;