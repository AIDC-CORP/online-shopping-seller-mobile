import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Switch, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XCircleIcon, PencilIcon, UserIcon } from '../../../components/icons';
import Button from '../../../components/ui/button';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

// Mock user data
const mockUserData = {
  id: 'u1',
  name: 'Nguyễn Văn A',
  email: 'seller@greenfarm.vn',
  phone: '0901234567',
  avatar: 'https://i.pravatar.cc/150?img=12',
  joinDate: '15/03/2024',
  sellerLevel: 'Vàng',
  sellerBadge: '⭐',
  totalOrders: 342,
  rating: 4.8,
  responseRate: 95,
};

const ProfileScreen: React.FC<ProfileModalProps> = ({ visible, onClose, onLogout }) => {
  const [userData, setUserData] = useState(mockUserData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState<'name' | 'email' | 'phone' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('vi');
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleEditField = (field: 'name' | 'email' | 'phone') => {
    setEditField(field);
    setEditValue(userData[field]);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editField) return;
    setUserData(prev => ({ ...prev, [editField]: editValue }));
    setShowEditModal(false);
    setEditField(null);
    setEditValue('');
  };

  const getFieldLabel = () => {
    switch (editField) {
      case 'name': return 'Họ và tên';
      case 'email': return 'Email';
      case 'phone': return 'Số điện thoại';
      default: return '';
    }
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: () => {
            onClose();
            onLogout();
          }
        }
      ]
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ 
            flex: 1, 
            marginTop: 50, 
            backgroundColor: 'white', 
            borderTopLeftRadius: 24, 
            borderTopRightRadius: 24 
          }}>
            {/* Header */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#f3f4f6'
            }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1f2937' }}>
                👤 Tài khoản của tôi
              </Text>
              <TouchableOpacity onPress={onClose}>
                <XCircleIcon className="h-6 w-6" color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Profile Card */}
              <View style={{ 
                backgroundColor: '#10b981', 
                margin: 16, 
                padding: 20, 
                borderRadius: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 8,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <View style={{ position: 'relative' }}>
                    <Image 
                      source={{ uri: userData.avatar }}
                      style={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: 40,
                        borderWidth: 3,
                        borderColor: 'white'
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 6,
                      }}
                    >
                      <PencilIcon className="h-4 w-4" color="#10b981" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ 
                        fontSize: 20, 
                        fontWeight: 'bold', 
                        color: 'white',
                        marginRight: 8
                      }}>
                        {userData.name}
                      </Text>
                      <View style={{
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 12
                      }}>
                        <Text style={{ fontSize: 12, color: 'white', fontWeight: '600' }}>
                          {userData.sellerBadge} {userData.sellerLevel}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
                      Tham gia: {userData.joinDate}
                    </Text>
                  </View>
                </View>

                {/* Stats */}
                <View style={{ 
                  flexDirection: 'row', 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  padding: 12
                }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                      {userData.totalOrders}
                    </Text>
                    <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>
                      Đơn hàng
                    </Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                      {userData.rating}⭐
                    </Text>
                    <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>
                      Đánh giá
                    </Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                      {userData.responseRate}%
                    </Text>
                    <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>
                      Phản hồi
                    </Text>
                  </View>
                </View>
              </View>

              {/* Personal Info */}
              <View style={{ 
                backgroundColor: 'white', 
                marginHorizontal: 16, 
                marginBottom: 12,
                padding: 16, 
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
              }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 12 }}>
                  📋 Thông tin cá nhân
                </Text>
                
                <TouchableOpacity 
                  onPress={() => handleEditField('name')}
                  style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f3f4f6'
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Họ và tên</Text>
                    <Text style={{ fontSize: 15, color: '#1f2937', fontWeight: '600' }}>
                      {userData.name}
                    </Text>
                  </View>
                  <PencilIcon className="h-4 w-4" color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => handleEditField('email')}
                  style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f3f4f6'
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Email</Text>
                    <Text style={{ fontSize: 15, color: '#1f2937', fontWeight: '600' }}>
                      {userData.email}
                    </Text>
                  </View>
                  <PencilIcon className="h-4 w-4" color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => handleEditField('phone')}
                  style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingVertical: 12,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Số điện thoại</Text>
                    <Text style={{ fontSize: 15, color: '#1f2937', fontWeight: '600' }}>
                      {userData.phone}
                    </Text>
                  </View>
                  <PencilIcon className="h-4 w-4" color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {/* Settings */}
              <View style={{ 
                backgroundColor: 'white', 
                marginHorizontal: 16, 
                marginBottom: 12,
                padding: 16, 
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
              }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 12 }}>
                  ⚙️ Cài đặt
                </Text>

                {/* Notifications Toggle */}
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f3f4f6'
                }}>
                  <View>
                    <Text style={{ fontSize: 15, color: '#1f2937', fontWeight: '600' }}>
                      🔔 Thông báo
                    </Text>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                      Nhận thông báo đơn hàng mới
                    </Text>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#d1d5db', true: '#10b981' }}
                    thumbColor={notificationsEnabled ? '#ffffff' : '#f3f4f6'}
                  />
                </View>

                {/* Dark Mode Toggle */}
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f3f4f6'
                }}>
                  <View>
                    <Text style={{ fontSize: 15, color: '#1f2937', fontWeight: '600' }}>
                      🌙 Chế độ tối
                    </Text>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                      Chế độ giao diện tối
                    </Text>
                  </View>
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: '#d1d5db', true: '#10b981' }}
                    thumbColor={darkMode ? '#ffffff' : '#f3f4f6'}
                  />
                </View>

                {/* Language */}
                <TouchableOpacity 
                  onPress={() => setShowLanguageModal(true)}
                  style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f3f4f6'
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 15, color: '#1f2937', fontWeight: '600' }}>
                      🌐 Ngôn ngữ
                    </Text>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                      {language === 'vi' ? 'Tiếng Việt' : 'English'}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, color: '#9ca3af' }}>›</Text>
                </TouchableOpacity>

                {/* Change Password */}
                <TouchableOpacity 
                  style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingVertical: 12,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 15, color: '#1f2937', fontWeight: '600' }}>
                      🔐 Đổi mật khẩu
                    </Text>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                      Thay đổi mật khẩu đăng nhập
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, color: '#9ca3af' }}>›</Text>
                </TouchableOpacity>
              </View>

              {/* About */}
              <View style={{ 
                backgroundColor: 'white', 
                marginHorizontal: 16, 
                marginBottom: 12,
                padding: 16, 
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
              }}>
                <TouchableOpacity 
                  style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f3f4f6'
                  }}
                >
                  <Text style={{ fontSize: 15, color: '#1f2937', fontWeight: '600' }}>
                    📋 Điều khoản dịch vụ
                  </Text>
                  <Text style={{ fontSize: 16, color: '#9ca3af' }}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f3f4f6'
                  }}
                >
                  <Text style={{ fontSize: 15, color: '#1f2937', fontWeight: '600' }}>
                    🔒 Chính sách bảo mật
                  </Text>
                  <Text style={{ fontSize: 16, color: '#9ca3af' }}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingVertical: 12,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 15, color: '#1f2937', fontWeight: '600' }}>
                      ℹ️ Về ứng dụng
                    </Text>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                      Phiên bản 1.0.0
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, color: '#9ca3af' }}>›</Text>
                </TouchableOpacity>
              </View>

              {/* Logout Button */}
              <View style={{ paddingHorizontal: 16 }}>
                <Button
                  onPress={handleLogoutPress}
                  variant="secondary"
                  size="md"
                  fullWidth
                >
                  🚪 Đăng xuất
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 16, 
            padding: 24,
            width: '85%',
            maxWidth: 400
          }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 16 }}>
              Chỉnh sửa {getFieldLabel()}
            </Text>
            
            <TextInput
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Nhập ${getFieldLabel().toLowerCase()}`}
              style={{
                backgroundColor: '#f9fafb',
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#e5e7eb',
                fontSize: 15,
                color: '#1f2937',
                marginBottom: 16
              }}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Button
                  onPress={() => setShowEditModal(false)}
                  variant="secondary"
                  size="md"
                  fullWidth
                >
                  Hủy
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  onPress={handleSaveEdit}
                  variant="primary"
                  size="md"
                  fullWidth
                >
                  Lưu
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 16, 
            padding: 24,
            width: '85%',
            maxWidth: 400
          }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 16 }}>
              Chọn ngôn ngữ
            </Text>
            
            <TouchableOpacity
              onPress={() => {
                setLanguage('vi');
                setShowLanguageModal(false);
              }}
              style={{
                padding: 16,
                borderRadius: 8,
                backgroundColor: language === 'vi' ? '#d1fae5' : '#f9fafb',
                marginBottom: 8
              }}
            >
              <Text style={{ 
                fontSize: 15, 
                fontWeight: language === 'vi' ? '600' : '400',
                color: language === 'vi' ? '#059669' : '#1f2937'
              }}>
                🇻🇳 Tiếng Việt
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setLanguage('en');
                setShowLanguageModal(false);
              }}
              style={{
                padding: 16,
                borderRadius: 8,
                backgroundColor: language === 'en' ? '#d1fae5' : '#f9fafb',
                marginBottom: 16
              }}
            >
              <Text style={{ 
                fontSize: 15, 
                fontWeight: language === 'en' ? '600' : '400',
                color: language === 'en' ? '#059669' : '#1f2937'
              }}>
                🇬🇧 English
              </Text>
            </TouchableOpacity>

            <Button
              onPress={() => setShowLanguageModal(false)}
              variant="secondary"
              size="md"
              fullWidth
            >
              Đóng
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfileScreen;
