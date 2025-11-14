import React from 'react';
import { View, Text, ScrollView, Switch, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSettings } from '../hooks';
import { StoreSettings } from '../../../services/setting';

const SettingRow: React.FC<{
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}> = ({ label, description, value, onValueChange }) => (
  <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
    <View className="flex-1 pr-3">
      <Text className="text-sm font-medium text-gray-800">{label}</Text>
      {description && (
        <Text className="text-xs text-gray-500 mt-1">{description}</Text>
      )}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#d1d5db', true: '#10b981' }}
      thumbColor={value ? '#ffffff' : '#f3f4f6'}
    />
  </View>
);

const SettingsScreen: React.FC = () => {
  const { settings, isLoading, updateSettings } = useSettings();

  console.log('[SettingsScreen] Component rendered');
  console.log('[SettingsScreen] isLoading:', isLoading);
  console.log('[SettingsScreen] settings:', settings);

  const updateSetting = async <K extends keyof StoreSettings>(
    key: K,
    value: StoreSettings[K]
  ) => {
    await updateSettings({ [key]: value });
  };

  if (isLoading) {
    console.log('[SettingsScreen] Showing loading state');
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-gray-600 mt-4">Đang tải cài đặt...</Text>
      </View>
    );
  }

  console.log('[SettingsScreen] Rendering main content');
  return (
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Currency & Language */}
      <View className="bg-white p-4 rounded-xl shadow-sm mx-4 mt-4">
        <Text className="text-base font-semibold text-gray-800 mb-4">💱 Tiền tệ & Ngôn ngữ</Text>
          
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-2">Tiền tệ</Text>
            <View className="flex-row" style={{ gap: 12 }}>
              <TouchableOpacity
                className={`flex-1 p-3 rounded-lg border ${settings.currency === 'VND' ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-50 border-gray-300'}`}
                onPress={() => updateSetting('currency', 'VND')}
              >
                <Text className={`text-center font-semibold ${settings.currency === 'VND' ? 'text-emerald-700' : 'text-gray-700'}`}>
                  VND (₫)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 p-3 rounded-lg border ${settings.currency === 'Dollar' ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-50 border-gray-300'}`}
                onPress={() => updateSetting('currency', 'Dollar')}
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
                onPress={() => updateSetting('language', 'vietnamese')}
              >
                <Text className={`text-center font-semibold ${settings.language === 'vietnamese' ? 'text-emerald-700' : 'text-gray-700'}`}>
                  🇻🇳 Tiếng Việt
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 p-3 rounded-lg border ${settings.language === 'english' ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-50 border-gray-300'}`}
                onPress={() => updateSetting('language', 'english')}
              >
                <Text className={`text-center font-semibold ${settings.language === 'english' ? 'text-emerald-700' : 'text-gray-700'}`}>
                  🇺🇸 English
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tax Settings */}
        <View className="bg-white p-4 rounded-xl shadow-sm mx-4 mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-3">💰 Thuế</Text>
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
        <View className="bg-white p-4 rounded-xl shadow-sm mx-4 mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-3">⚙️ Vận hành</Text>
          
          <SettingRow
            label="Giao hàng"
            description="Cho phép khách hàng đặt giao hàng"
            value={settings.shipping_enable ?? true}
            onValueChange={(value) => updateSetting('shipping_enable', value)}
          />

          <SettingRow
            label="Tự động chấp nhận đơn"
            description="Đơn hàng sẽ được xác nhận tự động"
            value={settings.auto_accept_order ?? false}
            onValueChange={(value) => updateSetting('auto_accept_order', value)}
          />
        </View>

        {/* Notifications */}
        <View className="bg-white p-4 rounded-xl shadow-sm mx-4 mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-3">🔔 Thông báo</Text>
          <SettingRow
            label="Bật thông báo"
            description="Nhận thông báo về đơn hàng mới"
            value={settings.notification_enable ?? true}
            onValueChange={(value) => updateSetting('notification_enable', value)}
          />
        </View>
      </ScrollView>
  );
};

export default SettingsScreen;
