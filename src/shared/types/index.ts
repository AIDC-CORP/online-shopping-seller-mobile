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
  sold?: number; // Số lượng đã bán
  expiryDate?: string; // Ngày hết hạn (ISO format: YYYY-MM-DD)
  importDate?: string; // Ngày nhập hàng (ISO format: YYYY-MM-DD)
  shelfLife?: number; // Thời hạn sử dụng (số ngày)
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