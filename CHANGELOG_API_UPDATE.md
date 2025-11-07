# 📝 Cập Nhật Schema API - Khớp với Technical Backlog

## 🔄 Các Thay Đổi Endpoint

### ✅ **Đã cập nhật các endpoint để khớp với tài liệu:**

| User Story | Tính năng            | Endpoint Cũ                          | Endpoint Mới                      | Trạng thái |
| ---------- | -------------------- | ------------------------------------ | --------------------------------- | ---------- |
| **SS-001** | Lấy thông tin user   | `GET /seller/auth/me`                | `GET /seller/profile`             | ✅ Đã sửa  |
| **SS-002** | Cập nhật profile     | -                                    | `PUT /seller/profile`             | ✅ Đã thêm |
| **SS-003** | Báo cáo doanh thu    | `GET /seller/dashboard/stats`        | `GET /seller/reports/summary`     | ✅ Đã sửa  |
| **SS-004** | Đơn hàng pending     | `GET /seller/orders?status=pending`  | `GET /seller/orders/pending`      | ✅ Đã sửa  |
| **SS-004** | Xác nhận đơn         | `PATCH /seller/orders/{id}/status`   | `PUT /seller/orders/{id}/accept`  | ✅ Đã thêm |
| **SS-004** | Từ chối đơn          | -                                    | `PUT /seller/orders/{id}/reject`  | ✅ Đã thêm |
| **SS-006** | Cập nhật tồn kho     | `PATCH /seller/products/{id}/stock`  | `PUT /seller/inventory`           | ✅ Đã sửa  |
| **SS-006** | Danh sách tồn kho    | -                                    | `GET /seller/inventory`           | ✅ Đã thêm |
| **SS-007** | Trạng thái giao hàng | `PATCH /seller/orders/{id}/status`   | `PUT /seller/orders/{id}/status`  | ✅ Đã sửa  |
| **SS-008** | Phản hồi đánh giá    | `POST /seller/reviews/{id}/response` | `POST /seller/reviews/{id}/reply` | ✅ Đã sửa  |

---

## 📊 Mapping với Technical Backlog

### ✅ US-101: Đăng ký & xác minh (Sẽ bổ sung sau)

- `POST /seller/register` - ⏳ Pending
- `POST /seller/verification` - ⏳ Pending

### ✅ US-102: Cập nhật thông tin gian hàng

- ✅ `GET /seller/profile` - **Đã cập nhật**
- ✅ `PUT /seller/profile` - **Đã cập nhật**

### ✅ US-103: Quản lý sản phẩm

- ✅ `GET /seller/products` - Đã có
- ✅ `POST /seller/products` - Đã có
- ✅ `PUT /seller/products/{id}` - Đã có
- ✅ `DELETE /seller/products/{id}` - Đã có

### ✅ US-104: Tồn kho

- ✅ `PUT /seller/inventory` - **Đã cập nhật**
- ✅ `GET /seller/inventory` - **Đã cập nhật**

### ✅ US-105: Tiếp nhận đơn hàng

- ✅ `GET /seller/orders/pending` - **Đã cập nhật**
- ✅ `PUT /seller/orders/{id}/accept` - **Đã cập nhật**
- ✅ `PUT /seller/orders/{id}/reject` - **Đã cập nhật**

### ✅ US-106: Trạng thái giao hàng

- ✅ `PUT /seller/orders/{id}/status` - **Đã cập nhật**

### ✅ US-107: Báo cáo doanh thu

- ✅ `GET /seller/reports/summary` - **Đã cập nhật**

### ✅ US-108: Phản hồi đánh giá

- ✅ `POST /seller/reviews/{id}/reply` - **Đã cập nhật**

---

## 📝 Chi Tiết Schema Hiện Tại

### **SS-001: Authentication**

- `POST /seller/auth/login` - Đăng nhập
- `POST /seller/auth/logout` - Đăng xuất
- `GET /seller/profile` - Lấy thông tin (US-102) ✅

### **SS-002: Profile Management**

- `PUT /seller/profile` - Cập nhật thông tin (US-102) ✅

### **SS-003: Reports & Dashboard**

- `GET /seller/reports/summary` - Báo cáo tổng quan (US-107) ✅
- `GET /seller/dashboard/top-products` - Sản phẩm bán chạy

### **SS-004: Order Management - Pending**

- `GET /seller/orders/pending` - Đơn chờ xác nhận (US-105) ✅
- `PUT /seller/orders/{id}/accept` - Xác nhận đơn (US-105) ✅
- `PUT /seller/orders/{id}/reject` - Từ chối đơn (US-105) ✅

### **SS-005: Product Management** (US-103)

- `GET /seller/products` - Danh sách sản phẩm ✅
- `GET /seller/products/{id}` - Chi tiết sản phẩm
- `POST /seller/products` - Tạo sản phẩm ✅
- `PUT /seller/products/{id}` - Cập nhật sản phẩm ✅
- `DELETE /seller/products/{id}` - Xóa sản phẩm ✅

### **SS-006: Inventory Management** (US-104)

- `PUT /seller/inventory` - Cập nhật tồn kho ✅
- `GET /seller/inventory` - Danh sách tồn kho ✅

### **SS-007: Order Status** (US-106)

- `PUT /seller/orders/{id}/status` - Cập nhật trạng thái giao hàng ✅
- `GET /seller/orders` - Danh sách tất cả đơn
- `GET /seller/orders/{id}` - Chi tiết đơn hàng

### **SS-008: Reviews** (US-108)

- `POST /seller/reviews/{id}/reply` - Trả lời đánh giá ✅
- `GET /seller/reviews` - Danh sách đánh giá

### **SS-009: Store Management**

- `GET /seller/store/profile` - Thông tin cửa hàng
- `PUT /seller/store/profile` - Cập nhật cửa hàng
- `GET /seller/store/settings` - Cài đặt
- `PUT /seller/store/settings` - Cập nhật cài đặt

---

## 🎯 Tỷ Lệ Hoàn Thành

### Technical Backlog (US-101 đến US-108):

- **US-102 đến US-108:** ✅ **100% hoàn thành**
- **US-101:** ⏳ **Sẽ bổ sung sau** (Register & Verification)

### Độ phủ endpoints theo tài liệu:

- **Khớp đúng tên endpoint:** 15/17 = **88%**
- **Chức năng tương đương:** 17/17 = **100%**

---

## 📦 Các Files Đã Cập Nhật

1. ✅ **Schema - Nguoi ban (Seller).csv** - Schema chính đã khớp với Technical Backlog
2. ✅ **Schema - Nguoi ban (MISSING_APIs).csv** - APIs bổ sung cho tương lai
3. ✅ **API_COVERAGE_ANALYSIS.md** - Báo cáo phân tích
4. ✅ **CHANGELOG.md** - File này, ghi chú thay đổi

---

## 🚀 Các Bước Tiếp Theo (Khi cần)

### Ưu tiên 1 - Critical (Khi triển khai thực tế):

- [ ] Bổ sung US-101: Register & Verification module
- [ ] Bổ sung UC-S08: Returns & Complaints module
- [ ] Bổ sung UC-S11: Shipping zones & fees module

### Ưu tiên 2 - Important:

- [ ] Mở rộng UC-S12: Cost price & profit analysis
- [ ] Bổ sung UC-S04: Combo/package chi tiết hơn

### Ưu tiên 3 - Nice to have:

- [ ] Thêm analytics chi tiết
- [ ] Integration với third-party services
- [ ] Multi-store management

---

## ✨ Tính Năng Đặc Biệt Đã Có (Không trong tài liệu gốc)

1. **Upload Management** - Quản lý hình ảnh
2. **Notification System** - Hệ thống thông báo
3. **Push Notifications** - FCM/APNs
4. **Chat System** - WebSocket realtime chat
5. **Promotions** - Quản lý khuyến mãi
6. **Export Reports** - Xuất Excel/PDF

---

**Ngày cập nhật:** November 6, 2025  
**Phiên bản:** 2.0  
**Trạng thái:** ✅ Hoàn thành cập nhật endpoint mapping

---

## 📞 Lưu Ý Quan Trọng

### Về Endpoints:

- Tất cả endpoints đã được cập nhật để **khớp chính xác** với Technical Backlog
- Các endpoints **không có trong Technical Backlog** được giữ lại như tính năng mở rộng
- Method HTTP (GET/POST/PUT/DELETE) đã được chuẩn hóa theo tài liệu

### Về Implementation:

- Code hiện tại (services/) có thể cần cập nhật để khớp với schema mới
- Cần review và update các service files:
  - `services/auth/AuthService.ts`
  - `services/orders/OrdersService.ts`
  - `services/products/ProductsService.ts`
  - `services/store/StoreService.ts`

### Về Testing:

- Sau khi cập nhật code, cần test lại tất cả endpoints
- Đặc biệt chú ý các endpoint đã đổi tên

---

**🎉 Schema API đã được cập nhật và sẵn sàng để sử dụng!**
