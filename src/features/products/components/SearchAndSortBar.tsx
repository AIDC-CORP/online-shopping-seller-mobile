import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

type SortType = 'default' | 'expiryDate' | 'stock' | 'price' | 'name' | 'sold';

interface SearchAndSortBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
  isSelectionMode: boolean;
  onToggleSelectionMode: () => void;
  selectedCount?: number;
}

const SearchAndSortBar: React.FC<SearchAndSortBarProps> = ({
  searchQuery,
  onSearchChange,
  sortType,
  onSortChange,
  isSelectionMode,
  onToggleSelectionMode,
  selectedCount = 0,
}) => {
  const [showSortMenu, setShowSortMenu] = React.useState(false);

  const sortOptions = [
    { type: 'default' as SortType, label: '🔄 Mặc định' },
    { type: 'expiryDate' as SortType, label: '📅 Sắp hết hạn' },
    { type: 'stock' as SortType, label: '📦 Tồn kho thấp' },
    { type: 'sold' as SortType, label: '🔥 Bán chạy' },
    { type: 'price' as SortType, label: '💰 Giá cao → thấp' },
    { type: 'name' as SortType, label: '🔤 Tên A-Z' },
  ];

  const currentSort = sortOptions.find(o => o.type === sortType);

  return (
    <View style={{ 
      flexDirection: 'row', 
      paddingHorizontal: 12, 
      paddingTop: 12, 
      paddingBottom: 8,
      gap: 8,
      alignItems: 'center',
      backgroundColor: 'white',
    }}>
      {/* Search Input with Sort Dropdown */}
      <View style={{ 
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 38,
      }}>
        <Text style={{ fontSize: 16, color: '#9ca3af', marginRight: 6 }}>🔍</Text>
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Tìm sản phẩm..."
          placeholderTextColor="#9ca3af"
          style={{
            flex: 1,
            fontSize: 14,
            color: '#1f2937',
            padding: 0,
          }}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')} style={{ padding: 4 }}>
            <Text style={{ fontSize: 16, color: '#6b7280' }}>✕</Text>
          </TouchableOpacity>
        )}
        
        {/* Sort Button inside search bar */}
        <View style={{ 
          height: 24, 
          width: 1, 
          backgroundColor: '#d1d5db', 
          marginHorizontal: 8 
        }} />
        <TouchableOpacity
          onPress={() => setShowSortMenu(!showSortMenu)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingVertical: 4,
            paddingLeft: 4,
          }}
        >
          <Text style={{ fontSize: 14 }}>⇅</Text>
          <Text style={{ 
            fontSize: 12, 
            fontWeight: '500', 
            color: sortType !== 'default' ? '#2563eb' : '#6b7280',
            maxWidth: 80,
          }} numberOfLines={1}>
            {sortType !== 'default' ? currentSort?.label.split(' ')[1] : 'Sắp xếp'}
          </Text>
          <Text style={{ fontSize: 10, color: '#9ca3af' }}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Selection Mode Button */}
      <TouchableOpacity
        onPress={onToggleSelectionMode}
        style={{
          backgroundColor: isSelectionMode ? '#dbeafe' : '#f3f4f6',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          height: 38,
          borderWidth: isSelectionMode ? 1 : 0,
          borderColor: '#3b82f6',
        }}
      >
        <Text style={{ fontSize: 16 }}>{isSelectionMode ? '✓' : '☐'}</Text>
        <Text style={{ 
          fontSize: 13, 
          fontWeight: '600', 
          color: isSelectionMode ? '#2563eb' : '#6b7280',
        }}>
          {isSelectionMode ? (selectedCount > 0 ? `${selectedCount}` : 'Chọn') : 'Chọn'}
        </Text>
      </TouchableOpacity>

      {/* Sort Menu Dropdown */}
      {showSortMenu && (
        <View style={{
          position: 'absolute',
          top: 58,
          right: 80,
          backgroundColor: 'white',
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 6,
          zIndex: 1000,
          minWidth: 180,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}>
          <View style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
            backgroundColor: '#f9fafb',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#374151' }}>
              Sắp xếp theo
            </Text>
          </View>
          {sortOptions.map((option, index) => (
            <TouchableOpacity
              key={option.type}
              onPress={() => {
                onSortChange(option.type);
                setShowSortMenu(false);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderBottomWidth: index < sortOptions.length - 1 ? 1 : 0,
                borderBottomColor: '#f3f4f6',
                backgroundColor: sortType === option.type ? '#eff6ff' : 'transparent',
              }}
            >
              <Text style={{ 
                fontSize: 13, 
                color: sortType === option.type ? '#2563eb' : '#1f2937',
                fontWeight: sortType === option.type ? '600' : '400',
              }}>
                {option.label}
              </Text>
              {sortType === option.type && (
                <Text style={{ fontSize: 14, color: '#2563eb' }}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default SearchAndSortBar;
