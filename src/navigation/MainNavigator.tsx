
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../features/dashboard/DashboardScreen';
import OrdersScreen from '../features/orders/OrdersScreen';
import ProductsScreen from '../features/products/ProductsScreen';
import StoreScreen from '../features/store/StoreScreen';
import AppHeader from '../shared/components/AppHeader';
import { HomeIcon, PackageIcon, CubeIcon, StoreIcon } from '../shared/components/icons';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

interface MainNavigatorProps {
    onLogout: () => void;
}

const MainNavigator: React.FC<MainNavigatorProps> = ({ onLogout }) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                header: () => <AppHeader onLogout={onLogout} />,
                tabBarIcon: ({ color, size, focused }) => {
                    let icon;
                    if (route.name === 'Dashboard') icon = <HomeIcon className="h-6 w-6" color={color} />;
                    else if (route.name === 'Orders') icon = <PackageIcon className="h-6 w-6" color={color} />;
                    else if (route.name === 'Products') icon = <CubeIcon className="h-6 w-6" color={color} />;
                    else if (route.name === 'Store') icon = <StoreIcon className="h-6 w-6" color={color} />;
                    
                    return icon;
                },
                tabBarLabel: ({ color, focused }) => {
                    const labels: { [key: string]: string } = {
                        'Dashboard': 'Báo cáo',
                        'Orders': 'Đơn hàng',
                        'Products': 'Sản phẩm',
                        'Store': 'Cửa hàng'
                    };
                    return <Text style={{ color, fontSize: 10, marginTop: -5, fontWeight: focused ? '600' : '400' }}>{labels[route.name]}</Text>
                },
                tabBarActiveTintColor: '#10b981', // emerald-500
                tabBarInactiveTintColor: '#6b7280', // gray-500
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 5,
                    paddingTop: 5,
                },
                tabBarBadgeStyle: {
                    backgroundColor: '#ef4444' // red-500
                }
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarBadge: 2 }} />
            <Tab.Screen name="Products" component={ProductsScreen} />
            <Tab.Screen name="Store" component={StoreScreen} />
        </Tab.Navigator>
    );
};

export default MainNavigator;