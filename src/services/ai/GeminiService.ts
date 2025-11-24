/**
 * Gemini AI Service - Product Description Generation
 * Uses Google Gemini API for AI-powered content generation
 */

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
  private static instance: GeminiService;

  private constructor() {}

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * Generate product description using AI
   * @param productName - Tên sản phẩm
   * @param category - Danh mục sản phẩm
   * @returns Mô tả sản phẩm được AI tạo
   */
  async generateProductDescription(productName: string, category: string): Promise<string> {
    if (!GEMINI_API_KEY) {
      console.warn('[GeminiService] API key not configured, using fallback description');
      return `Mô tả sản phẩm ${productName} thuộc danh mục ${category}. Sản phẩm chất lượng cao, được nhiều khách hàng tin dùng.`;
    }

    try {
      console.log(`[GeminiService] Generating description for: ${productName} (${category})`);
      
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

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const description = data.candidates[0].content.parts[0].text;
        console.log('[GeminiService] Description generated successfully');
        return description;
      }

      throw new Error('No response from Gemini');
    } catch (error) {
      console.error('[GeminiService] Error:', error);
      return `Mô tả sản phẩm ${productName} thuộc danh mục ${category}. Sản phẩm chất lượng cao, được nhiều khách hàng tin dùng.`;
    }
  }

  /**
   * Generate product name suggestions based on keyword
   * @param keyword - Từ khóa tìm kiếm
   * @returns Danh sách gợi ý tên sản phẩm
   */
  async generateProductSuggestions(keyword: string): Promise<string[]> {
    // TODO: Implement with actual Gemini API call
    console.log(`[GeminiService] Generating suggestions for: ${keyword}`);
    return [
      `${keyword} cao cấp`,
      `${keyword} giá rẻ`,
      `${keyword} chính hãng`,
    ];
  }
}

export default GeminiService.getInstance();
