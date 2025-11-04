
import React, { useState } from 'react';
import { mockDashboardStats, mockProducts } from '../services/mockData';

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
  <div className={`p-4 rounded-xl shadow-md ${color}`}>
    <p className="text-sm text-white/80">{title}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
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
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tổng quan</h2>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
          >
            <option>Hôm nay</option>
            <option>Tuần này</option>
            <option>Tháng này</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatCard title="Doanh thu" value={formatCurrency(stats.revenue)} color="bg-green-500" />
          <StatCard title="Tổng đơn" value={stats.totalOrders.toString()} color="bg-blue-500" />
          <StatCard title="Thành công" value={stats.successfulOrders.toString()} color="bg-indigo-500" />
          <StatCard title="Đã hủy" value={stats.cancelledOrders.toString()} color="bg-red-500" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Sản phẩm bán chạy</h2>
        <div className="space-y-3">
          {topProducts.map((product) => (
            <div key={product.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center space-x-4">
              <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-gray-700">{product.name}</p>
                <p className="text-sm text-gray-500">{formatCurrency(product.price)} / {product.unit}</p>
              </div>
              <p className="text-lg font-bold text-green-600">{product.stock * 3} <span className="text-sm font-normal text-gray-500">đã bán</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
