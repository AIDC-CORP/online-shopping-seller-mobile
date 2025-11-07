# 📋 API Schema Documentation - Seller Platform

## 📦 Các file đã tạo

Tôi đã tạo 2 file tài liệu API cho hệ thống Seller:

### 1. **Schema - Nguoi ban (Seller).csv**
- File CSV chứa đầy đủ thông tin API
- Có thể mở bằng Excel, Google Sheets, hoặc bất kỳ ứng dụng spreadsheet nào
- Bao gồm: ID User Story, Tính năng, Giao thức, Endpoint, Đầu vào, Đầu ra, Ghi chú

### 2. **API_Schema_Seller.html** ⭐ (Recommended)
- File HTML đẹp mắt, dễ đọc
- **Cách mở:** Double-click vào file hoặc kéo thả vào trình duyệt
- Có tính năng tìm kiếm realtime
- Giao diện đẹp với màu sắc phân loại theo HTTP methods
- Responsive, xem được trên mobile

## 📊 Thống kê API

- **Tổng số APIs:** 60+ endpoints
- **User Stories:** 13 tính năng chính
- **Modules:** 5 modules (Auth, Dashboard, Orders, Products, Store)

## 🎯 Các tính năng chính

### SS-001: Authentication (Xác thực)
- Đăng nhập/Đăng xuất
- Lấy thông tin người dùng

### SS-002: Dashboard (Bảng điều khiển)
- Thống kê tổng quan (doanh thu, đơn hàng)
- Sản phẩm bán chạy

### SS-003: Orders (Quản lý đơn hàng)
- Xem danh sách & chi tiết đơn hàng
- Cập nhật trạng thái đơn hàng
- Hủy đơn hàng

### SS-004: Products (Quản lý sản phẩm)
- CRUD sản phẩm (Thêm/Sửa/Xóa)
- Quản lý tồn kho
- Bật/Tắt hiển thị sản phẩm

### SS-005: Store (Quản lý cửa hàng)
- Xem/Cập nhật thông tin cửa hàng
- Cài đặt cửa hàng (ngôn ngữ, múi giờ, thuế)

### SS-006: Upload (Tải ảnh)
- Upload ảnh sản phẩm
- Upload logo/ảnh bìa cửa hàng

### SS-007: Notifications (Thông báo)
- Xem danh sách thông báo
- Đánh dấu đã đọc
- Xóa thông báo

### SS-008: Push Notifications
- Thông báo đơn hàng mới
- Cảnh báo tồn kho thấp

### SS-009: Reports (Báo cáo)
- Báo cáo doanh thu theo thời gian
- Sản phẩm bán chạy
- Phân tích theo danh mục

### SS-010: Chat (Trò chuyện)
- WebSocket chat realtime với khách hàng
- Danh sách cuộc trò chuyện
- Lịch sử tin nhắn

### SS-011: Promotions (Khuyến mãi)
- Quản lý khuyến mãi
- Tạo/Sửa/Xóa chương trình khuyến mãi

### SS-012: Reviews (Đánh giá)
- Xem đánh giá sản phẩm
- Phản hồi đánh giá khách hàng

### SS-013: Export (Xuất báo cáo)
- Xuất báo cáo Excel/PDF

## 🔍 Cách sử dụng file HTML

1. **Mở file:** 
   - Double-click vào `API_Schema_Seller.html`
   - Hoặc kéo thả vào trình duyệt (Chrome, Firefox, Edge, Safari)

2. **Tìm kiếm:**
   - Sử dụng ô search ở trên để tìm API
   - Tìm theo: tên tính năng, endpoint, method (GET/POST/PUT/DELETE)
   - Ví dụ: gõ "product" để tìm tất cả API liên quan đến sản phẩm

3. **Xem chi tiết:**
   - Hover vào các row để highlight
   - Màu sắc HTTP methods:
     - 🟢 **GET** (màu xanh dương): Lấy dữ liệu
     - 🟢 **POST** (màu xanh lá): Tạo mới
     - 🟠 **PUT/PATCH** (màu cam): Cập nhật
     - 🔴 **DELETE** (màu đỏ): Xóa
     - 🟣 **WebSocket** (màu tím): Realtime
     - 🔴 **Push** (màu đỏ): Push notification

## 📥 Cách tải về

Cả 2 file đều nằm trong thư mục:
```
online-shopping-seller/
├── Schema - Nguoi ban (Seller).csv
└── API_Schema_Seller.html
```

Bạn có thể:
- Copy sang máy khác
- Gửi qua email
- Chia sẻ với team
- Mở trực tiếp từ thư mục

## 💡 Lưu ý

- Tất cả endpoints (trừ login) đều yêu cầu **Bearer Token** trong header
- Format timestamp: **ISO 8601** (ví dụ: `2025-11-06T10:30:00Z`)
- Pagination thường có: `page`, `limit`, `totalPages`, `totalItems`
- Upload file sử dụng `multipart/form-data`

## 🎨 So sánh với Schema Người mua

Schema Seller này được thiết kế dựa trên:
- Tham khảo format từ `Schema - Ngừoi mua.csv`
- Phân tích codebase hiện tại trong `services/`
- Bổ sung các tính năng quản lý đặc thù cho Seller

## 🚀 Tính năng nổi bật của file HTML

✅ **Responsive Design** - Xem tốt trên mọi thiết bị
✅ **Search Realtime** - Tìm kiếm nhanh chóng
✅ **Beautiful UI** - Giao diện gradient đẹp mắt
✅ **Color Coding** - Phân biệt HTTP methods bằng màu
✅ **Statistics** - Hiển thị thống kê tổng quan
✅ **Copy-friendly** - Code format dễ copy
✅ **No Dependencies** - Không cần internet, chạy offline

---

**Phát triển bởi:** AIDC Corp
**Ngày:** November 6, 2025
**Version:** 1.0
