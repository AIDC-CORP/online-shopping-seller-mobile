import React, { useState } from 'react';
import { mockStoreInfo } from './data';
import { StoreInfo } from './types';
import { PencilIcon } from '../../shared/components/icons/PencilIcon';

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="py-3 border-b border-gray-200">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-md text-gray-800">{value}</p>
  </div>
);

const Store: React.FC = () => {
  const [storeInfo] = useState<StoreInfo>(mockStoreInfo);

  return (
    <div className="space-y-6">
      <div className="relative">
        <img src={storeInfo.coverImageUrl} alt="Cover" className="w-full h-32 object-cover rounded-lg" />
        <div className="absolute -bottom-10 left-4">
          <img src={storeInfo.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-white shadow-md" />
        </div>
      </div>
      
      <div className="pt-10">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black-800">{storeInfo.name}</h2>
            <button className="p-2 text-gray-500 hover:text-green-600">
                <PencilIcon className="h-5 w-5"/>
            </button>
        </div>
        <p className="text-sm text-black-500 mt-1">{storeInfo.description}</p>
      </div>

      <div className="bg-black p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-black-800 mb-2">Thông tin cửa hàng</h3>
        <InfoRow label="Địa chỉ" value={storeInfo.address} />
        <InfoRow label="Số điện thoại" value={storeInfo.phone} />
        <InfoRow label="Giờ mở cửa" value={storeInfo.openingHours} />
      </div>
      
      <button className="w-full py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition">
        Tạm đóng cửa gian hàng
      </button>
    </div>
  );
};

export default Store;