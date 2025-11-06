import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface AddOptionMenuProps {
  visible: boolean;
  onClose: () => void;
  onSelectProduct: () => void;
  onSelectCombo: () => void;
  onSelectVoucher: () => void;
  showProduct?: boolean;
  showCombo?: boolean;
  showVoucher?: boolean;
}

const AddOptionMenu: React.FC<AddOptionMenuProps> = ({
  visible,
  onClose,
  onSelectProduct,
  onSelectCombo,
  onSelectVoucher,
  showProduct = true,
  showCombo = true,
  showVoucher = true,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            width: '85%',
            paddingVertical: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>
              Chọn loại để thêm
            </Text>
          </View>

          {/* Option 1: Sản phẩm */}
          {showProduct && (
            <TouchableOpacity
              onPress={() => {
                onClose();
                onSelectProduct();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 18,
                borderBottomWidth: 1,
                borderBottomColor: '#f3f4f6',
              }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#dbeafe',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}
              >
                <Text style={{ fontSize: 24 }}>📦</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 }}>
                  Sản phẩm mới
                </Text>
                <Text style={{ fontSize: 13, color: '#6b7280' }}>
                  Thêm sản phẩm thông thường vào kệ
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Option 2: Combo */}
          {showCombo && (
            <TouchableOpacity
            onPress={() => {
              onClose();
              onSelectCombo();
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 18,
              borderBottomWidth: 1,
              borderBottomColor: '#f3f4f6',
            }}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#fed7aa',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <Text style={{ fontSize: 24 }}>🎁</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 }}>
                Tạo Combo
              </Text>
              <Text style={{ fontSize: 13, color: '#6b7280' }}>
                Gộp nhiều sản phẩm với giá ưu đãi
              </Text>
            </View>
            </TouchableOpacity>
          )}

          {/* Option 3: Voucher */}
          {showVoucher && (
            <TouchableOpacity
            onPress={() => {
              onClose();
              onSelectVoucher();
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 18,
            }}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#d1fae5',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <Text style={{ fontSize: 24 }}>🎟️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 }}>
                Tạo Voucher
              </Text>
              <Text style={{ fontSize: 13, color: '#6b7280' }}>
                Tạo mã giảm giá cho khách hàng
              </Text>
            </View>
            </TouchableOpacity>
          )}

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              marginTop: 8,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 15, color: '#9ca3af', fontWeight: '500' }}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default AddOptionMenu;
