import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OrderStatus } from '../types';
import Button from '../../../components/common/button';

interface OrderDetailActionsProps {
  status: OrderStatus;
  actionLoading: boolean;
  onAccept: () => void;
  onReject: () => void;
  onShip: () => void;
  onComplete: () => void;
}

export const OrderDetailActions: React.FC<OrderDetailActionsProps> = ({
  status,
  actionLoading,
  onAccept,
  onReject,
  onShip,
  onComplete,
}) => {
  const router = useRouter();

  if (status === OrderStatus.New) {
    return (
      <View style={styles.actionBar}>
        <Button onPress={onAccept} variant="primary" size="md" fullWidth disabled={actionLoading}>
          {actionLoading ? 'Đang xử lý...' : '✅ Xác nhận đơn hàng'}
        </Button>
        <Button onPress={onReject} variant="danger" size="md" fullWidth disabled={actionLoading}>
          ❌ Từ chối đơn hàng
        </Button>
      </View>
    );
  }

  if (status === OrderStatus.Preparing) {
    return (
      <View style={styles.actionBar}>
        <Button onPress={onShip} variant="primary" size="md" fullWidth disabled={actionLoading}>
          {actionLoading ? 'Đang xử lý...' : '🚚 Giao hàng'}
        </Button>
      </View>
    );
  }

  if (status === OrderStatus.Delivering) {
    return (
      <View style={styles.actionBar}>
        <Button onPress={onComplete} variant="primary" size="md" fullWidth disabled={actionLoading}>
          {actionLoading ? 'Đang xử lý...' : '✅ Hoàn thành đơn hàng'}
        </Button>
      </View>
    );
  }

  if (status === OrderStatus.Completed || status === OrderStatus.Cancelled) {
    return (
      <View style={styles.actionBar}>
        <Button onPress={() => router.replace('/(main)/orders')} variant="secondary" size="md" fullWidth>
          Đóng
        </Button>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  actionBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 10,
    backgroundColor: 'white',
  },
});
