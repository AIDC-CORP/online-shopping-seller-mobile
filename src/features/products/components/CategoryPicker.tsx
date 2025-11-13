import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';

export interface Category {
  value: string;
  label: string;
  icon?: string;
}

export const PRODUCT_CATEGORIES: Category[] = [
  { value: 'rau củ', label: 'Rau củ', icon: '🥬' },
  { value: 'thịt', label: 'Thịt', icon: '🥩' },
  { value: 'trái cây', label: 'Trái cây', icon: '🍎' },
  { value: 'sữa', label: 'Sữa', icon: '🥛' },
  { value: 'đồ uống', label: 'Đồ uống', icon: '🥤' },
  { value: 'đồ ăn vặt', label: 'Đồ ăn vặt', icon: '🍿' },
  { value: 'hải sản', label: 'Hải sản', icon: '🦐' },
  { value: 'gạo & ngũ cốc', label: 'Gạo & Ngũ cốc', icon: '🌾' },
  { value: 'gia vị', label: 'Gia vị', icon: '🧂' },
  { value: 'đồ đông lạnh', label: 'Đồ đông lạnh', icon: '🧊' },
  { value: 'khác', label: 'Khác', icon: '📦' },
];

interface CategoryPickerProps {
  selectedValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedValue,
  onValueChange,
  placeholder = 'Chọn danh mục',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedCategory = PRODUCT_CATEGORIES.find(
    (cat) => cat.value === selectedValue
  );

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
        {selectedCategory ? (
          <View style={styles.selectedContent}>
            <Text style={styles.icon}>{selectedCategory.icon}</Text>
            <Text style={styles.selectedText}>{selectedCategory.label}</Text>
          </View>
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
              <Text style={styles.modalTitle}>Chọn danh mục sản phẩm</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
              {PRODUCT_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.categoryItem,
                    selectedValue === category.value && styles.selectedItem,
                  ]}
                  onPress={() => handleSelect(category.value)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedValue === category.value &&
                        styles.selectedItemText,
                    ]}
                  >
                    {category.label}
                  </Text>
                  {selectedValue === category.value && (
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
  selectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 20,
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
    maxHeight: '70%',
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
    maxHeight: 400,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  selectedItem: {
    backgroundColor: '#ecfdf5',
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
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
