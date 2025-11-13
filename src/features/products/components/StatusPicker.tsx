import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PRODUCT_STATUSES, ProductStatus } from '../../../common/data/productEnums';

const STATUS_OPTIONS = PRODUCT_STATUSES;

interface StatusPickerProps {
  selectedStatus: ProductStatus | null;
  onSelectStatus: (status: ProductStatus) => void;
}

export const StatusPicker: React.FC<StatusPickerProps> = ({
  selectedStatus,
  onSelectStatus,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Trạng thái sản phẩm</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {STATUS_OPTIONS.map((option) => {
          const isSelected = selectedStatus === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusButton,
                isSelected && {
                  backgroundColor: option.color,
                  borderColor: option.color,
                },
              ]}
              onPress={() => onSelectStatus(option.value)}
            >
              <View style={[
                styles.statusDot,
                { backgroundColor: option.color },
                isSelected && styles.statusDotSelected
              ]} />
              <Text style={[
                styles.statusText,
                isSelected && styles.statusTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {!selectedStatus && (
        <Text style={styles.placeholder}>Chọn trạng thái sản phẩm</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  scrollView: {
    maxHeight: 60,
  },
  scrollContent: {
    paddingVertical: 4,
    gap: 8,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusDotSelected: {
    backgroundColor: '#fff',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  statusTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  placeholder: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
