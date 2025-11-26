import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { XCircleIcon } from '../../../components/icons';
import Button from '../../../components/common/button';

interface RejectReasonModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({ visible, onClose, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const predefinedReasons = [
    'Hết hàng',
    'Không liên lạc được khách hàng',
    'Địa chỉ giao hàng quá xa',
    'Khách hàng yêu cầu hủy',
    'Khác',
  ];

  const handleConfirm = () => {
    const reason = selectedReason === 'Khác' ? customReason : selectedReason;
    if (reason.trim()) {
      onConfirm(reason);
      setSelectedReason('');
      setCustomReason('');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 16, width: '100%', maxWidth: 400 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1f2937' }}>Lý do từ chối</Text>
            <TouchableOpacity onPress={onClose}>
              <XCircleIcon width={24} height={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
              Vui lòng chọn lý do từ chối đơn hàng này:
            </Text>

            {/* Predefined Reasons */}
            <View style={{ gap: 10, marginBottom: 16 }}>
              {predefinedReasons.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  onPress={() => setSelectedReason(reason)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 14,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: selectedReason === reason ? '#ef4444' : '#e5e7eb',
                    backgroundColor: selectedReason === reason ? '#fee2e2' : 'white',
                  }}
                >
                  <View style={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: 10, 
                    borderWidth: 2,
                    borderColor: selectedReason === reason ? '#ef4444' : '#d1d5db',
                    backgroundColor: selectedReason === reason ? '#ef4444' : 'white',
                    marginRight: 12,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {selectedReason === reason && (
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'white' }} />
                    )}
                  </View>
                  <Text style={{ 
                    fontSize: 14, 
                    fontWeight: selectedReason === reason ? '600' : '400',
                    color: selectedReason === reason ? '#991b1b' : '#4b5563'
                  }}>
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Reason Input */}
            {selectedReason === 'Khác' && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Nhập lý do cụ thể:
                </Text>
                <TextInput
                  value={customReason}
                  onChangeText={setCustomReason}
                  placeholder="Nhập lý do..."
                  multiline
                  numberOfLines={3}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 14,
                    color: '#1f2937',
                    minHeight: 80,
                    textAlignVertical: 'top'
                  }}
                />
              </View>
            )}

            {/* Action Buttons */}
            <View style={{ gap: 10 }}>
              <Button 
                onPress={handleConfirm}
                variant="danger" 
                size="md" 
                fullWidth
                disabled={!selectedReason || (selectedReason === 'Khác' && !customReason.trim())}
              >
                Xác nhận từ chối
              </Button>
              <Button onPress={onClose} variant="secondary" size="md" fullWidth>
                Hủy
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
