import React, { useState } from 'react';
import { mockProducts as initialProducts } from '../services/mockData';
import { Product } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import AddProduct from './AddProduct';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };
  
  const stockColor = product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm flex items-center space-x-4">
      <img src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded-md object-cover" />
      <div className="flex-1">
        <p className="font-bold text-gray-800">{product.name}</p>
        <p className="text-sm text-gray-600">{formatCurrency(product.price)} / {product.unit}</p>
        <p className={`text-sm font-semibold ${stockColor}`}>
          {product.stock > 0 ? `Tồn kho: ${product.stock}` : 'Hết hàng'}
        </p>
      </div>
      <div className="flex flex-col space-y-2">
        <button aria-label="Sửa sản phẩm" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
          <PencilIcon className="h-4 w-4 text-gray-600" />
        </button>
        <button aria-label="Xóa sản phẩm" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
          <TrashIcon className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'imageUrl'>) => {
    const newProduct: Product = {
      id: `p${Date.now()}`, // simple unique id generation
      imageUrl: `https://picsum.photos/seed/${newProductData.name}/${Math.random()}/300/200`,
      ...newProductData,
    };
    setProducts([newProduct, ...products]);
    setIsAddingProduct(false);
  };

  return (
    <div className="relative">
      <div className="space-y-4 pb-20">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <button 
        onClick={() => setIsAddingProduct(true)}
        className="fixed bottom-24 right-6 z-10 md:absolute md:right-0 md:bottom-0 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition transform hover:scale-105"
        aria-label="Thêm sản phẩm mới"
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {isAddingProduct && (
        <AddProduct 
          onClose={() => setIsAddingProduct(false)}
          onAddProduct={handleAddProduct}
        />
      )}
    </div>
  );
};

export default Products;