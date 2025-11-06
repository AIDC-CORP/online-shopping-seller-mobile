import { Tabs } from 'expo-router';
import React from 'react';
import { HomeIcon, PackageIcon, CubeIcon, StoreIcon, ChatIcon, GiftIcon } from '@/src/components/icons';
import AppHeader from '@/src/components/common/AppHeader';
import { mockChatConversations } from '@/src/shared/data/mockData';

export default function MainLayout() {
  const handleLogout = () => {
    // TODO: Implement logout logic
  };

  // Calculate total unread messages
  const totalUnread = mockChatConversations.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <>
      <AppHeader onLogout={handleLogout} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#10b981',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: {
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
          },
        }}>
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Báo cáo',
            tabBarIcon: ({ color }) => <HomeIcon className="h-6 w-6" color={color} />,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Đơn hàng',
            tabBarIcon: ({ color }) => <PackageIcon className="h-6 w-6" color={color} />,
            tabBarBadge: 2,
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            title: 'Sản phẩm',
            tabBarIcon: ({ color }) => <CubeIcon className="h-6 w-6" color={color} />,
          }}
        />
        <Tabs.Screen
          name="promotions"
          options={{
            title: 'Giảm giá',
            tabBarIcon: ({ color }) => <GiftIcon className="h-6 w-6" color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Tin nhắn',
            tabBarIcon: ({ color }) => <ChatIcon color={color} />,
            tabBarBadge: totalUnread > 0 ? totalUnread : undefined,
          }}
        />
        <Tabs.Screen
          name="store"
          options={{
            title: 'Cửa hàng',
            tabBarIcon: ({ color }) => <StoreIcon className="h-6 w-6" color={color} />,
          }}
        />
        {/* Hide chat detail from tab bar - it's a nested screen */}
        <Tabs.Screen
          name="chat/[id]"
          options={{
            href: null, // This hides it from the tab bar
          }}
        />
      </Tabs>
    </>
  );
}
