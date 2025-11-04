
import { Order, OrderStatus } from './types';

export const mockOrders: Order[] = [
  { id: 'o1', customerName: 'Nguyễn Văn A', itemCount: 3, total: 310000, status: OrderStatus.New, timestamp: '10:30 AM', items: [{name: 'Thịt bò Úc', quantity: 1}, {name: 'Rau xà lách', quantity: 2}, {name: 'Cà chua bi', quantity: 1}] },
  { id: 'o2', customerName: 'Trần Thị B', itemCount: 2, total: 530000, status: OrderStatus.New, timestamp: '10:25 AM', items: [{name: 'Cá hồi Na Uy', quantity: 1}, {name: 'Táo Envy Mỹ', quantity: 1}] },
  { id: 'o3', customerName: 'Lê Văn C', itemCount: 1, total: 15000, status: OrderStatus.Preparing, timestamp: '9:55 AM', items: [{name: 'Rau xà lách', quantity: 1}] },
  { id: 'o4', customerName: 'Phạm Thị D', itemCount: 4, total: 200000, status: OrderStatus.Delivering, timestamp: '9:15 AM', items: [{name: 'Táo Envy Mỹ', quantity: 2}, {name: 'Cà chua bi', quantity: 1}] },
  { id: 'o5', customerName: 'Vũ Văn E', itemCount: 2, total: 295000, status: OrderStatus.Completed, timestamp: 'Hôm qua', items: [{name: 'Thịt bò Úc', quantity: 1}, {name: 'Cà chua bi', quantity: 1}] },
  { id: 'o6', customerName: 'Hoàng Thị F', itemCount: 1, total: 45000, status: OrderStatus.Cancelled, timestamp: 'Hôm qua', items: [{name: 'Cà chua bi', quantity: 1}] },
];
