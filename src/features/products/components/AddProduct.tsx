import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { Product } from '../../../shared/types';
import { XIcon, CameraIcon } from '@/src/components/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui/button';
import * as ImagePicker from 'expo-image-picker';

interface AddProductProps {
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

const InputField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <View>
    <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
    {children}
  </View>
);

const AddProduct: React.FC<AddProductProps> = ({ onClose, onAddProduct }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [importDate, setImportDate] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async (useCamera: boolean) => {
    try {
      // Request permissions
      const permissionResult = useCamera 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Quyền truy cập', 'Cần cấp quyền để chọn ảnh!');
        return;
      }

      // Launch picker
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
    if (!name || !price || !unit || !stock) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    onAddProduct({
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      unit,
      imageUrl: imageUri || `https://picsum.photos/seed/${name}/${Math.random()}/300/200`,
      expiryDate: expiryDate || undefined,
      importDate: importDate || undefined,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingTop: 50,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          backgroundColor: 'white'
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}>
            Thêm sản phẩm mới
          </Text>
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <XIcon className="h-6 w-6" color="gray" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View className="space-y-4">
            <TouchableOpacity 
              onPress={showImageOptions}
              className="flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-center"
            >
              {imageUri ? (
                <>
                  <Image 
                    source={{ uri: imageUri }} 
                    style={{ width: 200, height: 150, borderRadius: 8, marginBottom: 8 }}
                    resizeMode="cover"
                  />
                  <Text className="text-sm font-semibold text-emerald-600">✓ Ảnh đã chọn</Text>
                  <Text className="text-xs text-gray-500">Nhấn để thay đổi</Text>
                </>
              ) : (
                <>
                  <CameraIcon className="h-10 w-10 text-gray-400 mb-2" color="gray"/>
                  <Text className="text-sm font-semibold text-emerald-600">Tải lên hình ảnh</Text>
                  <Text className="text-xs text-gray-500">Chụp ảnh hoặc chọn từ thư viện</Text>
                </>
              )}
            </TouchableOpacity>
            
            <InputField label="Tên sản phẩm *">
              <TextInput value={name} onChangeText={setName} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-base" />
            </InputField>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <InputField label="Giá bán *">
                  <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-base" />
                </InputField>
              </View>
              <View className="flex-1">
                <InputField label="Đơn vị *">
                  <TextInput placeholder="kg, mớ..." value={unit} onChangeText={setUnit} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-base" />
                </InputField>
              </View>
            </View>

            <InputField label="Số lượng *">
              <TextInput value={stock} onChangeText={setStock} keyboardType="numeric" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-base" />
            </InputField>

            <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
              <Text className="text-xs font-semibold text-blue-800 mb-2">📅 Thông tin hạn sử dụng (Thực phẩm tươi)</Text>
              
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <InputField label="Ngày nhập hàng">
                    <TextInput 
                      value={importDate} 
                      onChangeText={setImportDate} 
                      placeholder="YYYY-MM-DD" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-base" 
                    />
                  </InputField>
                  <Text className="text-xs text-gray-500 mt-1">VD: 2025-11-05</Text>
                </View>
                
                <View className="flex-1">
                  <InputField label="Ngày hết hạn">
                    <TextInput 
                      value={expiryDate} 
                      onChangeText={setExpiryDate} 
                      placeholder="YYYY-MM-DD" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-base" 
                    />
                  </InputField>
                  <Text className="text-xs text-gray-500 mt-1">VD: 2025-11-15</Text>
                </View>
              </View>
            </View>

            <InputField label="Mô tả chi tiết">
              <TextInput multiline={true} numberOfLines={3} placeholder="Nguồn gốc, thông tin dinh dưỡng..." className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 bg-white text-base" textAlignVertical="top" />
            </InputField>
          </View>
        </ScrollView>
        <View className="p-4 bg-white border-t border-gray-200 flex-row gap-3">
          <View className="flex-1">
            <Button
              onPress={onClose}
              variant="secondary"
              size="md"
              fullWidth
            >
              Hủy
            </Button>
          </View>
          <View className="flex-1">
            <Button
              onPress={handleSubmit}
              variant="primary"
              size="md"
              fullWidth
            >
              Thêm sản phẩm
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddProduct;