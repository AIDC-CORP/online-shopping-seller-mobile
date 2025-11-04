import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  className = '',
}) => {
  // Variant background colors
  const variantBackgroundColors: Record<ButtonVariant, string> = {
    primary: '#10b981', // emerald-500
    secondary: '#4b5563', // gray-600
    success: '#22c55e', // green-500
    danger: '#ef4444', // red-500
    warning: '#eab308', // yellow-500
    ghost: 'transparent',
  };

  const variantTextColors: Record<ButtonVariant, string> = {
    primary: '#ffffff',
    secondary: '#ffffff',
    success: '#ffffff',
    danger: '#ffffff',
    warning: '#1f2937', // gray-900
    ghost: '#374151', // gray-700
  };

  // Size styles
  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 12 },
    md: { paddingVertical: 12, paddingHorizontal: 16 },
    lg: { paddingVertical: 14, paddingHorizontal: 24 },
  };

  const textSizeStyles = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: variantBackgroundColors[variant],
    ...sizeStyles[size],
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled || loading ? 0.5 : 1,
    ...(fullWidth && { width: '100%' }),
    ...(variant === 'ghost' && {
      borderWidth: 2,
      borderColor: '#d1d5db', // gray-300
    }),
  };

  const textStyle = {
    color: variantTextColors[variant],
    fontSize: textSizeStyles[size],
    fontWeight: '600' as const,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        buttonStyle,
        variant !== 'ghost' ? styles.shadow : undefined,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variantTextColors[variant]} size="small" />
      ) : (
        <>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text style={textStyle}>
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default Button;
