// Gemini AI Service for product description generation
// Part of AI features - generates product descriptions using Gemini API

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

class ProductDescriptionService {
  /**
   * Generate product description using Gemini AI
   * Falls back to mock description if API key is not available
   */
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

  /**
   * Generate product name suggestions based on keyword
   * Uses mock implementation - can be enhanced with Gemini API
   */
  async generateProductSuggestions(keyword: string): Promise<string[]> {
    if (!GEMINI_API_KEY) {
      return [
        `${keyword} cao cấp`,
        `${keyword} giá rẻ`,
        `${keyword} chính hãng`,
      ];
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
              text: `Đề xuất 5 tên sản phẩm liên quan đến "${keyword}" cho một cửa hàng online. Chỉ trả về danh sách tên, mỗi tên một dòng.`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 100,
          },
        }),
      });

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const text = data.candidates[0].content.parts[0].text;
        return text.split('\n').filter(line => line.trim()).slice(0, 5);
      }

      throw new Error('No response from Gemini');
    } catch (error) {
      console.error('Gemini API error:', error);
      return [
        `${keyword} cao cấp`,
        `${keyword} giá rẻ`,
        `${keyword} chính hãng`,
      ];
    }
  }

  /**
   * Generate SEO-friendly product title
   */
  async generateSEOTitle(productName: string, category: string): Promise<string> {
    if (!GEMINI_API_KEY) {
      return `${productName} - ${category} Chất Lượng Cao | Giá Tốt`;
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
              text: `Tạo tiêu đề SEO cho sản phẩm "${productName}" thuộc danh mục "${category}". Tiêu đề nên ngắn gọn, hấp dẫn và tối ưu cho tìm kiếm.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 80,
          },
        }),
      });

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text.trim();
      }

      throw new Error('No response from Gemini');
    } catch (error) {
      console.error('Gemini API error:', error);
      return `${productName} - ${category} Chất Lượng Cao | Giá Tốt`;
    }
  }
}

export default new ProductDescriptionService();
