import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserIcon } from '@/src/components/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconButton from '@/components/ui/icon-button';

interface AppHeaderProps {
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onLogout }) => {
  return (
    <SafeAreaView edges={['top']} className="bg-emerald-500">
      <View className="h-16 flex-row justify-between items-center px-4" style={styles.header}>
        <View>
          <Text className="text-sm font-light text-white/90">Xin chào,</Text>
          <Text className="text-xl font-bold text-white">Người bán</Text>
        </View>
        <IconButton
          onPress={onLogout}
          icon={<UserIcon className="h-6 w-6" color="white" />}
          variant="primary"
          size="sm"
          className="bg-emerald-600"
        />
      </View>
    </SafeAreaView>
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