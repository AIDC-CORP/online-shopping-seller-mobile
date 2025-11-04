import { Tabs } from 'expo-router';
import React from 'react';
import { HomeIcon, PackageIcon, CubeIcon, StoreIcon } from '@/src/components/icons';
import AppHeader from '@/src/components/common/AppHeader';

export default function MainLayout() {
  const handleLogout = () => {
    // TODO: Implement logout logic
  };

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
          name="store"
          options={{
            title: 'Cửa hàng',
            tabBarIcon: ({ color }) => <StoreIcon className="h-6 w-6" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
