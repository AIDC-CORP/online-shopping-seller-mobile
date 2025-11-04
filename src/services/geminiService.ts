// Gemini AI Service for product description generation

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

class GeminiService {
  async generateProductDescription(productName: string, category: string): Promise<string> {
    if (!GEMINI_API_KEY) {
      return `Mô tả sản phẩm ${productName} thuộc danh mục ${category}. Sản phẩm chất lượng cao, được nhiều khách hàng tin dùng.`;
    }

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Viết một mô tả ngắn gọn, hấp dẫn cho sản phẩm "${productName}" thuộc danh mục "${category}" cho một cửa hàng online. Mô tả nên khoảng 2-3 câu, tập trung vào lợi ích và đặc điểm nổi bật.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
          },
        }),
      });

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      }

      throw new Error('No response from Gemini');
    } catch (error) {
      console.error('Gemini API error:', error);
      return `Mô tả sản phẩm ${productName} thuộc danh mục ${category}. Sản phẩm chất lượng cao, được nhiều khách hàng tin dùng.`;
    }
  }

  async generateProductSuggestions(keyword: string): Promise<string[]> {
    // Mock implementation - can be enhanced with actual Gemini API
    return [
      `${keyword} cao cấp`,
      `${keyword} giá rẻ`,
      `${keyword} chính hãng`,
    ];
  }
}

export default new GeminiService();
