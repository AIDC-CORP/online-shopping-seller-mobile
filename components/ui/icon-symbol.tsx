import React from 'react';
import { View } from 'react-native';

interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export const IconSymbol: React.FC<IconSymbolProps> = ({
  name,
  size = 24,
  color = '#000',
  className = '',
}) => {
  return <View className={className} style={{ width: size, height: size, backgroundColor: color }} />;
};
