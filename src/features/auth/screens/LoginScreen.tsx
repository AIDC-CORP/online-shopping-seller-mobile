import React, { useState } from 'react';
import { View, Text, TextInput, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '../../../components/ui/button';
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '../../../context/AuthContext';

interface LoginScreenProps {
  onLogin: (userData?: any) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  
  // Sử dụng custom hook
  const { login, isLoading, error, clearError } = useLogin();

  const handleLoginClick = async () => {
    const user = await login(username, password);
    
    if (user) {
      // Lưu user vào context
      setUser(user);
      
      // Call parent callback with user data to handle routing
      onLogin(user);
    }
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    if (error) clearError(); // Clear error khi user typing
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) clearError(); // Clear error khi user typing
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Emerald Banner */}
        <View className="bg-emerald-500 pt-12 pb-16 px-6 rounded-b-3xl">
          <Text className="text-3xl font-bold text-white text-center">
            Seller Hub
          </Text>
          <Text className="mt-3 text-base text-emerald-50 text-center">
            Quản lý cửa hàng của bạn
          </Text>
        </View>

        {/* Login Form */}
        <View className="flex-1 px-6 -mt-8">
          <View className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
            <View>
              <Text className="text-xl font-bold text-gray-800 text-center mb-2">
                Đăng nhập
              </Text>
              <Text className="text-sm text-gray-500 text-center">
                Nhập thông tin để tiếp tục
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Tên đăng nhập</Text>
                <TextInput
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  placeholder="username"
                  value={username}
                  onChangeText={handleUsernameChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</Text>
                <TextInput
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry
                />
              </View>

              {error && (
                <View className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <Text className="text-red-600 text-xs text-center">{error}</Text>
                </View>
              )}

              <View className="pt-2">
                <Button
                  onPress={handleLoginClick}
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                >
                  Đăng nhập
                </Button>
              </View>
            </View>
          </View>

          {/* Footer */}
          <Text className="text-center text-gray-400 text-xs mt-8">
            Bằng việc đăng nhập, bạn đồng ý với Điều khoản dịch vụ
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;