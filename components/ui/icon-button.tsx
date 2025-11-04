import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface IconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-gray-100 active:bg-gray-200',
    primary: 'bg-emerald-500 active:bg-emerald-600',
    danger: 'bg-red-500 active:bg-red-600',
    success: 'bg-green-500 active:bg-green-600',
  };

  const sizeStyles = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3',
  };

  const disabledStyle = disabled ? 'opacity-50' : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyle}
        rounded-lg
        items-center
        justify-center
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={variant !== 'default' ? styles.shadow : undefined}
      activeOpacity={0.7}
    >
      <View>{icon}</View>
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

export default IconButton;
