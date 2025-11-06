import { Tabs } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { HomeIcon, PackageIcon, CubeIcon, StoreIcon, ChatIcon, GiftIcon, WalletIcon } from '@/src/components/icons';
import AppHeader from '@/src/components/common/AppHeader';
import { mockChatConversations, mockProducts, mockOrders } from '@/src/shared/data/mockData';
import { OrderStatus } from '@/src/shared/types';
import AIAssistantBubble from '@/src/components/ai/AIAssistantBubble';
import AIAssistantChat from '@/src/components/ai/AIAssistantChat';
import type { BusinessContext } from '@/src/features/ai/aiAssistantService';

export default function MainLayout() {
  const [showAIChat, setShowAIChat] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout logic
  };

  // Calculate total unread messages
  const totalUnread = mockChatConversations.reduce((sum, chat) => sum + chat.unreadCount, 0);

  // Prepare business context for AI
  const businessContext: BusinessContext = useMemo(() => {
    // Calculate total revenue from completed orders
    const totalRevenue = mockOrders
      .filter(order => order.status === OrderStatus.Completed)
      .reduce((sum, order) => sum + order.total, 0);

    // Find products with low stock (less than 10 units)
    const lowStockCount = mockProducts.filter(p => p.stock < 10).length;

    // Calculate top products by orders (mock data)
    const topProducts = mockProducts
      .slice(0, 3)
      .map(p => p.name);

    return {
      totalProducts: mockProducts.length,
      totalRevenue,
      totalOrders: mockOrders.length,
      lowStockProducts: lowStockCount,
      topProducts,
    };
  }, []);

  return (
    <>
      <AppHeader onLogout={handleLogout} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#10b981',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: {
            height: 96,
            paddingBottom: 10,
            paddingTop: 1,
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
          name="wallet"
          options={{
            title: 'Ví',
            tabBarIcon: ({ color }) => <WalletIcon className="h-6 w-6" color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'CSKH',
            tabBarIcon: ({ color }) => <ChatIcon color={color} />,
            tabBarBadge: totalUnread > 0 ? totalUnread : undefined,
          }}
        />
        {/* Hidden tabs - accessible from header/other screens */}
        <Tabs.Screen
          name="promotions"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="store"
          options={{
            href: null, // Hide from tab bar - accessible from header
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

      {/* AI Assistant */}
      <AIAssistantBubble 
        onPress={() => setShowAIChat(true)}
      />
      <AIAssistantChat
        visible={showAIChat}
        onClose={() => setShowAIChat(false)}
        businessContext={businessContext}
      />
    </>
  );
}
