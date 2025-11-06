# AI Assistant Feature Guide

## Tổng quan

Tính năng AI Assistant giống như trợ lý ong trong MB Bank - một trợ lý thông minh giúp seller phân tích kinh doanh, tư vấn chiến lược, và trả lời các câu hỏi về quản lý cửa hàng.

## Kiến trúc

### 1. Components

#### AIAssistantBubble (`src/components/ai/AIAssistantBubble.tsx`)
- **Mục đích**: Floating action button có thể kéo thả đi mọi nơi trên màn hình
- **Tính năng**:
  - ✨ Icon sparkle effect
  - 🎯 **Draggable** - Kéo thả bubble đến bất kỳ đâu
  - 🧲 **Smart Snap** - Tự động dính vào cạnh trái hoặc phải
  - 💫 Animation pulse (scale 1 → 1.1)
  - 📍 Position boundaries:
    - Top: 60px (below header)
    - Bottom: 90px above tab bar
    - Auto-snap to left or right edge
  - 🔔 Badge hiển thị số lượng tin nhắn chưa đọc (optional)
  - 💬 "Kéo thả" hint khi đang drag
  - 👆 Tap detection: Chỉ trigger onPress nếu gesture < 10px
- **Props**:
  ```typescript
  {
    onPress: () => void;
    unreadCount?: number;
  }
  ```
- **Behavior**:
  - Long press + drag để di chuyển
  - Tap nhanh để mở chat
  - Auto-snap to nearest edge on release
  - Scale up (1.1x) khi đang kéo

#### AIAssistantChat (`src/components/ai/AIAssistantChat.tsx`)
- **Mục đích**: Full-screen modal cho giao diện chat với AI
- **Tính năng chính**:
  - Header với avatar AI, title, subtitle
  - Business context banner (hiển thị tổng quan: số sản phẩm, doanh thu, đơn hàng)
  - Message list với FlatList
  - Typing indicator khi AI đang trả lời
  - Suggested questions chips khi bắt đầu chat
  - Text input với send button
  - Clear chat button
  - KeyboardAvoidingView cho iOS/Android
  - Auto-scroll to bottom khi có tin nhắn mới
- **Props**:
  ```typescript
  {
    visible: boolean;
    onClose: () => void;
    businessContext?: BusinessContext;
  }
  ```

### 2. Service Layer

All AI services are centralized in `src/features/ai/` directory:

#### aiAssistantService (`src/features/ai/aiAssistantService.ts`)
- **Purpose**: Business Q&A and analysis
- **API**: Google Gemini Pro API
- **Environment Variable**: `EXPO_PUBLIC_GEMINI_API_KEY`
- **Interfaces**:
  ```typescript
  interface AIMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }

  interface BusinessContext {
    totalProducts: number;
    totalRevenue: number;
    totalOrders: number;
    lowStockProducts: number;
    topProducts?: string[];
  }
  ```

- **Methods**:
  - `sendMessage(userMessage, context?)`: Gửi tin nhắn tới Gemini API với business context
  - `getHistory()`: Lấy toàn bộ lịch sử chat
  - `clearHistory()`: Xóa lịch sử chat
  - `getSuggestedQuestions()`: Lấy 6 câu hỏi gợi ý
  - `buildSystemPrompt(context)`: Tạo system prompt với business data
  - `buildConversationContext()`: Include 5 tin nhắn gần nhất
  - `getMockResponse(message)`: Fallback responses khi không có API key

- Utility methods: getHistory(), clearHistory(), getSuggestedQuestions()

#### productDescriptionService (`src/features/ai/productDescriptionService.ts`)
- **Purpose**: Generate product descriptions, SEO titles, and suggestions
- **API**: Google Gemini Pro API
- **Methods**:
  - `generateProductDescription(productName, category)`: Generate product description
  - `generateProductSuggestions(keyword)`: Suggest product names
  - `generateSEOTitle(productName, category)`: Generate SEO-friendly title
- **Fallback**: Mock responses when API key unavailable

#### Configuration (both services):
  - Temperature: 0.7 (cân bằng creativity và consistency)
  - maxOutputTokens: 500
  - topP: 0.8
  - topK: 40

- **Mock Response Categories**:
  1. Business analysis (doanh thu, lợi nhuận, tăng trưởng)
  2. Product management (sản phẩm, kho, nhập hàng)
  3. Marketing (chiến lược, quảng cáo, khuyến mãi)
  4. Pricing (giá cả, combo, voucher)
  5. Orders (đơn hàng, giao hàng, khách hàng)
  6. Greetings (xin chào, cảm ơn)

### 3. Integration trong Main Layout

**Expo Router Project** - File: `app/(main)/_layout.tsx`

```typescript
// State management
const [showAIChat, setShowAIChat] = useState(false);

// Business context calculation
const businessContext = useMemo(() => {
  // Calculate real metrics from mockData
  const totalRevenue = mockOrders
    .filter(order => order.status === OrderStatus.Completed)
    .reduce((sum, order) => sum + order.total, 0);

  const lowStockCount = mockProducts.filter(p => p.stock < 10).length;
  const topProducts = mockProducts.slice(0, 3).map(p => p.name);

  return {
    totalProducts: mockProducts.length,
    totalRevenue,
    totalOrders: mockOrders.length,
    lowStockProducts: lowStockCount,
    topProducts,
  };
}, []);

// Render bubble + modal
<AIAssistantBubble onPress={() => setShowAIChat(true)} />
<AIAssistantChat
  visible={showAIChat}
  onClose={() => setShowAIChat(false)}
  businessContext={businessContext}
/>
```

**React Navigation Project** - File: `src/navigation/MainNavigator.tsx`

```typescript
// State management
const [showAIChat, setShowAIChat] = useState(false);

// Business context calculation
const businessContext: BusinessContext = useMemo(() => {
    const totalRevenue = mockOrders
        .filter(order => order.status === OrderStatus.Completed)
        .reduce((sum, order) => sum + order.total, 0);

    const lowStockCount = mockProducts.filter(p => p.stock < 10).length;
    const topProducts = mockProducts.slice(0, 3).map(p => p.name);

    return {
        totalProducts: mockProducts.length,
        totalRevenue,
        totalOrders: mockOrders.length,
        lowStockProducts: lowStockCount,
        topProducts,
    };
}, []);

// Wrap Navigator + AI Assistant in Fragment
return (
    <>
        <Tab.Navigator>
            {/* Your tabs */}
        </Tab.Navigator>
        
        <AIAssistantBubble onPress={() => setShowAIChat(true)} />
        <AIAssistantChat
            visible={showAIChat}
            onClose={() => setShowAIChat(false)}
            businessContext={businessContext}
        />
    </>
);
```

## Setup

### 1. Cài đặt Gemini API Key

Thêm vào file `.env`:
```bash
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**Lấy API key**:
1. Truy cập https://makersuite.google.com/app/apikey
2. Tạo API key mới
3. Copy và paste vào `.env`

### 2. Dependencies

Tất cả dependencies đã có sẵn trong project:
- `react-native` - Core framework
- `expo-router` - Navigation
- `react-native-safe-area-context` - Safe area handling

Không cần install thêm package nào.

## Sử dụng

### 1. Mở AI Assistant

- Nhấn vào bubble ✨ ở góc dưới bên phải màn hình
- Modal chat sẽ hiển thị full-screen

### 2. Gửi câu hỏi

**Cách 1: Chọn câu hỏi gợi ý**
- Khi mở chat lần đầu, sẽ có 6 câu hỏi gợi ý:
  - Phân tích doanh thu của tôi
  - Sản phẩm nào bán chạy nhất?
  - Tôi nên làm gì để tăng doanh số?
  - Chiến lược marketing hiệu quả cho shop nhỏ
  - Cách tối ưu giá combo và voucher
  - Làm sao để quản lý kho hiệu quả?

**Cách 2: Nhập câu hỏi tự do**
- Gõ câu hỏi vào ô input ở dưới cùng
- Nhấn nút 📤 để gửi

### 3. Business Context

AI tự động nhận context về business:
- **Tổng sản phẩm**: Số lượng products trong kho
- **Doanh thu**: Tổng revenue từ các đơn hàng đã hoàn thành
- **Đơn hàng**: Tổng số orders
- **Sản phẩm sắp hết**: Số lượng products có stock < 10
- **Top sản phẩm**: 3 sản phẩm bán chạy nhất (tên)

Context này được hiển thị ở banner xanh dưới header:
```
📊 45 sản phẩm • 💰 25,450,000₫ • 📦 123 đơn hàng
```

### 4. Xóa lịch sử chat

- Nhấn icon 🗑️ ở góc trên bên phải header
- Tất cả tin nhắn sẽ bị xóa
- Suggested questions sẽ hiển thị lại

## Ví dụ Chat Flow

### Example 1: Phân tích doanh thu
```
👤 User: Phân tích doanh thu của tôi

🤖 AI: Dựa trên dữ liệu hiện tại:
- Doanh thu: 25,450,000₫ từ 123 đơn hàng
- Trung bình: ~207,000₫/đơn
- Bạn có 45 sản phẩm, trong đó 5 sản phẩm sắp hết hàng

Gợi ý:
1. Tập trung vào top 3 sản phẩm bán chạy
2. Tạo combo để tăng giá trị đơn hàng
3. Nhập thêm hàng cho 5 sản phẩm sắp hết
```

### Example 2: Marketing Strategy
```
👤 User: Chiến lược marketing hiệu quả cho shop nhỏ

🤖 AI: Với shop có 45 sản phẩm, đây là 5 chiến lược hiệu quả:

1. Social Media Marketing:
   - Post sản phẩm hàng ngày trên Facebook/Instagram
   - Tạo video ngắn về sản phẩm hot

2. Combo & Voucher:
   - Tạo combo 2-3 sản phẩm liên quan
   - Flash sale cuối tuần

3. Chăm sóc khách hàng:
   - Reply chat nhanh (< 5 phút)
   - Tặng voucher cho khách quen

4. Content Marketing:
   - Chia sẻ tips sử dụng sản phẩm
   - Review từ khách hàng thật

5. Referral Program:
   - Giảm giá cho người giới thiệu
   - Tích điểm đổi quà
```

## Offline Mode

### Khi không có API Key

Service tự động chuyển sang **Mock Response Mode**:
- Phân tích tin nhắn của user
- Match với 6 categories (business, product, marketing, pricing, orders, greetings)
- Trả về câu trả lời pre-defined phù hợp
- Không cần internet connection

### Mock Response Quality

Mock responses được thiết kế để:
- Contextual: Dựa trên keywords trong câu hỏi
- Actionable: Cung cấp gợi ý cụ thể
- Vietnamese: Hoàn toàn tiếng Việt tự nhiên
- Business-focused: Tập trung vào business metrics

## Customization

### 1. Thay đổi Suggested Questions

File: `src/features/ai/aiAssistantService.ts`

```typescript
getSuggestedQuestions(): string[] {
  return [
    'Câu hỏi 1 của bạn',
    'Câu hỏi 2 của bạn',
    // ... thêm hoặc sửa
  ];
}
```

### 2. Thêm Mock Response Category

```typescript
private getMockResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Thêm category mới
  if (message.includes('keyword1') || message.includes('keyword2')) {
    return 'Response cho category mới...';
  }
  
  // ... existing categories
}
```

### 3. Điều chỉnh AI Behavior

Sửa system prompt trong `buildSystemPrompt()`:

```typescript
return `Bạn là trợ lý AI chuyên nghiệp...

PHONG CÁCH TRẢ LỜI:
- Thêm yêu cầu mới của bạn
- Sửa tone of voice
- Thêm constraints

...`;
```

### 2. Thay đổi vị trí mặc định

```typescript
// AIAssistantBubble.tsx
// Thay đổi initial position
const pan = useRef(new Animated.ValueXY({ 
  x: SCREEN_WIDTH - BUBBLE_SIZE - 20,  // Default: right side
  y: SCREEN_HEIGHT - BUBBLE_SIZE - 90  // Default: bottom
})).current;

// Đổi sang vị trí khác:
// Top-left: { x: 20, y: 60 }
// Top-right: { x: SCREEN_WIDTH - BUBBLE_SIZE - 20, y: 60 }
// Bottom-left: { x: 20, y: SCREEN_HEIGHT - BUBBLE_SIZE - 90 }
```

### 3. Thay đổi boundaries

```typescript
// AIAssistantBubble.tsx - onPanResponderRelease
// Điều chỉnh vùng di chuyển
if (newY < 60) newY = 60; // Top boundary - tăng/giảm số này
if (newY > SCREEN_HEIGHT - BUBBLE_SIZE - 90) {
  newY = SCREEN_HEIGHT - BUBBLE_SIZE - 90; // Bottom boundary
}
```

### 4. Disable snap to edge

```typescript
// Nếu muốn bubble dừng ở bất kỳ đâu (không snap)
// Comment out phần snap logic:
// const screenCenter = SCREEN_WIDTH / 2;
// const newX = finalX < screenCenter ? 20 : SCREEN_WIDTH - BUBBLE_SIZE - 20;

// Và thay bằng:
const newX = finalX; // Keep current position
```

### 5. Thay đổi màu sắc bubble:
```typescript
// AIAssistantBubble.tsx
backgroundColor: '#34d399', // emerald-400 (current - nhạt hơn banner)
shadowColor: '#10b981', // emerald-500 (màu shadow match với theme)

// Các options khác:
// '#10b981' - emerald-500 (giống banner chính xác)
// '#6ee7b7' - emerald-300 (nhạt hơn nữa)
// '#f59e0b' - amber-500
// '#6366f1' - indigo-500 (old color)
```

#### Màu tin nhắn:
```typescript
// AIAssistantChat.tsx
userBubble: {
  backgroundColor: '#3b82f6', // Blue
}
aiBubble: {
  backgroundColor: 'white',
}
```

### 5. Tích hợp Real Business Data

Thay vì mock data, connect với real API:

```typescript
const businessContext: BusinessContext = useMemo(() => {
  // TODO: Replace với API calls
  const { data: products } = useProducts();
  const { data: orders } = useOrders();
  
  return {
    totalProducts: products.length,
    totalRevenue: calculateRevenue(orders),
    // ...
  };
}, [products, orders]);
```

## Troubleshooting

### 1. API Key không hoạt động

**Triệu chứng**: AI luôn trả về mock responses

**Giải pháp**:
```bash
# Check .env file
cat .env | grep GEMINI

# Restart Expo
npx expo start --clear

# Rebuild app
npx expo prebuild --clean
```

### 1. Bubble bị che bởi Tab Bar hoặc các nút khác

**Triệu chứng**: Không nhấn được bubble, bị trùng với nút Add

**Giải pháp**: 
- ✅ **Kéo thả bubble** sang vị trí khác trên màn hình
- Bubble tự động snap to edge (trái hoặc phải)
- Default position có thể tùy chỉnh trong code:
```typescript
// AIAssistantBubble.tsx
const pan = useRef(new Animated.ValueXY({ 
  x: SCREEN_WIDTH - BUBBLE_SIZE - 20,  // Change X position
  y: SCREEN_HEIGHT - BUBBLE_SIZE - 90  // Change Y position
})).current;
```

### 3. Chat không tự động scroll

**Triệu chứng**: Phải scroll thủ công để xem tin nhắn mới

**Giải pháp**: Đã implement trong `useEffect`:
```typescript
useEffect(() => {
  if (messages.length > 0 && flatListRef.current) {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }
}, [messages]);
```

### 4. Keyboard che input trên Android

**Triệu chứng**: Gõ text bị che bởi keyboard

**Giải pháp**: Đã có `KeyboardAvoidingView` với platform-specific behavior:
```typescript
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
>
```

### 5. Conversation context bị mất

**Triệu chứng**: AI không nhớ câu hỏi trước

**Giải pháp**: Service đã lưu last 5 messages:
```typescript
private buildConversationContext(): string {
  const recentMessages = this.conversationHistory.slice(-5);
  // ... format messages
}
```

## Best Practices

### 1. System Prompt Engineering

- **Specific**: Rõ ràng về vai trò và nhiệm vụ
- **Contextual**: Include business metrics trong prompt
- **Constraints**: Giới hạn response length và format
- **Examples**: Cung cấp ví dụ response mẫu

### 2. Error Handling

```typescript
try {
  const response = await aiAssistantService.sendMessage(text, context);
  setMessages(aiAssistantService.getHistory());
} catch (error) {
  // Show user-friendly error message
  const errorMessage: AIMessage = {
    id: Date.now().toString(),
    role: 'assistant',
    content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
    timestamp: new Date(),
  };
  setMessages(prev => [...prev, errorMessage]);
}
```

### 3. Performance Optimization

- **useMemo** cho business context calculation
- **Limit conversation history** to last 5 messages
- **Lazy load** messages với FlatList
- **Debounce** typing indicator

### 4. Privacy & Security

- ⚠️ **KHÔNG gửi sensitive data** (passwords, payment info) trong chat
- **Validate** business context trước khi gửi
- **Sanitize** user input để tránh injection
- **Log** conversations cho debugging (optional)

## Future Enhancements

### Phase 2 Features:

1. **Voice Input**
   - Speech-to-text với expo-speech
   - Voice commands cho quick actions

2. **Quick Actions**
   - "Tạo combo mới"
   - "Xem báo cáo doanh thu"
   - "Kiểm tra sản phẩm sắp hết"
   - Navigation shortcuts

3. **Rich Formatting**
   - Markdown support trong messages
   - Tables cho data analysis
   - Charts/graphs integration

4. **Personalization**
   - Learn seller's preferences
   - Custom suggested questions based on usage
   - AI remembers seller's business patterns

5. **Proactive Insights**
   - Push notifications với AI insights
   - "Sản phẩm X đang bán chậm, gợi ý giảm giá"
   - "Doanh thu tuần này tăng 20%, đây là lý do..."

6. **Multi-language Support**
   - English
   - Chinese
   - Auto-detect language

7. **Integration**
   - Connect với real-time analytics
   - Sync với external marketing tools
   - Export chat history to PDF

## API Reference

### aiAssistantService

#### `sendMessage(userMessage: string, context?: BusinessContext): Promise<string>`
Gửi tin nhắn tới AI và nhận response.

**Parameters:**
- `userMessage`: Câu hỏi của user
- `context` (optional): Business metrics cho context-aware response

**Returns:** Promise<string> - AI response text

**Throws:** Error nếu API call fails

---

#### `getHistory(): AIMessage[]`
Lấy toàn bộ lịch sử conversation.

**Returns:** Array of AIMessage objects

---

#### `clearHistory(): void`
Xóa toàn bộ lịch sử conversation.

---

#### `getSuggestedQuestions(): string[]`
Lấy danh sách câu hỏi gợi ý.

**Returns:** Array of 6 suggested question strings

---

## Conclusion

AI Assistant là tính năng mạnh mẽ giúp sellers:
- 📊 Phân tích business nhanh chóng
- 💡 Nhận gợi ý chiến lược thông minh
- ⚡ Tiết kiệm thời gian ra quyết định
- 🎯 Tập trung vào growth

Với Gemini API integration + offline mock mode, feature hoạt động mượt mà trong mọi điều kiện.

Happy selling! 🚀
