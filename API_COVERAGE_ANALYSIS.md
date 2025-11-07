# 📊 Phân Tích Độ Phủ API - Seller Platform

## 🎯 Tổng Quan So Sánh

### Nguồn tài liệu:

1. **Technical Backlog - Người bán.csv** (US-101 đến US-108)
2. **Use case - UC - Người bán hàng.tsv** (UC-S01 đến UC-S12)
3. **Schema API đã tạo** (SS-001 đến SS-013)

---

## ✅ Các API ĐÃ CÓ trong Schema

### 1. ✅ US-101: Đăng ký & xác minh cửa hàng

**Technical Backlog yêu cầu:**

- `/seller/register` (POST) - Tạo hồ sơ cửa hàng
- `/seller/verification` (POST) - Gửi giấy tờ xác minh

**Trạng thái:** ❌ **THIẾU HOÀN TOÀN**

- Schema hiện tại chỉ có login, không có register/verification
- Cần bổ sung UC-S01 (Đăng ký / xác minh người bán)

---

### 2. ✅ US-102: Cập nhật thông tin gian hàng

**Technical Backlog yêu cầu:**

- `/seller/profile` (GET/PUT)

**Trạng thái:** ✅ **ĐÃ CÓ** (SS-005)

- `GET /seller/store/profile` ✅
- `PUT /seller/store/profile` ✅
- Endpoint khác nhau nhưng chức năng tương đương

---

### 3. ✅ US-103: Quản lý sản phẩm

**Technical Backlog yêu cầu:**

- `/seller/products` (GET) - Danh sách
- `/seller/products` (POST) - Tạo mới
- `/seller/products/{id}` (PUT) - Sửa
- `/seller/products/{id}` (DELETE) - Xóa

**Trạng thái:** ✅ **ĐÃ CÓ ĐẦY ĐỦ** (SS-004)

- `GET /seller/products` ✅
- `POST /seller/products` ✅
- `PUT /seller/products/{id}` ✅
- `DELETE /seller/products/{id}` ✅
- Bonus: `GET /seller/products/{id}` (chi tiết)
- Bonus: `PATCH /seller/products/{id}/toggle-active` (ẩn/hiện)

---

### 4. ✅ US-104: Tồn kho

**Technical Backlog yêu cầu:**

- `/seller/inventory` (PUT) - Cập nhật tồn kho
- `/seller/inventory` (GET) - Lấy danh sách tồn kho

**Trạng thái:** ⚠️ **CÓ NHƯNG KHÁC ENDPOINT** (SS-004)

- Schema có: `PATCH /seller/products/{id}/stock` ✅
- Chức năng tương đương nhưng endpoint khác
- Có thể cần thêm GET `/seller/inventory` để xem tổng quan tồn kho

---

### 5. ✅ US-105: Tiếp nhận đơn hàng

**Technical Backlog yêu cầu:**

- `/seller/orders/pending` (GET) - Đơn chờ xác nhận
- `/seller/orders/{id}/accept` (PUT) - Xác nhận
- `/seller/orders/{id}/reject` (PUT) - Từ chối

**Trạng thái:** ⚠️ **CÓ NHƯNG KHÁC ENDPOINT** (SS-003)

- Schema có: `GET /seller/orders?status=pending` ✅ (tương đương)
- Schema có: `PATCH /seller/orders/{id}/status` ✅ (có thể accept/reject)
- Bonus: `POST /seller/orders/{id}/cancel` ✅

---

### 6. ✅ US-106: Trạng thái giao hàng

**Technical Backlog yêu cầu:**

- `/seller/orders/{id}/status` (PUT) - Cập nhật trạng thái

**Trạng thái:** ✅ **ĐÃ CÓ** (SS-003)

- `PATCH /seller/orders/{id}/status` ✅

---

### 7. ✅ US-107: Báo cáo doanh thu

**Technical Backlog yêu cầu:**

- `/seller/reports/summary` (GET) - Báo cáo tổng quan

**Trạng thái:** ✅ **ĐÃ CÓ & MỞ RỘNG** (SS-002, SS-009)

- `GET /seller/dashboard/stats` ✅ (thống kê tổng quan)
- `GET /seller/reports/revenue` ✅ (báo cáo chi tiết)
- `GET /seller/reports/top-products` ✅
- `GET /seller/reports/categories` ✅
- Bonus: `GET /seller/reports/export` ✅

---

### 8. ✅ US-108: Phản hồi đánh giá

**Technical Backlog yêu cầu:**

- `/seller/reviews/{id}/reply` (POST)

**Trạng thái:** ✅ **ĐÃ CÓ** (SS-012)

- `POST /seller/reviews/{id}/response` ✅ (endpoint tương tự)
- Bonus: `GET /seller/reviews` ✅ (xem danh sách)

---

## 📋 Phân Tích Use Cases

### UC-S01: Đăng ký / xác minh người bán

**Trạng thái:** ❌ **THIẾU**
**Cần bổ sung:**

- `POST /seller/register` - Đăng ký tài khoản seller
- `POST /seller/verification/submit` - Gửi giấy tờ xác minh
- `GET /seller/verification/status` - Kiểm tra trạng thái xét duyệt
- `PUT /seller/verification/resubmit` - Gửi lại sau khi bị từ chối

---

### UC-S02: Tạo & quản lý gian hàng

**Trạng thái:** ✅ **ĐÃ CÓ** (SS-005)

- Quản lý thông tin cửa hàng ✅
- Cài đặt cửa hàng ✅

---

### UC-S03: Quản lý sản phẩm

**Trạng thái:** ✅ **ĐÃ CÓ ĐẦY ĐỦ** (SS-004)

---

### UC-S04: Quản lý khuyến mãi / combo

**Trạng thái:** ✅ **ĐÃ CÓ** (SS-011)

- CRUD khuyến mãi ✅
- **Note:** Use case đề cập "combo suất ăn" - có thể cần mở rộng

---

### UC-S05: Nhận & xác nhận đơn hàng

**Trạng thái:** ✅ **ĐÃ CÓ** (SS-003)

---

### UC-S06: Xử lý đơn hàng / đóng gói

**Trạng thái:** ✅ **ĐÃ CÓ** (SS-003)

- Cập nhật trạng thái đơn hàng ✅

---

### UC-S07: Giao hàng / cập nhật trạng thái

**Trạng thái:** ✅ **ĐÃ CÓ** (SS-003)

---

### UC-S08: Xử lý hoàn trả / đổi / khiếu nại

**Trạng thái:** ❌ **THIẾU**
**Cần bổ sung:**

- `GET /seller/returns` - Danh sách yêu cầu hoàn trả
- `GET /seller/returns/{id}` - Chi tiết yêu cầu
- `POST /seller/returns/{id}/approve` - Chấp nhận hoàn trả
- `POST /seller/returns/{id}/reject` - Từ chối hoàn trả
- `GET /seller/complaints` - Danh sách khiếu nại
- `POST /seller/complaints/{id}/resolve` - Xử lý khiếu nại

---

### UC-S09: Trả lời phản hồi / chat với người mua

**Trạng thái:** ✅ **ĐÃ CÓ ĐẦY ĐỦ** (SS-010, SS-012)

- WebSocket chat realtime ✅
- Phản hồi đánh giá ✅

---

### UC-S10: Xem báo cáo & thống kê

**Trạng thái:** ✅ **ĐÃ CÓ ĐẦY ĐỦ** (SS-002, SS-009)

---

### UC-S11: Quản lý vùng phục vụ & phí vận chuyển

**Trạng thái:** ⚠️ **THIẾU MỘT PHẦN**
**Cần bổ sung:**

- `GET /seller/shipping/zones` - Danh sách vùng giao hàng
- `POST /seller/shipping/zones` - Thêm vùng mới
- `PUT /seller/shipping/zones/{id}` - Cập nhật vùng
- `DELETE /seller/shipping/zones/{id}` - Xóa vùng
- `GET /seller/shipping/fees` - Bảng phí vận chuyển
- `PUT /seller/shipping/fees` - Cập nhật phí theo vùng

**Note:** Schema hiện có `shippingEnabled` trong settings nhưng chưa có quản lý chi tiết

---

### UC-S12: Nhập giá vốn / chi phí

**Trạng thái:** ⚠️ **THIẾU MỘT PHẦN**
**Cần bổ sung vào Product schema:**

- Thêm field `costPrice` (giá vốn) vào product
- Thêm field `shippingCost` (chi phí vận chuyển)
- API tính lợi nhuận: `GET /seller/products/{id}/profit-analysis`

---

## 🎨 Các Tính Năng BỔ SUNG trong Schema (không có trong tài liệu gốc)

### ✨ Tính năng thêm (Good to have):

1. **SS-006: Upload** ⭐ - Quản lý hình ảnh
2. **SS-007: Notifications** ⭐ - Hệ thống thông báo
3. **SS-008: Push Notifications** ⭐ - Thông báo realtime
4. **SS-013: Export Reports** ⭐ - Xuất báo cáo Excel/PDF

---

## 📊 Bảng Tổng Hợp

| Use Case / US | Yêu cầu              | Trạng thái | Ghi chú                    |
| ------------- | -------------------- | ---------- | -------------------------- |
| US-101        | Đăng ký & xác minh   | ❌ THIẾU   | Cần bổ sung hoàn toàn      |
| US-102        | Cập nhật thông tin   | ✅ ĐÃ CÓ   | Endpoint khác nhưng OK     |
| US-103        | Quản lý sản phẩm     | ✅ ĐẦY ĐỦ  | CRUD đầy đủ + bonus        |
| US-104        | Tồn kho              | ⚠️ CÓ      | Endpoint khác, cần xem lại |
| US-105        | Tiếp nhận đơn        | ✅ ĐÃ CÓ   | Có thể dùng query params   |
| US-106        | Trạng thái giao hàng | ✅ ĐÃ CÓ   | OK                         |
| US-107        | Báo cáo              | ✅ MỞ RỘNG | Có nhiều hơn yêu cầu       |
| US-108        | Phản hồi đánh giá    | ✅ ĐÃ CÓ   | OK                         |
| UC-S08        | Hoàn trả/Khiếu nại   | ❌ THIẾU   | Cần module mới             |
| UC-S11        | Vùng giao hàng       | ❌ THIẾU   | Cần module shipping        |
| UC-S12        | Giá vốn              | ⚠️ THIẾU   | Cần thêm vào Product       |

---

## 🚀 Khuyến Nghị Hành Động

### Ưu tiên CAO (Critical):

1. ✅ **Bổ sung US-101**: Module đăng ký & xác minh seller
2. ✅ **Bổ sung UC-S08**: Module hoàn trả & khiếu nại
3. ✅ **Bổ sung UC-S11**: Module quản lý vùng giao hàng & phí ship

### Ưu tiên TRUNG (Important):

4. ⚠️ **Mở rộng UC-S12**: Thêm giá vốn vào sản phẩm
5. ⚠️ **Chuẩn hóa US-104**: Thống nhất endpoint inventory
6. ⚠️ **Mở rộng UC-S04**: Chi tiết hơn về combo/voucher

### Ưu tiên THẤP (Nice to have):

7. 💡 Thêm API phân tích chi tiết
8. 💡 Thêm API quản lý nhân viên (nếu có)
9. 💡 Thêm API tích hợp bên thứ 3

---

## 📈 Tỷ Lệ Độ Phủ

### Technical Backlog (US-101 đến US-108):

- **Đã có đầy đủ:** 5/8 = **62.5%**
- **Có nhưng khác endpoint:** 2/8 = **25%**
- **Thiếu hoàn toàn:** 1/8 = **12.5%**
- **Tổng độ phủ:** ~**87.5%** ✅

### Use Cases (UC-S01 đến UC-S12):

- **Đã có đầy đủ:** 7/12 = **58%**
- **Thiếu một phần:** 2/12 = **17%**
- **Thiếu hoàn toàn:** 3/12 = **25%**
- **Tổng độ phủ:** ~**75%** ⚠️

### Đánh giá chung:

**🎯 Độ phủ trung bình: ~80%** - Khá tốt!

Schema hiện tại đã cover được phần lớn yêu cầu, đặc biệt xuất sắc ở:

- ✅ Quản lý sản phẩm
- ✅ Quản lý đơn hàng
- ✅ Báo cáo & thống kê
- ✅ Chat & communication

Cần bổ sung thêm:

- ❌ Module đăng ký/xác minh
- ❌ Module hoàn trả/khiếu nại
- ❌ Module shipping zones

---

**Ngày phân tích:** November 6, 2025
**Version:** 1.0
