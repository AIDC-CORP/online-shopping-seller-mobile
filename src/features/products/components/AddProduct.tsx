import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from '../../../common/types';
import { XIcon, CameraIcon } from '../../../components/icons';
import * as ImagePicker from 'expo-image-picker';
import { CategoryPicker } from './CategoryPicker';
import { UnitPicker } from './UnitPicker';
import { StatusPicker } from './StatusPicker';
import type { ProductStatus } from '../../../common/data/productEnums';

interface AddProductProps {
  onClose: () => void;
  onAddProduct?: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct?: (product: Product) => void;
  initialProduct?: Product | null;
}

const InputField: React.FC<{ 
  label: string; 
  children: React.ReactNode;
  required?: boolean;
  icon?: string;
}> = ({ label, children, required, icon }) => (
  <View style={styles.inputContainer}>
    <View style={styles.labelRow}>
      {icon && <Text style={styles.labelIcon}>{icon}</Text>}
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
    </View>
    {children}
  </View>
);

const AddProduct: React.FC<AddProductProps> = ({ 
  onClose, 
  onAddProduct, 
  onUpdateProduct, 
  initialProduct 
}) => {
  const isEditMode = !!initialProduct;
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState<ProductStatus | null>('Còn hàng');
  const [expiryDate, setExpiryDate] = useState('');
  const [importDate, setImportDate] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      setDescription(initialProduct.description || '');
      setCategory(initialProduct.category || '');
      setPrice(initialProduct.price?.toString() || '');
      setUnit(initialProduct.unit || 'kg');
      setStock(initialProduct.stock?.toString() || '');
      setStatus(initialProduct.status as ProductStatus || 'Còn hàng');
      setExpiryDate(initialProduct.expiryDate || '');
      setImportDate(initialProduct.importDate || '');
      setImageUri(initialProduct.imageUrl || null);
    }
  }, [initialProduct]);

  const pickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Quyền truy cập', 'Cần cấp quyền để chọn ảnh!');
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại!');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Chọn ảnh sản phẩm',
      'Bạn muốn chọn ảnh từ đâu?',
      [
        { text: '📷 Chụp ảnh', onPress: () => pickImage(true) },
        { text: '🖼️ Thư viện', onPress: () => pickImage(false) },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sản phẩm.');
      return;
    }
    if (!category) {
      Alert.alert('Lỗi', 'Vui lòng chọn danh mục sản phẩm.');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập giá bán hợp lệ.');
      return;
    }
    if (!unit) {
      Alert.alert('Lỗi', 'Vui lòng chọn đơn vị.');
      return;
    }
    if (!stock || parseInt(stock, 10) < 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số lượng hợp lệ.');
      return;
    }
    if (!status) {
      Alert.alert('Lỗi', 'Vui lòng chọn trạng thái sản phẩm.');
      return;
    }

    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (expiryDate && !dateRegex.test(expiryDate)) {
      Alert.alert('Lỗi', 'Ngày hết hạn phải theo định dạng YYYY-MM-DD (ví dụ: 2025-11-20)');
      return;
    }
    if (importDate && !dateRegex.test(importDate)) {
      Alert.alert('Lỗi', 'Ngày nhập hàng phải theo định dạng YYYY-MM-DD (ví dụ: 2025-11-11)');
      return;
    }

    // Validate expiry date is valid date
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      if (isNaN(expiry.getTime())) {
        Alert.alert('Lỗi', 'Ngày hết hạn không hợp lệ. Vui lòng kiểm tra lại (tháng 1-12, ngày hợp lệ).');
        return;
      }
    }

    // Validate import date is valid date
    if (importDate) {
      const imported = new Date(importDate);
      if (isNaN(imported.getTime())) {
        Alert.alert('Lỗi', 'Ngày nhập hàng không hợp lệ. Vui lòng kiểm tra lại (tháng 1-12, ngày hợp lệ).');
        return;
      }
    }

    const productData = {
      name: name.trim(),
      description: description.trim() || undefined,
      category: category,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      unit: unit,
      status: status,
      imageUrl: imageUri || `https://picsum.photos/seed/${name}/${Math.random()}/300/200`,
      expiryDate: expiryDate || undefined,
      importDate: importDate || undefined,
    };

    if (isEditMode && onUpdateProduct && initialProduct) {
      onUpdateProduct({
        ...productData,
        id: initialProduct.id,
        sold: initialProduct.sold,
      });
    } else if (onAddProduct) {
      onAddProduct(productData);
    }
  };

  console.log('[AddProduct] Rendering component');
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#10b981' }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.container}>
          {/* Header - Fixed height */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle }>{isEditMode ? '✏️ Sửa sản phẩm' : '✨ Sản phẩm mới'}</Text>
              <Text style={styles.headerSubtitle}>
                {isEditMode ? 'Chỉnh sửa thông tin sản phẩm' : 'Điền thông tin sản phẩm của bạn'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <XIcon color="white" />
            </TouchableOpacity>
          </View>

          {/* ScrollView */}
           <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            {/* Image Upload */}
            <View style={styles.card}>
              <TouchableOpacity onPress={showImageOptions} style={styles.imageUploadContainer}>
                {imageUri ? (
                  <View style={styles.uploadedImageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.uploadedImage} resizeMode="cover" />
                    <View style={styles.imageSuccessBadge}>
                      <Text style={styles.imageSuccessText}>✓ Ảnh đã chọn</Text>
                    </View>
                    <Text style={styles.imageHintText}>Nhấn để thay đổi</Text>
                  </View>
                ) : (
                  <View style={styles.emptyImageContainer}>
                    <View style={styles.cameraIconCircle}>
                      <CameraIcon color="#10b981" />
                    </View>
                    <Text style={styles.uploadTitle}>📸 Tải lên hình ảnh sản phẩm</Text>
                    <Text style={styles.uploadSubtitle}>Chụp ảnh hoặc chọn từ thư viện</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Basic Info */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📝 Thông tin cơ bản</Text>
              </View>
              
              <InputField label="Tên sản phẩm" required icon="🏷️">
                <TextInput 
                  value={name} 
                  onChangeText={setName} 
                  style={styles.input}
                  placeholder="Nhập tên sản phẩm..."
                  placeholderTextColor="#9ca3af"
                />
              </InputField>

              <InputField label="Mô tả" icon="📄">
                <TextInput 
                  value={description} 
                  onChangeText={setDescription} 
                  style={[styles.input, styles.textArea]}
                  placeholder="Mô tả ngắn về sản phẩm..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </InputField>

              <InputField label="Danh mục" required icon="📂">
                <CategoryPicker
                  selectedValue={category}
                  onValueChange={setCategory}
                  placeholder="Chọn danh mục sản phẩm"
                />
              </InputField>
            </View>

            {/* Price & Stock */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>💰 Giá & Tồn kho</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <InputField label="Giá bán" required icon="💵">
                    <TextInput 
                      value={price} 
                      onChangeText={setPrice} 
                      keyboardType="numeric" 
                      style={styles.input}
                      placeholder="0"
                      placeholderTextColor="#9ca3af"
                    />
                  </InputField>
                </View>
                
                <View style={styles.halfWidth}>
                  <InputField label="Đơn vị" required icon="⚖️">
                    <UnitPicker
                      selectedValue={unit}
                      onValueChange={setUnit}
                      placeholder="Chọn đơn vị"
                    />
                  </InputField>
                </View>
              </View>

              <InputField label="Số lượng" required icon="📦">
                <TextInput 
                  value={stock} 
                  onChangeText={setStock} 
                  keyboardType="numeric" 
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
              </InputField>

              {/* Status Picker */}
              <StatusPicker
                selectedStatus={status}
                onSelectStatus={setStatus}
              />
            </View>

            {/* Expiry Date */}
            <View style={[styles.card, styles.expiryCard]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, styles.expiryTitle]}>📅 Hạn sử dụng</Text>
              </View>
              
              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <InputField label="Ngày nhập" icon="📥">
                    <TextInput 
                      value={importDate} 
                      onChangeText={setImportDate} 
                      placeholder="YYYY-MM-DD" 
                      style={[styles.input, styles.whiteInput]}
                      placeholderTextColor="#9ca3af"
                    />
                    <Text style={styles.hintText}>VD: 2025-11-05</Text>
                  </InputField>
                </View>
                
                <View style={styles.halfWidth}>
                  <InputField label="Ngày hết hạn" icon="⏰">
                    <TextInput 
                      value={expiryDate} 
                      onChangeText={setExpiryDate} 
                      placeholder="YYYY-MM-DD" 
                      style={[styles.input, styles.whiteInput]}
                      placeholderTextColor="#9ca3af"
                    />
                    <Text style={styles.hintText}>VD: 2025-11-15</Text>
                  </InputField>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>
                {isEditMode ? '✓ Cập nhật sản phẩm' : '✓ Thêm sản phẩm'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1
  },
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc'
  },
  header: { 
    paddingHorizontal: 20, 
    paddingVertical: 16,
    minHeight: 80,
    maxHeight: 80,
    backgroundColor: '#10b981', 
    borderBottomLeftRadius: 24, 
    borderBottomRightRadius: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 5, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: 'white', 
    marginBottom: 4 
  },
  headerSubtitle: { 
    fontSize: 13, 
    color: '#d1fae5', 
    fontWeight: '500' 
  },
  closeButton: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    padding: 8, 
    borderRadius: 20 
  },
  scrollView: { 
    flex: 1 
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 20
  },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  expiryCard: { 
    backgroundColor: '#eff6ff', 
    borderColor: '#3b82f6' 
  },
  sectionHeader: { 
    marginBottom: 16, 
    paddingBottom: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6' 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1f2937', 
    marginBottom: 2 
  },
  expiryTitle: { 
    color: '#1e40af' 
  },
  sectionSubtitle: { 
    fontSize: 12, 
    color: '#6b7280', 
    fontWeight: '500' 
  },
  inputContainer: { 
    marginBottom: 16 
  },
  labelRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  labelIcon: { 
    fontSize: 16, 
    marginRight: 6 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#374151' 
  },
  required: { 
    color: '#ef4444', 
    fontWeight: '700' 
  },
  input: { 
    backgroundColor: '#f9fafb', 
    borderWidth: 1, 
    borderColor: '#d1d5db', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    fontSize: 15, 
    color: '#1f2937' 
  },
  whiteInput: { 
    backgroundColor: 'white' 
  },
  textArea: { 
    height: 80, 
    paddingTop: 12 
  },
  row: { 
    flexDirection: 'row', 
    gap: 12 
  },
  halfWidth: { 
    flex: 1 
  },
  hintText: { 
    fontSize: 11, 
    color: '#6b7280', 
    marginTop: 4, 
    fontStyle: 'italic' 
  },
  imageUploadContainer: { 
    alignItems: 'center', 
    padding: 24, 
    borderWidth: 2, 
    borderStyle: 'dashed', 
    borderColor: '#d1d5db', 
    borderRadius: 16, 
    backgroundColor: '#f9fafb' 
  },
  emptyImageContainer: { 
    alignItems: 'center' 
  },
  uploadedImageContainer: { 
    alignItems: 'center' 
  },
  cameraIconCircle: { 
    width: 72, 
    height: 72, 
    borderRadius: 36, 
    backgroundColor: '#d1fae5', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  uploadTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#10b981', 
    marginBottom: 6 
  },
  uploadSubtitle: { 
    fontSize: 13, 
    color: '#6b7280' 
  },
  uploadedImage: { 
    width: 220, 
    height: 165, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  imageSuccessBadge: { 
    backgroundColor: '#d1fae5', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    marginBottom: 4 
  },
  imageSuccessText: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#10b981' 
  },
  imageHintText: { 
    fontSize: 12, 
    color: '#6b7280' 
  },
  bottomBar: { 
    backgroundColor: 'white', 
    borderTopWidth: 1, 
    borderTopColor: '#e5e7eb', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    flexDirection: 'row',
    gap: 12
  },
  cancelButton: { 
    flex: 1, 
    backgroundColor: '#f3f4f6', 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  cancelButtonText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#4b5563' 
  },
  submitButton: { 
    flex: 2, 
    backgroundColor: '#10b981', 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: 'center', 
    shadowColor: '#10b981', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 4 
  },
  submitButtonText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: 'white' 
  },
});

export default AddProduct;