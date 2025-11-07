import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Voucher } from '../../../shared/types';

interface AddVoucherProps {
  visible: boolean;
  onClose: () => void;
  onAddVoucher: (voucher: Omit<Voucher, 'id' | 'usedCount' | 'createdAt'>) => void;
}

const AddVoucher: React.FC<AddVoucherProps> = ({ visible, onClose, onAddVoucher }) => {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const handleSubmit = () => {
    if (!code.trim()) {
      alert('Vui lòng nhập mã voucher');
      return;
    }
    if (!description.trim()) {
      alert('Vui lòng nhập mô tả');
      return;
    }
    if (!discountValue) {
      alert('Vui lòng nhập giá trị giảm');
      return;
    }
    if (!usageLimit) {
      alert('Vui lòng nhập số lượng voucher');
      return;
    }
    if (!validFrom || !validUntil) {
      alert('Vui lòng nhập thời gian hiệu lực');
      return;
    }

    const newVoucher: Omit<Voucher, 'id' | 'usedCount' | 'createdAt'> = {
      code: code.trim().toUpperCase(),
      description: description.trim(),
      discountType,
      discountValue: parseInt(discountValue),
      minOrderValue: minOrderValue ? parseInt(minOrderValue) : undefined,
      maxDiscount: discountType === 'percent' && maxDiscount ? parseInt(maxDiscount) : undefined,
      usageLimit: parseInt(usageLimit),
      validFrom,
      validUntil,
      isActive: true,
    };

    onAddVoucher(newVoucher);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setCode('');
    setDescription('');
    setDiscountType('percent');
    setDiscountValue('');
    setMinOrderValue('');
    setMaxDiscount('');
    setUsageLimit('');
    setValidFrom('');
    setValidUntil('');
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['bottom']}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            paddingTop: 50,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <Text style={{ fontSize: 16, color: '#ef4444' }}>Hủy</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}>🎟️ Tạo Voucher</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={{ fontSize: 16, color: '#10b981', fontWeight: '600' }}>Lưu</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            {/* Mã voucher */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                Mã Voucher *
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                value={code}
                onChangeText={(text) => setCode(text.toUpperCase())}
                placeholder="VD: FRESH50"
                autoCapitalize="characters"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 15,
                  color: '#1f2937',
                  fontWeight: '600',
                }}
              />
              <TouchableOpacity
                onPress={generateRandomCode}
                style={{
                  backgroundColor: '#f3f4f6',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 20 }}>🎲</Text>
              </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                Bấm 🎲 để tạo mã ngẫu nhiên
              </Text>
            </View>

            {/* Mô tả */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                Mô tả *
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="VD: Giảm 50,000đ cho đơn hàng từ 200,000đ"
                multiline
                numberOfLines={2}
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 15,
                  color: '#1f2937',
                  textAlignVertical: 'top',
                }}
              />
            </View>

            {/* Loại giảm giá */}
            <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Loại giảm giá *
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setDiscountType('percent')}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: discountType === 'percent' ? '#10b981' : '#d1d5db',
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: discountType === 'percent' ? '#d1fae5' : 'white',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 24, marginBottom: 4 }}>%</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }}>Phần trăm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDiscountType('fixed')}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: discountType === 'fixed' ? '#10b981' : '#d1d5db',
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: discountType === 'fixed' ? '#d1fae5' : 'white',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 24, marginBottom: 4 }}>đ</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }}>Số tiền cố định</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Giá trị giảm */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Giá trị giảm * {discountType === 'percent' ? '(%)' : '(đ)'}
            </Text>
            <TextInput
              value={discountValue}
              onChangeText={setDiscountValue}
              placeholder={discountType === 'percent' ? 'VD: 20 (= 20%)' : 'VD: 50000'}
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 15,
                color: '#1f2937',
              }}
            />
          </View>

          {/* Điều kiện áp dụng */}
          <View
            style={{
              backgroundColor: '#eff6ff',
              padding: 16,
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1e40af', marginBottom: 12 }}>
              📋 Điều kiện áp dụng
            </Text>

            {/* Đơn hàng tối thiểu */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: '#1e3a8a', marginBottom: 6 }}>
                Giá trị đơn hàng tối thiểu (đ)
              </Text>
              <TextInput
                value={minOrderValue}
                onChangeText={setMinOrderValue}
                placeholder="VD: 200000 (tuỳ chọn)"
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: '#bfdbfe',
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 14,
                  backgroundColor: 'white',
                  color: '#1f2937',
                }}
              />
            </View>

            {/* Giảm tối đa (chỉ cho %) */}
            {discountType === 'percent' && (
              <View>
                <Text style={{ fontSize: 13, color: '#1e3a8a', marginBottom: 6 }}>
                  Giảm tối đa (đ)
                </Text>
                <TextInput
                  value={maxDiscount}
                  onChangeText={setMaxDiscount}
                  placeholder="VD: 100000 (tuỳ chọn)"
                  keyboardType="numeric"
                  style={{
                    borderWidth: 1,
                    borderColor: '#bfdbfe',
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 14,
                    backgroundColor: 'white',
                    color: '#1f2937',
                  }}
                />
              </View>
            )}
          </View>

          {/* Số lượng voucher */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Số lượng voucher *
            </Text>
            <TextInput
              value={usageLimit}
              onChangeText={setUsageLimit}
              placeholder="VD: 100"
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 15,
                color: '#1f2937',
              }}
            />
            <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
              Số lần voucher này có thể được sử dụng
            </Text>
          </View>

          {/* Thời gian hiệu lực */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Thời gian hiệu lực *
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Từ ngày</Text>
                <TextInput
                  value={validFrom}
                  onChangeText={setValidFrom}
                  placeholder="2025-11-01"
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 14,
                    color: '#1f2937',
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Đến ngày</Text>
                <TextInput
                  value={validUntil}
                  onChangeText={setValidUntil}
                  placeholder="2025-12-31"
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 14,
                    color: '#1f2937',
                  }}
                />
              </View>
            </View>
          </View>

          {/* Preview voucher */}
          {code && discountValue && (
            <View
              style={{
                backgroundColor: '#10b981',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>
                🎟️ {code}
              </Text>
              <Text style={{ fontSize: 14, color: '#d1fae5', marginBottom: 12 }}>
                {description || 'Mô tả voucher sẽ hiển thị ở đây'}
              </Text>
              <View
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                  {discountType === 'percent' 
                    ? `-${discountValue}%`
                    : `-${parseInt(discountValue).toLocaleString('vi-VN')}đ`
                  }
                </Text>
              </View>
            </View>
          )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default AddVoucher;
