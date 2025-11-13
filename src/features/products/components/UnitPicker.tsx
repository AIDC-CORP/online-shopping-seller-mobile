import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';

export interface Unit {
  value: string;
  label: string;
}

export const PRODUCT_UNITS: Unit[] = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'túi', label: 'Túi' },
  { value: 'bó', label: 'Bó' },
  { value: 'hộp', label: 'Hộp' },
  { value: 'chai', label: 'Chai' },
  { value: 'lon', label: 'Lon' },
  { value: 'cái', label: 'Cái' },
  { value: 'gói', label: 'Gói' },
  { value: 'thùng', label: 'Thùng' },
  { value: 'khác', label: 'Khác' },
];

interface UnitPickerProps {
  selectedValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export const UnitPicker: React.FC<UnitPickerProps> = ({
  selectedValue,
  onValueChange,
  placeholder = 'Chọn đơn vị',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedUnit = PRODUCT_UNITS.find((unit) => unit.value === selectedValue);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        {selectedUnit ? (
          <Text style={styles.selectedText}>{selectedUnit.label}</Text>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn đơn vị tính</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
              {PRODUCT_UNITS.map((unit) => (
                <TouchableOpacity
                  key={unit.value}
                  style={[
                    styles.unitItem,
                    selectedValue === unit.value && styles.selectedItem,
                  ]}
                  onPress={() => handleSelect(unit.value)}
                >
                  <Text
                    style={[
                      styles.unitLabel,
                      selectedValue === unit.value && styles.selectedItemText,
                    ]}
                  >
                    {unit.label}
                  </Text>
                  {selectedValue === unit.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    minHeight: 50,
  },
  selectedText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  placeholder: {
    fontSize: 16,
    color: '#9ca3af',
  },
  arrow: {
    fontSize: 12,
    color: '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '85%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6b7280',
  },
  scrollView: {
    maxHeight: 300,
  },
  unitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedItem: {
    backgroundColor: '#ecfdf5',
  },
  unitLabel: {
    fontSize: 16,
    color: '#374151',
  },
  selectedItemText: {
    fontWeight: '600',
    color: '#059669',
  },
  checkmark: {
    fontSize: 20,
    color: '#059669',
    fontWeight: 'bold',
  },
});
