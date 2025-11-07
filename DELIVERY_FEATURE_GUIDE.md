# 🚚 Delivery Management Feature Guide

## Tổng quan
Feature quản lý giao hàng cho phép người bán theo dõi và quản lý toàn bộ quy trình vận chuyển đơn hàng từ khi tạo đơn cho đến khi giao hàng thành công.

## Tính năng chính

### 1. **Danh sách đơn giao hàng**
- Hiển thị tất cả đơn giao hàng với thông tin đầy đủ
- Card view với màu sắc phân biệt theo trạng thái
- Thông tin nổi bật:
  - Mã vận đơn (tracking number)
  - Đối tác vận chuyển (GrabExpress, GHN, GHTK, v.v.)
  - Trạng thái giao hàng (7 trạng thái)
  - Thông tin khách hàng & địa chỉ
  - Thông tin tài xế (nếu có)
  - Phí vận chuyển & COD amount
  - Thời gian tạo & dự kiến giao

### 2. **Bộ lọc theo trạng thái**
- **Tất cả**: Xem toàn bộ đơn giao hàng
- **Chờ lấy hàng**: Đơn mới tạo, chờ tài xế đến lấy
- **Đang vận chuyển**: Hàng đang được vận chuyển đến khu vực giao
- **Đang giao**: Tài xế đang giao hàng cho khách
- **Đã giao**: Giao hàng thành công
- **Thất bại**: Giao không thành công (có lý do)

### 3. **Chi tiết đơn giao hàng**
Modal chi tiết với đầy đủ thông tin:

#### 📦 Thông tin giao hàng
- Tên khách hàng
- Số điện thoại (có nút gọi trực tiếp)
- Địa chỉ giao hàng chi tiết
- Ghi chú đặc biệt (nếu có)

#### 🏍️ Thông tin tài xế
- Tên tài xế
- Số điện thoại (có nút gọi)
- Biển số xe
- Đánh giá (rating)

#### 💰 Chi phí
- Phí vận chuyển
- Tiền thu hộ (COD)
- Khối lượng hàng

#### 📍 Lịch sử vận chuyển
- Timeline đầy đủ với các mốc thời gian
- Trạng thái tại mỗi điểm
- Vị trí & ghi chú
- Highlight trạng thái hiện tại

#### ⚠️ Xử lý lỗi
- Hiển thị lý do giao hàng thất bại
- Nút "Hẹn giao lại" cho đơn thất bại

#### 📸 Chứng từ
- Ảnh chứng nhận giao hàng (POD)
- Hiển thị khi giao thành công

### 4. **Liên lạc nhanh**
- Nút gọi điện trực tiếp cho khách hàng
- Nút gọi điện trực tiếp cho tài xế
- Tích hợp với app điện thoại

### 5. **Đối tác vận chuyển**
Hỗ trợ 8 đối tác:
- 🚗 **GrabExpress**: Giao nhanh trong nội thành
- 🏍️ **GoJek**: Dịch vụ giao hàng linh hoạt
- 📦 **Ninja Van**: Chuyển phát nhanh
- 🚚 **GHTK**: Giao hàng tiết kiệm
- 🚛 **GHN**: Giao hàng nhanh toàn quốc
- 📮 **Viettel Post**: Bưu điện Viettel
- 📫 **J&T Express**: Chuyển phát J&T
- 🛵 **Tự giao hàng**: Nhân viên cửa hàng tự giao

## Cấu trúc dữ liệu

### Delivery Interface
```typescript
interface Delivery {
  id: string;
  orderId: string;
  trackingNumber: string;
  partner: DeliveryPartner;
  status: DeliveryStatus;
  
  // Customer info
  customerName: string;
  customerPhone: string;
  deliveryAddress: DeliveryLocation;
  
  // Driver info
  driver?: DeliveryDriver;
  
  // Pricing
  shippingFee: number;
  codAmount?: number;
  
  // Timestamps
  createdAt: string;
  pickedUpAt?: string;
  estimatedDeliveryTime?: string;
  deliveredAt?: string;
  
  // Package info
  weight?: number;
  dimensions?: { length, width, height };
  
  // Additional
  notes?: string;
  failureReason?: string;
  proofOfDelivery?: string;
  
  // Tracking
  trackingHistory: DeliveryTrackingPoint[];
}
```

### DeliveryStatus Enum (7 trạng thái)
```typescript
enum DeliveryStatus {
  Pending = 'Chờ lấy hàng',
  PickedUp = 'Đã lấy hàng',
  InTransit = 'Đang vận chuyển',
  Delivering = 'Đang giao',
  Delivered = 'Đã giao',
  Failed = 'Giao thất bại',
  Returned = 'Đã hoàn',
}
```

### Màu sắc theo trạng thái
- **Chờ lấy hàng**: Vàng (#f59e0b)
- **Đã lấy hàng**: Xanh dương (#3b82f6)
- **Đang vận chuyển**: Xanh tím (#6366f1)
- **Đang giao**: Tím (#8b5cf6)
- **Đã giao**: Xanh lá (#10b981)
- **Thất bại**: Đỏ (#ef4444)
- **Đã hoàn**: Xám (#6b7280)

## Files Structure
```
src/
  features/
    delivery/
      DeliveryScreen.tsx          # Main screen
  shared/
    types/
      index.ts                    # Types & enums
    data/
      mockData.ts                 # Mock delivery data
  components/
    icons/
      index.tsx                   # TruckIcon
app/
  (main)/
    delivery.tsx                  # Route file
    _layout.tsx                   # Tab navigation (updated)
```

## Mock Data
File đã có 6 mẫu delivery với các trạng thái khác nhau:
- `d1`: GrabExpress - Đang vận chuyển
- `d2`: GHN - Đang giao (có tài xế)
- `d3`: GHTK - Đã giao (có POD)
- `d4`: Ninja Van - Thất bại (có lý do)
- `d5`: Tự giao hàng - Đã lấy hàng
- `d6`: J&T Express - Chờ lấy hàng

## UI/UX Features

### 1. **Visual Design**
- Màu sắc rõ ràng phân biệt trạng thái
- Icon đại diện cho từng đối tác
- Shadow & elevation tạo độ sâu
- Border colors highlight quan trọng

### 2. **Responsive Cards**
- Compact view trong danh sách
- Đầy đủ thông tin trên card
- Touch feedback rõ ràng
- Badge cho COD & trạng thái

### 3. **Interactive Elements**
- Nút gọi điện trực tiếp
- Scroll horizontal cho tabs
- Modal toàn màn hình cho chi tiết
- Timeline visualization

### 4. **Information Hierarchy**
- Tracking number nổi bật
- Status badge ở vị trí dễ nhìn
- Customer info với background khác biệt
- Driver info với màu xanh lá

## Tích hợp với Orders
Mỗi delivery liên kết với một order thông qua `orderId`. Có thể:
- Từ OrdersScreen → tạo Delivery
- Từ Delivery → xem Order details
- Đồng bộ trạng thái order & delivery

## Future Enhancements
1. **Real-time Tracking**: Tích hợp GPS tracking
2. **Push Notifications**: Thông báo thay đổi trạng thái
3. **Map Integration**: Hiển thị vị trí trên bản đồ
4. **Delivery Assignment**: Gán tài xế tự động
5. **Rate Calculation**: Tính phí ship tự động theo khoảng cách
6. **Bulk Actions**: Xử lý nhiều đơn cùng lúc
7. **Export Reports**: Xuất báo cáo giao hàng
8. **Analytics Dashboard**: Thống kê hiệu suất giao hàng

## API Integration (Ready)
Schema đã chuẩn bị sẵn các endpoints:

### SS-009: Delivery Management
- `GET /api/seller/deliveries` - Lấy danh sách giao hàng
- `GET /api/seller/deliveries/:id` - Chi tiết đơn giao hàng
- `POST /api/seller/deliveries` - Tạo đơn giao hàng mới
- `PUT /api/seller/deliveries/:id` - Cập nhật thông tin
- `PUT /api/seller/deliveries/:id/status` - Cập nhật trạng thái
- `POST /api/seller/deliveries/:id/reschedule` - Hẹn giao lại
- `GET /api/seller/deliveries/:id/tracking` - Lịch sử vận chuyển

## Testing Checklist
- [ ] Hiển thị đúng 6 deliveries trong mockData
- [ ] Filter theo trạng thái hoạt động
- [ ] Badge count chính xác cho mỗi tab
- [ ] Modal chi tiết mở được
- [ ] Nút gọi điện hoạt động (test trên device thật)
- [ ] Timeline hiển thị đúng thứ tự
- [ ] Ảnh POD load được
- [ ] Scroll smooth không lag
- [ ] Tab bar không che content (paddingBottom: 110)
- [ ] Colors & icons hiển thị đúng

## Demo Flow
1. Mở app → Tab "Giao hàng" 🚚
2. Xem danh sách 6 đơn giao hàng
3. Chọn tab "Đang giao" → Thấy 1 đơn
4. Tap vào đơn → Mở modal chi tiết
5. Xem timeline vận chuyển
6. Thử nút gọi điện khách hàng
7. Thử nút gọi điện tài xế
8. Xem ảnh POD (nếu đã giao)
9. Đóng modal → Thử filter khác
10. Check đơn "Thất bại" → Xem lý do & nút "Hẹn giao lại"

---

**Created**: November 7, 2025
**Status**: ✅ Production Ready
**Version**: 1.0.0
