# 🔗 Mapping Schema API vs Codebase

## ⚠️ PHÁT HIỆN: Code hiện tại CHƯA khớp với Schema đã cập nhật!

### 📊 Tổng Quan:

- **Code Services:** Sử dụng methods (functions) không có endpoint rõ ràng
- **Schema API:** Đã được cập nhật theo Technical Backlog với endpoints chuẩn REST
- **Độ khớp hiện tại:** ~30% (cần refactor code để match schema)

---

## 🔴 Vấn Đề Chính

Code hiện tại của bạn:

- ✅ Có logic nghiệp vụ cơ bản
- ❌ **KHÔNG có endpoints REST API**
- ❌ **KHÔNG có API calls thực tế** (chỉ là mock data trong memory)
- ❌ Cần tạo API layer để connect với backend

---

## 🗺️ Mapping Chi Tiết

### 1️⃣ **AuthService.ts**

#### Code hiện tại:

```typescript
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse>;
  async logout(): Promise<void>;
  getCurrentUser(): User | null;
  getToken(): string | null;
  isAuthenticated(): boolean;
}
```

#### Schema API yêu cầu:

```
POST /seller/auth/login       → login()
POST /seller/auth/logout      → logout()
GET  /seller/profile          → getCurrentUser() ⚠️ KHÁC TÊN
```

#### ⚠️ Điều chỉnh cần thiết:

```typescript
// Cần thêm method mới:
async getProfile(): Promise<User> {
  // Gọi GET /seller/profile
}

async updateProfile(data: Partial<User>): Promise<User> {
  // Gọi PUT /seller/profile (US-102)
}
```

---

### 2️⃣ **OrdersService.ts**

#### Code hiện tại:

```typescript
class OrdersService {
  async getOrders(status?: OrderStatus): Promise<Order[]>;
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
}
```

#### Schema API yêu cầu:

```
GET  /seller/orders/pending    → getPendingOrders() ⚠️ THIẾU
GET  /seller/orders            → getOrders()
GET  /seller/orders/{id}       → getOrderById() ⚠️ THIẾU
PUT  /seller/orders/{id}/accept → acceptOrder() ⚠️ THIẾU
PUT  /seller/orders/{id}/reject → rejectOrder() ⚠️ THIẾU
PUT  /seller/orders/{id}/status → updateOrderStatus() ✅ CÓ
```

#### ⚠️ Điều chỉnh cần thiết:

```typescript
// Cần thêm các method:
async getPendingOrders(): Promise<Order[]> {
  // GET /seller/orders/pending (US-105)
}

async getOrderById(id: string): Promise<Order> {
  // GET /seller/orders/{id}
}

async acceptOrder(id: string, estimatedTime?: string): Promise<Order> {
  // PUT /seller/orders/{id}/accept (US-105)
}

async rejectOrder(id: string, reason: string): Promise<Order> {
  // PUT /seller/orders/{id}/reject (US-105)
}

// Đổi tên method hiện tại:
async updateOrderStatus(id: string, status: string): Promise<Order> {
  // PUT /seller/orders/{id}/status (US-106)
}
```

---

### 3️⃣ **ProductsService.ts**

#### Code hiện tại:

```typescript
class ProductsService {
  async getProducts(category?: string): Promise<Product[]>;
  async addProduct(product: Omit<Product, "id">): Promise<Product>;
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  async deleteProduct(id: string): Promise<void>;
}
```

#### Schema API yêu cầu:

```
GET    /seller/products        → getProducts() ✅
POST   /seller/products        → addProduct() ✅
GET    /seller/products/{id}   → getProductById() ⚠️ THIẾU
PUT    /seller/products/{id}   → updateProduct() ✅
DELETE /seller/products/{id}   → deleteProduct() ✅
```

#### ⚠️ Điều chỉnh cần thiết:

```typescript
// Cần thêm:
async getProductById(id: string): Promise<Product> {
  // GET /seller/products/{id}
}
```

---

### 4️⃣ **DashboardService.ts**

#### Code hiện tại:

```typescript
class DashboardService {
  async getStats(period: string = "month"): Promise<DashboardStats>;
  async getTopProducts(limit: number = 5): Promise<TopProduct[]>;
}
```

#### Schema API yêu cầu:

```
GET /seller/reports/summary     → getStats() ⚠️ KHÁC ENDPOINT
GET /seller/dashboard/top-products → getTopProducts() ✅
```

#### ⚠️ Điều chỉnh cần thiết:

```typescript
// Đổi tên method để rõ nghĩa hơn:
async getReportsSummary(period?: string): Promise<DashboardStats> {
  // GET /seller/reports/summary (US-107)
}

// Hoặc giữ nguyên getStats() nhưng đổi endpoint bên trong
```

---

### 5️⃣ **StoreService.ts**

#### Code hiện tại:

```typescript
class StoreService {
  async getStoreProfile(): Promise<StoreProfile>;
  async updateStoreProfile(
    updates: Partial<StoreProfile>
  ): Promise<StoreProfile>;
  async getStoreSettings(): Promise<StoreSettings>;
  async updateStoreSettings(
    updates: Partial<StoreSettings>
  ): Promise<StoreSettings>;
}
```

#### Schema API yêu cầu:

```
GET /seller/store/profile  → getStoreProfile() ✅
PUT /seller/store/profile  → updateStoreProfile() ✅
GET /seller/store/settings → getStoreSettings() ✅
PUT /seller/store/settings → updateStoreSettings() ✅
```

✅ **Store Service đã khớp tốt!**

---

## ❌ **Services THIẾU HOÀN TOÀN**

### 1. InventoryService (US-104)

```typescript
// Cần tạo mới file: services/inventory/InventoryService.ts
class InventoryService {
  async getInventory(filters?: any): Promise<InventoryItem[]>;
  // GET /seller/inventory

  async updateInventory(data: any): Promise<void>;
  // PUT /seller/inventory
}
```

### 2. ReviewsService (US-108)

```typescript
// Cần tạo mới file: services/reviews/ReviewsService.ts
class ReviewsService {
  async getReviews(filters?: any): Promise<Review[]>;
  // GET /seller/reviews

  async replyToReview(id: string, text: string): Promise<Review>;
  // POST /seller/reviews/{id}/reply
}
```

---

## 🎯 **Giải Pháp Đề Xuất**

### Cách 1: Tạo API Layer riêng (Recommended) ⭐

Cấu trúc đề xuất:

```
services/
├── api/
│   ├── config.ts          # Base URL, headers, axios config
│   ├── endpoints.ts       # Định nghĩa tất cả endpoints
│   └── client.ts          # Axios/Fetch wrapper
├── auth/
│   └── AuthService.ts     # Gọi API qua client
├── orders/
│   └── OrdersService.ts
├── products/
│   └── ProductsService.ts
├── inventory/             # ⭐ THIẾU - Cần tạo mới
│   └── InventoryService.ts
└── reviews/               # ⭐ THIẾU - Cần tạo mới
    └── ReviewsService.ts
```

### File `services/api/endpoints.ts`:

```typescript
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/seller/auth/login",
  LOGOUT: "/seller/auth/logout",
  PROFILE: "/seller/profile",

  // Orders (US-105, US-106)
  ORDERS_PENDING: "/seller/orders/pending",
  ORDERS: "/seller/orders",
  ORDER_BY_ID: (id: string) => `/seller/orders/${id}`,
  ORDER_ACCEPT: (id: string) => `/seller/orders/${id}/accept`,
  ORDER_REJECT: (id: string) => `/seller/orders/${id}/reject`,
  ORDER_STATUS: (id: string) => `/seller/orders/${id}/status`,

  // Products (US-103)
  PRODUCTS: "/seller/products",
  PRODUCT_BY_ID: (id: string) => `/seller/products/${id}`,

  // Inventory (US-104)
  INVENTORY: "/seller/inventory",

  // Reviews (US-108)
  REVIEWS: "/seller/reviews",
  REVIEW_REPLY: (id: string) => `/seller/reviews/${id}/reply`,

  // Reports (US-107)
  REPORTS_SUMMARY: "/seller/reports/summary",
  DASHBOARD_TOP_PRODUCTS: "/seller/dashboard/top-products",

  // Store
  STORE_PROFILE: "/seller/store/profile",
  STORE_SETTINGS: "/seller/store/settings",
};
```

### File `services/api/client.ts`:

```typescript
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://api.example.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Ví dụ refactor `AuthService.ts`:

```typescript
import apiClient from "../api/client";
import { API_ENDPOINTS } from "../api/endpoints";

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.LOGOUT);
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get(API_ENDPOINTS.PROFILE);
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put(API_ENDPOINTS.PROFILE, data);
    return response.data;
  }
}
```

---

### Cách 2: Giữ nguyên Services, thêm API calls (Nhanh hơn)

Chỉ cập nhật các service hiện tại để gọi API thực:

```typescript
// Trong AuthService.ts
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Thay vì mock, gọi API thực:
  const response = await fetch('https://api.example.com/seller/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
}
```

---

## 📋 **Checklist Công Việc Cần Làm**

### Ưu tiên CAO (Để code khớp schema):

- [ ] Tạo `services/api/` folder với config, endpoints, client
- [ ] Refactor `AuthService.ts` - thêm getProfile(), updateProfile()
- [ ] Refactor `OrdersService.ts` - thêm getPendingOrders(), acceptOrder(), rejectOrder()
- [ ] Refactor `ProductsService.ts` - thêm getProductById()
- [ ] Tạo `InventoryService.ts` mới (US-104)
- [ ] Tạo `ReviewsService.ts` mới (US-108)

### Ưu tiên TRUNG:

- [ ] Update DashboardService - đổi endpoint sang /seller/reports/summary
- [ ] Thêm error handling cho tất cả API calls
- [ ] Thêm loading states
- [ ] Thêm retry logic

### Ưu tiên THẤP (Sẽ làm sau):

- [ ] Tạo services cho modules missing (Register, Returns, Shipping, etc.)
- [ ] Add TypeScript types cho tất cả responses
- [ ] Add unit tests

---

## 🎯 **Kết Luận**

### Tình trạng hiện tại:

❌ **Code CHƯA khớp với Schema API**

### Lý do:

1. Code hiện tại chỉ là mock services trong memory
2. Không có API calls thực tế đến backend
3. Thiếu một số methods mà schema yêu cầu
4. Thiếu hoàn toàn một số services (Inventory, Reviews)

### Đề xuất:

📌 **Tạo API Layer riêng (Cách 1)** để:

- Dễ maintain và scale
- Tách biệt logic nghiệp vụ và API calls
- Dễ test
- Dễ thay đổi backend

---

**Bạn muốn tôi:**

1. ✅ Tạo các files API Layer mẫu (endpoints.ts, client.ts)?
2. ✅ Refactor một số services để demo cách gọi API?
3. ✅ Tạo các services còn thiếu (Inventory, Reviews)?

Hãy cho tôi biết bạn muốn bắt đầu từ đâu! 🚀
