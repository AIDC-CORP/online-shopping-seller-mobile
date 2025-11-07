import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface ButtonProps {
  onPress?: () => void;
  title?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  children,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}) => {
  const getBackgroundColor = () => {
    if (disabled || loading) {
      switch (variant) {
        case 'primary': return '#6ee7b7';
        case 'danger': return '#fca5a5';
        case 'secondary': return '#d1d5db';
        case 'success': return '#86efac';
        default: return '#6ee7b7';
      }
    }
    switch (variant) {
      case 'primary': return '#10b981';
      case 'danger': return '#ef4444';
      case 'secondary': return '#6b7280';
      case 'success': return '#22c55e';
      default: return '#10b981';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return { paddingVertical: 8, paddingHorizontal: 12 };
      case 'md': return { paddingVertical: 10, paddingHorizontal: 16 };
      case 'lg': return { paddingVertical: 14, paddingHorizontal: 24 };
      default: return { paddingVertical: 10, paddingHorizontal: 16 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return 14;
      case 'md': return 16;
      case 'lg': return 16;
      default: return 16;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          ...getPadding(),
          width: fullWidth ? '100%' : 'auto',
        }
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={[styles.text, { fontSize: getFontSize() }]}>
          {children || title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;
