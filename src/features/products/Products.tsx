import React, { useState } from 'react';
import { mockProducts as initialProducts } from './data';
import { Product } from './types';
import { PlusIcon } from '../../shared/components/icons/PlusIcon';
import { PencilIcon } from '../../shared/components/icons/PencilIcon';
import { TrashIcon } from '../../shared/components/icons/TrashIcon';
import AddProduct from './components/AddProduct';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };
  
  const stockColor = product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col relative overflow-hidden">
        <div className="absolute top-2 right-2 flex flex-col space-y-2 z-10">
            <button aria-label="Sửa sản phẩm" className="p-1.5 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white transition">
                <PencilIcon className="h-4 w-4 text-gray-700" />
            </button>
            <button aria-label="Xóa sản phẩm" className="p-1.5 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white transition">
                <TrashIcon className="h-4 w-4 text-gray-700" />
            </button>
        </div>
      <img src={product.imageUrl} alt={product.name} className="w-full h-28 object-cover" />
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
            <p className="font-bold text-gray-800 text-sm leading-tight">{product.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
                {product.stock > 0 ? `Tồn kho: ${product.stock}` : 'Hết hàng'}
            </p>
        </div>
        <p className="text-emerald-600 font-semibold mt-2 text-sm">{formatCurrency(product.price)} / {product.unit}</p>
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
      <div className="grid grid-cols-2 gap-4 pb-20">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <button 
        onClick={() => setIsAddingProduct(true)}
        className="fixed bottom-24 right-6 z-10 md:absolute md:right-0 md:bottom-0 bg-emerald-500 text-white p-4 rounded-full shadow-lg hover:bg-emerald-600 transition transform hover:scale-105"
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