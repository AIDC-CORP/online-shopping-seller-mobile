import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { PlusIcon } from '../../../components/icons';
import FloatingButton from '../../../components/common/FloatingButton';
import { useStoreId } from '../../store/hooks/useStoreId';
import { ProductsService } from '../../../services/products';

// Components
import ProductListCard from '../components/ProductListCard';
import ProductStats from '../components/ProductStats';
import SearchAndSortBar from '../components/SearchAndSortBar';
import AddProduct from '../components/AddProduct';
import AddOptionMenu from '../components/AddOptionMenu';
import ImportExcel from '../components/ImportExcel';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  imageUrl: string;
  sold?: number;
  expiryDate?: string;
  category?: string;
  description?: string;
  importDate?: string;
  status?: string;
}

type FilterType = 'all' | 'inStock' | 'lowStock' | 'outOfStock';
type SortType = 'default' | 'expiryDate' | 'stock' | 'price' | 'name' | 'sold';

// Helper function
const getDaysUntilExpiry = (expiryDate?: string): number | null => {
  if (!expiryDate) return null;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const ProductsScreen: React.FC = () => {
  const { storeId, isLoading: isLoadingStoreId } = useStoreId();
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showImportExcel, setShowImportExcel] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('default');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    if (!storeId) return;
    
    try {
      setIsLoadingProducts(true);
      const result = await ProductsService.getProductsByStoreId(storeId, 1, 100);
      
      const uiProducts: Product[] = result.products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || undefined,
        category: p.category,
        price: p.price,
        stock: p.stock,
        unit: p.unit,
        imageUrl: p.imageUrl || '',
        expiryDate: p.expiration_date || undefined,
        importDate: p.import_date || undefined,
        sold: 0,
      }));
      
      setProducts(uiProducts);
    } catch (error: any) {
      console.error('[ProductsScreen] Failed to fetch products:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm');
    } finally {
      setIsLoadingProducts(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Calculate stats
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 20).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * (p.sold || 0)), 0),
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
  };

  // Count urgent items
  const urgentItemsCount = products.filter(p => {
    const daysLeft = getDaysUntilExpiry(p.expiryDate);
    return p.stock > 0 && daysLeft !== null && daysLeft <= 3;
  }).length;

  // Filter & Search & Sort
  let filteredProducts = products
    .filter(product => {
      switch (filterType) {
        case 'inStock': return product.stock > 20;
        case 'lowStock': return product.stock > 0 && product.stock < 20;
        case 'outOfStock': return product.stock === 0;
        default: return true;
      }
    })
    .filter(product => {
      if (!searchQuery.trim()) return true;
      return product.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // Sort
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortType) {
      case 'expiryDate':
        const daysA = getDaysUntilExpiry(a.expiryDate);
        const daysB = getDaysUntilExpiry(b.expiryDate);
        if (daysA === null) return 1;
        if (daysB === null) return -1;
        return daysA - daysB;
      case 'stock':
        return a.stock - b.stock;
      case 'price':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name, 'vi');
      case 'sold':
        return (b.sold || 0) - (a.sold || 0);
      default:
        return 0;
    }
  });

  // Handlers
  const handleAddProduct = useCallback(async (newProductData: Omit<Product, 'id'>) => {
    try {
      if (!storeId) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin cửa hàng');
        return;
      }
      
      const productCreateRequest = {
        product_name: newProductData.name,
        description: newProductData.description || '',
        price: newProductData.price,
        quantity: newProductData.stock,
        category: (newProductData.category || 'rau củ') as any,
        image_urls: newProductData.imageUrl ? [newProductData.imageUrl] : [],
        unit: newProductData.unit as any,
        status: (newProductData.status || 'Còn hàng') as any,
        import_date: newProductData.importDate,
        expiration_date: newProductData.expiryDate,
      };
      
      const createdProduct = await ProductsService.addProduct(storeId, productCreateRequest);
      
      const uiProduct: Product = {
        id: createdProduct.id,
        name: createdProduct.name,
        description: createdProduct.description || undefined,
        category: createdProduct.category,
        price: createdProduct.price,
        stock: createdProduct.stock,
        unit: createdProduct.unit,
        imageUrl: createdProduct.imageUrl || '',
        expiryDate: createdProduct.expiration_date || undefined,
        importDate: createdProduct.import_date || undefined,
      };
      
      setProducts(prev => [uiProduct, ...prev]);
      setIsAddingProduct(false);
      Alert.alert('Thành công', `Đã thêm sản phẩm "${newProductData.name}"`);
    } catch (error: any) {
      console.error('[ProductsScreen] Failed to add product:', error);
      Alert.alert('Lỗi', error.message || 'Không thể thêm sản phẩm');
    }
  }, [storeId]);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    try {
      await ProductsService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      setProductToDelete(null);
      Alert.alert('Thành công', 'Đã xóa sản phẩm');
    } catch (error: any) {
      console.error('[ProductsScreen] Failed to delete product:', error);
      Alert.alert('Lỗi', error.message || 'Không thể xóa sản phẩm');
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View style={{
        backgroundColor: 'white',
        borderBottomWidth: 2,
        borderBottomColor: '#f3f4f6',
        paddingTop: 40,
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: '700',
          color: '#1f2937',
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}>
          📦 Sản phẩm
        </Text>
      </View>

      {/* Stats, Search & Sort */}
      <View style={{
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
      }}>
        <SearchAndSortBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortType={sortType}
          onSortChange={setSortType}
        />

        <ProductStats
          stats={stats}
          filterType={filterType}
          onFilterChange={setFilterType}
          onRevenuePress={() => {}}
          onInventoryPress={() => {}}
          urgentItemsCount={urgentItemsCount}
        />

        {/* Active Filter Indicator */}
        {filterType !== 'all' && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: '#f9fafb',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
          }}>
            <Text style={{ fontSize: 11, color: '#6b7280', fontWeight: '600' }}>
              {
                filterType === 'inStock' ? '✅ Còn hàng' :
                filterType === 'lowStock' ? '⚠️ Sắp hết' :
                '❌ Hết hàng'
              } • {filteredProducts.length} SP
            </Text>
            <TouchableOpacity 
              onPress={() => setFilterType('all')}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                backgroundColor: '#e5e7eb',
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 10, color: '#374151', fontWeight: '600' }}>
                ✕ Xóa
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Product List */}
      {isLoadingProducts || isLoadingStoreId ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 12 }}>
            Đang tải sản phẩm...
          </Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>📦</Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 }}>
            {searchQuery || filterType !== 'all' 
              ? 'Không tìm thấy sản phẩm' 
              : 'Chưa có sản phẩm nào'}
          </Text>
          <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>
            {searchQuery || filterType !== 'all'
              ? 'Thử thay đổi bộ lọc hoặc từ khóa'
              : 'Nhấn nút + để thêm sản phẩm'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <ProductListCard 
              item={item} 
              onPress={() => {}}
              onEdit={() => {}}
              onDelete={() => setProductToDelete(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 100 }}
        />
      )}

      {/* Floating Action Button */}
      <View style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 10 }}>
        <FloatingButton
          onPress={() => setShowAddMenu(true)}
          icon={<PlusIcon width={24} height={24} stroke="white" />}
        />
      </View>

      {/* Modals */}
      <AddOptionMenu
        visible={showAddMenu}
        onClose={() => setShowAddMenu(false)}
        onSelectProduct={() => {
          setShowAddMenu(false);
          setIsAddingProduct(true);
        }}
        onSelectCombo={() => {}}
        onSelectVoucher={() => {}}
        onSelectExcel={() => {
          setShowAddMenu(false);
          setShowImportExcel(true);
        }}
        showProduct={true}
        showCombo={false}
        showVoucher={false}
        showExcel={true}
      />

      <Modal
        visible={isAddingProduct}
        animationType="slide"
        onRequestClose={() => setIsAddingProduct(false)}
      >
        <AddProduct
          onClose={() => setIsAddingProduct(false)}
          onAddProduct={handleAddProduct}
        />
      </Modal>

      <Modal
        visible={showImportExcel}
        animationType="slide"
        onRequestClose={() => setShowImportExcel(false)}
      >
        <ImportExcel
          onClose={() => setShowImportExcel(false)}
          storeId={storeId || ''}
          onSuccess={() => {
            fetchProducts();
            Alert.alert('Thành công', 'Import sản phẩm thành công!');
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        visible={!!productToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setProductToDelete(null)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 400,
          }}>
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#fee2e2',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 32 }}>🗑️</Text>
            </View>

            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              Xóa sản phẩm?
            </Text>

            {productToDelete && (
              <Text style={{
                fontSize: 14,
                color: '#6b7280',
                textAlign: 'center',
                marginBottom: 24,
              }}>
                {productToDelete.name}
              </Text>
            )}

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setProductToDelete(null)}
                style={{
                  flex: 1,
                  backgroundColor: '#f3f4f6',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#4b5563' }}>
                  Hủy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => productToDelete && handleDeleteProduct(productToDelete.id)}
                style={{
                  flex: 1,
                  backgroundColor: '#ef4444',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
                  Xóa
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductsScreen;
