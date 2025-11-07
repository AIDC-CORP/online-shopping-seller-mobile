import { Product, Order, OrderStatus, StoreInfo, DashboardStats, ChatConversation, Combo, Voucher, Delivery, DeliveryStatus, DeliveryPartner } from '../types';

export const mockProducts: Product[] = [
  { 
    id: 'p1', 
    name: 'Cà chua bi', 
    price: 45000, 
    stock: 50, 
    unit: 'kg', 
    imageUrl: 'https://picsum.photos/seed/tomato/300/200', 
    sold: 245,
    importDate: '2025-11-03', // 2 days ago
    expiryDate: '2025-11-07', // 2 days left - URGENT
    shelfLife: 4
  },
  { 
    id: 'p2', 
    name: 'Rau xà lách', 
    price: 15000, 
    stock: 100, 
    unit: 'mớ', 
    imageUrl: 'https://picsum.photos/seed/lettuce/300/200', 
    sold: 189,
    importDate: '2025-11-02', // 3 days ago
    expiryDate: '2025-11-09', // 4 days left - NEAR EXPIRY
    shelfLife: 7
  },
  { 
    id: 'p3', 
    name: 'Thịt bò Úc', 
    price: 250000, 
    stock: 20, 
    unit: 'kg', 
    imageUrl: 'https://picsum.photos/seed/beef/300/200', 
    sold: 156,
    importDate: '2025-11-04', // 1 day ago
    expiryDate: '2025-11-19', // 14 days left - FRESH
    shelfLife: 15
  },
  { 
    id: 'p4', 
    name: 'Cá hồi Na Uy', 
    price: 450000, 
    stock: 15, 
    unit: 'kg', 
    imageUrl: 'https://picsum.photos/seed/salmon/300/200', 
    sold: 98,
    importDate: '2025-11-04', // 1 day ago
    expiryDate: '2025-11-07', // 2 days left - URGENT
    shelfLife: 3
  },
  { 
    id: 'p5', 
    name: 'Táo Envy Mỹ', 
    price: 80000, 
    stock: 80, 
    unit: 'kg', 
    imageUrl: 'https://picsum.photos/seed/apple/300/200', 
    sold: 234,
    importDate: '2025-10-25', // 11 days ago
    expiryDate: '2025-11-20', // 15 days left - FRESH
    shelfLife: 26
  },
  { 
    id: 'p6', 
    name: 'Sữa tươi Dalat Milk', 
    price: 35000, 
    stock: 0, 
    unit: 'hộp', 
    imageUrl: 'https://picsum.photos/seed/milk/300/200', 
    sold: 312,
    importDate: '2025-10-30', // 6 days ago (out of stock)
    expiryDate: '2025-11-10', // Would be 5 days - but stock is 0
    shelfLife: 11
  },
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

// Mock data theo từng period
export const mockDashboardStatsByPeriod = {
  today: {
    revenue: 2450000,
    totalOrders: 15,
    successfulOrders: 13,
    cancelledOrders: 2,
    topProducts: [
      { ...mockProducts[5], sold: 12 }, // Sữa tươi
      { ...mockProducts[0], sold: 8 },  // Cà chua
      { ...mockProducts[1], sold: 6 },  // Rau xà lách
      { ...mockProducts[4], sold: 5 },  // Táo
    ],
  },
  week: {
    revenue: 8750000,
    totalOrders: 42,
    successfulOrders: 38,
    cancelledOrders: 4,
    topProducts: [
      { ...mockProducts[5], sold: 45 }, // Sữa tươi
      { ...mockProducts[0], sold: 38 }, // Cà chua
      { ...mockProducts[4], sold: 32 }, // Táo
      { ...mockProducts[1], sold: 28 }, // Rau xà lách
    ],
  },
  month: {
    revenue: 12540000,
    totalOrders: 89,
    successfulOrders: 82,
    cancelledOrders: 7,
    topProducts: [
      { ...mockProducts[5], sold: 156 }, // Sữa tươi
      { ...mockProducts[0], sold: 125 }, // Cà chua
      { ...mockProducts[4], sold: 98 },  // Táo
      { ...mockProducts[2], sold: 76 },  // Thịt bò
    ],
  },
};

export const mockChatConversations: ChatConversation[] = [
  {
    id: 'chat1',
    customerName: 'Nguyễn Văn A',
    customerAvatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Cửa hàng còn cà chua bi không ạ?',
    lastMessageTime: '2 phút trước',
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        text: 'Chào shop! Cho mình hỏi cà chua bi còn không ạ?',
        timestamp: '10:30 AM',
        isFromSeller: false,
        isRead: true,
      },
      {
        id: 'm2',
        text: 'Dạ vẫn còn ạ! Hiện tại shop còn 50kg cà chua bi tươi ngon lắm.',
        timestamp: '10:31 AM',
        isFromSeller: true,
        isRead: true,
      },
      {
        id: 'm3',
        text: 'Vậy mình đặt 2kg nhé. Giao được không shop?',
        timestamp: '10:32 AM',
        isFromSeller: false,
        isRead: true,
      },
      {
        id: 'm4',
        text: 'Cửa hàng còn cà chua bi không ạ?',
        timestamp: '10:35 AM',
        isFromSeller: false,
        isRead: false,
      },
    ],
  },
  {
    id: 'chat2',
    customerName: 'Trần Thị B',
    customerAvatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'Cảm ơn shop nhiều nhé!',
    lastMessageTime: '15 phút trước',
    unreadCount: 0,
    messages: [
      {
        id: 'm5',
        text: 'Shop ơi, táo Envy còn không ạ?',
        timestamp: '9:45 AM',
        isFromSeller: false,
        isRead: true,
      },
      {
        id: 'm6',
        text: 'Dạ còn ạ! Táo Envy Mỹ vừa về tươi lắm. Giá 80k/kg ạ.',
        timestamp: '9:46 AM',
        isFromSeller: true,
        isRead: true,
      },
      {
        id: 'm7',
        text: 'Vậy cho mình 3kg nhé!',
        timestamp: '9:47 AM',
        isFromSeller: false,
        isRead: true,
      },
      {
        id: 'm8',
        text: 'Dạ được ạ! Shop đang chuẩn bị đơn cho chị.',
        timestamp: '9:48 AM',
        isFromSeller: true,
        isRead: true,
      },
      {
        id: 'm9',
        text: 'Cảm ơn shop nhiều nhé!',
        timestamp: '9:50 AM',
        isFromSeller: false,
        isRead: true,
      },
    ],
  },
  {
    id: 'chat3',
    customerName: 'Lê Văn C',
    customerAvatar: 'https://i.pravatar.cc/150?img=3',
    lastMessage: 'Bạn: Dạ được ạ, shop sẽ giao trong...',
    lastMessageTime: '1 giờ trước',
    unreadCount: 0,
    messages: [
      {
        id: 'm10',
        text: 'Chào shop, mình muốn đặt thịt bò Úc',
        timestamp: '8:30 AM',
        isFromSeller: false,
        isRead: true,
      },
      {
        id: 'm11',
        text: 'Dạ chào anh! Shop có thịt bò Úc cao cấp, 250k/kg ạ.',
        timestamp: '8:31 AM',
        isFromSeller: true,
        isRead: true,
      },
      {
        id: 'm12',
        text: 'Cho mình 1kg. Giao chiều nay được không?',
        timestamp: '8:32 AM',
        isFromSeller: false,
        isRead: true,
      },
      {
        id: 'm13',
        text: 'Dạ được ạ, shop sẽ giao trong khoảng 3-4h chiều nay.',
        timestamp: '8:33 AM',
        isFromSeller: true,
        isRead: true,
      },
    ],
  },
  {
    id: 'chat4',
    customerName: 'Phạm Thị D',
    customerAvatar: 'https://i.pravatar.cc/150?img=9',
    lastMessage: 'Shop có giảm giá không ạ?',
    lastMessageTime: '2 giờ trước',
    unreadCount: 1,
    messages: [
      {
        id: 'm14',
        text: 'Cá hồi Na Uy giá bao nhiêu vậy shop?',
        timestamp: '7:15 AM',
        isFromSeller: false,
        isRead: true,
      },
      {
        id: 'm15',
        text: 'Dạ cá hồi Na Uy đang 450k/kg ạ. Rất tươi ngon luôn.',
        timestamp: '7:16 AM',
        isFromSeller: true,
        isRead: true,
      },
      {
        id: 'm16',
        text: 'Shop có giảm giá không ạ?',
        timestamp: '7:20 AM',
        isFromSeller: false,
        isRead: false,
      },
    ],
  },
  {
    id: 'chat5',
    customerName: 'Hoàng Văn E',
    customerAvatar: 'https://i.pravatar.cc/150?img=7',
    lastMessage: 'Bạn: Dạ shop xin cảm ơn ạ!',
    lastMessageTime: 'Hôm qua',
    unreadCount: 0,
    messages: [
      {
        id: 'm17',
        text: 'Rau xà lách tươi không shop?',
        timestamp: 'Hôm qua 5:00 PM',
        isFromSeller: false,
        isRead: true,
      },
      {
        id: 'm18',
        text: 'Dạ rất tươi ạ! Vừa nhập sáng nay.',
        timestamp: 'Hôm qua 5:01 PM',
        isFromSeller: true,
        isRead: true,
      },
      {
        id: 'm19',
        text: 'Tuyệt vời! Shop làm ăn uy tín lắm.',
        timestamp: 'Hôm qua 5:05 PM',
        isFromSeller: false,
        isRead: true,
      },
      {
        id: 'm20',
        text: 'Dạ shop xin cảm ơn ạ!',
        timestamp: 'Hôm qua 5:06 PM',
        isFromSeller: true,
        isRead: true,
      },
    ],
  },
];

// Mock Combos
export const mockCombos: Combo[] = [
  {
    id: 'combo1',
    name: 'Combo Rau Củ Tươi',
    description: 'Gồm 1kg cà chua bi, 2 mớ rau xà lách và 2kg táo - đầy đủ dinh dưỡng',
    products: [
      { productId: 'p1', quantity: 1 }, // 1kg cà chua
      { productId: 'p2', quantity: 2 }, // 2 mớ xà lách
      { productId: 'p5', quantity: 2 }, // 2kg táo
    ],
    originalPrice: 45000 + (15000 * 2) + (35000 * 2), // 145,000đ
    comboPrice: 120000,
    discountPercent: 17, // Giảm 17%
    imageUrl: 'https://picsum.photos/seed/combo1/300/200',
    stock: 30,
    sold: 12,
    validFrom: '2025-11-01',
    validUntil: '2025-11-30',
    createdAt: '2025-11-01T10:00:00Z',
  },
  {
    id: 'combo2',
    name: 'Combo Thịt & Hải Sản',
    description: '500g thịt bò Úc + 500g cá hồi Na Uy - cho bữa tiệc sang trọng',
    products: [
      { productId: 'p3', quantity: 0.5 }, // 0.5kg thịt bò
      { productId: 'p4', quantity: 0.5 }, // 0.5kg cá hồi
    ],
    originalPrice: (250000 * 0.5) + (450000 * 0.5), // 350,000đ
    comboPrice: 315000,
    discountPercent: 10, // Giảm 10%
    imageUrl: 'https://picsum.photos/seed/combo2/300/200',
    stock: 15,
    sold: 8,
    validFrom: '2025-11-01',
    validUntil: '2025-12-31',
    createdAt: '2025-11-02T14:00:00Z',
  },
];

// Mock Vouchers
export const mockVouchers: Voucher[] = [
  {
    id: 'voucher1',
    code: 'FRESH50',
    description: 'Giảm 50,000đ cho đơn hàng từ 200,000đ',
    discountType: 'fixed',
    discountValue: 50000,
    minOrderValue: 200000,
    maxDiscount: undefined,
    usageLimit: 100,
    usedCount: 45,
    validFrom: '2025-11-01',
    validUntil: '2025-11-30',
    isActive: true,
    createdAt: '2025-11-01T08:00:00Z',
  },
  {
    id: 'voucher2',
    code: 'NEWYEAR2025',
    description: 'Giảm 20% tối đa 100,000đ cho đơn từ 300,000đ',
    discountType: 'percent',
    discountValue: 20,
    minOrderValue: 300000,
    maxDiscount: 100000,
    usageLimit: 50,
    usedCount: 12,
    validFrom: '2025-12-25',
    validUntil: '2026-01-05',
    isActive: true,
    createdAt: '2025-11-03T09:00:00Z',
  },
  {
    id: 'voucher3',
    code: 'FREESHIP',
    description: 'Miễn phí ship cho đơn từ 150,000đ',
    discountType: 'fixed',
    discountValue: 30000,
    minOrderValue: 150000,
    maxDiscount: undefined,
    usageLimit: 200,
    usedCount: 87,
    validFrom: '2025-11-01',
    validUntil: '2025-11-15',
    isActive: true,
    createdAt: '2025-11-01T10:30:00Z',
  },
];

// Mock Store Reviews
export const mockStoreReviews = [
  {
    id: 'r1',
    customerName: 'Nguyễn Văn A',
    customerAvatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    comment: 'Sản phẩm rất tươi ngon, giao hàng nhanh. Sẽ ủng hộ tiếp!',
    timestamp: '2 ngày trước',
    productName: 'Cà chua bi',
    images: ['https://picsum.photos/seed/review1/200/200'],
  },
  {
    id: 'r2',
    customerName: 'Trần Thị B',
    customerAvatar: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    comment: 'Táo rất ngon, giá cả hợp lý. Shop nhiệt tình!',
    timestamp: '3 ngày trước',
    productName: 'Táo Envy Mỹ',
  },
  {
    id: 'r3',
    customerName: 'Lê Văn C',
    customerAvatar: 'https://i.pravatar.cc/150?img=3',
    rating: 4,
    comment: 'Thịt bò chất lượng tốt, đóng gói cẩn thận.',
    timestamp: '5 ngày trước',
    productName: 'Thịt bò Úc',
  },
  {
    id: 'r4',
    customerName: 'Phạm Thị D',
    customerAvatar: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    comment: 'Cá hồi tươi ngon, ship nhanh. Rất hài lòng!',
    timestamp: '1 tuần trước',
    productName: 'Cá hồi Na Uy',
    images: ['https://picsum.photos/seed/review4a/200/200', 'https://picsum.photos/seed/review4b/200/200'],
  },
  {
    id: 'r5',
    customerName: 'Hoàng Văn E',
    customerAvatar: 'https://i.pravatar.cc/150?img=7',
    rating: 5,
    comment: 'Shop uy tín, sản phẩm tươi sạch. Rất đáng tin cậy!',
    timestamp: '1 tuần trước',
    productName: 'Rau xà lách',
  },
];

// Mock Store Followers
export const mockStoreFollowers = [
  {
    id: 'f1',
    customerName: 'Nguyễn Văn A',
    customerAvatar: 'https://i.pravatar.cc/150?img=1',
    followedAt: '2025-10-15',
    totalOrders: 12,
    totalSpent: 2450000,
  },
  {
    id: 'f2',
    customerName: 'Trần Thị B',
    customerAvatar: 'https://i.pravatar.cc/150?img=5',
    followedAt: '2025-10-20',
    totalOrders: 8,
    totalSpent: 1850000,
  },
  {
    id: 'f3',
    customerName: 'Lê Văn C',
    customerAvatar: 'https://i.pravatar.cc/150?img=3',
    followedAt: '2025-10-25',
    totalOrders: 15,
    totalSpent: 3200000,
  },
  {
    id: 'f4',
    customerName: 'Phạm Thị D',
    customerAvatar: 'https://i.pravatar.cc/150?img=9',
    followedAt: '2025-11-01',
    totalOrders: 5,
    totalSpent: 950000,
  },
  {
    id: 'f5',
    customerName: 'Hoàng Văn E',
    customerAvatar: 'https://i.pravatar.cc/150?img=7',
    followedAt: '2025-11-02',
    totalOrders: 3,
    totalSpent: 620000,
  },
];

export const mockStoreStats = {
  averageRating: 4.8,
  totalReviews: 156,
  totalFollowers: 1247,
  totalProducts: 45,
  rating5Stars: 125,
  rating4Stars: 24,
  rating3Stars: 5,
  rating2Stars: 1,
  rating1Star: 1,
};

// Mock Store Analytics
export const mockStoreAnalytics = {
  overview: {
    totalRevenue: 45800000,
    totalOrders: 342,
    averageOrderValue: 133918,
    conversionRate: 3.2,
    viewsToday: 1245,
    viewsThisWeek: 8763,
    viewsThisMonth: 32456,
  },
  revenueByPeriod: {
    today: 2450000,
    yesterday: 1980000,
    thisWeek: 12340000,
    lastWeek: 10250000,
    thisMonth: 45800000,
    lastMonth: 38500000,
  },
  topSellingProducts: [
    { id: 'p1', name: 'Cà chua bi', sold: 245, revenue: 11025000 },
    { id: 'p5', name: 'Táo Envy Mỹ', sold: 234, revenue: 18720000 },
    { id: 'p2', name: 'Rau xà lách', sold: 189, revenue: 2835000 },
    { id: 'p3', name: 'Thịt bò Úc', sold: 156, revenue: 39000000 },
    { id: 'p4', name: 'Cá hồi Na Uy', sold: 98, revenue: 44100000 },
  ],
  customerDemographics: {
    newCustomers: 89,
    returningCustomers: 253,
    totalCustomers: 342,
    averageLifetimeValue: 2450000,
  },
  ordersByStatus: {
    new: 15,
    preparing: 8,
    delivering: 12,
    completed: 298,
    cancelled: 9,
  },
  trafficSources: {
    direct: 45,
    social: 32,
    search: 18,
    referral: 5,
  },
  peakHours: [
    { hour: '7-8', orders: 12 },
    { hour: '8-9', orders: 18 },
    { hour: '9-10', orders: 25 },
    { hour: '10-11', orders: 22 },
    { hour: '11-12', orders: 15 },
    { hour: '17-18', orders: 28 },
    { hour: '18-19', orders: 35 },
    { hour: '19-20', orders: 42 },
    { hour: '20-21', orders: 30 },
  ],
};

// Mock Share Store Data
export const mockShareStoreData = {
  storeUrl: 'https://greenfarm.shop/store/greenfarm',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://greenfarm.shop/store/greenfarm',
  shortUrl: 'gfarm.vn/shop',
  socialShareText: '🌿 Ghé thăm cửa hàng GreenFarm - Thực phẩm sạch, an toàn cho gia đình bạn! 🥬🍅',
  shareStats: {
    totalShares: 234,
    facebookShares: 145,
    zaloShares: 67,
    otherShares: 22,
  },
};

<<<<<<< HEAD
// Mock Delivery Data
export const mockDeliveries: Delivery[] = [
  {
    id: 'd1',
    orderId: 'ORD001',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    status: DeliveryStatus.InTransit,
    partner: DeliveryPartner.GrabExpress,
    pickupLocation: {
      address: '123 Nguyễn Huệ, Q1, TP.HCM',
      lat: 10.7769,
      lng: 106.7009,
    },
    deliveryLocation: {
      address: '456 Lê Lợi, Q3, TP.HCM',
      lat: 10.7756,
      lng: 106.6947,
    },
    driver: {
      name: 'Trần Văn B',
      phone: '0987654321',
      vehicleNumber: '59A-12345',
    },
    trackingNumber: 'GRAB20251107001',
    estimatedDelivery: '2025-11-07T16:00:00',
    isCOD: true,
    codAmount: 350000,
    deliveryFee: 25000,
    trackingHistory: [
      {
        timestamp: '2025-11-07T14:00:00',
        status: DeliveryStatus.Pending,
        location: '123 Nguyễn Huệ, Q1',
        note: 'Đơn hàng đã được tạo',
      },
      {
        timestamp: '2025-11-07T14:30:00',
        status: DeliveryStatus.PickedUp,
        location: '123 Nguyễn Huệ, Q1',
        note: 'Tài xế đã lấy hàng',
      },
      {
        timestamp: '2025-11-07T15:00:00',
        status: DeliveryStatus.InTransit,
        location: 'Đang di chuyển',
        note: 'Đang trên đường giao hàng',
      },
    ],
    createdAt: '2025-11-07T14:00:00',
    updatedAt: '2025-11-07T15:00:00',
  },
  {
    id: 'd2',
    orderId: 'ORD002',
    customerName: 'Trần Thị C',
    customerPhone: '0912345678',
    status: DeliveryStatus.Delivered,
    partner: DeliveryPartner.JT,
    pickupLocation: {
      address: '123 Nguyễn Huệ, Q1, TP.HCM',
      lat: 10.7769,
      lng: 106.7009,
    },
    deliveryLocation: {
      address: '789 Võ Văn Tần, Q3, TP.HCM',
      lat: 10.7812,
      lng: 106.6920,
    },
    driver: {
      name: 'Lê Văn D',
      phone: '0923456789',
      vehicleNumber: '51B-67890',
    },
    trackingNumber: 'JT20251107002',
    estimatedDelivery: '2025-11-07T14:00:00',
    actualDelivery: '2025-11-07T13:45:00',
    isCOD: false,
    deliveryFee: 20000,
    trackingHistory: [
      {
        timestamp: '2025-11-07T10:00:00',
        status: DeliveryStatus.Pending,
        location: '123 Nguyễn Huệ, Q1',
      },
      {
        timestamp: '2025-11-07T11:00:00',
        status: DeliveryStatus.PickedUp,
        location: '123 Nguyễn Huệ, Q1',
      },
      {
        timestamp: '2025-11-07T12:00:00',
        status: DeliveryStatus.InTransit,
        location: 'Đang di chuyển',
      },
      {
        timestamp: '2025-11-07T13:00:00',
        status: DeliveryStatus.OutForDelivery,
        location: 'Gần địa chỉ giao hàng',
      },
      {
        timestamp: '2025-11-07T13:45:00',
        status: DeliveryStatus.Delivered,
        location: '789 Võ Văn Tần, Q3',
        note: 'Đã giao hàng thành công',
      },
    ],
    proofOfDelivery: {
      imageUrl: 'https://picsum.photos/seed/delivery1/400/300',
      receiverName: 'Trần Thị C',
      signature: 'Signed',
    },
    createdAt: '2025-11-07T10:00:00',
    updatedAt: '2025-11-07T13:45:00',
  },
  {
    id: 'd3',
    orderId: 'ORD003',
    customerName: 'Phạm Văn E',
    customerPhone: '0934567890',
    status: DeliveryStatus.Pending,
    partner: DeliveryPartner.Shopee,
    pickupLocation: {
      address: '123 Nguyễn Huệ, Q1, TP.HCM',
      lat: 10.7769,
      lng: 106.7009,
    },
    deliveryLocation: {
      address: '321 Pasteur, Q1, TP.HCM',
      lat: 10.7804,
      lng: 106.6954,
    },
    trackingNumber: 'SPX20251107003',
    estimatedDelivery: '2025-11-07T18:00:00',
    isCOD: true,
    codAmount: 580000,
    deliveryFee: 30000,
    trackingHistory: [
      {
        timestamp: '2025-11-07T15:30:00',
        status: DeliveryStatus.Pending,
        location: '123 Nguyễn Huệ, Q1',
        note: 'Chờ tài xế đến lấy hàng',
      },
    ],
    createdAt: '2025-11-07T15:30:00',
    updatedAt: '2025-11-07T15:30:00',
  },
  {
    id: 'd4',
    orderId: 'ORD004',
    customerName: 'Hoàng Thị F',
    customerPhone: '0945678901',
    status: DeliveryStatus.OutForDelivery,
    partner: DeliveryPartner.Viettel,
    pickupLocation: {
      address: '123 Nguyễn Huệ, Q1, TP.HCM',
      lat: 10.7769,
      lng: 106.7009,
    },
    deliveryLocation: {
      address: '654 Điện Biên Phủ, Q3, TP.HCM',
      lat: 10.7745,
      lng: 106.6885,
    },
    driver: {
      name: 'Vũ Văn G',
      phone: '0956789012',
      vehicleNumber: '59C-11111',
    },
    trackingNumber: 'VTP20251107004',
    estimatedDelivery: '2025-11-07T16:30:00',
    isCOD: false,
    deliveryFee: 22000,
    trackingHistory: [
      {
        timestamp: '2025-11-07T13:00:00',
        status: DeliveryStatus.Pending,
        location: '123 Nguyễn Huệ, Q1',
      },
      {
        timestamp: '2025-11-07T13:45:00',
        status: DeliveryStatus.PickedUp,
        location: '123 Nguyễn Huệ, Q1',
      },
      {
        timestamp: '2025-11-07T14:30:00',
        status: DeliveryStatus.InTransit,
        location: 'Đang di chuyển',
      },
      {
        timestamp: '2025-11-07T15:30:00',
        status: DeliveryStatus.OutForDelivery,
        location: 'Gần địa chỉ giao hàng',
        note: 'Tài xế đang trên đường đến',
      },
    ],
    createdAt: '2025-11-07T13:00:00',
    updatedAt: '2025-11-07T15:30:00',
  },
  {
    id: 'd5',
    orderId: 'ORD005',
    customerName: 'Đỗ Văn H',
    customerPhone: '0967890123',
    status: DeliveryStatus.Failed,
    partner: DeliveryPartner.GHTK,
    pickupLocation: {
      address: '123 Nguyễn Huệ, Q1, TP.HCM',
      lat: 10.7769,
      lng: 106.7009,
    },
    deliveryLocation: {
      address: '987 Cách Mạng Tháng 8, Q10, TP.HCM',
      lat: 10.7712,
      lng: 106.6632,
    },
    driver: {
      name: 'Ngô Văn I',
      phone: '0978901234',
      vehicleNumber: '59D-22222',
    },
    trackingNumber: 'GHTK20251107005',
    estimatedDelivery: '2025-11-07T15:00:00',
    isCOD: true,
    codAmount: 420000,
    deliveryFee: 28000,
    trackingHistory: [
      {
        timestamp: '2025-11-07T11:00:00',
        status: DeliveryStatus.Pending,
        location: '123 Nguyễn Huệ, Q1',
      },
      {
        timestamp: '2025-11-07T12:00:00',
        status: DeliveryStatus.PickedUp,
        location: '123 Nguyễn Huệ, Q1',
      },
      {
        timestamp: '2025-11-07T13:00:00',
        status: DeliveryStatus.InTransit,
        location: 'Đang di chuyển',
      },
      {
        timestamp: '2025-11-07T14:30:00',
        status: DeliveryStatus.OutForDelivery,
        location: '987 Cách Mạng Tháng 8, Q10',
      },
      {
        timestamp: '2025-11-07T15:00:00',
        status: DeliveryStatus.Failed,
        location: '987 Cách Mạng Tháng 8, Q10',
        note: 'Không liên lạc được khách hàng',
      },
    ],
    createdAt: '2025-11-07T11:00:00',
    updatedAt: '2025-11-07T15:00:00',
  },
  {
    id: 'd6',
    orderId: 'ORD006',
    customerName: 'Bùi Thị K',
    customerPhone: '0989012345',
    status: DeliveryStatus.PickedUp,
    partner: DeliveryPartner.NinjaDan,
    pickupLocation: {
      address: '123 Nguyễn Huệ, Q1, TP.HCM',
      lat: 10.7769,
      lng: 106.7009,
    },
    deliveryLocation: {
      address: '147 Hai Bà Trưng, Q3, TP.HCM',
      lat: 10.7871,
      lng: 106.6946,
    },
    driver: {
      name: 'Lý Văn L',
      phone: '0990123456',
      vehicleNumber: '59E-33333',
    },
    trackingNumber: 'NJV20251107006',
    estimatedDelivery: '2025-11-07T17:00:00',
    isCOD: false,
    deliveryFee: 24000,
    trackingHistory: [
      {
        timestamp: '2025-11-07T15:00:00',
        status: DeliveryStatus.Pending,
        location: '123 Nguyễn Huệ, Q1',
      },
      {
        timestamp: '2025-11-07T15:45:00',
        status: DeliveryStatus.PickedUp,
        location: '123 Nguyễn Huệ, Q1',
        note: 'Tài xế đã lấy hàng và chuẩn bị xuất phát',
      },
    ],
    createdAt: '2025-11-07T15:00:00',
    updatedAt: '2025-11-07T15:45:00',
=======
// Delivery Management Mock Data
export const mockDeliveries: Delivery[] = [
  {
    id: 'd1',
    orderId: 'o1',
    trackingNumber: 'GRAB2025110701',
    partner: DeliveryPartner.GrabExpress,
    status: DeliveryStatus.InTransit,
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    deliveryAddress: {
      address: '123 Nguyễn Huệ',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      coordinates: { lat: 10.7769, lng: 106.7009 }
    },
    driver: {
      id: 'dr1',
      name: 'Trần Văn B',
      phone: '0912345678',
      vehicleType: 'motorbike',
      vehicleNumber: '59A-12345',
      rating: 4.8,
    },
    shippingFee: 25000,
    codAmount: 320000,
    createdAt: '2025-11-07T08:00:00',
    pickedUpAt: '2025-11-07T08:30:00',
    estimatedDeliveryTime: '2025-11-07T10:00:00',
    weight: 2.5,
    notes: 'Giao trước 10h sáng',
    trackingHistory: [
      {
        status: DeliveryStatus.Pending,
        timestamp: '2025-11-07T08:00:00',
        location: 'Cửa hàng Fresh Food',
        note: 'Đơn hàng đã được tạo'
      },
      {
        status: DeliveryStatus.PickedUp,
        timestamp: '2025-11-07T08:30:00',
        location: 'Cửa hàng Fresh Food',
        note: 'Tài xế đã lấy hàng'
      },
      {
        status: DeliveryStatus.InTransit,
        timestamp: '2025-11-07T09:00:00',
        location: 'Trung tâm phân loại Quận 1',
        note: 'Đang vận chuyển đến địa chỉ giao hàng'
      }
    ]
  },
  {
    id: 'd2',
    orderId: 'o2',
    trackingNumber: 'GHN2025110702',
    partner: DeliveryPartner.GHN,
    status: DeliveryStatus.Delivering,
    customerName: 'Trần Thị B',
    customerPhone: '0923456789',
    deliveryAddress: {
      address: '456 Lê Lợi',
      ward: 'Phường 4',
      district: 'Quận 3',
      city: 'TP. Hồ Chí Minh',
    },
    driver: {
      id: 'dr2',
      name: 'Lê Văn C',
      phone: '0934567890',
      vehicleType: 'motorbike',
      vehicleNumber: '59B-67890',
      rating: 4.6,
    },
    shippingFee: 30000,
    codAmount: 450000,
    createdAt: '2025-11-07T07:30:00',
    pickedUpAt: '2025-11-07T08:00:00',
    estimatedDeliveryTime: '2025-11-07T09:30:00',
    weight: 3.2,
    trackingHistory: [
      {
        status: DeliveryStatus.Pending,
        timestamp: '2025-11-07T07:30:00',
        note: 'Đơn hàng đã được tạo'
      },
      {
        status: DeliveryStatus.PickedUp,
        timestamp: '2025-11-07T08:00:00',
        note: 'Tài xế đã lấy hàng'
      },
      {
        status: DeliveryStatus.InTransit,
        timestamp: '2025-11-07T08:30:00',
        note: 'Đang vận chuyển'
      },
      {
        status: DeliveryStatus.Delivering,
        timestamp: '2025-11-07T09:15:00',
        note: 'Tài xế đang giao hàng'
      }
    ]
  },
  {
    id: 'd3',
    orderId: 'o5',
    trackingNumber: 'GHTK2025110703',
    partner: DeliveryPartner.GHTK,
    status: DeliveryStatus.Delivered,
    customerName: 'Vũ Văn E',
    customerPhone: '0945678901',
    deliveryAddress: {
      address: '789 Võ Văn Tần',
      district: 'Quận 3',
      city: 'TP. Hồ Chí Minh',
    },
    driver: {
      id: 'dr3',
      name: 'Phạm Văn D',
      phone: '0956789012',
      vehicleType: 'motorbike',
      rating: 4.9,
    },
    shippingFee: 20000,
    codAmount: 280000,
    createdAt: '2025-11-06T14:00:00',
    pickedUpAt: '2025-11-06T14:30:00',
    estimatedDeliveryTime: '2025-11-06T16:00:00',
    deliveredAt: '2025-11-06T15:45:00',
    weight: 1.8,
    proofOfDelivery: 'https://picsum.photos/seed/pod3/400/300',
    trackingHistory: [
      {
        status: DeliveryStatus.Pending,
        timestamp: '2025-11-06T14:00:00',
        note: 'Đơn hàng đã được tạo'
      },
      {
        status: DeliveryStatus.PickedUp,
        timestamp: '2025-11-06T14:30:00',
        note: 'Tài xế đã lấy hàng'
      },
      {
        status: DeliveryStatus.InTransit,
        timestamp: '2025-11-06T15:00:00',
        note: 'Đang vận chuyển'
      },
      {
        status: DeliveryStatus.Delivering,
        timestamp: '2025-11-06T15:30:00',
        note: 'Tài xế đang giao hàng'
      },
      {
        status: DeliveryStatus.Delivered,
        timestamp: '2025-11-06T15:45:00',
        note: 'Giao hàng thành công'
      }
    ]
  },
  {
    id: 'd4',
    orderId: 'o8',
    trackingNumber: 'NINJA2025110704',
    partner: DeliveryPartner.Ninja,
    status: DeliveryStatus.Failed,
    customerName: 'Hoàng Thị H',
    customerPhone: '0967890123',
    deliveryAddress: {
      address: '321 Điện Biên Phủ',
      district: 'Quận Bình Thạnh',
      city: 'TP. Hồ Chí Minh',
    },
    shippingFee: 35000,
    codAmount: 520000,
    createdAt: '2025-11-07T06:00:00',
    pickedUpAt: '2025-11-07T07:00:00',
    estimatedDeliveryTime: '2025-11-07T09:00:00',
    weight: 4.5,
    failureReason: 'Khách không nghe máy, hẹn giao lại',
    trackingHistory: [
      {
        status: DeliveryStatus.Pending,
        timestamp: '2025-11-07T06:00:00',
        note: 'Đơn hàng đã được tạo'
      },
      {
        status: DeliveryStatus.PickedUp,
        timestamp: '2025-11-07T07:00:00',
        note: 'Tài xế đã lấy hàng'
      },
      {
        status: DeliveryStatus.InTransit,
        timestamp: '2025-11-07T08:00:00',
        note: 'Đang vận chuyển'
      },
      {
        status: DeliveryStatus.Delivering,
        timestamp: '2025-11-07T08:45:00',
        note: 'Tài xế đang giao hàng'
      },
      {
        status: DeliveryStatus.Failed,
        timestamp: '2025-11-07T09:15:00',
        note: 'Khách không nghe máy, hẹn giao lại'
      }
    ]
  },
  {
    id: 'd5',
    orderId: 'o3',
    trackingNumber: 'SELF2025110705',
    partner: DeliveryPartner.SelfDelivery,
    status: DeliveryStatus.PickedUp,
    customerName: 'Lê Văn C',
    customerPhone: '0978901234',
    deliveryAddress: {
      address: '654 Cách Mạng Tháng 8',
      district: 'Quận 10',
      city: 'TP. Hồ Chí Minh',
    },
    shippingFee: 0,
    codAmount: 180000,
    createdAt: '2025-11-07T09:00:00',
    pickedUpAt: '2025-11-07T09:30:00',
    estimatedDeliveryTime: '2025-11-07T11:00:00',
    weight: 1.2,
    notes: 'Giao hàng tự quản, không qua đối tác',
    trackingHistory: [
      {
        status: DeliveryStatus.Pending,
        timestamp: '2025-11-07T09:00:00',
        note: 'Đơn hàng đã được tạo'
      },
      {
        status: DeliveryStatus.PickedUp,
        timestamp: '2025-11-07T09:30:00',
        note: 'Nhân viên đã lấy hàng'
      }
    ]
  },
  {
    id: 'd6',
    orderId: 'o4',
    trackingNumber: 'JT2025110706',
    partner: DeliveryPartner.JT,
    status: DeliveryStatus.Pending,
    customerName: 'Phạm Thị D',
    customerPhone: '0989012345',
    deliveryAddress: {
      address: '987 Nguyễn Thị Minh Khai',
      district: 'Quận 3',
      city: 'TP. Hồ Chí Minh',
    },
    shippingFee: 28000,
    codAmount: 395000,
    createdAt: '2025-11-07T09:45:00',
    estimatedDeliveryTime: '2025-11-07T12:00:00',
    weight: 2.8,
    trackingHistory: [
      {
        status: DeliveryStatus.Pending,
        timestamp: '2025-11-07T09:45:00',
        note: 'Chờ tài xế đến lấy hàng'
      }
    ]
>>>>>>> delivery
  },
];