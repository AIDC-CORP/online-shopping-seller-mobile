import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrderDetail } from '../hooks/useOrderDetail';
import { OrderDetailInfo } from '../components/OrderDetailInfo';
import { OrderDetailActions } from '../components/OrderDetailActions';

const OrderDetailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const {
    order,
    loading,
    error,
    actionLoading,
    handleAccept,
    handleReject,
    handleShip,
    handleComplete,
  } = useOrderDetail(params.orderId);

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error || 'Không tìm thấy đơn hàng'}</Text>
          <TouchableOpacity onPress={() => router.replace('/(main)/orders')}>
            <Text style={styles.backLink}>← Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(main)/orders')} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <OrderDetailInfo order={order} />
        {/* Debug: Show current status */}
        <Text style={{ padding: 10, fontSize: 12, color: '#666' }}>
          Debug - Current status: {order.status}
        </Text>
      </ScrollView>

      {/* Action Buttons */}
      <OrderDetailActions
        status={order.status}
        actionLoading={actionLoading}
        onAccept={handleAccept}
        onReject={handleReject}
        onShip={handleShip}
        onComplete={handleComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  backLink: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
  },
});

export default OrderDetailScreen;
