
import React, { useState } from 'react';
import { mockOrders } from '../services/mockData';
import { Order, OrderStatus } from '../types';

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.New: return 'bg-blue-100 text-blue-800';
      case OrderStatus.Preparing: return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.Delivering: return 'bg-indigo-100 text-indigo-800';
      case OrderStatus.Completed: return 'bg-green-100 text-green-800';
      case OrderStatus.Cancelled: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-gray-800">Đơn #{order.id}</p>
          <p className="text-sm text-gray-600">{order.customerName}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>
      <div className="text-sm text-gray-500">
        {order.items.map(item => `${item.quantity} x ${item.name}`).join(', ')}
      </div>
      <div className="border-t pt-3 flex justify-between items-center">
        <p className="text-sm text-gray-500">{order.timestamp}</p>
        <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
      </div>
      {order.status === OrderStatus.New && (
        <div className="flex space-x-2 pt-2">
          <button className="flex-1 bg-red-500 text-white py-2 rounded-md text-sm font-medium hover:bg-red-600 transition">Từ chối</button>
          <button className="flex-1 bg-green-500 text-white py-2 rounded-md text-sm font-medium hover:bg-green-600 transition">Xác nhận</button>
        </div>
      )}
    </div>
  );
};

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.New);
  const tabs = [OrderStatus.New, OrderStatus.Preparing, OrderStatus.Delivering, OrderStatus.Completed, OrderStatus.Cancelled];

  const filteredOrders = mockOrders.filter(order => order.status === activeTab);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="flex space-x-2 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => <OrderCard key={order.id} order={order} />)
        ) : (
          <p className="text-center text-gray-500 mt-8">Không có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
