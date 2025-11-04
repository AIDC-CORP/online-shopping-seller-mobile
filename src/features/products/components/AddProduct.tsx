import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Product } from '../../../shared/types';
import { XIcon, CameraIcon } from '../../../shared/components/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui/button';
import IconButton from '@/components/ui/icon-button';

interface AddProductProps {
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id' | 'imageUrl'>) => void;
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
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-800">Thêm sản phẩm mới</Text>
          <IconButton
            onPress={onClose}
            icon={<XIcon className="h-6 w-6" color="gray" />}
            variant="default"
            size="sm"
          />
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View className="space-y-4">
            <TouchableOpacity className="flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <CameraIcon className="h-10 w-10 text-gray-400 mb-2" color="gray"/>
              <Text className="text-sm font-semibold text-emerald-600">Tải lên hình ảnh</Text>
              <Text className="text-xs text-gray-500">PNG, JPG (tối đa 5MB)</Text>
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

            <InputField label="Số lượng tồn kho *">
              <TextInput value={stock} onChangeText={setStock} keyboardType="numeric" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-base" />
            </InputField>

            <InputField label="Mô tả chi tiết">
              <TextInput multiline={true} numberOfLines={3} placeholder="Nguồn gốc, thông tin dinh dưỡng..." className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 bg-white text-base" textAlignVertical="top" />
            </InputField>
          </View>
        </ScrollView>
        <View className="p-4 bg-white border-t border-gray-200 flex-row gap-3">
          <View className="flex-1">
            <Button
              onPress={onClose}
              variant="ghost"
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