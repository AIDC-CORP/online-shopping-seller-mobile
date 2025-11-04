import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'large', color = '#10b981' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Spinner;
