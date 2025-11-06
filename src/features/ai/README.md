# AI Features

Tất cả AI services sử dụng Google Gemini API được tập trung tại đây.

## Services

### 1. aiAssistantService.ts

**Business Q&A Assistant** - Trợ lý AI cho seller

- Chat với AI về business insights
- Phân tích doanh thu, sản phẩm, đơn hàng
- Tư vấn chiến lược marketing, pricing
- Conversation history (last 5 messages)
- Mock responses khi offline

**Usage:**

```typescript
import aiAssistantService from "@/src/features/ai/aiAssistantService";

const response = await aiAssistantService.sendMessage(
  "Phân tích doanh thu của tôi",
  businessContext
);
```

### 2. productDescriptionService.ts

**Product Description Generator** - Tạo mô tả sản phẩm tự động

- Generate product descriptions
- Generate SEO-friendly titles
- Suggest product names
- Fallback to mock data khi offline

**Usage:**

```typescript
import productDescriptionService from "@/src/features/ai/productDescriptionService";

// Generate description
const desc = await productDescriptionService.generateProductDescription(
  "iPhone 15 Pro",
  "Điện thoại"
);

// Generate SEO title
const title = await productDescriptionService.generateSEOTitle(
  "iPhone 15 Pro",
  "Điện thoại"
);

// Get suggestions
const suggestions = await productDescriptionService.generateProductSuggestions(
  "smartphone"
);
```

## Configuration

Cả 2 services đều cần **Gemini API Key**:

```bash
# .env
EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

Get API key: https://makersuite.google.com/app/apikey

## Offline Support

Tất cả services đều có fallback responses khi:

- Không có API key
- Network error
- API rate limit

## Export

```typescript
// Import từ index
import {
  aiAssistantService,
  productDescriptionService,
  AIMessage,
  BusinessContext,
} from "@/src/features/ai";
```

## Migration Note

✅ **Di chuyển từ `src/services/`** (Nov 2025)

- Old: `src/services/geminiService.ts`
- New: `src/features/ai/productDescriptionService.ts`
- Enhanced với thêm methods và better structure
