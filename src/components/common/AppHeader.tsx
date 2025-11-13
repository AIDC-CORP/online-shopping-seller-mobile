import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { UserIcon, XCircleIcon } from '../icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from './button';
import { useRouter } from 'expo-router';
import { ProfileScreen } from '../../features/profile';

interface AppHeaderProps {
  onLogout: () => void;
}

// Notification interface
interface Notification {
  id: string;
  orderId: string;
  customerName: string;
  type: 'new_order' | 'cancelled' | 'completed';
  message: string;
  timestamp: string;
  read: boolean;
}

// Mock notifications
const mockNotifications: Notification[] = [
  { id: 'n1', orderId: 'o1', customerName: 'Nguyễn Văn A', type: 'new_order', message: 'Đơn hàng mới từ Nguyễn Văn A', timestamp: '2 phút trước', read: false },
  { id: 'n2', orderId: 'o2', customerName: 'Trần Thị B', type: 'new_order', message: 'Đơn hàng mới từ Trần Thị B', timestamp: '7 phút trước', read: false },
  { id: 'n3', orderId: 'o6', customerName: 'Hoàng Thị F', type: 'cancelled', message: 'Hoàng Thị F đã hủy đơn hàng', timestamp: '1 giờ trước', read: true },
  { id: 'n4', orderId: 'o5', customerName: 'Vũ Văn E', type: 'completed', message: 'Đơn hàng của Vũ Văn E đã hoàn thành', timestamp: '2 giờ trước', read: true },
  { id: 'n5', orderId: 'o3', customerName: 'Lê Văn C', type: 'new_order', message: 'Đơn hàng mới từ Lê Văn C', timestamp: '3 giờ trước', read: true },
];

// Notification Modal
const NotificationModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationPress: (orderId: string) => void;
  onMarkAllRead: () => void;
}> = ({ visible, onClose, notifications, onNotificationPress, onMarkAllRead }) => {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_order': return '🔔';
      case 'cancelled': return '❌';
      case 'completed': return '✅';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'new_order': return { bg: '#dbeafe', border: '#3b82f6' };
      case 'cancelled': return { bg: '#fee2e2', border: '#ef4444' };
      case 'completed': return { bg: '#d1fae5', border: '#10b981' };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View style={{ 
          backgroundColor: 'white', 
          borderTopLeftRadius: 20, 
          borderTopRightRadius: 20,
          maxHeight: '85%',
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1f2937' }}>Thông báo</Text>
              {unreadCount > 0 && (
                <View style={{ 
                  backgroundColor: '#ef4444', 
                  paddingHorizontal: 8, 
                  paddingVertical: 2, 
                  borderRadius: 10,
                  minWidth: 24,
                  alignItems: 'center'
                }}>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>
                    {unreadCount}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose}>
              <XCircleIcon className="h-6 w-6" color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Mark all as read button */}
          {unreadCount > 0 && (
            <View style={{ paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#f9fafb' }}>
              <TouchableOpacity 
                onPress={onMarkAllRead}
                style={{ 
                  alignSelf: 'flex-end',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: '#10b981',
                  borderRadius: 6
                }}
              >
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                  Đánh dấu đã đọc tất cả
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notifications List */}
          <ScrollView style={{ maxHeight: 500 }}>
            {notifications.length > 0 ? (
              notifications.map((notif) => {
                const colors = getNotificationColor(notif.type);
                return (
                  <TouchableOpacity
                    key={notif.id}
                    onPress={() => {
                      onNotificationPress(notif.orderId);
                      onClose();
                    }}
                    style={{
                      backgroundColor: notif.read ? 'white' : '#f0f9ff',
                      borderLeftWidth: 4,
                      borderLeftColor: colors.border,
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: '#f3f4f6',
                    }}
                  >
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.bg,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Text style={{ fontSize: 20 }}>{getNotificationIcon(notif.type)}</Text>
                      </View>
                      
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={{ 
                            fontSize: 14, 
                            fontWeight: notif.read ? '500' : '700', 
                            color: '#1f2937',
                            flex: 1
                          }}>
                            {notif.message}
                          </Text>
                          {!notif.read && (
                            <View style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#3b82f6',
                              marginLeft: 8,
                              marginTop: 4
                            }} />
                          )}
                        </View>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontSize: 13, color: '#6b7280' }}>
                            Đơn #{notif.orderId}
                          </Text>
                          <Text style={{ fontSize: 12, color: '#9ca3af' }}>
                            {notif.timestamp}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>🔕</Text>
                <Text style={{ fontSize: 16, color: '#9ca3af', fontWeight: '600' }}>
                  Không có thông báo
                </Text>
                <Text style={{ fontSize: 13, color: '#d1d5db', marginTop: 4 }}>
                  Bạn sẽ nhận được thông báo khi có đơn hàng mới
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' }}>
            <Button onPress={onClose} variant="secondary" size="md" fullWidth>
              Đóng
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const AppHeader: React.FC<AppHeaderProps> = ({ onLogout }) => {
  const router = useRouter();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // Get unread notification count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle notification press
  const handleNotificationPress = (orderId: string) => {
    // Mark notification as read
    setNotifications(notifications.map(n => 
      n.orderId === orderId ? { ...n, read: true } : n
    ));
    
    // Navigate to orders screen
    router.push('/orders');
  };

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <>
      <SafeAreaView edges={['top']} className="bg-emerald-500">
        <View className="h-16 flex-row justify-between items-center px-4" style={styles.header}>
          <View>
            <Text className="text-sm font-light text-white/90">Xin chào,</Text>
            <Text className="text-xl font-bold text-white">Người bán</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {/* Store Button */}
            <TouchableOpacity 
              onPress={() => router.push('/store')}
              style={{ 
                padding: 8,
              }}
            >
              <Text style={{ fontSize: 24 }}>🏪</Text>
            </TouchableOpacity>

            {/* Notification Button */}
            <TouchableOpacity 
              onPress={() => setShowNotificationModal(true)}
              style={{ 
                position: 'relative', 
                padding: 8,
              }}
            >
              <Text style={{ fontSize: 24 }}>🔔</Text>
              {unreadCount > 0 && (
                <View style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: '#ef4444',
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 6,
                  borderWidth: 2,
                  borderColor: '#10b981'
                }}>
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 11, 
                    fontWeight: '700',
                    includeFontPadding: false
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* User Button */}
            <TouchableOpacity
              onPress={() => setShowProfileModal(true)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: 10,
                borderRadius: 8
              }}
            >
              <UserIcon className="h-6 w-6" color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Notification Modal */}
      <NotificationModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
        onNotificationPress={handleNotificationPress}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Profile Modal */}
      <ProfileScreen
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onLogout={onLogout}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default AppHeader;