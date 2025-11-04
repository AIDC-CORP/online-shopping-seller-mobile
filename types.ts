
export enum OrderStatus {
  New = 'Mới',
  Preparing = 'Đang chuẩn bị',
  Delivering = 'Đang giao',
  Completed = 'Hoàn thành',
  Cancelled = 'Đã hủy',
}

export interface Order {
  id: string;
  customerName: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
  timestamp: string;
  items: { name: string; quantity: number }[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  imageUrl: string;
}

export interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  openingHours: string;
  description: string;
  coverImageUrl: string;
  avatarUrl: string;
}

export interface DashboardStats {
  revenue: number;
  totalOrders: number;
  successfulOrders: number;
  cancelledOrders: number;
}

export enum View {
  Dashboard = 'Báo cáo',
  Orders = 'Đơn hàng',
  Products = 'Sản phẩm',
  Store = 'Cửa hàng',
}
