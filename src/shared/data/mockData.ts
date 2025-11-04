import { Product, Order, OrderStatus, StoreInfo, DashboardStats } from '../types';

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Cà chua bi', price: 45000, stock: 50, unit: 'kg', imageUrl: 'https://picsum.photos/seed/tomato/300/200' },
  { id: 'p2', name: 'Rau xà lách', price: 15000, stock: 100, unit: 'mớ', imageUrl: 'https://picsum.photos/seed/lettuce/300/200' },
  { id: 'p3', name: 'Thịt bò Úc', price: 250000, stock: 20, unit: 'kg', imageUrl: 'https://picsum.photos/seed/beef/300/200' },
  { id: 'p4', name: 'Cá hồi Na Uy', price: 450000, stock: 15, unit: 'kg', imageUrl: 'https://picsum.photos/seed/salmon/300/200' },
  { id: 'p5', name: 'Táo Envy Mỹ', price: 80000, stock: 80, unit: 'kg', imageUrl: 'https://picsum.photos/seed/apple/300/200' },
  { id: 'p6', name: 'Sữa tươi Dalat Milk', price: 35000, stock: 0, unit: 'hộp', imageUrl: 'https://picsum.photos/seed/milk/300/200' },
];

export const mockOrders: Order[] = [
  { id: 'o1', customerName: 'Nguyễn Văn A', itemCount: 3, total: 310000, status: OrderStatus.New, timestamp: '10:30 AM', items: [{name: 'Thịt bò Úc', quantity: 1}, {name: 'Rau xà lách', quantity: 2}, {name: 'Cà chua bi', quantity: 1}] },
  { id: 'o2', customerName: 'Trần Thị B', itemCount: 2, total: 530000, status: OrderStatus.New, timestamp: '10:25 AM', items: [{name: 'Cá hồi Na Uy', quantity: 1}, {name: 'Táo Envy Mỹ', quantity: 1}] },
  { id: 'o3', customerName: 'Lê Văn C', itemCount: 1, total: 15000, status: OrderStatus.Preparing, timestamp: '9:55 AM', items: [{name: 'Rau xà lách', quantity: 1}] },
  { id: 'o4', customerName: 'Phạm Thị D', itemCount: 4, total: 200000, status: OrderStatus.Delivering, timestamp: '9:15 AM', items: [{name: 'Táo Envy Mỹ', quantity: 2}, {name: 'Cà chua bi', quantity: 1}] },
  { id: 'o5', customerName: 'Vũ Văn E', itemCount: 2, total: 295000, status: OrderStatus.Completed, timestamp: 'Hôm qua', items: [{name: 'Thịt bò Úc', quantity: 1}, {name: 'Cà chua bi', quantity: 1}] },
  { id: 'o6', customerName: 'Hoàng Thị F', itemCount: 1, total: 45000, status: OrderStatus.Cancelled, timestamp: 'Hôm qua', items: [{name: 'Cà chua bi', quantity: 1}] },
];

export const mockStoreInfo: StoreInfo = {
  name: 'Cửa hàng Thực phẩm Sạch GreenFarm',
  address: '123 Đường ABC, Phường X, Quận Y, TP. Hồ Chí Minh',
  phone: '0987 654 321',
  openingHours: '7:00 AM - 9:00 PM',
  description: 'GreenFarm tự hào mang đến những sản phẩm nông sản sạch, an toàn và chất lượng cao nhất đến tay người tiêu dùng. Tất cả sản phẩm đều có nguồn gốc rõ ràng, đạt chuẩn VietGAP.',
  coverImageUrl: 'https://picsum.photos/seed/storecover/800/400',
  avatarUrl: 'https://picsum.photos/seed/storeavatar/200/200',
};

export const mockDashboardStats: DashboardStats = {
  revenue: 12540000,
  totalOrders: 89,
  successfulOrders: 82,
  cancelledOrders: 7,
};