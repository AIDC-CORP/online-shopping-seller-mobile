import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { mockProducts as initialProducts } from '../../shared/data/mockData';
import { Product } from '../../shared/types';
import { PlusIcon, XCircleIcon } from '@/src/components/icons';
import AddProduct from './components/AddProduct';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductCard: React.FC<{ 
  item: Product; 
  onPress: () => void;
  onLongPress: () => void;
}> = ({ item, onPress, onLongPress }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getStockStatus = () => {
    if (item.stock === 0) return { text: 'Hết hàng', color: 'text-red-600', bg: 'bg-red-50' };
    if (item.stock < 20) return { text: 'Sắp hết', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'Còn hàng', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const stockStatus = getStockStatus();

  return (
    <TouchableOpacity 
      onPress={onPress}
      onLongPress={onLongPress}
      className="bg-white rounded-lg shadow-sm flex-1 m-2 overflow-hidden"
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imageUrl }} className="w-full h-28" />
      <View className="p-3 flex-1 justify-between">
        <View>
          <Text className="font-bold text-gray-800 text-sm leading-tight" numberOfLines={2}>
            {item.name}
          </Text>
          <View className={`mt-2 px-2 py-1 rounded-md self-start ${stockStatus.bg}`}>
            <Text className={`text-xs font-semibold ${stockStatus.color}`}>
              {stockStatus.text}
            </Text>
          </View>
          <Text className="text-xs text-gray-500 mt-1">
            Tồn: {item.stock} {item.unit}
          </Text>
          {item.sold !== undefined && (
            <Text className="text-xs text-emerald-600 font-medium mt-0.5">
              Đã bán: {item.sold} {item.unit}
            </Text>
          )}
        </View>
        <Text className="text-emerald-600 font-bold mt-2 text-base">
          {formatCurrency(item.price)}/{item.unit}
        </Text>
      </View>
    </TouchableOpacity>
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

  React.useEffect(() => {
    if (product) {
      setEditedPrice(product.price.toString());
      setEditedStock(product.stock.toString());
      setEditedSold((product.sold || 0).toString());
      setEditedUnit(product.unit);
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
    };
    onUpdate(product.id, updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPrice(product.price.toString());
    setEditedStock(product.stock.toString());
    setEditedSold((product.sold || 0).toString());
    setEditedUnit(product.unit);
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
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">Chi tiết sản phẩm</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {!isEditing ? (
              <>
                <TouchableOpacity 
                  onPress={() => setIsEditing(true)}
                  style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#3b82f6', borderRadius: 8 }}
                >
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>✏️ Chỉnh sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose}>
                  <XCircleIcon className="h-6 w-6" color="#6B7280" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  onPress={handleCancel}
                  style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#6b7280', borderRadius: 8 }}
                >
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSave}
                  style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#10b981', borderRadius: 8 }}
                >
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>💾 Lưu</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <ScrollView>
          {/* Product Image */}
          <Image 
            source={{ uri: product.imageUrl }} 
            style={{ width: '100%', height: 250 }}
            resizeMode="cover"
          />

          {/* Content */}
          <View style={{ padding: 16 }}>
            {/* Product Name */}
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
              {product.name}
            </Text>

            {/* Stock Status Badge */}
            <View className={`px-4 py-2 rounded-lg self-start mb-4 ${stockStatus.bg}`}>
              <Text className={`text-sm font-bold ${stockStatus.color}`}>
                📦 {stockStatus.text}
              </Text>
            </View>

            {/* Price */}
            <View style={{ backgroundColor: '#d1fae5', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 14, color: '#059669', marginBottom: 4 }}>Giá bán</Text>
              {isEditing ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <TextInput
                    value={editedPrice}
                    onChangeText={setEditedPrice}
                    keyboardType="numeric"
                    style={{
                      flex: 1,
                      fontSize: 28,
                      fontWeight: 'bold',
                      color: '#047857',
                      backgroundColor: 'white',
                      borderRadius: 8,
                      padding: 12,
                      borderWidth: 2,
                      borderColor: '#10b981',
                    }}
                    placeholder="Giá"
                  />
                  <Text style={{ fontSize: 18, color: '#059669' }}>/</Text>
                  <TextInput
                    value={editedUnit}
                    onChangeText={setEditedUnit}
                    style={{
                      width: 80,
                      fontSize: 18,
                      color: '#047857',
                      backgroundColor: 'white',
                      borderRadius: 8,
                      padding: 8,
                      borderWidth: 2,
                      borderColor: '#10b981',
                    }}
                    placeholder="Đơn vị"
                  />
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#047857' }}>
                    {formatCurrency(currentPrice)}
                  </Text>
                  <Text style={{ fontSize: 18, color: '#059669', marginLeft: 8 }}>
                    / {currentUnit}
                  </Text>
                </View>
              )}
            </View>

            {/* Stats Grid */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              {/* Stock */}
              <View style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: 12, padding: 16 }}>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Tồn kho</Text>
                {isEditing ? (
                  <TextInput
                    value={editedStock}
                    onChangeText={setEditedStock}
                    keyboardType="numeric"
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: '#1f2937',
                      backgroundColor: 'white',
                      borderRadius: 8,
                      padding: 8,
                      borderWidth: 2,
                      borderColor: '#3b82f6',
                      marginBottom: 4,
                    }}
                    placeholder="Số lượng"
                  />
                ) : (
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
                    {currentStock}
                  </Text>
                )}
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{currentUnit}</Text>
              </View>

              {/* Sold */}
              <View style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: 12, padding: 16 }}>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Đã bán</Text>
                {isEditing ? (
                  <TextInput
                    value={editedSold}
                    onChangeText={setEditedSold}
                    keyboardType="numeric"
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: '#1f2937',
                      backgroundColor: 'white',
                      borderRadius: 8,
                      padding: 8,
                      borderWidth: 2,
                      borderColor: '#3b82f6',
                      marginBottom: 4,
                    }}
                    placeholder="Đã bán"
                  />
                ) : (
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
                    {currentSold}
                  </Text>
                )}
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{currentUnit}</Text>
              </View>
            </View>

            {/* Revenue */}
            {currentSold > 0 && (
              <View style={{ backgroundColor: '#f3f4f6', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
                  Doanh thu từ sản phẩm này
                </Text>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937' }}>
                  {formatCurrency(totalValue)}
                </Text>
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  = {currentSold} {currentUnit} × {formatCurrency(currentPrice)}
                </Text>
              </View>
            )}

            {/* Product Info */}
            <View style={{ backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e40af', marginBottom: 8 }}>
                📊 Thông tin chi tiết
              </Text>
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#1e3a8a', fontSize: 14 }}>ID sản phẩm:</Text>
                  <Text style={{ color: '#1e3a8a', fontSize: 14, fontWeight: '600' }}>{product.id}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#1e3a8a', fontSize: 14 }}>Đơn vị:</Text>
                  <Text style={{ color: '#1e3a8a', fontSize: 14, fontWeight: '600' }}>{currentUnit}</Text>
                </View>
                {currentStock < 20 && currentStock > 0 && (
                  <Text style={{ color: '#f59e0b', fontSize: 12, marginTop: 8 }}>
                    ⚠️ Tồn kho sắp hết, cần nhập thêm hàng!
                  </Text>
                )}
                {currentStock === 0 && (
                  <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 8 }}>
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
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#fecaca',
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 20, marginRight: 8 }}>🗑️</Text>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#ef4444',
              }}>
                Xóa sản phẩm này
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleAddProduct = useCallback((newProductData: Omit<Product, 'id' | 'imageUrl'>) => {
    const newProduct: Product = {
      id: `p${Date.now()}`,
      imageUrl: `https://picsum.photos/seed/${newProductData.name}/${Math.random()}/300/200`,
      ...newProductData,
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
    setIsAddingProduct(false);
  }, []);

  const handleUpdateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, ...updates }
          : product
      )
    );
    // Cập nhật selectedProduct để UI hiển thị ngay
    setSelectedProduct(prev => 
      prev && prev.id === productId 
        ? { ...prev, ...updates } 
        : prev
    );
  }, []);

  const handleDeleteProduct = useCallback((productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    setProductToDelete(null);
    setSelectedProduct(null);
  }, []);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50/50">
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard 
            item={item} 
            onPress={() => setSelectedProduct(item)}
            onLongPress={() => setProductToDelete(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
      />
      <View style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 10 }}>
        <TouchableOpacity
          onPress={() => setIsAddingProduct(true)}
          style={{
            backgroundColor: '#10b981',
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          activeOpacity={0.8}
        >
          <PlusIcon className="h-6 w-6" color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isAddingProduct}
        animationType="slide"
        onRequestClose={() => setIsAddingProduct(false)}
      >
        <AddProduct
          onClose={() => setIsAddingProduct(false)}
          onAddProduct={handleAddProduct}
        />
      </Modal>

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
    </SafeAreaView>
  );
};

export default ProductsScreen;