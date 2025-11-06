import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraIcon, XCircleIcon } from '@/src/components/icons';
import Button from '@/components/ui/button';
import * as ImagePicker from 'expo-image-picker';

interface SetupScreenProps {
  onComplete: (data: SetupData) => void;
}

export interface SetupData {
  // Step 1: Personal Info
  fullName: string;
  phone: string;
  email: string;
  avatar: string;
  
  // Step 2: Store Basic Info
  storeName: string;
  storeDescription: string;
  storeAddress: string;
  storeLogo: string;
  storeCover: string;
  
  // Step 3: Extended Info (Optional)
  openingHours: string;
  paymentMethods: string;
  shippingPolicy: string;
  returnPolicy: string;
  facebook: string;
  instagram: string;
  youtube: string;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SetupData>({
    fullName: '',
    phone: '',
    email: '',
    avatar: 'https://i.pravatar.cc/150?img=12',
    storeName: '',
    storeDescription: '',
    storeAddress: '',
    storeLogo: 'https://i.pravatar.cc/200?img=50',
    storeCover: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    openingHours: '8:00 - 22:00',
    paymentMethods: '',
    shippingPolicy: '',
    returnPolicy: '',
    facebook: '',
    instagram: '',
    youtube: '',
  });

  // Validate Step 1
  const validateStep1 = (): boolean => {
    if (!formData.fullName.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ và tên');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập số điện thoại');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập email');
      return false;
    }
    return true;
  };

  // Validate Step 2
  const validateStep2 = (): boolean => {
    if (!formData.storeName.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên cửa hàng');
      return false;
    }
    if (!formData.storeDescription.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập mô tả cửa hàng');
      return false;
    }
    if (!formData.storeAddress.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập địa chỉ cửa hàng');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep === 3) {
      onComplete(formData);
    }
  };

  const handleComplete = () => {
    if (currentStep === 3) {
      onComplete(formData);
    }
  };

  const pickImage = async (type: 'avatar' | 'logo' | 'cover') => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'cover' ? [16, 9] : [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        if (type === 'avatar') {
          setFormData({ ...formData, avatar: imageUri });
        } else if (type === 'logo') {
          setFormData({ ...formData, storeLogo: imageUri });
        } else if (type === 'cover') {
          setFormData({ ...formData, storeCover: imageUri });
        }
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const renderProgressBar = () => (
    <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <View style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: currentStep >= step ? '#10b981' : '#e5e7eb',
            }} />
            {step < 3 && <View style={{ width: 8 }} />}
          </React.Fragment>
        ))}
      </View>
      <Text style={{ fontSize: 13, color: '#6b7280', textAlign: 'center' }}>
        Bước {currentStep} / 3
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
          👋 Chào mừng!
        </Text>
        <Text style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22 }}>
          Hãy thiết lập thông tin cá nhân của bạn để bắt đầu
        </Text>
      </View>

      {/* Avatar Upload */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <TouchableOpacity
          onPress={() => pickImage('avatar')}
          style={{ position: 'relative' }}
        >
          <Image
            source={{ uri: formData.avatar }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: '#f3f4f6',
              borderWidth: 4,
              borderColor: '#10b981'
            }}
          />
          <View style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: '#10b981',
            borderRadius: 20,
            padding: 10,
            borderWidth: 3,
            borderColor: 'white'
          }}>
            <CameraIcon className="h-5 w-5" color="white" />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 12 }}>
          Nhấn để thay đổi ảnh đại diện
        </Text>
      </View>

      {/* Full Name */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
          Họ và tên <Text style={{ color: '#ef4444' }}>*</Text>
        </Text>
        <TextInput
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          placeholder="Nhập họ và tên của bạn"
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            color: '#1f2937'
          }}
        />
      </View>

      {/* Phone */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
          Số điện thoại <Text style={{ color: '#ef4444' }}>*</Text>
        </Text>
        <TextInput
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            color: '#1f2937'
          }}
        />
      </View>

      {/* Email */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
          Email <Text style={{ color: '#ef4444' }}>*</Text>
        </Text>
        <TextInput
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Nhập địa chỉ email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            color: '#1f2937'
          }}
        />
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
          🏪 Cửa hàng của bạn
        </Text>
        <Text style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22 }}>
          Thiết lập thông tin cơ bản cho cửa hàng
        </Text>
      </View>

      {/* Store Cover */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
          Ảnh bìa cửa hàng
        </Text>
        <TouchableOpacity
          onPress={() => pickImage('cover')}
          style={{
            height: 180,
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: '#f3f4f6',
            borderWidth: 2,
            borderColor: '#e5e7eb',
            borderStyle: 'dashed'
          }}
        >
          <Image
            source={{ uri: formData.storeCover }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 8,
            padding: 10
          }}>
            <CameraIcon className="h-5 w-5" color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Store Logo */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
          Logo cửa hàng
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => pickImage('logo')}
            style={{ position: 'relative' }}
          >
            <Image
              source={{ uri: formData.storeLogo }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 12,
                backgroundColor: '#f3f4f6',
                borderWidth: 2,
                borderColor: '#e5e7eb'
              }}
            />
            <View style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              backgroundColor: '#10b981',
              borderRadius: 16,
              padding: 8,
              borderWidth: 2,
              borderColor: 'white'
            }}>
              <CameraIcon className="h-4 w-4" color="white" />
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 13, color: '#6b7280', marginLeft: 16, flex: 1 }}>
            Logo sẽ được hiển thị trên trang cửa hàng và trong các đơn hàng
          </Text>
        </View>
      </View>

      {/* Store Name */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
          Tên cửa hàng <Text style={{ color: '#ef4444' }}>*</Text>
        </Text>
        <TextInput
          value={formData.storeName}
          onChangeText={(text) => setFormData({ ...formData, storeName: text })}
          placeholder="Ví dụ: Green Farm - Thực phẩm sạch"
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            color: '#1f2937'
          }}
        />
      </View>

      {/* Store Description */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
          Mô tả cửa hàng <Text style={{ color: '#ef4444' }}>*</Text>
        </Text>
        <TextInput
          value={formData.storeDescription}
          onChangeText={(text) => setFormData({ ...formData, storeDescription: text })}
          placeholder="Giới thiệu ngắn gọn về cửa hàng của bạn"
          multiline
          numberOfLines={4}
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            color: '#1f2937',
            height: 100,
            textAlignVertical: 'top'
          }}
        />
      </View>

      {/* Store Address */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
          Địa chỉ cửa hàng <Text style={{ color: '#ef4444' }}>*</Text>
        </Text>
        <TextInput
          value={formData.storeAddress}
          onChangeText={(text) => setFormData({ ...formData, storeAddress: text })}
          placeholder="Nhập địa chỉ cửa hàng"
          multiline
          numberOfLines={2}
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            color: '#1f2937',
            textAlignVertical: 'top'
          }}
        />
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
          ⚙️ Thông tin bổ sung
        </Text>
        <Text style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22 }}>
          Bạn có thể bỏ qua và điền sau nếu muốn
        </Text>
      </View>

      {/* Opening Hours */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
          🕐 Giờ mở cửa
        </Text>
        <TextInput
          value={formData.openingHours}
          onChangeText={(text) => setFormData({ ...formData, openingHours: text })}
          placeholder="Ví dụ: 8:00 - 22:00"
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            color: '#1f2937'
          }}
        />
      </View>

      {/* Payment Methods */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
          💳 Phương thức thanh toán
        </Text>
        <TextInput
          value={formData.paymentMethods}
          onChangeText={(text) => setFormData({ ...formData, paymentMethods: text })}
          placeholder="Ví dụ: COD, Chuyển khoản, Ví điện tử"
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            color: '#1f2937'
          }}
        />
      </View>

      {/* Shipping Policy */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
          🚚 Chính sách giao hàng
        </Text>
        <TextInput
          value={formData.shippingPolicy}
          onChangeText={(text) => setFormData({ ...formData, shippingPolicy: text })}
          placeholder="Ví dụ: Miễn phí với đơn từ 200K"
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            color: '#1f2937'
          }}
        />
      </View>

      {/* Return Policy */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
          ↩️ Chính sách đổi trả
        </Text>
        <TextInput
          value={formData.returnPolicy}
          onChangeText={(text) => setFormData({ ...formData, returnPolicy: text })}
          placeholder="Ví dụ: Đổi trả trong 7 ngày"
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            color: '#1f2937'
          }}
        />
      </View>

      {/* Social Media */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
          📱 Mạng xã hội
        </Text>
        
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>Facebook</Text>
          <TextInput
            value={formData.facebook}
            onChangeText={(text) => setFormData({ ...formData, facebook: text })}
            placeholder="facebook.com/yourstore"
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 12,
              padding: 14,
              fontSize: 14,
              color: '#1f2937'
            }}
          />
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>Instagram</Text>
          <TextInput
            value={formData.instagram}
            onChangeText={(text) => setFormData({ ...formData, instagram: text })}
            placeholder="instagram.com/yourstore"
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 12,
              padding: 14,
              fontSize: 14,
              color: '#1f2937'
            }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>YouTube</Text>
          <TextInput
            value={formData.youtube}
            onChangeText={(text) => setFormData({ ...formData, youtube: text })}
            placeholder="youtube.com/@yourstore"
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 12,
              padding: 14,
              fontSize: 14,
              color: '#1f2937'
            }}
          />
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {renderProgressBar()}

      <View style={{ flex: 1 }}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </View>

      {/* Navigation Buttons */}
      <View style={{ 
        padding: 24, 
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 5
      }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {currentStep > 1 && (
            <View style={{ flex: 1 }}>
              <Button
                onPress={handleBack}
                variant="secondary"
                size="md"
                fullWidth
              >
                ← Quay lại
              </Button>
            </View>
          )}
          
          {currentStep < 3 ? (
            <View style={{ flex: 1 }}>
              <Button
                onPress={handleNext}
                variant="primary"
                size="md"
                fullWidth
              >
                Tiếp tục →
              </Button>
            </View>
          ) : (
            <>
              <View style={{ flex: 1 }}>
                <Button
                  onPress={handleSkip}
                  variant="secondary"
                  size="md"
                  fullWidth
                >
                  Bỏ qua
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  onPress={handleComplete}
                  variant="primary"
                  size="md"
                  fullWidth
                >
                  Hoàn tất ✓
                </Button>
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SetupScreen;
