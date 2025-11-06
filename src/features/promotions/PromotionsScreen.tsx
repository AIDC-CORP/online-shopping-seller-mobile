import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Combo, Voucher } from '../../shared/types';
import { mockCombos, mockVouchers, mockProducts } from '../../shared/data/mockData';
import AddOptionMenu from '../products/components/AddOptionMenu';
import AddCombo from '../products/components/AddCombo';
import AddVoucher from '../products/components/AddVoucher';

type TabType = 'combos' | 'vouchers' | 'flashsales';

const PromotionsScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('combos');
  const [combos, setCombos] = useState<Combo[]>(mockCombos);
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isAddingCombo, setIsAddingCombo] = useState(false);
  const [isAddingVoucher, setIsAddingVoucher] = useState(false);

  const handleAddCombo = (combo: Omit<Combo, 'id' | 'createdAt'>) => {
    const newCombo: Combo = {
      ...combo,
      id: `combo${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCombos([newCombo, ...combos]);
    Alert.alert('Thành công', 'Đã tạo combo mới!');
  };

  const handleAddVoucher = (voucher: Omit<Voucher, 'id' | 'usedCount' | 'createdAt'>) => {
    const newVoucher: Voucher = {
      ...voucher,
      id: `voucher${Date.now()}`,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setVouchers([newVoucher, ...vouchers]);
    Alert.alert('Thành công', 'Đã tạo voucher mới!');
  };

  const handleDeleteCombo = (comboId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xoá combo này?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => setCombos(combos.filter(c => c.id !== comboId)),
        },
      ]
    );
  };

  const handleDeleteVoucher = (voucherId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xoá voucher này?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => setVouchers(vouchers.filter(v => v.id !== voucherId)),
        },
      ]
    );
  };

  const toggleVoucherActive = (voucherId: string) => {
    setVouchers(vouchers.map(v => 
      v.id === voucherId ? { ...v, isActive: !v.isActive } : v
    ));
  };

  // Stats
  const activeCombos = combos.filter(c => {
    const now = new Date();
    const validUntil = c.validUntil ? new Date(c.validUntil) : null;
    return c.stock > 0 && (!validUntil || validUntil > now);
  }).length;

  const activeVouchers = vouchers.filter(v => v.isActive && v.usedCount < v.usageLimit).length;

  const renderTabButton = (tab: TabType, icon: string, label: string) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      style={{
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: activeTab === tab ? '#10b981' : 'transparent',
        backgroundColor: activeTab === tab ? '#ecfdf5' : 'white',
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 4 }}>{icon}</Text>
      <Text
        style={{
          fontSize: 13,
          fontWeight: activeTab === tab ? '600' : '400',
          color: activeTab === tab ? '#10b981' : '#6b7280',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderComboCard = (combo: Combo) => {
    const isExpired = combo.validUntil && new Date(combo.validUntil) < new Date();
    const isLowStock = combo.stock < 5;
    const isOutOfStock = combo.stock === 0;

    return (
      <View
        key={combo.id}
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 }}>
              🎁 {combo.name}
            </Text>
            <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
              {combo.description}
            </Text>
          </View>
        </View>

        {/* Price */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 14,
              color: '#9ca3af',
              textDecorationLine: 'line-through',
              marginRight: 8,
            }}
          >
            {combo.originalPrice.toLocaleString('vi-VN')}đ
          </Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#059669', marginRight: 8 }}>
            {combo.comboPrice.toLocaleString('vi-VN')}đ
          </Text>
          <View style={{ backgroundColor: '#fee2e2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#dc2626' }}>
              -{combo.discountPercent}%
            </Text>
          </View>
        </View>

        {/* Stock & Sold */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 13, color: '#6b7280' }}>
            Còn: <Text style={{ fontWeight: '600', color: isOutOfStock ? '#dc2626' : isLowStock ? '#f59e0b' : '#059669' }}>
              {combo.stock}
            </Text>
          </Text>
          <Text style={{ fontSize: 13, color: '#6b7280', marginLeft: 16 }}>
            Đã bán: <Text style={{ fontWeight: '600', color: '#1f2937' }}>{combo.sold}</Text>
          </Text>
        </View>

        {/* Valid period */}
        <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>
          Hết hạn: {combo.validUntil || 'Không giới hạn'}
        </Text>

        {/* Status badges */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {isOutOfStock && (
            <View style={{ backgroundColor: '#fee2e2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontSize: 11, color: '#dc2626', fontWeight: '600' }}>Hết hàng</Text>
            </View>
          )}
          {!isOutOfStock && isLowStock && (
            <View style={{ backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontSize: 11, color: '#d97706', fontWeight: '600' }}>Sắp hết</Text>
            </View>
          )}
          {isExpired && (
            <View style={{ backgroundColor: '#e5e7eb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontSize: 11, color: '#6b7280', fontWeight: '600' }}>Hết hạn</Text>
            </View>
          )}
          {!isExpired && !isOutOfStock && (
            <View style={{ backgroundColor: '#d1fae5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontSize: 11, color: '#059669', fontWeight: '600' }}>Đang chạy</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#dbeafe',
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1e40af' }}>✏️ Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteCombo(combo.id)}
            style={{
              flex: 1,
              backgroundColor: '#fee2e2',
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#dc2626' }}>🗑️ Xoá</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderVoucherCard = (voucher: Voucher) => {
    const usagePercent = (voucher.usedCount / voucher.usageLimit) * 100;
    const isFullyUsed = voucher.usedCount >= voucher.usageLimit;
    const isExpired = new Date(voucher.validUntil) < new Date();

    return (
      <View
        key={voucher.id}
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        {/* Header with code */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <View
            style={{
              backgroundColor: voucher.isActive ? '#dbeafe' : '#f3f4f6',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: voucher.isActive ? '#3b82f6' : '#d1d5db',
              borderStyle: 'dashed',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: voucher.isActive ? '#1e40af' : '#6b7280',
                letterSpacing: 1,
              }}
            >
              🎟️ {voucher.code}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleVoucherActive(voucher.id)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              backgroundColor: voucher.isActive ? '#dcfce7' : '#f3f4f6',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: voucher.isActive ? '#059669' : '#6b7280',
              }}
            >
              {voucher.isActive ? '✓ Đang bật' : '○ Đã tắt'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
          {voucher.description}
        </Text>

        {/* Discount value */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#dc2626', marginRight: 4 }}>
            {voucher.discountType === 'percent' ? `-${voucher.discountValue}%` : `-${voucher.discountValue.toLocaleString('vi-VN')}đ`}
          </Text>
          {voucher.discountType === 'percent' && voucher.maxDiscount && (
            <Text style={{ fontSize: 12, color: '#6b7280' }}>
              (tối đa {voucher.maxDiscount.toLocaleString('vi-VN')}đ)
            </Text>
          )}
        </View>

        {/* Conditions */}
        {voucher.minOrderValue && (
          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
            Đơn tối thiểu: {voucher.minOrderValue.toLocaleString('vi-VN')}đ
          </Text>
        )}

        {/* Usage progress */}
        <View style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Đã sử dụng</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#1f2937' }}>
              {voucher.usedCount}/{voucher.usageLimit}
            </Text>
          </View>
          <View style={{ height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
            <View
              style={{
                width: `${usagePercent}%`,
                height: '100%',
                backgroundColor: isFullyUsed ? '#ef4444' : '#10b981',
              }}
            />
          </View>
        </View>

        {/* Valid period */}
        <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>
          Hết hạn: {voucher.validUntil}
        </Text>

        {/* Status badges */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {isFullyUsed && (
            <View style={{ backgroundColor: '#fee2e2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontSize: 11, color: '#dc2626', fontWeight: '600' }}>Đã hết lượt</Text>
            </View>
          )}
          {isExpired && (
            <View style={{ backgroundColor: '#e5e7eb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontSize: 11, color: '#6b7280', fontWeight: '600' }}>Hết hạn</Text>
            </View>
          )}
          {!isExpired && !isFullyUsed && voucher.isActive && (
            <View style={{ backgroundColor: '#d1fae5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontSize: 11, color: '#059669', fontWeight: '600' }}>Đang hoạt động</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#dbeafe',
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1e40af' }}>✏️ Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteVoucher(voucher.id)}
            style={{
              flex: 1,
              backgroundColor: '#fee2e2',
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#dc2626' }}>🗑️ Xoá</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFlashSaleContent = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
      <Text style={{ fontSize: 60, marginBottom: 16 }}>⚡</Text>
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 8, textAlign: 'center' }}>
        Flash Sale
      </Text>
      <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>
        Tính năng đang được phát triển. Bạn sẽ có thể tạo flash sale với giờ giới hạn và giảm giá sâu.
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#f3f4f6',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
        }}
        disabled
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#9ca3af' }}>
          Sắp ra mắt
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['bottom']}>
      {/* Header */}
      <View
        style={{
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        }}
      >
        <View style={{ padding: 16, paddingTop: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 }}>
             Giảm Giá
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            Quản lý combos, vouchers và flash sales
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 18 }}>
            <Text style={{ fontSize: 13, color: '#6b7280', marginRight: 6 }}>Combos:</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}>
              {activeCombos}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: '#6b7280', marginRight: 6 }}>Vouchers:</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#3b82f6' }}>
              {activeVouchers}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: '#6b7280', marginRight: 6 }}>Flash Sales:</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#f59e0b', marginRight: 6}}>
              0
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
        {renderTabButton('combos', '🎁', 'Combos')}
        {renderTabButton('vouchers', '🎟️', 'Vouchers')}
        {renderTabButton('flashsales', '⚡', 'Flash Sales')}
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {activeTab === 'combos' && (
          <>
            {combos.length === 0 ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>🎁</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#6b7280', marginBottom: 4 }}>
                  Chưa có combo nào
                </Text>
                <Text style={{ fontSize: 14, color: '#9ca3af' }}>
                  Tạo combo để tăng doanh số!
                </Text>
              </View>
            ) : (
              combos.map(renderComboCard)
            )}
          </>
        )}

        {activeTab === 'vouchers' && (
          <>
            {vouchers.length === 0 ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>🎟️</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#6b7280', marginBottom: 4 }}>
                  Chưa có voucher nào
                </Text>
                <Text style={{ fontSize: 14, color: '#9ca3af' }}>
                  Tạo voucher để thu hút khách hàng!
                </Text>
              </View>
            ) : (
              vouchers.map(renderVoucherCard)
            )}
          </>
        )}

        {activeTab === 'flashsales' && renderFlashSaleContent()}
      </ScrollView>

      {/* Floating Add Button */}
      {activeTab !== 'flashsales' && (
        <TouchableOpacity
          onPress={() => setShowAddMenu(true)}
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#10b981',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 8,
          }}
        >
          <Text style={{ fontSize: 28, color: 'white' }}>+</Text>
        </TouchableOpacity>
      )}

      {/* Modals */}
      <AddOptionMenu
        visible={showAddMenu}
        onClose={() => setShowAddMenu(false)}
        onSelectProduct={() => {
          setShowAddMenu(false);
          Alert.alert('Thông báo', 'Để thêm sản phẩm, vui lòng vào tab Sản phẩm');
        }}
        onSelectCombo={() => {
          setShowAddMenu(false);
          setIsAddingCombo(true);
        }}
        onSelectVoucher={() => {
          setShowAddMenu(false);
          setIsAddingVoucher(true);
        }}
        showProduct={false}
        showCombo={true}
        showVoucher={true}
      />

      <AddCombo
        visible={isAddingCombo}
        onClose={() => setIsAddingCombo(false)}
        onAddCombo={handleAddCombo}
        products={mockProducts}
      />

      <AddVoucher
        visible={isAddingVoucher}
        onClose={() => setIsAddingVoucher(false)}
        onAddVoucher={handleAddVoucher}
      />
    </SafeAreaView>
  );
};

export default PromotionsScreen;
