import React, { useState, useMemo } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product, Combo, ComboProduct } from '../../../common/types';
import * as ImagePicker from 'expo-image-picker';

interface AddComboProps {
  visible: boolean;
  onClose: () => void;
  onAddCombo: (combo: Omit<Combo, 'id' | 'createdAt'>) => void;
  products: Product[]; // Danh sách sản phẩm có sẵn
}

const AddCombo: React.FC<AddComboProps> = ({ visible, onClose, onAddCombo, products }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<ComboProduct[]>([]);
  const [comboPrice, setComboPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');

  // Tính tổng giá gốc (theo số lượng)
  const originalPrice = useMemo(() => {
    return selectedProducts.reduce((sum, cp) => {
      const product = products.find(p => p.id === cp.productId);
      return sum + (product?.price || 0) * cp.quantity;
    }, 0);
  }, [selectedProducts, products]);

  // Tính % giảm giá
  const discountPercent = useMemo(() => {
    if (!comboPrice || originalPrice === 0) return 0;
    const discount = ((originalPrice - parseInt(comboPrice)) / originalPrice) * 100;
    return Math.max(0, Math.round(discount));
  }, [comboPrice, originalPrice]);

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.productId === productId);
      if (exists) {
        // Bỏ chọn
        return prev.filter(p => p.productId !== productId);
      } else {
        // Thêm mới với quantity mặc định = 1
        return [...prev, { productId, quantity: 1 }];
      }
    });
  };

  const updateProductQuantity = (productId: string, quantityText: string) => {
    const quantity = parseFloat(quantityText) || 0;
    setSelectedProducts(prev =>
      prev.map(p => (p.productId === productId ? { ...p, quantity } : p))
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Cần quyền truy cập thư viện ảnh!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên combo');
      return;
    }
    if (selectedProducts.length < 2) {
      alert('Vui lòng chọn ít nhất 2 sản phẩm');
      return;
    }
    // Kiểm tra số lượng > 0
    const hasInvalidQuantity = selectedProducts.some(p => p.quantity <= 0);
    if (hasInvalidQuantity) {
      alert('Số lượng sản phẩm phải lớn hơn 0');
      return;
    }
    if (!comboPrice) {
      alert('Vui lòng nhập giá combo');
      return;
    }
    if (!stock) {
      alert('Vui lòng nhập số lượng');
      return;
    }

    const newCombo: Omit<Combo, 'id' | 'createdAt'> = {
      name: name.trim(),
      description: description.trim(),
      products: selectedProducts,
      originalPrice,
      comboPrice: parseInt(comboPrice),
      discountPercent,
      imageUrl: imageUri || 'https://picsum.photos/seed/combo/300/200',
      stock: parseInt(stock),
      sold: 0,
      validFrom: validFrom || new Date().toISOString().split('T')[0],
      validUntil: validUntil || undefined,
    };

    onAddCombo(newCombo);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedProducts([]);
    setComboPrice('');
    setStock('');
    setImageUri(null);
    setValidFrom('');
    setValidUntil('');
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['bottom']}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            paddingTop: 50,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <Text style={{ fontSize: 16, color: '#ef4444' }}>Hủy</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}>🎁 Tạo Combo</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={{ fontSize: 16, color: '#10b981', fontWeight: '600' }}>Lưu</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            {/* Tên combo */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Tên Combo *
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="VD: Combo Rau Củ Tươi"
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 15,
                color: '#1f2937',
              }}
            />
          </View>

          {/* Mô tả */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Mô tả
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="VD: Gồm cà chua, xà lách và táo tươi"
              multiline
              numberOfLines={3}
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 15,
                color: '#1f2937',
                textAlignVertical: 'top',
              }}
            />
          </View>

          {/* Chọn sản phẩm */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Chọn sản phẩm & Số lượng * (Tối thiểu 2)
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                maxHeight: 300,
              }}
            >
              <ScrollView>
                {products.map(product => {
                  const selectedProduct = selectedProducts.find(p => p.productId === product.id);
                  const isSelected = !!selectedProduct;

                  return (
                    <View
                      key={product.id}
                      style={{
                        paddingVertical: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: '#f3f4f6',
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                          onPress={() => toggleProductSelection(product.id)}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 4,
                            borderWidth: 2,
                            borderColor: isSelected ? '#10b981' : '#d1d5db',
                            backgroundColor: isSelected ? '#10b981' : 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12,
                          }}
                        >
                          {isSelected && (
                            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                          )}
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 15, fontWeight: '500', color: '#1f2937' }}>
                            {product.name}
                          </Text>
                          <Text style={{ fontSize: 13, color: '#6b7280' }}>
                            {product.price.toLocaleString('vi-VN')}đ/{product.unit}
                          </Text>
                        </View>
                      </View>
                      
                      {/* Quantity input - chỉ hiện khi đã chọn */}
                      {isSelected && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginLeft: 36 }}>
                          <Text style={{ fontSize: 13, color: '#6b7280', marginRight: 8 }}>
                            Số lượng:
                          </Text>
                          <TextInput
                            value={selectedProduct.quantity.toString()}
                            onChangeText={(text) => updateProductQuantity(product.id, text)}
                            keyboardType="decimal-pad"
                            placeholder="1"
                            style={{
                              borderWidth: 1,
                              borderColor: '#d1d5db',
                              borderRadius: 6,
                              padding: 6,
                              width: 80,
                              fontSize: 14,
                              color: '#1f2937',
                              textAlign: 'center',
                            }}
                          />
                          <Text style={{ fontSize: 13, color: '#6b7280', marginLeft: 6 }}>
                            {product.unit}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            {selectedProducts.length > 0 && (
              <Text style={{ fontSize: 13, color: '#10b981', marginTop: 6 }}>
                Đã chọn {selectedProducts.length} sản phẩm
              </Text>
            )}
          </View>

          {/* Giá gốc và giá combo */}
          <View
            style={{
              backgroundColor: '#fef3c7',
              padding: 16,
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#92400e', marginBottom: 8 }}>
              💰 Tính toán giá
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 14, color: '#78350f' }}>Tổng giá gốc:</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#78350f' }}>
                {originalPrice.toLocaleString('vi-VN')}đ
              </Text>
            </View>
            {comboPrice && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontSize: 14, color: '#78350f' }}>Giá combo:</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#059669' }}>
                    {parseInt(comboPrice).toLocaleString('vi-VN')}đ
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, color: '#78350f' }}>Tiết kiệm:</Text>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#dc2626' }}>
                    {(originalPrice - parseInt(comboPrice)).toLocaleString('vi-VN')}đ ({discountPercent}%)
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Giá combo */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Giá Combo * (đ)
            </Text>
            <TextInput
              value={comboPrice}
              onChangeText={setComboPrice}
              placeholder="VD: 75000"
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 15,
                color: '#1f2937',
              }}
            />
          </View>

          {/* Số lượng */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Số lượng combo *
            </Text>
            <TextInput
              value={stock}
              onChangeText={setStock}
              placeholder="VD: 30"
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 15,
                color: '#1f2937',
              }}
            />
          </View>

          {/* Ảnh combo */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Ảnh Combo
            </Text>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 16,
                alignItems: 'center',
                backgroundColor: '#f9fafb',
              }}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={{ width: 200, height: 150, borderRadius: 8 }} />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 40, marginBottom: 8 }}>📷</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>Chọn ảnh combo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Thời gian áp dụng */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Thời gian áp dụng (tuỳ chọn)
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Từ ngày</Text>
                <TextInput
                  value={validFrom}
                  onChangeText={setValidFrom}
                  placeholder="2025-11-01"
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 14,
                    color: '#1f2937',
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Đến ngày</Text>
                <TextInput
                  value={validUntil}
                  onChangeText={setValidUntil}
                  placeholder="2025-12-31"
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 14,
                    color: '#1f2937',
                  }}
                />
              </View>
            </View>
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default AddCombo;
