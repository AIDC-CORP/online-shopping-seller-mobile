import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

interface IconButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  children,
  className = '',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled && styles.disabled,
      ]}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default IconButton;
