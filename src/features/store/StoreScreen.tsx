import React, { useState } from 'react';
import { View, Text, ScrollView, Image, ImageBackground } from 'react-native';
import { mockStoreInfo } from '../../shared/data/mockData';
import { StoreInfo } from '../../shared/types';
import { PencilIcon } from '@/src/components/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconButton from '@/components/ui/icon-button';
import Button from '@/components/ui/button';

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View className="py-3 border-b border-gray-200">
    <Text className="text-sm text-gray-500">{label}</Text>
    <Text className="text-base text-gray-800">{value}</Text>
  </View>
);

const StoreScreen: React.FC = () => {
  const [storeInfo] = useState<StoreInfo>(mockStoreInfo);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50/50">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Cover Image with Edit Button */}
        <ImageBackground source={{ uri: storeInfo.coverImageUrl }} className="w-full h-48" resizeMode="cover">
            <View className="flex-1 bg-black/30 justify-end p-4">
              <View className="self-end">
                <IconButton
                  onPress={() => console.log('Edit cover')}
                  icon={<PencilIcon className="h-5 w-5" color="white" />}
                  variant="default"
                  size="sm"
                  className="bg-black/40"
                />
              </View>
            </View>
        </ImageBackground>
        
        {/* Store Profile Section */}
        <View className="px-4 -mt-16">
          <View className="flex-row items-end" style={{ gap: 16 }}>
            <Image source={{ uri: storeInfo.avatarUrl }} className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg" />
            <View className="flex-1 pb-2">
              <View style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.4)', 
                paddingHorizontal: 12, 
                paddingVertical: 8, 
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff' }}>
                  {storeInfo.name}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Store Description Card */}
        <View className="bg-white p-4 rounded-xl shadow-sm mx-4 mt-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-base font-semibold text-gray-800">Giới thiệu</Text>
            <IconButton
              onPress={() => console.log('Edit description')}
              icon={<PencilIcon className="h-4 w-4" color="#6b7280" />}
              variant="default"
              size="sm"
            />
          </View>
          <Text className="text-sm text-gray-600 leading-5">{storeInfo.description}</Text>
        </View>

        {/* Store Information Card */}
        <View className="bg-white p-4 rounded-xl shadow-sm mx-4 mt-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold text-gray-800">Thông tin cửa hàng</Text>
            <IconButton
              onPress={() => console.log('Edit info')}
              icon={<PencilIcon className="h-4 w-4" color="#6b7280" />}
              variant="default"
              size="sm"
            />
          </View>
          <InfoRow label="📍 Địa chỉ" value={storeInfo.address} />
          <InfoRow label="📞 Số điện thoại" value={storeInfo.phone} />
          <InfoRow label="🕐 Giờ mở cửa" value={storeInfo.openingHours} />
        </View>

        {/* Quick Actions */}
        <View className="px-4 mt-6 space-y-3">
          <Button
            onPress={() => console.log('Edit store settings')}
            variant="secondary"
            size="md"
            fullWidth
            icon={<PencilIcon className="h-5 w-5" color="white" />}
          >
            Chỉnh sửa thông tin
          </Button>
          
          <Button
            onPress={() => console.log('Close store')}
            variant="danger"
            size="md"
            fullWidth
          >
            Tạm đóng cửa gian hàng
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StoreScreen;