# Store Screen - Complete Guide

## Tổng quan

**Store Screen** là màn hình quản lý thông tin cửa hàng, profile, và cài đặt cho seller. Đây là nơi seller có thể chỉnh sửa thông tin, quản lý trạng thái cửa hàng, và xem thống kê tổng quan.

## ✨ Features

### 1. 🔄 Store Status Toggle

**Mục đích**: Tạm đóng/mở cửa hàng nhanh chóng

- **Switch control** ở đầu màn hình
- **Real-time status**:
  - 🟢 Đang mở cửa (green)
  - 🔴 Đã đóng cửa (red)
- **Confirmation dialog** khi đóng cửa
- **Disable orders**: Khách không thể đặt hàng khi đóng

### 2. 📸 Cover Image & Avatar

**Ảnh bìa và logo cửa hàng**

- **Cover image**: 48px height, full width
- **Avatar**: 28x28, rounded, border white
- **Edit buttons**: Overlay với icon pencil
- **Store name**: Hiển thị trên background với opacity

### 3. 📊 Store Stats Cards

**3 thẻ thống kê ngang**

| Stat          | Icon | Value | Color |
| ------------- | ---- | ----- | ----- |
| Đánh giá      | ⭐   | 4.8   | Green |
| Lượt theo dõi | ❤️   | 1.2K  | Red   |
| Sản phẩm      | 📦   | 45    | Blue  |

- **Layout**: Flex row, equal width
- **Style**: White background, rounded, shadow
- **Responsive**: Gap 8px

### 4. 📝 Store Description

**Giới thiệu cửa hàng**

- **Editable**: Tap pencil icon → Modal
- **Multi-line**: Support đoạn văn dài
- **Character limit**: Có thể set 500 chars
- **SEO friendly**: Mô tả tốt giúp ranking

### 5. 📞 Contact Information

**Thông tin liên hệ chính**

| Field         | Icon | Editable |
| ------------- | ---- | -------- |
| Địa chỉ       | 📍   | ✅       |
| Số điện thoại | 📞   | ✅       |
| Giờ mở cửa    | 🕐   | ✅       |

- **Tap to edit**: Mỗi row có thể tap để edit
- **Modal edit**: Full-screen modal với TextInput
- **Validation**: Phone format, address required

### 6. 📋 Additional Information

**Thông tin bổ sung**

- 📧 **Email**: support@greenfarm.vn
- 🌐 **Website**: www.greenfarm.vn
- 💳 **Payment Methods**: COD, Bank Transfer, E-wallet
- 🚚 **Shipping Policy**: Free for orders > 200K
- ↩️ **Return Policy**: 7 days return

**Future**: Make these editable too

### 7. 📱 Social Media Links

**Liên kết mạng xã hội**

3 nút với màu riêng:

- 📘 **Facebook**: Blue theme
- 📷 **Instagram**: Pink theme
- 📺 **YouTube**: Red theme

**Functionality**:

- Tap → Open browser/app
- Link to store's social pages
- Track engagement (future)

### 8. 🎬 Quick Actions

**2 nút hành động nhanh**

1. **📊 Xem thống kê cửa hàng**

   - Navigate to Analytics screen
   - Show detailed metrics
   - Revenue, orders, customers

2. **🔗 Chia sẻ cửa hàng**
   - Share link to store
   - QR code generation
   - Deep linking support

### 9. ✏️ Edit Modal

**Modal chỉnh sửa thông tin**

**Features**:

- **Slide up animation**: Smooth appearance
- **Transparent backdrop**: 50% black overlay
- **Rounded top**: 24px radius
- **TextInput**: Multi-line for description
- **2 buttons**: Cancel (secondary), Save (primary)

**Fields editable**:

- Description
- Address
- Phone
- Opening Hours

**Validation**:

- Required fields check
- Phone number format (0xxx xxx xxx)
- Address min length

## 🎨 UI/UX Details

### Color Scheme

```typescript
Primary: #10b981 (emerald-500)
Background: #f9fafb (gray-50)
Card BG: #ffffff (white)
Text Primary: #111827 (gray-800)
Text Secondary: #6b7280 (gray-500)
Border: #e5e7eb (gray-200)
```

### Typography

```typescript
Store Name: 20px, bold, white
Section Headers: 16px, semibold, gray-800
Info Labels: 14px, regular, gray-500
Info Values: 15px, regular, gray-800
Stats Values: 24px, bold, gray-800
Stats Labels: 13px, regular, gray-600
```

### Spacing

```typescript
Section Gap: 16px (mt-4)
Card Padding: 16px (p-4)
Horizontal Padding: 16px (px-4)
Bottom Padding: 20px (for scroll)
```

### Shadows

```typescript
Cards: shadow-sm
Stats: shadow-sm
Edit Button: Custom elevation
```

## 📱 Components Used

### UI Components

```tsx
<SafeAreaView> - Safe area handling
<ScrollView> - Scrollable content
<ImageBackground> - Cover image
<Image> - Avatar
<Switch> - Toggle store status
<Modal> - Edit dialog
<TextInput> - Edit fields
<TouchableOpacity> - Clickable rows
<Button> - Action buttons
<IconButton> - Edit icons
```

### Custom Components

```tsx
<InfoRow> - Display label + value
<StatCard> - Display stat with icon
```

## 🔧 State Management

```typescript
// Store info
const [storeInfo, setStoreInfo] = useState<StoreInfo>(mockStoreInfo);

// Store status
const [isStoreOpen, setIsStoreOpen] = useState(true);

// Edit modal
const [showEditModal, setShowEditModal] = useState(false);
const [editField, setEditField] = useState<
  "description" | "address" | "phone" | "hours" | null
>(null);
const [editValue, setEditValue] = useState("");
```

## 📊 Data Structure

```typescript
interface StoreInfo {
  name: string; // Tên cửa hàng
  address: string; // Địa chỉ
  phone: string; // Số điện thoại
  openingHours: string; // Giờ mở cửa
  description: string; // Giới thiệu
  coverImageUrl: string; // URL ảnh bìa
  avatarUrl: string; // URL logo

  // Future additions:
  email?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  rating?: number;
  followers?: number;
  productsCount?: number;
}
```

## 🎯 User Flows

### 1. Toggle Store Status

```
User taps Switch →
  If closing: Show confirmation alert →
    Cancel → Switch stays on
    Confirm → Set isStoreOpen = false
  If opening: Set isStoreOpen = true immediately
```

### 2. Edit Store Information

```
User taps InfoRow or Edit icon →
  Modal opens with current value →
  User edits text →
  User taps Save →
    Update storeInfo state →
    Close modal →
    Show success message (future)
```

### 3. Share Store

```
User taps "Chia sẻ cửa hàng" →
  Generate store link →
  Open native share sheet →
  Select platform →
  Share link
```

### 4. View Analytics

```
User taps "Xem thống kê" →
  Navigate to Analytics screen →
  Show detailed metrics:
    - Revenue trends
    - Order statistics
    - Customer insights
    - Product performance
```

## 🚀 Future Enhancements

### Phase 2 Features:

1. **📈 Store Analytics Dashboard**

   - Revenue charts (daily/weekly/monthly)
   - Order trends
   - Customer demographics
   - Best-selling products
   - Peak hours analysis

2. **🎨 Theme Customization**

   - Custom color schemes
   - Upload custom cover/avatar
   - Font selection
   - Layout templates

3. **🔔 Notification Settings**

   - New order alerts
   - Low stock warnings
   - Customer messages
   - Review notifications
   - Push notification config

4. **💼 Business Hours**

   - Day-specific hours
   - Holiday schedule
   - Break times
   - Auto-close on holidays

5. **🚚 Shipping Settings**

   - Delivery areas/zones
   - Shipping rates
   - Free shipping threshold
   - Estimated delivery time

6. **💳 Payment Methods**

   - Enable/disable options
   - Bank account details
   - E-wallet integration
   - QR code for payment

7. **👥 Staff Management**

   - Add staff accounts
   - Role-based permissions
   - Activity logs
   - Staff performance

8. **📜 Policies Management**

   - Return policy editor
   - Terms & conditions
   - Privacy policy
   - FAQ section

9. **🏷️ Badges & Certifications**

   - Verified badge
   - Quality certifications
   - Awards & achievements
   - Trust badges

10. **📊 SEO & Marketing**
    - Meta tags
    - Keywords
    - Store description optimization
    - Social media auto-post

## 🐛 Known Issues

1. **Image upload**: Not implemented yet

   - Currently uses placeholder URLs
   - Need image picker integration

2. **Validation**: Basic only

   - Phone format not validated
   - Email format not checked

3. **Persistence**: In-memory only

   - Changes reset on app restart
   - Need API integration

4. **Social links**: Hardcoded
   - Not editable yet
   - No deep linking

## 💡 Best Practices

### For Sellers:

1. **Complete profile**: Fill all fields for better customer trust
2. **Update hours**: Keep opening hours current
3. **Add social links**: Increase discoverability
4. **Good description**: SEO-friendly, clear, concise
5. **Quality images**: Professional cover & avatar

### For Developers:

1. **Validate inputs**: Phone, email, URL formats
2. **Image optimization**: Compress before upload
3. **Error handling**: Network errors, upload failures
4. **Loading states**: Show progress for save operations
5. **Success feedback**: Toast/snackbar after updates

## 🎓 Tips & Tricks

### Increase Store Visibility:

- ✅ Complete all profile fields
- ✅ Add high-quality cover image
- ✅ Write compelling description
- ✅ Link social media accounts
- ✅ Maintain high rating (4.5+)
- ✅ Keep store open during peak hours

### Improve Customer Trust:

- ✅ Verify email & phone
- ✅ Add return policy
- ✅ Show certifications
- ✅ Response time badge
- ✅ Customer reviews display

### Optimize for Search:

- ✅ Use keywords in description
- ✅ Complete category tags
- ✅ Add product tags
- ✅ Update meta description

## 📚 Related Screens

- **Dashboard**: Show store performance
- **Products**: Link to product count
- **Orders**: Link to order management
- **Analytics**: Detailed metrics
- **Settings**: App-level settings

---

**Store Screen** - Complete seller profile management! 🎉
