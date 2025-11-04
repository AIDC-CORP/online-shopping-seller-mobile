
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
