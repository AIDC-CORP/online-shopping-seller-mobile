# 💬 Chat Feature - Hướng dẫn sử dụng

## 📋 Tổng quan

Tính năng chat cho phép **seller** trò chuyện trực tiếp với **khách hàng**, giúp:

- Tư vấn sản phẩm nhanh chóng
- Giải đáp thắc mắc
- Xác nhận đơn hàng
- Chăm sóc khách hàng tốt hơn

---

## 🎯 Tính năng

### **ChatScreen (Danh sách cuộc trò chuyện)**

✅ Hiển thị tất cả cuộc trò chuyện
✅ Avatar + tên khách hàng
✅ Tin nhắn cuối cùng
✅ Thời gian (2 phút trước, 1 giờ trước, Hôm qua)
✅ Badge số tin nhắn chưa đọc (màu đỏ)
✅ Online indicator (chấm xanh)
✅ Tìm kiếm khách hàng
✅ Tổng số tin nhắn chưa đọc ở header

### **ChatDetailScreen (Chi tiết cuộc trò chuyện)**

✅ Header với avatar + tên + trạng thái online
✅ Tin nhắn của khách (trái, màu xám)
✅ Tin nhắn của seller (phải, màu xanh)
✅ Timestamp cho mỗi tin nhắn
✅ Input box với emoji/camera button
✅ Gửi tin nhắn real-time
✅ Keyboard handling (iOS/Android)
✅ Scroll to latest message
✅ Nút gọi điện & info

---

## 📁 Cấu trúc Files

```
src/features/chat/
├── ChatScreen.tsx          # Màn hình danh sách chat
├── ChatDetailScreen.tsx    # Màn hình chi tiết chat
├── ChatContainer.tsx       # Demo container (optional)
└── index.ts               # Export

src/shared/types/index.ts
└── ChatConversation       # Type definitions
└── Message

src/shared/data/mockData.ts
└── mockChatConversations  # Mock data (5 cuộc trò chuyện)
```

---

## 🚀 Cách sử dụng

### **Option 1: Standalone (Đơn giản nhất)**

```tsx
import { ChatScreen } from "@/src/features/chat";

// Trong component hoặc screen
<ChatScreen />;
```

### **Option 2: Với Navigation**

Nếu bạn đang dùng Expo Router:

**1. Tạo route: `app/(main)/chat.tsx`**

```tsx
import { ChatScreen } from "@/src/features/chat";

export default function ChatRoute() {
  return <ChatScreen />;
}
```

**2. Tạo route cho detail: `app/(main)/chat/[id].tsx`**

```tsx
import { ChatDetailScreen } from "@/src/features/chat";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ChatDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return <ChatDetailScreen chatId={id} onBack={() => router.back()} />;
}
```

**3. Update ChatScreen để navigate:**

```tsx
// Trong ChatScreen.tsx, dòng 21
onPress={() => router.push(`/(main)/chat/${item.id}`)}
```

### **Option 3: Với State Management**

```tsx
import { useState } from "react";
import { ChatScreen, ChatDetailScreen } from "@/src/features/chat";

export default function ChatTab() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  if (selectedChatId) {
    return (
      <ChatDetailScreen
        chatId={selectedChatId}
        onBack={() => setSelectedChatId(null)}
      />
    );
  }

  return <ChatScreen />;
}
```

---

## 🎨 Customization

### **Thay đổi màu sắc**

```tsx
// Tin nhắn của seller (hiện tại: xanh dương #3b82f6)
backgroundColor: "#10b981"; // Đổi sang xanh lá

// Badge chưa đọc (hiện tại: đỏ #ef4444)
backgroundColor: "#f59e0b"; // Đổi sang cam
```

### **Thêm tính năng**

**Gửi ảnh:**

```tsx
const handleSendImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({...});
  // Thêm message với imageUrl
};
```

**Quick Replies:**

```tsx
const quickReplies = [
  "Dạ vẫn còn hàng ạ!",
  "Shop sẽ giao trong 1-2 giờ",
  "Cảm ơn bạn đã mua hàng!",
];
```

**Push Notification:**

```tsx
// Khi có tin nhắn mới
import * as Notifications from 'expo-notifications';
await Notifications.scheduleNotificationAsync({...});
```

---

## 💾 Mock Data

Hiện tại có **5 cuộc trò chuyện mẫu** trong `mockData.ts`:

1. **Nguyễn Văn A** - 2 tin chưa đọc, hỏi về cà chua
2. **Trần Thị B** - Đã đọc hết, đặt táo
3. **Lê Văn C** - Đã đọc hết, đặt thịt bò
4. **Phạm Thị D** - 1 tin chưa đọc, hỏi giảm giá cá hồi
5. **Hoàng Văn E** - Đã đọc hết, khen shop

### **Thêm cuộc trò chuyện mới:**

```tsx
export const mockChatConversations: ChatConversation[] = [
  // ... existing
  {
    id: "chat6",
    customerName: "Khách hàng mới",
    customerAvatar: "https://i.pravatar.cc/150?img=10",
    lastMessage: "Chào shop!",
    lastMessageTime: "Vừa xong",
    unreadCount: 1,
    messages: [
      {
        id: "m21",
        text: "Chào shop!",
        timestamp: "10:00 AM",
        isFromSeller: false,
        isRead: false,
      },
    ],
  },
];
```

---

## 🔌 Tích hợp Real-time (Optional)

Để tích hợp chat thật với backend:

### **1. Firebase Realtime Database**

```tsx
import database from "@react-native-firebase/database";

// Listen for new messages
database()
  .ref(`/chats/${chatId}/messages`)
  .on("child_added", (snapshot) => {
    const message = snapshot.val();
    // Update UI
  });
```

### **2. Socket.io**

```tsx
import io from "socket.io-client";

const socket = io("https://your-api.com");

socket.on("new_message", (message) => {
  // Update UI
});
```

### **3. REST API**

```tsx
// Poll for new messages every 5 seconds
useEffect(() => {
  const interval = setInterval(() => {
    fetch(`/api/chats/${chatId}/messages`)
      .then((res) => res.json())
      .then((messages) => setMessages(messages));
  }, 5000);

  return () => clearInterval(interval);
}, [chatId]);
```

---

## 📊 Screenshots

### ChatScreen

```
┌─────────────────────────────────┐
│ 💬 Tin nhắn      [3 chưa đọc]  │
│                                 │
│ 🔍 Tìm khách hàng...           │
├─────────────────────────────────┤
│ [👤] Nguyễn Văn A  2 phút trước │
│      Cửa hàng còn cà chua...🔴2│
├─────────────────────────────────┤
│ [👤] Trần Thị B    15 phút trước│
│      Cảm ơn shop nhiều nhé!    │
└─────────────────────────────────┘
```

### ChatDetailScreen

```
┌─────────────────────────────────┐
│ ← [👤] Nguyễn Văn A 🟢 📞 ℹ️   │
├─────────────────────────────────┤
│                                 │
│  [👤] Chào shop! Cà chua còn?  │
│       10:30 AM                  │
│                                 │
│                   Dạ còn ạ! [💙]│
│                   10:31 AM      │
│                                 │
├─────────────────────────────────┤
│ 📷 [Nhập tin nhắn...]        ➤ │
└─────────────────────────────────┘
```

---

## ✅ Checklist

- [x] ChatScreen component
- [x] ChatDetailScreen component
- [x] Mock data với 5 conversations
- [x] Search functionality
- [x] Unread badges
- [x] Real-time send message
- [x] Keyboard handling
- [x] Responsive design
- [ ] Image sending (TODO)
- [ ] Quick replies (TODO)
- [ ] Push notifications (TODO)
- [ ] Real-time backend (TODO)

---

## 🆘 Troubleshooting

**Q: Tin nhắn không hiển thị đúng?**
A: Kiểm tra `isFromSeller` property trong Message type.

**Q: Keyboard che mất input?**
A: Đã có KeyboardAvoidingView, check `behavior` prop.

**Q: Avatar không load?**
A: URL mặc định là pravatar.cc, có thể thay bằng URL khác.

**Q: Làm sao thêm tab Chat vào navigation?**
A: Xem phần "Cách sử dụng - Option 2".

---

## 📞 Support

Cần thêm tính năng? Báo lỗi? Contact developer! 🚀
