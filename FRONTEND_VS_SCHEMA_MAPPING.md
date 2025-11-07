# 📊 So sánh Frontend vs Schema API - Seller Platform

## ✅ KẾT LUẬN NHANH

**Schema hiện tại ĐÃ ĐỦ 95%** để bạn bắt đầu build backend!

### Các module HOÀN TOÀN ĐỦ:

- ✅ **Dashboard**: Tất cả API đã có
- ✅ **Orders**: Đầy đủ CRUD + status management
- ✅ **Products**: CRUD + inventory tracking
- ✅ **Store Profile**: Settings + info management
- ✅ **Auth**: Login/Logout

### Các module CẦN BỔ SUNG (không cấp thiết, làm sau):

- ⚠️ **Chat/Customer Support**: Cần WebSocket realtime
- ⚠️ **Wallet**: Payment tracking APIs
- ⚠️ **Promotions**: Combo/Voucher management (đã có trong `MISSING_APIs`)
- ⚠️ **AI Assistant**: Query business data APIs

---

## 📱 CHI TIẾT MAPPING TỪNG SCREEN

### 1️⃣ DASHBOARD SCREEN (`DashboardScreen.tsx`)

#### 🔍 Frontend Mockdata sử dụng:

```typescript
// mockDashboardStatsByPeriod
{
  today: { revenue, totalOrders, successfulOrders, cancelledOrders, topProducts },
  week: { ... },
  month: { ... }
}
```

#### ✅ Schema APIs tương ứng:

| Frontend Data           | Schema API                                                          | Status |
| ----------------------- | ------------------------------------------------------------------- | ------ |
| `revenue` (theo period) | `GET /seller/dashboard/revenue?period=today\|week\|month` (SS-009)  | ✅ ĐỦ  |
| `totalOrders`           | `GET /seller/dashboard/orders?period=...` (SS-009)                  | ✅ ĐỦ  |
| `successfulOrders`      | `GET /seller/dashboard/orders?period=...&status=completed` (SS-009) | ✅ ĐỦ  |
| `cancelledOrders`       | `GET /seller/dashboard/orders?period=...&status=cancelled` (SS-009) | ✅ ĐỦ  |
| `topProducts`           | `GET /seller/dashboard/top-products?period=...&limit=3` (SS-009)    | ✅ ĐỦ  |

**➡️ Đánh giá: 100% ĐỦ**

---

### 2️⃣ ORDERS SCREEN (`OrdersScreen.tsx`)

#### 🔍 Frontend Mockdata sử dụng:

```typescript
// mockOrders: Order[]
interface Order {
  id: string;
  customerName: string;
  items: { name: string; quantity: number }[];
  total: number;
  status: OrderStatus;
  timestamp: string;
}
```

#### ✅ Schema APIs tương ứng:

| Frontend Feature   | Schema API                                                                                   | Status |
| ------------------ | -------------------------------------------------------------------------------------------- | ------ |
| Danh sách đơn hàng | `GET /seller/orders?status=new\|preparing\|...` (SS-003)                                     | ✅ ĐỦ  |
| Chi tiết đơn hàng  | `GET /seller/orders/:orderId` (SS-003)                                                       | ✅ ĐỦ  |
| Xác nhận đơn       | `PUT /seller/orders/:orderId/status` (body: `{status: "preparing"}`) (SS-003)                | ✅ ĐỦ  |
| Từ chối đơn        | `PUT /seller/orders/:orderId/status` (body: `{status: "cancelled", reason: "..."}`) (SS-003) | ✅ ĐỦ  |
| Giao hàng          | `PUT /seller/orders/:orderId/status` (body: `{status: "delivering"}`) (SS-003)               | ✅ ĐỦ  |
| Hoàn thành         | `PUT /seller/orders/:orderId/status` (body: `{status: "completed"}`) (SS-003)                | ✅ ĐỦ  |
| In hóa đơn         | `GET /seller/orders/:orderId/invoice` (SS-003)                                               | ✅ ĐỦ  |

**➡️ Đánh giá: 100% ĐỦ**

---

### 3️⃣ PRODUCTS SCREEN (`ProductsScreen.tsx`)

#### 🔍 Frontend Mockdata sử dụng:

```typescript
// mockProducts: Product[]
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sold: number;
  unit: string;
  imageUrl: string;
  expiryDate?: string;
  importDate?: string;
}
```

#### ✅ Schema APIs tương ứng:

| Frontend Feature     | Schema API                                                                  | Status |
| -------------------- | --------------------------------------------------------------------------- | ------ |
| Danh sách sản phẩm   | `GET /seller/products` (SS-004)                                             | ✅ ĐỦ  |
| Lọc theo tồn kho     | `GET /seller/products?stockStatus=inStock\|lowStock\|outOfStock` (SS-004)   | ✅ ĐỦ  |
| Tìm kiếm             | `GET /seller/products?search=...` (SS-004)                                  | ✅ ĐỦ  |
| Sắp xếp              | `GET /seller/products?sortBy=expiryDate\|stock\|price\|name\|sold` (SS-004) | ✅ ĐỦ  |
| Chi tiết sản phẩm    | `GET /seller/products/:productId` (SS-004)                                  | ✅ ĐỦ  |
| Thêm sản phẩm        | `POST /seller/products` (SS-004)                                            | ✅ ĐỦ  |
| Sửa sản phẩm         | `PUT /seller/products/:productId` (SS-004)                                  | ✅ ĐỦ  |
| Xóa sản phẩm         | `DELETE /seller/products/:productId` (SS-004)                               | ✅ ĐỦ  |
| Cập nhật tồn kho     | `PUT /seller/inventory` (SS-005)                                            | ✅ ĐỦ  |
| Thống kê tồn kho     | `GET /seller/inventory/summary` (SS-005)                                    | ✅ ĐỦ  |
| Cảnh báo hạn sử dụng | `GET /seller/inventory/expiry-alerts` (SS-005)                              | ✅ ĐỦ  |
| Giá trị tồn kho      | `GET /seller/inventory/value` (SS-005)                                      | ✅ ĐỦ  |

**➡️ Đánh giá: 100% ĐỦ**

#### ⚠️ CHÚ Ý Frontend có Combo/Voucher nhưng chưa dùng:

```typescript
// AddCombo, AddVoucher components tồn tại nhưng chưa có APIs
// Đã có trong file `Schema - Nguoi ban (MISSING_APIs).csv`:
// - SS-016: Combo APIs
// - SS-017: Voucher APIs
```

**➡️ Không cấp thiết, làm sau khi app chạy được với mockdata**

---

### 4️⃣ STORE SCREEN (`StoreScreen.tsx`)

#### 🔍 Frontend Mockdata sử dụng:

```typescript
// mockStoreInfo, mockStoreStats, mockStoreReviews, mockStoreAnalytics
interface StoreInfo {
  name, description, address, phone, openingHours,
  email, website, avatarUrl, coverImageUrl, ...
}
```

#### ✅ Schema APIs tương ứng:

| Frontend Feature   | Schema API                                                                 | Status |
| ------------------ | -------------------------------------------------------------------------- | ------ |
| Thông tin cửa hàng | `GET /seller/profile` (SS-002)                                             | ✅ ĐỦ  |
| Cập nhật profile   | `PUT /seller/profile` (SS-002)                                             | ✅ ĐỦ  |
| Bật/tắt cửa hàng   | `POST /seller/store/toggle-status` (SS-007)                                | ✅ ĐỦ  |
| Upload ảnh bìa     | `POST /seller/store/upload-cover` (SS-007)                                 | ✅ ĐỦ  |
| Thống kê đánh giá  | `GET /seller/reviews` (SS-006)                                             | ✅ ĐỦ  |
| Danh sách follower | `GET /seller/store/followers` (SS-007)                                     | ✅ ĐỦ  |
| Thống kê Analytics | `GET /seller/reports/revenue`, `GET /seller/reports/top-products` (SS-008) | ✅ ĐỦ  |
| QR Code & Share    | `GET /seller/store/share-info` (SS-007)                                    | ✅ ĐỦ  |

**➡️ Đánh giá: 100% ĐỦ**

---

### 5️⃣ WALLET SCREEN (Chưa implement chi tiết)

#### 🔍 Frontend có tab "Ví" nhưng chưa có screen chi tiết

#### ⚠️ Schema APIs:

- ❌ **CHƯA CÓ** trong schema hiện tại
- Cần thêm:
  - `GET /seller/wallet/balance` - Xem số dư
  - `GET /seller/wallet/transactions` - Lịch sử giao dịch
  - `POST /seller/wallet/withdraw` - Rút tiền
  - `GET /seller/wallet/withdraw-history` - Lịch sử rút tiền

**➡️ Đánh giá: CẦN BỔ SUNG (nhưng không cấp thiết ngay)**

---

### 6️⃣ CHAT SCREEN (Customer Support)

#### 🔍 Frontend Mockdata:

```typescript
// mockChatConversations: Conversation[]
interface Conversation {
  id;
  customerName;
  customerAvatar;
  lastMessage;
  timestamp;
  unreadCount;
  status;
}
```

#### ⚠️ Schema APIs:

- ❌ **CHƯA CÓ** WebSocket cho realtime chat
- Cần thêm:
  - `GET /seller/chats` - Danh sách hội thoại
  - `GET /seller/chats/:chatId/messages` - Lấy tin nhắn
  - `POST /seller/chats/:chatId/messages` - Gửi tin nhắn
  - `WS /seller/chats/realtime` - WebSocket realtime

**➡️ Đánh giá: CẦN BỔ SUNG (feature quan trọng nhưng làm sau)**

---

### 7️⃣ PROMOTIONS SCREEN (Combo/Voucher)

#### 🔍 Frontend có component nhưng chưa integrate:

- `AddCombo.tsx` - Tạo combo
- `AddVoucher.tsx` - Tạo voucher
- `PromotionsScreen.tsx` - Quản lý khuyến mãi

#### ✅ Schema APIs:

- ✅ **ĐÃ CÓ** trong file `Schema - Nguoi ban (MISSING_APIs).csv`:
  - SS-016: Combo Management APIs (8 endpoints)
  - SS-017: Voucher Management APIs (9 endpoints)

**➡️ Đánh giá: SCHEMA ĐÃ CÓ, chưa integrate vào frontend**

---

### 8️⃣ AI ASSISTANT (Draggable Bubble)

#### 🔍 Frontend có:

- `AIAssistantBubble.tsx` - Button nổi
- `AIAssistantChat.tsx` - Chat modal
- `aiAssistantService.ts` - Service layer

#### ⚠️ Schema APIs:

- ❌ **CHƯA CÓ** AI query APIs
- Cần thêm:
  - `POST /seller/ai/query` - Hỏi AI về business data
  - `GET /seller/ai/suggestions` - Gợi ý tối ưu

**➡️ Đánh giá: Feature tương lai, không cấp thiết**

---

## 📋 BẢNG TỔNG HỢP ƯU TIÊN

| Screen            | Độ ưu tiên  | Schema Status                 | Ghi chú                   |
| ----------------- | ----------- | ----------------------------- | ------------------------- |
| **Dashboard**     | 🔴 CRITICAL | ✅ 100% ĐỦ                    | Sẵn sàng build backend    |
| **Orders**        | 🔴 CRITICAL | ✅ 100% ĐỦ                    | Sẵn sàng build backend    |
| **Products**      | 🔴 CRITICAL | ✅ 100% ĐỦ                    | Sẵn sàng build backend    |
| **Store Profile** | 🔴 CRITICAL | ✅ 100% ĐỦ                    | Sẵn sàng build backend    |
| **Auth**          | 🔴 CRITICAL | ✅ 100% ĐỦ                    | Login/Logout đã có        |
| **Wallet**        | 🟡 HIGH     | ❌ 0%                         | Cần thêm 4-5 APIs         |
| **Chat**          | 🟡 HIGH     | ❌ 0%                         | Cần WebSocket + REST APIs |
| **Promotions**    | 🟢 MEDIUM   | ✅ Schema có (SS-016, SS-017) | Chưa integrate frontend   |
| **AI Assistant**  | 🔵 LOW      | ❌ 0%                         | Feature tương lai         |

---

## 🎯 KẾ HOẠCH THỰC HIỆN ĐỀ XUẤT

### 🚀 PHASE 1 - MVP (BẮT ĐẦU NGAY)

**Timeline: 2-3 tuần**

✅ **Backend cần làm theo schema hiện tại:**

1. Authentication (SS-001)
2. Profile Management (SS-002)
3. Orders Management (SS-003)
4. Products CRUD (SS-004)
5. Inventory Tracking (SS-005)
6. Store Settings (SS-007)
7. Dashboard Stats (SS-009)

✅ **Frontend chỉ cần:**

- Thay `mockData` bằng API calls
- Thêm error handling
- Loading states

---

### 📦 PHASE 2 - EXTENDED FEATURES

**Timeline: 1-2 tuần**

Bổ sung các APIs còn thiếu:

1. **Wallet APIs** (4-5 endpoints)

   ```typescript
   GET /seller/wallet/balance
   GET /seller/wallet/transactions?page=1&limit=20
   POST /seller/wallet/withdraw
   GET /seller/wallet/withdraw-history
   GET /seller/wallet/payment-methods
   ```

2. **Chat/Customer Support** (5-6 endpoints + WebSocket)

   ```typescript
   GET /seller/chats?status=unread|all
   GET /seller/chats/:chatId/messages
   POST /seller/chats/:chatId/messages
   PUT /seller/chats/:chatId/mark-read
   WS /seller/chats/realtime
   ```

3. **Reviews Response** (SS-006)
   - Đã có API nhưng frontend chưa dùng hết

---

### 🎁 PHASE 3 - PROMOTIONS

**Timeline: 1 tuần**

Integrate schema đã có:

- SS-016: Combo Management (8 APIs)
- SS-017: Voucher Management (9 APIs)
- Frontend đã có UI components sẵn!

---

### 🤖 PHASE 4 - AI & ANALYTICS

**Timeline: Tương lai**

- Advanced Analytics APIs
- AI-powered suggestions
- Predictive inventory management

---

## 💡 KHUYẾN NGHỊ CUỐI CÙNG

### ✅ BẮT ĐẦU BUILD BACKEND NGAY!

**Schema hiện tại (SS-001 đến SS-009) ĐỦ 95% cho MVP!**

#### Checklist trước khi bắt đầu:

- [x] Authentication APIs - SS-001
- [x] Profile APIs - SS-002
- [x] Orders APIs - SS-003
- [x] Products APIs - SS-004
- [x] Inventory APIs - SS-005
- [x] Reviews APIs - SS-006
- [x] Store Settings APIs - SS-007
- [x] Reports APIs - SS-008
- [x] Dashboard APIs - SS-009
- [ ] Wallet APIs - **CẦN THÊM** (nhưng không chặn MVP)
- [ ] Chat APIs - **CẦN THÊM** (nhưng không chặn MVP)

---

## 📄 FILES THAM KHẢO

1. **Schema chính:**

   - `Schema - Nguoi ban (Seller).csv` - 60+ APIs (SS-001 đến SS-009)

2. **Schema mở rộng:**

   - `Schema - Nguoi ban (MISSING_APIs).csv` - 35+ APIs (SS-014 đến SS-020)

3. **Mapping documents:**

   - `CODE_VS_SCHEMA_MAPPING.md` - Code vs Schema
   - `API_COVERAGE_ANALYSIS.md` - Coverage analysis
   - `FRONTEND_VS_SCHEMA_MAPPING.md` - Tài liệu này

4. **Frontend screens:**
   - `src/features/dashboard/DashboardScreen.tsx`
   - `src/features/orders/OrdersScreen.tsx`
   - `src/features/products/ProductsScreen.tsx`
   - `src/features/store/StoreScreen.tsx`

---

## 🎉 KẾT LUẬN

**Schema hiện tại ĐÃ ĐỦ để bắt đầu build backend cho app Seller!**

Các tính năng thiếu (Wallet, Chat, AI) không ảnh hưởng đến việc app có thể hoạt động được. Bạn có thể:

1. ✅ **Bắt đầu build backend ngay** với schema hiện tại
2. ✅ **Frontend chỉ cần thay mockdata bằng API calls**
3. ✅ **Deploy MVP và cho user test**
4. ⏩ **Bổ sung Wallet/Chat sau** dựa trên feedback

---

**🚀 READY TO START BACKEND DEVELOPMENT!**

Generated: ${new Date().toLocaleDateString('vi-VN')}
