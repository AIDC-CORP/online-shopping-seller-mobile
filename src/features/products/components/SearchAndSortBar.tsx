import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

type SortType = 'default' | 'expiryDate' | 'stock' | 'price' | 'name' | 'sold';

interface SearchAndSortBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
}

const SearchAndSortBar: React.FC<SearchAndSortBarProps> = ({
  searchQuery,
  onSearchChange,
  sortType,
  onSortChange,
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
      {/* Search Input */}
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
      </View>

      {/* Sort Button */}
      <TouchableOpacity
        onPress={() => setShowSortMenu(!showSortMenu)}
        style={{
          backgroundColor: sortType !== 'default' ? '#dbeafe' : '#f3f4f6',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          height: 38,
        }}
      >
        <Text style={{ fontSize: 16 }}>⇅</Text>
        <Text style={{ 
          fontSize: 13, 
          fontWeight: '600', 
          color: sortType !== 'default' ? '#2563eb' : '#6b7280',
        }}>
          {sortType !== 'default' ? 'ON' : 'Sort'}
        </Text>
      </TouchableOpacity>

      {/* Sort Menu Dropdown */}
      {showSortMenu && (
        <View style={{
          position: 'absolute',
          top: 58,
          right: 12,
          backgroundColor: 'white',
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
          zIndex: 1000,
          minWidth: 180,
        }}>
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
