import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

interface FloatingButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  backgroundColor?: string;
  size?: number;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  icon,
  backgroundColor = '#10b981',
  size = 56,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      activeOpacity={0.8}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default FloatingButton;
