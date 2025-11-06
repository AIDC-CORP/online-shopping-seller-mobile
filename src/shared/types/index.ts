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
  // Combo & Discount fields
  isCombo?: boolean; // Có phải là combo không
  comboProducts?: string[]; // Array of product IDs trong combo
  originalPrice?: number; // Giá gốc (trước khi giảm hoặc combo)
  discountPercent?: number; // % giảm giá
}

export interface ComboProduct {
  productId: string;
  quantity: number; // Số lượng sản phẩm trong combo (VD: 2kg táo)
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  products: ComboProduct[]; // Danh sách sản phẩm với số lượng
  originalPrice: number; // Tổng giá gốc các sản phẩm
  comboPrice: number; // Giá combo sau giảm
  discountPercent: number; // % giảm giá
  imageUrl: string;
  stock: number; // Số lượng combo có sẵn
  sold?: number; // Số combo đã bán
  validFrom?: string; // Ngày bắt đầu
  validUntil?: string; // Ngày kết thúc
  createdAt: string;
}

export interface Voucher {
  id: string;
  code: string; // Mã voucher (VD: FRESH50)
  description: string; // Mô tả voucher
  discountType: 'percent' | 'fixed'; // Loại giảm: % hoặc số tiền cố định
  discountValue: number; // Giá trị giảm (VD: 20 = 20% hoặc 20000đ)
  minOrderValue?: number; // Giá trị đơn hàng tối thiểu
  maxDiscount?: number; // Giảm tối đa (chỉ cho %)
  usageLimit: number; // Số lần sử dụng tối đa
  usedCount: number; // Đã sử dụng bao nhiêu lần
  validFrom: string; // Ngày bắt đầu
  validUntil: string; // Ngày hết hạn
  isActive: boolean; // Có đang active không
  createdAt: string;
}

export interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  openingHours: string;
  description: string;
  coverImageUrl: string;
  avatarUrl: string;
  email?: string;
  website?: string;
  paymentMethods?: string;
  shippingPolicy?: string;
  returnPolicy?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface DashboardStats {
  revenue: number;
  totalOrders: number;
  successfulOrders: number;
  cancelledOrders: number;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isFromSeller: boolean;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}