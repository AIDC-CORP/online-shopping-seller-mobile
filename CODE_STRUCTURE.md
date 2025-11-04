# 📋 Cấu Trúc Code Chi Tiết - Online Shopping Seller

## 🎯 Tổng Quan Kiến Trúc

Dự án sử dụng **3-Layer Architecture** kết hợp với **Microfrontend Pattern**:

```
┌─────────────────────────────────────────┐
│   LAYER 1: Navigation (Expo Router)     │  ← Điều hướng giữa các màn hình
├─────────────────────────────────────────┤
│   LAYER 2: Presentation (UI Components) │  ← Hiển thị giao diện
├─────────────────────────────────────────┤
│   LAYER 3: Business Logic (Services)    │  ← Xử lý nghiệp vụ
└─────────────────────────────────────────┘
```

---

## 📂 Chi Tiết Từng Thư Mục

### 1. `app/` - Navigation Layer (Expo Router)

**Mục đích**: Quản lý routing và navigation của ứng dụng

```
app/
├── _layout.tsx              # Root layout - Cấu hình cao nhất
├── index.tsx                # Root screen - Redirect đến auth hoặc main
│
├── (auth)/                  # Auth Group - Các màn hình authentication
│   ├── _layout.tsx          # Layout cho auth screens
│   └── login.tsx            # Màn hình login
│
└── (main)/                  # Main Group - Ứng dụng chính sau khi đăng nhập
    ├── _layout.tsx          # Tab navigation layout
    ├── dashboard.tsx        # Tab 1: Trang tổng quan
    ├── orders.tsx           # Tab 2: Quản lý đơn hàng
    ├── products.tsx         # Tab 3: Quản lý sản phẩm
    └── store.tsx            # Tab 4: Cài đặt cửa hàng
```

**Luồng hoạt động**:

```
User mở app
    ↓
app/index.tsx (kiểm tra login)
    ↓
├─→ Chưa login → app/(auth)/login.tsx
│       ↓ (sau khi login thành công)
│       └─→ Navigate to app/(main)/dashboard.tsx
│
└─→ Đã login → app/(main)/dashboard.tsx (Tab navigation)
```

---

### 2. `services/` - Business Logic Layer (Microfrontends)

**Mục đích**: Xử lý nghiệp vụ, gọi API, quản lý data

```
services/
├── index.ts                 # Service Registry - Import tất cả services
│
├── auth/
│   └── AuthService.ts       # Xử lý đăng nhập, đăng xuất, session
│
├── dashboard/
│   └── DashboardService.ts  # Lấy thống kê, analytics
│
├── orders/
│   └── OrdersService.ts     # CRUD đơn hàng
│
├── products/
│   └── ProductsService.ts   # CRUD sản phẩm
│
└── store/
    └── StoreService.ts      # Quản lý thông tin cửa hàng
```

**Ví dụ một Service**:

```typescript
// services/auth/AuthService.ts
class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  // Singleton pattern - chỉ có 1 instance
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Methods xử lý nghiệp vụ
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Gọi API login
    // Lưu token, user info
    return { user, token };
  }

  async logout(): Promise<void> {
    // Xóa session
  }
}

export default AuthService.getInstance();
```

**Đặc điểm**:

- ✅ **Độc lập**: Mỗi service không phụ thuộc service khác
- ✅ **Singleton**: Chỉ có 1 instance trong toàn app
- ✅ **Type-safe**: Dùng TypeScript interfaces
- ✅ **Mock data**: Hiện tại dùng mock, sau sẽ gọi API thật

---

### 3. `src/` - Presentation Layer (UI Components)

**Mục đích**: Components hiển thị giao diện, kết nối với services

```
src/
├── features/                # Components theo feature
│   ├── auth/
│   │   ├── LoginScreen.tsx         # Màn hình login UI
│   │   └── LoginForm.tsx           # Form login
│   │
│   ├── dashboard/
│   │   ├── DashboardScreen.tsx     # Màn dashboard UI
│   │   ├── StatCard.tsx            # Card thống kê
│   │   └── Chart.tsx               # Biểu đồ
│   │
│   ├── orders/
│   │   ├── OrdersScreen.tsx        # Màn quản lý orders
│   │   ├── OrderList.tsx           # Danh sách orders
│   │   └── OrderItem.tsx           # Item order
│   │
│   ├── products/
│   │   ├── ProductsScreen.tsx      # Màn quản lý products
│   │   ├── ProductList.tsx
│   │   └── ProductForm.tsx
│   │
│   └── store/
│       ├── StoreScreen.tsx         # Màn cài đặt store
│       └── StoreSettings.tsx
│
└── shared/                  # Components dùng chung
    ├── components/
    │   ├── AppHeader.tsx           # Header app
    │   ├── Button.tsx              # Button component
    │   └── icons/                  # Icons
    │
    └── data/
        └── mockData.ts             # Mock data cho development
```

**Ví dụ Component sử dụng Service**:

```typescript
// src/features/dashboard/DashboardScreen.tsx
import { useState, useEffect } from "react";
import DashboardService from "@/services/dashboard/DashboardService";

export default function DashboardScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Gọi service để lấy data
        const data = await DashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <View>
      <StatCard title="Doanh thu" value={stats.revenue} />
      <StatCard title="Đơn hàng" value={stats.totalOrders} />
    </View>
  );
}
```

---

### 4. `components/` - Generic Reusable Components

**Mục đích**: Components tái sử dụng, không phụ thuộc business logic

```
components/
├── ui/                      # UI components thuần túy
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── modal.tsx
│
├── haptic-tab.tsx          # Tab với haptic feedback
└── themed-view.tsx         # View với theme support
```

---

## 🔄 Data Flow - Luồng Dữ Liệu

### Ví dụ: User Login

```
1. User nhập email/password vào LoginScreen
   ↓
2. LoginScreen gọi AuthService.login()
   ↓
3. AuthService gửi request đến API (hoặc mock)
   ↓
4. Nhận response: { user, token }
   ↓
5. AuthService lưu user & token vào memory
   ↓
6. LoginScreen navigate đến /(main)/dashboard
   ↓
7. DashboardScreen mount
   ↓
8. DashboardScreen gọi DashboardService.getStats()
   ↓
9. Hiển thị thống kê lên UI
```

### Code Flow:

```typescript
// 1. User interaction
<LoginScreen onLogin={handleLogin} />;

// 2. Screen gọi Service
const handleLogin = async () => {
  const result = await AuthService.login({ email, password });
  router.replace("/(main)/dashboard");
};

// 3. Service xử lý
class AuthService {
  async login(creds) {
    const response = await fetch("/api/login", { body: creds });
    this.token = response.token;
    return response;
  }
}

// 4. Navigate đến screen mới
<DashboardScreen />;

// 5. Screen mới load data
useEffect(() => {
  const stats = await DashboardService.getStats();
  setStats(stats);
}, []);
```

---

## 🎨 Styling Strategy

Project sử dụng **NativeWind** (Tailwind CSS for React Native):

```typescript
// Thay vì StyleSheet
<View style={styles.container}>

// Dùng className như web
<View className="flex-1 bg-gray-100 p-4">
  <Text className="text-2xl font-bold text-blue-600">
    Hello
  </Text>
</View>
```

---

## 📦 Package Structure

```json
{
  "dependencies": {
    "expo": "~54.0.20", // Framework chính
    "expo-router": "~6.0.13", // File-based routing
    "react-native": "0.81.5", // React Native core
    "nativewind": "^2.0.11", // Tailwind CSS
    "@react-navigation/...": "^7" // Navigation libs
  }
}
```

---

## 🔐 Type Safety

Tất cả đều có TypeScript types:

```typescript
// services/auth/AuthService.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Trong component
const [user, setUser] = useState<User | null>(null);
```

---

## 🛠️ Development Workflow

### 1. Tạo Feature Mới

```bash
# Bước 1: Tạo Service
services/newfeature/NewFeatureService.ts

# Bước 2: Tạo UI Components
src/features/newfeature/NewFeatureScreen.tsx

# Bước 3: Tạo Route
app/(main)/newfeature.tsx

# Bước 4: Add vào Tab Navigation
app/(main)/_layout.tsx
```

### 2. Sửa Feature Hiện Có

```bash
# Option 1: Sửa UI
src/features/dashboard/DashboardScreen.tsx

# Option 2: Sửa Logic
services/dashboard/DashboardService.ts

# Option 3: Sửa cả hai
```

---

## 🧪 Testing Strategy

```
Unit Tests:
├── services/*.test.ts      # Test từng service riêng
└── components/*.test.tsx   # Test components thuần túy

Integration Tests:
└── features/*.test.tsx     # Test component + service

E2E Tests:
└── e2e/*.test.ts          # Test toàn bộ flow
```

---

## 📱 Screen Navigation Tree

```
App Root
├── index (Redirect)
│
├── (auth) Group
│   └── login
│
└── (main) Group (Tabs)
    ├── dashboard (Tab 1)
    ├── orders (Tab 2)
    ├── products (Tab 3)
    └── store (Tab 4)
```

---

## 🚀 Build & Deploy

```bash
# Development
npm start              # Chạy Expo dev server

# Build
npm run android        # Build Android
npm run ios            # Build iOS
npm run web            # Build Web

# Production
eas build --platform android
eas build --platform ios
```

---

## 📖 Đọc Code Như Thế Nào?

### Khi muốn hiểu một tính năng:

1. **Bắt đầu từ `app/`**: Xem route và navigation
2. **Đến `src/features/`**: Xem UI component
3. **Cuối cùng `services/`**: Xem business logic

### Ví dụ hiểu Dashboard:

```
app/(main)/dashboard.tsx
  ↓ (import)
src/features/dashboard/DashboardScreen.tsx
  ↓ (gọi)
services/dashboard/DashboardService.ts
  ↓ (trả về data)
Hiển thị lên UI
```

---

## 🎓 Best Practices

✅ **DO**:

- Giữ services độc lập
- UI components chỉ lo hiển thị
- Dùng TypeScript types đầy đủ
- Mock data trong development

❌ **DON'T**:

- Import service trong service khác
- Viết business logic trong UI components
- Dùng `any` type
- Hard-code API URLs

---

## 📚 Resources

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
