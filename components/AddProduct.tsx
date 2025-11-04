import React, { useState } from 'react';
import { Product } from '../types';
import { XIcon } from './icons/XIcon';
import { CameraIcon } from './icons/CameraIcon';

interface AddProductProps {
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id' | 'imageUrl'>) => void;
}

const InputField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
    </div>
);

const AddProduct: React.FC<AddProductProps> = ({ onClose, onAddProduct }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [unit, setUnit] = useState('kg');
    const [stock, setStock] = useState('');

    const handleSubmit = () => {
        if (!name || !price || !unit || !stock) {
            // In a real app, show a more user-friendly error message
            alert('Vui lòng điền đầy đủ các trường bắt buộc.');
            return;
        }
        
        onAddProduct({
            name,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
            unit,
        });
    };

    return (
        <div className="fixed inset-0 bg-white z-20 flex flex-col md:absolute md:bg-black md:bg-opacity-50 md:justify-center md:items-center">
            <div className="bg-gray-50 w-full h-full flex flex-col md:max-w-lg md:h-auto md:rounded-2xl md:shadow-2xl">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-gray-50 z-10">
                    <h2 className="text-lg font-bold text-gray-800">Thêm sản phẩm mới</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200" aria-label="Đóng">
                        <XIcon className="h-6 w-6" />
                    </button>
                </header>
                
                <main className="flex-grow p-4 space-y-4 overflow-y-auto">
                    <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-100">
                        <CameraIcon className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm font-semibold text-green-600">Tải lên hình ảnh</p>
                        <p className="text-xs text-gray-500">PNG, JPG (tối đa 5MB)</p>
                    </div>

                    <InputField label="Tên sản phẩm *">
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" required />
                    </InputField>

                    <div className="grid grid-cols-5 gap-4">
                        <div className="col-span-3">
                            <InputField label="Giá bán *">
                                 <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" required />
                            </InputField>
                        </div>
                        <div className="col-span-2">
                            <InputField label="Đơn vị *">
                                 <input type="text" placeholder="kg, mớ..." value={unit} onChange={e => setUnit(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" required />
                            </InputField>
                        </div>
                    </div>

                     <InputField label="Số lượng tồn kho *">
                         <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" required />
                    </InputField>

                    <InputField label="Mô tả chi tiết">
                        <textarea rows={3} placeholder="Nguồn gốc, thông tin dinh dưỡng..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
                    </InputField>

                     <InputField label="Danh mục">
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white">
                            <option>Rau củ</option>
                            <option>Trái cây</option>
                            <option>Thịt, Cá, Trứng</option>
                            <option>Đồ khô</option>
                            <option>Gia vị</option>
                        </select>
                    </InputField>
                </main>
                
                <footer className="p-4 bg-white border-t border-gray-200 flex space-x-3 sticky bottom-0">
                    <button onClick={onClose} type="button" className="flex-1 py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        Hủy
                    </button>
                    <button onClick={handleSubmit} type="button" className="flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                        Thêm sản phẩm
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddProduct;