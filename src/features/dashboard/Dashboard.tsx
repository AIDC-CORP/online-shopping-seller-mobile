import React, { useState } from 'react';
import { mockDashboardStats } from './data';
import { mockProducts } from '../products/data'; // Cross-feature import for top products
import { ChartBarIcon } from '../../shared/components/icons/ChartBarIcon';
import { PackageIcon } from '../../shared/components/icons/PackageIcon';
import { CheckCircleIcon } from '../../shared/components/icons/CheckCircleIcon';
import { XCircleIcon } from '../../shared/components/icons/XCircleIcon';


const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; iconBgColor: string }> = ({ title, value, icon, iconBgColor }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4">
    <div className={`p-3 rounded-full ${iconBgColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats] = useState(mockDashboardStats);
  const [topProducts] = useState(mockProducts.slice(0, 4));
  const [filter, setFilter] = useState('Tháng này');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="space-y-6">
       <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-800">Lên kế hoạch bán hàng</h1>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-700">Tổng quan</h2>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border-gray-200 bg-white rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          >
            <option>Hôm nay</option>
            <option>Tuần này</option>
            <option>Tháng này</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatCard title="Doanh thu" value={formatCurrency(stats.revenue)} icon={<ChartBarIcon className="h-5 w-5 text-emerald-600"/>} iconBgColor="bg-emerald-100" />
          <StatCard title="Tổng đơn" value={stats.totalOrders.toString()} icon={<PackageIcon className="h-5 w-5 text-blue-600"/>} iconBgColor="bg-blue-100" />
          <StatCard title="Thành công" value={stats.successfulOrders.toString()} icon={<CheckCircleIcon className="h-5 w-5 text-indigo-600"/>} iconBgColor="bg-indigo-100" />
          <StatCard title="Đã hủy" value={stats.cancelledOrders.toString()} icon={<XCircleIcon className="h-5 w-5 text-red-600"/>} iconBgColor="bg-red-100" />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-700 mb-4">Sản phẩm bán chạy</h2>
        <div className="space-y-3">
          {topProducts.map((product) => (
            <div key={product.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center space-x-4">
              <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-gray-700">{product.name}</p>
                <p className="text-sm text-gray-500">{formatCurrency(product.price)} / {product.unit}</p>
              </div>
              <p className="text-lg font-bold text-emerald-600">{product.stock * 3} <span className="text-sm font-normal text-gray-500">đã bán</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
