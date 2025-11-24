import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useWallet } from '../hooks/useWallet';

const WalletScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'income' | 'withdrawal'>('all');
  const {
    wallet,
    transactions,
    loading,
    refreshing,
    error,
    refresh,
  } = useWallet();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredTransactions = transactions.filter(t => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'income') return t.type === 'CREDIT' || t.type === 'REFUND';
    if (selectedTab === 'withdrawal') return t.type === 'DEBIT';
    return true;
  });

  // Tính tổng thu và tổng rút từ transactions
  const totalEarnings = transactions
    .filter(t => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalWithdrawals = transactions
    .filter(t => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0);

  if (error && !wallet) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>⚠️</Text>
        <Text style={{ fontSize: 16, color: '#ef4444', textAlign: 'center', marginBottom: 24 }}>
          {error}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#10b981',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
          onPress={refresh}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={['#10b981']} />
        }
      >
        {/* Balance Card */}
        <View style={{
          backgroundColor: '#10b981',
          margin: 16,
          padding: 20,
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
        }}>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 8 }}>
            💰 Số dư khả dụng
          </Text>
          {wallet ? (
            <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 16 }}>
              {formatCurrency(wallet.balance)}
            </Text>
          ) : (
            <ActivityIndicator size="large" color="#fff" style={{ marginBottom: 16 }} />
          )}

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'white',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, marginBottom: 4 }}>💸</Text>
              <Text style={{ color: '#10b981', fontSize: 13, fontWeight: '600' }}>Rút tiền</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, marginBottom: 4 }}>🔗</Text>
              <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>Liên kết</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 16 }}>
          <View style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}>
            <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>📈 Tổng thu</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#059669' }}>
              {formatCurrency(totalEarnings)}
            </Text>
          </View>

          <View style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}>
            <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>📤 Đã rút</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#3b82f6' }}>
              {formatCurrency(totalWithdrawals)}
            </Text>
          </View>
        </View>

        {/* Transaction History */}
        <View style={{ backgroundColor: 'white', marginHorizontal: 16, borderRadius: 12, marginBottom: 16 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#f3f4f6'
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>
              📊 Lịch sử giao dịch
            </Text>
          </View>

          {/* Filter Tabs */}
          <View style={{ 
            flexDirection: 'row', 
            paddingHorizontal: 16, 
            paddingTop: 12,
            gap: 8
          }}>
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'income', label: 'Thu nhập' },
              { key: 'withdrawal', label: 'Rút tiền' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setSelectedTab(tab.key as any)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selectedTab === tab.key ? '#10b981' : '#f3f4f6',
                }}
              >
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: selectedTab === tab.key ? 'white' : '#6b7280',
                }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Transactions List */}
          <View style={{ paddingTop: 8 }}>
            {loading && filteredTransactions.length === 0 ? (
              <View style={{ padding: 32, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#10b981" />
              </View>
            ) : filteredTransactions.length === 0 ? (
              <View style={{ padding: 32, alignItems: 'center' }}>
                <Text style={{ fontSize: 48, marginBottom: 8 }}>💰</Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>Chưa có giao dịch</Text>
              </View>
            ) : (
              filteredTransactions.map((transaction, index) => {
                const isIncome = transaction.type === 'CREDIT' || transaction.type === 'REFUND';
                const isPending = transaction.status === 'PENDING';
                
                return (
                  <TouchableOpacity
                    key={transaction.id}
                    style={{
                      flexDirection: 'row',
                      padding: 16,
                      borderBottomWidth: index < filteredTransactions.length - 1 ? 1 : 0,
                      borderBottomColor: '#f3f4f6',
                    }}
                  >
                    {/* Icon */}
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: isIncome ? '#d1fae5' : '#dbeafe',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}>
                      <Text style={{ fontSize: 20 }}>
                        {isPending ? '⏳' : transaction.type === 'CREDIT' ? '💰' : transaction.type === 'REFUND' ? '↩️' : '💸'}
                      </Text>
                    </View>

                    {/* Info */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 14, 
                        fontWeight: '600', 
                        color: '#1f2937',
                        marginBottom: 2
                      }}>
                        {transaction.description || `Giao dịch #${transaction.id.slice(0, 8)}`}
                      </Text>
                      {transaction.order_id && (
                        <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 2 }}>
                          Đơn hàng: #{transaction.order_id.slice(0, 8)}
                        </Text>
                      )}
                      <Text style={{ fontSize: 12, color: '#9ca3af' }}>
                        {formatDate(transaction.created_at)}
                      </Text>
                    </View>

                    {/* Amount */}
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: isPending ? '#f59e0b' : isIncome ? '#10b981' : '#3b82f6',
                      }}>
                        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </Text>
                      {isPending && (
                        <Text style={{ fontSize: 10, color: '#f59e0b', marginTop: 2 }}>
                          Chờ xác nhận
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default WalletScreen;
