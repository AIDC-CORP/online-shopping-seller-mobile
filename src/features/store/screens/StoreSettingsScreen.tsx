import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import apiService from '../../../services/apiService';
import Button from '../../../components/common/button';

interface StoreSettings {
  currency?: 'VND' | 'Dollar';
  language?: 'vietnamese' | 'english';
  time_zone?: string;
  tax_rate?: number;
  shipping_enable?: boolean;
  auto_accept_order?: boolean;
  notification_enable?: boolean;
}

const StoreSettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    currency: 'VND',
    language: 'vietnamese',
    time_zone: 'Asia/Ho_Chi_Minh',
    tax_rate: 0,
    shipping_enable: true,
    auto_accept_order: false,
    notification_enable: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    const result = await apiService.getStoreSettings();
    
    if (result.success && result.data) {
      setSettings(prev => ({
        ...prev,
        ...result.data,
      }));
    } else {
      console.error('Failed to load settings:', result.error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await apiService.updateStoreSettings(settings);
    
    if (result.success) {
      Alert.alert('Thành công', 'Đã cập nhật cài đặt cửa hàng');
    } else {
      Alert.alert('Lỗi', result.error || 'Không thể cập nhật cài đặt');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-gray-600 mt-4">Đang tải cài đặt...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Currency & Language */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-4">Tiền tệ & Ngôn ngữ</Text>
          
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-2">Tiền tệ</Text>
            <View className="flex-row" style={{ gap: 12 }}>
              <TouchableOpacity
                className={`flex-1 p-3 rounded-lg border ${settings.currency === 'VND' ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-50 border-gray-300'}`}
                onPress={() => setSettings(prev => ({ ...prev, currency: 'VND' }))}
              >
                <Text className={`text-center font-semibold ${settings.currency === 'VND' ? 'text-emerald-700' : 'text-gray-700'}`}>
                  VND (₫)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 p-3 rounded-lg border ${settings.currency === 'Dollar' ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-50 border-gray-300'}`}
                onPress={() => setSettings(prev => ({ ...prev, currency: 'Dollar' }))}
              >
                <Text className={`text-center font-semibold ${settings.currency === 'Dollar' ? 'text-emerald-700' : 'text-gray-700'}`}>
                  USD ($)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className="text-sm text-gray-600 mb-2">Ngôn ngữ</Text>
            <View className="flex-row" style={{ gap: 12 }}>
              <TouchableOpacity
                className={`flex-1 p-3 rounded-lg border ${settings.language === 'vietnamese' ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-50 border-gray-300'}`}
                onPress={() => setSettings(prev => ({ ...prev, language: 'vietnamese' }))}
              >
                <Text className={`text-center font-semibold ${settings.language === 'vietnamese' ? 'text-emerald-700' : 'text-gray-700'}`}>
                  🇻🇳 Tiếng Việt
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 p-3 rounded-lg border ${settings.language === 'english' ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-50 border-gray-300'}`}
                onPress={() => setSettings(prev => ({ ...prev, language: 'english' }))}
              >
                <Text className={`text-center font-semibold ${settings.language === 'english' ? 'text-emerald-700' : 'text-gray-700'}`}>
                  🇺🇸 English
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tax Settings */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-3">Thuế</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-sm text-gray-600">Thuế VAT (%)</Text>
              <Text className="text-xs text-gray-400 mt-1">Áp dụng cho tất cả sản phẩm</Text>
            </View>
            <View className="bg-gray-50 px-4 py-2 rounded-lg">
              <Text className="text-lg font-bold text-gray-800">{settings.tax_rate || 0}%</Text>
            </View>
          </View>
        </View>

        {/* Store Operations */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-3">Vận hành</Text>
          
          <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-800">Giao hàng</Text>
              <Text className="text-xs text-gray-500 mt-1">Cho phép khách hàng đặt giao hàng</Text>
            </View>
            <Switch
              value={settings.shipping_enable}
              onValueChange={(value) => setSettings(prev => ({ ...prev, shipping_enable: value }))}
              trackColor={{ false: '#d1d5db', true: '#10b981' }}
              thumbColor={settings.shipping_enable ? '#ffffff' : '#f3f4f6'}
            />
          </View>

          <View className="flex-row items-center justify-between py-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-800">Tự động chấp nhận đơn</Text>
              <Text className="text-xs text-gray-500 mt-1">Đơn hàng sẽ được xác nhận tự động</Text>
            </View>
            <Switch
              value={settings.auto_accept_order}
              onValueChange={(value) => setSettings(prev => ({ ...prev, auto_accept_order: value }))}
              trackColor={{ false: '#d1d5db', true: '#10b981' }}
              thumbColor={settings.auto_accept_order ? '#ffffff' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Notifications */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-3">Thông báo</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-800">Bật thông báo</Text>
              <Text className="text-xs text-gray-500 mt-1">Nhận thông báo về đơn hàng mới</Text>
            </View>
            <Switch
              value={settings.notification_enable}
              onValueChange={(value) => setSettings(prev => ({ ...prev, notification_enable: value }))}
              trackColor={{ false: '#d1d5db', true: '#10b981' }}
              thumbColor={settings.notification_enable ? '#ffffff' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Save Button */}
        <View className="mt-4">
          <Button
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSaving}
          >
            {isSaving ? 'Đang lưu...' : '💾 Lưu cài đặt'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default StoreSettingsScreen;
