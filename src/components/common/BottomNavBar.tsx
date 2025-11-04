import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HomeIcon, PackageIcon, CubeIcon, StoreIcon } from '../icons/Icons';

interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Trang chủ', Icon: HomeIcon },
  { id: 'orders', label: 'Đơn hàng', Icon: PackageIcon },
  { id: 'products', label: 'Sản phẩm', Icon: CubeIcon },
  { id: 'store', label: 'Cửa hàng', Icon: StoreIcon },
];

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <TouchableOpacity
            key={id}
            style={styles.tab}
            onPress={() => onTabChange(id)}
            activeOpacity={0.7}
          >
            <Icon
              width={24}
              height={24}
              color={isActive ? '#10b981' : '#9ca3af'}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? '#10b981' : '#9ca3af' },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default BottomNavBar;
