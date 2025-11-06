import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock wallet data
const mockWalletData = {
  balance: 45800000, // 45.8M VND
  pendingBalance: 12500000, // 12.5M VND (from pending orders)
  totalEarnings: 125000000, // 125M VND
  totalWithdrawals: 79200000, // 79.2M VND
};

// Mock transaction history
const mockTransactions = [
  { id: 't1', type: 'income', amount: 2500000, description: 'Đơn hàng #o123', date: '2024-11-06 14:30', status: 'completed' },
  { id: 't2', type: 'income', amount: 1200000, description: 'Đơn hàng #o124', date: '2024-11-06 10:15', status: 'completed' },
  { id: 't3', type: 'withdrawal', amount: -5000000, description: 'Rút tiền về VCB *1234', date: '2024-11-05 16:20', status: 'completed' },
  { id: 't4', type: 'income', amount: 850000, description: 'Đơn hàng #o125', date: '2024-11-05 09:45', status: 'completed' },
  { id: 't5', type: 'pending', amount: 3200000, description: 'Đơn hàng #o126 (Chờ xác nhận)', date: '2024-11-04 18:00', status: 'pending' },
];

const WalletScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'income' | 'withdrawal'>('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const filteredTransactions = mockTransactions.filter(t => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'income') return t.type === 'income' || t.type === 'pending';
    if (selectedTab === 'withdrawal') return t.type === 'withdrawal';
    return true;
  });

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50">
      <ScrollView>
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
          <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 16 }}>
            {formatCurrency(mockWalletData.balance)}
          </Text>
          
          <View style={{ 
            flexDirection: 'row', 
            backgroundColor: 'rgba(255,255,255,0.15)', 
            padding: 12, 
            borderRadius: 8,
            marginBottom: 16
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 4 }}>
                ⏳ Chờ thanh toán
              </Text>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                {formatCurrency(mockWalletData.pendingBalance)}
              </Text>
            </View>
          </View>

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
              {formatCurrency(mockWalletData.totalEarnings)}
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
              {formatCurrency(mockWalletData.totalWithdrawals)}
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
            {filteredTransactions.map((transaction, index) => {
              const isIncome = transaction.type === 'income' || transaction.type === 'pending';
              const isPending = transaction.type === 'pending';
              
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
                      {isPending ? '⏳' : isIncome ? '💰' : '💸'}
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
                      {transaction.description}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#9ca3af' }}>
                      {transaction.date}
                    </Text>
                  </View>

                  {/* Amount */}
                  <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: isPending ? '#f59e0b' : isIncome ? '#10b981' : '#3b82f6',
                    }}>
                      {isIncome ? '+' : ''}{formatCurrency(transaction.amount)}
                    </Text>
                    {isPending && (
                      <Text style={{ fontSize: 10, color: '#f59e0b', marginTop: 2 }}>
                        Chờ xác nhận
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletScreen;
