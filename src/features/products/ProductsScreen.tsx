import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, Modal } from 'react-native';
import { mockProducts as initialProducts } from '../../shared/data/mockData';
import { Product } from '../../shared/types';
import { PlusIcon } from '../../shared/components/icons';
import AddProduct from './components/AddProduct';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconButton from '@/components/ui/icon-button';

const ProductCard: React.FC<{ item: Product }> = ({ item }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <View className="bg-white rounded-lg shadow-sm flex-1 m-2 overflow-hidden">
      <Image source={{ uri: item.imageUrl }} className="w-full h-28" />
      <View className="p-3 flex-1 justify-between">
        <View>
          <Text className="font-bold text-gray-800 text-sm leading-tight">{item.name}</Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {item.stock > 0 ? `Tồn kho: ${item.stock}` : 'Hết hàng'}
          </Text>
        </View>
        <Text className="text-emerald-600 font-semibold mt-2 text-sm">{formatCurrency(item.price)}/{item.unit}</Text>
      </View>
    </View>
  );
};

const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const handleAddProduct = useCallback((newProductData: Omit<Product, 'id' | 'imageUrl'>) => {
    const newProduct: Product = {
      id: `p${Date.now()}`,
      imageUrl: `https://picsum.photos/seed/${newProductData.name}/${Math.random()}/300/200`,
      ...newProductData,
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
    setIsAddingProduct(false);
  }, []);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50/50">
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
      />
      <View className="absolute bottom-6 right-6 z-10">
        <IconButton
          onPress={() => setIsAddingProduct(true)}
          icon={<PlusIcon className="h-6 w-6" color="white" />}
          variant="primary"
          size="lg"
          className="shadow-lg rounded-full"
        />
      </View>

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
    </SafeAreaView>
  );
};

export default ProductsScreen;